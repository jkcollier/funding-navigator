import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { Phone, Mail, MapPin, ChevronDown, ChevronUp, Globe } from "lucide-react";
import { motion } from "framer-motion";
import { emergencyCategories } from "@/data/emergencyContacts";

export default function Emergency() {
  const { t } = useLanguage();
  const [openCategories, setOpenCategories] = useState<string[]>([]);

  const toggleCategory = (title: string) => {
    setOpenCategories((prev) =>
      prev.includes(title) ? prev.filter((c) => c !== title) : [...prev, title]
    );
  };

  return (
    <div className="py-8">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-2">{t("Emergency Help", "Notfallhilfe")}</h1>
          <Card className="bg-destructive/5 border-destructive/20 mb-6">
            <CardContent className="p-4">
              <p className="text-sm font-medium text-destructive">
                {t(
                  "If your situation is urgent, please reach out to these organizations directly.",
                  "Wenn Ihre Situation dringend ist, wenden Sie sich bitte direkt an diese Organisationen."
                )}
              </p>
              <p className="text-xs text-muted-foreground mt-1">
                {t(
                  "Most social services are open Mon–Fri approx. 9–12 and 13:30–16:30. A telephone appointment is recommended.",
                  "Die meisten Sozialdienste sind Mo–Fr von ca. 9–12 und 13:30–16:30 Uhr geöffnet. Eine telefonische Voranmeldung wird empfohlen."
                )}
              </p>
            </CardContent>
          </Card>

          <div className="space-y-3">
            {emergencyCategories.map((cat) => {
              const isOpen = openCategories.includes(cat.titleEn);
              return (
                <Collapsible key={cat.titleEn} open={isOpen} onOpenChange={() => toggleCategory(cat.titleEn)}>
                  <Card>
                    <CollapsibleTrigger className="w-full">
                      <CardContent className="p-4 flex items-center justify-between">
                        <span className="font-semibold text-left">{t(cat.titleEn, cat.titleDe)}</span>
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-muted-foreground">{cat.contacts.length}</span>
                          {isOpen ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                        </div>
                      </CardContent>
                    </CollapsibleTrigger>
                    <CollapsibleContent>
                      <div className="px-4 pb-4 space-y-3">
                        {cat.contacts.map((c) => (
                          <Card key={c.nameEn + c.phone} className="border-l-4 border-l-destructive">
                            <CardContent className="p-4 space-y-2">
                              <h4 className="font-medium text-sm">{t(c.nameEn, c.nameDe)}</h4>
                              <p className="text-xs text-muted-foreground">{t(c.descriptionEn, c.descriptionDe)}</p>
                              {c.phone && <p className="text-lg font-bold text-primary">{c.phone}</p>}
                              {c.address && (
                                <p className="text-xs text-muted-foreground flex items-center gap-1"><MapPin className="h-3 w-3" /> {c.address}</p>
                              )}
                              <div className="flex flex-wrap gap-2 pt-1">
                                {c.phone && (
                                  <Button size="sm" variant="destructive" asChild>
                                    <a href={`tel:${c.phone.replace(/\s/g, "")}`}>
                                      <Phone className="h-3 w-3" /> {t("Call", "Anrufen")}
                                    </a>
                                  </Button>
                                )}
                                {c.emailWebsite && c.emailWebsite.includes("@") && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={`mailto:${c.emailWebsite.split("/")[0].trim()}`}>
                                      <Mail className="h-3 w-3" /> {t("Email", "E-Mail")}
                                    </a>
                                  </Button>
                                )}
                                {c.emailWebsite && c.emailWebsite.includes("www") && (
                                  <Button size="sm" variant="outline" asChild>
                                    <a href={`https://${c.emailWebsite.split("/").find(s => s.includes("www"))?.trim()}`} target="_blank" rel="noopener noreferrer">
                                      <Globe className="h-3 w-3" /> {t("Website", "Webseite")}
                                    </a>
                                  </Button>
                                )}
                              </div>
                            </CardContent>
                          </Card>
                        ))}
                      </div>
                    </CollapsibleContent>
                  </Card>
                </Collapsible>
              );
            })}
          </div>
        </motion.div>
      </div>
    </div>
  );
}
