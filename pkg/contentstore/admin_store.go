package contentstore

import (
	"context"
	"database/sql"
	"encoding/json"
	"time"
)

const (
	RevisionKindDraft     = "draft"
	RevisionKindPublished = "published"
)

// CurrentModuleState mirrors TS CurrentModuleState (adminTypes.ts).
type CurrentModuleState struct {
	LessonID                  string
	Slug                      string
	DisplayOrder              int
	Enabled                   bool
	ModuleType                string
	DraftRevisionID           int64
	DraftPayload              json.RawMessage
	DraftCreatedAt            string
	DraftCreatedBy            string
	DraftNote                 *string
	DraftSourceRevisionID     *int64
	PublishedRevisionID       int64
	PublishedPayload          json.RawMessage
	PublishedCreatedAt        string
	PublishedCreatedBy        string
	PublishedNote             *string
	PublishedSourceRevisionID *int64
}

// PublishedModuleHistoryEntry mirrors TS PublishedModuleHistoryEntry.
type PublishedModuleHistoryEntry struct {
	LessonID         string          `json:"lessonId"`
	ModuleType       string          `json:"moduleType"`
	RevisionID       int64           `json:"revisionId"`
	Payload          json.RawMessage `json:"payload"`
	CreatedAt        string          `json:"createdAt"`
	CreatedBy        string          `json:"createdBy"`
	Note             *string         `json:"note"`
	SourceRevisionID *int64          `json:"sourceRevisionId"`
}

// InsertModuleRevisionInput mirrors TS InsertModuleRevisionInput.
type InsertModuleRevisionInput struct {
	LessonID         string
	ModuleType       string
	Payload          json.RawMessage
	RevisionKind     string
	SourceRevisionID *int64
	CreatedBy        string
	Note             *string
}

// InsertedModuleRevision adds revisionId and createdAt.
type InsertedModuleRevision struct {
	InsertModuleRevisionInput
	RevisionID int64
	CreatedAt  string
}

// ContentModuleRevisionRow is the update-target row shape.
type ContentModuleRevisionRow = InsertedModuleRevision

// AdminStore is the interface consumed by the admin repository (TS ContentAdminStore).
type AdminStore interface {
	ListCurrentModuleStates(ctx context.Context) ([]CurrentModuleState, error)
	ListCurrentLessonModuleStates(ctx context.Context, lessonID string) ([]CurrentModuleState, error)
	GetCurrentModuleState(ctx context.Context, lessonID, moduleType string) (*CurrentModuleState, error)
	ListPublishedModuleHistory(ctx context.Context, lessonID, moduleType string) ([]PublishedModuleHistoryEntry, error)
	InsertModuleRevision(ctx context.Context, input InsertModuleRevisionInput) (InsertedModuleRevision, error)
	UpdateCurrentModuleState(ctx context.Context, row ContentModuleRevisionRow) error
	RunInTransaction(ctx context.Context, work func(store AdminStore) error) error
}

type queryer interface {
	QueryContext(ctx context.Context, query string, args ...any) (*sql.Rows, error)
	ExecContext(ctx context.Context, query string, args ...any) (sql.Result, error)
}

type AdminMysqlStore struct {
	q queryer
}

func NewAdminStore(db *sql.DB) *AdminMysqlStore { return &AdminMysqlStore{q: db} }

const currentModuleStatesSelect = `select
  l.lesson_id as lessonId,
  l.slug as slug,
  l.display_order as displayOrder,
  l.enabled as enabled,
  lm.module_type as moduleType,
  dr.revision_id as draftRevisionId,
  dr.payload as draftPayload,
  dr.created_at as draftCreatedAt,
  dr.created_by as draftCreatedBy,
  dr.note as draftNote,
  dr.source_revision_id as draftSourceRevisionId,
  pr.revision_id as publishedRevisionId,
  pr.payload as publishedPayload,
  pr.created_at as publishedCreatedAt,
  pr.created_by as publishedCreatedBy,
  pr.note as publishedNote,
  pr.source_revision_id as publishedSourceRevisionId
from lessons l
join lesson_modules lm on lm.lesson_id = l.lesson_id
join module_revisions dr
  on dr.revision_id = lm.current_draft_revision_id
  and dr.revision_kind = 'draft'
  and dr.lesson_id = lm.lesson_id
  and dr.module_type = lm.module_type
join module_revisions pr
  on pr.revision_id = lm.current_published_revision_id
  and pr.revision_kind = 'published'
  and pr.lesson_id = lm.lesson_id
  and pr.module_type = lm.module_type`

func currentModuleStatesQuery(whereClause string) string {
	return currentModuleStatesSelect + " " + whereClause + `
order by l.display_order asc, l.lesson_id asc, lm.module_type asc`
}

func (s *AdminMysqlStore) ListCurrentModuleStates(ctx context.Context) ([]CurrentModuleState, error) {
	return scanCurrentModuleStates(ctx, s.q, currentModuleStatesQuery(""))
}

func (s *AdminMysqlStore) ListCurrentLessonModuleStates(ctx context.Context, lessonID string) ([]CurrentModuleState, error) {
	return scanCurrentModuleStates(ctx, s.q, currentModuleStatesQuery("where l.lesson_id = ?"), lessonID)
}

func (s *AdminMysqlStore) GetCurrentModuleState(ctx context.Context, lessonID, moduleType string) (*CurrentModuleState, error) {
	rows, err := scanCurrentModuleStates(ctx, s.q, currentModuleStatesQuery("where l.lesson_id = ? and lm.module_type = ?"), lessonID, moduleType)
	if err != nil {
		return nil, err
	}
	if len(rows) == 0 {
		return nil, nil
	}
	return &rows[0], nil
}

