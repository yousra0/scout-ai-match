
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { ChartContainer } from '@/components/ui/chart';
import { BarChartIcon } from 'lucide-react';
import { RadarChart, PolarGrid, PolarAngleAxis, PolarRadiusAxis, Radar, Legend } from 'recharts';

interface PlayerAttributesProps {
  attributes: {
    pace: number;
    shooting: number;
    passing: number;
    dribbling: number;
    defending: number;
    physical: number;
  };
  radarData: Array<{
    subject: string;
    A: number;
    fullMark: number;
  }>;
}

const PlayerAttributes = ({ attributes, radarData }: PlayerAttributesProps) => {
  return (
    <div>
      <h3 className="text-lg font-semibold mb-3">Key Attributes</h3>
      <div className="grid grid-cols-1 gap-4">
        <Card>
          <CardHeader className="pb-0">
            <CardTitle className="text-base flex items-center">
              <BarChartIcon className="h-4 w-4 mr-2" />
              Player Attributes Radar
            </CardTitle>
          </CardHeader>
          <CardContent className="pb-2">
            <div className="h-72">
              <ChartContainer 
                config={{
                  attributes: { color: "#8B5CF6" }
                }}
              >
                <RadarChart data={radarData}>
                  <PolarGrid />
                  <PolarAngleAxis dataKey="subject" />
                  <PolarRadiusAxis domain={[0, 100]} />
                  <Radar
                    name="Player"
                    dataKey="A"
                    stroke="#8B5CF6"
                    fill="#8B5CF6"
                    fillOpacity={0.5}
                  />
                  <Legend />
                </RadarChart>
              </ChartContainer>
            </div>
          </CardContent>
        </Card>

        <Accordion type="single" collapsible className="w-full">
          <AccordionItem value="detailed-attributes">
            <AccordionTrigger className="text-sm font-medium">
              View Detailed Attributes
            </AccordionTrigger>
            <AccordionContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                {Object.entries(attributes).map(([key, value]) => (
                  <div key={key} className="space-y-1">
                    <div className="flex justify-between text-sm">
                      <span className="capitalize">{key}</span>
                      <span className="font-medium">{value}/100</span>
                    </div>
                    <Progress value={value} className="h-2" />
                  </div>
                ))}
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </div>
    </div>
  );
};

export default PlayerAttributes;
