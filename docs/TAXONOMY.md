# Taxonomy

## Initial conceptual Master Root

```text
Documents/
├── 00_Inbox/
├── 01_Projects/
├── 02_Areas/
├── 03_Resources/
├── 04_Archive/
├── 05_Notes_DB/
├── 06_Shared/
├── 08_Duplicates/
└── 99_Transfer/
```

This is an editable starting template, not an enforced directory tree.
The numbering gap is intentional; do not add 07_ implicitly.
No directory is created merely by loading or resolving this template.

## Intended roles

00_Inbox: material awaiting understanding and review.
01_Projects: active work with defined outcomes.
02_Areas: ongoing responsibilities.
03_Resources: reusable reference material.
04_Archive: inactive or completed material.
05_Notes_DB: user notes and knowledge collections.
06_Shared: user-designated shared material.
08_Duplicates: optional duplicate-review or holding organization.
99_Transfer: temporary handoff or transfer staging.

05_Notes_DB is not the application's SQLite database location.
08_Duplicates is not OS Trash and does not authorize deletion.
06_Shared does not imply cloud synchronization.
These roles remain user-editable.

## Identity and mappings

Give each node a stable identity independent of its display name,
parent, physical path, and associated entity.
Names or hierarchy changes must not require new identities.
The concrete identifier encoding is an implementation decision.

Rules and classifiers target node identities.
Rust resolves them to validated destinations under configured roots.
Unresolved mappings produce reviewable errors, not guessed paths.

Mapping edits do not move existing files.
Directory creation and physical reorganization require separate
reviewed transaction proposals.
Mapping changes invalidate affected pending plans.

## Entities

Organizations, employers, businesses, people, and aliases are editable
records linked to taxonomy nodes.
Do not make reference-prototype entities application defaults or
hard-coded branches.

## Validation

Reject invalid names, escaping paths, cycles, and conflicting mappings.
Account for platform-specific naming and case behavior.
Keep existing user structure intact unless an explicit plan changes it.
