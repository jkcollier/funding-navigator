import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { Globe } from "lucide-react";

export default function Landing() {
  const { setLanguage } = useLanguage();
  const navigate = useNavigate();

  const selectLanguage = (lang: "en" | "de") => {
    setLanguage(lang);
    navigate("/portal");
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-primary relative overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,hsl(var(--accent)/0.12),transparent_70%)]" />
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative z-10 w-full max-w-xl mx-auto px-4"
      >
        <Card className="shadow-2xl border-0">
          <CardContent className="p-8 md:p-12 text-center space-y-6">
            <div className="mx-auto h-16 w-16 rounded-2xl bg-primary flex items-center justify-center mb-2">
              <span className="text-primary-foreground text-2xl font-bold">FN</span>
            </div>
            <h1 className="text-3xl md:text-4xl font-bold text-foreground">
              Funding Navigator
            </h1>
            <p className="text-muted-foreground text-base md:text-lg leading-relaxed">
              Turn a 120-page PDF into the right funding match in seconds.
              <br />
              <span className="text-sm">
                Verwandeln Sie ein 120-seitiges PDF in Sekunden in die richtige Förderung.
              </span>
            </p>
            <div className="pt-4 space-y-3">
              <p className="text-sm font-medium text-muted-foreground flex items-center justify-center gap-2">
                <Globe className="h-4 w-4" />
                Choose your language / Sprache wählen
              </p>
              <div className="flex gap-4 justify-center">
                <Button
                  size="lg"
                  className="px-10 text-base font-semibold"
                  onClick={() => selectLanguage("en")}
                >
                  🇬🇧 English
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="px-10 text-base font-semibold"
                  onClick={() => selectLanguage("de")}
                >
                  🇩🇪 Deutsch
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </div>
  );
}
