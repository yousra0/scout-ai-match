
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Edit, Plus, Trash2 } from 'lucide-react';
import { useAuth, PlayerExperience as PlayerExperienceType } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import ExperienceForm from './ExperienceForm';

interface Education {
  institution: string;
  qualification: string;
  period: string;
}

interface PlayerExperienceProps {
  experiences: PlayerExperienceType[] | Array<{
    club: string;
    role: string;
    period: string;
    achievements: string;
  }>;
  education: Education[];
  isCurrentUserProfile: boolean;
  playerId: string;
}

const PlayerExperience = ({ experiences, education, isCurrentUserProfile, playerId }: PlayerExperienceProps) => {
  const [editingExperience, setEditingExperience] = useState<PlayerExperienceType | null>(null);
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const { addPlayerExperience, updatePlayerExperience, deletePlayerExperience } = useAuth();
  const { toast } = useToast();
  
  const handleAddExperience = async (experience: Omit<PlayerExperienceType, 'id' | 'player_id'>) => {
    try {
      await addPlayerExperience({
        ...experience,
        player_id: playerId
      });
      
      toast({
        title: "Experience Added",
        description: "Your experience has been added successfully."
      });
      
      setIsAddingExperience(false);
      // Reload page to show updated data
      window.location.reload();
      
    } catch (error) {
      console.error('Error adding experience:', error);
      toast({
        title: "Error",
        description: "Failed to add experience. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleUpdateExperience = async (id: string, data: Partial<PlayerExperienceType>) => {
    try {
      await updatePlayerExperience(id, data);
      
      toast({
        title: "Experience Updated",
        description: "Your experience has been updated successfully."
      });
      
      setEditingExperience(null);
      // Reload page to show updated data
      window.location.reload();
      
    } catch (error) {
      console.error('Error updating experience:', error);
      toast({
        title: "Error",
        description: "Failed to update experience. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  const handleDeleteExperience = async (id: string) => {
    if (!confirm('Are you sure you want to delete this experience?')) {
      return;
    }
    
    try {
      await deletePlayerExperience(id);
      
      toast({
        title: "Experience Deleted",
        description: "Your experience has been deleted successfully."
      });
      
      // Reload page to show updated data
      window.location.reload();
      
    } catch (error) {
      console.error('Error deleting experience:', error);
      toast({
        title: "Error",
        description: "Failed to delete experience. Please try again.",
        variant: "destructive"
      });
    }
  };
  
  // Determine if experiences are from database or from mock data
  const isDbExperiences = experiences.length > 0 && 'id' in experiences[0];
  
  return (
    <div className="space-y-6">
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-semibold">Club Experience</h3>
          {isCurrentUserProfile && (
            <Button 
              onClick={() => setIsAddingExperience(true)} 
              variant="outline" 
              size="sm"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Experience
            </Button>
          )}
        </div>
        
        {isAddingExperience && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50">
            <h4 className="font-medium mb-2">Add New Experience</h4>
            <ExperienceForm
              onSubmit={handleAddExperience}
              onCancel={() => setIsAddingExperience(false)}
            />
          </div>
        )}
        
        {editingExperience && (
          <div className="mb-6 p-4 border rounded-md bg-gray-50">
            <h4 className="font-medium mb-2">Edit Experience</h4>
            <ExperienceForm
              experience={editingExperience}
              onSubmit={(data) => handleUpdateExperience(editingExperience.id, data)}
              onCancel={() => setEditingExperience(null)}
            />
          </div>
        )}
        
        <div className="space-y-6">
          {isDbExperiences ? (
            // Render database experiences with edit/delete buttons
            (experiences as PlayerExperienceType[]).map((exp, index) => (
              <div key={exp.id} className="border-l-2 border-primary pl-4 pb-6">
                <div className="flex justify-between items-start">
                  <div>
                    <h4 className="font-medium">{exp.club}</h4>
                    <div className="text-sm text-gray-600">
                      {exp.role} • {new Date(exp.start_date).toLocaleDateString()} to {exp.end_date ? new Date(exp.end_date).toLocaleDateString() : 'Present'}
                    </div>
                    <p className="mt-1 text-sm">{exp.achievements}</p>
                  </div>
                  
                  {isCurrentUserProfile && (
                    <div className="flex space-x-2">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => setEditingExperience(exp)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        onClick={() => handleDeleteExperience(exp.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </div>
              </div>
            ))
          ) : (
            // Render mock data experiences
            experiences.map((exp: any, index: number) => (
              <div key={index} className="border-l-2 border-primary pl-4 pb-6">
                <h4 className="font-medium">{exp.club}</h4>
                <div className="text-sm text-gray-600">{exp.role} • {exp.period}</div>
                <p className="mt-1 text-sm">{exp.achievements}</p>
              </div>
            ))
          )}
        </div>
      </div>
      
      <div>
        <h3 className="text-lg font-semibold mb-4">Education & Training</h3>
        <div className="space-y-6">
          {education.map((edu, index) => (
            <div key={index} className="border-l-2 border-gray-300 pl-4">
              <h4 className="font-medium">{edu.institution}</h4>
              <div className="text-sm text-gray-600">{edu.qualification} • {edu.period}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default PlayerExperience;
