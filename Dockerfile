# God's Eye View has no published container image, so the package builds it from
# upstream's source. Upstream tags rarely (only v0.1.0 / v0.1.1 exist) but pushes
# to main most days, so the build pins a commit SHA. See UPDATING.md.
#
# Node is pinned to 24.21.0 because upstream's engines field demands
# ">=24.14.0 <25 || >=26 <27" — Node 22, used by most packages in this fleet, is
# too old to run it.
FROM node:24.21.0-bookworm-slim AS build

ARG GEV_REPO=https://github.com/bilawalsidhu/gods-eye-view.git
ARG GEV_SHA=7f70b97536d6faedd95a999796f10fd89f832e40

# puppeteer is an upstream devDependency used only by its own test tooling. Its
# postinstall would download a ~150 MB Chrome that nothing here ever runs.
ENV PUPPETEER_SKIP_DOWNLOAD=true

RUN apt-get update && DEBIAN_FRONTEND=noninteractive apt-get install -y --no-install-recommends \
    ca-certificates git && \
    apt-get clean && rm -rf /var/lib/apt/lists/* /tmp/* /var/tmp/*

WORKDIR /build
RUN git clone "${GEV_REPO}" app && \
    cd app && \
    git checkout "${GEV_SHA}" && \
    rm -rf .git

WORKDIR /build/app
# Not NODE_ENV=production: vite is a devDependency and both the image build and
# the runtime rebuild need it.
RUN npm ci --no-audit --no-fund

# A keyless baseline build, so the service has something servable on first start
# even before the build-client oneshot runs (and if that oneshot ever fails).
RUN npm run build

# Upstream tooling that is not needed to build or serve. Dropping it saves
# ~28 MB in the runtime image.
RUN rm -rf node_modules/puppeteer node_modules/puppeteer-core \
    node_modules/chromium-bidi node_modules/prettier

FROM node:24.21.0-bookworm-slim
WORKDIR /app
COPY --from=build /build/app /app

# The provider caches live at $CWD/.gev-cache; StartOS mounts the volume over
# this path, so create it to keep the mountpoint present in the image.
RUN mkdir -p /app/.gev-cache
