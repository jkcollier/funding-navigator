import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Upload } from "lucide-react";
import { motion } from "framer-motion";

export default function Documents() {
  const { t } = useLanguage();

  const neededDocs = [
    t("ID / Passport copy", "Ausweis / Passkopie"),
    t("Proof of residence in Zürich", "Wohnsitznachweis in Zürich"),
    t("Financial situation overview (income, expenses)", "Finanzielle Übersicht (Einkommen, Ausgaben)"),
    t("Tax declaration (latest year)", "Steuererklärung (letztes Jahr)"),
    t("Proof of hardship or support letter", "Härtenachweis oder Unterstützungsschreiben"),
  ];

  return (
    <div className="py-8">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-6">{t("Documents", "Dokumente")}</h1>

          <Tabs defaultValue="needed">
            <TabsList className="w-full">
              <TabsTrigger value="needed" className="flex-1">{t("Needed Documents", "Benötigte Dokumente")}</TabsTrigger>
              <TabsTrigger value="my-docs" className="flex-1">{t("My Documents", "Meine Dokumente")}</TabsTrigger>
            </TabsList>

            <TabsContent value="needed" className="mt-4">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">{t("Documents you may need", "Dokumente, die Sie benötigen")}</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-3">
                    {neededDocs.map((doc, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm">
                        <FileText className="h-4 w-4 mt-0.5 text-primary shrink-0" />
                        <span>{doc}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="my-docs" className="mt-4">
              <Card>
                <CardContent className="py-12 text-center text-muted-foreground">
                  <Upload className="h-10 w-10 mx-auto mb-3 opacity-40" />
                  <p>{t("Document upload will be available soon.", "Dokumenten-Upload wird bald verfügbar sein.")}</p>
                  <p className="text-xs mt-1">{t("You'll be able to store and manage your application documents here.", "Sie können Ihre Bewerbungsdokumente hier speichern und verwalten.")}</p>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