func scanCurrentModuleStates(ctx context.Context, q queryer, query string, args ...any) ([]CurrentModuleState, error) {
	rows, err := q.QueryContext(ctx, query, args...)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []CurrentModuleState
	for rows.Next() {
		var row CurrentModuleState
		var draftPayload, publishedPayload sql.RawBytes
		var draftNote, publishedNote sql.NullString
		var draftSource, publishedSource sql.NullInt64
		if err := rows.Scan(
			&row.LessonID,
			&row.Slug,
			&row.DisplayOrder,
			&row.Enabled,
			&row.ModuleType,
			&row.DraftRevisionID,
			&draftPayload,
			&row.DraftCreatedAt,
			&row.DraftCreatedBy,
			&draftNote,
			&draftSource,
			&row.PublishedRevisionID,
			&publishedPayload,
			&row.PublishedCreatedAt,
			&row.PublishedCreatedBy,
			&publishedNote,
			&publishedSource,
		); err != nil {
			return nil, err
		}
		if draftPayload != nil {
			row.DraftPayload = make(json.RawMessage, len(draftPayload))
			copy(row.DraftPayload, draftPayload)
		}
		if publishedPayload != nil {
			row.PublishedPayload = make(json.RawMessage, len(publishedPayload))
			copy(row.PublishedPayload, publishedPayload)
		}
		if draftNote.Valid {
			row.DraftNote = &draftNote.String
		}
		if publishedNote.Valid {
			row.PublishedNote = &publishedNote.String
		}
		if draftSource.Valid {
			v := draftSource.Int64
			row.DraftSourceRevisionID = &v
		}
		if publishedSource.Valid {
			v := publishedSource.Int64
			row.PublishedSourceRevisionID = &v
		}
		result = append(result, row)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *AdminMysqlStore) ListPublishedModuleHistory(ctx context.Context, lessonID, moduleType string) ([]PublishedModuleHistoryEntry, error) {
	query := `select
  lesson_id as lessonId,
  module_type as moduleType,
  revision_id as revisionId,
  payload as payload,
  created_at as createdAt,
  created_by as createdBy,
  note as note,
  source_revision_id as sourceRevisionId
from module_revisions
where lesson_id = ?
  and module_type = ?
  and revision_kind = 'published'
order by created_at desc, revision_id desc`

	rows, err := s.q.QueryContext(ctx, query, lessonID, moduleType)
	if err != nil {
		return nil, err
	}
	defer rows.Close()

	var result []PublishedModuleHistoryEntry
	for rows.Next() {
		var row PublishedModuleHistoryEntry
		var payload sql.RawBytes
		var note sql.NullString
		var source sql.NullInt64
		if err := rows.Scan(
			&row.LessonID,
			&row.ModuleType,
			&row.RevisionID,
			&payload,
			&row.CreatedAt,
			&row.CreatedBy,
			&note,
			&source,
		); err != nil {
			return nil, err
		}
		if payload != nil {
			row.Payload = make(json.RawMessage, len(payload))
			copy(row.Payload, payload)
		}
		if note.Valid {
			row.Note = &note.String
		}
		if source.Valid {
			v := source.Int64
			row.SourceRevisionID = &v
		}
		result = append(result, row)
	}
	if err := rows.Err(); err != nil {
		return nil, err
	}
	return result, nil
}

func (s *AdminMysqlStore) InsertModuleRevision(ctx context.Context, input InsertModuleRevisionInput) (InsertedModuleRevision, error) {
	res, err := s.q.ExecContext(ctx, `
insert into module_revisions (
  lesson_id,
  module_type,
  payload,
  revision_kind,
  source_revision_id,
  created_by,
  note
) values (?, ?, ?, ?, ?, ?, ?)`,
		input.LessonID,
		input.ModuleType,
		string(input.Payload),
		input.RevisionKind,
		input.SourceRevisionID,
		input.CreatedBy,
		input.Note,
	)
	if err != nil {
		return InsertedModuleRevision{}, err
	}
	revisionID, err := res.LastInsertId()
	if err != nil {
		return InsertedModuleRevision{}, err
	}

	return InsertedModuleRevision{
		InsertModuleRevisionInput: input,
		RevisionID:                revisionID,
		CreatedAt:                 time.Now().UTC().Format("2006-01-02T15:04:05.000Z"),
	}, nil
}

func (s *AdminMysqlStore) UpdateCurrentModuleState(ctx context.Context, row ContentModuleRevisionRow) error {
	var query string
	if row.RevisionKind == RevisionKindDraft {
		query = `update lesson_modules
set current_draft_revision_id = ?
where lesson_id = ?
  and module_type = ?`
	} else {
		query = `update lesson_modules
set current_published_revision_id = ?
where lesson_id = ?
  and module_type = ?`
	}
	_, err := s.q.ExecContext(ctx, query, row.RevisionID, row.LessonID, row.ModuleType)
	return err
}

func (s *AdminMysqlStore) RunInTransaction(ctx context.Context, work func(store AdminStore) error) error {
	db, ok := s.q.(*sql.DB)
	if !ok {
		return work(s)
	}

	tx, err := db.BeginTx(ctx, nil)
	if err != nil {
		return err
	}

	txStore := &AdminMysqlStore{q: tx}
	if err := work(txStore); err != nil {
		_ = tx.Rollback()
		return err
	}
	return tx.Commit()
}
