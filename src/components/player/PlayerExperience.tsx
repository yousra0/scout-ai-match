
interface Experience {
  club: string;
  role: string;
  period: string;
  achievements: string;
}

interface Education {
  institution: string;
  qualification: string;
  period: string;
}

interface PlayerExperienceProps {
  experience: Experience[];
  education: Education[];
}

const PlayerExperience = ({ experience, education }: PlayerExperienceProps) => {
  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4">Club Experience</h3>
        <div className="space-y-6">
          {experience.map((exp, index) => (
            <div key={index} className="border-l-2 border-primary pl-4 pb-6">
              <h4 className="font-medium">{exp.club}</h4>
              <div className="text-sm text-gray-600">{exp.role} • {exp.period}</div>
              <p className="mt-1 text-sm">{exp.achievements}</p>
            </div>
          ))}
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
