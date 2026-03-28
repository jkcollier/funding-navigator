import { useLanguage } from "@/contexts/LanguageContext";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { motion } from "framer-motion";

export default function FAQs() {
  const { t } = useLanguage();

  const faqs = [
    {
      q: t("What is Funding Navigator?", "Was ist Funding Navigator?"),
      a: t(
        "Funding Navigator is a matching tool that helps individuals, social workers, and NGOs find the right funding opportunities from foundations in the Canton of Zürich.",
        "Funding Navigator ist ein Matching-Tool, das Einzelpersonen, Sozialarbeitern und NGOs hilft, die richtigen Fördermöglichkeiten von Stiftungen im Kanton Zürich zu finden."
      ),
    },
    {
      q: t("Is this service free?", "Ist dieser Service kostenlos?"),
      a: t(
        "Yes, Funding Navigator is completely free to use. We help you navigate funding options without any charges.",
        "Ja, Funding Navigator ist komplett kostenlos. Wir helfen Ihnen, Fördermöglichkeiten ohne Kosten zu finden."
      ),
    },
    {
      q: t("Do I need to share personal information?", "Muss ich persönliche Informationen teilen?"),
      a: t(
        "No, sharing personal information is optional. You can choose to skip sensitive data and still receive funding recommendations based on your situation.",
        "Nein, die Weitergabe persönlicher Daten ist optional. Sie können sensible Daten überspringen und erhalten trotzdem Förderempfehlungen basierend auf Ihrer Situation."
      ),
    },
    {
      q: t("How accurate are the matches?", "Wie genau sind die Matches?"),
      a: t(
        "Our matching is based on the categories and criteria published by each foundation. The more details you provide, the more accurate your results will be.",
        "Unser Matching basiert auf den Kategorien und Kriterien jeder Stiftung. Je mehr Details Sie angeben, desto genauer werden Ihre Ergebnisse."
      ),
    },
    {
      q: t("Can I apply directly through Funding Navigator?", "Kann ich mich direkt über Funding Navigator bewerben?"),
      a: t(
        "Some foundations allow direct applications while others require you to apply on their website. We clearly indicate which option applies for each foundation.",
        "Einige Stiftungen erlauben direkte Bewerbungen, andere erfordern eine Bewerbung auf ihrer Website. Wir zeigen klar an, welche Option für jede Stiftung gilt."
      ),
    },
    {
      q: t("Is my data stored securely?", "Werden meine Daten sicher gespeichert?"),
      a: t(
        "Currently, your data is stored locally in your browser and is not sent to any server. In the future, we plan to add secure server-side storage.",
        "Derzeit werden Ihre Daten lokal in Ihrem Browser gespeichert und nicht an einen Server gesendet. Zukünftig planen wir sichere serverseitige Speicherung."
      ),
    },
    {
      q: t("What if I need emergency help?", "Was ist, wenn ich Nothilfe brauche?"),
      a: t(
        "Use the red emergency bell button available throughout the app to access emergency contacts including medical, police, and social services in Zürich.",
        "Verwenden Sie den roten Notfall-Glocken-Button in der App, um Notfallkontakte wie Medizin, Polizei und Sozialdienste in Zürich zu erreichen."
      ),
    },
    {
      q: t("Who created Funding Navigator?", "Wer hat Funding Navigator erstellt?"),
      a: t(
        "Funding Navigator was created as part of Hack4SocialGood at ZHAW, with the goal of making funding information accessible to those who need it most.",
        "Funding Navigator wurde im Rahmen von Hack4SocialGood an der ZHAW erstellt, mit dem Ziel, Förderinformationen für diejenigen zugänglich zu machen, die sie am meisten brauchen."
      ),
    },
  ];

  return (
    <div className="py-8">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-2">{t("Frequently Asked Questions", "Häufig gestellte Fragen")}</h1>
          <p className="text-muted-foreground mb-6">
            {t("Find answers to common questions about Funding Navigator.", "Finden Sie Antworten auf häufige Fragen zu Funding Navigator.")}
          </p>

          <Accordion type="single" collapsible className="space-y-2">
            {faqs.map((faq, i) => (
              <AccordionItem key={i} value={`faq-${i}`} className="border rounded-lg px-4">
                <AccordionTrigger className="text-sm font-medium text-left">{faq.q}</AccordionTrigger>
                <AccordionContent className="text-sm text-muted-foreground">{faq.a}</AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </div>
  );
}
