# Product

## Purpose

File Intelligence helps users understand their files before proposing
organization changes. It is local-first and targets macOS, Windows,
and Linux.

UNDERSTAND FIRST. ORGANIZE SECOND.

## Master Root

The Master Root is the user's configurable organizational source of
truth. Documents is the initial conceptual choice, not an automatically
authorized scan location.

Scan roots and permitted mutation destinations are explicit.
Selecting a scan root does not authorize organization or deletion.
Existing organization is evidence to understand, not a defect to fix.

## User workflow

Inspect inventory and evidence.
Review classification and duplicate findings.
Review proposed destinations and names.
Preview changes through a dry run.
Approve a specific plan.
Execute through the Rust transaction engine.
Inspect verification, history, and recovery options.

## Classification principle

Prefer evidence in this order:
existing path/context → filename → extension/type → metadata →
deterministic rules → extracted content → entity detection →
local AI fallback → confidence → proposal → human review →
execution → verification → journal.

Unavailable evidence remains explicitly unavailable.
Ambiguity may remain unresolved; classification must support abstention.
Confidence never grants mutation authority.

The sequence describes the user workflow. Durable journal intent must
precede mutation; verification and outcome records follow execution.

## Scope and exclusions

Current phase: foundation.
Scanning, indexing, taxonomy, rules, proposals, execution, extraction,
and local AI are introduced through roadmap gates.

Do not introduce cloud processing, autonomous AI actions, permanent
deletion, or background organization as implicit product behavior.
Permanent deletion and unattended execution are outside the initial
implementation scope.
Specific organizations, employers, businesses, and people are data.

## Honest presentation

Distinguish observed, inferred, proposed, simulated, executed, verified,
failed, and recovery-required states.
Do not display future capabilities, mock counts, or estimated savings
as measured production results.
