import { useLanguage } from "@/contexts/LanguageContext";
import EmergencyCard from "@/components/EmergencyCard";

export default function Emergency() {
  const { t } = useLanguage();

  const contacts = [
    { title: t("Police", "Polizei"), number: "117", description: t("For crimes, accidents, and public safety", "Für Verbrechen, Unfälle und öffentliche Sicherheit") },
    { title: t("Fire Department", "Feuerwehr"), number: "118", description: t("Fire emergencies and rescue operations", "Brandeinsätze und Rettungseinsätze") },
    { title: t("Medical Emergency", "Sanität"), number: "144", description: t("Ambulance and medical emergencies", "Krankenwagen und medizinische Notfälle") },
    { title: t("Poison Hotline", "Vergiftungsnotfall"), number: "145", description: t("Poisoning emergencies and toxicology advice", "Vergiftungsnotfälle und toxikologische Beratung") },
    { title: t("Rega (Air Rescue)", "Rega (Luftrettung)"), number: "1414", description: t("Helicopter rescue service", "Helikopter-Rettungsdienst") },
    { title: t("Helpline Switzerland (24/7)", "Dargebotene Hand (24/7)"), number: "143", description: t("Confidential support for people in distress", "Vertrauliche Unterstützung für Menschen in Not") },
    { title: t("Pro Juventute (Youth)", "Pro Juventute (Jugend)"), number: "147", description: t("Support for children and young people", "Unterstützung für Kinder und Jugendliche") },
  ];

  return (
    <div className="py-8">
      <div className="container max-w-2xl">
        <h1 className="text-2xl font-bold mb-2">{t("Emergency Help", "Notfallhilfe")}</h1>
        <p className="text-muted-foreground mb-8">
          {t(
            "If you are in immediate danger, call the appropriate emergency number below.",
            "Wenn Sie in unmittelbarer Gefahr sind, rufen Sie die entsprechende Notfallnummer an."
          )}
        </p>
        <div className="space-y-4">
          {contacts.map((c) => (
            <EmergencyCard key={c.number} {...c} />
          ))}
        </div>
      </div>
    </div>
  );
}
