import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Phone, Flame, ShieldAlert, Heart, Stethoscope } from "lucide-react";

const emergencyCategories = [
  {
    titleEn: "Medical Emergencies",
    titleDe: "Medizinische Notfälle",
    icon: Stethoscope,
    contacts: [
      { name: "Sanität / Ambulance", number: "144" },
      { name: "Toxikologisches Zentrum (Poison)", number: "145" },
      { name: "Rega (Air Rescue)", number: "1414" },
    ],
  },
  {
    titleEn: "Fire",
    titleDe: "Feuerwehr",
    icon: Flame,
    contacts: [{ name: "Feuerwehr / Fire Department", number: "118" }],
  },
  {
    titleEn: "Police",
    titleDe: "Polizei",
    icon: ShieldAlert,
    contacts: [{ name: "Polizei / Police", number: "117" }],
  },
  {
    titleEn: "General & Emotional Support",
    titleDe: "Allgemeine & Emotionale Hilfe",
    icon: Heart,
    contacts: [
      { name: "Dargebotene Hand (24/7)", number: "143" },
      { name: "Pro Juventute (Youth)", number: "147" },
      { name: "Frauenhaus Zürich (Women)", number: "044 350 04 04" },
    ],
  },
];

export default function EmergencyBell() {
  const { t } = useLanguage();
  const [open, setOpen] = useState(false);

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <button
          className="fixed top-20 right-4 z-50 h-12 w-12 rounded-full bg-destructive text-destructive-foreground shadow-lg flex items-center justify-center hover:scale-110 transition-transform animate-pulse"
          aria-label={t("Emergency Help", "Notfallhilfe")}
        >
          <Bell className="h-6 w-6" />
        </button>
      </DialogTrigger>
      <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Bell className="h-5 w-5" />
            {t("Emergency Contacts", "Notrufnummern")}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-5 pt-2">
          {emergencyCategories.map((cat) => (
            <div key={cat.titleEn}>
              <h3 className="text-sm font-semibold flex items-center gap-2 mb-2">
                <cat.icon className="h-4 w-4 text-primary" />
                {t(cat.titleEn, cat.titleDe)}
              </h3>
              <div className="space-y-2">
                {cat.contacts.map((c) => (
                  <div
                    key={c.number}
                    className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted transition-colors"
                  >
                    <div>
                      <p className="text-sm font-medium">{c.name}</p>
                      <p className="text-lg font-bold text-primary">{c.number}</p>
                    </div>
                    <Button size="sm" variant="destructive" asChild>
                      <a href={`tel:${c.number}`}>
                        <Phone className="h-4 w-4" />
                        {t("Call", "Anrufen")}
                      </a>
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
