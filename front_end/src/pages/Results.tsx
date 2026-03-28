import { useState } from "react";
import { useLocation, Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { matchFunding, QuestionnaireData, getTagColor } from "@/services/matchingEngine";
import { translateField, translateList } from "@/services/translationHelper";
import { ArrowLeft, ExternalLink, ChevronDown, ChevronUp, MapPin, Phone, Mail, Globe, AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";
import EmergencyBell from "@/components/EmergencyBell";

export default function Results() {
  const { t, language } = useLanguage();
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

  return (
    <div className="py-8">
      <EmergencyBell />
      <div className="container max-w-3xl">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold">{t("Your Funding Matches", "Ihre Förder-Matches")}</h1>
            <p className="text-muted-foreground text-sm">
              {results.length} {t("results found", "Ergebnisse gefunden")}
            </p>
          </div>
          <Button variant="outline" size="sm" onClick={() => navigate(-1)}>
            <ArrowLeft className="h-4 w-4" /> {t("Back", "Zurück")}
          </Button>
        </div>

        <Card className="bg-accent/10 border-accent/30 mb-4">
          <CardContent className="p-4">
            <p className="text-sm">
              {t(
                "Foundations receive many funding requests. Please complete your application carefully and accurately so foundations are not overwhelmed.",
                "Stiftungen erhalten viele Förderanfragen. Bitte füllen Sie Ihre Bewerbung sorgfältig und genau aus, damit die Stiftungen nicht überlastet werden."
              )}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {results.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              {t("No matching foundations found. Try adjusting your criteria.", "Keine passenden Stiftungen gefunden.")}
            </div>
          ) : (
            results.map((r) => {
              const isExpanded = expandedId === r.foundation.id;
              const f = r.foundation;
              const zielgruppe = translateList(f.zielgruppe, language).slice(0, 4);
              return (
                <motion.div
                  key={f.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3 }}
                >
                  <Card
                    className={`cursor-pointer transition-all hover:shadow-md ${isExpanded ? "ring-2 ring-primary/20 shadow-md" : ""}`}
                    onClick={() => setExpandedId(isExpanded ? null : f.id)}
                  >
                    <CardHeader className="pb-2">
                      <div className="flex items-start justify-between">
                        <CardTitle className="text-lg">{f.name}</CardTitle>
                        <div className="flex items-center gap-2">
                          <Badge className={getTagColor(r.tag)}>{r.tag}</Badge>
                          {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <p className="text-sm text-muted-foreground mb-2 line-clamp-2">{translateField(f.description, language)}</p>
                      <div className="flex flex-wrap gap-1">
                        {zielgruppe.map((z) => (
                          <Badge key={z} variant="outline" className="text-xs">{z}</Badge>
                        ))}
                        <Badge variant="secondary" className="text-xs capitalize">{translateField(f.deadline_type, language)}</Badge>
                      </div>

                      {r.foundation.requires_intermediary && (
                        <div className="flex items-center gap-1 mt-2 text-xs text-amber-600">
                          <AlertTriangle className="h-3 w-3" />
                          {t("Requires intermediary (e.g., social worker)", "Erfordert Vermittlung (z.B. Sozialarbeiter)")}
                        </div>
                      )}

                      {isExpanded && (
                        <motion.div
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: "auto" }}
                          className="mt-4 pt-4 border-t space-y-3"
                        >
                          <div className="text-sm space-y-1">
                            {f.address && <p className="flex items-center gap-1"><MapPin className="h-3 w-3" /> {f.address}</p>}
                            {f.phone && <p className="flex items-center gap-1"><Phone className="h-3 w-3" /> {f.phone}</p>}
                            {f.email && <p className="flex items-center gap-1"><Mail className="h-3 w-3" /> {f.email}</p>}
                            {f.website && <p className="flex items-center gap-1"><Globe className="h-3 w-3" /> {f.website}</p>}
                            <p><span className="font-medium">{t("Deadline", "Termin")}:</span> {translateField(f.einreichungstermin || f.deadline_type, language)}</p>
                            <p><span className="font-medium">{t("Why matched", "Warum gematcht")}:</span> {r.reasons.join(" · ")}</p>
                          </div>
                          <Button
                            size="sm"
                            onClick={(e) => {
                              e.stopPropagation();
                              navigate(`/organization/${f.id}`, { state: { questionnaireData: data } });
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
