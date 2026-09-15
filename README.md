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

Upload `target/dw-playground-pro-1.0.0-SNAPSHOT-mule-application.jar` to Runtime
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

Download the **Mule Standalone Runtime** from [mulesoft.com/download](https://www.mulesoft.com/lp/dl/mule-esb-enterprise).
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

Open **http://localhost:8081**.

To stop:
```bash
docker-compose down
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

> Do not publish the image to a public registry. See the legal notice at the top
> of this file.

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
├── build.sh / build.ps1
├── pom.xml
├── mule-artifact.json
├── src/main/mule/app.xml
├── src/main/resources/web/   (index.html, editor.js, editor.css)
├── apps/                     ← jar copied here by build script (gitignored)
├── license/                  ← place .lic here for EE (gitignored)
└── mule-runtime/             ← extract Mule runtime here (gitignored)
```
