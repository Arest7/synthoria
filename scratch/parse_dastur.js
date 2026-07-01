const fs = require('fs');
const path = require('path');

function parseDasturXml() {
  const xmlPath = path.join(__dirname, 'dastur_extract', 'word', 'document.xml');
  const outPath = path.join(__dirname, 'dastur_extracted.txt');
  
  if (!fs.existsSync(xmlPath)) {
    console.error('document.xml not found!');
    return;
  }

  const content = fs.readFileSync(xmlPath, 'utf-8');
  
  const paragraphRegex = /<w:p\b[^>]*>([\s\S]*?)<\/w:p>/g;
  let match;
  const paragraphs = [];

  while ((match = paragraphRegex.exec(content)) !== null) {
    const pContent = match[1];
    const textRegex = /<w:t\b[^>]*>(.*?)<\/w:t>/g;
    let textMatch;
    let pText = '';
    
    while ((textMatch = textRegex.exec(pContent)) !== null) {
      textMatch[1] = textMatch[1]
        .replace(/&amp;/g, '&')
        .replace(/&lt;/g, '<')
        .replace(/&gt;/g, '>')
        .replace(/&quot;/g, '"')
        .replace(/&apos;/g, "'");
      pText += textMatch[1];
    }
    
    if (pText.trim()) {
      paragraphs.push(pText.trim());
    }
  }

  const outputLines = [`Parsed ${paragraphs.length} paragraphs:`, ''];
  paragraphs.forEach((p, i) => {
    outputLines.push(`[${i + 1}] ${p}`);
  });

  fs.writeFileSync(outPath, outputLines.join('\n'), 'utf-8');
  console.log(`Successfully wrote parsed output to ${outPath}`);
}

parseDasturXml();
