package main

import (
	"encoding/json"
	"fmt"
	"os"

	"en-fr-chinese-entry-mvp/internal/seedgen"
)

func main() {
	path := "internal/seedgen/data/course.json"
	if len(os.Args) > 1 {
		path = os.Args[1]
	}
	raw, err := os.ReadFile(path)
	if err != nil {
		fmt.Fprintf(os.Stderr, "contentseed: read %s: %v\n", path, err)
		os.Exit(1)
	}
	var snapshot seedgen.CourseSnapshot
	if err := json.Unmarshal(raw, &snapshot); err != nil {
		fmt.Fprintf(os.Stderr, "contentseed: parse %s: %v\n", path, err)
		os.Exit(1)
	}
	sql, err := seedgen.RenderInitialContentSeedSql(&snapshot)
	if err != nil {
		fmt.Fprintf(os.Stderr, "contentseed: render: %v\n", err)
		os.Exit(1)
	}
	fmt.Print(sql)
}
