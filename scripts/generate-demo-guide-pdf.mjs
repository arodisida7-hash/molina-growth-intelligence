import fs from "node:fs";
import path from "node:path";

const inputPath = path.resolve("DEMO_GUIDE.md");
const outputPath = path.resolve("DEMO_GUIDE.pdf");

const pageWidth = 612;
const pageHeight = 792;
const margin = 54;
const contentWidth = pageWidth - margin * 2;

const styles = {
  h1: { font: "F2", size: 22, lineHeight: 28, indent: 0, spacingBefore: 0, spacingAfter: 8 },
  h2: { font: "F2", size: 16, lineHeight: 22, indent: 0, spacingBefore: 10, spacingAfter: 4 },
  h3: { font: "F2", size: 12, lineHeight: 18, indent: 0, spacingBefore: 8, spacingAfter: 2 },
  body: { font: "F1", size: 11, lineHeight: 16, indent: 0, spacingBefore: 0, spacingAfter: 0 },
  bullet: { font: "F1", size: 11, lineHeight: 16, indent: 14, spacingBefore: 0, spacingAfter: 0 },
  quote: { font: "F1", size: 11, lineHeight: 16, indent: 12, spacingBefore: 4, spacingAfter: 0 },
  rule: { font: "F1", size: 11, lineHeight: 10, indent: 0, spacingBefore: 6, spacingAfter: 6 }
};

const averageWidthFactor = {
  F1: 0.6,
  F2: 0.58
};

function wrapText(text, style) {
  const maxChars = Math.max(20, Math.floor((contentWidth - style.indent) / (style.size * averageWidthFactor[style.font])));
  const words = text.split(/\s+/).filter(Boolean);
  const lines = [];
  let current = "";

  for (const word of words) {
    const next = current ? `${current} ${word}` : word;
    if (next.length <= maxChars) {
      current = next;
    } else {
      if (current) lines.push(current);
      current = word;
    }
  }

  if (current) lines.push(current);
  return lines.length ? lines : [""];
}

function parseMarkdown(markdown) {
  const rawLines = markdown.replace(/\r/g, "").split("\n");
  const blocks = [];
  let paragraph = [];

  const flushParagraph = () => {
    if (paragraph.length) {
      blocks.push({ type: "body", text: paragraph.join(" ").trim() });
      paragraph = [];
    }
  };

  for (const rawLine of rawLines) {
    const line = rawLine.trimEnd();

    if (!line.trim()) {
      flushParagraph();
      blocks.push({ type: "blank" });
      continue;
    }

    if (line === "---") {
      flushParagraph();
      blocks.push({ type: "rule", text: "------------------------------------------------------------" });
      continue;
    }

    if (line.startsWith("# ")) {
      flushParagraph();
      blocks.push({ type: "h1", text: line.slice(2).trim() });
      continue;
    }

    if (line.startsWith("## ")) {
      flushParagraph();
      blocks.push({ type: "h2", text: line.slice(3).trim() });
      continue;
    }

    if (line.startsWith("### ")) {
      flushParagraph();
      blocks.push({ type: "h3", text: line.slice(4).trim() });
      continue;
    }

    if (line.startsWith("- ")) {
      flushParagraph();
      blocks.push({ type: "bullet", text: `• ${line.slice(2).trim()}` });
      continue;
    }

    if (line.startsWith("`") && line.endsWith("`")) {
      flushParagraph();
      blocks.push({ type: "quote", text: line.slice(1, -1).trim() });
      continue;
    }

    paragraph.push(line.trim());
  }

  flushParagraph();
  return blocks;
}

function layoutBlocks(blocks) {
  const pages = [];
  let currentPage = [];
  let y = pageHeight - margin;

  const pushPage = () => {
    if (currentPage.length) {
      pages.push(currentPage);
      currentPage = [];
    }
    y = pageHeight - margin;
  };

  for (const block of blocks) {
    if (block.type === "blank") {
      y -= 8;
      continue;
    }

    const style = styles[block.type];
    if (!style) continue;

    const lines = wrapText(block.text, style);
    const neededHeight = style.spacingBefore + lines.length * style.lineHeight + style.spacingAfter;

    if (y - neededHeight < margin) {
      pushPage();
    }

    y -= style.spacingBefore;

    for (const line of lines) {
      currentPage.push({
        x: margin + style.indent,
        y,
        text: line,
        font: style.font,
        size: style.size
      });
      y -= style.lineHeight;
    }

    y -= style.spacingAfter;
  }

  pushPage();
  return pages;
}

function escapePdfText(text) {
  return text.replace(/\\/g, "\\\\").replace(/\(/g, "\\(").replace(/\)/g, "\\)");
}

function buildContentStream(pageLines) {
  return pageLines
    .map((line) => `BT\n/${line.font} ${line.size} Tf\n1 0 0 1 ${line.x.toFixed(2)} ${line.y.toFixed(2)} Tm\n(${escapePdfText(line.text)}) Tj\nET`)
    .join("\n");
}

function buildPdf(pages) {
  const objects = [];

  const addObject = (content) => {
    objects.push(content);
    return objects.length;
  };

  const fontRegular = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Courier >>");
  const fontBold = addObject("<< /Type /Font /Subtype /Type1 /BaseFont /Helvetica-Bold >>");

  const pageObjectNumbers = [];

  for (const page of pages) {
    const stream = buildContentStream(page);
    const streamObjectNumber = addObject(`<< /Length ${Buffer.byteLength(stream, "utf8")} >>\nstream\n${stream}\nendstream`);
    const pageObjectNumber = addObject(
      `<< /Type /Page /Parent 0 0 R /MediaBox [0 0 ${pageWidth} ${pageHeight}] /Resources << /Font << /F1 ${fontRegular} 0 R /F2 ${fontBold} 0 R >> >> /Contents ${streamObjectNumber} 0 R >>`
    );
    pageObjectNumbers.push(pageObjectNumber);
  }

  const pagesObjectNumber = addObject(
    `<< /Type /Pages /Count ${pageObjectNumbers.length} /Kids [${pageObjectNumbers.map((number) => `${number} 0 R`).join(" ")}] >>`
  );

  const catalogObjectNumber = addObject(`<< /Type /Catalog /Pages ${pagesObjectNumber} 0 R >>`);

  for (const pageObjectNumber of pageObjectNumbers) {
    objects[pageObjectNumber - 1] = objects[pageObjectNumber - 1].replace("/Parent 0 0 R", `/Parent ${pagesObjectNumber} 0 R`);
  }

  let pdf = "%PDF-1.4\n";
  const offsets = [0];

  objects.forEach((object, index) => {
    offsets.push(Buffer.byteLength(pdf, "utf8"));
    pdf += `${index + 1} 0 obj\n${object}\nendobj\n`;
  });

  const xrefOffset = Buffer.byteLength(pdf, "utf8");
  pdf += `xref\n0 ${objects.length + 1}\n`;
  pdf += "0000000000 65535 f \n";

  for (let i = 1; i < offsets.length; i += 1) {
    pdf += `${String(offsets[i]).padStart(10, "0")} 00000 n \n`;
  }

  pdf += `trailer\n<< /Size ${objects.length + 1} /Root ${catalogObjectNumber} 0 R >>\nstartxref\n${xrefOffset}\n%%EOF`;
  return pdf;
}

const markdown = fs.readFileSync(inputPath, "utf8");
const blocks = parseMarkdown(markdown);
const pages = layoutBlocks(blocks);
const pdf = buildPdf(pages);

fs.writeFileSync(outputPath, Buffer.from(pdf, "binary"));
console.log(`PDF generado en ${outputPath}`);
