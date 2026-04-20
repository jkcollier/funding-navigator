import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { useLanguage } from "@/contexts/LanguageContext";
import { ArrowLeft, ChevronDown, ChevronUp } from "lucide-react";
import { motion } from "framer-motion";
import EmergencyBell from "@/components/EmergencyBell";
import { Link } from "react-router-dom";

interface BackendMatch {
  org_id: number;
  org_name: string;
  similarity_score: number;
  match_level: "high" | "medium" | "low";
}

const levelColor: Record<string, string> = {
  high: "bg-green-100 text-green-800",
  medium: "bg-yellow-100 text-yellow-800",
  low: "bg-gray-100 text-gray-700",
};

export default function Results() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const matches: BackendMatch[] = (location.state as any)?.matches ?? [];
  const formData = location.state as any;
  const [expandedId, setExpandedId] = useState<number | null>(null);

  if (!formData || matches.length === 0) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          {matches.length === 0 && formData
            ? t("No matching foundations found. Try adjusting your criteria.", "Keine passenden Stiftungen gefunden.")
            : t("No questionnaire data found.", "Keine Fragebogendaten gefunden.")}
        </p>
        <Button asChild>
          <Link to="/find-funding">{t("Start Questionnaire", "Fragebogen starten")}</Link>
        </Button>
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
              {matches.length} {t("results found", "Ergebnisse gefunden")}
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
                "Foundations receive many funding requests. Please complete your application carefully and accurately.",
                "Stiftungen erhalten viele Förderanfragen. Bitte füllen Sie Ihre Bewerbung sorgfältig aus."
              )}
            </p>
          </CardContent>
        </Card>

        <div className="space-y-4">
          {matches.map((m) => {
            const isExpanded = expandedId === m.org_id;
            return (
              <motion.div
                key={m.org_id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Card
                  className={`cursor-pointer transition-all hover:shadow-md ${isExpanded ? "ring-2 ring-primary/20 shadow-md" : ""}`}
                  onClick={() => setExpandedId(isExpanded ? null : m.org_id)}
                >
                  <CardHeader className="pb-2">
                    <div className="flex items-start justify-between">
                      <CardTitle className="text-lg">{m.org_name}</CardTitle>
                      <div className="flex items-center gap-2">
                        <Badge className={levelColor[m.match_level]}>
                          {m.match_level.charAt(0).toUpperCase() + m.match_level.slice(1)}
                        </Badge>
                        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
                      {t("Match score", "Übereinstimmung")}: {Math.round(m.similarity_score * 100)}%
                    </p>
                    {isExpanded && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: "auto" }}
                        className="mt-4 pt-4 border-t"
                      >
                        <Button
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/organization/${m.org_id}`, { state: { fromResults: true } });
                          }}
                        >
                          {t("View Details", "Details ansehen")}
                        </Button>
                      </motion.div>
                    )}
                  </CardContent>
                </Card>
              </motion.div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
