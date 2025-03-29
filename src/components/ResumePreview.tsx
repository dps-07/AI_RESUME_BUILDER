
import React from "react";
import { useResumeContext } from "@/context/ResumeContext";
import { Phone, Mail, Globe, MapPin, Star, Calendar } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";

const ResumePreview: React.FC = () => {
  const { resumeData } = useResumeContext();
  const { personalInfo, experience, education, skills, projects } = resumeData;

  // Format date strings
  const formatDate = (dateStr: string): string => {
    if (!dateStr) return "Present";
    const date = new Date(dateStr);
    return date.toLocaleDateString("en-US", { month: "short", year: "numeric" });
  };

  return (
    <div id="resume-preview" className="resume-page bg-white text-black print:shadow-none">
      <div className="space-y-6">
        {/* Header */}
        <header className="flex flex-col items-center text-center mb-6">
          <h1 className="text-3xl font-bold text-resume-primary">{personalInfo.name || "Your Name"}</h1>
          <h2 className="text-xl text-gray-700 mt-1">{personalInfo.title || "Professional Title"}</h2>
          
          <div className="flex flex-wrap justify-center gap-3 mt-3">
            {personalInfo.phone && (
              <div className="flex items-center text-gray-600 text-sm">
                <Phone className="h-3 w-3 mr-1" />
                {personalInfo.phone}
              </div>
            )}
            
            {personalInfo.email && (
              <div className="flex items-center text-gray-600 text-sm">
                <Mail className="h-3 w-3 mr-1" />
                {personalInfo.email}
              </div>
            )}
            
            {personalInfo.website && (
              <div className="flex items-center text-gray-600 text-sm">
                <Globe className="h-3 w-3 mr-1" />
                {personalInfo.website}
              </div>
            )}
            
            {personalInfo.location && (
              <div className="flex items-center text-gray-600 text-sm">
                <MapPin className="h-3 w-3 mr-1" />
                {personalInfo.location}
              </div>
            )}
          </div>
        </header>

        {/* Profile Picture - Optional */}
        {personalInfo.profilePicture && (
          <div className="flex justify-center mb-6">
            <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-resume-primary">
              <img
                src={personalInfo.profilePicture}
                alt={personalInfo.name}
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        )}
        
        {/* Summary */}
        {personalInfo.summary && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">
              Professional Summary
            </h3>
            <p className="text-sm text-gray-700 whitespace-pre-line">{personalInfo.summary}</p>
          </div>
        )}
        
        {/* Work Experience */}
        {experience.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">
              Work Experience
            </h3>
            <div className="space-y-4">
              {experience.map((exp) => (
                <div key={exp.id}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                    <div>
                      <h4 className="font-medium">{exp.position || "Position"}</h4>
                      <h5 className="text-sm text-resume-primary">{exp.company || "Company"}</h5>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1 md:mt-0">
                      <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                      {formatDate(exp.startDate)} - {exp.current ? "Present" : formatDate(exp.endDate)}
                      {exp.location && ` | ${exp.location}`}
                    </div>
                  </div>
                  {exp.description && (
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{exp.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Education */}
        {education.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">
              Education
            </h3>
            <div className="space-y-4">
              {education.map((edu) => (
                <div key={edu.id}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                    <div>
                      <h4 className="font-medium">{edu.degree || "Degree"} {edu.fieldOfStudy && `in ${edu.fieldOfStudy}`}</h4>
                      <h5 className="text-sm text-resume-primary">{edu.school || "School/University"}</h5>
                    </div>
                    <div className="text-sm text-gray-600 flex items-center mt-1 md:mt-0">
                      <Calendar className="h-3 w-3 mr-1 flex-shrink-0" />
                      {formatDate(edu.startDate)} - {formatDate(edu.endDate)}
                    </div>
                  </div>
                  {edu.description && (
                    <p className="text-sm text-gray-700 mt-2">{edu.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Skills */}
        {skills.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">
              Skills
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {skills.map((skill) => (
                <div key={skill.id} className="flex items-center gap-3">
                  <div className="flex-1 font-medium text-sm">{skill.name || "Skill"}</div>
                  <div className="flex items-center">
                    {Array.from({ length: 5 }).map((_, i) => (
                      <Star
                        key={i}
                        className={`h-3 w-3 ${
                          i < skill.level
                            ? "text-resume-primary fill-resume-primary"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Projects */}
        {projects.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold border-b border-gray-200 pb-1 mb-2">
              Projects
            </h3>
            <div className="space-y-4">
              {projects.map((project) => (
                <div key={project.id}>
                  <div className="flex flex-col md:flex-row md:justify-between md:items-baseline">
                    <div>
                      <h4 className="font-medium">
                        {project.name || "Project Name"}
                        {project.url && (
                          <a
                            href={project.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="ml-1 text-sm text-blue-500 hover:underline"
                          >
                            (Link)
                          </a>
                        )}
                      </h4>
                      {project.technologies && (
                        <div className="flex flex-wrap gap-1 mt-1">
                          {project.technologies.split(",").map((tech, i) => (
                            <Badge key={i} variant="outline" className="text-xs">
                              {tech.trim()}
                            </Badge>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                  {project.description && (
                    <p className="text-sm text-gray-700 mt-2 whitespace-pre-line">{project.description}</p>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Resume Score */}
        {resumeData.resumeScore > 0 && (
          <div className="print:hidden mt-6 pt-4 border-t border-gray-200">
            <div className="flex justify-between items-center mb-2">
              <h5 className="text-sm font-medium">Resume Strength</h5>
              <span className="text-sm font-medium">{resumeData.resumeScore}%</span>
            </div>
            <Progress value={resumeData.resumeScore} className="h-2" />
          </div>
        )}
      </div>
    </div>
  );
};

export default ResumePreview;
