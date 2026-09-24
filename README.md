# dw-playground-pro

A self-hosted DataWeave 2.0 playground built on Mule 4. Unlike the official
[DataWeave Playground](https://dataweave.mulesoft.com/learn/dataweave), this one:

- **Handles large payloads** — no browser-side size cap; your data stays local
- **Supports named variables** — send multiple named inputs alongside `payload`
- **Works offline / air-gapped** — the CodeMirror editor is bundled; zero CDN calls
- **Self-contained Docker image** — build once, run or share anywhere

---

## Run options

### Option 1 — Anypoint Studio (no Docker needed)

1. **File → Import → Anypoint Studio project from File System**
2. Select this folder
3. Right-click the project → **Run As → Mule Application**
4. Open **http://localhost:8081**

Studio bundles the EE runtime — no separate download needed.

---

### Option 2 — Mule Runtime Manager (CloudHub / RTF / hybrid)

```bash
mvn clean package
```

Upload `target/dw-playground-pro-1.0.0-mule-application.jar` to Runtime
Manager as a new application and configure the HTTP port to match your environment.

---

### Option 3 — Docker (self-contained image)

#### Prerequisites

| Requirement | Notes |
|-------------|-------|
| Docker | Docker Desktop (Windows/Mac) or Docker Engine (Linux) |
| Mule Runtime (EE or CE) | Must be supplied by you — see below |
| Java 17 + Maven | For building the jar; not needed inside the container |

#### Step 1 — Obtain the Mule Runtime

Download the **Mule Standalone Runtime** from [mulesoft.com/download](https://www.mulesoft.com/lp/dl/mule-esb-enterprise). (Developed on v4.12.2)
No license file is required for local use — the runtime starts and runs transforms
without one.

Extract the archive so that `mule-runtime/bin/mule` exists — the runtime root
goes directly into `mule-runtime/`, not into a versioned subdirectory:

```
mule-runtime/
  bin/mule    ← must be here
  lib/
  conf/
  ...
```

#### Step 2 — License file

Leave `license/` empty — no license file is needed for local use.

#### Step 3 — Build

**Linux / Mac**
```bash
chmod +x build.sh
./build.sh
```
If needed install jdk & maven
```bash
sudo apt update
sudo apt install -y openjdk-17-jdk maven
```

**Windows (PowerShell)**
```powershell
.\build.ps1
```

The script: validates the runtime → `mvn clean package` → copies jar to `apps/`
→ `docker build -t dw-playground-pro .`

#### Step 4 — Run

```bash
docker-compose up -d
```

Open **http://localhost:8091**.

To stop:
```bash
docker-compose down
```

---

### Option 4 — Expose to the web (Cloudflare Tunnel)

If you want to share your running playground with someone outside your network
without opening firewall ports, use the included `docker-compose.cloudflared.yml`
overlay. It adds a `cloudflared` sidecar that creates a public HTTPS tunnel to
the playground on port 8091.

#### Prerequisites

- The playground container must already be running (`docker-compose up -d`)
- Docker (same requirement as Option 3)
- A [Cloudflare account](https://dash.cloudflare.com/sign-up) — **only needed for a persistent URL**; anonymous ephemeral tunnels require no account

#### Start with the tunnel

```bash
docker-compose -f docker-compose.yml -f docker-compose.cloudflared.yml up -d
```

The `cloudflared` container waits until the playground is healthy on port 8091
before opening the tunnel, so order doesn't matter.

#### Find the tunnel URL

The auto-generated public URL is printed in the `cloudflared` container logs:

```bash
docker logs cloudflared
```

Look for a line like:

```
INF +--------------------------------------------------------------------------------------------+
INF |  Your quick Tunnel has been created! Visit it at (it may take some time to be reachable):  |
INF |  https://example-words-here.trycloudflare.com                                              |
INF +--------------------------------------------------------------------------------------------+
```

Copy that URL and share it — it proxies directly to your local playground over HTTPS.

> **Note:** Quick (ephemeral) tunnel URLs are randomly generated and change every
> time the `cloudflared` container restarts. They also expire after a period of
> inactivity.

#### Persistent URL (named tunnel)

To keep the same URL across restarts, configure a
[named Cloudflare Tunnel](https://developers.cloudflare.com/cloudflare-one/connections/connect-networks/get-started/):

1. Create a tunnel in the [Cloudflare Zero Trust dashboard](https://one.dash.cloudflare.com/) and copy its token.
2. Edit `docker-compose.cloudflared.yml` — replace the `entrypoint` block with:

```yaml
entrypoint: cloudflared tunnel --no-autoupdate run --token YOUR_TUNNEL_TOKEN
```

3. Restart the sidecar:

```bash
docker-compose -f docker-compose.yml -f docker-compose.cloudflared.yml up -d cloudflared
```

Your playground will be reachable at the hostname you configured in the dashboard,
on a URL that never changes.

#### Stop the tunnel only

```bash
docker-compose -f docker-compose.yml -f docker-compose.cloudflared.yml stop cloudflared
```

---

## Sharing the image

### Without a registry — export to a file

```bash
# Export
docker save dw-playground-pro | gzip > dw-playground-pro.tar.gz

# On another machine: import and run
docker load < dw-playground-pro.tar.gz
docker-compose up -d
```

Send the `.tar.gz` over Teams, a shared drive, or any file transfer. The file
will typically be 300–500 MB (gzipped).

### With a private registry

```bash
docker tag dw-playground-pro your-registry.com/dw-playground-pro:1.0
docker push your-registry.com/dw-playground-pro:1.0

# On another machine
docker pull your-registry.com/dw-playground-pro:1.0
docker-compose up -d
```

---

## Docker image internals

The image is trimmed down from a stock Mule runtime install in a few ways.
None of this modifies the `mule-runtime/` folder on disk — everything here
happens to a copy inside the image during `docker build`, so re-extracting a
fresh runtime archive never loses any of it.

### Why `eclipse-temurin:17-jre-jammy` as the base image

The image is built directly on `eclipse-temurin:17-jre-jammy`. A multi-stage
build that copies just the JRE onto a bare `ubuntu:22.04` base (dropping the
`curl`/`wget`/`gnupg`/`fontconfig`/`p11-kit` packages Adoptium's own build
needs to fetch/verify the JRE, but Mule never touches at runtime) was tried
and measured — it only saved ~27MB (805MB vs 778MB), which isn't worth the
extra Dockerfile complexity and an additional base image to track for
security updates.

**Why not Alpine?** Alpine uses `musl` libc instead of `glibc`. Mule's native
components (the Tanuki process wrapper, JNI libraries) are built against
`glibc` and fail to resolve their shared-library dependencies under `musl` —
this was tested and confirmed broken. Any base image swap must stay glibc-based
(Debian/Ubuntu-family); a true from-scratch/distroless image is possible in
principle but would need Mule's shell-script launcher (`bin/mule`) replaced or
a shell-including distroless variant, which hasn't been validated.

### What `.dockerignore` excludes, and why

`app.xml` only uses `http:listener` and DataWeave (`ee:transform`,
`dynamic-evaluate`) — no SOAP, OAuth, or API Manager policies. `.dockerignore`
excludes the parts of the vendor runtime this app never loads:

| Excluded | Size | Reason |
|---|---|---|
| `mule-runtime/services/mule-service-soap-*` | ~35 MB | No SOAP/WSC connector used |
| `mule-runtime/services/mule-service-oauth-ee-*` | ~3 MB | No OAuth-based connector used |
| `mule-runtime/services/api-gateway-*` | negligible | No API Manager policies applied |
| `mule-runtime/tools/agent-setup-*.jar` | ~109 MB | Anypoint Monitoring agent installer — only needed if registered to Anypoint Platform |
| `mule-runtime/logs/*`, `mule_ee.pid`, `mule_ee.status*` | small, grows over time | Stale artifacts from local test runs, never meant for the image |

Services actually required and kept: `mule-service-http-ee` (the HTTP
listener), `mule-service-weave-ee` (DataWeave), `mule-service-scheduler`
(core thread-pool service used internally by the runtime engine, not just
user-facing Scheduler components).

### Memory configuration

The vendor `wrapper.conf` defaults to a fixed 1024MB/1024MB heap with
`-XX:+AlwaysPreTouch`, which forces the *entire* 1GB to be committed at
startup regardless of load. That's a reasonable production default, but far
more than a local, single-user playground needs — it showed up as a flat
1.3GB memory footprint even when idle.

The image ships with a smaller default instead: **128MB initial / 384MB max
heap, with `AlwaysPreTouch` disabled** so heap is committed on demand rather
than all at once. Idle footprint is ~375-450MB; a large transform (tested up
to a 35MB / 300k-object payload) peaks around 750-820MB and stays there until
the container restarts — this is normal JVM behavior (thread pools, JIT code
cache, and Metaspace grown to handle the load aren't garbage-collectible, so
they aren't released back to the OS by GC tuning; only a process restart
fully resets it).

This is applied without editing `mule-runtime/conf/wrapper.conf` on disk: the
Dockerfile patches the copy inside the image so `wrapper.java.initmemory` and
`wrapper.java.maxmemory` become `%MULE_HEAP_INIT_MB%` / `%MULE_HEAP_MAX_MB%`
tokens — Mule's own Tanuki wrapper already resolves `%VARNAME%` tokens from
environment variables (it's how `%MULE_HOME%` works today), so these resolve
from the container's environment at startup.

**To change the heap size for multiple users or a production-like setting,
no rebuild needed** — just edit the `environment:` block in
`docker-compose.yml` (or pass `-e` to `docker run`) and restart:

```yaml
environment:
  MULE_HEAP_INIT_MB: "512"
  MULE_HEAP_MAX_MB: "2048"
```

To change the image's *built-in default* instead, pass `--build-arg` at
build time (`docker build --build-arg MULE_HEAP_MAX_MB=1024 ...`).

---

## How it works

### Transform API

`POST /api/transform` accepts:

```json
{
  "script": "%dw 2.0\noutput application/json\n---\npayload",
  "inputs": [
    { "name": "payload", "mimeType": "application/json", "content": "{}" },
    { "name": "myVar",   "mimeType": "text/plain",       "content": "hello" }
  ],
  "outputMimeType": "application/json"
}
```

Every `inputs` entry with `name != "payload"` becomes a DataWeave variable
accessible by name in your script. Add as many as you need — no backend changes
required.

### CodeMirror (optional)

The editor uses CodeMirror 5.65.16 (MIT), bundled locally as `editor.js` and
`editor.css` and served by the `static-assets-flow` in `app.xml`. To use plain
`<textarea>` editors instead, comment out `static-assets-flow` in
`src/main/mule/app.xml` — the UI falls back automatically.

---

## API reference

| Method | Path | Description |
|--------|------|-------------|
| `GET` | `/` | Web UI |
| `GET` | `/editor.js` | CodeMirror bundle |
| `GET` | `/editor.css` | CodeMirror styles |
| `POST` | `/api/transform` | Runs a DataWeave script; returns output as plain text or `400` on error |

---

## Folder structure

```
dw-playground-pro/
├── Dockerfile
├── docker-compose.yml
├── docker-compose.cloudflared.yml  ← optional Cloudflare Tunnel sidecar
├── build.sh / build.ps1
├── pom.xml
├── mule-artifact.json
├── src/main/mule/app.xml
├── src/main/resources/web/   (index.html, editor.js, editor.css)
├── apps/                     ← jar copied here by build script (gitignored)
├── license/                  ← place .lic here for EE (gitignored)
└── mule-runtime/             ← extract Mule runtime here (gitignored)
```
