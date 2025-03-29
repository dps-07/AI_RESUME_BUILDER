
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Sparkles, Plus, Trash2, FileText, Download, Share2, Star, Upload } from "lucide-react";
import { Slider } from "@/components/ui/slider";
import { useResumeContext } from "@/context/ResumeContext";
import { calculateResumeScore, getResumeFeedback } from "@/utils/resumeUtils";
import { generateResumePDF, shareResume } from "@/utils/pdfUtils";
import AIGenerateModal from "./AIGenerateModal";
import { toast } from "sonner";

const ResumeBuilder: React.FC = () => {
  const {
    resumeData,
    updatePersonalInfo,
    addExperience,
    updateExperience,
    removeExperience,
    addEducation,
    updateEducation,
    removeEducation,
    addSkill,
    updateSkill,
    removeSkill,
    addProject,
    updateProject,
    removeProject,
    setResumeScore,
  } = useResumeContext();

  const [activeTab, setActiveTab] = useState("personal-info");
  const [aiModalOpen, setAiModalOpen] = useState(false);
  const [aiSection, setAiSection] = useState<"summary" | "experience" | "project" | "skills">("summary");
  const [aiModalTitle, setAiModalTitle] = useState("");
  const [targetId, setTargetId] = useState<string | null>(null);
  
  // Handle AI modal opening
  const handleOpenAIModal = (
    section: "summary" | "experience" | "project" | "skills", 
    title: string,
    id: string | null = null
  ) => {
    setAiSection(section);
    setAiModalTitle(title);
    setTargetId(id);
    setAiModalOpen(true);
  };

  // Handle AI generated content saving
  const handleSaveAIContent = (content: string) => {
    switch (aiSection) {
      case "summary":
        updatePersonalInfo({ summary: content });
        break;
      case "experience":
        if (targetId) {
          updateExperience(targetId, { description: content });
        } else {
          addExperience({
            company: "Company Name",
            position: "Position Title",
            location: "Location",
            startDate: new Date().toISOString().split('T')[0],
            endDate: "",
            current: true,
            description: content,
          });
        }
        break;
      case "project":
        if (targetId) {
          updateProject(targetId, { description: content });
        } else {
          addProject({
            name: "Project Name",
            description: content,
            technologies: "Technologies used",
            url: "",
          });
        }
        break;
      case "skills":
        // For skills, we'll parse the generated content to create multiple skills
        content.split(',').forEach(skill => {
          const trimmedSkill = skill.trim();
          if (trimmedSkill) {
            addSkill({
              name: trimmedSkill,
              level: 3, // Default to medium proficiency
            });
          }
        });
        break;
    }
    
    // Recalculate resume score
    const newScore = calculateResumeScore(resumeData);
    setResumeScore(newScore);
  };
  
  // Handle profile picture upload
  const handleProfilePictureUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      toast.error("Profile picture must be less than 5MB");
      return;
    }
    
    const reader = new FileReader();
    reader.onload = (event) => {
      if (event.target?.result) {
        updatePersonalInfo({ profilePicture: event.target.result as string });
      }
    };
    reader.readAsDataURL(file);
  };

  // Rate resume button click handler
  const handleRateResume = () => {
    const score = calculateResumeScore(resumeData);
    setResumeScore(score);
    
    const { message, suggestions } = getResumeFeedback(score);
    
    // Show feedback with toast
    toast.success(`Resume Score: ${score}/100`, {
      description: message,
      duration: 5000,
    });
    
    // Show suggestions one by one with slight delay
    if (suggestions.length) {
      setTimeout(() => {
        toast("Improvement suggestions:", {
          description: (
            <ul className="list-disc pl-4 mt-2 space-y-1">
              {suggestions.map((suggestion, i) => (
                <li key={i} className="text-sm">{suggestion}</li>
              ))}
            </ul>
          ),
          duration: 8000,
        });
      }, 1000);
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Resume Builder</h1>
        <div className="flex gap-2">
          <Button
            variant="outline"
            onClick={handleRateResume}
            className="flex items-center gap-1"
          >
            <Star className="h-4 w-4" />
            Rate Resume
          </Button>
          <Button
            variant="outline"
            onClick={() => shareResume(resumeData)}
            className="flex items-center gap-1"
          >
            <Share2 className="h-4 w-4" />
            Share
          </Button>
          <Button
            onClick={() => generateResumePDF(resumeData)}
            className="flex items-center gap-1"
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>
        </div>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-5 mb-6">
          <TabsTrigger value="personal-info">Personal Info</TabsTrigger>
          <TabsTrigger value="experience">Experience</TabsTrigger>
          <TabsTrigger value="education">Education</TabsTrigger>
          <TabsTrigger value="skills">Skills</TabsTrigger>
          <TabsTrigger value="projects">Projects</TabsTrigger>
        </TabsList>

        {/* Personal Information Tab */}
        <TabsContent value="personal-info" className="space-y-4">
          <Card>
            <CardContent className="pt-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="name">Full Name</Label>
                    <Input
                      id="name"
                      value={resumeData.personalInfo.name}
                      onChange={(e) => updatePersonalInfo({ name: e.target.value })}
                      placeholder="John Doe"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="title">Professional Title</Label>
                    <Input
                      id="title"
                      value={resumeData.personalInfo.title}
                      onChange={(e) => updatePersonalInfo({ title: e.target.value })}
                      placeholder="Senior Software Engineer"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={resumeData.personalInfo.email}
                      onChange={(e) => updatePersonalInfo({ email: e.target.value })}
                      placeholder="johndoe@example.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="phone">Phone</Label>
                    <Input
                      id="phone"
                      value={resumeData.personalInfo.phone}
                      onChange={(e) => updatePersonalInfo({ phone: e.target.value })}
                      placeholder="(123) 456-7890"
                    />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="location">Location</Label>
                    <Input
                      id="location"
                      value={resumeData.personalInfo.location}
                      onChange={(e) => updatePersonalInfo({ location: e.target.value })}
                      placeholder="City, State, Country"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="website">Website/Portfolio</Label>
                    <Input
                      id="website"
                      value={resumeData.personalInfo.website}
                      onChange={(e) => updatePersonalInfo({ website: e.target.value })}
                      placeholder="https://yourwebsite.com"
                    />
                  </div>
                  
                  <div>
                    <Label htmlFor="profile-picture">Profile Picture</Label>
                    <div className="flex items-center gap-4 mt-2">
                      <div className="h-20 w-20 rounded-full bg-muted flex items-center justify-center overflow-hidden border">
                        {resumeData.personalInfo.profilePicture ? (
                          <img
                            src={resumeData.personalInfo.profilePicture}
                            alt="Profile"
                            className="h-full w-full object-cover"
                          />
                        ) : (
                          <FileText className="h-8 w-8 text-muted-foreground" />
                        )}
                      </div>
                      <div>
                        <label htmlFor="picture-upload">
                          <Button variant="outline" size="sm" className="cursor-pointer" asChild>
                            <span>
                              <Upload className="h-4 w-4 mr-2" />
                              Upload Picture
                            </span>
                          </Button>
                        </label>
                        <input
                          id="picture-upload"
                          type="file"
                          accept="image/*"
                          onChange={handleProfilePictureUpload}
                          className="hidden"
                        />
                        <p className="text-xs text-muted-foreground mt-1">
                          Max size: 5MB
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="mt-6">
                <div className="flex justify-between items-center mb-2">
                  <Label htmlFor="summary">Professional Summary</Label>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleOpenAIModal("summary", "Professional Summary")}
                    className="h-8 text-xs"
                  >
                    <Sparkles className="h-3 w-3 mr-1" />
                    Generate with AI
                  </Button>
                </div>
                <Textarea
                  id="summary"
                  value={resumeData.personalInfo.summary}
                  onChange={(e) => updatePersonalInfo({ summary: e.target.value })}
                  placeholder="Write a brief summary of your professional background, skills, and career goals..."
                  className="min-h-[150px]"
                />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Work Experience Tab */}
        <TabsContent value="experience" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Work Experience</h3>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleOpenAIModal("experience", "Experience Description")}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </Button>
              <Button 
                onClick={() => {
                  addExperience({
                    company: "",
                    position: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                  });
                }}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
            </div>
          </div>

          {resumeData.experience.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">No work experience added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your previous work experiences to enhance your resume
              </p>
              <Button 
                onClick={() => {
                  addExperience({
                    company: "",
                    position: "",
                    location: "",
                    startDate: "",
                    endDate: "",
                    current: false,
                    description: "",
                  });
                }}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Experience
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {resumeData.experience.map((exp) => (
                <Card key={exp.id}>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`company-${exp.id}`}>Company</Label>
                          <Input
                            id={`company-${exp.id}`}
                            value={exp.company}
                            onChange={(e) =>
                              updateExperience(exp.id, { company: e.target.value })
                            }
                            placeholder="Company Name"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`position-${exp.id}`}>Position</Label>
                          <Input
                            id={`position-${exp.id}`}
                            value={exp.position}
                            onChange={(e) =>
                              updateExperience(exp.id, { position: e.target.value })
                            }
                            placeholder="Job Title"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`location-${exp.id}`}>Location</Label>
                          <Input
                            id={`location-${exp.id}`}
                            value={exp.location}
                            onChange={(e) =>
                              updateExperience(exp.id, { location: e.target.value })
                            }
                            placeholder="City, State, Country"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`start-date-${exp.id}`}>Start Date</Label>
                            <Input
                              id={`start-date-${exp.id}`}
                              type="date"
                              value={exp.startDate}
                              onChange={(e) =>
                                updateExperience(exp.id, { startDate: e.target.value })
                              }
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`end-date-${exp.id}`}>End Date</Label>
                            <Input
                              id={`end-date-${exp.id}`}
                              type="date"
                              value={exp.endDate}
                              onChange={(e) =>
                                updateExperience(exp.id, { endDate: e.target.value })
                              }
                              disabled={exp.current}
                            />
                          </div>
                        </div>
                        
                        <div className="flex items-center space-x-2">
                          <input
                            type="checkbox"
                            id={`current-job-${exp.id}`}
                            checked={exp.current}
                            onChange={(e) => {
                              updateExperience(exp.id, { current: e.target.checked });
                              if (e.target.checked) {
                                updateExperience(exp.id, { endDate: "" });
                              }
                            }}
                            className="h-4 w-4 rounded border-gray-300"
                          />
                          <Label
                            htmlFor={`current-job-${exp.id}`}
                            className="text-sm font-normal"
                          >
                            I currently work here
                          </Label>
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4">
                      <div className="flex justify-between items-center mb-2">
                        <Label htmlFor={`description-${exp.id}`}>
                          Description & Responsibilities
                        </Label>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => 
                            handleOpenAIModal("experience", "Experience Description", exp.id)
                          }
                          className="h-8 text-xs"
                        >
                          <Sparkles className="h-3 w-3 mr-1" />
                          Generate with AI
                        </Button>
                      </div>
                      <Textarea
                        id={`description-${exp.id}`}
                        value={exp.description}
                        onChange={(e) =>
                          updateExperience(exp.id, { description: e.target.value })
                        }
                        placeholder="Describe your responsibilities and achievements..."
                        className="min-h-[120px]"
                      />
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeExperience(exp.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Education Tab */}
        <TabsContent value="education" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Education</h3>
            <Button 
              onClick={() => {
                addEducation({
                  school: "",
                  degree: "",
                  fieldOfStudy: "",
                  startDate: "",
                  endDate: "",
                  description: "",
                });
              }}
              className="flex items-center gap-1"
            >
              <Plus className="h-4 w-4" />
              Add Education
            </Button>
          </div>

          {resumeData.education.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">No education added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your educational background to enhance your resume
              </p>
              <Button 
                onClick={() => {
                  addEducation({
                    school: "",
                    degree: "",
                    fieldOfStudy: "",
                    startDate: "",
                    endDate: "",
                    description: "",
                  });
                }}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Education
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {resumeData.education.map((edu) => (
                <Card key={edu.id}>
                  <CardContent className="pt-6">
                    <div className="grid md:grid-cols-2 gap-4">
                      <div className="space-y-4">
                        <div>
                          <Label htmlFor={`school-${edu.id}`}>School/University</Label>
                          <Input
                            id={`school-${edu.id}`}
                            value={edu.school}
                            onChange={(e) =>
                              updateEducation(edu.id, { school: e.target.value })
                            }
                            placeholder="University Name"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`degree-${edu.id}`}>Degree</Label>
                          <Input
                            id={`degree-${edu.id}`}
                            value={edu.degree}
                            onChange={(e) =>
                              updateEducation(edu.id, { degree: e.target.value })
                            }
                            placeholder="e.g. Bachelor's, Master's, PhD"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`field-${edu.id}`}>Field of Study</Label>
                          <Input
                            id={`field-${edu.id}`}
                            value={edu.fieldOfStudy}
                            onChange={(e) =>
                              updateEducation(edu.id, { fieldOfStudy: e.target.value })
                            }
                            placeholder="e.g. Computer Science"
                          />
                        </div>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor={`edu-start-date-${edu.id}`}>Start Date</Label>
                            <Input
                              id={`edu-start-date-${edu.id}`}
                              type="date"
                              value={edu.startDate}
                              onChange={(e) =>
                                updateEducation(edu.id, { startDate: e.target.value })
                              }
                            />
                          </div>
                          
                          <div>
                            <Label htmlFor={`edu-end-date-${edu.id}`}>End Date</Label>
                            <Input
                              id={`edu-end-date-${edu.id}`}
                              type="date"
                              value={edu.endDate}
                              onChange={(e) =>
                                updateEducation(edu.id, { endDate: e.target.value })
                              }
                            />
                          </div>
                        </div>
                        
                        <div>
                          <Label htmlFor={`edu-description-${edu.id}`}>
                            Description (Optional)
                          </Label>
                          <Textarea
                            id={`edu-description-${edu.id}`}
                            value={edu.description}
                            onChange={(e) =>
                              updateEducation(edu.id, { description: e.target.value })
                            }
                            placeholder="Relevant coursework, achievements, or activities..."
                            className="min-h-[120px]"
                          />
                        </div>
                      </div>
                    </div>
                    
                    <div className="mt-4 flex justify-end">
                      <Button
                        variant="destructive"
                        size="sm"
                        onClick={() => removeEducation(edu.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-1" />
                        Remove
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        {/* Skills Tab */}
        <TabsContent value="skills" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Skills</h3>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleOpenAIModal("skills", "Skills List")}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </Button>
              <Button 
                onClick={() => {
                  addSkill({
                    name: "",
                    level: 3,
                  });
                }}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            </div>
          </div>

          {resumeData.skills.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">No skills added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your technical and professional skills
              </p>
              <Button 
                onClick={() => {
                  addSkill({
                    name: "",
                    level: 3,
                  });
                }}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Skill
              </Button>
            </Card>
          ) : (
            <Card>
              <CardContent className="pt-6">
                <div className="grid gap-6">
                  {resumeData.skills.map((skill) => (
                    <div key={skill.id} className="flex items-center gap-4">
                      <div className="flex-1">
                        <Input
                          value={skill.name}
                          onChange={(e) =>
                            updateSkill(skill.id, { name: e.target.value })
                          }
                          placeholder="Skill name (e.g. React, Project Management)"
                        />
                      </div>
                      <div className="w-48">
                        <Slider
                          value={[skill.level]}
                          onValueChange={(value) =>
                            updateSkill(skill.id, { level: value[0] })
                          }
                          min={1}
                          max={5}
                          step={1}
                          className="py-2"
                        />
                        <div className="flex justify-between text-xs text-muted-foreground mt-1">
                          <span>Beginner</span>
                          <span>Intermediate</span>
                          <span>Expert</span>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeSkill(skill.id)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* Projects Tab */}
        <TabsContent value="projects" className="space-y-6">
          <div className="flex justify-between items-center">
            <h3 className="text-lg font-medium">Projects</h3>
            <div className="flex gap-2">
              <Button 
                onClick={() => handleOpenAIModal("project", "Project Description")}
                variant="outline"
                className="flex items-center gap-1"
              >
                <Sparkles className="h-4 w-4" />
                Generate with AI
              </Button>
              <Button 
                onClick={() => {
                  addProject({
                    name: "",
                    description: "",
                    technologies: "",
                    url: "",
                  });
                }}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </div>
          </div>

          {resumeData.projects.length === 0 ? (
            <Card className="flex flex-col items-center justify-center p-6 text-center">
              <div className="rounded-full bg-primary/10 p-3 mb-3">
                <FileText className="h-6 w-6 text-primary" />
              </div>
              <h3 className="font-medium mb-1">No projects added yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Add your projects to showcase your skills and experience
              </p>
              <Button 
                onClick={() => {
                  addProject({
                    name: "",
                    description: "",
                    technologies: "",
                    url: "",
                  });
                }}
                className="flex items-center gap-1"
              >
                <Plus className="h-4 w-4" />
                Add Project
              </Button>
            </Card>
          ) : (
            <div className="space-y-4">
              {resumeData.projects.map((project) => (
                <Card key={project.id}>
                  <CardContent className="pt-6">
                    <div className="space-y-4">
                      <div className="grid md:grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor={`project-name-${project.id}`}>Project Name</Label>
                          <Input
                            id={`project-name-${project.id}`}
                            value={project.name}
                            onChange={(e) =>
                              updateProject(project.id, { name: e.target.value })
                            }
                            placeholder="Project Name"
                          />
                        </div>
                        
                        <div>
                          <Label htmlFor={`project-url-${project.id}`}>
                            Project URL (Optional)
                          </Label>
                          <Input
                            id={`project-url-${project.id}`}
                            value={project.url}
                            onChange={(e) =>
                              updateProject(project.id, { url: e.target.value })
                            }
                            placeholder="https://project-url.com"
                          />
                        </div>
                      </div>
                      
                      <div>
                        <Label htmlFor={`technologies-${project.id}`}>Technologies Used</Label>
                        <Input
                          id={`technologies-${project.id}`}
                          value={project.technologies}
                          onChange={(e) =>
                            updateProject(project.id, { technologies: e.target.value })
                          }
                          placeholder="React, Node.js, MongoDB, etc."
                        />
                      </div>
                      
                      <div>
                        <div className="flex justify-between items-center mb-2">
                          <Label htmlFor={`project-desc-${project.id}`}>Description</Label>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => 
                              handleOpenAIModal("project", "Project Description", project.id)
                            }
                            className="h-8 text-xs"
                          >
                            <Sparkles className="h-3 w-3 mr-1" />
                            Generate with AI
                          </Button>
                        </div>
                        <Textarea
                          id={`project-desc-${project.id}`}
                          value={project.description}
                          onChange={(e) =>
                            updateProject(project.id, { description: e.target.value })
                          }
                          placeholder="Describe the project, your role, and key accomplishments..."
                          className="min-h-[120px]"
                        />
                      </div>
                      
                      <div className="flex justify-end">
                        <Button
                          variant="destructive"
                          size="sm"
                          onClick={() => removeProject(project.id)}
                        >
                          <Trash2 className="h-4 w-4 mr-1" />
                          Remove
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      
      <AIGenerateModal
        open={aiModalOpen}
        onClose={() => setAiModalOpen(false)}
        onSave={handleSaveAIContent}
        section={aiSection}
        title={aiModalTitle}
      />
    </div>
  );
};

export default ResumeBuilder;
