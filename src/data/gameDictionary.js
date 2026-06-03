// ─────────────────────────────────────────────────────────
//  Game/Activity Keyword Dictionary
//  Matched case-insensitively against game name.
//  First matching entry wins.
// ─────────────────────────────────────────────────────────

const DICTIONARY = [
  // ── Outdoor / Physical ───────────────────────────────
  {
    keywords: ["badminton"],
    emoji: "🏸",
    description: "Pertandingan badminton yang menguji refleks dan ketangkasan!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["futsal", "football", "soccer", "bola sepak"],
    emoji: "⚽",
    description: "Tendang bola dan cetak gol sebanyak mungkin!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["bola tampar", "volleyball"],
    emoji: "🏐",
    description: "Pasukan mana yang terbaik dalam bola tampar?",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["bola keranjang", "basketball"],
    emoji: "🏀",
    description: "Masukkan bola ke dalam bakul untuk menang!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["bola", "ball"],
    emoji: "🏐",
    description: "Permainan bola yang seronok untuk semua!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["frisbee"],
    emoji: "🥏",
    description: "Lempar dan tangkap frisbee bersama rakan-rakan!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["tarik tali", "tug of war", "tug-of-war"],
    emoji: "🪢",
    description: "Uji kekuatan pasukan dalam pertandingan tarik tali!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["lari", "run", "sprint", "race", "lumba lari"],
    emoji: "🏃",
    description: "Berlumba lari untuk sampai ke garisan penamat!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["lompat", "jump", "hopscotch", "teng teng"],
    emoji: "🤸",
    description: "Uji ketangkasan dengan pelbagai cabaran lompatan!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["renang", "swim", "swimming"],
    emoji: "🏊",
    description: "Keseronokkan berenang bersama di kolam!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["tenis", "tennis"],
    emoji: "🎾",
    description: "Pertandingan tenis yang sengit dan menyeronokkan!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["ping pong", "pingpong", "table tennis", "ping-pong"],
    emoji: "🏓",
    description: "Tunjukkan kemahiran ping pong anda!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["bowling"],
    emoji: "🎳",
    description: "Runtuhkan semua pin dalam satu balingan!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["sorok-sorok", "sembunyi", "hide and seek", "hide & seek"],
    emoji: "🙈",
    description: "Cuba cari semua rakan yang bersembunyi!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["cari harta", "treasure hunt", "scavenger hunt"],
    emoji: "🗺️",
    description: "Cari petunjuk dan temui harta yang tersembunyi!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["kerusi muzik", "musical chair", "musical chairs"],
    emoji: "🪑",
    description: "Rebut kerusi sebelum muzik berhenti!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["tarian", "dance", "joget", "zapin", "poco", "aerobik"],
    emoji: "💃",
    description: "Tunjukkan bakat tarian anda di pentas!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["kayak", "canoe", "kayaking", "canoeing"],
    emoji: "🚣",
    description: "Dayung kayak menerusi perairan yang tenang!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["hiking", "mendaki", "trek", "trekking"],
    emoji: "🥾",
    description: "Mendaki bersama untuk menikmati pemandangan indah!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["flying fox", "zip line", "zipline", "zip-line"],
    emoji: "🧗",
    description: "Pcut di atas zip line yang mendebarkan!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["memanah", "archery", "panah"],
    emoji: "🏹",
    description: "Bidik sasaran dengan tepat menggunakan anak panah!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["mancing", "fishing", "pancing"],
    emoji: "🎣",
    description: "Cuba nasib memancing ikan di tepi sungai!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["layang", "kite", "wau"],
    emoji: "🪁",
    description: "Terbangkan layang-layang setinggi mungkin!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["bola beracun", "dodge ball", "dodgeball"],
    emoji: "🔴",
    description: "Elak bola atau kena pecat dari padang!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["galah panjang", "galah"],
    emoji: "🚩",
    description: "Pertahanan garis dan serang galah lawan!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["congkak"],
    emoji: "🎲",
    description: "Permainan tradisional Melayu yang mengasah minda!",
    type: "outdoor",
    typeLabel: "Permainan Tradisional",
  },
  {
    keywords: ["gasing", "top spinning"],
    emoji: "🌀",
    description: "Pusing gasing sepantas yang boleh!",
    type: "outdoor",
    typeLabel: "Permainan Tradisional",
  },
  {
    keywords: ["batu seremban", "jacks", "seremban"],
    emoji: "🪨",
    description: "Tangkap batu seremban dengan kemahiran tangan!",
    type: "outdoor",
    typeLabel: "Permainan Tradisional",
  },
  {
    keywords: ["silat"],
    emoji: "🥋",
    description: "Seni bela diri tradisional Melayu yang anggun!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["yoga"],
    emoji: "🧘",
    description: "Renggangkan badan dan tenangkan minda dengan yoga!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["hula hoop", "hula-hoop", "hulahoop"],
    emoji: "⭕",
    description: "Pusingkan hula hoop sepanjang mungkin!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },
  {
    keywords: ["baling tin", "baling", "tin"],
    emoji: "🎯",
    description: "Runtuhkan semua tin dengan balingan tepat!",
    type: "outdoor",
    typeLabel: "Sukan Luar",
  },

  // ── Card Games ────────────────────────────────────────
  {
    keywords: ["uno"],
    emoji: "🃏",
    description: "Habiskan kad dan jangan lupa jerit UNO!",
    type: "card",
    typeLabel: "Permainan Kad",
  },
  {
    keywords: ["snap"],
    emoji: "🃏",
    description: "Tepuk kad paling cepat untuk memenangi!",
    type: "card",
    typeLabel: "Permainan Kad",
  },
  {
    keywords: ["poker"],
    emoji: "🃏",
    description: "Uji strategi dan nasib dalam permainan poker!",
    type: "card",
    typeLabel: "Permainan Kad",
  },
  {
    keywords: ["blackjack", "21"],
    emoji: "🃏",
    description: "Dapatkan 21 tanpa melebihi jumlah itu!",
    type: "card",
    typeLabel: "Permainan Kad",
  },
  {
    keywords: ["rummy", "remi"],
    emoji: "🃏",
    description: "Susun set dan jujukan kad untuk menang!",
    type: "card",
    typeLabel: "Permainan Kad",
  },
  {
    keywords: ["happy family"],
    emoji: "🃏",
    description: "Kumpulkan keluarga kad yang lengkap!",
    type: "card",
    typeLabel: "Permainan Kad",
  },
  {
    keywords: ["old maid", "kartu mati"],
    emoji: "🃏",
    description: "Jangan terpegang kad nenek tua sampai akhir!",
    type: "card",
    typeLabel: "Permainan Kad",
  },
  {
    keywords: ["war card", "perang kad"],
    emoji: "⚔️",
    description: "Perangi lawan dengan nilai kad tertinggi!",
    type: "card",
    typeLabel: "Permainan Kad",
  },
  {
    keywords: ["saidina", "sadina"],
    emoji: "🃏",
    description: "Permainan kad tempatan yang sentiasa meriah!",
    type: "card",
    typeLabel: "Permainan Kad",
  },

  // ── Board Games ───────────────────────────────────────
  {
    keywords: ["monopoly", "monopoli"],
    emoji: "🏦",
    description: "Beli hartanah dan jadilah jutawan dalam Monopoly!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["catur", "chess"],
    emoji: "♟️",
    description: "Fikir beberapa langkah ke hadapan dalam permainan catur!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["jenga"],
    emoji: "🪵",
    description: "Keluarkan blok dengan berhati-hati tanpa menjatuhkan menara!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["scrabble"],
    emoji: "🔤",
    description: "Bentuk perkataan terpanjang untuk markah tertinggi!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["ular tangga", "snake and ladder", "snake & ladder"],
    emoji: "🐍",
    description: "Naik tangga dan elak ular dalam permainan klasik ini!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["ludo"],
    emoji: "🎲",
    description: "Bawa semua pion ke rumah sebelum lawan!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["pictionary"],
    emoji: "🎨",
    description: "Lukis gambar dan biar rakan teka jawabannya!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["trivial pursuit", "trivial"],
    emoji: "🧠",
    description: "Jawab soalan am dari pelbagai kategori!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["puzzle", "jigsaw"],
    emoji: "🧩",
    description: "Lengkapkan puzzle secepat mungkin bersama pasukan!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["taboo"],
    emoji: "🤫",
    description: "Terangkan perkataan tanpa menyebut perkataan terlarang!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["charade", "charades"],
    emoji: "🎭",
    description: "Lakonkan perkataan tanpa bersuara!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["bingo"],
    emoji: "🟩",
    description: "Siapa pertama habiskan kad bingo menang!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["connect four", "connect 4"],
    emoji: "🔴",
    description: "Susun 4 cip dalam satu baris untuk menang!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["othello", "reversi"],
    emoji: "⚫",
    description: "Balikkan cip lawan dan kuasai papan!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["dam", "checkers", "draughts"],
    emoji: "🔵",
    description: "Tangkap semua cip lawan untuk menang!",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["werewolf", "mafia", "serigala"],
    emoji: "🐺",
    description: "Siapakah serigala berbulu domba di antara kita?",
    type: "board",
    typeLabel: "Permainan Papan",
  },
  {
    keywords: ["whodunit", "murder mystery", "detektif"],
    emoji: "🔍",
    description: "Selidik petunjuk dan dedahkan si pembunuh!",
    type: "board",
    typeLabel: "Permainan Papan",
  },

  // ── Quiz / Knowledge ───────────────────────────────────
  {
    keywords: ["trivia", "quiz", "kuiz", "soal jawab", "q&a"],
    emoji: "❓",
    description: "Uji pengetahuan am anda dalam pertandingan kuiz!",
    type: "board",
    typeLabel: "Kuiz",
  },
  {
    keywords: ["spelling bee", "ejaan"],
    emoji: "🅱️",
    description: "Eja perkataan dengan betul tanpa tersalah huruf!",
    type: "board",
    typeLabel: "Kuiz",
  },
  {
    keywords: ["teka-teki", "riddle", "tebak"],
    emoji: "🤔",
    description: "Fikir keras untuk jawab teka-teki yang susah!",
    type: "board",
    typeLabel: "Kuiz",
  },

  // ── Music / Entertainment ──────────────────────────────
  {
    keywords: ["karaoke"],
    emoji: "🎤",
    description: "Nyanyi lagu kegemaran anda di hadapan semua orang!",
    type: "outdoor",
    typeLabel: "Hiburan",
  },
  {
    keywords: ["nyanyi", "singing", "sing"],
    emoji: "🎵",
    description: "Tunjukkan bakat nyanyian anda kepada semua!",
    type: "outdoor",
    typeLabel: "Hiburan",
  },
  {
    keywords: ["muzik", "music", "band", "instrument", "gitar", "piano", "drum"],
    emoji: "🎸",
    description: "Persembahan muzik langsung yang menakjubkan!",
    type: "outdoor",
    typeLabel: "Hiburan",
  },
  {
    keywords: ["drama", "lakon", "theater", "theatre"],
    emoji: "🎭",
    description: "Persembahan drama yang penuh ekspresi!",
    type: "outdoor",
    typeLabel: "Hiburan",
  },
  {
    keywords: ["stand up", "comedy", "lawak"],
    emoji: "😂",
    description: "Ketawa bersama dalam persembahan lawak jenaka!",
    type: "outdoor",
    typeLabel: "Hiburan",
  },

  // ── Team / Ice-breaker ─────────────────────────────────
  {
    keywords: ["ice breaker", "icebreaker", "ice-breaker"],
    emoji: "🧊",
    description: "Kenali rakan baru dengan aktiviti pecah-ais yang seronok!",
    type: "outdoor",
    typeLabel: "Aktiviti Kumpulan",
  },
  {
    keywords: ["team building", "teambuilding"],
    emoji: "🤝",
    description: "Perkukuh semangat berpasukan bersama-sama!",
    type: "outdoor",
    typeLabel: "Aktiviti Kumpulan",
  },
  {
    keywords: ["pertandingan makan", "eating contest", "makan laju"],
    emoji: "🍽️",
    description: "Siapa paling laju habiskan makanan menang!",
    type: "outdoor",
    typeLabel: "Aktiviti Kumpulan",
  },
  {
    keywords: ["masak", "cooking", "masak-masak", "chef"],
    emoji: "👨‍🍳",
    description: "Buktikan kebolehan memasak anda dalam masa terhad!",
    type: "outdoor",
    typeLabel: "Aktiviti Kumpulan",
  },
  {
    keywords: ["potluck", "pot luck"],
    emoji: "🥘",
    description: "Kongsi hidangan lazat bersama semua tetamu!",
    type: "outdoor",
    typeLabel: "Aktiviti Kumpulan",
  },
  {
    keywords: ["selfie", "photobooth", "photo booth"],
    emoji: "🤳",
    description: "Abadikan momen indah di photo booth!",
    type: "outdoor",
    typeLabel: "Aktiviti Kumpulan",
  },
  {
    keywords: ["pertandingan foto", "photo contest", "photography"],
    emoji: "📸",
    description: "Tangkap gambar terbaik untuk memenangi pertandingan!",
    type: "outdoor",
    typeLabel: "Aktiviti Kumpulan",
  },
  {
    keywords: ["lukis", "drawing", "melukis", "paint", "art"],
    emoji: "🎨",
    description: "Ekspresikan kreativiti anda melalui lukisan!",
    type: "outdoor",
    typeLabel: "Aktiviti Kumpulan",
  },
  {
    keywords: ["origami"],
    emoji: "🦢",
    description: "Lipat kertas menjadi karya seni yang indah!",
    type: "outdoor",
    typeLabel: "Aktiviti Kumpulan",
  },
];

const FALLBACK = {
  emoji: "🎮",
  description: "Aktiviti seru yang pasti menceriakan suasana picnic!",
  type: "outdoor",
  typeLabel: "Aktiviti",
};

/**
 * Look up game metadata by keyword matching against the game name.
 * Normalizes name to lowercase; first match wins.
 * Returns fallback metadata when no keyword matches.
 */
export function lookupGameMeta(name = "") {
  const normalized = String(name).toLowerCase().trim();
  if (!normalized) return { ...FALLBACK };

  for (const entry of DICTIONARY) {
    if (entry.keywords.some((kw) => normalized.includes(kw.toLowerCase()))) {
      return {
        emoji: entry.emoji,
        description: entry.description,
        type: entry.type,
        typeLabel: entry.typeLabel,
      };
    }
  }

  return { ...FALLBACK };
}
