/**
 * Local JSON data store — used as fallback when the PostgreSQL database
 * is not reachable (e.g. local development without Docker).
 *
 * Data is persisted to JSON files inside the `data` folder at the project root.
 * In production with a real DB, these files are never touched.
 */

import fs from 'fs/promises';
import path from 'path';
import { randomUUID } from 'crypto';

const DATA_DIR  = path.join(process.cwd(), 'data');
const MIDI_FILE = path.join(DATA_DIR, 'midis.json');
const PDF_FILE  = path.join(DATA_DIR, 'pdfs.json');
const PUB_FILE  = path.join(DATA_DIR, 'publications.json');

// ── Types ───────────────────────────────────────────────────────────────────

export interface LocalMidi {
  id: string;
  title: string;
  composer: string;
  description: string;
  grade: number;
  genre: string;
  difficulty: string;
  fileUrl: string;
  fileSize: string;
  duration: string;
  downloadCount: number;
  playCount: number;
  isFeatured: boolean;
  compatSoftware: string[];
  educationalNote: string;
  createdAt: string;
  updatedAt: string;
}

export interface LocalPdf {
  id: string;
  title: string;
  description: string;
  grade: number | null;
  fileUrl: string;
  fileSize: string;
  downloadCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface LocalPublication {
  id: string;
  title: string;
  content: string;
  category: string;
  fileUrl: string | null;
  date: string;
}

// ── Directory Helpers ───────────────────────────────────────────────────────

async function ensureDataDir() {
  await fs.mkdir(DATA_DIR, { recursive: true });
}

// ── Midi Store Operations ───────────────────────────────────────────────────

async function readAllMidis(): Promise<LocalMidi[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(MIDI_FILE, 'utf-8');
    return JSON.parse(raw) as LocalMidi[];
  } catch {
    const seed = getDefaultMidiSeed();
    await writeAllMidis(seed);
    return seed;
  }
}

