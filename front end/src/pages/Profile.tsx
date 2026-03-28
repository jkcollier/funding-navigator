import { useLanguage } from "@/contexts/LanguageContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { User, Mail, Phone, MapPin, Calendar, Briefcase } from "lucide-react";
import { motion } from "framer-motion";

interface UserData {
  name?: string;
  age?: string;
  address?: string;
  email?: string;
  phone?: string;
  supportType?: string;
  situation?: string;
  fundingPurpose?: string;
  amountNeeded?: string;
  deadline?: string;
  institutionType?: string;
  institutionPurpose?: string;
  institutionAmount?: string;
  institutionDeadline?: string;
  projectDescription?: string;
  projectDuration?: string;
  projectAmount?: string;
  enrolledInSwissUni?: string;
  universityName?: string;
}

export default function Profile() {
  const { t } = useLanguage();
  const raw = localStorage.getItem("fn-user-data");
  const data: UserData = raw ? JSON.parse(raw) : {};
  const hasData = Object.values(data).some((v) => v && v.trim && v.trim().length > 0);

  const supportLabels: Record<string, string> = {
    private: t("Private Person", "Privatperson"),
    institution: t("Institution", "Institution"),
    project: t("Project Funding", "Projektförderung"),
    education: t("Education Funding", "Bildungsförderung"),
  };

  return (
    <div className="py-8">
      <div className="container max-w-2xl">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <h1 className="text-2xl font-bold mb-6">{t("My Profile", "Mein Profil")}</h1>

          {!hasData ? (
            <Card>
              <CardContent className="py-12 text-center text-muted-foreground">
                <User className="h-10 w-10 mx-auto mb-3 opacity-40" />
                <p>{t("No data submitted yet. Complete the questionnaire to see your profile.", "Noch keine Daten. Füllen Sie den Fragebogen aus, um Ihr Profil zu sehen.")}</p>
              </CardContent>
            </Card>
          ) : (
            <div className="space-y-4">
              {(data.name || data.email || data.phone || data.address || data.age) && (
                <Card>
                  <CardHeader><CardTitle className="text-lg">{t("Personal Information", "Persönliche Daten")}</CardTitle></CardHeader>
                  <CardContent className="space-y-3">
                    {data.name && <div className="flex items-center gap-2 text-sm"><User className="h-4 w-4 text-muted-foreground" /> {data.name}</div>}
                    {data.age && <div className="flex items-center gap-2 text-sm"><Calendar className="h-4 w-4 text-muted-foreground" /> {t("Age", "Alter")}: {data.age}</div>}
                    {data.email && <div className="flex items-center gap-2 text-sm"><Mail className="h-4 w-4 text-muted-foreground" /> {data.email}</div>}
                    {data.phone && <div className="flex items-center gap-2 text-sm"><Phone className="h-4 w-4 text-muted-foreground" /> {data.phone}</div>}
                    {data.address && <div className="flex items-center gap-2 text-sm"><MapPin className="h-4 w-4 text-muted-foreground" /> {data.address}</div>}
                  </CardContent>
                </Card>
              )}

              {data.supportType && (
                <Card>
                  <CardHeader><CardTitle className="text-lg">{t("Support Type", "Unterstützungsart")}</CardTitle></CardHeader>
                  <CardContent>
                    <Badge>{supportLabels[data.supportType] || data.supportType}</Badge>
                    {data.situation && <p className="text-sm mt-2 text-muted-foreground">{t("Situation", "Situation")}: {data.situation}</p>}
                  </CardContent>
                </Card>
              )}

              {(data.fundingPurpose || data.institutionPurpose || data.projectDescription) && (
                <Card>
                  <CardHeader><CardTitle className="text-lg">{t("Funding Details", "Förderdetails")}</CardTitle></CardHeader>
                  <CardContent className="space-y-2 text-sm">
                    {data.fundingPurpose && <p><Briefcase className="h-4 w-4 inline mr-1 text-muted-foreground" /> {data.fundingPurpose}</p>}
                    {data.institutionPurpose && <p><Briefcase className="h-4 w-4 inline mr-1 text-muted-foreground" /> {data.institutionPurpose}</p>}
                    {data.projectDescription && <p><Briefcase className="h-4 w-4 inline mr-1 text-muted-foreground" /> {data.projectDescription}</p>}
                    {(data.amountNeeded || data.institutionAmount || data.projectAmount) && (
                      <p className="text-muted-foreground">{t("Amount", "Betrag")}: CHF {data.amountNeeded || data.institutionAmount || data.projectAmount}</p>
                    )}
                    {(data.deadline || data.institutionDeadline) && (
                      <p className="text-muted-foreground">{t("Deadline", "Frist")}: {data.deadline || data.institutionDeadline}</p>
                    )}
                  </CardContent>
                </Card>
              )}

              {data.enrolledInSwissUni && (
                <Card>
                  <CardHeader><CardTitle className="text-lg">{t("Education", "Bildung")}</CardTitle></CardHeader>
                  <CardContent className="text-sm">
                    <p>{t("Enrolled in Swiss university", "An Schweizer Universität eingeschrieben")}: {data.enrolledInSwissUni === "yes" ? t("Yes", "Ja") : t("No", "Nein")}</p>
                    {data.universityName && <p className="text-muted-foreground mt-1">{data.universityName}</p>}
                  </CardContent>
                </Card>
              )}
            </div>
          )}
        </motion.div>
      </div>
    </div>
  );
}
