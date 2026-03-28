import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { useLanguage } from "@/contexts/LanguageContext";
import { matchFunding, QuestionnaireData } from "@/services/matchingEngine";
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import EmergencyBell from "@/components/EmergencyBell";

export default function Results() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const data = location.state as QuestionnaireData | undefined;
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const results = data ? matchFunding(data) : [];

  if (!data) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">{t("No questionnaire data found.", "Keine Fragebogendaten gefunden.")}</p>
        <Button asChild><Link to="/find-funding">{t("Start Questionnaire", "Fragebogen starten")}</Link></Button>
      </div>
    );
  }

  const getCategoryLabels = (f: any) => {
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
      <EmergencyBell />
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t("Your Funding Matches", "Ihre Förder-Matches")}</h1>
            <p className="text-muted-foreground text-sm">
              {results.length} {t("results found in Zürich", "Ergebnisse in Zürich gefunden")}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" /> {t("Back", "Zurück")}
          </Button>
        </div>

        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t("No matching foundations found. Try adjusting your criteria.", "Keine passenden Stiftungen gefunden.")}
            </div>
          ) : (
            results.map((r) => {
              const isExpanded = expandedId === r.foundation.id;
              const categories = getCategoryLabels(r.foundation);
              return (
                <motion.div
                  key={r.foundation.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${
                      isExpanded ? "ring-2 ring-primary/20 shadow-md" : ""
                    }`}
                    onClick={() => setExpandedId(isExpanded ? null : r.foundation.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{r.foundation.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge variant={r.score >= 70 ? "default" : r.score >= 40 ? "secondary" : "outline"}>
                            {r.score}%
                          </Badge>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                      <Progress value={r.score} className="h-1.5" />
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2">{r.foundation.description}</p>
                      <div className="flex flex-wrap gap-1">
                        {categories.slice(0, 4).map((c) => (
                          <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
                        ))}
                        {categories.length > 4 && (
                          <Badge variant="outline" className="text-xs">+{categories.length - 4}</Badge>
                        )}
                      </div>

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t space-y-3"
                        >
                          <div className="text-sm space-y-1">
                            <p><span className="font-medium">{t("Page in directory", "Seite im Verzeichnis")}:</span> {r.foundation.page}</p>
                            <p><span className="font-medium">{t("Why matched", "Warum gematcht")}:</span> {r.reasons.join(" · ")}</p>
                            {r.foundation.privatpersonen && <Badge variant="secondary" className="text-xs mr-1">{t("Private persons", "Privatpersonen")}</Badge>}
                            {r.foundation.institutionen && <Badge variant="secondary" className="text-xs">{t("Institutions", "Institutionen")}</Badge>}
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/organization/${r.foundation.id}`, { state: { questionnaireData: data } });
                            }}
                          >
                            <ExternalLink className="h-3 w-3" /> {t("Proceed", "Weiter")}
                          </Button>
                        </motion.div>
                      )}
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
