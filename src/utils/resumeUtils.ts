
import { ResumeData } from '../context/ResumeContext';
import { toast } from "sonner";

// Generate AI text based on user input
export const generateAIContent = async (
  prompt: string,
  section: string
): Promise<string> => {
  // In a real application, this would make an API call to an AI service
  // For this demo, we'll return predefined responses
  console.log(`Generating AI content for ${section} with prompt: ${prompt}`);
  
  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 1500));
  
  const demoResponses: Record<string, Record<string, string>> = {
    summary: {
      default: "Highly motivated software engineer with 5+ years of experience in developing scalable web applications. Proficient in JavaScript, React, Node.js, and cloud technologies. Passionate about creating elegant solutions to complex problems and delivering exceptional user experiences.",
      "frontend developer": "Creative Frontend Developer with 4+ years of experience crafting responsive and intuitive user interfaces. Specialized in React, Vue, and modern CSS frameworks. Committed to delivering pixel-perfect designs and optimizing website performance for seamless user experiences.",
      "data scientist": "Data Scientist with expertise in machine learning, statistical analysis, and data visualization. Experienced in Python, R, and SQL with a track record of extracting actionable insights from complex datasets. Passionate about solving challenging problems through data-driven approaches."
    },
    experience: {
      default: "• Led the development of a customer-facing web application that increased user engagement by 45%\n• Collaborated with cross-functional teams to design and implement new features\n• Optimized database queries resulting in a 30% improvement in application performance\n• Mentored junior developers and conducted code reviews to ensure quality standards",
      "frontend developer": "• Developed responsive web interfaces using React that improved user engagement metrics by 35%\n• Implemented state management using Redux and Context API\n• Collaborated with UI/UX designers to create intuitive user experiences\n• Reduced page load time by 40% through code splitting and lazy loading techniques",
      "data scientist": "• Built predictive models that increased sales forecast accuracy by 25%\n• Developed ETL pipelines for processing large-scale data using Apache Spark\n• Created interactive dashboards using Tableau to visualize key business metrics\n• Implemented A/B testing framework that optimized marketing campaigns"
    }
  };

  // Get appropriate response based on section and prompt
  let response = "";
  const promptLower = prompt.toLowerCase();
  
  if (demoResponses[section]) {
    // Check if any keywords match in the prompt
    const matchedKey = Object.keys(demoResponses[section]).find(key => 
      key !== 'default' && promptLower.includes(key.toLowerCase())
    );
    
    response = matchedKey 
      ? demoResponses[section][matchedKey]
      : demoResponses[section].default;
  } else {
    response = "I'm sorry, I couldn't generate content for this section. Please try a different prompt.";
  }
  
  return response;
};

// Calculate resume score based on completeness and quality
export const calculateResumeScore = (resumeData: ResumeData): number => {
  let score = 0;
  const maxScore = 100;
  
  // Personal info completeness (max 20 points)
  const personalInfoFields = Object.values(resumeData.personalInfo).filter(
    value => typeof value === 'string' && value.trim().length > 0
  );
  score += Math.min(20, (personalInfoFields.length / 7) * 20);
  
  // Experience quality and quantity (max 25 points)
  if (resumeData.experience.length > 0) {
    const expScore = resumeData.experience.reduce((acc, exp) => {
      let itemScore = 0;
      // Award points for completeness of each experience
      if (exp.company) itemScore += 1;
      if (exp.position) itemScore += 1;
      if (exp.description && exp.description.length > 50) itemScore += 3;
      else if (exp.description) itemScore += 1;
      if (exp.startDate && exp.endDate) itemScore += 1;
      return acc + itemScore;
    }, 0);
    score += Math.min(25, expScore);
  }
  
  // Education (max 15 points)
  if (resumeData.education.length > 0) {
    const eduScore = Math.min(15, resumeData.education.length * 5);
    score += eduScore;
  }
  
  // Skills (max 15 points)
  score += Math.min(15, resumeData.skills.length * 1.5);
  
  // Projects (max 15 points)
  if (resumeData.projects.length > 0) {
    const projScore = Math.min(15, resumeData.projects.length * 5);
    score += projScore;
  }
  
  // Summary quality (max 10 points)
  const summary = resumeData.personalInfo.summary;
  if (summary) {
    if (summary.length > 300) score += 10;
    else if (summary.length > 200) score += 7;
    else if (summary.length > 100) score += 5;
    else score += 3;
  }
  
  return Math.min(maxScore, Math.round(score));
};

// Resume feedback based on the calculated score
export const getResumeFeedback = (score: number): { message: string; suggestions: string[] } => {
  if (score >= 90) {
    return {
      message: "Excellent resume! Your resume is very well-crafted and comprehensive.",
      suggestions: [
        "Consider tailoring specific versions for different job applications",
        "Ask for peer review from industry professionals"
      ]
    };
  } else if (score >= 70) {
    return {
      message: "Good resume! Your resume is strong but has some room for improvement.",
      suggestions: [
        "Add more quantifiable achievements to your experience",
        "Expand your skills section with relevant technologies",
        "Make your summary more impactful"
      ]
    };
  } else if (score >= 50) {
    return {
      message: "Average resume. Your resume needs improvement in several areas.",
      suggestions: [
        "Add more detailed descriptions to your work experience",
        "Include relevant projects that showcase your skills",
        "Expand your education section with relevant coursework",
        "Write a more comprehensive professional summary"
      ]
    };
  } else {
    return {
      message: "Your resume needs significant improvement.",
      suggestions: [
        "Complete all personal information sections",
        "Add detailed work experience with responsibilities and achievements",
        "Include your education history",
        "Add relevant skills with proficiency levels",
        "Write a professional summary that highlights your strengths"
      ]
    };
  }
};

// Export resume as JSON for saving/sharing
export const exportResumeAsJSON = (resumeData: ResumeData): void => {
  const dataStr = JSON.stringify(resumeData, null, 2);
  const dataUri = `data:application/json;charset=utf-8,${encodeURIComponent(dataStr)}`;
  
  const exportFileName = `resume_${new Date().toISOString().slice(0, 10)}.json`;
  
  const linkElement = document.createElement('a');
  linkElement.setAttribute('href', dataUri);
  linkElement.setAttribute('download', exportFileName);
  linkElement.click();
  
  toast.success("Resume exported successfully!");
};

// Import resume from JSON
export const importResumeFromJSON = (file: File): Promise<ResumeData> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    
    reader.onload = (event) => {
      try {
        if (event.target?.result) {
          const resumeData = JSON.parse(event.target.result as string);
          resolve(resumeData);
          toast.success("Resume imported successfully!");
        } else {
          throw new Error("Failed to read file");
        }
      } catch (error) {
        reject(error);
        toast.error("Failed to import resume. Invalid file format.");
      }
    };
    
    reader.onerror = () => {
      reject(new Error("Failed to read file"));
      toast.error("Failed to read file");
    };
    
    reader.readAsText(file);
  });
};
