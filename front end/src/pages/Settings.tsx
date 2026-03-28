import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { AlertTriangle } from "lucide-react";
import { motion } from "framer-motion";

export default function Settings() {
  const { language, setLanguage, t } = useLanguage();
  const [notifications, setNotifications] = useState(true);
  const [showDeactivateConfirm, setShowDeactivateConfirm] = useState(false);

  const handleDeactivate = () => {
    localStorage.clear();
    setShowDeactivateConfirm(false);
    window.location.href = "/";
  };

  return (
    <div className="py-8">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-6">{t("Settings", "Einstellungen")}</h1>

          <div className="space-y-4">
            <Card>
              <CardHeader><CardTitle className="text-lg">{t("Language", "Sprache")}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex gap-3">
                  <Button
                    variant={language === "en" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("en")}
                  >
                    🇬🇧 English
                  </Button>
                  <Button
                    variant={language === "de" ? "default" : "outline"}
                    size="sm"
                    onClick={() => setLanguage("de")}
                  >
                    🇩🇪 Deutsch
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">{t("Notifications", "Benachrichtigungen")}</CardTitle></CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <span className="text-sm text-muted-foreground">
                    {t("Enable email notifications", "E-Mail-Benachrichtigungen aktivieren")}
                  </span>
                  <Switch checked={notifications} onCheckedChange={setNotifications} />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader><CardTitle className="text-lg">{t("Data & Privacy", "Daten & Datenschutz")}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => {
                    localStorage.removeItem("fn-user-data");
                    alert(t("Profile data cleared.", "Profildaten gelöscht."));
                  }}
                >
                  {t("Clear my profile data", "Meine Profildaten löschen")}
                </Button>
              </CardContent>
            </Card>

            <Card className="border-destructive/30">
              <CardHeader><CardTitle className="text-lg text-destructive">{t("Deactivate Account", "Konto deaktivieren")}</CardTitle></CardHeader>
              <CardContent className="space-y-3">
                <p className="text-sm text-muted-foreground">
                  {t(
                    "This will clear all your data and return you to the landing page.",
                    "Dies löscht alle Ihre Daten und bringt Sie zur Startseite zurück."
                  )}
                </p>
                {!showDeactivateConfirm ? (
                  <Button variant="destructive" size="sm" onClick={() => setShowDeactivateConfirm(true)}>
                    <AlertTriangle className="h-4 w-4" /> {t("Deactivate Account", "Konto deaktivieren")}
                  </Button>
                ) : (
                  <div className="flex gap-2">
                    <Button variant="destructive" size="sm" onClick={handleDeactivate}>
                      {t("Yes, deactivate", "Ja, deaktivieren")}
                    </Button>
                    <Button variant="outline" size="sm" onClick={() => setShowDeactivateConfirm(false)}>
                      {t("Cancel", "Abbrechen")}
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
