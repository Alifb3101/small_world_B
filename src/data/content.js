/*
 * ─────────────────────────────────────────────────────────────
 *  ALL THE WORDS IN THE LITTLE WORLD LIVE IN THIS ONE FILE.
 *  It reads top to bottom in the same order she sees it.
 * ─────────────────────────────────────────────────────────────
 *
 *  HOW TO EDIT
 *  • Change anything inside quotes: 'like this'.
 *  • Keep the quotes and the comma at the end of the line.
 *  • Use ’ (curly apostrophe) freely. A plain ' inside '…' breaks
 *    the line — if you need one, wrap the text in "double quotes".
 *  • To add a line, thought or letter: copy an existing one,
 *    paste it right below, and change the words.
 *  • Save the file — the open page updates by itself.
 *
 *  LITTLE SETTINGS YOU'LL SEE
 *  • hold: 1600   → how long the line stays, in milliseconds (1000 = 1 second)
 *  • big: true    → shows the line in large text
 *  • ''           → an empty line (a pause / a gap in a letter)
 *  • titleFancy   → the part of a heading shown in soft italic
 *
 *  DON'T RENAME: the words before a colon (title:, id:, study:, …).
 *  Those are labels the site looks for. Change what comes after.
 */

/* ════════════════════════════════════════════════════════════
 *  0. THE BROWSER TAB
 * ════════════════════════════════════════════════════════════ */
export const SITE = {
  title: 'A Little World for Zainab',
  description: 'A tiny place, made for you.',
};

/* ════════════════════════════════════════════════════════════
 *  1. ARRIVAL — the very first screen
 * ════════════════════════════════════════════════════════════ */
export const ARRIVAL = {
  corner: 'a little world for zainab', // small text in the top corner
  intro: ['A tiny place…', '…made for you.'], // appear one after another
  title: 'Hey, Zainab.',
  subtitle: 'Your brain is doing too much again, huh?',
  button: '✨ Take me somewhere else',
};

/* ════════════════════════════════════════════════════════════
 *  2. OVERTHINKING — tap the thoughts away
 * ════════════════════════════════════════════════════════════ */
export const OVERTHINKING = {
  corner: 'inside your head',
  counterOne: 'thought left', // "1 thought left"
  counterMany: 'thoughts left', // "3 thoughts left"
  hint: 'tap a thought. or fling it.',

  // The big bubbles she pops.
  // size: 'sm' | 'md' | 'lg'   ·   z: how close it floats (0.5 far → 1 near)
  thoughts: [
    { text: 'What if I can’t do it?', size: 'lg', z: 0.95 },
    { text: 'I still have so much to study…', size: 'md', z: 0.7 },
    { text: 'I should’ve started earlier.', size: 'md', z: 0.85 },
    { text: 'What if everything goes wrong?', size: 'sm', z: 0.55 },
  ],

  // Faint words drifting in the background.
  echoes: [
    'Am I doing enough?',
    'deadline',
    'chapter 7??',
    'reply later',
    'tomorrow',
    'too late?',
    'focus.',
    'what if',
    'again',
    'notes',
    'everyone else is ahead',
    'sleep?',
  ],

  // Little comments after each pop (they take turns).
  quips: ['bye 👋', 'nobody invited you.', 'okay, dramatic.', 'shhh.'],

  // Once every thought is gone:
  after: [
    { text: 'See?', hold: 1000, big: true },
    { text: 'Not every thought deserves your attention.', hold: 1600, big: true },
    { text: 'Come on.', hold: 600 },
    { text: 'Let’s get out of your head for a minute.', hold: 500 },
  ],
  button: 'Okay. Take me somewhere ✨',
};

/* ════════════════════════════════════════════════════════════
 *  3. MUSIC — pick your little escape
 * ════════════════════════════════════════════════════════════ */
