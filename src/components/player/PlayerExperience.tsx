
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Briefcase, CalendarRange, Trophy, Pencil, X } from 'lucide-react';
import ExperienceForm from './ExperienceForm';

// Define the PlayerExperience interface
export interface PlayerExperience {
  id?: string;
  club: string;
  role: string;
  start_date: string;
  end_date?: string;
  is_current_role?: boolean;
  achievements?: string;
}

export interface PlayerExperienceProps {
  experiences: PlayerExperience[];
  isCurrentUserProfile: boolean;
  playerId: string;
}

const PlayerExperience = ({ experiences, isCurrentUserProfile, playerId }: PlayerExperienceProps) => {
  const [isAddingExperience, setIsAddingExperience] = useState(false);
  const [editingExperienceId, setEditingExperienceId] = useState<string | null>(null);
  
  const handleAddExperience = () => {
    setIsAddingExperience(true);
  };
  
  const handleCancelAdd = () => {
    setIsAddingExperience(false);
  };
  
  const handleEditExperience = (experienceId: string) => {
    setEditingExperienceId(experienceId);
  };
  
  const handleCancelEdit = () => {
    setEditingExperienceId(null);
  };
  
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Professional Experience</CardTitle>
            <CardDescription>Career history and achievements</CardDescription>
          </div>
          {isCurrentUserProfile && (
            <Button variant="outline" size="sm" onClick={handleAddExperience} disabled={isAddingExperience}>
              <Plus className="mr-2 h-4 w-4" />
              Add Experience
            </Button>
          )}
        </CardHeader>
        <CardContent className="space-y-6">
          {isAddingExperience && (
            <div className="mb-6 border rounded-md p-4 bg-muted/50">
              <div className="flex justify-between mb-4">
                <h4 className="font-medium">Add New Experience</h4>
                <Button variant="ghost" size="sm" onClick={handleCancelAdd}>
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <ExperienceForm 
                playerId={playerId}
                onCancel={handleCancelAdd}
                onComplete={() => setIsAddingExperience(false)}
              />
            </div>
          )}
          
          {experiences.length > 0 ? (
            experiences.map((experience) => (
              <div key={experience.id || `${experience.club}-${experience.role}`} className="border rounded-md p-4">
                {editingExperienceId === experience.id ? (
                  <div>
                    <div className="flex justify-between mb-4">
                      <h4 className="font-medium">Edit Experience</h4>
                      <Button variant="ghost" size="sm" onClick={handleCancelEdit}>
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    <ExperienceForm 
                      playerId={playerId}
                      experience={experience}
                      onCancel={handleCancelEdit}
                      onComplete={() => setEditingExperienceId(null)}
                    />
                  </div>
                ) : (
                  <div>
                    <div className="flex items-center justify-between">
                      <h4 className="font-bold">{experience.club}</h4>
                      {isCurrentUserProfile && (
                        <Button variant="ghost" size="sm" onClick={() => handleEditExperience(experience.id || '')}>
                          <Pencil className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Briefcase className="mr-1 h-4 w-4" />
                      <span>{experience.role}</span>
                    </div>
                    
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <CalendarRange className="mr-1 h-4 w-4" />
                      <span>
                        {new Date(experience.start_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })}
                        {' - '}
                        {experience.is_current_role 
                          ? 'Present'
                          : experience.end_date 
                            ? new Date(experience.end_date).toLocaleDateString('en-US', { year: 'numeric', month: 'short' })
                            : 'Present'
                        }
                      </span>
                    </div>
                    
                    {experience.achievements && (
                      <div className="mt-3">
                        <div className="flex items-center text-sm mb-1">
                          <Trophy className="mr-1 h-4 w-4 text-amber-500" />
                          <span className="font-medium">Achievements</span>
                        </div>
                        <p className="text-sm">{experience.achievements}</p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            ))
          ) : (
            <div className="text-center py-8 text-muted-foreground">
              No professional experience added yet.
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PlayerExperience;
