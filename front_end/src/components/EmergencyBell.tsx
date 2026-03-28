import { useState } from "react";
import { useLanguage } from "@/contexts/LanguageContext";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Bell, Phone } from "lucide-react";
import { quickEmergencyContacts } from "@/data/emergencyContacts";

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
        <div className="space-y-2 pt-2">
          {quickEmergencyContacts.map((c) => (
            <div
              key={c.number}
              className="flex items-center justify-between p-3 rounded-lg border bg-card hover:bg-muted transition-colors"
            >
              <div>
                <p className="text-sm font-medium">{t(c.nameEn, c.nameDe)}</p>
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
      </DialogContent>
    </Dialog>
  );
}
