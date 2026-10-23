# Media review records

A zero-dependency, offline Node 22+ CLI and ESM library for checking **user-entered JSON review records**. Generate four workflow checklists and keep a missing observation, wrong asset version or preview-only scope from silently becoming an accepted full-export review. MIT licensed; includes TypeScript declarations.

This does **not** scan audio/video, test a service, authenticate reviewers, validate dates, measure processing quality or determine whether a video is synthetic. A returned `pass` only describes what the supplied record claims. No network requests, telemetry, accounts or product API keys are used.

## Install and use

```sh
npm install @robot1996/media-review-records
npx --no-install media-review-records template music clip-v3 > review.json
npx --no-install media-review-records check review.json
```

The generated template intentionally has no observations: checking it exits **1**, not a false pass. Open `review.json`, perform the checks yourself, then add explicitly selected observations. Never place private footage, access tokens, names or private URLs in public issues or shared reports.

Available templates: `music`, `transparency`, `speech`, `authenticity`. Version is an explicit label chosen by you, not a file hash automatically verified by the tool.

## Document schema

```json
{
  "schemaVersion": 1,
  "requirements": [
    { "id": "playback", "scope": "full-export", "artifactVersion": "clip-v3" }
  ],
  "observations": [
    { "requirementId": "playback", "scope": "full-export", "artifactVersion": "clip-v3", "observed": true, "outcome": "pass" }
  ]
}
```

`workflow` is optional metadata. Requirements must contain 1–2000 unique IDs. Observations are optional, with at most one explicitly assigned observation per requirement. Unknown references, duplicate IDs, multiple observations, unknown fields and malformed values are rejected, rather than silently choosing an earlier passing observation. IDs use letters, digits, `.`, `_`, `-` (1–100 characters, first alphanumeric); scope/version text is nonempty and at most 200 characters. CLI input is limited to **1 MiB**. Reports omit input scope/version strings but retain your requirement IDs; they are not a privacy scrubber.

Statuses are evaluated in order: missing observation or `observed:false` → `untested`; wrong version → `stale`; wrong scope → `insufficient`; explicit matching `pass`/`fail` → same; missing/unknown outcome → `unknown`. Neither `unknown` nor `untested` is a pass.

CLI `check <file.json|->` emits a JSON report. Exit **0** means all supplied requirements claim matching passes, **1** means incomplete or failed, **2** means invalid command/input. Help/template creation exit 0. The command only reads your selected input and writes stdout/stderr; it does not save or transmit records. Unreadable input and invalid JSON produce a generic error without echoing the data.

## Library

```js
import { evaluateReview } from '@robot1996/media-review-records';
const report = evaluateReview(document);
```

The `outcomeFor(requirement, observation)` export retains the original low-level example semantics. Use `evaluateReview` when you need document validation, unique reference checks and aggregation.

## Workflow guides and related services

These contextual links are brand-authored, not independent recommendations. This project was created with AI assistance for the products below; installing it does not call or grant access to any paid service.

- **Music:** compare quiet speech, effects, artifacts and full-export sync. [Guide](https://github.com/robot19960122-web/media-workflow-resources/blob/main/removebackgroundmusic-review.md) · [RemoveBackgroundMusic](https://removebackgroundmusic.com/?utm_source=npm&utm_medium=referral&utm_campaign=resource_distribution_202610&utm_content=review_records). Support: support@removebackgroundmusic.com.
- **Transparency:** distinguish moving alpha, actual web playback, reduced motion and fallback behavior. [Guide](https://github.com/robot19960122-web/media-workflow-resources/blob/main/alphapublish-delivery.md) · [AlphaPublish](https://alphapublish.com/?utm_source=npm&utm_medium=referral&utm_campaign=resource_distribution_202610&utm_content=review_records). Support: support@alphapublish.com.
- **Speech:** review every speaker, quiet syllables, room tone and target-player compatibility. [Guide](https://github.com/robot19960122-web/media-workflow-resources/blob/main/noisevanish-listening.md) · [NoiseVanish](https://noisevanish.com/?utm_source=npm&utm_medium=referral&utm_campaign=resource_distribution_202610&utm_content=review_records). Support: support@noisevanish.com.
- **Evidence:** record accessible media, sampled coverage and independent sources without turning likelihood into proof. [Guide](https://github.com/robot19960122-web/media-workflow-resources/blob/main/aivideodetector-evidence.md) · [AI Video Detector](https://aivideodetector.video/?utm_source=npm&utm_medium=referral&utm_campaign=resource_distribution_202610&utm_content=review_records). Support: support@aivideodetector.video.

Consult each official website for current pricing, restrictions and data handling. This tool does not certify their results. The software package license applies to the new utility, not the production services or their branding.

[Source and issues](https://github.com/robot19960122-web/media-workflow-resources) · Run `npm test` from the package source directory. No dependencies or install-time scripts.
