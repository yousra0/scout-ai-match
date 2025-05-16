
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectTrigger, SelectValue, SelectContent, SelectItem } from '@/components/ui/select';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Upload } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import { useEffect } from 'react';
import countryList from '@/data/countries.json';

interface ProfileEditFormProps {
  playerProfile: any;
  onCancel: () => void;
  onSuccess: (updatedProfile: any) => void;
}

const positions = [
  'Goalkeeper',
  'Right Back',
  'Center Back',
  'Left Back',
  'Defensive Midfielder',
  'Central Midfielder',
  'Attacking Midfielder',
  'Right Winger',
  'Left Winger',
  'Striker',
  'Forward'
];

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
  const [uploading, setUploading] = useState(false);
  const [countrySearch, setCountrySearch] = useState('');
  const [filteredCountries, setFilteredCountries] = useState<string[]>([]);
  const { updateProfile } = useAuth();
  const { toast } = useToast();

  useEffect(() => {
    if (countrySearch) {
      const filtered = countryList
        .filter(country => 
          country.toLowerCase().includes(countrySearch.toLowerCase()))
        .slice(0, 10);
      setFilteredCountries(filtered);
    } else {
      setFilteredCountries([]);
    }
  }, [countrySearch]);

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      
      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('You must select an image to upload.');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${Date.now()}.${fileExt}`;

      const { error: uploadError, data } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data: { publicUrl } } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);

      setFormData(prev => ({
        ...prev,
        avatar_url: publicUrl
      }));

      toast({
        title: "Success",
        description: "Avatar uploaded successfully",
      });
    } catch (error: any) {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive"
      });
    } finally {
      setUploading(false);
    }
  };

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

      if (error) throw error;

      toast({
        title: "Profile Updated",
        description: "Your profile has been updated successfully."
      });

      onSuccess(data);
    } catch (error: any) {
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
          <Label>Profile Picture</Label>
          <div className="flex items-center gap-4">
            {formData.avatar_url && (
              <img 
                src={formData.avatar_url} 
                alt="Avatar preview" 
                className="h-12 w-12 rounded-full object-cover"
              />
            )}
            <Button
              type="button"
              variant="outline"
              disabled={uploading}
              onClick={() => document.getElementById('avatar-upload')?.click()}
            >
              {uploading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="mr-2 h-4 w-4" />
                  Upload Photo
                </>
              )}
            </Button>
            <input
              type="file"
              id="avatar-upload"
              accept="image/*"
              onChange={handleAvatarUpload}
              className="hidden"
            />
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="position">Position</Label>
          <Select 
            value={formData.position} 
            onValueChange={(value) => setFormData(prev => ({ ...prev, position: value }))}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select position" />
            </SelectTrigger>
            <SelectContent>
              {positions.map((pos) => (
                <SelectItem key={pos} value={pos}>{pos}</SelectItem>
              ))}
            </SelectContent>
          </Select>
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
          <div className="relative">
            <Input
              id="country"
              name="country"
              value={countrySearch}
              onChange={(e) => {
                setCountrySearch(e.target.value);
                setFormData(prev => ({ ...prev, country: e.target.value }));
              }}
              disabled={isLoading}
              placeholder="Start typing..."
            />
            {filteredCountries.length > 0 && (
              <div className="absolute z-10 w-full mt-1 bg-white border rounded-md shadow-lg max-h-60 overflow-auto">
                {filteredCountries.map((country) => (
                  <div
                    key={country}
                    className="px-4 py-2 hover:bg-gray-100 cursor-pointer"
                    onClick={() => {
                      setFormData(prev => ({ ...prev, country }));
                      setCountrySearch(country);
                      setFilteredCountries([]);
                    }}
                  >
                    {country}
                  </div>
                ))}
              </div>
            )}
          </div>
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
