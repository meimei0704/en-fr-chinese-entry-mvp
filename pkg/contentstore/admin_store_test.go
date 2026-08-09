package contentstore

import (
	"context"
	"database/sql"
	"encoding/json"
	"errors"
	"strings"
	"testing"

	"github.com/DATA-DOG/go-sqlmock"
)

const currentStateColumns = `lessonId,slug,displayOrder,enabled,moduleType,draftRevisionId,draftPayload,draftCreatedAt,draftCreatedBy,draftNote,draftSourceRevisionId,publishedRevisionId,publishedPayload,publishedCreatedAt,publishedCreatedBy,publishedNote,publishedSourceRevisionId`

func TestAdminListCurrentLessonModuleStates(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows(strings.Split(currentStateColumns, ",")).
		AddRow(
			"self-intro", "self-intro", 1, true, "lessonMeta", int64(102),
			`{"id":"self-intro","title":{"en":"Draft","fr":"Brouillon"}}`, "2026-07-28T00:00:00.000Z", "admin-ui",
			"draft note", int64(101), int64(101),
			`{"id":"self-intro","title":{"en":"Published","fr":"Publié"}}`, "2026-07-28T00:00:00.000Z", "seed:static-content",
			nil, nil,
		)
	mock.ExpectQuery("select l\\.lesson_id as lessonId").WithArgs("self-intro").WillReturnRows(rows)

	store := NewAdminStore(db)
	result, err := store.ListCurrentLessonModuleStates(context.Background(), "self-intro")
	if err != nil {
		t.Fatalf("ListCurrentLessonModuleStates: %v", err)
	}
	if len(result) != 1 {
		t.Fatalf("len = %d, want 1", len(result))
	}
	row := result[0]
	if row.LessonID != "self-intro" || row.ModuleType != "lessonMeta" || !row.Enabled {
		t.Fatalf("row = %+v", row)
	}
	if row.DraftRevisionID != 102 || row.PublishedRevisionID != 101 {
		t.Fatalf("revision ids = %d/%d", row.DraftRevisionID, row.PublishedRevisionID)
	}
	if string(row.DraftPayload) != `{"id":"self-intro","title":{"en":"Draft","fr":"Brouillon"}}` {
		t.Fatalf("draftPayload = %s", row.DraftPayload)
	}
	if row.DraftNote == nil || *row.DraftNote != "draft note" {
		t.Fatalf("draftNote = %v", row.DraftNote)
	}
	if row.DraftSourceRevisionID == nil || *row.DraftSourceRevisionID != 101 {
		t.Fatalf("draftSourceRevisionID = %v", row.DraftSourceRevisionID)
	}
	if row.PublishedNote != nil {
		t.Fatalf("publishedNote = %v, want nil", *row.PublishedNote)
	}
	if row.PublishedSourceRevisionID != nil {
		t.Fatalf("publishedSourceRevisionID = %v, want nil", *row.PublishedSourceRevisionID)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminListCurrentModuleStates(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows(strings.Split(currentStateColumns, ",")).
		AddRow("l1", "l1", 1, true, "lessonMeta", int64(2), `{"id":"l1"}`, "t", "u", nil, nil, int64(1), `{"id":"l1"}`, "t", "u", nil, nil)
	mock.ExpectQuery("select l\\.lesson_id as lessonId").WillReturnRows(rows)

	store := NewAdminStore(db)
	result, err := store.ListCurrentModuleStates(context.Background())
	if err != nil {
		t.Fatalf("ListCurrentModuleStates: %v", err)
	}
	if len(result) != 1 || result[0].LessonID != "l1" {
		t.Fatalf("result = %+v", result)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminGetCurrentModuleState(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows(strings.Split(currentStateColumns, ",")).
		AddRow("l1", "l1", 1, true, "lessonMeta", int64(2), `{"id":"l1"}`, "t", "u", nil, nil, int64(1), `{"id":"l1"}`, "t", "u", nil, nil)
	mock.ExpectQuery("select l\\.lesson_id as lessonId").WithArgs("l1", "lessonMeta").WillReturnRows(rows)

	store := NewAdminStore(db)
	row, err := store.GetCurrentModuleState(context.Background(), "l1", "lessonMeta")
	if err != nil {
		t.Fatalf("GetCurrentModuleState: %v", err)
	}
	if row == nil || row.LessonID != "l1" {
		t.Fatalf("row = %+v", row)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminGetCurrentModuleStateEmpty(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	mock.ExpectQuery("select l\\.lesson_id as lessonId").WithArgs("l1", "lessonMeta").WillReturnRows(sqlmock.NewRows(strings.Split(currentStateColumns, ",")))

	store := NewAdminStore(db)
	row, err := store.GetCurrentModuleState(context.Background(), "l1", "lessonMeta")
	if err != nil {
		t.Fatalf("GetCurrentModuleState: %v", err)
	}
	if row != nil {
		t.Fatalf("row = %+v, want nil", row)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminListPublishedModuleHistory(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows(strings.Split("lessonId,moduleType,revisionId,payload,createdAt,createdBy,note,sourceRevisionId", ",")).
		AddRow("l1", "lessonMeta", int64(5), `{"id":"l1"}`, "t", "u", "note", int64(3))
	mock.ExpectQuery("from module_revisions").WithArgs("l1", "lessonMeta").WillReturnRows(rows)

	store := NewAdminStore(db)
	result, err := store.ListPublishedModuleHistory(context.Background(), "l1", "lessonMeta")
	if err != nil {
		t.Fatalf("ListPublishedModuleHistory: %v", err)
	}
	if len(result) != 1 || result[0].RevisionID != 5 {
		t.Fatalf("result = %+v", result)
	}
	if result[0].Note == nil || *result[0].Note != "note" {
		t.Fatalf("note = %v", result[0].Note)
	}
	if result[0].SourceRevisionID == nil || *result[0].SourceRevisionID != 3 {
		t.Fatalf("sourceRevisionID = %v", result[0].SourceRevisionID)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminInsertModuleRevision(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	payload := `{"id":"self-intro","title":{"en":"Draft","fr":"Brouillon"}}`
	note := "Save lesson meta draft"
	source := int64(101)

	mock.ExpectExec("insert into module_revisions").
		WithArgs("self-intro", "lessonMeta", payload, "draft", int64(101), "admin-ui", "Save lesson meta draft").
		WillReturnResult(sqlmock.NewResult(901, 1))

	store := NewAdminStore(db)
	inserted, err := store.InsertModuleRevision(context.Background(), InsertModuleRevisionInput{
		LessonID:         "self-intro",
		ModuleType:       "lessonMeta",
		Payload:          json.RawMessage(payload),
		RevisionKind:     RevisionKindDraft,
		SourceRevisionID: &source,
		CreatedBy:        "admin-ui",
		Note:             &note,
	})
	if err != nil {
		t.Fatalf("InsertModuleRevision: %v", err)
	}
	if inserted.RevisionID != 901 {
		t.Fatalf("revisionId = %d, want 901", inserted.RevisionID)
	}
	if inserted.CreatedAt == "" {
		t.Fatal("createdAt should be set")
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminUpdateCurrentModuleStateDraft(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	mock.ExpectExec("update lesson_modules").
		WithArgs(int64(701), "self-intro", "lessonMeta").
		WillReturnResult(sqlmock.NewResult(0, 1))

	store := NewAdminStore(db)
	err = store.UpdateCurrentModuleState(context.Background(), ContentModuleRevisionRow{
		InsertModuleRevisionInput: InsertModuleRevisionInput{
			LessonID:     "self-intro",
			ModuleType:   "lessonMeta",
			RevisionKind: RevisionKindDraft,
		},
		RevisionID: 701,
	})
	if err != nil {
		t.Fatalf("UpdateCurrentModuleState: %v", err)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminUpdateCurrentModuleStatePublished(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	mock.ExpectExec("update lesson_modules").
		WithArgs(int64(801), "self-intro", "lessonMeta").
		WillReturnResult(sqlmock.NewResult(0, 1))

	store := NewAdminStore(db)
	err = store.UpdateCurrentModuleState(context.Background(), ContentModuleRevisionRow{
		InsertModuleRevisionInput: InsertModuleRevisionInput{
			LessonID:     "self-intro",
			ModuleType:   "lessonMeta",
			RevisionKind: RevisionKindPublished,
		},
		RevisionID: 801,
	})
	if err != nil {
		t.Fatalf("UpdateCurrentModuleState: %v", err)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminRunInTransaction(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows(strings.Split(currentStateColumns, ",")).
		AddRow("l1", "l1", 1, true, "lessonMeta", int64(2), `{"id":"l1"}`, "t", "u", nil, nil, int64(1), `{"id":"l1"}`, "t", "u", nil, nil)
	mock.ExpectBegin()
	mock.ExpectQuery("select l\\.lesson_id as lessonId").WillReturnRows(rows)
	mock.ExpectCommit()

	store := NewAdminStore(db)
	var got []CurrentModuleState
	err = store.RunInTransaction(context.Background(), func(txStore AdminStore) error {
		got, err = txStore.ListCurrentModuleStates(context.Background())
		return err
	})
	if err != nil {
		t.Fatalf("RunInTransaction: %v", err)
	}
	if len(got) != 1 || got[0].LessonID != "l1" {
		t.Fatalf("transaction work result = %+v", got)
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminRunInTransactionRollback(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	rows := sqlmock.NewRows(strings.Split(currentStateColumns, ","))
	mock.ExpectBegin()
	mock.ExpectQuery("select l\\.lesson_id as lessonId").WillReturnRows(rows)
	mock.ExpectRollback()

	store := NewAdminStore(db)
	err = store.RunInTransaction(context.Background(), func(txStore AdminStore) error {
		_, err := txStore.ListCurrentModuleStates(context.Background())
		if err != nil {
			return err
		}
		return sql.ErrTxDone
	})
	if err == nil {
		t.Fatal("want error from transaction work")
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

type errResult struct{}

func (errResult) LastInsertId() (int64, error) { return 0, errors.New("no last insert id") }
func (errResult) RowsAffected() (int64, error) { return 1, nil }

func TestAdminInsertModuleRevisionExecError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	mock.ExpectExec("insert into module_revisions").WillReturnError(errors.New("insert boom"))

	store := NewAdminStore(db)
	if _, err := store.InsertModuleRevision(context.Background(), InsertModuleRevisionInput{LessonID: "l1", ModuleType: "lessonMeta"}); err == nil {
		t.Fatal("want exec error")
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminInsertModuleRevisionLastInsertError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	mock.ExpectExec("insert into module_revisions").WillReturnResult(errResult{})

	store := NewAdminStore(db)
	if _, err := store.InsertModuleRevision(context.Background(), InsertModuleRevisionInput{LessonID: "l1", ModuleType: "lessonMeta"}); err == nil {
		t.Fatal("want last insert id error")
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminGetCurrentModuleStateQueryError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	mock.ExpectQuery("select l\\.lesson_id as lessonId").WillReturnError(errors.New("query boom"))

	store := NewAdminStore(db)
	if _, err := store.GetCurrentModuleState(context.Background(), "l1", "lessonMeta"); err == nil {
		t.Fatal("want query error")
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminRunInTransactionBeginError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	mock.ExpectBegin().WillReturnError(errors.New("begin boom"))

	store := NewAdminStore(db)
	err = store.RunInTransaction(context.Background(), func(txStore AdminStore) error { return nil })
	if err == nil {
		t.Fatal("want begin error")
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

func TestAdminRunInTransactionCommitError(t *testing.T) {
	db, mock, err := sqlmock.New()
	if err != nil {
		t.Fatalf("sqlmock: %v", err)
	}
	defer db.Close()

	mock.ExpectBegin()
	mock.ExpectCommit().WillReturnError(errors.New("commit boom"))

	store := NewAdminStore(db)
	err = store.RunInTransaction(context.Background(), func(txStore AdminStore) error { return nil })
	if err == nil {
		t.Fatal("want commit error")
	}
	if err := mock.ExpectationsWereMet(); err != nil {
		t.Fatalf("unmet sqlmock expectations: %v", err)
	}
}

type nonSQLDBQueryer struct{}

func (nonSQLDBQueryer) QueryContext(context.Context, string, ...any) (*sql.Rows, error) {
	return nil, errors.New("not a database")
}

func (nonSQLDBQueryer) ExecContext(context.Context, string, ...any) (sql.Result, error) {
	return nil, errors.New("not a database")
}

func TestAdminRunInTransactionFallsBackWithoutSQLDB(t *testing.T) {
	store := &AdminMysqlStore{q: nonSQLDBQueryer{}}
	ran := false
	err := store.RunInTransaction(context.Background(), func(txStore AdminStore) error {
		ran = true
		return nil
	})
	if err != nil {
		t.Fatalf("RunInTransaction: %v", err)
	}
	if !ran {
		t.Fatal("work function was not invoked")
	}
}
