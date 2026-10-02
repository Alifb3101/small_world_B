# A Little World for Zainab

A mobile-first cinematic React experience — an interactive short film made for one person.

## Run

```bash
npm install
npm run dev
```

Open the local URL Vite prints (usually `http://localhost:5173`).

If the page stays blank, stop the old dev server and start it again so Vite picks up `vite.config.js`.

## Music

Drop files into `public/audio/`:

- `ilahi.mp3`
- `iktara.mp3`
- `khaabon-ke-parinday.mp3`
- `love-you-zindagi.mp3`

Until those exist, each world plays a small generative piece instead (the site checks which files exist when sound is first unlocked, so the fallback starts instantly). A song's `file` in `src/data/content.js` can also be an absolute path (`/music/x.mp3`) or a full URL.

The "a song for every feeling" list (`MUSIC.moods` in `src/data/content.js`) streams from Cloudflare R2. Only one song ever plays at a time — starting another fades the last one out (on iPhone it stops instantly, since iOS can't fade cross-origin audio).

The "🎲 Surprise me" button picks from those four, the feelings list, plus anything in `MUSIC.surprise` in `src/data/content.js` — add an entry there (and its mp3 in `public/audio/`) for each extra song.

## Heart reel

The "When your heart is confusing you" letter plays `public/clips/heart-reel.mp4`. Until that file exists, the letter shows just the text.

## Assets

Tom & Jerry PNGs live in `public/characters/`. Looping clips live in `public/clips/` (MP4, not GIF). Source terms: PNGimg (CC BY-NC 4.0) and Giphy. Check before redistributing.
