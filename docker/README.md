# Media Review Records container

Offline JSON checklist and review-record validation for music removal, transparent-video delivery, speech cleanup and cautious AI-video evidence review. This software records supplied observations; it does **not** inspect audio/video, verify a reviewer, measure media quality or determine authenticity. Brand-authored with AI assistance. The new utility code is MIT licensed; third-party base-image components retain their licenses.

## Build and use

```sh
docker build -t media-review-records:0.1.0 .
docker run --rm --read-only --network none --cap-drop ALL \
  --security-opt no-new-privileges:true media-review-records:0.1.0 --help
docker run --rm --read-only --network none --cap-drop ALL \
  --security-opt no-new-privileges:true media-review-records:0.1.0 template music clip-v3 > review.json
docker run --rm -i --read-only --network none --cap-drop ALL \
  --security-opt no-new-privileges:true media-review-records:0.1.0 check - < review.json
```

The empty template deliberately exits 1 when checked: nobody has entered actual observations yet. Edit the JSON privately after performing the reviews; see the [schema and examples](https://github.com/robot19960122-web/media-workflow-resources/tree/main/packages/media-review-records).

Other templates: `transparency`, `speech`, `authenticity`. Exit 0 means every supplied requirement claims a matching pass; exit 1 means incomplete/failed, exit 2 means invalid input. Help/template commands exit 0. Scope and artifact version must match. Duplicate observations are rejected: the tool never silently selects an older pass. It does not establish that a claim is true.

No network access, telemetry, uploads, accounts, ports, API keys or writable volumes are needed. The container runs as UID/GID 1000. Input is at most 1 MiB; output retains your requirement IDs and is not a privacy scrubber. Do not publish private filenames, URLs, credentials or personal footage in records/issues. Version labels are user-supplied, not verified media hashes. The Node base manifest is pinned, not guaranteed vulnerability-free.

## Contextual workflow resources

One real tool serves these four review workflows, not four duplicate software listings. Consult the official sites for current services, pricing and restrictions. These are affiliated links, not independent endorsements; running this container calls none of them.

- Music: compare quiet speech, important effects, artifacts and complete-export sync. [Guide](https://github.com/robot19960122-web/media-workflow-resources/blob/main/removebackgroundmusic-review.md) · [RemoveBackgroundMusic](https://removebackgroundmusic.com/?utm_source=dockerhub&utm_medium=referral&utm_campaign=resource_distribution_202610&utm_content=review_records). support@removebackgroundmusic.com.
- Transparency: review moving alpha separately from published web playback and fallback behavior. [Guide](https://github.com/robot19960122-web/media-workflow-resources/blob/main/alphapublish-delivery.md) · [AlphaPublish](https://alphapublish.com/?utm_source=dockerhub&utm_medium=referral&utm_campaign=resource_distribution_202610&utm_content=review_records). support@alphapublish.com.
- Speech: review quiet syllables, every speaker, room tone and output playback. [Guide](https://github.com/robot19960122-web/media-workflow-resources/blob/main/noisevanish-listening.md) · [NoiseVanish](https://noisevanish.com/?utm_source=dockerhub&utm_medium=referral&utm_campaign=resource_distribution_202610&utm_content=review_records). support@noisevanish.com.
- Evidence: preserve missing access, sample coverage and independent-source limitations; a completed checklist is not proof of video authenticity. [Guide](https://github.com/robot19960122-web/media-workflow-resources/blob/main/aivideodetector-evidence.md) · [AI Video Detector](https://aivideodetector.video/?utm_source=dockerhub&utm_medium=referral&utm_campaign=resource_distribution_202610&utm_content=review_records). support@aivideodetector.video.

[Public source and issues](https://github.com/robot19960122-web/media-workflow-resources). No production source, customer media or model weights are included. Registry publication and exact digest are recorded only after successful push and independent verification.
