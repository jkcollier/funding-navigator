import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { useLanguage } from "@/contexts/LanguageContext";
import { zurichUniversities } from "@/data/zurichUniversities";
import EmergencyBell from "@/components/EmergencyBell";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, SkipForward } from "lucide-react";

type SupportType = "" | "private" | "institution" | "project" | "education";

interface FormData {
  // Sensitive info
  name: string;
  age: string;
  address: string;
  email: string;
  phone: string;
  // Support type
  supportType: SupportType;
  // Private person
  situation: string;
  fundingPurpose: string;
  amountNeeded: string;
  deadline: string;
  // Institution
  institutionType: string;
  institutionPurpose: string;
  institutionAmount: string;
  institutionDeadline: string;
  // Project
  projectInstitutionType: string;
  projectDescription: string;
  projectDuration: string;
  projectAmount: string;
  // Education
  enrolledInSwissUni: string;
  universityName: string;
}

const initialFormData: FormData = {
  name: "", age: "", address: "", email: "", phone: "",
  supportType: "",
  situation: "", fundingPurpose: "", amountNeeded: "", deadline: "",
  institutionType: "", institutionPurpose: "", institutionAmount: "", institutionDeadline: "",
  projectInstitutionType: "", projectDescription: "", projectDuration: "", projectAmount: "",
  enrolledInSwissUni: "", universityName: "",
};

