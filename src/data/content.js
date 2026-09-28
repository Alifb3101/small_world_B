/* All the words live here, so they're easy to edit. */

export const THOUGHTS = [
  { text: 'What if I can’t do it?', size: 'lg', z: 0.95 },
  { text: 'I still have so much to study…', size: 'md', z: 0.7 },
  { text: 'I should’ve started earlier.', size: 'md', z: 0.85 },
  { text: 'What if everything goes wrong?', size: 'sm', z: 0.55 },
];

export const ECHOES = [
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
];

export const QUIPS = ['bye 👋', 'nobody invited you.', 'okay, dramatic.', 'shhh.'];

export const SONGS = [
  {
    id: 'train',
    title: 'Ilahi',
    mood: 'window seat · no destination',
    line: 'Window seat. No destination. No deadline.',
    file: 'ilahi.mp3',
    synth: {
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
  },
  {
    id: 'city',
    title: 'Iktara',
    mood: 'rain · neon · slow',
    line: 'The city can be loud. You don’t have to be.',
    file: 'iktara.mp3',
    synth: {
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
  },
  {
    id: 'sky',
    title: 'Khaabon Ke Parinday',
    mood: 'clouds · flying · free',
    line: 'Somewhere above every deadline.',
    file: 'khaabon-ke-parinday.mp3',
    synth: {
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
  },
  {
    id: 'room',
    title: 'Love You Zindagi',
    mood: 'lamp on · world off',
    line: 'Lamp on. World off. Just this.',
    file: 'love-you-zindagi.mp3',
    synth: {
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
  },
];

export const LETTERS = [
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
];

export const GAME_WORDS = [
  'WHAT IF…',
  'I SHOULD…',
  'BUT WHAT IF…',
  'I’M BEHIND…',
  'TOO LATE?',
  'ONE MORE CHAPTER',
  'WHAT IF THEY…',
  'NOT ENOUGH',
];

export const GAME_QUIPS = ['bonk', 'gone', 'nope', 'bye', 'shh', 'next!', 'lol no', 'rude'];

export const DAYS = {
  study: {
    name: 'study day',
    line: 'Even Tom naps between chapters. Jerry is handling the pencil situation.',
  },
  music: { name: 'music day', line: 'Today’s plan: headphones on, world off.' },
  rainy: { name: 'rainy day', line: 'Rain outside. Blanket inside. Perfect ratio.' },
  sleepy: { name: 'sleepy day', line: 'Forecast: heavy eyelids by eleven. Zero regrets.' },
  chaotic: { name: 'chaotic day', line: 'It’s chaos. That’s allowed. Nobody gets caught today.' },
  lazy: { name: 'lazy day', line: 'Doing nothing is also a valid activity.' },
};

export const DAY_ORDER = ['study', 'music', 'rainy', 'sleepy', 'chaotic', 'lazy'];

export const SECRET_LINES = [
  { text: 'Okay…', hold: 900 },
  { text: 'One serious thing.', hold: 1500 },
  { text: 'You don’t have to be okay every second.', hold: 1700, big: true },
  { text: 'And you definitely don’t have to figure everything out tonight.', hold: 2000, big: true },
  { text: 'But…', hold: 900 },
  { text: 'if your brain starts being annoying again…', hold: 1500 },
  { text: 'you know where to come.', hold: 800, big: true },
];

export const FINAL_LINES = [
  { text: 'You don’t have to solve everything tonight.', hold: 1900 },
  { text: 'Tomorrow can handle tomorrow.', hold: 1900 },
  { text: 'For now…', hold: 1500 },
];
