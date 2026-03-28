/**
 * Matching Engine — Rule-based fallback
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
}

export interface MatchResult {
  foundation: Foundation;
  score: number;
  reasons: string[];
}

/**
 * AI placeholder: keyword extraction from user's free-text inputs
 * AI layer will be integrated later (e.g., Gemini API)
 */
function extractCategoryFlags(data: QuestionnaireData): Partial<Record<keyof Foundation, boolean>> {
  const flags: Partial<Record<string, boolean>> = {};

  // Support type mapping
  if (data.supportType === "private") flags.privatpersonen = true;
  if (data.supportType === "institution") flags.institutionen = true;
  if (data.supportType === "education") {
    flags.ausbildung = true;
    flags.privatpersonen = true;
  }
  if (data.supportType === "project") flags.institutionen = true;

  // Situation mapping
  if (data.situation === "single-parent" || data.situation === "single") {
    flags.armut = true;
  }

  // Keyword extraction from free text
  const texts = [data.fundingPurpose, data.institutionPurpose, data.projectDescription]
    .filter(Boolean).join(" ").toLowerCase();

  const keywordMap: Record<string, string[]> = {
    jugendFamilie: ["child", "family", "daughter", "son", "youth", "kinder", "familie", "jugend", "kid", "baby", "parent"],
    aeltereMenschen: ["elderly", "senior", "retirement", "alter", "pension", "aged", "old"],
    gesundheit: ["surgery", "medical", "health", "hospital", "treatment", "krankheit", "gesundheit", "operation", "illness", "disease", "cancer", "therapy"],
    migration: ["migration", "refugee", "asylum", "integration", "immigrant", "foreign", "ausländer"],
    ausbildung: ["education", "university", "school", "study", "ausbildung", "studium", "scholarship", "training", "course"],
    armut: ["poverty", "debt", "financial", "emergency", "armut", "schulden", "rent", "bills", "homeless"],
    behinderungen: ["disability", "disabled", "behinderung", "wheelchair", "blind", "deaf", "impairment"],
  };

  for (const [flag, keywords] of Object.entries(keywordMap)) {
    if (keywords.some((kw) => texts.includes(kw))) {
      flags[flag] = true;
    }
  }

  return flags as Partial<Record<keyof Foundation, boolean>>;
}

export function matchFunding(data: QuestionnaireData): MatchResult[] {
  const userFlags = extractCategoryFlags(data);
  const flagKeys = ["jugendFamilie", "aeltereMenschen", "behinderungen", "gesundheit", "migration", "ausbildung", "armut", "privatpersonen", "institutionen"] as const;

  const results: MatchResult[] = mockFoundations.map((f) => {
    let score = 0;
    const reasons: string[] = [];

    // Filter out overloaded foundations
    if (f.ausgelastet) {
      return { foundation: f, score: 0, reasons: ["Currently at capacity"] };
    }

    // Match category flags
    let matchCount = 0;
    for (const key of flagKeys) {
      if (userFlags[key] && f[key]) {
        matchCount++;
      }
    }

    if (matchCount > 0) {
      score += Math.min(matchCount * 15, 75);
      reasons.push(`${matchCount} category match${matchCount > 1 ? "es" : ""}`);
    }

    // Support type bonus
    if (data.supportType === "private" && f.privatpersonen) {
      score += 15;
      reasons.push("Supports private persons");
    }
    if (data.supportType === "institution" && f.institutionen) {
      score += 15;
      reasons.push("Supports institutions");
    }
    if (data.supportType === "education" && f.ausbildung) {
      score += 15;
      reasons.push("Education funding available");
    }

    return { foundation: f, score: Math.min(score, 100), reasons };
  });

  return results.filter((r) => r.score > 0).sort((a, b) => b.score - a.score);
}

// Database source will be connected later
export function fetchFoundations(): Foundation[] {
  return mockFoundations;
}
