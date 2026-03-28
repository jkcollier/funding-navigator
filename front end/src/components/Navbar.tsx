import { Link, useLocation } from "react-router-dom";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { Menu, Home, User, FileText, Settings, HelpCircle } from "lucide-react";
import { useState } from "react";

export default function Navbar() {
  const { language, setLanguage, t } = useLanguage();
  const location = useLocation();
  const [open, setOpen] = useState(false);

  if (location.pathname === "/") return null;

  const links = [
    { to: "/portal", label: t("Home", "Startseite"), icon: Home },
    { to: "/profile", label: t("Profile", "Profil"), icon: User },
    { to: "/documents", label: t("Documents", "Dokumente"), icon: FileText },
    { to: "/settings", label: t("Settings", "Einstellungen"), icon: Settings },
    { to: "/faqs", label: t("FAQs", "FAQs"), icon: HelpCircle },
  ];

  return (
    <nav className="sticky top-0 z-50 border-b bg-card/95 backdrop-blur supports-[backdrop-filter]:bg-card/80">
      <div className="container flex h-16 items-center justify-between">
        <Link to="/portal" className="flex items-center gap-2 font-bold text-lg text-primary">
          <div className="h-8 w-8 rounded-lg bg-primary flex items-center justify-center">
            <span className="text-primary-foreground text-sm font-bold">FN</span>
          </div>
          Funding Navigator
        </Link>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            className="text-xs font-semibold"
            onClick={() => setLanguage(language === "en" ? "de" : "en")}
          >
            {language === "en" ? "DE" : "EN"}
          </Button>

          <Sheet open={open} onOpenChange={setOpen}>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon">
                <Menu className="h-5 w-5" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-72">
              <div className="flex flex-col gap-1 mt-8">
                {links.map((link) => {
                  const Icon = link.icon;
                  return (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-colors hover:bg-muted ${
                        location.pathname === link.to
                          ? "bg-muted text-primary font-semibold"
                          : "text-muted-foreground"
                      }`}
                    >
                      <Icon className="h-5 w-5" />
                      {link.label}
                    </Link>
                  );
                })}
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </nav>
  );
}
