# Markdown Utils Extraction Plan

## Overview
This document outlines the plan for splitting the shared Markdown utility code out of the `themed-markdown` monorepo into its own dedicated Git project. The goal is to make the utilities easier to reuse across codebases, clarify ownership boundaries, and simplify release management.

## Objectives
- Establish a standalone `markdown-utils` repository with clear documentation, testing, and versioning practices.
- Migrate existing consumers in `themed-markdown` to depend on the external package without breaking functionality.
- Preserve history where possible to keep `git blame` and prior context useful.
- Create an ongoing contribution workflow for both internal and external collaborators.

## Current State Assessment
- Markdown utility code resides under `industryMarkdown/utils` and is consumed by React components in the same repo.
- Utilities are currently published as `@a24z/markdown-utils` via the existing package pipeline.
- Automated tests run only as part of the `themed-markdown` CI pipeline.
- Release notes and documentation for the utilities are intertwined with other project materials.

## Target Repository Structure
```
markdown-utils/
├── .github/workflows/ci.yml        # linting, type checking, tests, package publish
├── docs/
│   └── getting-started.md
├── src/
│   ├── index.ts                    # public exports
│   ├── markdown/index.ts           # markdown parsing helpers
│   ├── bash/index.ts               # Bash command helpers
│   └── __tests__/                  # unit tests
├── package.json
├── tsconfig.json
├── README.md
└── LICENSE
```

## Migration Steps
1. **Prepare the repo split**
   - Audit `industryMarkdown/utils` for any React-specific logic that should remain in `themed-markdown`.
   - Identify shared types or helpers that will also need to move or be duplicated.
   - Ensure all utilities have direct test coverage.

2. **Create the new repository**
   - Initialize the `markdown-utils` Git repository with MIT license (confirm with legal/ops).
   - Copy over the utility code and relevant history using `git filter-repo` or `git subtree split`.
   - Add minimal project scaffolding: linting, testing, TypeScript configuration, and documentation.

3. **Set up CI/CD**
   - Configure GitHub Actions (or existing CI provider) to run linting, tests, and type checks.
   - Configure publishing workflow (e.g., npm publish) triggered on tagged releases.
   - Add badge(s) to README to communicate build status.

4. **Integrate with consumers**
   - Update `themed-markdown` to depend on the new repository via npm package or git tag.
   - Replace local imports with package imports (should already align if re-exported correctly).
   - Update build/test scripts to reference the external package and ensure they pass.

5. **Documentation and communication**
   - Publish migration guide describing API changes, if any.
   - Notify downstream consumers about the new repository location and versioning policy.
   - Archive or deprecate duplicated documentation in `themed-markdown`.

6. **Post-migration cleanup**
   - Remove utility code from `industryMarkdown/utils` once the external dependency is stable.
   - Add deprecation notices or compatibility shims if necessary.
   - Monitor error tracking/analytics for regressions for at least one release cycle.

## Timeline (Tentative)
- **Week 1:** Audit code, create detailed task list, and ensure full test coverage.
- **Week 2:** Run repo split tooling, set up new project scaffolding, and configure CI.
- **Week 3:** Publish first beta release and update `themed-markdown` to consume it.
- **Week 4:** Gather feedback, finalize documentation, and publish stable release.

## Risks & Mitigations
- **Breaking existing consumers:** Maintain semantic versioning and provide beta period for validation.
- **Loss of git history:** Use `git filter-repo` to preserve commit history relevant to utilities.
- **Divergent configurations:** Align TypeScript/ESLint configs between repos and document differences.
- **Operational overhead:** Automate release and CI processes to reduce manual maintenance.

## Open Questions
- Which team will own long-term maintenance of `markdown-utils`?
- Do we need to support both ESM and CommonJS distributions?
- Should we migrate additional utilities (e.g., presentation helpers) into the new repository?
- What is the deprecation policy for the in-repo version after extraction?

## Next Steps
- Confirm stakeholders and project owners.
- Approve the timeline and resource allocation.
- Start Week 1 tasks and schedule weekly check-ins to monitor progress.
