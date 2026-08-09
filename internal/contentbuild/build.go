package contentbuild

import (
	"bytes"
	"encoding/json"
	"sort"

	"en-fr-chinese-entry-mvp/internal/contentstore"
)

const estimatedDailyMinutes = 10

var contentModuleTypes = []string{
	"lessonMeta", "dialogue", "sentencePatterns", "vocabulary", "practice", "reviewCards",
}

var supportedExplanationLanguages = []string{"en", "fr"}

// isJSONObject reports whether raw decodes to a JSON object (not array/null).
func isJSONObject(raw json.RawMessage) bool {
	trimmed := bytes.TrimSpace(raw)
	return len(trimmed) > 0 && trimmed[0] == '{'
}

// LessonContent mirrors the TS LessonContent field order exactly so the
// assembled JSON matches the TS output key-for-key. Module payloads stay as
// json.RawMessage and marshal back to their ORIGINAL bytes.
type LessonContent struct {
	ID               string          `json:"id"`
	Title            json.RawMessage `json:"title"`
	Scenario         json.RawMessage `json:"scenario"`
	Dialogue         json.RawMessage `json:"dialogue"`
	SentencePatterns json.RawMessage `json:"sentencePatterns"`
	Vocabulary       json.RawMessage `json:"vocabulary"`
	Practice         json.RawMessage `json:"practice"`
	ReviewCards      json.RawMessage `json:"reviewCards"`
}

// BuildLessonFromRows assembles a LessonContent. It returns nil when any of
// the six modules is missing or the lessonMeta payload is invalid (mirrors
// publicContent.ts).
func BuildLessonFromRows(rows []contentstore.PublishedModuleRow) (*LessonContent, bool) {
	byModule := make(map[string]contentstore.PublishedModuleRow, len(rows))
	for _, row := range rows {
		byModule[row.ModuleType] = row
	}
	for _, m := range contentModuleTypes {
		if _, ok := byModule[m]; !ok {
			return nil, false
		}
	}

	meta := byModule["lessonMeta"].Payload
	var metaObj struct {
		ID       string          `json:"id"`
		Title    json.RawMessage `json:"title"`
		Scenario json.RawMessage `json:"scenario"`
	}
	if err := json.Unmarshal(meta, &metaObj); err != nil {
		return nil, false
	}
	if metaObj.ID == "" || !isJSONObject(metaObj.Title) || !isJSONObject(metaObj.Scenario) {
		return nil, false
	}

	return &LessonContent{
		ID:               metaObj.ID,
		Title:            metaObj.Title,
		Scenario:         metaObj.Scenario,
		Dialogue:         json.RawMessage(byModule["dialogue"].Payload),
		SentencePatterns: json.RawMessage(byModule["sentencePatterns"].Payload),
		Vocabulary:       json.RawMessage(byModule["vocabulary"].Payload),
		Practice:         json.RawMessage(byModule["practice"].Payload),
		ReviewCards:      json.RawMessage(byModule["reviewCards"].Payload),
	}, true
}

// json.RawMessage in a map marshals back to the ORIGINAL bytes (no map
// re-encoding, no key reordering). This is the byte-fidelity guarantee.

func rowOrder(rows []contentstore.PublishedModuleRow) int {
	lowest := int(^uint(0) >> 1) // MaxInt
	for _, row := range rows {
		if row.DisplayOrder < lowest {
			lowest = row.DisplayOrder
		}
	}
	return lowest
}

func groupByLesson(rows []contentstore.PublishedModuleRow) [][]contentstore.PublishedModuleRow {
	groups := map[string][]contentstore.PublishedModuleRow{}
	for _, row := range rows {
		if !row.Enabled {
			continue
		}
		groups[row.LessonID] = append(groups[row.LessonID], row)
	}

	out := make([][]contentstore.PublishedModuleRow, 0, len(groups))
	for _, group := range groups {
		out = append(out, group)
	}
	sort.Slice(out, func(i, j int) bool {
		return rowOrder(out[i]) < rowOrder(out[j])
	})
	return out
}

func BuildCourseFromRows(rows []contentstore.PublishedModuleRow) (map[string]any, error) {
	var lessons []any
	for _, group := range groupByLesson(rows) {
		if lesson, ok := BuildLessonFromRows(group); ok {
			lessons = append(lessons, lesson)
		}
	}
	return map[string]any{
		"supportedExplanationLanguages": supportedExplanationLanguages,
		"estimatedDailyMinutes":         estimatedDailyMinutes,
		"lessons":                       lessons,
	}, nil
}
