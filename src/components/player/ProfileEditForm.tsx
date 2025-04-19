
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2 } from 'lucide-react';

interface ProfileEditFormProps {
  playerProfile: any;
  onCancel: () => void;
  onSuccess: (updatedProfile: any) => void;
}

const ProfileEditForm = ({ playerProfile, onCancel, onSuccess }: ProfileEditFormProps) => {
  const [formData, setFormData] = useState({
    full_name: playerProfile?.full_name || '',
    avatar_url: playerProfile?.avatar_url || '',
    description: playerProfile?.description || '',
    club: playerProfile?.club || '',
    position: playerProfile?.position || '',
    age: playerProfile?.age || '',
    country: playerProfile?.country || ''
  });
  const [isLoading, setIsLoading] = useState(false);
  const { updateProfile } = useAuth();
  const { toast } = useToast();

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: name === 'age' ? (value === '' ? '' : parseInt(value)) : value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const { error, data } = await updateProfile({
        full_name: formData.full_name,
        avatar_url: formData.avatar_url,
        description: formData.description,
        club: formData.club,
        position: formData.position,
        age: formData.age === '' ? null : Number(formData.age),
        country: formData.country
      });

      if (error) {
        throw error;
      }

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });

      onSuccess(data);
    } catch (error) {
      console.error('Error updating profile:', error);
      toast({
        title: "Update Failed",
        description: "There was a problem updating your profile.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6 max-w-3xl mx-auto">
      <h2 className="text-2xl font-bold">Edit Profile</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="full_name">Full Name</Label>
          <Input
            id="full_name"
            name="full_name"
            value={formData.full_name}
            onChange={handleChange}
            disabled={isLoading}
            required
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="avatar_url">Avatar URL</Label>
          <Input
            id="avatar_url"
            name="avatar_url"
            value={formData.avatar_url}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="https://example.com/avatar.jpg"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Input
            id="position"
            name="position"
            value={formData.position}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Striker, Goalkeeper, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="club">Current Club</Label>
          <Input
            id="club"
            name="club"
            value={formData.club}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="FC Barcelona, etc."
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="age">Age</Label>
          <Input
            id="age"
            name="age"
            type="number"
            value={formData.age}
            onChange={handleChange}
            disabled={isLoading}
            min="0"
            max="100"
          />
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="country">Country</Label>
          <Input
            id="country"
            name="country"
            value={formData.country}
            onChange={handleChange}
            disabled={isLoading}
            placeholder="Spain, Brazil, etc."
          />
        </div>
      </div>
      
      <div className="space-y-2">
        <Label htmlFor="description">Bio/Description</Label>
        <Textarea
          id="description"
          name="description"
          value={formData.description}
          onChange={handleChange}
          disabled={isLoading}
          rows={6}
          placeholder="Write a short bio about yourself..."
        />
      </div>
      
      <div className="flex justify-end space-x-4">
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
              Saving...
            </>
          ) : (
            'Save Changes'
          )}
        </Button>
      </div>
    </form>
  );
};

export default ProfileEditForm;
