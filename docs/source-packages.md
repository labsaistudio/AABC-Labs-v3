# Source Packages

A workflow should deliver reviewable files, not only a final summary.

Source package manifests declare the files produced by a run. The reference
runtime writes those files under:

```text
.outcome/runs/<run-id>/source-package/
```

This makes the output inspectable by a user or reviewer.
