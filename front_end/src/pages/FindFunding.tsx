import { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { InputOTP, InputOTPGroup, InputOTPSlot } from "@/components/ui/input-otp";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useLanguage } from "@/contexts/LanguageContext";
import { zurichUniversities } from "@/data/zurichUniversities";
import EmergencyBell from "@/components/EmergencyBell";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, ArrowRight, SkipForward, CalendarIcon, AlertTriangle, CheckCircle } from "lucide-react";
import { format, differenceInDays } from "date-fns";
import { cn } from "@/lib/utils";

type SupportType = "" | "private" | "institution" | "project" | "education";

interface FormData {
  name: string;
  age: string;
  address: string;
  email: string;
  phone: string;
  supportType: SupportType;
  situation: string;
  fundingPurpose: string;
  amountNeeded: string;
  deadline: string;
  institutionType: string;
  institutionPurpose: string;
  institutionAmount: string;
  institutionDeadline: string;
  projectInstitutionType: string;
  projectDescription: string;
  projectDuration: string;
  projectAmount: string;
  enrolledInSwissUni: string;
  universityName: string;
  residencyStatus: string;
  zipCode: string;
}

const initialFormData: FormData = {
  name: "", age: "", address: "", email: "", phone: "",
  supportType: "",
  situation: "", fundingPurpose: "", amountNeeded: "", deadline: "",
  institutionType: "", institutionPurpose: "", institutionAmount: "", institutionDeadline: "",
  projectInstitutionType: "", projectDescription: "", projectDuration: "", projectAmount: "",
  enrolledInSwissUni: "", universityName: "",
  residencyStatus: "", zipCode: "",
};

const residencyOptions = [
  { value: "swiss-citizen", labelEn: "Swiss citizens – Swiss nationals", labelDe: "Schweizer Bürger – Schweizer Staatsangehörige" },
  { value: "permit-l", labelEn: "Swiss residents Permit L – Short-term residence", labelDe: "Schweizer Aufenthalt Bewilligung L – Kurzaufenthalt" },
  { value: "permit-b", labelEn: "Swiss residents Permit B – Residence permit", labelDe: "Schweizer Aufenthalt Bewilligung B – Aufenthaltsbewilligung" },
  { value: "permit-c", labelEn: "Swiss residents Permit C – Settlement permit", labelDe: "Schweizer Aufenthalt Bewilligung C – Niederlassungsbewilligung" },
  { value: "permit-g", labelEn: "Others Permit G – Cross-border commuter", labelDe: "Andere Bewilligung G – Grenzgänger" },
  { value: "permit-f", labelEn: "Others Permit F – Provisionally admitted", labelDe: "Andere Bewilligung F – Vorläufig aufgenommen" },
  { value: "permit-n", labelEn: "Others Permit N – Asylum seeker", labelDe: "Andere Bewilligung N – Asylsuchende" },
  { value: "other", labelEn: "Others – I am unsure", labelDe: "Andere – Ich bin unsicher" },
];

