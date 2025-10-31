/**
 * Dizionario statico di termini islamici comuni con trascrizione DIN 31635
 * Mappature: Latino → DIN 31635, Arabo → DIN 31635
 */

export interface DictionaryEntry {
  latin: string[];
  arabic: string;
  din31635: string;
  category: string;
}

export const islamicDictionary: DictionaryEntry[] = [
  {
    latin: ["hadith", "hadīth", "hadeeth"],
    arabic: "حديث",
    din31635: "ḥadīṯ",
    category: "scienze islamiche"
  },
  {
    latin: ["salah", "salat", "salaat"],
    arabic: "صلاة",
    din31635: "ṣalāh",
    category: "culto"
  },
  {
    latin: ["ilm", "'ilm", "علم"],
    arabic: "علم",
    din31635: "ʿilm",
    category: "scienze islamiche"
  },
  {
    latin: ["rasoul", "rasul", "rasool"],
    arabic: "رسول",
    din31635: "rasūl",
    category: "terminologia"
  },
  {
    latin: ["quran", "qur'an", "koran"],
    arabic: "قرآن",
    din31635: "qurʾān",
    category: "testi sacri"
  },
  {
    latin: ["allah"],
    arabic: "الله",
    din31635: "allāh",
    category: "nomi divini"
  },
  {
    latin: ["muhammad", "mohammed", "mohamed"],
    arabic: "محمد",
    din31635: "muḥammad",
    category: "nomi propri"
  },
  {
    latin: ["sunnah", "sunna"],
    arabic: "سنة",
    din31635: "sunnah",
    category: "scienze islamiche"
  },
  {
    latin: ["fiqh", "fikh"],
    arabic: "فقه",
    din31635: "fiqh",
    category: "scienze islamiche"
  },
  {
    latin: ["sheikh", "shaykh", "shaikh"],
    arabic: "شيخ",
    din31635: "šayḫ",
    category: "titoli"
  },
  {
    latin: ["imam"],
    arabic: "إمام",
    din31635: "imām",
    category: "titoli"
  },
  {
    latin: ["zakah", "zakat"],
    arabic: "زكاة",
    din31635: "zakāh",
    category: "culto"
  },
  {
    latin: ["hajj", "haj"],
    arabic: "حج",
    din31635: "ḥaǧǧ",
    category: "culto"
  },
  {
    latin: ["sawm", "siyam"],
    arabic: "صوم",
    din31635: "ṣawm",
    category: "culto"
  },
  {
    latin: ["jihad"],
    arabic: "جهاد",
    din31635: "ǧihād",
    category: "terminologia"
  },
  {
    latin: ["ummah", "umma"],
    arabic: "أمة",
    din31635: "ummah",
    category: "terminologia"
  },
  {
    latin: ["khalifa", "caliph", "khalifah"],
    arabic: "خليفة",
    din31635: "ḫalīfah",
    category: "titoli"
  },
  {
    latin: ["tawhid", "tauhid"],
    arabic: "توحيد",
    din31635: "tawḥīd",
    category: "teologia"
  },
  {
    latin: ["shirk"],
    arabic: "شرك",
    din31635: "širk",
    category: "teologia"
  },
  {
    latin: ["iman"],
    arabic: "إيمان",
    din31635: "īmān",
    category: "teologia"
  },
  {
    latin: ["salaf", "salafi"],
    arabic: "سلف",
    din31635: "salaf",
    category: "movimento"
  },
  {
    latin: ["ibrahim", "ibraheem"],
    arabic: "إبراهيم",
    din31635: "ibrāhīm",
    category: "nomi profeti"
  },
  {
    latin: ["musa", "mousa"],
    arabic: "موسى",
    din31635: "mūsā",
    category: "nomi profeti"
  },
  {
    latin: ["isa", "eesa"],
    arabic: "عيسى",
    din31635: "ʿīsā",
    category: "nomi profeti"
  },
  {
    latin: ["ayah", "aya", "ayat"],
    arabic: "آية",
    din31635: "āyah",
    category: "terminologia coranica"
  },
  {
    latin: ["surah", "sura"],
    arabic: "سورة",
    din31635: "sūrah",
    category: "terminologia coranica"
  },
  {
    latin: ["dua", "du'a"],
    arabic: "دعاء",
    din31635: "duʿāʾ",
    category: "culto"
  },
  {
    latin: ["dhikr", "zikr"],
    arabic: "ذكر",
    din31635: "ḏikr",
    category: "culto"
  },
  {
    latin: ["khutbah", "khutba"],
    arabic: "خطبة",
    din31635: "ḫuṭbah",
    category: "pratica"
  },
  {
    latin: ["masjid", "mosque"],
    arabic: "مسجد",
    din31635: "masǧid",
    category: "luoghi"
  }
];

/**
 * Cerca nel dizionario statico una corrispondenza per il testo di input
 */
export function searchDictionary(
  text: string,
  mode: "latin-to-din" | "arabic-to-din" | "latin-to-arabic"
): string | null {
  const normalizedInput = text.trim().toLowerCase();

  for (const entry of islamicDictionary) {
    if (mode === "latin-to-din") {
      if (entry.latin.some(variant => variant.toLowerCase() === normalizedInput)) {
        return entry.din31635;
      }
    } else if (mode === "arabic-to-din") {
      if (entry.arabic === text.trim()) {
        return entry.din31635;
      }
    } else if (mode === "latin-to-arabic") {
      if (entry.latin.some(variant => variant.toLowerCase() === normalizedInput)) {
        return entry.arabic;
      }
    }
  }

  return null;
}

/**
 * Processa un testo con più parole, cercando nel dizionario parola per parola
 */
export function processWithDictionary(
  text: string,
  mode: "latin-to-din" | "arabic-to-din" | "latin-to-arabic"
): { result: string; foundInDictionary: boolean } {
  const words = text.split(/\s+/);
  let foundAny = false;
  
  const convertedWords = words.map(word => {
    const match = searchDictionary(word, mode);
    if (match) {
      foundAny = true;
      return match;
    }
    return word;
  });

  return {
    result: convertedWords.join(" "),
    foundInDictionary: foundAny
  };
}
