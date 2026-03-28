import { useLanguage } from "@/contexts/LanguageContext";

export default function Footer() {
  const { t } = useLanguage();
  return (
    <footer className="border-t bg-card mt-auto">
      <div className="container py-8">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-sm">
          <div>
            <h4 className="font-semibold text-foreground mb-2">FundingNavigator</h4>
            <p className="text-muted-foreground text-xs leading-relaxed">
              {t(
                "Turn a 120-page PDF into the right funding match in seconds.",
                "Verwandeln Sie ein 120-seitiges PDF in Sekunden in die richtige Förderung."
              )}
            </p>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">{t("Links", "Links")}</h4>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li><a href="/about" className="hover:text-primary transition-colors">{t("About", "Über uns")}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t("Privacy", "Datenschutz")}</a></li>
              <li><a href="#" className="hover:text-primary transition-colors">{t("Contact", "Kontakt")}</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">{t("Partners", "Partner")}</h4>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>Hack4SocialGood</li>
              <li>ZHAW</li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-foreground mb-2">{t("Emergency", "Notfall")}</h4>
            <ul className="space-y-1 text-muted-foreground text-xs">
              <li>{t("Police", "Polizei")}: 117</li>
              <li>{t("Medical", "Sanität")}: 144</li>
              <li>{t("Helpline", "Dargebotene Hand")}: 143</li>
            </ul>
          </div>
        </div>
        <div className="mt-8 pt-4 border-t text-center text-xs text-muted-foreground">
          © {new Date().getFullYear()} FundingNavigator · Hack4SocialGood × ZHAW
        </div>
      </div>
    </footer>
  );
}
