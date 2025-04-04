
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ChartContainer } from '@/components/ui/chart';
import { BarChartIcon, TrendingUp } from 'lucide-react';
import { BarChart, CartesianGrid, XAxis, YAxis, Tooltip, Bar, Legend } from 'recharts';

interface PlayerStatsProps {
  stats: {
    matches: number;
    goals: number;
    assists: number;
    yellowCards: number;
    redCards: number;
  };
  statsData: Array<{
    name: string;
    value: number;
  }>;
  recentPerformance: Array<{
    name: string;
    goals: number;
    assists: number;
  }>;
}

const PlayerStats = ({ stats, statsData, recentPerformance }: PlayerStatsProps) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base flex items-center">
            <BarChartIcon className="h-4 w-4 mr-2" />
            Performance Statistics
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer 
              config={{
                stats: { color: "#8B5CF6" }
              }}
            >
              <BarChart data={statsData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="value" fill="#8B5CF6" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="pb-0">
          <CardTitle className="text-base flex items-center">
            <TrendingUp className="h-4 w-4 mr-2" />
            Recent Performance
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-64">
            <ChartContainer 
              config={{
                goals: { color: "#8B5CF6" },
                assists: { color: "#22C55E" }
              }}
            >
              <BarChart data={recentPerformance}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="goals" fill="#8B5CF6" name="Goals" />
                <Bar dataKey="assists" fill="#22C55E" name="Assists" />
              </BarChart>
            </ChartContainer>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-4">
        <Card className="text-center">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">Matches</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <p className="text-3xl font-bold">{stats.matches}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">Goals</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <p className="text-3xl font-bold">{stats.goals}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">Assists</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <p className="text-3xl font-bold">{stats.assists}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">Yellow Cards</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <p className="text-3xl font-bold">{stats.yellowCards}</p>
          </CardContent>
        </Card>
        
        <Card className="text-center">
          <CardHeader className="py-3">
            <CardTitle className="text-sm font-medium text-gray-500">Red Cards</CardTitle>
          </CardHeader>
          <CardContent className="py-3">
            <p className="text-3xl font-bold">{stats.redCards}</p>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlayerStats;
