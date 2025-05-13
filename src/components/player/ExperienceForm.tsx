
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Checkbox } from '@/components/ui/checkbox';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';
import type { PlayerExperience } from './PlayerExperience';

export interface ExperienceFormProps {
  onCancel: () => void;
  onComplete: () => void;
  userId: string;
  experienceData?: PlayerExperience;
}

const ExperienceForm = ({ onCancel, onComplete, userId, experienceData }: ExperienceFormProps) => {
  const [club, setClub] = useState(experienceData?.club || '');
  const [role, setRole] = useState(experienceData?.role || '');
  const [startDate, setStartDate] = useState(experienceData?.start_date || '');
  const [endDate, setEndDate] = useState(experienceData?.end_date || '');
  const [isCurrent, setIsCurrent] = useState(experienceData?.is_current_role || false);
  const [achievements, setAchievements] = useState(experienceData?.achievements || '');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!club || !role || !startDate) {
      toast({
        title: 'Required fields missing',
        description: 'Please fill all required fields',
        variant: 'destructive',
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      const experienceData = {
        player_id: userId,
        club,
        role,
        start_date: startDate,
        end_date: isCurrent ? null : endDate,
        is_current_role: isCurrent,
        achievements: achievements || null,
      };
      
      let error;
      
      if (experienceData) {
        // Update existing experience
        const { error: updateError } = await supabase
          .from('player_experience')
          .update(experienceData)
          .eq('id', experienceData.id);
          
        error = updateError;
      } else {
        // Create new experience
        const { error: insertError } = await supabase
          .from('player_experience')
          .insert([experienceData]);
          
        error = insertError;
      }
      
      if (error) throw error;
      
      toast({
        title: experienceData ? 'Experience updated' : 'Experience added',
        description: experienceData ? 'Your experience has been updated successfully.' : 'Your experience has been added to your profile.',
      });
      
      onComplete();
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to save experience',
        variant: 'destructive',
      });
    } finally {
      setIsSubmitting(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="club">Club/Organization*</Label>
        <Input
          id="club"
          value={club}
          onChange={(e) => setClub(e.target.value)}
          placeholder="FC Barcelona"
          required
        />
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="role">Position/Role*</Label>
        <Input
          id="role"
          value={role}
          onChange={(e) => setRole(e.target.value)}
          placeholder="Forward, Coach, etc."
          required
        />
      </div>
      
      <div className="grid grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="startDate">Start Date*</Label>
          <Input
            id="startDate"
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="endDate">End Date</Label>
          <Input
            id="endDate"
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            disabled={isCurrent}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <Checkbox 
          id="current"
          checked={isCurrent}
          onCheckedChange={(checked) => setIsCurrent(checked as boolean)}
        />
        <Label htmlFor="current">I currently work here</Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="achievements">Key Achievements</Label>
        <Textarea
          id="achievements"
          value={achievements}
          onChange={(e) => setAchievements(e.target.value)}
          placeholder="Describe your key achievements, awards, or statistics..."
          rows={3}
        />
      </div>
      
      <div className="flex justify-end space-x-2 pt-2">
        <Button type="button" variant="outline" onClick={onCancel} disabled={isSubmitting}>
          Cancel
        </Button>
        <Button type="submit" disabled={isSubmitting}>
          {isSubmitting ? 'Saving...' : experienceData ? 'Update' : 'Save'}
        </Button>
      </div>
    </form>
  );
};

export default ExperienceForm;
