import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { MatchResult, getTagColor } from "@/services/matchingEngine";
import { translateField, translateList } from "@/services/translationHelper";
import { useLanguage } from "@/contexts/LanguageContext";
import { ExternalLink, Mail } from "lucide-react";

interface FundingCardProps {
  result: MatchResult;
}

export default function FundingCard({ result }: FundingCardProps) {
  const { language } = useLanguage();
  const { foundation: f, tag, reasons } = result;
  const zielgruppe = translateList(f.zielgruppe, language).slice(0, 4);

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{f.name}</CardTitle>
          <Badge className={getTagColor(tag)}>{tag}</Badge>
        </div>
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground line-clamp-2">{translateField(f.description, language)}</p>
        <div className="flex flex-wrap gap-1.5">
          {zielgruppe.map((z) => (
            <Badge key={z} variant="outline" className="text-xs">{z}</Badge>
          ))}
        </div>
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Why matched:</span> {reasons.join(" · ")}</p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          {f.website && (
            <Button size="sm" asChild>
              <a href={f.website.startsWith("http") ? f.website : `https://${f.website}`} target="_blank" rel="noopener noreferrer">
                <ExternalLink className="h-3 w-3" /> Website
              </a>
            </Button>
          )}
          {f.email && (
            <Button size="sm" variant="outline" asChild>
              <a href={`mailto:${f.email}`}><Mail className="h-3 w-3" /> Email</a>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
