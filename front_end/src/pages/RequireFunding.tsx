import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, ShieldCheck, AlertTriangle } from "lucide-react";

type Step = "zurich-check" | "zurich-no" | "consent";

export default function RequireFunding() {
  const { t } = useLanguage();
  const navigate = useNavigate();
  const [step, setStep] = useState<Step>("zurich-check");
  const [consentGiven, setConsentGiven] = useState(false);

  return (
    <div className="min-h-[80vh] flex items-center justify-center py-8">
      <div className="container max-w-xl">
        <AnimatePresence mode="wait">
          <motion.div
            key={step}
            initial={{ opacity: 0, x: 30 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -30 }}
            transition={{ duration: 0.25 }}
          >
            {step === "zurich-check" && (
              <Card className="shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <MapPin className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    {t(
                      "Are you an inhabitant or located in Zürich?",
                      "Sind Sie Einwohner/in oder befinden Sie sich in Zürich?"
                    )}
                  </CardTitle>
                  <p className="text-sm text-muted-foreground mt-2">
                    {t(
                      "FundingNavigator currently supports Zürich residents and organizations.",
                      "FundingNavigator unterstützt derzeit Zürcher Einwohner und Organisationen."
                    )}
                  </p>
                </CardHeader>
                <CardContent className="space-y-3">
                  <Button
                    className="w-full"
                    size="lg"
                    onClick={() => setStep("consent")}
                  >
                    {t("Yes, I am in Zürich", "Ja, ich bin in Zürich")}
                  </Button>
                  <Button
                    variant="outline"
                    className="w-full"
                    size="lg"
                    onClick={() => setStep("zurich-no")}
                  >
                    {t("No", "Nein")}
                  </Button>
                  <Button
                    variant="ghost"
                    className="w-full text-muted-foreground"
                    onClick={() => navigate("/portal")}
                  >
                    <ArrowLeft className="h-4 w-4" />
                    {t("Back", "Zurück")}
                  </Button>
                </CardContent>
              </Card>
            )}

            {step === "zurich-no" && (
              <Card className="shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-14 w-14 rounded-xl bg-accent/20 flex items-center justify-center mb-3">
                    <AlertTriangle className="h-7 w-7 text-accent-foreground" />
                  </div>
                  <CardTitle className="text-xl">
                    {t("Zürich Only (for now)", "Nur Zürich (vorerst)")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4 text-center">
                  <p className="text-muted-foreground text-sm">
                    {t(
                      "FundingNavigator currently only supports individuals and organizations based in the canton of Zürich. We are working to expand to other cantons soon.",
                      "FundingNavigator unterstützt derzeit nur Personen und Organisationen im Kanton Zürich. Wir arbeiten daran, bald auf andere Kantone zu erweitern."
                    )}
                  </p>
                  <div className="flex gap-3 justify-center pt-2">
                    <Button variant="outline" onClick={() => setStep("zurich-check")}>
                      <ArrowLeft className="h-4 w-4" />
                      {t("Back", "Zurück")}
                    </Button>
                    <Button variant="outline" onClick={() => navigate("/emergency")}>
                      {t("Emergency Help", "Notfallhilfe")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {step === "consent" && (
              <Card className="shadow-lg">
                <CardHeader className="text-center pb-4">
                  <div className="mx-auto h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                    <ShieldCheck className="h-7 w-7 text-primary" />
                  </div>
                  <CardTitle className="text-xl">
                    {t("Sensitive Information", "Sensible Informationen")}
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <p className="text-sm text-muted-foreground">
                    {t(
                      "To provide the most accurate funding matches, we may collect personal information such as your name, email, phone number, and address. This data is used solely for matching purposes and is not shared with third parties.",
                      "Um Ihnen die genauesten Fördermöglichkeiten bieten zu können, erfassen wir möglicherweise persönliche Daten wie Name, E-Mail, Telefonnummer und Adresse. Diese Daten werden ausschliesslich für das Matching verwendet und nicht an Dritte weitergegeben."
                    )}
                  </p>
                  <label className="flex items-start gap-3 cursor-pointer p-3 rounded-lg border hover:bg-muted transition-colors">
                    <Checkbox
                      checked={consentGiven}
                      onCheckedChange={(v) => setConsentGiven(!!v)}
                      className="mt-0.5"
                    />
                    <span className="text-sm">
                      {t(
                        "I agree to share sensitive information for better matching results",
                        "Ich stimme zu, sensible Informationen für bessere Matching-Ergebnisse zu teilen"
                      )}
                    </span>
                  </label>
                  <div className="flex gap-3">
                    <Button
                      variant="outline"
                      className="flex-1"
                      onClick={() => setStep("zurich-check")}
                    >
                      <ArrowLeft className="h-4 w-4" />
                      {t("Back", "Zurück")}
                    </Button>
                    <Button
                      className="flex-1"
                      onClick={() =>
                        navigate("/find-funding", {
                          state: { sensitiveConsent: consentGiven },
                        })
                      }
                    >
                      {t("Continue", "Weiter")}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}
