/**
 * Matching Engine — Text-based matching against enriched foundation data
 * AI layer will be integrated later (e.g., Gemini API)
 */

import { Foundation, mockFoundations } from "@/data/mockFoundations";

export interface QuestionnaireData {
  sensitiveConsent?: boolean;
  name?: string;
  age?: string;
  address?: string;
  email?: string;
  phone?: string;
  supportType?: string;
  situation?: string;
  fundingPurpose?: string;
  amountNeeded?: string;
  deadline?: string;
  institutionType?: string;
  institutionPurpose?: string;
  institutionAmount?: string;
  institutionDeadline?: string;
  projectInstitutionType?: string;
  projectDescription?: string;
  projectDuration?: string;
  projectAmount?: string;
  enrolledInSwissUni?: string;
  universityName?: string;
  residencyStatus?: string;
  zipCode?: string;
}

export type RecommendationTag = "HIGH" | "MEDIUM" | "LOW";

export interface MatchResult {
  foundation: Foundation;
  score: number;
  tag: RecommendationTag;
  reasons: string[];
  isUrgent?: boolean;
}

export function getRecommendationTag(score: number): RecommendationTag {
  if (score > 55) return "HIGH";
  if (score >= 30) return "MEDIUM";
  return "LOW";
}

export function getTagColor(tag: RecommendationTag): string {
  switch (tag) {
    case "HIGH": return "bg-success text-success-foreground";
    case "MEDIUM": return "bg-accent text-accent-foreground";
    case "LOW": return "bg-destructive text-destructive-foreground";
  }
}

function checkUrgent(deadline: string | undefined): boolean {
  if (!deadline) return false;
  const deadlineDate = new Date(deadline);
  if (isNaN(deadlineDate.getTime())) return false;
  const diffMs = deadlineDate.getTime() - new Date().getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return diffDays >= 0 && diffDays <= 14;
}

/** Keyword groups for matching against zielgruppe + description (German) */
const keywordGroups: Record<string, string[]> = {
  jugend: ["jugend", "kinder", "familie", "familien", "junge", "minderjährig", "erziehung", "youth", "child", "family", "kid", "baby", "parent", "son", "daughter"],
  alter: ["alter", "ältere", "senioren", "seniorinnen", "betagte", "altersheim", "elderly", "senior", "aged", "retirement", "pension"],
  behinderung: ["behinderung", "behinderte", "handicap", "invalid", "einschränkung", "disability", "disabled", "wheelchair", "blind", "deaf", "impairment"],
  gesundheit: ["gesundheit", "krankheit", "medizin", "therapie", "behandlung", "operation", "spital", "krebs", "surgery", "medical", "health", "hospital", "treatment", "illness", "disease", "cancer"],
  migration: ["migration", "flüchtling", "asyl", "integration", "ausländer", "immigrant", "refugee", "asylum", "foreign"],
  ausbildung: ["ausbildung", "bildung", "studium", "schule", "universität", "stipendium", "lehre", "weiterbildung", "education", "university", "school", "study", "scholarship", "training", "student"],
  armut: ["armut", "not", "bedürftig", "finanziell", "sozialhilfe", "schulden", "existenz", "poverty", "debt", "financial", "emergency", "rent", "bills", "homeless", "notlage"],
  sucht: ["sucht", "drogen", "alkohol", "abhängigkeit", "addiction", "substance"],
  frauen: ["frauen", "mütter", "schwanger", "women", "mother", "pregnant"],
};

function matchKeywords(text: string, userTexts: string): number {
  const combined = (text + " " + userTexts).toLowerCase();
  let matchCount = 0;
  for (const keywords of Object.values(keywordGroups)) {
    if (keywords.some(kw => combined.includes(kw))) {
      matchCount++;
    }
  }
  return matchCount;
}

function matchApplicantType(userType: string | undefined, foundationType: string): boolean {
  if (!userType) return true;
  if (foundationType === "both") return true;
  if (userType === "private" || userType === "education") return foundationType === "private" || foundationType === "both";
  if (userType === "institution" || userType === "project") return foundationType === "institution" || foundationType === "both";
  return true;
}

function matchDeadline(userDeadline: string | undefined, f: Foundation): { matches: boolean; bonus: number } {
  if (!userDeadline) return { matches: true, bonus: 0 };
  if (f.deadline_type === "rolling") return { matches: true, bonus: 10 };
  
  const userDate = new Date(userDeadline);
  if (isNaN(userDate.getTime())) return { matches: true, bonus: 0 };
  const userMonth = userDate.getMonth() + 1;
  
  if (f.deadline_months && f.deadline_months.length > 0) {
    // Check if user's deadline month aligns with foundation's deadline months
    const closest = f.deadline_months.reduce((best, m) => {
      const diff = Math.abs(m - userMonth);
      return diff < Math.abs(best - userMonth) ? m : best;
    }, f.deadline_months[0]);
    if (f.deadline_months.includes(userMonth) || Math.abs(closest - userMonth) <= 2) {
      return { matches: true, bonus: 15 };
    }
    return { matches: true, bonus: 0 };
  }
  
  return { matches: true, bonus: 5 };
}

