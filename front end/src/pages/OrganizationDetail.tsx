import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockFoundations } from "@/data/mockFoundations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, Download, FileText, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { generateApplicationDoc } from "@/services/documentGenerator";
import { QuestionnaireData } from "@/services/matchingEngine";

export default function OrganizationDetail() {
  const { t } = useLanguage();
  const { id } = useParams();
  const navigate = useNavigate();
  const location = useLocation();
  const foundation = mockFoundations.find((f) => f.id === id);
  const questionnaireData = (location.state as any)?.questionnaireData as QuestionnaireData | undefined;

  if (!foundation) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{t("Organization not found.", "Organisation nicht gefunden.")}</p>
        <Button asChild><Link to="/results">{t("Back to Results", "Zurück zu Ergebnissen")}</Link></Button>
      </div>
    );
  }

  const f = foundation;
  const hasExternalApplication = !!f.applicationUrl;
  const alreadyApplied = localStorage.getItem(`applied-${f.id}`) === "true";

  const handleInternalApply = async () => {
    await generateApplicationDoc(f, questionnaireData);
    localStorage.setItem(`applied-${f.id}`, "true");
    navigate("/download-confirmation", { state: { orgName: f.name, questionnaireData } });
  };

  const getCategoryLabels = () => {
    const labels: string[] = [];
    if (f.jugendFamilie) labels.push(t("Youth & Family", "Jugend & Familie"));
    if (f.aeltereMenschen) labels.push(t("Elderly", "Ältere Menschen"));
    if (f.behinderungen) labels.push(t("Disabilities", "Behinderungen"));
    if (f.gesundheit) labels.push(t("Health", "Gesundheit"));
    if (f.migration) labels.push(t("Migration", "Migration"));
    if (f.ausbildung) labels.push(t("Education", "Ausbildung"));
    if (f.armut) labels.push(t("Poverty", "Armut"));
    return labels;
  };

  return (
    <div className="py-8">
      <div className="container max-w-3xl">
        <Button variant="ghost" className="mb-4" onClick={() => navigate(-1)}>
          <ArrowLeft className="h-4 w-4" /> {t("Back", "Zurück")}
        </Button>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.4 }}>
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="text-2xl">{f.name}</CardTitle>
              <p className="text-muted-foreground">{f.description}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <p className="text-sm font-medium mb-1">{t("Page in directory", "Seite im Verzeichnis")}</p>
                <p className="text-sm text-muted-foreground">{f.page}</p>
              </div>

              <div>
                <p className="text-sm font-medium mb-2">{t("Categories", "Kategorien")}</p>
                <div className="flex flex-wrap gap-1.5">
                  {getCategoryLabels().map((c) => <Badge key={c} variant="outline">{c}</Badge>)}
                  {f.privatpersonen && <Badge variant="secondary">{t("Private persons", "Privatpersonen")}</Badge>}
                  {f.institutionen && <Badge variant="secondary">{t("Institutions", "Institutionen")}</Badge>}
                </div>
              </div>

              {f.requiredDocuments.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">{t("Required Documents", "Erforderliche Dokumente")}</p>
                  <ul className="space-y-1">
                    {f.requiredDocuments.map((doc) => (
                      <li key={doc} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" /> {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              <div className="flex flex-wrap gap-2">
                <Button size="sm" variant="outline" asChild>
                  <a href={`mailto:${f.contactEmail}`}><Mail className="h-3 w-3" /> {t("Email", "E-Mail")}</a>
                </Button>
              </div>

              <div className="border-t pt-4">
                {alreadyApplied ? (
                  <p className="text-sm text-muted-foreground">
                    {t("You have already applied to this organization.", "Sie haben sich bereits bei dieser Organisation beworben.")}
                  </p>
                ) : hasExternalApplication ? (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {t("This organization requires you to apply through their website.", "Diese Organisation erfordert eine Bewerbung über ihre Website.")}
                    </p>
                    <Button asChild>
                      <a href={f.applicationUrl!} target="_blank" rel="noopener noreferrer">
                        <ExternalLink className="h-4 w-4" /> {t("Apply on Website", "Auf Website bewerben")}
                      </a>
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {t("You can generate your application document directly.", "Sie können Ihr Bewerbungsdokument direkt erstellen.")}
                    </p>
                    <Button onClick={handleInternalApply}>
                      <Download className="h-4 w-4" /> {t("Download Application Document", "Bewerbungsdokument herunterladen")}
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
