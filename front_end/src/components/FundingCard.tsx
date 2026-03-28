import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { MatchResult } from "@/services/matchingEngine";
import { ExternalLink, Mail } from "lucide-react";

interface FundingCardProps {
  result: MatchResult;
}

export default function FundingCard({ result }: FundingCardProps) {
  const { foundation: f, score, reasons } = result;

  const categories: string[] = [];
  if (f.jugendFamilie) categories.push("Jugend & Familie");
  if (f.aeltereMenschen) categories.push("Ältere Menschen");
  if (f.behinderungen) categories.push("Behinderungen");
  if (f.gesundheit) categories.push("Gesundheit");
  if (f.migration) categories.push("Migration");
  if (f.ausbildung) categories.push("Ausbildung");
  if (f.armut) categories.push("Armut");

  return (
    <Card className="hover:shadow-lg transition-shadow">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-lg">{f.name}</CardTitle>
          <Badge variant={score >= 70 ? "default" : score >= 40 ? "secondary" : "outline"}>
            {score}% Match
          </Badge>
        </div>
        <Progress value={score} className="h-1.5 mt-1" />
      </CardHeader>
      <CardContent className="space-y-3">
        <p className="text-sm text-muted-foreground">{f.description}</p>
        <div className="flex flex-wrap gap-1.5">
          {categories.map((c) => (
            <Badge key={c} variant="outline" className="text-xs">{c}</Badge>
          ))}
        </div>
        <div className="text-sm space-y-1">
          <p><span className="font-medium">Page:</span> {f.page}</p>
          <p><span className="font-medium">Why matched:</span> {reasons.join(" · ")}</p>
        </div>
        <div className="flex flex-wrap gap-2 pt-2">
          <Button size="sm" asChild>
            <a href={f.website} target="_blank" rel="noopener noreferrer">
              <ExternalLink className="h-3 w-3" /> Apply
            </a>
          </Button>
          <Button size="sm" variant="outline" asChild>
            <a href={`mailto:${f.contactEmail}`}><Mail className="h-3 w-3" /> Email</a>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
