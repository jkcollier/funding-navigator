import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockFoundations } from "@/data/mockFoundations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Download, Mail, MapPin, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { generateApplicationDoc } from "@/services/documentGenerator";
import { QuestionnaireData } from "@/services/matchingEngine";

export default function ApplicationConfirm() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const foundation = mockFoundations.find((f) => f.id === id);
  const questionnaireData = (location.state as any)?.questionnaireData as QuestionnaireData | undefined;
  const applicationData = (location.state as any)?.applicationData;

  if (!foundation) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{t("Organization not found.", "Organisation nicht gefunden.")}</p>
        <Button asChild><Link to="/results">{t("Back to Results", "Zurück zu Ergebnissen")}</Link></Button>
      </div>
    );
  }

  const handleConfirmDownload = async () => {
    if (applicationData) {
      const stored = localStorage.getItem("fn-user-data");
      const userData = stored ? JSON.parse(stored) : {};
      userData.name = applicationData.fullName;
      userData.email = applicationData.email;
      userData.phone = applicationData.phone;
      userData.address = applicationData.address;
      localStorage.setItem("fn-user-data", JSON.stringify(userData));
    }

    await generateApplicationDoc(foundation, questionnaireData);
    localStorage.setItem(`applied-${foundation.id}`, "true");

    const existingDocs = JSON.parse(localStorage.getItem("fn-generated-docs") || "[]");
    existingDocs.push({
      id: foundation.id,
      orgName: foundation.name,
      date: new Date().toISOString(),
    });
    localStorage.setItem("fn-generated-docs", JSON.stringify(existingDocs));

    navigate("/download-confirmation", { state: { orgName: foundation.name, questionnaireData, foundationId: foundation.id } });
  };

  return (
    <div className="py-8">
      <div className="container max-w-3xl">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> {t("Back", "Zurück")}
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <h1 className="text-2xl font-bold mb-6">{t("Confirm Your Application", "Bestätigen Sie Ihre Bewerbung")}</h1>

          <div className="space-y-4">
            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t("Personal Information", "Persönliche Informationen")}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><span className="font-medium">{t("Name", "Name")}:</span> {applicationData?.fullName || "—"}</p>
                <p><span className="font-medium">{t("Email", "E-Mail")}:</span> {applicationData?.email || "—"}</p>
                <p><span className="font-medium">{t("Phone", "Telefon")}:</span> {applicationData?.phone || "—"}</p>
                <p><span className="font-medium">{t("Address", "Adresse")}:</span> {applicationData?.address || "—"}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t("Funding Request", "Förderantrag")}</CardTitle>
              </CardHeader>
              <CardContent className="text-sm space-y-1">
                <p><span className="font-medium">{t("Purpose", "Zweck")}:</span> {applicationData?.fundingPurpose || "—"}</p>
                <p><span className="font-medium">{t("Amount", "Betrag")}:</span> CHF {applicationData?.amountNeeded || "—"}</p>
                <p><span className="font-medium">{t("Organization", "Organisation")}:</span> {foundation.name}</p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-base">{t("Application Letter", "Bewerbungsschreiben")}</CardTitle>
              </CardHeader>
              <CardContent>
                <pre className="text-sm whitespace-pre-wrap text-muted-foreground bg-muted/50 p-4 rounded-lg">
                  {applicationData?.letterText || "—"}
                </pre>
              </CardContent>
            </Card>

            <Button className="w-full" size="lg" onClick={handleConfirmDownload}>
              <Download className="h-4 w-4" /> {t("Confirm & Download", "Bestätigen & Herunterladen")}
            </Button>

            <Card className="bg-accent/10 border-accent/30">
              <CardContent className="p-4 space-y-3">
                <p className="text-sm font-medium">
                  {t(
                    "Once you apply for funding, you must print and send the application yourself. Filling the form does not automatically submit your request.",
                    "Sobald Sie eine Förderung beantragen, müssen Sie den Antrag selbst ausdrucken und einsenden. Das Ausfüllen des Formulars sendet Ihren Antrag nicht automatisch ab."
                  )}
                </p>
                <div className="flex flex-wrap gap-2">
                  {foundation.email && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={`mailto:${foundation.email}`}>
                        <Mail className="h-3 w-3" /> {t("Email", "E-Mail")}
                      </a>
                    </Button>
                  )}
                  {foundation.address && (
                    <Button size="sm" variant="outline">
                      <MapPin className="h-3 w-3" /> {t("Address", "Adresse")}: {foundation.address}
                    </Button>
                  )}
                  {foundation.website && (
                    <Button size="sm" variant="outline" asChild>
                      <a href={foundation.website.startsWith("http") ? foundation.website : `https://${foundation.website}`} target="_blank" rel="noopener noreferrer">
                        <Globe className="h-3 w-3" /> {t("Website", "Webseite")}
                      </a>
                    </Button>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
