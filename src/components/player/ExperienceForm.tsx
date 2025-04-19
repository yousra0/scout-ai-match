
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Loader2 } from 'lucide-react';
import { PlayerExperience } from '@/contexts/AuthContext';

interface ExperienceFormProps {
  experience?: PlayerExperience;
  onSubmit: (data: any) => void;
  onCancel: () => void;
}

const ExperienceForm = ({ experience, onSubmit, onCancel }: ExperienceFormProps) => {
  const [formData, setFormData] = useState({
    club: experience?.club || '',
    role: experience?.role || '',
    start_date: experience?.start_date ? new Date(experience.start_date).toISOString().split('T')[0] : '',
    end_date: experience?.end_date ? new Date(experience.end_date).toISOString().split('T')[0] : '',
    achievements: experience?.achievements || '',
    is_current: experience?.end_date ? false : true
  });
  
  const [isLoading, setIsLoading] = useState(false);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
  
  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { checked } = e.target;
    setFormData(prev => ({
      ...prev,
      is_current: checked,
      end_date: checked ? '' : prev.end_date
    }));
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    
    try {
      await onSubmit({
        club: formData.club,
        role: formData.role,
        start_date: formData.start_date,
        end_date: formData.is_current ? null : formData.end_date || null,
        achievements: formData.achievements
      });
    } catch (error) {
      console.error('Form submission error:', error);
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-2">
          <Label htmlFor="club">Club</Label>
          <Input
            id="club"
            name="club"
            value={formData.club}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="FC Barcelona"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="role">Position/Role</Label>
          <Input
            id="role"
            name="role"
            value={formData.role}
            onChange={handleChange}
            required
            disabled={isLoading}
            placeholder="Striker"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="start_date">Start Date</Label>
          <Input
            id="start_date"
            name="start_date"
            type="date"
            value={formData.start_date}
            onChange={handleChange}
            required
            disabled={isLoading}
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="end_date" className={formData.is_current ? "text-gray-400" : ""}>End Date</Label>
          <Input
            id="end_date"
            name="end_date"
            type="date"
            value={formData.end_date}
            onChange={handleChange}
            disabled={isLoading || formData.is_current}
          />
        </div>
      </div>
      
      <div className="flex items-center space-x-2">
        <input
          type="checkbox"
          id="is_current"
          checked={formData.is_current}
          onChange={handleCheckboxChange}
          disabled={isLoading}
          className="h-4 w-4 rounded border-gray-300 text-primary focus:ring-primary"
        />
        <Label htmlFor="is_current" className="font-normal text-sm">
          I currently play here
        </Label>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="achievements">Achievements</Label>
        <Textarea
          id="achievements"
          name="achievements"
          value={formData.achievements}
          onChange={handleChange}
          disabled={isLoading}
          rows={3}
          placeholder="Goals scored, trophies won, etc."
        />
      </div>
      
      <div className="flex justify-end space-x-3 pt-2">
        <Button
          type="button"
          variant="outline"
          onClick={onCancel}
          disabled={isLoading}
        >
          Cancel
        </Button>
        
        <Button
          type="submit"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              {experience ? 'Updating...' : 'Adding...'}
            </>
          ) : (
            experience ? 'Update Experience' : 'Add Experience'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ExperienceForm;
