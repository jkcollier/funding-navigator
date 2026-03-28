import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Phone } from "lucide-react";

interface EmergencyCardProps {
  title: string;
  number: string;
  description: string;
  color?: string;
}

export default function EmergencyCard({ title, number, description }: EmergencyCardProps) {
  return (
    <Card className="hover:shadow-lg transition-shadow border-l-4 border-l-destructive">
      <CardContent className="p-5 flex items-center justify-between gap-4">
        <div className="space-y-1">
          <h3 className="font-semibold text-foreground">{title}</h3>
          <p className="text-sm text-muted-foreground">{description}</p>
          <p className="text-2xl font-bold text-primary">{number}</p>
        </div>
        <Button size="lg" className="shrink-0" asChild>
          <a href={`tel:${number}`}>
            <Phone className="h-4 w-4 mr-1" /> Call
          </a>
        </Button>
      </CardContent>
    </Card>
  );
}