export const MUSIC = {
  leadIn: 'Quieter in there now. Let’s make some noise. The good kind.', // scroll line before this scene
  corner: 'escape · four little worlds',
  title: 'Pick your',
  titleFancy: 'little escape',
  hint: 'each one is a whole world. headphones help.',
  nowPlaying: 'now playing',
  paused: 'paused',
  leave: 'leave this world',
  swipeHint: 'swipe for another world',
  citySigns: ['open late', '☾ café'], // neon signs in the rainy city world
  surpriseButton: '🎲 Surprise me', // plays a random song from the four worlds + the surprise list
  next: 'okay, now something silly →',

  // The four worlds. Music files go in public/audio/ (see README).
  // Keep the ids (train, city, sky, room) — each one has its own drawn world.
  songs: [
    {
      id: 'train',
      title: 'Ilahi',
      mood: 'window seat · no destination',
      line: 'Window seat. No destination. No deadline.',
      file: 'ilahi.mp3',
    },
    {
      id: 'city',
      title: 'Iktara',
      mood: 'rain · neon · slow',
      line: 'The city can be loud. You don’t have to be.',
      file: 'iktara.mp3',
    },
    {
      id: 'sky',
      title: 'Khaabon Ke Parinday',
      mood: 'clouds · flying · free',
      line: 'Somewhere above every deadline.',
      file: 'khaabon-ke-parinday.mp3',
    },
    {
      id: 'room',
      title: 'Love You Zindagi',
      mood: 'lamp on · world off',
      line: 'Lamp on. World off. Just this.',
      file: 'love-you-zindagi.mp3',
    },
  ],

  // Extra songs that only the "Surprise me" button plays. Add as many as you like.
  // file:  the mp3 in public/audio/
  // world: which drawn world to show — 'train' | 'city' | 'sky' | 'room'
  //        (leave it out and a random one is picked)
  surprise: [
    // {
    //   title: 'Kun Faya Kun',
    //   line: 'Just breathe with this one.',
    //   file: 'kun-faya-kun.mp3',
    //   world: 'sky',
    // },
  ],
};

/* ════════════════════════════════════════════════════════════
 *  4. TOM & JERRY — a tiny cartoon
 * ════════════════════════════════════════════════════════════ */
export const CARTOON = {
  leadIn: 'Meanwhile, somewhere in a very old cartoon…',
  corner: 'a very old argument',
  title: 'He’s been chasing him since 1940.',

  // Captions under the cartoon, in the order they happen.
  captions: {
    waiting: 'wait for it…',
    jerryRuns: 'there he goes.',
    tomFails: 'every single time.',
    yourTurn: 'tap jerry. if you can.',
    missed: ['missed him.', 'too slow.', 'rude.', 'again?'], // one picked at random
    tryAgain: 'tap him.',
    truce: 'okay. truce.',
  },
  next: 'okay. something quieter →',
};

/* ════════════════════════════════════════════════════════════
 *  5. OPEN WHEN — little letters
 * ════════════════════════════════════════════════════════════ */
