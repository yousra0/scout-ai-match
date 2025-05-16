
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Plus, Edit, Trash, Briefcase, CalendarIcon, Trophy } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { 
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import ExperienceForm from './ExperienceForm';

export interface PlayerExperience {
  id: string;
  club: string;
  role: string;
  start_date: string;
  end_date?: string;
  is_current_role?: boolean;
  achievements?: string;
}

interface PlayerExperienceProps {
  experiences: PlayerExperience[];
  isCurrentUserProfile: boolean;
  playerId: string;
}

const PlayerExperience = ({ experiences, isCurrentUserProfile, playerId }: PlayerExperienceProps) => {
  const [playerExperiences, setPlayerExperiences] = useState<PlayerExperience[]>(experiences);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [isEditingExperience, setIsEditingExperience] = useState(false);
  const [currentExperience, setCurrentExperience] = useState<PlayerExperience | null>(null);
  const { toast } = useToast();
  
  const handleDelete = async (id: string) => {
    try {
      const { error } = await supabase
        .from('player_experience')
        .delete()
        .eq('id', id);
      
      if (error) throw error;
      
      setPlayerExperiences(playerExperiences.filter(exp => exp.id !== id));
      
      toast({
        title: 'Experience deleted',
        description: 'The experience has been successfully removed from your profile.',
      });
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete experience',
        variant: 'destructive',
      });
    }
  };
  
  const handleAdd = () => {
    setIsAddingExperience(true);
  };
  
  const handleEdit = (experience: PlayerExperience) => {
    setCurrentExperience(experience);
    setIsEditingExperience(true);
  };
  
  const handleAddComplete = async () => {
    setIsAddingExperience(false);
    // Refresh experiences from DB
    const { data, error } = await supabase
      .from('player_experience')
      .select('*')
      .eq('player_id', playerId)
      .order('start_date', { ascending: false });
    
    if (!error && data) {
      setPlayerExperiences(data);
    }
  };
  
  const handleEditComplete = async () => {
    setIsEditingExperience(false);
    setCurrentExperience(null);
    // Refresh experiences from DB
    const { data, error } = await supabase
      .from('player_experience')
      .select('*')
      .eq('player_id', playerId)
      .order('start_date', { ascending: false });
    
    if (!error && data) {
      setPlayerExperiences(data);
    }
  };
  
  const formatDate = (dateString?: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'short' });
  };
  
  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-semibold">Professional Experience</h3>
        {isCurrentUserProfile && (
          <Button size="sm" onClick={handleAdd}>
            <Plus className="h-4 w-4 mr-1" /> Add Experience
          </Button>
        )}
      </div>
      
      {playerExperiences.length > 0 ? (
        <ScrollArea className="h-[400px] pr-4">
          <div className="space-y-4">
            {playerExperiences.map((experience) => (
              <div key={experience.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start">
                  <div className="flex items-start space-x-3">
                    <div className="bg-primary/10 p-2 rounded">
                      <Briefcase className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h4 className="font-semibold">{experience.club}</h4>
                      <p className="text-sm text-muted-foreground">{experience.role}</p>
                    </div>
                  </div>
                  {isCurrentUserProfile && (
                    <div className="flex space-x-2">
                      <Button size="icon" variant="ghost" onClick={() => handleEdit(experience)}>
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button size="icon" variant="ghost" onClick={() => handleDelete(experience.id)}>
                        <Trash className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="flex items-center mt-2 text-sm text-muted-foreground">
                  <CalendarIcon className="h-3 w-3 mr-1" />
                  <span>
                    {formatDate(experience.start_date)} - {experience.is_current_role ? 'Present' : formatDate(experience.end_date)}
                  </span>
                </div>
                
                {experience.achievements && (
                  <div className="mt-2">
                    <div className="flex items-center text-sm">
                      <Trophy className="h-3 w-3 mr-1 text-amber-500" />
                      <span className="font-medium">Achievements</span>
                    </div>
                    <p className="text-sm mt-1">{experience.achievements}</p>
                  </div>
                )}
              </div>
            ))}
          </div>
        </ScrollArea>
      ) : (
        <div className="text-center py-8 border border-dashed rounded-md">
          <Briefcase className="h-8 w-8 mx-auto text-muted-foreground" />
          <p className="mt-2 text-muted-foreground">No experience added yet</p>
          {isCurrentUserProfile && (
            <Button size="sm" variant="outline" className="mt-4" onClick={handleAdd}>
              <Plus className="h-4 w-4 mr-1" /> Add Experience
            </Button>
          )}
        </div>
      )}
      
      <Dialog open={isAddingExperience} onOpenChange={setIsAddingExperience}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add Professional Experience</DialogTitle>
          </DialogHeader>
          <ExperienceForm 
            onCancel={() => setIsAddingExperience(false)} 
            onComplete={handleAddComplete}
            userId={playerId}
          />
        </DialogContent>
      </Dialog>
      
      <Dialog open={isEditingExperience} onOpenChange={setIsEditingExperience}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Experience</DialogTitle>
          </DialogHeader>
          {currentExperience && (
            <ExperienceForm 
              onCancel={() => setIsEditingExperience(false)} 
              onComplete={handleEditComplete}
              userId={playerId}
              experienceData={currentExperience}
            />
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default PlayerExperience;
