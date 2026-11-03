# Mute Your Part

A Chrome extension for musicians: choose your instrument and mute your part on a YouTube song, so the rest of the band keeps playing while you take over. Separation is designed to run entirely inside Chrome, with no server.

> **Status:** early scaffold. The panel and role picker work, but audio capture, separation, and playback are not built yet, so it does not change YouTube's sound.

See [docs/PLAN.md](docs/PLAN.md) for the plan.

## Try it

1. Open `chrome://extensions` and turn on **Developer mode**.
2. Click **Load unpacked** and choose the `extension` folder.
3. Open a `youtube.com/watch` page. The panel appears below the player.

## Test

```sh
npm test
```

## Layout

| Path | Purpose |
|---|---|
| `extension/manifest.json` | Chrome extension manifest (MV3) |
| `extension/src/shared/` | Logic shared by extension scripts |
| `extension/src/content/` | Panel injected into YouTube |
| `extension/models/` | Local model files, not stored in Git |
| `test/` | Unit tests |
| `docs/PLAN.md` | Product and technical plan |
