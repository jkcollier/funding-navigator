// German → English translation mappings for foundation data fields
// Used to auto-translate foundation info when language is English

const termMap: Record<string, string> = {
  // Target groups
  "Privatpersonen": "Private individuals",
  "Institutionen": "Institutions",
  "Organisationen": "Organizations",
  "Jugendliche": "Youth",
  "Kinder": "Children",
  "Familien": "Families",
  "Frauen": "Women",
  "Männer": "Men",
  "Senioren": "Seniors",
  "Betagte": "Elderly",
  "Menschen mit Behinderung": "People with disabilities",
  "Behinderte": "People with disabilities",
  "Migrantinnen und Migranten": "Migrants",
  "Migrant/innen": "Migrants",
  "Flüchtlinge": "Refugees",
  "Studierende": "Students",
  "Auszubildende": "Trainees",
  "Lehrlinge": "Apprentices",
  "Alleinerziehende": "Single parents",
  "Obdachlose": "Homeless people",
  "Suchtbetroffene": "People affected by addiction",
  "psychisch Kranke": "Mentally ill people",
  "chronisch Kranke": "Chronically ill people",
  "Arbeitslose": "Unemployed people",
  "Sozialhilfeempfänger": "Social welfare recipients",
  "Künstler/innen": "Artists",
  "Kunstschaffende": "Artists",
  "Vereine": "Associations",
  "Stiftungen": "Foundations",
  "Gemeinnützige Organisationen": "Non-profit organizations",
  "Genossenschaften": "Cooperatives",
  "Kirchgemeinden": "Church communities",

  // Common description terms
  "Dachstiftung": "Umbrella foundation",
  "gemeinnützige": "non-profit",
  "gemeinnützig": "non-profit",
  "Stiftung": "Foundation",
  "Verein": "Association",
  "Förderung": "Funding",
  "Unterstützung": "Support",
  "Bildung": "Education",
  "Ausbildung": "Training",
  "Weiterbildung": "Further education",
  "Gesundheit": "Health",
  "Kultur": "Culture",
  "Soziales": "Social welfare",
  "Wissenschaft": "Science",
  "Forschung": "Research",
  "Umwelt": "Environment",
  "Entwicklungshilfe": "Development aid",
  "Integration": "Integration",
  "Prävention": "Prevention",
  "Rehabilitation": "Rehabilitation",
  "Beratung": "Counseling",
  "Projekte": "Projects",
  "Projekt": "Project",
  "Schweiz": "Switzerland",
  "Kanton Zürich": "Canton of Zurich",
  "Zürich": "Zurich",
  "Armut": "Poverty",
  "Not": "Hardship",
  "Notlage": "Emergency situation",
  "finanzielle Unterstützung": "Financial support",
  "finanzielle Not": "Financial hardship",
  "soziale Projekte": "Social projects",
  "kulturelle Projekte": "Cultural projects",
  "ökologische Projekte": "Ecological projects",
  "wissenschaftliche Projekte": "Scientific projects",
  "Stipendien": "Scholarships",
  "Stipendium": "Scholarship",
  "Beiträge": "Contributions",
  "Zuschüsse": "Grants",
  "Darlehen": "Loans",
  "Einmalzahlung": "One-time payment",
  "laufende Unterstützung": "Ongoing support",

  // Deadline-related
  "Ganzes Jahr": "Year-round",
  "ganzes Jahr": "Year-round",
  "laufend": "Rolling",
  "Laufend": "Rolling",
  "jederzeit": "At any time",
  "Jederzeit": "At any time",
  "keine Frist": "No deadline",
  "Frühling": "Spring",
  "Sommer": "Summer",
  "Herbst": "Autumn",
  "Winter": "Winter",
  "Januar": "January",
  "Februar": "February",
  "März": "March",
  "April": "April",
  "Mai": "May",
  "Juni": "June",
  "Juli": "July",
  "August": "August",
  "September": "September",
  "Oktober": "October",
  "November": "November",
  "Dezember": "December",
  "Stiftungsrat": "Foundation board",
  "Vergabungskommission": "Allocation committee",
  "Eingehende Anfragen": "Incoming requests",
  "behandelt": "processed",
  "tagt": "convenes",
  "tagen": "convene",
  "pro Jahr": "per year",
  "zweimal": "twice",
  "dreimal": "three times",
  "einmal": "once",
  "jährlich": "annually",
  "Spezialformular anfordern": "Request special form",

  // Beilagen / documents
  "Lebenslauf": "CV / Resume",
  "Budget": "Budget",
  "Projektbeschrieb": "Project description",
  "Projektbeschreibung": "Project description",
  "Kostenvoranschlag": "Cost estimate",
  "Referenzen": "References",
  "Empfehlungsschreiben": "Letter of recommendation",
  "Motivationsschreiben": "Motivation letter",
  "Steuererklärung": "Tax return",
  "Steuerausweis": "Tax certificate",
  "Betreibungsauszug": "Debt collection extract",
  "Lohnausweis": "Salary statement",
  "Sozialhilfebestätigung": "Social welfare confirmation",
  "Mietvertrag": "Rental agreement",
  "Arztzeugnis": "Medical certificate",
  "Aufenthaltsbewilligung": "Residence permit",
  "Ausweiskopie": "ID copy",
  "Jahresrechnung": "Annual financial statement",
  "Jahresbericht": "Annual report",
  "Statuten": "Statutes / Bylaws",
  "Handelsregisterauszug": "Commercial register extract",
  "Steuerbefreiung": "Tax exemption",

  // Empfangsstelle
  "Geschäftsstelle": "Head office",
  "Sekretariat": "Secretariat",
  "Präsident": "President",
  "Geschäftsführer": "Managing director",
  "Geschäftsführerin": "Managing director",

  // Residence requirements
  "Wohnsitz": "Residence",
  "Kanton": "Canton",
  "Gemeinde": "Municipality",
  "Einwohner": "Resident",
  "Bürger": "Citizen",
  "Ausländer": "Foreign national",
  "Niederlassungsbewilligung": "Settlement permit",

  // Deadline types
  "rolling": "Rolling",
  "annual": "Annual",
  "biannual": "Biannual",
  "quarterly": "Quarterly",
};

// Sort terms by length descending so longer phrases match first
const sortedTerms = Object.entries(termMap).sort((a, b) => b[0].length - a[0].length);

/**
 * Translate a German text field to English using term mapping.
 * If language is "de" or text is empty, returns original.
 */
export function translateField(text: string | undefined | null, language: string): string {
  if (!text) return "";
  if (language === "de") return text;

  let result = text;
  for (const [de, en] of sortedTerms) {
    // Use word boundary-aware replacement
    const regex = new RegExp(de.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "gi");
    result = result.replace(regex, en);
  }
  return result;
}

/**
 * Translate a comma/semicolon separated list (like zielgruppe or beilagen)
 */
export function translateList(text: string | undefined | null, language: string): string[] {
  if (!text) return [];
  const items = text.split(/[,;/]/).map(s => s.trim()).filter(Boolean);
  if (language === "de") return items;
  return items.map(item => translateField(item, language));
}
