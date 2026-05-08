import type { VercelRequest, VercelResponse } from '@vercel/node';

const VERSION_IDS: Record<string, number> = {
  NIV: 111,
  KJV: 1,
  NKJV: 114,
  NLT: 116,
  AMP: 1588,
  ESV: 59,
  MSG: 97,
};

interface ParsedRef {
  bookCode: string;
  chapter: number;
  verseStart?: number;
  verseEnd?: number;
  fullReference: string;
}

function parseReference(ref: string): ParsedRef | null {
  const trimmed = ref.trim();
  const match = trimmed.match(/^(\d?\s?[a-zA-Z]+)\s+(\d+)(?::(\d+)(?:-(\d+))?)?$/);
  if (!match) return null;

  const [, bookRaw, chapterStr, verseStartStr, verseEndStr] = match;
  const bookKey = bookRaw.toLowerCase().replace(/\s/g, '');
  const bookCode = BOOK_MAP[bookKey];
  if (!bookCode) return null;

  const chapter = parseInt(chapterStr);
  const verseStart = verseStartStr ? parseInt(verseStartStr) : undefined;
  const verseEnd = verseEndStr ? parseInt(verseEndStr) : verseStart;

  let fullReference = `${bookRaw.trim()} ${chapter}`;
  if (verseStart !== undefined) fullReference += `:${verseStart}`;
  if (verseEnd !== undefined && verseEnd !== verseStart) fullReference += `-${verseEnd}`;

  return { bookCode, chapter, verseStart, verseEnd, fullReference };
}

