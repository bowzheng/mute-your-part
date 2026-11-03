# Project plan

## Product

**Promise:** Mute your part on any YouTube song.

The user picks a role once: Singer, Guitarist, Bassist, Drummer, or Keyboardist. One click then mutes that part and shows practice tools for that role. Karaoke is the Singer mode.

**First audience:** guitarists and bassists practicing at home. Group karaoke comes later.

**Positioning:** lead with the player's benefit, not "vocal remover", "stem splitter", or "AI". Say "mostly removes" in detailed copy, because some of the original part can remain.

## Architecture

Everything runs in Chrome. There is no server and no yt-dlp.

| Stage | Approach |
|---|---|
| Capture | Copy the audio segments YouTube's player already loads |
| Decode | Decode segments to 44.1 kHz stereo audio |
| Separate | Run `htdemucs_6s` with ONNX Runtime Web in an offscreen worker, using WebGPU with a WebAssembly fallback |
| Store | Cache processed audio in IndexedDB |
| Play | Mix stems in an AudioWorklet that follows the video's clock |
| Fallback | Play YouTube's original audio for unprocessed sections and ads |

## Milestones

- [x] **M0: Scaffold.** Extension skeleton, role picker, and tests.
- [ ] **M1: Model test.** Measure speed, memory, and quality in Chrome on a MacBook Air.
- [ ] **M2: Quality gate.** Test about 10 songs across genres with real players. Launch only the instruments that pass.
- [ ] **M3: Audio capture.** Capture and decode a full song's audio.
- [ ] **M4: Playback.** Swap the audio in sync through play, pause, seek, buffering, speed changes, and ads.
- [ ] **M5: One-click muting.** Connect the role picker to live stem gains.
- [ ] **M6: Practice tools.** Add looping, slow-down, key change, and count-in.
- [ ] **M7: Release prep.** Handle low-memory devices, then review Chrome Web Store policy before submitting.

## Known constraints

- **Memory:** the 6-stem model needs about 1.1 GB of RAM.
- **Quality:** Demucs rates guitar as okay and warns of bleeding and artifacts on piano. One guitar stem may not separate rhythm from lead.
- **Model delivery:** the 136 MB model exceeds GitHub's 100 MiB file limit, so it stays out of normal Git. Decide between bundling at build time and downloading on first use before launch.
- **YouTube changes:** capture depends on player internals and may break.
- **Legal:** keep it playback-only with no stem export from YouTube. Review YouTube's terms and Chrome Web Store policy, and get legal advice before launch.
- **Existing code:** YouTube Vocal Remover is a useful reference, but no license was seen on its repository page, so do not copy its code without permission.

## Open decisions

- Final product name.
- Bundling the model or downloading it on first use.
- Pricing.
