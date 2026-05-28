import type { PastPaper, MCQQuestion, ShortQuestion, CaseStudyQuestion } from './data/past-papers';

function isMCQ(q: object): q is MCQQuestion {
  return 'options' in q;
}
function isCaseStudy(q: object): q is CaseStudyQuestion {
  return 'sub_questions' in q;
}

export async function downloadPaperAsPDF(paper: PastPaper, board: string, cls: string, subject: string) {
  const { jsPDF } = await import('jspdf');
  const doc = new jsPDF({ unit: 'mm', format: 'a4' });

  const PAGE_W = 210;
  const MARGIN = 15;
  const CONTENT_W = PAGE_W - MARGIN * 2;
  let y = 0;

  const checkPageBreak = (needed = 8) => {
    if (y + needed > 280) {
      doc.addPage();
      y = 15;
    }
  };

  const writeLine = (text: string, opts: {
    size?: number; bold?: boolean; color?: [number, number, number];
    indent?: number; align?: 'left' | 'center'; lineHeight?: number;
  } = {}) => {
    const {
      size = 10, bold = false, color = [30, 30, 30],
      indent = 0, align = 'left', lineHeight = 5.5,
    } = opts;

    doc.setFontSize(size);
    doc.setFont('helvetica', bold ? 'bold' : 'normal');
    doc.setTextColor(...color);

    const x = MARGIN + indent;
    const maxW = CONTENT_W - indent;

    if (align === 'center') {
      const lines = doc.splitTextToSize(text, CONTENT_W);
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        doc.text(line, PAGE_W / 2, y, { align: 'center' });
        y += lineHeight;
      });
    } else {
      const lines = doc.splitTextToSize(text, maxW);
      lines.forEach((line: string) => {
        checkPageBreak(lineHeight);
        doc.text(line, x, y);
        y += lineHeight;
      });
    }
  };

  const addSpacing = (mm = 4) => { y += mm; };
  const addDivider = (color: [number, number, number] = [200, 200, 200]) => {
    checkPageBreak(4);
    doc.setDrawColor(...color);
    doc.setLineWidth(0.3);
    doc.line(MARGIN, y, PAGE_W - MARGIN, y);
    y += 4;
  };

  // ── HEADER ──────────────────────────────────────────────────
  y = 18;

  // Top blue bar
  doc.setFillColor(27, 79, 216);
  doc.rect(0, 0, PAGE_W, 12, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(255, 255, 255);
  doc.text(`${board} BOARD — ${subject.toUpperCase()} — CLASS ${cls}`, PAGE_W / 2, 8, { align: 'center' });

  // Exam title
  writeLine(paper.title, { size: 15, bold: true, color: [15, 40, 120], align: 'center' });
  addSpacing(2);
  writeLine(`Set: ${paper.set}`, { size: 9, color: [100, 100, 100], align: 'center' });
  addSpacing(3);

  // Time & Marks row
  doc.setFillColor(240, 244, 255);
  doc.roundedRect(MARGIN, y, CONTENT_W, 10, 2, 2, 'F');
  doc.setFontSize(9);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(27, 79, 216);
  doc.text(`Time Allowed: ${paper.time_allowed}`, MARGIN + 6, y + 6.5);
  doc.text(`Maximum Marks: ${paper.maximum_marks}`, PAGE_W - MARGIN - 6, y + 6.5, { align: 'right' });
  y += 14;

  // General Instructions
  writeLine('GENERAL INSTRUCTIONS', { size: 10, bold: true, color: [15, 40, 120] });
  addSpacing(2);
  paper.general_instructions.forEach((inst, i) => {
    writeLine(`${i + 1}. ${inst}`, { size: 9, color: [60, 60, 60], indent: 4, lineHeight: 5 });
  });
  addSpacing(4);
  addDivider([27, 79, 216]);

  // ── SECTIONS ────────────────────────────────────────────────
  paper.sections.forEach(section => {
    checkPageBreak(16);

    // Section header
    doc.setFillColor(27, 79, 216);
    doc.rect(MARGIN, y, CONTENT_W, 8, 'F');
    doc.setFontSize(10);
    doc.setFont('helvetica', 'bold');
    doc.setTextColor(255, 255, 255);
    const marksNote = section.marks_per_question
      ? `(${section.marks_per_question} mark${section.marks_per_question > 1 ? 's' : ''} each)`
      : '';
    doc.text(`SECTION ${section.section}: ${section.title.toUpperCase()}  ${marksNote}`, MARGIN + 4, y + 5.5);
    y += 12;

    section.questions.forEach((q) => {
      checkPageBreak(12);

      if (isCaseStudy(q)) {
        // Case Study
        addSpacing(2);
        writeLine(`Q.${q.q_no}  [Case Study — Topic: ${q.topic}]`, { size: 9.5, bold: true, color: [15, 40, 120] });
        addSpacing(1);

        // Context box
        doc.setFillColor(248, 249, 255);
        doc.setDrawColor(200, 210, 240);
        doc.setLineWidth(0.3);
        const ctxLines = doc.splitTextToSize(q.context, CONTENT_W - 12);
        const ctxH = ctxLines.length * 5 + 6;
        checkPageBreak(ctxH + 4);
        doc.roundedRect(MARGIN, y, CONTENT_W, ctxH, 2, 2, 'FD');
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 80);
        ctxLines.forEach((line: string) => { y += 5; doc.text(line, MARGIN + 4, y); });
        y += 6;

        q.sub_questions.forEach(sq => {
          checkPageBreak(10);
          writeLine(`  (${sq.part}) [${sq.marks} mark${sq.marks > 1 ? 's' : ''}]  ${sq.question}`, {
            size: 9, indent: 4, color: [30, 30, 30],
          });
          addSpacing(1);
        });

      } else if (isMCQ(q)) {
        // MCQ
        addSpacing(1.5);
        writeLine(`Q.${q.q_no}.  ${q.question}`, { size: 9.5, color: [20, 20, 60], indent: 0 });
        addSpacing(1);
        const opts = q.options;
        const cols = [
          `(a) ${opts.a}`, `(b) ${opts.b}`,
          `(c) ${opts.c}`, `(d) ${opts.d}`,
        ];
        const colW = (CONTENT_W - 8) / 2;
        checkPageBreak(10);
        doc.setFontSize(9);
        doc.setFont('helvetica', 'normal');
        doc.setTextColor(50, 50, 50);
        [0, 1].forEach(row => {
          const leftText = doc.splitTextToSize(cols[row * 2], colW - 4);
          const rightText = doc.splitTextToSize(cols[row * 2 + 1], colW - 4);
          const rowH = Math.max(leftText.length, rightText.length) * 4.5;
          checkPageBreak(rowH + 2);
          leftText.forEach((line: string, li: number) => doc.text(line, MARGIN + 6, y + li * 4.5));
          rightText.forEach((line: string, li: number) => doc.text(line, MARGIN + 6 + colW, y + li * 4.5));
          y += rowH + 2;
        });
        addSpacing(1);

      } else {
        // Short / Long Answer
        const sq = q as ShortQuestion;
        addSpacing(2);
        if (sq.parts) {
          writeLine(`Q.${sq.q_no}.  [Topic: ${sq.topic}]`, { size: 9.5, bold: true, color: [20, 20, 60] });
          sq.parts.forEach(p => {
            addSpacing(1);
            const label = p.note ? `(${p.part}) [OR]  ${p.question}` : `(${p.part})  ${p.question}`;
            writeLine(label, { size: 9, indent: 4, color: [30, 30, 30] });
          });
        } else {
          writeLine(`Q.${sq.q_no}.  ${sq.question || ''}`, { size: 9.5, color: [20, 20, 60] });
        }
        addSpacing(1);
      }
    });

    addSpacing(4);
    addDivider();
  });

  // ── FOOTER on each page ──────────────────────────────────────
  const totalPages = (doc as unknown as { internal: { getNumberOfPages: () => number } }).internal.getNumberOfPages();
  for (let i = 1; i <= totalPages; i++) {
    doc.setPage(i);
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.setTextColor(150, 150, 150);
    doc.text(`PaperPredictor.in  ·  ${paper.title}  ·  Page ${i} of ${totalPages}`, PAGE_W / 2, 292, { align: 'center' });
  }

  const filename = `${board}_Class${cls}_${subject.replace(/\s+/g, '_')}_${paper.year}_Board_Paper.pdf`;
  doc.save(filename);
}