function matchResidency(userStatus: string | undefined, foundationReq: string): boolean {
  if (!userStatus || foundationReq === "unknown") return true;
  if (foundationReq === "swiss_citizen") {
    return userStatus === "swiss-citizen";
  }
  if (foundationReq === "swiss_resident") {
    return ["swiss-citizen", "permit-b", "permit-c", "permit-l"].includes(userStatus);
  }
  return true;
}

export function matchFunding(data: QuestionnaireData): MatchResult[] {
  const isUrgent = checkUrgent(data.deadline || data.institutionDeadline);
  const userTexts = [data.fundingPurpose, data.institutionPurpose, data.projectDescription, data.situation]
    .filter(Boolean).join(" ").toLowerCase();
  const userSituation = (data.situation || "").toLowerCase();

  const results: MatchResult[] = mockFoundations
    .filter(f => matchApplicantType(data.supportType, f.applicant_type))
    .map((f) => {
      let score = 0;
      const reasons: string[] = [];

      // 1. Applicant type match (base score)
      if (data.supportType) {
        if (f.applicant_type === "both") {
          score += 10;
          reasons.push("Accepts your applicant type");
        } else if (
          (data.supportType === "private" || data.supportType === "education") && f.applicant_type === "private" ||
          (data.supportType === "institution" || data.supportType === "project") && f.applicant_type === "institution"
        ) {
          score += 15;
          reasons.push("Direct applicant type match");
        }
      }

      // 2. Keyword matching against zielgruppe + description
      const foundationText = `${f.zielgruppe} ${f.description} ${f.target_group}`.toLowerCase();
      let keywordMatches = 0;

      for (const [group, keywords] of Object.entries(keywordGroups)) {
        const foundationHas = keywords.some(kw => foundationText.includes(kw));
        const userHas = keywords.some(kw => userTexts.includes(kw));
        if (foundationHas && userHas) {
          keywordMatches++;
        }
        // Also match situation
        if (foundationHas && keywords.some(kw => userSituation.includes(kw))) {
          keywordMatches++;
        }
      }

      if (keywordMatches > 0) {
        score += Math.min(keywordMatches * 12, 50);
        reasons.push(`${keywordMatches} keyword match${keywordMatches > 1 ? "es" : ""}`);
      }

      // 3. Situation-based bonus
      if (data.situation) {
        if (data.situation === "single-parent" && foundationText.includes("famili")) {
          score += 10;
          reasons.push("Family support available");
        }
        if (data.situation === "single" && (foundationText.includes("not") || foundationText.includes("bedürftig"))) {
          score += 10;
          reasons.push("Supports individuals in need");
        }
      }

      // 4. Education-specific bonus
      if (data.supportType === "education" && (foundationText.includes("ausbildung") || foundationText.includes("stipend") || foundationText.includes("studium") || foundationText.includes("bildung"))) {
        score += 15;
        reasons.push("Education funding available");
      }

      // 5. Deadline matching
      const deadline = data.deadline || data.institutionDeadline;
      const deadlineResult = matchDeadline(deadline, f);
      if (deadlineResult.bonus > 0) {
        score += deadlineResult.bonus;
        reasons.push(f.deadline_type === "rolling" ? "Rolling deadline" : "Deadline aligns");
      }

      // 6. Residency matching
      if (data.residencyStatus) {
        const resMatch = matchResidency(data.residencyStatus, f.residence_requirement);
        if (resMatch) {
          score += 5;
          reasons.push("Residency eligible");
        } else {
          score -= 20;
          reasons.push("Residency may not match");
        }
      }

      // 7. Intermediary flag
      if (f.requires_intermediary) {
        reasons.push("Requires intermediary (e.g., social worker)");
      }

      // 8. General text similarity — if user's free text has any word in foundation description
      if (userTexts.length > 5) {
        const userWords = userTexts.split(/\s+/).filter(w => w.length > 4);
        const descWords = foundationText.split(/\s+/);
        const overlap = userWords.filter(w => descWords.some(d => d.includes(w))).length;
        if (overlap > 0) {
          score += Math.min(overlap * 3, 15);
        }
      }

      const clampedScore = Math.max(0, Math.min(score, 100));
      const tag = getRecommendationTag(clampedScore);

      return { foundation: f, score: clampedScore, tag, reasons, isUrgent };
    });

  return results.filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
}

// Database source will be connected later
export function fetchFoundations(): Foundation[] {
  return mockFoundations;
}