export const OPEN_WHEN = {
  leadIn: 'Some things are better said on paper.',
  paperNote: 'some things are better on paper.', // on the paper that folds over the screen
  corner: 'tiny emergency mail',
  title: 'Open one when',
  titleFancy: 'you need it.',
  closeButton: 'fold it back',
  next: 'okay. one more thing →',

  // seal: the symbol on the wax seal
  // tint: paper colour — 'lav' | 'gold' | 'moon' | 'peach'
  // body: each line of the letter ('' = empty line)
  // video: (optional) a clip shown on the paper — the mp4 goes in public/clips/
  letters: [
    {
      id: 'overthinking',
      label: 'When you’re overthinking',
      seal: '☁',
      tint: 'lav',
      body: [
        'Hey.',
        'You don’t have to solve your entire life tonight.',
        '',
        'Take a breath.',
        'Drink some water.',
        'Put the phone down for a minute.',
        '',
        'You are allowed to have a day where',
        'you don’t have everything figured out.',
      ],
    },
    {
      id: 'studying',
      label: 'When studying feels impossible',
      seal: '✎',
      tint: 'gold',
      body: [
        'Okay. Close the book for five minutes.',
        'Not forever. Just five.',
        '',
        'You don’t have to finish everything.',
        'You just have to do the next small thing.',
        'One page. One question. One line.',
        '',
        'Slow is still moving.',
        'And you’re smarter than your panic says you are.',
      ],
    },
    {
      id: 'sleep',
      label: 'When you can’t sleep',
      seal: '☾',
      tint: 'moon',
      body: [
        'Hi, 3am brain.',
        'We’re not doing this again.',
        '',
        'Put the phone face down after this.',
        'Breathe in for four. Hold. Out for six.',
        '',
        'Whatever is sitting on your chest right now',
        'will look smaller in the morning.',
        'It always does.',
      ],
    },
    {
      id: 'smile',
      label: 'When you need a smile',
      seal: '☺',
      tint: 'peach',
      body: [
        'Fun fact: Tom has been chasing Jerry since 1940',
        'and he still hasn’t caught him. Not once.',
        '',
        'So whatever went wrong today?',
        'You’re still doing better than Tom.',
        '',
        'Okay, now smile. I’ll wait.',
        '…there it is.',
      ],
    },
    {
      id: 'heart',
      label: 'When your heart is confusing you',
      seal: '♥',
      tint: 'lav',
      video: 'heartreel.mp4',
      body: [
        'Your brain writes whole essays.',
        'Your heart just goes: dhak-dhak.',
        '',
        'So if it’s confusing you tonight,',
        'relax. It only knows one word.',
      ],
    },
    {
      id: 'annoyed',
      label: 'When you’re annoyed',
      seal: '⚡',
      tint: 'peach',
      body: [
        'Okay. Who do we fight?',
        '',
        'Seriously, you’re allowed to be annoyed.',
        'You don’t have to be the calm one all the time.',
        '',
        'Rant. Scream into a pillow. Eat something good.',
        'Come back when you’re ready.',
        'I’m on your side. Obviously.',
      ],
    },
    {
      id: 'miss',
      label: 'When you miss me',
      seal: '✉',
      tint: 'lav',
      body: [
        'Hey. I’m right here.',
        'Maybe not in the room,',
        'but in the silly jokes, in the songs,',
        'in this whole ridiculous little website.',
        '',
        'Text me. Even if it’s just a random sticker.',
        'I’ll probably reply faster than you expect.',
      ],
    },
    {
      id: 'someone',
      label: 'When you just need someone',
      seal: '✦',
      tint: 'gold',
      body: [
        'You don’t have to explain anything.',
        'You don’t need the right words.',
        '',
        'Just send me a “hey”.',
        'That’s enough. I’ll understand.',
        '',
        'You’re not too much.',
        'You were never too much.',
      ],
    },
  ],
};

/* ════════════════════════════════════════════════════════════
 *  6. THE GAME — kill the overthinking (60 seconds)
 * ════════════════════════════════════════════════════════════ */
export const GAME = {
  leadIn: 'Okay. This next one is a little loud.',
  corner: 'sixty seconds',
  title: 'Kill the',
  titleFancy: 'overthinking.',
  startButton: 'Start the 60 second chaos',
  hint: 'tap the nonsense before it multiplies.',
  skip: 'not now, skip →', // link under the start button to move on without playing
  scoreBrain: 'OVERTHINKING', // score label for the thoughts that got away
  scoreYou: 'ZAINAB', // score label for her taps

  // Words that fly in for her to tap.
  words: ['WHAT IF…', 'I SHOULD…', 'BUT WHAT IF…', 'I’M BEHIND…', 'TOO LATE?', 'ONE MORE CHAPTER', 'WHAT IF THEY…', 'NOT ENOUGH'],

  // Pop comments (one picked at random).
  quips: ['bonk', 'gone', 'nope', 'bye', 'shh', 'next!', 'lol no', 'rude'],

  // When the time runs out:
  end: [
    { text: 'You successfully bullied your brain for 60 seconds.', hold: 1600, big: true },
    { text: 'Honestly?', hold: 900 },
    { text: 'Your brain needs a timeout.', hold: 800 },
  ],
  button: '🎧 One song?',
  next: 'or… keep going →',
};

/* ════════════════════════════════════════════════════════════
 *  7. TODAY — a very small world
 * ════════════════════════════════════════════════════════════ */
