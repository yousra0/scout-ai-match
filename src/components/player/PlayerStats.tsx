
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BarChart3, TrendingUp, TrendingDown } from 'lucide-react';

export interface StatData {
  label: string;
  value: number;
  changeDirection?: 'up' | 'down' | 'neutral';
  changeValue?: number;
}

export interface PerformanceData {
  date: string;
  opponent: string;
  result: string;
  goals?: number;
  assists?: number;
  rating: number;
}

export interface PlayerStatsProps {
  statsData: StatData[];
  recentPerformance: PerformanceData[];
}

const PlayerStats = ({ statsData, recentPerformance }: PlayerStatsProps) => {
  // Use the provided stats data or fall back to sample data
  const stats = statsData || [
    { label: "Goals", value: 12, changeDirection: "up", changeValue: 3 },
    { label: "Assists", value: 8, changeDirection: "up", changeValue: 2 },
    { label: "Matches", value: 28, changeDirection: "neutral" },
    { label: "Minutes Played", value: 2340, changeDirection: "up", changeValue: 340 },
    { label: "Yellow Cards", value: 3, changeDirection: "down", changeValue: 1 },
    { label: "Red Cards", value: 0, changeDirection: "neutral" },
  ];

  // Use provided performance data or fall back to sample data
  const performances = recentPerformance || [
    { date: "2024-05-08", opponent: "FC Barcelona", result: "W 2-1", goals: 1, assists: 0, rating: 8.4 },
    { date: "2024-05-03", opponent: "Real Madrid", result: "D 1-1", goals: 0, assists: 1, rating: 7.9 },
    { date: "2024-04-27", opponent: "Atletico Madrid", result: "L 0-2", goals: 0, assists: 0, rating: 6.5 },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Season Statistics</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {stats.map((stat, index) => (
            <Card key={index}>
              <CardHeader className="py-3 px-4">
                <CardTitle className="text-sm font-medium">{stat.label}</CardTitle>
              </CardHeader>
              <CardContent className="py-2 px-4 pb-3">
                <div className="flex items-baseline justify-between">
                  <div className="text-2xl font-semibold">{stat.value}</div>
                  {stat.changeDirection && (
                    <div className={`flex items-center text-xs ${
                      stat.changeDirection === 'up' ? 'text-green-500' : 
                      stat.changeDirection === 'down' ? 'text-red-500' : 
                      'text-gray-500'
                    }`}>
                      {stat.changeDirection === 'up' && <TrendingUp className="h-3 w-3 mr-1" />}
                      {stat.changeDirection === 'down' && <TrendingDown className="h-3 w-3 mr-1" />}
                      {stat.changeValue ? (stat.changeDirection === 'up' ? '+' : '') + stat.changeValue : ''}
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
      
      <div>
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Recent Form</h3>
          <div className="flex items-center text-sm text-muted-foreground">
            <BarChart3 className="h-4 w-4 mr-1" />
            Last 5 matches
          </div>
        </div>
        
        <div className="border rounded-lg overflow-hidden">
          <div className="min-w-full divide-y">
            <div className="bg-muted">
              <div className="grid grid-cols-6 py-2 px-4 text-xs font-medium text-muted-foreground">
                <div>Date</div>
                <div className="col-span-2">Opponent</div>
                <div>Result</div>
                <div>G/A</div>
                <div>Rating</div>
              </div>
            </div>
            <div className="bg-card divide-y">
              {performances.map((match, index) => (
                <div key={index} className="grid grid-cols-6 py-3 px-4 text-sm">
                  <div>{new Date(match.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</div>
                  <div className="col-span-2">{match.opponent}</div>
                  <div 
                    className={
                      match.result.startsWith('W') ? 'text-green-600' : 
                      match.result.startsWith('L') ? 'text-red-600' : 
                      'text-amber-600'
                    }
                  >
                    {match.result}
                  </div>
                  <div>{match.goals || 0}/{match.assists || 0}</div>
                  <div 
                    className={
                      match.rating >= 8 ? 'text-green-600 font-medium' : 
                      match.rating < 6 ? 'text-red-600' : 
                      'text-muted-foreground'
                    }
                  >
                    {match.rating}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlayerStats;
