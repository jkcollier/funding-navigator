import { useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { motion } from "framer-motion";
import { Shield, Users, HandCoins, Search } from "lucide-react";

export default function PortalSelection() {
  const { t } = useLanguage();
  const navigate = useNavigate();

  return (
    <div className="min-h-[85vh] flex items-center justify-center py-12">
      <div className="container max-w-4xl">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-10"
        >
          <h1 className="text-3xl md:text-4xl font-bold mb-3">
            {t("Welcome to Funding Navigator", "Willkommen bei Funding Navigator")}
          </h1>
          <p className="text-muted-foreground text-lg">
            {t("Select your portal to continue", "Wählen Sie Ihr Portal aus")}
          </p>
        </motion.div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Admin Portal */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Card className="h-full opacity-60 relative overflow-hidden">
              <Badge className="absolute top-4 right-4 bg-muted text-muted-foreground">
                {t("Coming Soon", "Demnächst")}
              </Badge>
              <CardHeader className="pb-4 pt-8">
                <div className="mx-auto h-14 w-14 rounded-xl bg-muted flex items-center justify-center mb-3">
                  <Shield className="h-7 w-7 text-muted-foreground" />
                </div>
                <CardTitle className="text-center text-xl">
                  {t("Admin Portal", "Admin-Portal")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4 pb-8">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "Manage foundations, review applications, and configure matching parameters.",
                    "Stiftungen verwalten, Bewerbungen prüfen und Matching-Parameter konfigurieren."
                  )}
                </p>
                <Button disabled className="w-full">
                  {t("Coming Soon", "Demnächst")}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Client Portal */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <Card className="h-full border-primary/30 shadow-lg">
              <CardHeader className="pb-4 pt-8">
                <div className="mx-auto h-14 w-14 rounded-xl bg-primary/10 flex items-center justify-center mb-3">
                  <Users className="h-7 w-7 text-primary" />
                </div>
                <CardTitle className="text-center text-xl">
                  {t("Client Portal", "Klienten-Portal")}
                </CardTitle>
              </CardHeader>
              <CardContent className="text-center space-y-4 pb-8">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "Find funding opportunities or provide support to those in need.",
                    "Finden Sie Fördermöglichkeiten oder bieten Sie Unterstützung an."
                  )}
                </p>
                <div className="space-y-3">
                  <Button
                    className="w-full"
                    onClick={() => navigate("/require-funding")}
                  >
                    <Search className="h-4 w-4" />
                    {t("Require Funding", "Förderung benötigen")}
                  </Button>
                  <Button variant="outline" className="w-full opacity-50" disabled>
                    <HandCoins className="h-4 w-4" />
                    {t("Provide Funding", "Förderung anbieten")}
                    <Badge variant="secondary" className="ml-2 text-xs">
                      {t("Coming Soon", "Demnächst")}
                    </Badge>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}
