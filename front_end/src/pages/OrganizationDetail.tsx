import { useParams, useNavigate, useLocation, Link } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { mockFoundations } from "@/data/mockFoundations";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, ExternalLink, FileText, Mail, ArrowRight, MapPin, Phone, Globe, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import { QuestionnaireData } from "@/services/matchingEngine";
import { translateField, translateList } from "@/services/translationHelper";

export default function OrganizationDetail() {
  const { t, language } = useLanguage();
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
  const alreadyApplied = localStorage.getItem(`applied-${f.id}`) === "true";
  const beilagen = translateList(f.beilagen, language);

  const handleProceed = () => {
    navigate(`/application-preview/${f.id}`, { state: { questionnaireData } });
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
              <p className="text-muted-foreground">{translateField(f.description, language)}</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Contact Info */}
              <div className="space-y-2">
                <p className="text-sm font-medium mb-2">{t("Contact Information", "Kontaktinformationen")}</p>
                {f.address && <p className="text-sm flex items-center gap-2"><MapPin className="h-4 w-4 text-muted-foreground" /> {f.address}</p>}
                {f.phone && <p className="text-sm flex items-center gap-2"><Phone className="h-4 w-4 text-muted-foreground" /> {f.phone}</p>}
                {f.email && <p className="text-sm flex items-center gap-2"><Mail className="h-4 w-4 text-muted-foreground" /> {f.email}</p>}
                {f.website && <p className="text-sm flex items-center gap-2"><Globe className="h-4 w-4 text-muted-foreground" /> <a href={f.website.startsWith("http") ? f.website : `https://${f.website}`} target="_blank" rel="noopener noreferrer" className="text-primary underline">{f.website}</a></p>}
              </div>

              {/* Target Group */}
              {f.zielgruppe && (
                <div>
                  <p className="text-sm font-medium mb-2">{t("Target Group", "Zielgruppe")}</p>
                  <p className="text-sm text-muted-foreground">{translateField(f.zielgruppe, language)}</p>
                </div>
              )}

              {/* Applicant Type */}
              <div>
                <p className="text-sm font-medium mb-2">{t("Applicant Type", "Gesuchstellende")}</p>
                <Badge variant="secondary" className="capitalize">{f.applicant_type === "both" ? t("Private & Institutions", "Privatpersonen & Institutionen") : f.applicant_type === "private" ? t("Private persons", "Privatpersonen") : t("Institutions", "Institutionen")}</Badge>
                {f.requires_intermediary && (
                  <div className="flex items-center gap-1 mt-2 text-sm text-amber-600">
                    <AlertTriangle className="h-4 w-4" />
                    {t("Application requires an intermediary (e.g., social worker)", "Bewerbung erfordert eine Vermittlungsperson (z.B. Sozialarbeiter)")}
                  </div>
                )}
              </div>

              {/* Deadline Info */}
              <div>
                <p className="text-sm font-medium mb-1">{t("Submission Deadline", "Einreichungstermin")}</p>
                <p className="text-sm text-muted-foreground">{translateField(f.einreichungstermin, language) || t("Rolling deadline", "Laufend")}</p>
              </div>

              {/* Where to send */}
              {f.empfangsstelle && (
                <div>
                  <p className="text-sm font-medium mb-1">{t("Where to Submit", "Empfangsstelle")}</p>
                  <p className="text-sm text-muted-foreground">{translateField(f.empfangsstelle, language)}</p>
                </div>
              )}

              {/* Required Attachments */}
              {beilagen.length > 0 && (
                <div>
                  <p className="text-sm font-medium mb-2">{t("Required Attachments", "Erforderliche Beilagen")}</p>
                  <ul className="space-y-1">
                    {beilagen.map((doc) => (
                      <li key={doc} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <FileText className="h-3.5 w-3.5" /> {doc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Action buttons */}
              <div className="flex flex-wrap gap-2">
                {f.email && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={`mailto:${f.email}`}><Mail className="h-3 w-3" /> {t("Email", "E-Mail")}</a>
                  </Button>
                )}
                {f.website && (
                  <Button size="sm" variant="outline" asChild>
                    <a href={f.website.startsWith("http") ? f.website : `https://${f.website}`} target="_blank" rel="noopener noreferrer"><Globe className="h-3 w-3" /> {t("Website", "Webseite")}</a>
                  </Button>
                )}
              </div>

              <div className="border-t pt-4">
                {alreadyApplied ? (
                  <p className="text-sm text-muted-foreground">
                    {t("You have already applied to this organization.", "Sie haben sich bereits bei dieser Organisation beworben.")}
                  </p>
                ) : (
                  <div className="space-y-3">
                    <p className="text-sm text-muted-foreground">
                      {t("Proceed to fill out and review your application.", "Fahren Sie fort, um Ihre Bewerbung auszufüllen und zu überprüfen.")}
                    </p>
                    <Button onClick={handleProceed}>
                      <ArrowRight className="h-4 w-4" /> {t("Proceed", "Weiter")}
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