export default function FindFunding() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const location = useLocation();
  const sensitiveConsent = (location.state as any)?.sensitiveConsent ?? false;

  const [step, setStep] = useState(1);
  const [data, setData] = useState<FormData>(initialFormData);
  const [selectedDate, setSelectedDate] = useState<Date | undefined>();
  const [otpDialogOpen, setOtpDialogOpen] = useState(false);
  const [otpValue, setOtpValue] = useState("");
  const [phoneVerified, setPhoneVerified] = useState(false);

  const update = (fields: Partial<FormData>) => setData((d) => ({ ...d, ...fields }));

  const handleDateSelect = (date: Date | undefined) => {
    setSelectedDate(date);
    if (date) {
      update({ deadline: date.toISOString() });
    }
  };

  const isDeadlineUrgent = selectedDate ? differenceInDays(selectedDate, new Date()) <= 14 && differenceInDays(selectedDate, new Date()) >= 0 : false;

  const handleOtpVerify = () => {
    if (otpValue.length === 6) {
      setPhoneVerified(true);
      setOtpDialogOpen(false);
    }
  };

  const getSteps = () => {
    const steps: string[] = [];
    if (sensitiveConsent) steps.push("personal-info");
    steps.push("support-type");
    if (data.supportType === "private" || data.supportType === "education") {
      steps.push("residency-status");
    }
    steps.push("zip-code");
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
      localStorage.setItem("fn-user-data", JSON.stringify({ ...data, sensitiveConsent }));
      navigate("/results", { state: { ...data, sensitiveConsent } });
    }
  };

  const showSkip = currentStepName === "personal-info";
  const back = () => {
    if (step > 1) setStep(step - 1);
    else navigate("/require-funding");
  };

  const canAdvance = () => {
    switch (currentStepName) {
      case "personal-info": return data.name.trim().length > 0;
      case "support-type": return !!data.supportType;
      case "residency-status": return !!data.residencyStatus;
      case "zip-code": return true; // optional
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
                  {currentStepName === "residency-status" && t("What is your residency status?", "Wie ist Ihr Aufenthaltsstatus?")}
                  {currentStepName === "zip-code" && t("Your ZIP Code", "Ihre Postleitzahl")}
                  {currentStepName === "private-details" && t("Tell us about your situation", "Erzählen Sie uns von Ihrer Situation")}
                  {currentStepName === "institution-details" && t("Institution Details", "Institutionsdetails")}
                  {currentStepName === "project-details" && t("Project Information", "Projektinformationen")}
                  {currentStepName === "education-details" && t("Education Funding", "Bildungsförderung")}
                  {currentStepName === "review" && t("Ready to find your funding!", "Bereit, Ihre Förderung zu finden!")}
                </CardTitle>
                <p className="text-sm text-muted-foreground">
                  {currentStepName === "personal-info" && t("This information helps us provide more accurate matches", "Diese Informationen helfen uns, genauere Ergebnisse zu liefern")}
                  {currentStepName === "support-type" && t("Choose the option that best describes your situation", "Wählen Sie die Option, die Ihre Situation am besten beschreibt")}
                  {currentStepName === "residency-status" && t("This helps us match you with eligible organizations", "Dies hilft uns, Sie mit berechtigten Organisationen zu matchen")}
                  {currentStepName === "zip-code" && t("Some organizations only help people from certain municipalities. Please enter your ZIP code.", "Einige Organisationen helfen nur Personen aus bestimmten Gemeinden. Bitte geben Sie Ihre Postleitzahl ein.")}
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
                    <div className="space-y-2">
                      <div className="flex gap-2">
                        <Input
                          placeholder={t("Phone", "Telefon")}
                          type="tel"
                          value={data.phone}
                          onChange={(e) => { update({ phone: e.target.value }); setPhoneVerified(false); }}
                          className="flex-1"
                        />
                        {data.phone.length >= 8 && !phoneVerified && (
                          <Button variant="outline" size="sm" onClick={() => setOtpDialogOpen(true)}>
                            {t("Verify", "Bestätigen")}
                          </Button>
                        )}
                        {phoneVerified && (
                          <div className="flex items-center text-success">
                            <CheckCircle className="h-5 w-5" />
                          </div>
                        )}
                      </div>
                    </div>
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

                {currentStepName === "residency-status" && (
                  <div className="space-y-3">
                    {residencyOptions.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => update({ residencyStatus: opt.value })}
                        className={`w-full p-3 rounded-lg border text-left transition-all hover:shadow-sm ${
                          data.residencyStatus === opt.value
                            ? "border-primary bg-primary/5 ring-2 ring-primary/20"
                            : "border-border hover:border-primary/30"
                        }`}
                      >
                        <p className="text-sm">{t(opt.labelEn, opt.labelDe)}</p>
                      </button>
                    ))}
                  </div>
                )}

                {currentStepName === "zip-code" && (
                  <div className="space-y-3">
                    <Input
                      placeholder={t("e.g., 8001", "z.B. 8001")}
                      value={data.zipCode}
                      onChange={(e) => update({ zipCode: e.target.value })}
                      maxLength={4}
                    />
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
                    <div className="space-y-1">
                      <Input
                        placeholder={t("Amount needed (e.g., 5,000 CHF)", "Benötigter Betrag (z.B. 5'000 CHF)")}
                        type="number"
                        value={data.amountNeeded}
                        onChange={(e) => update({ amountNeeded: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">{t("Please specify amount in Swiss Francs (CHF)", "Bitte Betrag in Schweizer Franken (CHF) angeben")}</p>
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">{t("By when do you need the money?", "Bis wann brauchen Sie das Geld?")}</label>
                      <Popover>
                        <PopoverTrigger asChild>
                          <Button variant="outline" className={cn("w-full justify-start text-left font-normal", !selectedDate && "text-muted-foreground")}>
                            <CalendarIcon className="mr-2 h-4 w-4" />
                            {selectedDate ? format(selectedDate, "PPP") : t("Pick a date", "Datum wählen")}
                          </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-auto p-0" align="start">
                          <Calendar
                            mode="single"
                            selected={selectedDate}
                            onSelect={handleDateSelect}
                            disabled={(date) => date < new Date()}
                            initialFocus
                            className={cn("p-3 pointer-events-auto")}
                          />
                        </PopoverContent>
                      </Popover>
                      {isDeadlineUrgent && (
                        <Card className="border-destructive bg-destructive/5">
                          <CardContent className="p-3 flex items-start gap-2">
                            <AlertTriangle className="h-5 w-5 text-destructive shrink-0 mt-0.5" />
                            <div>
                              <p className="text-sm font-medium text-destructive">
                                {t("Your request appears urgent.", "Ihre Anfrage scheint dringend zu sein.")}
                              </p>
                              <p className="text-xs text-muted-foreground mt-1">
                                {t(
                                  "Please click the emergency bell and contact an organization immediately. We have linked organizations you can reach out to.",
                                  "Bitte klicken Sie auf die Notfallglocke und kontaktieren Sie sofort eine Organisation. Wir haben Organisationen verlinkt, die Sie kontaktieren können."
                                )}
                              </p>
                            </div>
                          </CardContent>
                        </Card>
                      )}
                    </div>
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
                      placeholder={t("Purpose of funding", "Zweck der Förderung")}
                      value={data.institutionPurpose}
                      onChange={(e) => update({ institutionPurpose: e.target.value })}
                    />
                    <div className="space-y-1">
                      <Input
                        placeholder={t("Amount needed (e.g., 5,000 CHF)", "Benötigter Betrag (z.B. 5'000 CHF)")}
                        type="number"
                        value={data.institutionAmount}
                        onChange={(e) => update({ institutionAmount: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">{t("Please specify amount in Swiss Francs (CHF)", "Bitte Betrag in Schweizer Franken (CHF) angeben")}</p>
                    </div>
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
                    <div className="space-y-1">
                      <Input
                        placeholder={t("Amount needed (e.g., 5,000 CHF)", "Benötigter Betrag (z.B. 5'000 CHF)")}
                        type="number"
                        value={data.projectAmount}
                        onChange={(e) => update({ projectAmount: e.target.value })}
                      />
                      <p className="text-xs text-muted-foreground">{t("Please specify amount in Swiss Francs (CHF)", "Bitte Betrag in Schweizer Franken (CHF) angeben")}</p>
                    </div>
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
                  <div className="text-center py-4 space-y-4">
                    <div className="text-4xl mb-2">🎯</div>
                    <Card className="bg-accent/10 border-accent/30">
                      <CardContent className="p-4 text-sm text-muted-foreground">
                        {t(
                          "Foundations receive many funding requests. Please complete this form carefully and accurately so foundations are not overwhelmed.",
                          "Stiftungen erhalten viele Förderanträge. Bitte füllen Sie dieses Formular sorgfältig und korrekt aus, damit Stiftungen nicht überlastet werden."
                        )}
                      </CardContent>
                    </Card>
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

      {/* OTP Verification Dialog */}
      <Dialog open={otpDialogOpen} onOpenChange={setOtpDialogOpen}>
        <DialogContent className="max-w-sm">
          <DialogHeader>
            <DialogTitle>{t("Verify Phone Number", "Telefonnummer bestätigen")}</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 text-center">
            <p className="text-sm text-muted-foreground">
              {t("Enter the 6-digit code sent to your phone", "Geben Sie den 6-stelligen Code ein, der an Ihr Telefon gesendet wurde")}
            </p>
            <div className="flex justify-center">
              <InputOTP maxLength={6} value={otpValue} onChange={setOtpValue}>
                <InputOTPGroup>
                  <InputOTPSlot index={0} />
                  <InputOTPSlot index={1} />
                  <InputOTPSlot index={2} />
                  <InputOTPSlot index={3} />
                  <InputOTPSlot index={4} />
                  <InputOTPSlot index={5} />
                </InputOTPGroup>
              </InputOTP>
            </div>
            <Button onClick={handleOtpVerify} disabled={otpValue.length < 6} className="w-full">
              {t("Verify", "Bestätigen")}
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
