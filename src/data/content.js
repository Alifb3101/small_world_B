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
  title: 'A Little World for Batul',
  description: 'A tiny place, made for you.',
};

/* ════════════════════════════════════════════════════════════
 *  1. ARRIVAL — the very first screen
 * ════════════════════════════════════════════════════════════ */
export const ARRIVAL = {
  corner: 'a little world for u batul', // small text in the top corner
  intro: ['A tiny place…', '…made for you.'], // appear one after another
  title: 'Hey, Batul.',
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
  skip: 'skip →', // small link in the top corner to move on without popping

  // The big bubbles she pops.
  // size: 'sm' | 'md' | 'lg'   ·   z: how close it floats (0.5 far → 1 near)
  thoughts: [
    { text: 'What if I can’t do it?', size: 'lg', z: 0.95 },
    { text: 'Why does everything feel so overwhelming?', size: 'sm', z: 0.6 },
    { text: 'I still have so much to do…', size: 'md', z: 0.85 },
    { text: 'Why Always Me?', size: 'sm', z: 0.55 },
    { text: 'Why does everything feel so heavy?', size: 'md', z: 0.8 },
    { text: 'Why can’t I stop thinking about it?', size: 'sm', z: 0.6 },
  ],

  // Faint words drifting in the background.
  echoes: [
    'Am I doing enough?',
    'Work deadline',
    'too late?',
    'focus.',
    'what if',
    'again',
    'Mood Board',
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
const CLOUD = 'https://pub-e1b8b115c4514a519c625b47dfe3ae13.r2.dev';

export const MUSIC = {
  leadIn: 'Quieter in there now. Let’s make some noise. The good kind.', // scroll line before this scene
  corner: 'escape · a song for every feeling',
  title: 'I know you have a beautiful playlist.',
  titleFancy: 'These are just a little different.',
  hint: 'Consider these a tiny addition.',
  nowPlaying: 'now playing',
  paused: 'paused',
  loading: 'tuning in…', // shown while a song is still arriving from the cloud
  leave: 'leave this world',
  swipeHint: 'swipe for another song',
  citySigns: ['open late', '☾ café'], // neon signs in the rainy city world
  surpriseButton: '🎲 Surprise me', // plays a random song from the row + the surprise list
  next: 'okay, now a little theory →',

  // The picker is the moods below, drawn as the round worlds in one sideways row.
  // songs stays empty so Ilahi, Iktara, Khaabon Ke Parinday and Love You Zindagi
  // are not shown. world on each mood still picks the drawing: train | city | sky | room.
  songs: [],

  // A song for every feeling — the round worlds in the sideways row, and in "Surprise me" too.
  // when:  the little label under the title
  // file:  a full URL (these live on Cloudflare R2) or an mp3 in public/audio/
  // world: which drawn world it opens — 'train' | 'city' | 'sky' | 'room'
  moodsTitle: 'a song for every feeling',
  moods: [
    {
      id: 'us',
      when: 'our friendship song',
      title: 'Friendship over everything ',
      line: 'Every inside joke. Every late reply. Every “same.” This one is ours.',
      file: `${CLOUD}/friendship_song1.mp3`,
      world: 'train',
    },
    {
      id: 'rahat',
      when: 'true rahat fateh ali world',
      title: 'Rahat’s World',
      line: 'One voice, and the whole sky goes quiet to listen.',
      file: `${CLOUD}/rahat_fatehi.mp3`,
      world: 'sky',
    },
    {
      id: 'sad',
      when: 'play when you’re sad',
      title: 'Keep Fighting, Queen',
      line: 'Not here to fix it. Just here to sit with you until it passes.',
      file: `${CLOUD}/ReelAudio-54455.mp3`,
      world: 'room',
    },
    {
      id: 'future',
      when: 'if you’re tense about the future',
      title: 'You Were Born To Fly.',
      line: 'Even a caged bird keeps singing about the sky. Yours is coming.',
      file: `${CLOUD}/parinda_ked%20pinjare%20maim.mp3`,
      world: 'sky',
    },
    {
      id: 'old',
      when: 'old beauty',
      title: 'Old beauty',
      line: 'Some songs only get more beautiful with time. Some people too.',
      file: `${CLOUD}/ReelAudio-75123.mp3`,
      world: 'city',
    },
    {
      id: 'english',
      when: 'english beauty',
      title: 'English Beauty',
      line: 'Different language. Exact same feeling.',
      file: `${CLOUD}/english.mp3`,
      world: 'city',
    },
    {
      id: 'sukoon',
      when: 'when you overthink',
      title: 'Sukoon',
      line: 'Shh. The thoughts can wait outside. Breathe with this one.',
      file: `${CLOUD}/sukoongirl.mp3`,
      world: 'room',
    },
    {
      id: 'gang',
      when: 'when you’re with your gang',
      title: 'Imagine you with your favorite people',
      line: 'Loud. Chaotic. Perfect. Volume all the way up.',
      file: `${CLOUD}/mixgang.mp3`,
      world: 'train',
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
 *  4. OCTOBER — the great october theory
 * ════════════════════════════════════════════════════════════ */
// pages: each [ … ] is one little screen. Its lines type in one by one,
// then the screen fades and the next one starts. The last one stays.
export const OCTOBER = {
  corner: 'a little thought',
  title: 'The November Theory 🍂',
  pages: [
    [{ text: 'They say November is the month of unexpected connections.', hold: 2400, big: true }],
    [
      { text: 'By November, the year has already taught us so many things.', hold: 1400 },
      { text: 'We have met different people, experienced unexpected moments, and collected memories we never planned for.', hold: 2200 },
      { text: 'But sometimes, the most interesting part is the people we never expected to meet.', hold: 2600 },
    ],
    [{ text: 'Some people enter your life without any grand entrance.', hold: 1800, big: true }],
    [
      { text: 'It might start with a simple conversation.', hold: 900 },
      { text: 'A random message.', hold: 900 },
      { text: 'A little laughter over something silly.', hold: 900 },
      { text: 'And slowly, someone who was once a stranger becomes a familiar part of your days.', hold: 2600 },
    ],
    [
      { text: 'Funny how life works, right?', hold: 1200, big: true },
      { text: 'You never really know which conversation might turn into a beautiful memory.', hold: 1800 },
      { text: 'Or which stranger might become someone you are genuinely glad to have met.', hold: 2600 },
    ],
    [
      { text: 'Not every connection needs to be rushed.', hold: 1200 },
      { text: 'Some things are better when they happen naturally.', hold: 1200 },
      { text: 'With a little patience, honesty, laughter and understanding.', hold: 2400, big: true },
    ],
    [
      { text: 'Maybe that is the beautiful thing about November.', hold: 1600 },
      { text: 'It reminds us that even when a year is almost over, life can still surprise us with someone new.', hold: 2600 },
      { text: 'And sometimes, meeting someone is a beautiful beginning in itself. 🍂✨', hold: 3000, big: true },
    ],
  ],
  next: 'okay. one more little surprise →',
};

/* ════════════════════════════════════════════════════════════
 *  TOM & JERRY — the old cartoon slide (not shown right now)
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
  // video: (optional) a clip taped on the paper.
  //        a file in public/clips/  ·  or a full https address
  // song:  (optional) plays only while this letter is open.
  //        background music waits, then comes back when it’s folded.
  letters: [
    {
      id: 'overthinking',
      label: 'When you’re overthinking',
      seal: '☁',
      tint: 'lav',
      song: `${CLOUD}/dost_forever.mp3`,
      body: [
        'Hey.',
        'You don’t have to solve your entire life today.',
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
      id: 'work-pressure',
      label: 'When work gets exhausting',
      seal: '✎',
      tint: 'gold',
      video: `${CLOUD}/video/young_age.mp4`,
      body: [
        'Hey. Take a little pause.',
        'I know work can get tiring sometimes.',
        'Especially when you are away from your family and managing everything on your own.',
        '',
        'I hope you are giving yourself enough time to rest, too.',
        'Not every day has to be perfect.',
        'Just keep doing your best, one day at a time.',
        '',
        'You have so many beautiful things ahead of you.',
        'Stay strong, keep smiling and dont forget to take care of yourself.',
        'You are doing well. ❤️'
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
      label: 'when you need smile',
      seal: '☺',
      tint: 'peach',
      video: `${CLOUD}/video/funny_shin.mp4`,
      body: [
        'Okay, serious question...', 'If Doraemon offered you just ONE gadget, what would you choose?', '', 
        'Anywhere Door? Time Machine?', 'Or maybe the Take-copter? 😂', '', 
        'Personally, I would choose the Anywhere Door.',

        'Because I am always late-latif, and honestly, this gadget would save my reputation. 😂',
        '',
        'For you, I would choose the Take-copter.',
        'Imagine you flying around, enjoying beautiful views, watching sunsets and exploring places from up above.',
        '',
        'And knowing me, I would probably arrive late even after using the Anywhere Door. 😂',
        '',
        'Doraemon really needs to invent a gadget to fix my timing!'
      ],
    },
    {
      id: 'heart',
      label: 'When your heart is confusing you',
      seal: '♥',
      tint: 'lav',
      video: 'heartreel.mp4',
      body: [
        'In real life, your heart just goes: dhak-dhak.😅',
        'So if it’s confusing you today,',
        'relax. It only knows one word.',
        '',
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
    // {
    //   id: 'miss',
    //   label: 'When you miss someone',
    //   seal: '✉',
    //   tint: 'lav',
    //   video: `${CLOUD}/video/misssomeone.mp4`,
    //   body: [
    //     'Hey. I know you miss them.',
    //     'And honestly, that’s okay.',
    //     'But don’t let missing someone',
    //     'make you forget your own worth.',
    //     '',
    //     'Your energy deserves someone',
    //     'who respects you, makes time for you,',
    //     'and chooses you just as much.',
    //     '',
    //   ],
    // },
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

  // ── THE FOLDED CARD ─────────────────────────────────────
  // A real envelope under the pile. It stays shut until the password.
  // password: the word she types. Capital letters don’t matter.
  secret: {
    password: '2386',
    whisper: 'this one stays folded',
    title: 'Special note for You',
    line: 'Hint :- Password Is You(4 Digit Numpin)',
    placeholder: 'Password',
    button: 'open',
    wrong: 'not this one.',
    label: 'Special',
    seal: '🤌🏻',
    tint: 'gold',
    secret: true,
    body: [
      'Hey. You found it.',
      'I just wanted to remind you that everyone has a past, and no one is perfect.',
      'What matters to us is how we treat each other today and the kind of future we choose to build.',
      'I dont want you to feel that you have to question everything or carrying a doubts.',
      'I believe trust takes time, and I am not expecting you to trust me overnight.',
      'I would rather earn your trust through my actions than ask for it through words.',
      'I will always try to be honest, loyal and respectful towards you, and I hope we can give each other the same.',
      'I genuinely hope we can build something beautiful, with trust, comfort and honesty at its heart.',
      'And Most Important dont forget to Smile😊'
    ],
  },
};

/* ════════════════════════════════════════════════════════════
 *  6. THE GAME — kill the overthinking (30 seconds)
 * ════════════════════════════════════════════════════════════ */
export const GAME = {
  leadIn: 'Okay. This next one is a little loud.',
  corner: 'thirty seconds',
  title: 'Kill the',
  titleFancy: 'overthinking.',
  startButton: 'Start the 30 second chaos',
  hint: 'tap the nonsense before it multiplies.',
  skip: 'not now, skip →', // link under the start button to move on without playing
  scoreBrain: 'OVERTHINKING', // score label for the thoughts that got away
  scoreYou: 'BATUL', // score label for her taps

  // Words that fly in for her to tap.
  words: ['WHAT IF…', 'I SHOULD…', 'BUT WHAT IF…', 'I"M TOO TRIED', 'TOO LATE?', 'ONE MORE MOOD BOARD', 'WHAT IF THEY…', 'NOT ENOUGH'],

  // Pop comments (one picked at random).
  quips: ['bonk', 'gone', 'nope', 'bye', 'shh', 'next!', 'lol no', 'rude'],

  // When the time runs out:
  end: [
    { text: 'You successfully bullied your brain for 30 seconds.', hold: 1600, big: true },
    { text: 'Honestly', hold: 900 },
    { text: 'Your brain needs a timeout.', hold: 800 },
  ],
  button: 'or… 🎧 One song?',
  next: 'keep going →',
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
    study: { name: 'work day', line: 'Work hard but take a break before your brain submits its resignation. 🤣' },
    music: { name: 'mood board day', line: 'Colours, textures, layouts and a hundred little ideas. Designer mode: ON!' },
    rainy: { name: 'moody day', line: 'Grey skies, cosy weather and a window worth staring out of for a while.' },
    sleepy: { name: 'sleepy day', line: 'Body: time to sleep. Mind: remember that one unfinished thing from three days ago. 😂' },
    chaotic: { name: 'chaotic day', line: 'It’s chaos. That’s allowed. Nobody gets caught today.' },
    lazy: { name: 'sunday mode', line: 'Sunday rule: no alarms, no deadlines, no responsibilities. Bas aaram karo, madam. 😂' },
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
    { text: 'And you definitely don’t have to figure everything out Today.', hold: 2000, big: true },
    { text: 'But…', hold: 900 },
    { text: 'if your brain starts being annoying again…', hold: 1500 },
    { text: 'you know where to come.', hold: 800, big: true },
  ],
  next: 'okay → ???',
};

/* ════════════════════════════════════════════════════════════
 *  9. THE END — for now
 * ════════════════════════════════════════════════════════════ */
export const FINAL = {
  lines: [
    { text: 'You don’t have to solve everything Today.', hold: 1900 },
    { text: 'Tomorrow can handle tomorrow.', hold: 1900 },
    { text: 'For now…', hold: 1500 },
  ],
  breathe: 'Breathe.',
  button: 'I’m okay now 🌙',
  goodnight: 'Hope You Liked, Batul ✌️',
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

export const MOODS = MUSIC.moods.map((s) => ({
  ...s,
  id: `mood-${s.id}`,
  mood: s.when,
  world: BACKUP_TUNES[s.world] ? s.world : 'room',
  synth: BACKUP_TUNES[s.world] || BACKUP_TUNES.room,
}));

/** Everything "Surprise me" can pick from. */
export const PLAYLIST = [
  ...SONGS,
  ...MOODS,
  ...MUSIC.surprise.map((s, i) => ({
    ...s,
    id: `surprise-${i}`,
    world: BACKUP_TUNES[s.world] ? s.world : null,
    synth: BACKUP_TUNES[s.world],
  })),
];
