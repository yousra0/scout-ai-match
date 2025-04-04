
import { useState } from 'react';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

const positions = [
  'Any position',
  'Goalkeeper',
  'Defender',
  'Midfielder',
  'Forward'
];

const skills = [
  'Speed',
  'Technical',
  'Strength',
  'Tackling',
  'Passing',
  'Shooting',
  'Heading',
  'Dribbling',
  'Vision',
  'Leadership'
];

const ScoutingFilters = () => {
  const [ageRange, setAgeRange] = useState<number[]>([16, 40]);
  const [position, setPosition] = useState<string>('Any position');
  const [selectedSkills, setSelectedSkills] = useState<string[]>([]);
  
  const handleResetFilters = () => {
    setAgeRange([16, 40]);
    setPosition('Any position');
    setSelectedSkills([]);
  };

  const toggleSkill = (skill: string) => {
    if (selectedSkills.includes(skill)) {
      setSelectedSkills(selectedSkills.filter(s => s !== skill));
    } else {
      setSelectedSkills([...selectedSkills, skill]);
    }
  };

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <div className="flex justify-between">
          <Label htmlFor="age-range">Age Range</Label>
          <span className="text-sm text-muted-foreground">
            {ageRange[0]} - {ageRange[1]} years
          </span>
        </div>
        <Slider
          id="age-range"
          min={16}
          max={40}
          step={1}
          value={ageRange}
          onValueChange={setAgeRange}
          className="my-4"
        />
      </div>

      <div className="space-y-3">
        <Label htmlFor="position">Position</Label>
        <Select value={position} onValueChange={setPosition}>
          <SelectTrigger id="position">
            <SelectValue placeholder="Select position" />
          </SelectTrigger>
          <SelectContent>
            {positions.map(pos => (
              <SelectItem key={pos} value={pos}>
                {pos}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-3">
        <Label>Skills</Label>
        <div className="flex flex-wrap gap-2">
          {skills.map(skill => (
            <Button
              key={skill}
              variant={selectedSkills.includes(skill) ? "default" : "outline"}
              size="sm"
              onClick={() => toggleSkill(skill)}
              className="text-xs"
            >
              {skill}
            </Button>
          ))}
        </div>
      </div>

      <div className="space-y-3">
        <Label htmlFor="compatibility">Min. Compatibility Score</Label>
        <Slider
          id="compatibility"
          min={0}
          max={100}
          step={5}
          defaultValue={[70]}
          className="my-4"
        />
        <div className="flex justify-between text-xs text-muted-foreground">
          <span>0%</span>
          <span>50%</span>
          <span>100%</span>
        </div>
      </div>

      <Button 
        variant="outline" 
        size="sm" 
        className="w-full" 
        onClick={handleResetFilters}
      >
        <RefreshCw className="mr-2 h-4 w-4" />
        Reset Filters
      </Button>
    </div>
  );
};

export default ScoutingFilters;
