# Local AI Direction

## Status

No AI integration during foundation work.
Do not add inference dependencies, model downloads, or AI services now.

## Principle

Use deterministic evidence first.
AI is an optional advisory fallback for unresolved semantic ambiguity.
The product must remain useful with AI disabled or unavailable.

## Conceptual tiers

Tier 0: deterministic logic; no model.
Tier 1: tiny local classification or embedding capability where useful.
Tier 2: a small local language model for genuinely ambiguous cases.

Gemma/Qwen-class models are examples, not architectural dependencies.
llama.cpp is an initial backend candidate, not a committed requirement.

## Replaceable interface

Rust owns an inference abstraction separated from taxonomy, rules,
proposals, and filesystem transactions.

Requests contain bounded evidence and valid classification candidates.
Responses contain structured suggestions, evidence references,
uncertainty, abstention, and provider/model provenance.

The provider receives no filesystem mutation authority.
Model-generated paths, commands, or instructions are not executable
operation plans. Rust validates suggested taxonomy identities.

## Runtime policy

Inference is local and explicitly enabled.
Model acquisition is a separate explicit action.
No silent downloads, cloud fallback, or document upload.
Define resource limits, cancellation, timeouts, and unavailable-provider
behavior before implementation.

Treat document content and model responses as untrusted.
Do not allow embedded instructions to override system policy.

## Evaluation

Use synthetic fixtures and compare against deterministic baselines.
Evaluate ambiguity handling, abstention, consistency, latency, memory,
and the validity of suggested destinations.
Model confidence is not an execution permission or an established
probability of correctness.
