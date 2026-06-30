const fs = require('fs');
const path = require('path');

function parseDocxXml() {
  const xmlPath = path.join(__dirname, 'docx_extract', 'word', 'document.xml');
  if (!fs.existsSync(xmlPath)) {
    console.error('document.xml not found!');
    return;
  }

  const content = fs.readFileSync(xmlPath, 'utf-8');
  
  // A simple regex parser to extract w:p (paragraphs)
  const paragraphRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
  let match;
  const paragraphs = [];

  while ((match = paragraphRegex.exec(content)) !== null) {
    const pContent = match[1];
    
    // Within this paragraph, extract all w:t (text) contents
    const textRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/g;
    let textMatch;
    let pText = '';
    
    while ((textMatch = textRegex.exec(pContent)) !== null) {
      pText += textMatch[1];
    }
    
    // Decode common XML entities
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

  console.log(`Parsed ${paragraphs.length} paragraphs:\n`);
  paragraphs.forEach((p, i) => {
    console.log(`[${i + 1}] ${p}`);
  });
}

parseDocxXml();
