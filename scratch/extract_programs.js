const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, 'dastur_extracted.txt');
if (!fs.existsSync(filePath)) {
  console.error('dastur_extracted.txt not found!');
  process.exit(1);
}

const content = fs.readFileSync(filePath, 'utf-8');
const lines = content.split('\n');

const paragraphs = [];
lines.forEach(line => {
  const match = line.match(/^\[\d+\]\s*(.*)$/);
  if (match) {
    paragraphs.push(match[1].trim());
  }
});

const sections = {
  'VanBascoʻs Karaoke Player': { start: 21, end: 39 },
  'Kanto Player': { start: 40, end: 44 },
  'Sweet MIDI Player 32': { start: 45, end: 53 },
  'Notation Player': { start: 54, end: 61 },
  'Midis2jam2': { start: 62, end: 73 },
  'MIDI Clef': { start: 74, end: 134 },
  'Free MIDI Player': { start: 135, end: 141 },
  'Midiano': { start: 142, end: 153 },
  'SeeMusic': { start: 154, end: 198 },
  'Synthesia': { start: 199, end: 211 },
  'Note Bounce': { start: 212, end: 230 },
  'ProfM-2DRUM': { start: 231, end: 244 }
};

const output = [];
for (const [name, range] of Object.entries(sections)) {
  output.push(`========================================`);
  output.push(`SECTION: ${name} (${range.start} to ${range.end})`);
  output.push(`========================================`);
  for (let idx = range.start - 1; idx < range.end; idx++) {
    output.push(`[${idx + 1}] ${paragraphs[idx]}`);
  }
  output.push('');
}

fs.writeFileSync(path.join(__dirname, 'programs_grouped.txt'), output.join('\n'), 'utf-8');
console.log('Done!');
