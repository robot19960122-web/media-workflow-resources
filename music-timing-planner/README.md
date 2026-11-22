# Music Timing Planner

A small offline timing worksheet for video editors: calculate a music-duration gap, musical phrase length, whole phrases and the remaining seconds. No dependencies, sign-in, audio upload, analytics or API keys.

## Use it

Download `index.html` and open it in a browser, or serve this folder with `python 3 -m http.server 8080`. Enter source/target durations, known BPM, beats per bar and bars per phrase. In 4/4 at 120 BPM, four bars are 8 seconds; extending 60 seconds to 90 seconds requires 30 seconds, or 3.75 phrases. An arithmetic match is not a musical-quality guarantee. Crossfade overlap, pickups and tempo changes require listening and separate accounting.

The browser worksheet is self-contained so it also works from a downloaded file. `timing.mjs` provides the same calculation for JavaScript programs, plus `continuationEnd(45,30) === 75`. This endpoint replaces the suffix; it does not add 30 seconds to the full original source duration.

## Validate

Run `node --test timing.test.mjs`. Tests cover fractional phrases, shortening, equal durations,3/4, fractional tempo, invalid input and continuation endpoints. The tool does not detect beats, process files or generate music.

## Related workflow

Published by the AI Music Extender team with AI-assisted development. [AI Music Extender](https://aimusicextender.net/?utm_source=github&utm_medium=referral&utm_campaign=resource_guides_202611&utm_content=timing_planner_readme) offers paid instrumental AI continuation and Smart Fit rearrangement. This standalone timing calculator works without that service. Only process music you are authorized to use; listen to every edit and check current provider limits before upload.
