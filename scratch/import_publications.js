const fs = require('fs');
const path = require('path');
const { randomUUID } = require('crypto');

const XML_PATH = path.join(__dirname, 'docx_extract', 'word', 'document.xml');
const PUB_JSON_FILE = path.join(__dirname, '..', 'data', 'publications.json');

async function importPublications() {
  if (!fs.existsSync(XML_PATH)) {
    console.error('document.xml not found! Make sure you extracted the docx first.');
    return;
  }

  const content = fs.readFileSync(XML_PATH, 'utf-8');
  
  // Extract paragraphs
  const paragraphRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
  let match;
  const paragraphs = [];

  while ((match = paragraphRegex.exec(content)) !== null) {
    const pContent = match[1];
    const textRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/g;
    let textMatch;
    let pText = '';
    
    while ((textMatch = textRegex.exec(pContent)) !== null) {
      pText += textMatch[1];
    }
    
    pText = pText
      .replace(/&amp;/g, '&')
      .replace(/&lt;/g, '<')
      .replace(/&gt;/g, '>')
      .replace(/&quot;/g, '"')
      .replace(/&apos;/g, "'");

    if (pText.trim()) {
      paragraphs.push(pText.trim());
    }
  }

  console.log(`Read ${paragraphs.length} paragraphs from XML.`);

  // Now let's loop and extract items
  const publications = [];
  let currentSection = ''; // 'section1', 'books', 'section2'
  let i = 0;

  while (i < paragraphs.length) {
    const p = paragraphs[i];

    // Detect section transitions
    if (p.includes('I boʻlim')) {
      currentSection = 'section1';
      i++;
      continue;
    }
    if (p.includes('OʻQUV, ILMIY ADABIYOTLAR')) {
      currentSection = 'books';
      i++;
      continue;
    }
    if (p.includes('II boʻlim')) {
      currentSection = 'section2';
      i++;
      continue;
    }

    // Skip names / footer titles
    if (p.includes('Ashurov Ma’rufjon') || p.includes('ilmiy, oʻquv-uslubiy ishlar') || p.includes('Ilmiy ishlar nomi') || p.includes('Bosma taboq') || p.includes('Hammual-liflar') || p.includes('Talabgor:') || p.includes('Ilmiy kotib:') || p.includes('30-mart 2026-yil')) {
      i++;
      continue;
    }

    // Check if we have an item. Items consist of:
    // 1. Title (this is paragraph i)
    // 2. Type (paragraph i+1, e.g. "bosma")
    // 3. Publisher/Journal details (paragraph i+2)
    // 4. Page/sheet count (paragraph i+3)
    // 5. Co-authors (paragraph i+4)
    if (i + 4 < paragraphs.length && (paragraphs[i+1] === 'bosma' || paragraphs[i+1] === 'қўлёзма' || paragraphs[i+1] === 'qoʻlyozma')) {
      const title = paragraphs[i];
      const type = paragraphs[i+1];
      const source = paragraphs[i+2];
      const pages = paragraphs[i+3];
      const coauthors = paragraphs[i+4];

      let category = 'RESEARCH';
      if (currentSection === 'books') {
        category = 'METHODICAL';
      } else if (currentSection === 'section2' && (title.includes('Фольклоршунос') || title.includes('teatrining faxri') || title.includes('xonanda'))) {
        category = 'NEWS';
      }

      // Format description content
      let desc = source;
      if (pages && pages !== '-') {
        desc += `. Hajmi: ${pages}.`;
      }
      if (coauthors && coauthors !== '-') {
        desc += ` Hammualiflar: ${coauthors}.`;
      }
      desc += ` [Nashr turi: ${type}]`;

      publications.push({
        title,
        content: desc,
        category,
        fileUrl: null
      });

      i += 5; // skip the 5 processed paragraphs
    } else {
      i++;
    }
  }

  console.log(`Successfully mapped ${publications.length} publications.`);

  // Load existing publications from JSON to merge
  let allPubs = [];
  if (fs.existsSync(PUB_JSON_FILE)) {
    try {
      allPubs = JSON.parse(fs.readFileSync(PUB_JSON_FILE, 'utf-8'));
    } catch (e) {
      console.warn('Could not read existing publications.json, starting fresh.');
    }
  }

  const now = new Date().toISOString();

  // Upsert each item directly to local JSON fallback
  for (const pub of publications) {
    const existingIdx = allPubs.findIndex(p => p.title.toLowerCase() === pub.title.toLowerCase());
    
    const entry = {
      id: randomUUID(),
      title: pub.title,
      content: pub.content,
      category: pub.category,
      fileUrl: pub.fileUrl,
      date: now
    };

    if (existingIdx !== -1) {
      allPubs[existingIdx] = {
        ...allPubs[existingIdx],
        content: pub.content,
        category: pub.category,
        date: now
      };
      console.log(`[JSON] Updated: ${pub.title.slice(0, 40)}...`);
    } else {
      allPubs.push(entry);
      console.log(`[JSON] Created: ${pub.title.slice(0, 40)}...`);
    }
  }

  // Write updated publications.json
  fs.writeFileSync(PUB_JSON_FILE, JSON.stringify(allPubs, null, 2), 'utf-8');
  console.log(`Successfully wrote ${allPubs.length} publications to ${PUB_JSON_FILE}`);
}

importPublications()
  .then(() => console.log('Import task complete!'))
  .catch(e => {
    console.error('Error during import:', e);
  });
