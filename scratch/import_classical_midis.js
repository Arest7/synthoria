const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');
const { Midi } = require('@tonejs/midi');
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();
const SOURCE_DIR = path.join(process.cwd(), 'MIDILAR');
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'midis');
const MIDI_JSON_FILE = path.join(process.cwd(), 'data', 'midis.json');

const COMPOSERS_MAP = {
  'beethoven': {
    name: 'Ludwig van Beethoven',
    bio: 'Nemis kompozitori, pianisti va dirijori. Klassik va romantik musiqiy davrlar o\'rtasidagi o\'tish davrining eng muhim namoyandalaridan biri.'
  },
  'chopin': {
    name: 'Frédéric Chopin',
    bio: 'Polshalik buyuk kompozitor va pianinochi, musiqiy romantizmning eng yirik vakillaridan biri. U faqat fortepiano uchun asarlar yozgan.'
  },
  'mozart': {
    name: 'Wolfgang Amadeus Mozart',
    bio: 'Avstriyalik buyuk kompozitor, skripkachi va organchi. G\'arb klassik musiqasining eng sermahsul va ta\'sirchan kompozitorlaridan biri.'
  },
  'verdi': {
    name: 'Giuseppe Verdi',
    bio: 'Italiyalik buyuk opera kompozitori, XIX asr Italiya opera maktabining eng yirik namoyandasi.'
  }
};

async function formatFileSize(filePath) {
  const stats = await fs.stat(filePath);
  const sizeInKb = Math.round(stats.size / 1024);
  return `${sizeInKb} KB`;
}

function formatDuration(seconds) {
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${String(m).padStart(2, '0')}:${String(s).padStart(2, '0')}`;
}

async function addToLocalJson(data) {
  let all = [];
  try {
    const raw = await fs.readFile(MIDI_JSON_FILE, 'utf-8');
    all = JSON.parse(raw);
  } catch (e) {
    // File doesn't exist yet, we will start with empty array
  }

  const now = new Date().toISOString();
  const entry = {
    id: randomUUID(),
    ...data,
    downloadCount: 0,
    playCount: 0,
    createdAt: now,
    updatedAt: now,
  };

  // Prevent duplicates by checking fileUrl
  const existingIdx = all.findIndex(item => item.fileUrl === data.fileUrl);
  if (existingIdx !== -1) {
    all[existingIdx] = { ...all[existingIdx], ...data, updatedAt: now };
  } else {
    all.push(entry);
  }

  await fs.mkdir(path.dirname(MIDI_JSON_FILE), { recursive: true });
  await fs.writeFile(MIDI_JSON_FILE, JSON.stringify(all, null, 2), 'utf-8');
  return entry;
}

async function run() {
  console.log('Starting Classical MIDI import...');
  
  // Ensure destination uploads directory exists
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  try {
    const folders = await fs.readdir(SOURCE_DIR);
    console.log(`Found composer folders: ${folders.join(', ')}`);

    for (const folder of folders) {
      const folderLower = folder.toLowerCase();
      const info = COMPOSERS_MAP[folderLower];
      if (!info) {
        console.log(`Skipping unknown folder: ${folder}`);
        continue;
      }

      const composerDir = path.join(SOURCE_DIR, folder);
      const files = await fs.readdir(composerDir);
      const midiFiles = files.filter(f => f.toLowerCase().endsWith('.mid') || f.toLowerCase().endsWith('.midi'));

      console.log(`Processing ${midiFiles.length} files for ${info.name}...`);

      for (const file of midiFiles) {
        const sourcePath = path.join(composerDir, file);
        
        // Generate unique filename to avoid collision with any existing uploads
        const timestamp = Date.now();
        const safeName = file.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFilename = `${timestamp}_classical_${folderLower}_${safeName}`;
        const destPath = path.join(UPLOAD_DIR, uniqueFilename);

        // Copy file to public/uploads/midis/
        await fs.copyFile(sourcePath, destPath);

        // Read file buffer & parse duration
        let durationSec = 180; // fallback
        try {
          const buffer = await fs.readFile(destPath);
          const midi = new Midi(buffer);
          durationSec = midi.duration;
        } catch (e) {
          // ignore parsing error
        }

        // Clean title
        const title = file.replace(/\.mid$|\.midi$/i, '').replace(/_/g, ' ').replace(/-/g, ' ').trim();
        const fileSize = await formatFileSize(destPath);
        const durationStr = formatDuration(durationSec);

        const newMidi = {
          title: title,
          composer: info.name,
          description: `${info.name} tomonidan yaratilgan klassik musiqiy asar.`,
          grade: 0, // 0 denotes Classical category
          genre: 'Classical',
          difficulty: durationSec > 240 ? 'HARD' : durationSec > 120 ? 'MEDIUM' : 'EASY',
          fileUrl: `/uploads/midis/${uniqueFilename}`,
          fileSize: fileSize,
          duration: durationStr,
          compatSoftware: ['SeeMusic', 'Synthesia', 'Midiano'],
          educationalNote: `Ushbu asar jahon mumtoz musiqa merosiga mansub bo'lib, estetik idrokni rivojlantirishga xizmat qiladi.`,
          isFeatured: false
        };

        // Try Database
        let dbSaved = false;
        try {
          await db.midiFile.create({
            data: {
              ...newMidi,
              compatSoftware: newMidi.compatSoftware
            }
          });
          dbSaved = true;
        } catch (e) {
          // DB unreachable or failed, silently fallback
        }

        // Always save to local fallback JSON
        try {
          await addToLocalJson(newMidi);
          console.log(`Successfully added: [Klassik] ${title} - ${info.name} (${durationStr}) ${dbSaved ? '(DB + JSON)' : '(JSON fallback)'}`);
        } catch (err) {
          console.error(`Failed to write local JSON for ${title}:`, err);
        }
      }
    }

    console.log('Classical MIDI Import finished successfully!');
  } catch (err) {
    console.error('Error during import process:', err);
  }
}

run()
  .catch(console.error)
  .finally(() => db.$disconnect());
