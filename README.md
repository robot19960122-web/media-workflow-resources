# Media workflow review resources

Four practical checklists for evaluating media-processing results before publishing them. These are brand-authored resources prepared for the products named below, with AI assistance; they are not independent reviews, benchmarks, promises of compatibility or endorsements by GitHub.

- [Music removal: compare what remains](removebackgroundmusic-review.md)
- [Transparent web video: test delivery, not only the mask](alphapublish-delivery.md)
- [Speech cleanup: compare noise and voice together](noisevanish-listening.md)
- [AI video checks: record evidence and uncertainty](aivideodetector-evidence.md)

## How to use these resources

Keep an original copy, record the operation and settings, inspect the actual output, and distinguish a limited preview from a full-result review. Use only media you have the right to process. Cloud-processing permission is separate from permission to possess or view a file.

The product summaries were checked against their public homepages on 2026-10-23. Limits and pricing change: consult the linked official website before choosing a service. These resources contain no production source, customer media, credentials or private operational data. The executable software is a JSON review-record validator and CLI based on the bookkeeping function below; no media scanner, model or sample media is distributed here.

## Recording a review

Copy the relevant worksheet into your own private project notes. Avoid publishing personal footage, private URLs, identifiers, access tokens or subject accusations. A pass/fail checkbox should refer to a specific observed behavior; unknown or untested is a valid result.

This repository is a documentation resource, not a support inbox. Product-specific support addresses appear in each guide.

## Small executable example: evidence scope and version

`review-evidence.mjs` is a pure bookkeeping example. It keeps missing observations untested, a different artifact version stale, a different review scope insufficient, and an unrecognized outcome unknown. It cannot inspect a media file, verify who made an observation or determine whether a video is authentic.

```sh
node --test test-evidence.mjs
```

Seven tests cover the bookkeeping branches. A returned `pass` means only that the supplied observation claims a pass for the requested scope and artifact version. It does not validate that claim, and timestamps or product quality are not checked by this function. Choose the observation explicitly: do not silently pick an older passing record when a newer review failed.

## Installable utility and container source

[`packages/media-review-records`](packages/media-review-records) contains the zero-dependency ESM/CLI utility, strict JSON document validation, four templates, TypeScript declarations and tests. [`docker/README.md`](docker/README.md) describes offline, non-root, read-only use. A manifest or Dockerfile alone is not proof of registry publication: published URLs/digests are added only after verification.

The [Docker Hub image](https://hub.docker.com/r/wenwell/media-review-records) is published as `0.1.0` and `latest`, with Linux AMD64 and ARM64 runtime images. Verified index digest: `sha256:7968229fbd3fecd78dd25b764ff21388c438affd194564f418c6ec6f799ef6a9`. Anonymous metadata and an anonymous ARM64 pull/run were checked on 2026-10-24 (Beijing); AMD64 runtime was tested under emulation, not native hardware. Provenance entries are not additional runnable platforms. Publication does not establish search indexing or referral performance.

The [npm package](https://www.npmjs.com/package/@robot1996/media-review-records) `@robot1996/media-review-records@0.1.0` is also public. The registry version timestamp is `2026-10-23T16:21:53.119Z` (2026-10-24 in Beijing). Anonymous metadata confirmed publisher `robot1996`, the four contextual npm-source product links and tarball SHA1 `a9201cad1cc13d07516399a9df7b588b97e0e29d`; a fresh registry install, installed CLI and ESM import passed.

```sh
npm install @robot1996/media-review-records@0.1.0
npx media-review-records --help
```