export default async function handler(req: VercelRequest, res: VercelResponse) {
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  const { reference, version } = req.query as { reference?: string; version?: string };
  if (!reference || !version) return res.status(400).json({ error: 'Missing params: reference, version' });

  const apiKey = process.env.YVP_APP_KEY;
  if (!apiKey) return res.status(500).json({ error: 'YVP_APP_KEY not configured' });

  const versionId = VERSION_IDS[version.toUpperCase()];
  if (!versionId) return res.status(400).json({ error: `Unsupported version: ${version}` });

  const parsed = parseReference(String(reference));
  if (!parsed) return res.status(400).json({ error: `Could not parse reference: ${reference}` });

  const { bookCode, chapter, verseStart, verseEnd } = parsed;

  try {
    const url = `https://api.youversion.com/v1/bibles/${versionId}/books/${bookCode}/chapters/${chapter}/verses`;

    const response = await fetch(url, {
      headers: {
        'X-YVP-App-Key': apiKey,
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      const body = await response.text();
      console.error('YouVersion API error:', response.status, body);
      return res.status(response.status).json({ error: 'YouVersion API error', detail: body });
    }

    const data = await response.json();
    let verses: any[] = data?.data ?? [];

    // Filter to requested verse range if specified
    if (verseStart !== undefined) {
      const end = verseEnd ?? verseStart;
      verses = verses.filter(v => {
        const num = v.verse_number ?? v.number ?? parseInt((v.id ?? '').split('.')[2] ?? '0');
        return num >= verseStart && num <= end;
      });
    }

    const text = verses.map(v => {
      const num = v.verse_number ?? v.number ?? parseInt((v.id ?? '').split('.')[2] ?? '');
      const body = (v.text ?? v.content ?? '').trim();
      return `<sup>${num}</sup> ${body}`;
    }).join('<br>');

    if (!text) {
      console.log('Empty result. Raw response shape:', JSON.stringify(data).slice(0, 500));
    }

    return res.status(200).json({
      text: text || 'Could not retrieve scripture text.',
      fullReference: parsed.fullReference,
    });
  } catch (err: any) {
    console.error('bible proxy error:', err);
    return res.status(500).json({ error: 'Internal server error', detail: err?.message });
  }
}

// ---------- Book name → USFM code ----------

const BOOK_MAP: Record<string, string> = {
  genesis: 'GEN', gen: 'GEN',
  exodus: 'EXO', exo: 'EXO', ex: 'EXO',
  leviticus: 'LEV', lev: 'LEV',
  numbers: 'NUM', num: 'NUM',
  deuteronomy: 'DEU', deu: 'DEU', deut: 'DEU',
  joshua: 'JOS', jos: 'JOS', josh: 'JOS',
  judges: 'JDG', jdg: 'JDG', judg: 'JDG',
  ruth: 'RUT', rut: 'RUT',
  '1samuel': '1SA', '1sa': '1SA', '1sam': '1SA',
  '2samuel': '2SA', '2sa': '2SA', '2sam': '2SA',
  '1kings': '1KI', '1ki': '1KI', '1kgs': '1KI',
  '2kings': '2KI', '2ki': '2KI', '2kgs': '2KI',
  '1chronicles': '1CH', '1ch': '1CH', '1chr': '1CH',
  '2chronicles': '2CH', '2ch': '2CH', '2chr': '2CH',
  ezra: 'EZR', ezr: 'EZR',
  nehemiah: 'NEH', neh: 'NEH',
  esther: 'EST', est: 'EST',
  job: 'JOB',
  psalms: 'PSA', psalm: 'PSA', psa: 'PSA', ps: 'PSA',
  proverbs: 'PRO', prov: 'PRO', pro: 'PRO',
  ecclesiastes: 'ECC', ecc: 'ECC', eccl: 'ECC',
  songofsolomon: 'SNG', songofsongs: 'SNG', sos: 'SNG', song: 'SNG', sng: 'SNG',
  isaiah: 'ISA', isa: 'ISA',
  jeremiah: 'JER', jer: 'JER',
  lamentations: 'LAM', lam: 'LAM',
  ezekiel: 'EZK', ezk: 'EZK', eze: 'EZK', ezek: 'EZK',
  daniel: 'DAN', dan: 'DAN',
  hosea: 'HOS', hos: 'HOS',
  joel: 'JOL', jol: 'JOL',
  amos: 'AMO', amo: 'AMO',
  obadiah: 'OBA', oba: 'OBA',
  jonah: 'JON', jon: 'JON',
  micah: 'MIC', mic: 'MIC',
  nahum: 'NAM', nah: 'NAM', nam: 'NAM',
  habakkuk: 'HAB', hab: 'HAB',
  zephaniah: 'ZEP', zep: 'ZEP', zeph: 'ZEP',
  haggai: 'HAG', hag: 'HAG',
  zechariah: 'ZEC', zec: 'ZEC', zech: 'ZEC',
  malachi: 'MAL', mal: 'MAL',
  matthew: 'MAT', mat: 'MAT', matt: 'MAT',
  mark: 'MRK', mrk: 'MRK', mk: 'MRK',
  luke: 'LUK', luk: 'LUK', lk: 'LUK',
  john: 'JHN', jhn: 'JHN', jn: 'JHN',
  acts: 'ACT', act: 'ACT',
  romans: 'ROM', rom: 'ROM',
  '1corinthians': '1CO', '1co': '1CO', '1cor': '1CO',
  '2corinthians': '2CO', '2co': '2CO', '2cor': '2CO',
  galatians: 'GAL', gal: 'GAL',
  ephesians: 'EPH', eph: 'EPH',
  philippians: 'PHP', php: 'PHP', phil: 'PHP',
  colossians: 'COL', col: 'COL',
  '1thessalonians': '1TH', '1th': '1TH', '1thess': '1TH',
  '2thessalonians': '2TH', '2th': '2TH', '2thess': '2TH',
  '1timothy': '1TI', '1ti': '1TI', '1tim': '1TI',
  '2timothy': '2TI', '2ti': '2TI', '2tim': '2TI',
  titus: 'TIT', tit: 'TIT',
  philemon: 'PHM', phm: 'PHM', phlm: 'PHM',
  hebrews: 'HEB', heb: 'HEB',
  james: 'JAS', jas: 'JAS',
  '1peter': '1PE', '1pe': '1PE', '1pet': '1PE',
  '2peter': '2PE', '2pe': '2PE', '2pet': '2PE',
  '1john': '1JN', '1jn': '1JN', '1jo': '1JN',
  '2john': '2JN', '2jn': '2JN',
  '3john': '3JN', '3jn': '3JN',
  jude: 'JUD', jud: 'JUD',
  revelation: 'REV', rev: 'REV',
};
