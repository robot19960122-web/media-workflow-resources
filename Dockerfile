FROM node:22-alpine@sha256:fe4f6d74e20370acb04ad889077d14d0f64a9c8ea6a42bc60cddf1e844699914
LABEL org.opencontainers.image.title="Media Review Records" \
      org.opencontainers.image.description="Offline JSON review-record CLI. No media scanning, AI inference, telemetry or uploads." \
      org.opencontainers.image.source="https://github.com/robot19960122-web/media-workflow-resources" \
      org.opencontainers.image.version="0.1.0"
WORKDIR /app
COPY packages/media-review-records/cli.mjs packages/media-review-records/review.mjs packages/media-review-records/templates.mjs packages/media-review-records/LICENSE ./
USER 1000:1000
ENTRYPOINT ["node", "/app/cli.mjs"]
CMD ["--help"]
