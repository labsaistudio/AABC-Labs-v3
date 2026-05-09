# Source Packages

A workflow should deliver reviewable files, not only a final summary.

Source package manifests declare the files produced by a run. The reference
runtime writes those files under:

```text
.outcome/runs/<run-id>/source-package/
```

This makes the output inspectable by a user or reviewer.

Workflow packs keep public-safe source files under their own `source/`
directories. During a run, each declared `sourcePath` is copied into the output
source package. Missing source content fails validation or execution; the
runtime does not create placeholder files.

Example:

```json
{
  "path": "program/authority-plan.ts",
  "kind": "source",
  "sourcePath": "source/program/authority-plan.ts"
}
```
