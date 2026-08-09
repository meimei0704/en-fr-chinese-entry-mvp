package pinyincontent

import (
	_ "embed"
	"encoding/json"
	"fmt"
)

//go:embed data/pinyin_course.json
var pinyinCourseJSON []byte

// PinyinCourseJSON returns the pinyin course payload with ORIGINAL bytes
// preserved (no re-encoding, no key reordering), matching the TS
// PinyinCourseContent shape byte-for-byte.
func PinyinCourseJSON() ([]byte, error) {
	if !json.Valid(pinyinCourseJSON) {
		return nil, fmt.Errorf("embedded pinyin course is invalid JSON")
	}
	out := make([]byte, len(pinyinCourseJSON))
	copy(out, pinyinCourseJSON)
	return out, nil
}

// ModuleIDs returns the id of every top-level module, in file order. It
// returns nil when the embedded payload is malformed.
func ModuleIDs() []string {
	var course struct {
		Modules []struct {
			ID string `json:"id"`
		} `json:"modules"`
	}
	if err := json.Unmarshal(pinyinCourseJSON, &course); err != nil {
		return nil
	}
	ids := make([]string, 0, len(course.Modules))
	for _, m := range course.Modules {
		ids = append(ids, m.ID)
	}
	return ids
}
