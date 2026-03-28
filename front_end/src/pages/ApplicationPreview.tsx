import { useState, useEffect } from "react";
import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockFoundations } from "@/data/mockFoundations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { QuestionnaireData } from "@/services/matchingEngine";

interface ApplicationData {
  fullName: string;
  email: string;
  phone: string;
  address: string;
  fundingPurpose: string;
  amountNeeded: string;
  letterText: string;
  organizationDescription: string;
}

export default function ApplicationPreview() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const foundation = mockFoundations.find((f) => f.id === id);
  const questionnaireData = (location.state as any)?.questionnaireData as QuestionnaireData | undefined;

  const [appData, setAppData] = useState<ApplicationData>({
    fullName: "", email: "", phone: "", address: "",
    fundingPurpose: "", amountNeeded: "", letterText: "", organizationDescription: "",
  });

  useEffect(() => {
    const stored = localStorage.getItem("fn-user-data");
    const userData = stored ? JSON.parse(stored) : {};
    const purpose = questionnaireData?.fundingPurpose || questionnaireData?.institutionPurpose || questionnaireData?.projectDescription || "";
    const amount = questionnaireData?.amountNeeded || questionnaireData?.institutionAmount || questionnaireData?.projectAmount || "";

    setAppData({
      fullName: userData.name || questionnaireData?.name || "",
      email: userData.email || questionnaireData?.email || "",
      phone: userData.phone || questionnaireData?.phone || "",
      address: userData.address || questionnaireData?.address || "",
      fundingPurpose: purpose,
      amountNeeded: amount,
      letterText: t(
        `Dear ${foundation?.name || "Organization"},\n\nI am writing to respectfully request financial support for the following purpose: ${purpose}.\n\nThe requested amount is CHF ${amount}. I would be grateful for your consideration and am happy to provide any additional documentation required.\n\nThank you for your time and support.\n\nSincerely,\n${userData.name || questionnaireData?.name || "[Your Name]"}`,
        `Sehr geehrte ${foundation?.name || "Organisation"},\n\nIch schreibe Ihnen, um respektvoll um finanzielle Unterstützung für folgenden Zweck zu bitten: ${purpose}.\n\nDer beantragte Betrag beträgt CHF ${amount}. Ich wäre Ihnen dankbar für Ihre Berücksichtigung und stelle gerne zusätzliche Unterlagen zur Verfügung.\n\nVielen Dank für Ihre Zeit und Unterstützung.\n\nMit freundlichen Grüssen,\n${userData.name || questionnaireData?.name || "[Ihr Name]"}`
      ),
      organizationDescription: foundation?.description || "",
    });
  }, [foundation, questionnaireData, t]);

  if (!foundation) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{t("Organization not found.", "Organisation nicht gefunden.")}</p>
        <Button asChild><Link to="/results">{t("Back to Results", "Zurück zu Ergebnissen")}</Link></Button>
      </div>
    );
  }

  const update = (fields: Partial<ApplicationData>) => setAppData((d) => ({ ...d, ...fields }));

  const handleContinue = () => {
    navigate(`/application-confirm/${id}`, {
      state: { questionnaireData, applicationData: appData },
    });
  };

  return (
    <div className="py-8">
      <div className="container max-w-3xl">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> {t("Back", "Zurück")}
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold mb-2">{t("Application Preview", "Bewerbungsvorschau")}</h1>
          <p className="text-muted-foreground mb-6">
            {t("Review and edit your application before confirming.", "Überprüfen und bearbeiten Sie Ihre Bewerbung vor der Bestätigung.")}
          </p>

          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-lg">{t("Applying to", "Bewerbung an")}: {foundation.name}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 max-h-[60vh] overflow-y-auto">
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">{t("Personal Information", "Persönliche Informationen")}</h3>
                <Input placeholder={t("Full Name", "Vollständiger Name")} value={appData.fullName} onChange={(e) => update({ fullName: e.target.value })} />
                <Input placeholder={t("Email", "E-Mail")} value={appData.email} onChange={(e) => update({ email: e.target.value })} />
                <Input placeholder={t("Phone", "Telefon")} value={appData.phone} onChange={(e) => update({ phone: e.target.value })} />
                <Input placeholder={t("Address", "Adresse")} value={appData.address} onChange={(e) => update({ address: e.target.value })} />
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm">{t("Funding Request", "Förderantrag")}</h3>
                <Textarea placeholder={t("Funding purpose", "Förderzweck")} value={appData.fundingPurpose} onChange={(e) => update({ fundingPurpose: e.target.value })} rows={3} />
                <Input placeholder={t("Amount (CHF)", "Betrag (CHF)")} value={appData.amountNeeded} onChange={(e) => update({ amountNeeded: e.target.value })} />
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm">{t("Application Letter", "Bewerbungsschreiben")}</h3>
                <Textarea value={appData.letterText} onChange={(e) => update({ letterText: e.target.value })} rows={10} className="font-mono text-sm" />
              </div>

              <div className="space-y-3">
                <h3 className="font-semibold text-sm">{t("Organization", "Organisation")}</h3>
                <Textarea value={appData.organizationDescription} onChange={(e) => update({ organizationDescription: e.target.value })} rows={2} />
              </div>
            </CardContent>
          </Card>

          <div className="flex justify-end mt-6">
            <Button onClick={handleContinue}>
              {t("Continue to Confirmation", "Weiter zur Bestätigung")} <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
