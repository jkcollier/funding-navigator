import { useLocation, useNavigate } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import { CheckCircle, Download, Home } from "lucide-react";

export default function DownloadConfirmation() {
  const { t } = useLanguage();
  const location = useLocation();
  const navigate = useNavigate();
  const orgName = (location.state as any)?.orgName || "";
  const questionnaireData = (location.state as any)?.questionnaireData;

  return (
    <div className="min-h-[70vh] flex items-center justify-center py-8">
      <div className="container max-w-lg">
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 0.4 }}>
          <Card className="shadow-lg text-center">
            <CardHeader className="pb-4">
              <div className="mx-auto h-16 w-16 rounded-full bg-success/10 flex items-center justify-center mb-3">
                <CheckCircle className="h-8 w-8 text-success" />
              </div>
              <CardTitle className="text-xl">
                {t("Your document is being downloaded!", "Ihr Dokument wird heruntergeladen!")}
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {orgName && (
                <p className="text-muted-foreground text-sm">
                  {t("Application for", "Bewerbung für")} <strong>{orgName}</strong>
                </p>
              )}

              <Card className="bg-muted/50 border-dashed">
                <CardContent className="p-4 text-left space-y-2">
                  <p className="text-sm font-medium flex items-center gap-2">
                    <Download className="h-4 w-4 text-primary" />
                    {t("Where is my file?", "Wo ist meine Datei?")}
                  </p>
                  <ul className="text-xs text-muted-foreground space-y-1 list-disc list-inside">
                    <li>{t("Check your browser's download bar at the bottom of the screen", "Prüfen Sie die Download-Leiste Ihres Browsers am unteren Bildschirmrand")}</li>
                    <li>{t("Look in your 'Downloads' folder on your computer", "Schauen Sie in Ihren 'Downloads'-Ordner auf Ihrem Computer")}</li>
                    <li>{t("On mobile, check your notification bar for the download", "Auf dem Handy: Prüfen Sie Ihre Benachrichtigungsleiste")}</li>
                  </ul>
                </CardContent>
              </Card>

              <Button className="w-full" onClick={() => navigate("/results", { state: questionnaireData })}>
                <Home className="h-4 w-4" /> {t("Back to Results", "Zurück zu Ergebnissen")}
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}
