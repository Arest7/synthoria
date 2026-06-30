const fs = require('fs').promises;
const path = require('path');
const { randomUUID } = require('crypto');
const { Midi } = require('@tonejs/midi');
const { PrismaClient } = require('@prisma/client');

const db = new PrismaClient();
const UPLOAD_DIR = path.join(process.cwd(), 'public', 'uploads', 'midis');
const MIDI_FILE = path.join(process.cwd(), 'data', 'midis.json');

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

async function localMidiCreate(data) {
  let all = [];
  try {
    const raw = await fs.readFile(MIDI_FILE, 'utf-8');
    all = JSON.parse(raw);
  } catch (e) {
    // If local store is empty or deleted, it will be seeded or created
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

  all.unshift(entry);
  await fs.mkdir(path.dirname(MIDI_FILE), { recursive: true });
  await fs.writeFile(MIDI_FILE, JSON.stringify(all, null, 2), 'utf-8');
  return entry;
}

async function run() {
  console.log('Starting MIDI import...');

  // Ensure uploads directory exists
  await fs.mkdir(UPLOAD_DIR, { recursive: true });

  const grades = [5, 6, 7];

  for (const grade of grades) {
    const dirName = `${grade}-sinf MIDI`;
    const sourceDir = path.join(process.cwd(), dirName);

    try {
      const files = await fs.readdir(sourceDir);
      const midiFiles = files.filter(f => f.toLowerCase().endsWith('.mid') || f.toLowerCase().endsWith('.midi'));

      console.log(`Processing ${midiFiles.length} files from ${dirName}...`);

      for (const file of midiFiles) {
        const sourcePath = path.join(sourceDir, file);

        // Generate safe unique filename
        const timestamp = Date.now();
        const safeName = file.replace(/[^a-zA-Z0-9.-]/g, '_');
        const uniqueFilename = `${timestamp}_${safeName}`;
        const destPath = path.join(UPLOAD_DIR, uniqueFilename);

        // Copy file to public/uploads/midis/
        await fs.copyFile(sourcePath, destPath);

        // Read file buffer & parse duration
        const buffer = await fs.readFile(destPath);
        let durationSec = 120; // fallback default
        try {
          const midi = new Midi(buffer);
          durationSec = midi.duration;
        } catch (e) {
          // ignore parsing error
        }

        const title = file.replace(/\.mid$|\.midi$/i, '').trim();
        const fileSize = await formatFileSize(destPath);
        const durationStr = formatDuration(durationSec);

        const newMidi = {
          title: title,
          composer: "Maktab darsligi",
          description: `${grade}-sinf Musiqa madaniyati darsligidagi musiqiy asar.`,
          grade: grade,
          genre: "Darslik qo'shig'i",
          difficulty: "MEDIUM",
          fileUrl: `/uploads/midis/${uniqueFilename}`,
          fileSize: fileSize,
          duration: durationStr,
          compatSoftware: ["SeeMusic", "Synthesia", "Midiano"],
          educationalNote: "Musiqiy estetik va amaliy-ijrochilik kompetensiyalarini shakllantiruvchi o'quv asari.",
          isFeatured: false
        };

        // Try DB first
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
          // DB unreachable or failed
        }

        // Always add to local JSON store to keep dev mode in sync
        try {
          await localMidiCreate(newMidi);
          console.log(`Successfully added: [${grade}-Sinf] ${title} (${durationStr}, ${fileSize}) ${dbSaved ? '(DB + JSON)' : '(JSON fallback)'}`);
        } catch (err) {
          console.error(`Failed to add local fallback for ${title}:`, err);
        }
      }
    } catch (e) {
      console.warn(`No source folder or failed reading ${dirName}: ${e.message}`);
    }
  }

  console.log('MIDI Import finished successfully!');
}

run().catch(console.error).finally(() => db.$disconnect());
