# Resume/CL Generation - Step-by-Step (JD ↔ Profile)

This notes the flow to generate a role-tailored resume/cover-letter from JD text and stored profile data. RAG/chat is out-of-scope for this phase; focus on resume/CL generation.

## Folder layout
- `data/jd/` : JD sources and parsed JSON.
- `data/profile/` : Your profile data (basics, projects, gaps, traits).
- `templates/` : MDX templates (resume/cover-letter).
- Output: `apps/blog/documents/resumes/*.mdx`, `apps/blog/documents/cover-letters/*.mdx`.

## Step 1) Add JD
1. Paste raw JD to `data/jd/<company>-<role>.md`.
2. Parse to JSON `data/jd/<company>-<role>.json` with fields:
   - `title`, `company`, `summary`
   - `must` (array), `nice` (array), `culture` (array), `domain` (array)
   - optional `location`, `process`, `notes`

## Step 2) Maintain profile data
- Edit `data/profile/profile.json`:
  - `basics`: name/contact/links.
  - `gaps`: start/end/reason/activities/status.
  - `skills`: primary/secondary/tools.
  - `projects`: name/period/role/stack/tags/domain/achievements/links/status.
  - `traits`: collaboration/quality/ownership, etc.
  - `education`, `certs`, `languages`.

## Step 3) Match
- Compute overlap: JD `must/nice/domain` vs project `stack/tags/domain`.
- Pick top 3–4 projects; mark missing `must` items to address in text.
- Always attach relevant gap info if period overlaps.

## Step 4) Generate drafts
- Fill `templates/resume.mdx` and `templates/cover-letter.mdx` placeholders into:
  - `apps/blog/documents/resumes/<company>.mdx`
  - `apps/blog/documents/cover-letters/<company>.mdx`
- Keep placeholders like `{METRIC_TODO}`, `{LINK_TODO}` for manual fill.
- Tone: concise, JD-aligned, include gap summary (reason + activities + readiness).

## Step 5) Review
- Insert real metrics (load-time %, deploy freq, error reduction).
- Verify dates, links, sensitive info masking.

## PII/Secrets via .env
- Do not store phone/email/links in repo. Use placeholders like `{{ENV_PHONE}}`, `{{ENV_EMAIL}}`, `{{ENV_GITHUB}}` in `profile.json`.
- Keep `.env` (gitignored) with the real values; the generation script should replace `{{ENV_*}}` tokens at render time.
- Before rendering, load `.env` and substitute tokens; never commit filled values.

## TODO (later)
- CLI `scripts/generate.js` to automate parse→match→render. (added)
- Tests: snapshot rendered MDX with sample data.

## Quick CLI (current draft)
- Command: `node scripts/generate.js --jd data/jd/dunamu-fe.json --profile data/profile/profile.json --out apps/blog/documents`
- Behavior:
  - Loads `.env` (if present) and substitutes `{{ENV_*}}` tokens in profile.
  - Scores projects vs JD (must/nice/domain vs tags/stack) and picks top 4.
  - Renders draft resume/cover to `apps/blog/documents/resumes|cover-letters/<company>-<role>.mdx`.
- Placeholders: `{METRIC_TODO}` / missing envs become `{{KEY_MISSING}}`; fill manually after generation.
