import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useLanguage } from "@/contexts/LanguageContext";
import { motion } from "framer-motion";
import { Search, MapPin, ShieldCheck, Zap, Users, Heart } from "lucide-react";

export default function Index() {
  const { t } = useLanguage();

  const features = [
    { icon: Search, title: t("Smart Matching", "Intelligentes Matching"), desc: t("Answer a few questions and get matched with relevant funding.", "Beantworten Sie einige Fragen und erhalten Sie passende Förderungen.") },
    { icon: MapPin, title: t("Interactive Map", "Interaktive Karte"), desc: t("Explore funding organizations across all Swiss cantons.", "Entdecken Sie Förderorganisationen in allen Schweizer Kantonen.") },
    { icon: ShieldCheck, title: t("Trusted Sources", "Vertrauenswürdige Quellen"), desc: t("All data from verified Swiss foundations and organizations.", "Alle Daten von verifizierten Schweizer Stiftungen.") },
    { icon: Zap, title: t("Emergency Help", "Notfallhilfe"), desc: t("Immediate access to Swiss emergency contacts and hotlines.", "Sofortiger Zugang zu Schweizer Notfallnummern.") },
    { icon: Users, title: t("For Everyone", "Für alle"), desc: t("Individuals, social workers, and NGOs — all welcome.", "Einzelpersonen, Sozialarbeiter und NGOs — alle willkommen.") },
    { icon: Heart, title: t("Funding Plan", "Förderplan"), desc: t("Get a personalized step-by-step funding recommendation.", "Erhalten Sie eine personalisierte Förderempfehlung.") },
  ];

  return (
    <div className="flex flex-col">
      {/* Hero */}
      <section className="relative overflow-hidden bg-primary py-20 md:py-32">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)/0.15),transparent_70%)]" />
        <div className="container relative z-10 text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <h1 className="text-3xl md:text-5xl lg:text-6xl font-bold text-primary-foreground mb-4 leading-tight">
              {t("Find the Right Funding", "Finden Sie die richtige Förderung")}
              <br />
              <span className="text-accent">{t("in Seconds", "in Sekunden")}</span>
            </h1>
            <p className="text-primary-foreground/80 text-lg md:text-xl max-w-2xl mx-auto mb-8">
              {t(
                "Answer a few questions and discover funding options tailored to your situation.",
                "Beantworten Sie einige Fragen und entdecken Sie auf Ihre Situation zugeschnittene Fördermöglichkeiten."
              )}
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button size="lg" className="bg-accent text-accent-foreground hover:bg-accent/90 text-base font-semibold px-8" asChild>
                <Link to="/find-funding">{t("Start Matching", "Matching starten")}</Link>
              </Button>
              <Button size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 text-base" asChild>
                <Link to="/map">{t("Explore Map", "Karte erkunden")}</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">
            {t("How FundingNavigator Helps You", "Wie FundingNavigator Ihnen hilft")}
          </h2>
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {features.map((f, i) => (
              <motion.div
                key={f.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1, duration: 0.4 }}
              >
                <Card className="h-full hover:shadow-md transition-shadow">
                  <CardContent className="p-6 flex gap-4">
                    <div className="h-10 w-10 rounded-lg bg-primary/10 flex items-center justify-center shrink-0">
                      <f.icon className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="font-semibold mb-1">{f.title}</h3>
                      <p className="text-sm text-muted-foreground">{f.desc}</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-16 bg-muted">
        <div className="container text-center">
          <h2 className="text-2xl font-bold mb-4">
            {t("Ready to find your funding?", "Bereit, Ihre Förderung zu finden?")}
          </h2>
          <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
            {t(
              "Our questionnaire takes less than 2 minutes. Get matched with Swiss foundations today.",
              "Unser Fragebogen dauert weniger als 2 Minuten. Lassen Sie sich noch heute mit Schweizer Stiftungen matchen."
            )}
          </p>
          <Button size="lg" asChild>
            <Link to="/find-funding">{t("Start Now", "Jetzt starten")}</Link>
          </Button>
        </div>
      </section>
    </div>
  );
}