export default function FindFunding() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const sensitiveConsent = (location.state as any)?.sensitiveConsent ?? false;

  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialFormData);

  const update = (fields: Partial<FormData>) => setData((d) => ({ ...d, ...fields }));

  // Determine steps based on consent + support type
  const getSteps = () => {
    const steps: string[] = [];
    if (sensitiveConsent) steps.push("personal-info");
    steps.push("support-type");
    if (data.supportType === "private") steps.push("private-details");
    else if (data.supportType === "institution") steps.push("institution-details");
    else if (data.supportType === "project") steps.push("project-details");
    else if (data.supportType === "education") steps.push("education-details");
    if (data.supportType) steps.push("review");
    return steps;
  };

  const steps = getSteps();
  const totalSteps = steps.length || 2;
  const currentStepName = steps[step - 1] || "support-type";
  const progress = (step / totalSteps) * 100;

  const next = () => {
    if (step < totalSteps) setStep(step + 1);
    else {
      // Save user data for profile page
      localStorage.setItem("fn-user-data", JSON.stringify({ ...data, sensitiveConsent }));
      navigate("/results", { state: { ...data, sensitiveConsent } });
    }
  };

  // Only show skip on personal-info step
  const showSkip = currentStepName === "personal-info";
  const back = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/require-funding");
  };

  const canAdvance = () => {
    switch (currentStepName) {
      case "personal-info": return data.name.trim().length > 0;
      case "support-type": return !!data.supportType;
      case "private-details": return !!data.situation && !!data.fundingPurpose;
      case "institution-details": return !!data.institutionType && !!data.institutionPurpose;
      case "project-details": return !!data.projectDescription;
      case "education-details": return !!data.enrolledInSwissUni;
      case "review": return true;
      default: return false;
    }
  };

  return (
    <div className="min-h-[80vh] py-8">
      <EmergencyBell />
      <div className="container max-w-2xl">
        <div className="mb-8">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-muted-foreground">
              {t("Step", "Schritt")} {step} / {totalSteps}
            </span>
            <span className="text-sm text-muted-foreground">{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>

        <AnimatePresence mode="wait">
          <motion.div
            key={currentStepName}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            <Card>
              <CardHeader>
                <CardTitle className="text-xl">
                  {currentStepName === "personal-info" && t("Your Personal Information", "Ihre persönlichen Daten")}
                  {currentStepName === "support-type" && t("What kind of support are you looking for?", "Welche Art von Unterstützung suchen Sie?")}
                  {currentStepName === "private-details" && t("Tell us about your situation", "Erzählen Sie uns von Ihrer Situation")}
                  {currentStepName === "institution-details" && t("Institution Details", "Institutionsdetails")}
                  {currentStepName === "project-details" && t("Project Information", "Projektinformationen")}
                  {currentStepName === "education-details" && t("Education Funding", "Bildungsförderung")}
                  {currentStepName === "review" && t("Ready to find your funding!", "Bereit, Ihre Förderung zu finden!")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {currentStepName === "personal-info" && t("This information helps us provide more accurate matches", "Diese Informationen helfen uns, genauere Ergebnisse zu liefern")}
                  {currentStepName === "support-type" && t("Choose the option that best describes your situation", "Wählen Sie die Option, die Ihre Situation am besten beschreibt")}
                  {currentStepName === "private-details" && t("Provide details so we can find the right funding for you", "Geben Sie Details an, damit wir die richtige Förderung finden")}
                  {currentStepName === "institution-details" && t("Tell us about your institution and the support needed", "Erzählen Sie uns von Ihrer Institution und dem benötigten Support")}
                  {currentStepName === "project-details" && t("Describe your project and its goals", "Beschreiben Sie Ihr Projekt und seine Ziele")}
                  {currentStepName === "education-details" && t("Tell us about your education situation", "Erzählen Sie uns über Ihre Bildungssituation")}
                  {currentStepName === "review" && t("Click below to see your matched results", "Klicken Sie unten, um Ihre Ergebnisse zu sehen")}
                </p>
              </CardHeader>
              <CardContent className="space-y-4">
                {currentStepName === "personal-info" && (
                  <div className="space-y-3">
                    <Input placeholder={t("Full Name", "Vollständiger Name")} value={data.name} onChange={(e) => update({ name: e.target.value })} />
                    <Input placeholder={t("Age", "Alter")} type="number" value={data.age} onChange={(e) => update({ age: e.target.value })} />
                    <Input placeholder={t("Address", "Adresse")} value={data.address} onChange={(e) => update({ address: e.target.value })} />
                    <Input placeholder={t("Email", "E-Mail")} type="email" value={data.email} onChange={(e) => update({ email: e.target.value })} />
                    <Input placeholder={t("Phone", "Telefon")} type="tel" value={data.phone} onChange={(e) => update({ phone: e.target.value })} />
                  </div>
                )}

                {currentStepName === "support-type" && (
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {[
                      { value: "private" as SupportType, labelEn: "As a private person", labelDe: "Als Privatperson", descEn: "Individual seeking personal funding", descDe: "Einzelperson sucht persönliche Förderung" },
                      { value: "institution" as SupportType, labelEn: "As an institution", labelDe: "Als Institution", descEn: "On behalf of a private person", descDe: "Im Auftrag einer Privatperson" },
                      { value: "project" as SupportType, labelEn: "For project funding", labelDe: "Für Projektförderung", descEn: "Funding for a specific project", descDe: "Finanzierung für ein bestimmtes Projekt" },
                      { value: "education" as SupportType, labelEn: "For education funding", labelDe: "Für Bildungsförderung", descEn: "Support for education costs", descDe: "Unterstützung für Bildungskosten" },
                    ].map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => update({ supportType: opt.value })}
                        className={`p-4 rounded-lg border text-left transition-all hover:shadow-md ${
                          data.supportType === opt.value
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <p className="font-medium text-sm">{t(opt.labelEn, opt.labelDe)}</p>
                        <p className="text-xs text-muted-foreground mt-1">{t(opt.descEn, opt.descDe)}</p>
                      </button>
                    ))}
                  </div>
                )}

                {currentStepName === "private-details" && (
                  <div className="space-y-3">
                    <Select value={data.situation} onValueChange={(v) => update({ situation: v })}>
                      <SelectTrigger><SelectValue placeholder={t("Your situation", "Ihre Situation")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="single">{t("Single", "Alleinstehend")}</SelectItem>
                        <SelectItem value="single-parent">{t("Single parent", "Alleinerziehend")}</SelectItem>
                        <SelectItem value="married">{t("Married / Partnership", "Verheiratet / Partnerschaft")}</SelectItem>
                        <SelectItem value="applying-for-other">{t("Applying for someone else", "Antrag für eine andere Person")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder={t("What is the funding for? (e.g., 'To pay for my daughter's surgery')", "Wofür ist die Förderung? (z.B. 'Um die Operation meiner Tochter zu bezahlen')")}
                      value={data.fundingPurpose}
                      onChange={(e) => update({ fundingPurpose: e.target.value })}
                    />
                    <Input
                      placeholder={t("Amount needed (CHF)", "Benötigter Betrag (CHF)")}
                      type="number"
                      value={data.amountNeeded}
                      onChange={(e) => update({ amountNeeded: e.target.value })}
                    />
                    <Input
                      placeholder={t("By when? (e.g., June 2026)", "Bis wann? (z.B. Juni 2026)")}
                      value={data.deadline}
                      onChange={(e) => update({ deadline: e.target.value })}
                    />
                  </div>
                )}

                {currentStepName === "institution-details" && (
                  <div className="space-y-3">
                    <Select value={data.institutionType} onValueChange={(v) => update({ institutionType: v })}>
                      <SelectTrigger><SelectValue placeholder={t("Institution type", "Institutionstyp")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="npo">NPO</SelectItem>
                        <SelectItem value="volunteering">{t("Volunteering Organization", "Freiwilligenorganisation")}</SelectItem>
                        <SelectItem value="other">{t("Other", "Andere")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder={t("Purpose of funding (e.g., 'My beneficiary wants to pay for their daughter's surgery')", "Zweck der Förderung (z.B. 'Mein Begünstigter möchte die Operation seiner Tochter bezahlen')")}
                      value={data.institutionPurpose}
                      onChange={(e) => update({ institutionPurpose: e.target.value })}
                    />
                    <Input
                      placeholder={t("Amount needed (CHF)", "Benötigter Betrag (CHF)")}
                      type="number"
                      value={data.institutionAmount}
                      onChange={(e) => update({ institutionAmount: e.target.value })}
                    />
                    <Input
                      placeholder={t("By when? (e.g., June 2026)", "Bis wann? (z.B. Juni 2026)")}
                      value={data.institutionDeadline}
                      onChange={(e) => update({ institutionDeadline: e.target.value })}
                    />
                  </div>
                )}

                {currentStepName === "project-details" && (
                  <div className="space-y-3">
                    <Select value={data.projectInstitutionType} onValueChange={(v) => update({ projectInstitutionType: v })}>
                      <SelectTrigger><SelectValue placeholder={t("Institution type", "Institutionstyp")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="ngo">NGO</SelectItem>
                        <SelectItem value="npo">NPO</SelectItem>
                        <SelectItem value="volunteering">{t("Volunteering", "Freiwilligenarbeit")}</SelectItem>
                        <SelectItem value="other">{t("Other", "Andere")}</SelectItem>
                      </SelectContent>
                    </Select>
                    <Textarea
                      placeholder={t("Project description: Who is it for? Main goal? Beneficiaries?", "Projektbeschreibung: Für wen? Hauptziel? Begünstigte?")}
                      value={data.projectDescription}
                      onChange={(e) => update({ projectDescription: e.target.value })}
                      rows={4}
                    />
                    <Input
                      placeholder={t("Project duration (e.g., 6 months)", "Projektdauer (z.B. 6 Monate)")}
                      value={data.projectDuration}
                      onChange={(e) => update({ projectDuration: e.target.value })}
                    />
                    <Input
                      placeholder={t("Amount needed (CHF)", "Benötigter Betrag (CHF)")}
                      type="number"
                      value={data.projectAmount}
                      onChange={(e) => update({ projectAmount: e.target.value })}
                    />
                  </div>
                )}

                {currentStepName === "education-details" && (
                  <div className="space-y-3">
                    <Select value={data.enrolledInSwissUni} onValueChange={(v) => update({ enrolledInSwissUni: v })}>
                      <SelectTrigger><SelectValue placeholder={t("Currently enrolled in a Swiss university?", "Derzeit an einer Schweizer Universität eingeschrieben?")} /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="yes">{t("Yes", "Ja")}</SelectItem>
                        <SelectItem value="no">{t("No", "Nein")}</SelectItem>
                      </SelectContent>
                    </Select>
                    {data.enrolledInSwissUni === "yes" && (
                      <Select value={data.universityName} onValueChange={(v) => update({ universityName: v })}>
                        <SelectTrigger><SelectValue placeholder={t("Select university", "Universität auswählen")} /></SelectTrigger>
                        <SelectContent>
                          {zurichUniversities.map((u) => (
                            <SelectItem key={u} value={u}>{u}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    )}
                  </div>
                )}

                {currentStepName === "review" && (
                  <div className="text-center py-4">
                    <div className="text-4xl mb-4">🎯</div>
                    <p className="text-muted-foreground">
                      {t(
                        "We'll analyze your answers and match you with the best funding options in Zürich.",
                        "Wir analysieren Ihre Antworten und finden die besten Fördermöglichkeiten in Zürich."
                      )}
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </AnimatePresence>

        <div className="flex items-center justify-between mt-6">
          <Button variant="outline" onClick={back}>
            <ArrowLeft className="h-4 w-4" /> {t("Back", "Zurück")}
          </Button>
          <div className="flex gap-2">
            {showSkip && (
              <Button variant="ghost" onClick={next} className="text-muted-foreground">
                <SkipForward className="h-4 w-4" /> {t("Skip", "Überspringen")}
              </Button>
            )}
            <Button onClick={next} disabled={!canAdvance()}>
              {currentStepName === "review"
                ? t("Find Funding", "Förderung finden")
                : t("Next", "Weiter")}
              {currentStepName !== "review" && <ArrowRight className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
