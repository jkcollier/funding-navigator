import { useState, useEffect } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { FileText, Download, Trash2, FileCheck } from "lucide-react";
import { motion } from "framer-motion";
import { mockFoundations } from "@/data/mockFoundations";
import { generateApplicationDoc } from "@/services/documentGenerator";

interface GeneratedDoc {
  id: string;
  orgName: string;
  date: string;
}

export default function Documents() {
  const { t } = useLanguage();
  const [generatedDocs, setGeneratedDocs] = useState<GeneratedDoc[]>([]);

  useEffect(() => {
    const docs = JSON.parse(localStorage.getItem("fn-generated-docs") || "[]");
    setGeneratedDocs(docs);
  }, []);

  const handleRedownload = async (doc: GeneratedDoc) => {
    const foundation = mockFoundations.find((f) => f.id === doc.id);
    if (foundation) {
      await generateApplicationDoc(foundation);
    }
  };

  const handleDelete = (index: number) => {
    const updated = generatedDocs.filter((_, i) => i !== index);
    setGeneratedDocs(updated);
    localStorage.setItem("fn-generated-docs", JSON.stringify(updated));
  };

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
              {generatedDocs.length === 0 ? (
                <Card>
                  <CardContent className="py-12 text-center text-muted-foreground">
                    <FileCheck className="h-10 w-10 mx-auto mb-3 opacity-40" />
                    <p>{t("No generated documents yet.", "Noch keine generierten Dokumente.")}</p>
                    <p className="text-xs mt-1">{t("Your generated applications will appear here.", "Ihre generierten Bewerbungen werden hier angezeigt.")}</p>
                  </CardContent>
                </Card>
              ) : (
                <div className="space-y-3">
                  {generatedDocs.map((doc, i) => (
                    <Card key={i}>
                      <CardContent className="p-4 flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <FileText className="h-5 w-5 text-primary" />
                          <div>
                            <p className="text-sm font-medium">{doc.orgName}</p>
                            <p className="text-xs text-muted-foreground">
                              {new Date(doc.date).toLocaleDateString()}
                            </p>
                          </div>
                        </div>
                        <div className="flex gap-2">
                          <Button size="sm" variant="outline" onClick={() => handleRedownload(doc)}>
                            <Download className="h-3 w-3" />
                          </Button>
                          <Button size="sm" variant="outline" onClick={() => handleDelete(i)} className="text-destructive hover:text-destructive">
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </TabsContent>
          </Tabs>
        </motion.div>
      </div>
    </div>
  );
}