async function writeAllMidis(midis: LocalMidi[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(MIDI_FILE, JSON.stringify(midis, null, 2), 'utf-8');
}

export async function localMidiGetMany(filters: {
  grade?: number;
  isFeatured?: boolean;
}): Promise<LocalMidi[]> {
  let all = await readAllMidis();

  if (filters.grade !== undefined)
    all = all.filter(m => m.grade === filters.grade);

  if (filters.isFeatured !== undefined)
    all = all.filter(m => m.isFeatured === filters.isFeatured);

  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function localMidiCreate(data: Omit<LocalMidi, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount' | 'playCount'>): Promise<LocalMidi> {
  const all = await readAllMidis();
  const now = new Date().toISOString();

  const entry: LocalMidi = {
    id: randomUUID(),
    ...data,
    downloadCount: 0,
    playCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  all.unshift(entry);
  await writeAllMidis(all);
  return entry;
}

export async function localMidiDelete(id: string): Promise<boolean> {
  const all = await readAllMidis();
  const next = all.filter(m => m.id !== id);
  if (next.length === all.length) return false;
  await writeAllMidis(next);
  return true;
}

export async function localMidiGetById(id: string): Promise<LocalMidi | null> {
  const all = await readAllMidis();
  return all.find(m => m.id === id) ?? null;
}

// ── PDF Store Operations ────────────────────────────────────────────────────

async function readAllPdfs(): Promise<LocalPdf[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(PDF_FILE, 'utf-8');
    return JSON.parse(raw) as LocalPdf[];
  } catch {
    const seed = getDefaultPdfSeed();
    await writeAllPdfs(seed);
    return seed;
  }
}

async function writeAllPdfs(pdfs: LocalPdf[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PDF_FILE, JSON.stringify(pdfs, null, 2), 'utf-8');
}

export async function localPdfGetMany(filters: { grade?: number }): Promise<LocalPdf[]> {
  let all = await readAllPdfs();
  if (filters.grade !== undefined) {
    all = all.filter(p => p.grade === filters.grade);
  }
  return all.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
}

export async function localPdfCreate(data: Omit<LocalPdf, 'id' | 'createdAt' | 'updatedAt' | 'downloadCount'>): Promise<LocalPdf> {
  const all = await readAllPdfs();
  const now = new Date().toISOString();

  const entry: LocalPdf = {
    id: randomUUID(),
    ...data,
    downloadCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  all.unshift(entry);
  await writeAllPdfs(all);
  return entry;
}

export async function localPdfDelete(id: string): Promise<boolean> {
  const all = await readAllPdfs();
  const next = all.filter(p => p.id !== id);
  if (next.length === all.length) return false;
  await writeAllPdfs(next);
  return true;
}

export async function localPdfGetById(id: string): Promise<LocalPdf | null> {
  const all = await readAllPdfs();
  return all.find(p => p.id === id) ?? null;
}

// ── Publication Store Operations ────────────────────────────────────────────

async function readAllPubs(): Promise<LocalPublication[]> {
  try {
    await ensureDataDir();
    const raw = await fs.readFile(PUB_FILE, 'utf-8');
    return JSON.parse(raw) as LocalPublication[];
  } catch {
    const seed = getDefaultPubSeed();
    await writeAllPubs(seed);
    return seed;
  }
}

async function writeAllPubs(pubs: LocalPublication[]): Promise<void> {
  await ensureDataDir();
  await fs.writeFile(PUB_FILE, JSON.stringify(pubs, null, 2), 'utf-8');
}

export async function localPubGetMany(filters: { category?: string }): Promise<LocalPublication[]> {
  let all = await readAllPubs();
  if (filters.category) {
    all = all.filter(p => p.category === filters.category);
  }
  return all.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
}

export async function localPubCreate(data: Omit<LocalPublication, 'id' | 'date'>): Promise<LocalPublication> {
  const all = await readAllPubs();
  const now = new Date().toISOString();

  const entry: LocalPublication = {
    id: randomUUID(),
    ...data,
    date: now,
  };

  all.unshift(entry);
  await writeAllPubs(all);
  return entry;
}

export async function localPubDelete(id: string): Promise<boolean> {
  const all = await readAllPubs();
  const next = all.filter(p => p.id !== id);
  if (next.length === all.length) return false;
  await writeAllPubs(next);
  return true;
}

export async function localPubGetById(id: string): Promise<LocalPublication | null> {
  const all = await readAllPubs();
  return all.find(p => p.id === id) ?? null;
}

// ── Default Seed Data Generators ──────────────────────────────────────────

function getDefaultMidiSeed(): LocalMidi[] {
  const now = new Date().toISOString();
  return [
    {
      id: '1', title: "Vatanim", composer: "Shermat Yormatov",
      description: "O'zbekiston vatanparvarlik ruhidagi eng mashhur bolalar qo'shiqlaridan biri.",
      grade: 5, genre: "Patriotic / Bolalar", difficulty: "EASY",
      fileUrl: "/uploads/vatanim.mid", fileSize: "15 KB", duration: "02:15",
      downloadCount: 45, playCount: 120, isFeatured: true,
      compatSoftware: ["SeeMusic", "Synthesia", "vanBasco"],
      educationalNote: "Vatan tuyg'usini rivojlantiradi.", createdAt: now, updatedAt: now,
    },
    {
      id: '2', title: "Chamanzor", composer: "Folklor kuy",
      description: "O'zbek xalq musiqa merosiga mansub quvnoq va sho'x ohangli xalq qo'shig'i.",
      grade: 5, genre: "Folklor / Milliy", difficulty: "MEDIUM",
      fileUrl: "/uploads/chamanzor.mid", fileSize: "22 KB", duration: "03:10",
      downloadCount: 29, playCount: 78, isFeatured: false,
      compatSoftware: ["Synthesia", "Midiano"],
      educationalNote: "Xalq musiqasining milliy bezaklarini o'rganishga yordam beradi.", createdAt: now, updatedAt: now,
    },
    {
      id: '3', title: "Bahor keldi", composer: "Soli Aliyev",
      description: "Tabiat go'zalligi va bahor faslining tarovatini madh etuvchi yengil qo'shiq.",
      grade: 6, genre: "Classic / Bolalar", difficulty: "MEDIUM",
      fileUrl: "/uploads/bahor_keldi.mid", fileSize: "18 KB", duration: "02:45",
      downloadCount: 32, playCount: 95, isFeatured: true,
      compatSoftware: ["SeeMusic", "Synthesia", "Midiano"],
      educationalNote: "Tempning o'zgarishi va lirik ohang tarovatini o'rganish.", createdAt: now, updatedAt: now,
    },
    {
      id: '4', title: "Tanovar", composer: "Xalq kuyi",
      description: "O'zbek mumtoz musiqasining lirik va chuqur estetik ma'noga ega durdonasi.",
      grade: 7, genre: "Mumtoz / Maqom", difficulty: "HARD",
      fileUrl: "/uploads/tanovar.mid", fileSize: "35 KB", duration: "04:20",
      downloadCount: 68, playCount: 245, isFeatured: true,
      compatSoftware: ["SeeMusic", "Synthesia", "Midiano"],
      educationalNote: "Oliy estetik didni rivojlantirishga xizmat qiladi.", createdAt: now, updatedAt: now,
    },
    {
      id: '5', title: "Ko'cha bog'lari", composer: "Xalq musiqa merosi",
      description: "Sho'x, jozibador va murakkab doira ritmlariga ega bo'lgan o'zbek xalq kuyi.",
      grade: 6, genre: "Folklor / Ritmik", difficulty: "HARD",
      fileUrl: "/uploads/kocha_boglari.mid", fileSize: "28 KB", duration: "03:40",
      downloadCount: 18, playCount: 52, isFeatured: false,
      compatSoftware: ["Synthesia", "ProfM-2DRUM"],
      educationalNote: "Sinkopali ritmlarni o'rganishga yordam beradi.", createdAt: now, updatedAt: now,
    },
    {
      id: '6', title: "O'zbekiston", composer: "Mutal Burhonov",
      description: "O'zbekiston kompozitorlik maktabining durdona simfonik asari.",
      grade: 7, genre: "Akademik / Simfonik", difficulty: "HARD",
      fileUrl: "/uploads/ozbekiston.mid", fileSize: "42 KB", duration: "05:05",
      downloadCount: 42, playCount: 110, isFeatured: false,
      compatSoftware: ["SeeMusic", "Synthesia"],
      educationalNote: "Ko'p ovozli uyg'unlik darslarini tahlil qilish.", createdAt: now, updatedAt: now,
    },
  ];
}

function getDefaultPdfSeed(): LocalPdf[] {
  const now = new Date().toISOString();
  return [
    {
      id: '1', title: "Musiqa ta‘limida AKT imkoniyatlari",
      description: "Umumta‘lim maktablarida musiqa darslarini interaktiv o‘rgatish bo‘yicha metodik tavsiyanomalar to‘plami.",
      grade: null, fileUrl: "/uploads/didactic_opportunities.pdf", fileSize: "2.4 MB",
      downloadCount: 124, createdAt: now, updatedAt: now
    },
    {
      id: '2', title: "5-sinf Musiqa darsligi notalar to‘plami",
      description: "5-sinf darsligiga kiritilgan barcha qo‘shiq va kuylarning to‘liq pianino va vokal notalari klaviri.",
      grade: 5, fileUrl: "/uploads/grade5_sheets.pdf", fileSize: "4.8 MB",
      downloadCount: 86, createdAt: now, updatedAt: now
    },
    {
      id: '3', title: "Musiqiy estetik kompetensiyani rivojlantirish",
      description: "Musiqa o‘qitishda vizual-eshitish didaktikasidan foydalanish bo‘yicha magistrlik dissertatsiyasining amaliy ilovasi.",
      grade: null, fileUrl: "/uploads/aesthetic_competence_framework.pdf", fileSize: "1.9 MB",
      downloadCount: 95, createdAt: now, updatedAt: now
    }
  ];
}

function getDefaultPubSeed(): LocalPublication[] {
  const now = new Date().toISOString();
  return [
    {
      id: '1', title: "Musiqa ta‘limini rivojlantirishning dolzarb masalalari",
      content: "Ushbu maqolada umumta‘lim maktablarida musiqa madaniyati darslarini tashkil etishda AKT vositalarining didaktik roli va SeeMusic dasturining interaktiv imkoniyatlari tahlil qilingan.",
      category: "RESEARCH", fileUrl: "/uploads/didactic_opportunities.pdf", date: now
    },
    {
      id: '2', title: "O‘quvchilar badiiy-estetik didini o‘stirish yo‘llari",
      content: "Musiqiy asar mazmunini anglash va uni vizual shakllar (tovush to‘lqinlari va ranglar) bilan bog‘lash dars samarasini oshirishi ilmiy jihatdan tajriba-sinov maydonlarida isbotlandi.",
      category: "METHODICAL", fileUrl: null, date: now
    },
    {
      id: '3', title: "IT-Music Education loyihasi ishga tushirildi",
      content: "Maktab o‘quvchilari hamda o‘qituvchilari uchun darslik kuylari asosida tayyorlangan interaktiv MIDI kutubxonasi va pleyer portali rasman amaliyotga joriy etildi.",
      category: "NEWS", fileUrl: null, date: now
    }
  ];
}
