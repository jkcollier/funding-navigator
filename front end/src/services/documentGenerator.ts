import {
  Document, Packer, Paragraph, TextRun, Table, TableRow, TableCell,
  AlignmentType, BorderStyle, WidthType, ShadingType, HeadingLevel, PageBreak
} from "docx";
import { saveAs } from "file-saver";
import { Foundation } from "@/data/mockFoundations";
import { QuestionnaireData } from "@/services/matchingEngine";

function getCategoryLabels(f: Foundation): string[] {
  const labels: string[] = [];
  if (f.jugendFamilie) labels.push("Youth & Family");
  if (f.aeltereMenschen) labels.push("Elderly");
  if (f.behinderungen) labels.push("Disabilities");
  if (f.gesundheit) labels.push("Health");
  if (f.migration) labels.push("Migration");
  if (f.ausbildung) labels.push("Education");
  if (f.armut) labels.push("Poverty");
  return labels;
}

function getUserData(): Record<string, string> {
  try {
    const raw = localStorage.getItem("fn-user-data");
    return raw ? JSON.parse(raw) : {};
  } catch { return {}; }
}

const cellBorder = { style: BorderStyle.SINGLE, size: 1, color: "CCCCCC" };
const cellBorders = { top: cellBorder, bottom: cellBorder, left: cellBorder, right: cellBorder };
const cellMargins = { top: 80, bottom: 80, left: 120, right: 120 };

function infoRow(label: string, value: string): TableRow {
  return new TableRow({
    children: [
      new TableCell({
        borders: cellBorders, margins: cellMargins,
        width: { size: 4000, type: WidthType.DXA },
        shading: { fill: "E8F0FE", type: ShadingType.CLEAR },
        children: [new Paragraph({ children: [new TextRun({ text: label, bold: true, size: 22, font: "Arial" })] })],
      }),
      new TableCell({
        borders: cellBorders, margins: cellMargins,
        width: { size: 5360, type: WidthType.DXA },
        children: [new Paragraph({ children: [new TextRun({ text: value || "—", size: 22, font: "Arial" })] })],
      }),
    ],
  });
}

export async function generateApplicationDoc(foundation: Foundation, questionnaire?: QuestionnaireData) {
  const u = getUserData();
  const q = questionnaire || {} as any;

  const fullName = q.name || u.name || "";
  const email = q.email || u.email || "";
  const phone = q.phone || u.phone || "";
  const address = q.address || u.address || "";
  const applicantType = q.supportType || u.supportType || "Private Person";
  const fundingPurpose = q.fundingPurpose || q.institutionPurpose || q.projectDescription || u.fundingPurpose || "";
  const amount = q.amountNeeded || q.institutionAmount || q.projectAmount || u.amountNeeded || "";
  const deadline = q.deadline || q.institutionDeadline || u.deadline || "";
  const duration = q.projectDuration || u.projectDuration || "N/A";
  const situation = q.situation || u.situation || "";
  const categories = getCategoryLabels(foundation).join(", ") || "General Support";
  const benefitDescription = fundingPurpose
    ? `address my needs related to ${fundingPurpose}`
    : "improve my current situation and work towards stability";

  const doc = new Document({
    styles: {
      default: { document: { run: { font: "Arial", size: 24 } } },
      paragraphStyles: [
        { id: "Heading1", name: "Heading 1", basedOn: "Normal", next: "Normal", quickFormat: true,
          run: { size: 32, bold: true, font: "Arial", color: "003A8F" },
          paragraph: { spacing: { before: 240, after: 120 } } },
      ],
    },
    sections: [{
      properties: {
        page: {
          size: { width: 11906, height: 16838 },
          margin: { top: 1440, right: 1440, bottom: 1440, left: 1440 },
        },
      },
      children: [
        new Paragraph({ alignment: AlignmentType.CENTER, spacing: { after: 300 }, children: [
          new TextRun({ text: "Funding Application Form", bold: true, size: 36, font: "Arial", color: "003A8F" }),
        ]}),

        // Section 1
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("1. Applicant Information")] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4000, 5360],
          rows: [
            infoRow("Full Name [AUTO-FILLED]", fullName),
            infoRow("Email Address [AUTO-FILLED]", email),
            infoRow("Phone Number [AUTO-FILLED]", phone),
            infoRow("Address [AUTO-FILLED]", address),
            infoRow("Applicant Type [AUTO-FILLED]", applicantType),
          ],
        }),

        // Section 2
        new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400 }, children: [new TextRun("2. Funding Request")] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4000, 5360],
          rows: [
            infoRow("Purpose of Funding [AUTO-FILLED]", fundingPurpose),
            infoRow("Amount Requested [AUTO-FILLED]", amount),
            infoRow("Deadline [AUTO-FILLED]", deadline),
            infoRow("Project Duration [AUTO-FILLED]", duration),
          ],
        }),

        // Section 3
        new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400 }, children: [new TextRun("3. Organization Details")] }),
        new Table({
          width: { size: 9360, type: WidthType.DXA },
          columnWidths: [4000, 5360],
          rows: [
            infoRow("Organization Name [AUTO-FILLED]", foundation.name),
            infoRow("Organization Category [AUTO-FILLED]", categories),
          ],
        }),

        // Section 4 - Application Letter
        new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 400 }, children: [new TextRun("4. Application Letter")] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ text: `Dear ${foundation.name},`, size: 22 })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ size: 22,
          text: `I am writing to respectfully request financial assistance for ${fundingPurpose || "my current needs"}. I am currently in the following situation: ${situation || "facing financial difficulties"}. Due to these circumstances, I require financial support of ${amount || "the appropriate amount"} by ${deadline || "the earliest convenience"}.`,
        })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ size: 22,
          text: `I believe your organization is a suitable match for my request because of your focus on ${categories} and your commitment to supporting individuals in similar situations. Your assistance would significantly help me address my current challenges.`,
        })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ size: 22,
          text: `Receiving this support would allow me to ${benefitDescription}. This support would have a meaningful impact on my situation and help me move forward towards stability and long-term improvement.`,
        })] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ size: 22, text: "Thank you very much for considering my application. I would be grateful for any support you can provide." })] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ size: 22, text: "Kind regards," })] }),
        new Paragraph({ spacing: { after: 300 }, children: [new TextRun({ size: 22, text: fullName || "_______________" })] }),

        // Section 5 - Declaration
        new Paragraph({ heading: HeadingLevel.HEADING_1, children: [new TextRun("5. Declaration")] }),
        new Paragraph({ spacing: { after: 200 }, children: [new TextRun({ size: 22, text: "I confirm that the information provided is accurate and complete." })] }),
        new Paragraph({ spacing: { after: 100 }, children: [new TextRun({ size: 22, text: "Signature: ______________________________" })] }),
        new Paragraph({ children: [new TextRun({ size: 22, text: `Date: ${new Date().toLocaleDateString("de-CH")}` })] }),
      ],
    }],
  });

  const blob = await Packer.toBlob(doc);
  const fileName = `Application_${foundation.name.replace(/[^a-zA-Z0-9]/g, "_")}.docx`;
  saveAs(blob, fileName);
}
