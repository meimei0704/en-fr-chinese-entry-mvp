package contentbuild

import (
	"encoding/json"
	"sort"

	"en-fr-chinese-entry-mvp/internal/contentstore"
)

const estimatedDailyMinutes = 10

var contentModuleTypes = []string{
	"lessonMeta", "dialogue", "sentencePatterns", "vocabulary", "practice", "reviewCards",
}

var supportedExplanationLanguages = []string{"en", "fr"}

func isRecord(value any) bool {
	switch value.(type) {
	case map[string]any, map[string]string:
		return true
	default:
		return false
	}
}

// BuildLessonFromRows assembles a LessonContent-like map. It returns nil when
// any of the six modules is missing or the lessonMeta payload is invalid
// (mirrors publicContent.ts).
func BuildLessonFromRows(rows []contentstore.PublishedModuleRow) (map[string]any, bool) {
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
	var metaObj map[string]any
	if err := json.Unmarshal(meta, &metaObj); err != nil {
		return nil, false
	}
	id, idOK := metaObj["id"].(string)
	title, titleOK := metaObj["title"]
	scenario, scenarioOK := metaObj["scenario"]
	if !idOK || !titleOK || !scenarioOK || !isRecord(title) || !isRecord(scenario) {
		return nil, false
	}

	return map[string]any{
		"id":               id,
		"title":            title,
		"scenario":         scenario,
		"dialogue":         json.RawMessage(byModule["dialogue"].Payload),
		"sentencePatterns": json.RawMessage(byModule["sentencePatterns"].Payload),
		"vocabulary":       json.RawMessage(byModule["vocabulary"].Payload),
		"practice":         json.RawMessage(byModule["practice"].Payload),
		"reviewCards":      json.RawMessage(byModule["reviewCards"].Payload),
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
