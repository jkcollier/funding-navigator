import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";

export default function About() {
  const { t } = useLanguage();
  return (
    <div className="py-8">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold mb-4">{t("About FundingNavigator", "Über FundingNavigator")}</h1>
        <div className="space-y-4">
          <Card>
            <CardContent className="p-6 space-y-3">
              <p className="text-muted-foreground">
                {t(
                  "FundingNavigator is an intelligent matching tool designed to help social workers, individuals in financial distress, and NGOs discover the right Swiss funding opportunities — fast.",
                  "FundingNavigator ist ein intelligentes Matching-Tool, das Sozialarbeitern, finanziell belasteten Personen und NGOs hilft, schnell die richtigen Schweizer Fördermöglichkeiten zu finden."
                )}
              </p>
              <p className="text-muted-foreground">
                {t(
                  "Built during Hack4SocialGood in collaboration with ZHAW, this tool turns complex 120-page funding PDFs into an interactive, user-friendly experience.",
                  "Entwickelt während Hack4SocialGood in Zusammenarbeit mit der ZHAW, verwandelt dieses Tool komplexe 120-seitige Förder-PDFs in ein interaktives, benutzerfreundliches Erlebnis."
                )}
              </p>
            </CardContent>
          </Card>
          <div className="grid sm:grid-cols-2 gap-4">
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">10+</p><p className="text-sm text-muted-foreground">{t("Foundations", "Stiftungen")}</p></CardContent></Card>
            <Card><CardContent className="p-4 text-center"><p className="text-2xl font-bold text-primary">26</p><p className="text-sm text-muted-foreground">{t("Cantons Covered", "Abgedeckte Kantone")}</p></CardContent></Card>
          </div>
        </div>
      </div>
    </div>
  );
}