export const TODAY = {
  leadIn: 'Meanwhile, in a very small world…',
  corner: 'today in a very small world',
  title: 'It’s a', // followed by the day name, e.g. "It’s a study day."
  next: 'it’s getting late →',

  // Keep the keys (study, music, …) — each has its own little scene.
  // The site picks one by weekday: Mon study, Tue music, Wed rainy,
  // Thu sleepy, Fri chaotic, Sat & Sun lazy.
  days: {
    study: { name: 'study day', line: 'Even Tom naps between chapters. Jerry is handling the pencil situation.' },
    music: { name: 'music day', line: 'Today’s plan: headphones on, world off.' },
    rainy: { name: 'rainy day', line: 'Rain outside. Blanket inside. Perfect ratio.' },
    sleepy: { name: 'sleepy day', line: 'Forecast: heavy eyelids by eleven. Zero regrets.' },
    chaotic: { name: 'chaotic day', line: 'It’s chaos. That’s allowed. Nobody gets caught today.' },
    lazy: { name: 'lazy day', line: 'Doing nothing is also a valid activity.' },
  },
};

/* ════════════════════════════════════════════════════════════
 *  8. ONE SERIOUS THING — the glowing secret
 * ════════════════════════════════════════════════════════════ */
export const MESSAGE = {
  leadIn: 'Shh. It’s getting late.',
  glowHint: 'something’s here', // under the little glowing dot
  lines: [
    { text: 'Okay…', hold: 900 },
    { text: 'One serious thing.', hold: 1500 },
    { text: 'You don’t have to be okay every second.', hold: 1700, big: true },
    { text: 'And you definitely don’t have to figure everything out tonight.', hold: 2000, big: true },
    { text: 'But…', hold: 900 },
    { text: 'if your brain starts being annoying again…', hold: 1500 },
    { text: 'you know where to come.', hold: 800, big: true },
  ],
  next: 'okay →',
};

/* ════════════════════════════════════════════════════════════
 *  9. THE END — for now
 * ════════════════════════════════════════════════════════════ */
export const FINAL = {
  lines: [
    { text: 'You don’t have to solve everything tonight.', hold: 1900 },
    { text: 'Tomorrow can handle tomorrow.', hold: 1900 },
    { text: 'For now…', hold: 1500 },
  ],
  breathe: 'Breathe.',
  button: 'I’m okay now 🌙',
  goodnight: 'Goodnight, overthinker. 🫶',
};

/* ════════════════════════════════════════════════════════════
 *  ⚙︎  BACKUP MUSIC — no words below this line.
 *  If an mp3 is missing, each world plays a small generated tune.
 *  These numbers shape that tune. Safe to ignore.
 * ════════════════════════════════════════════════════════════ */
const BACKUP_TUNES = {
  train: {
    bpm: 92,
    chords: [
      [62, 66, 69, 74],
      [57, 61, 64, 69],
      [59, 62, 66, 71],
      [55, 59, 62, 67],
    ],
    pattern: [0, 2, 1, 3, 2, 1, 3, 2],
    lead: 'triangle',
    cutoff: 2600,
  },
  city: {
    bpm: 70,
    chords: [
      [57, 60, 64, 67],
      [53, 57, 60, 64],
      [48, 52, 55, 59],
      [55, 59, 62, 65],
    ],
    pattern: [0, null, 2, null, 1, 3, null, 2],
    lead: 'sine',
    tick: true,
    cutoff: 1700,
    decay: 1.4,
  },
  sky: {
    bpm: 66,
    chords: [
      [53, 57, 60, 64],
      [55, 59, 62, 66],
      [57, 60, 64, 67],
      [48, 52, 55, 60],
    ],
    pattern: [0, 2, 4, 5, 3, 1, 4, 2],
    lead: 'sine',
    cutoff: 3400,
    decay: 1.2,
  },
  room: {
    bpm: 60,
    chords: [
      [60, 64, 67, 71],
      [57, 60, 64, 67],
      [53, 57, 60, 64],
      [55, 59, 62, 65],
    ],
    pattern: [4, null, 5, null, 6, null, 5, 3],
    lead: 'sine',
    octave: 0,
    cutoff: 3000,
    decay: 1.6,
  },
};

export const SONGS = MUSIC.songs.map((s) => ({ ...s, world: s.id, synth: BACKUP_TUNES[s.id] }));

/** Everything "Surprise me" can pick from. */
export const PLAYLIST = [
  ...SONGS,
  ...MUSIC.surprise.map((s, i) => ({
    ...s,
    id: `surprise-${i}`,
    world: BACKUP_TUNES[s.world] ? s.world : null,
    synth: BACKUP_TUNES[s.world],
  })),
];
