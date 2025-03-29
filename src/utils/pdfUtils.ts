
import { ResumeData } from '../context/ResumeContext';
import { toast } from "sonner";

export const generateResumePDF = async (resumeData: ResumeData): Promise<void> => {
  // In a real application, this would use a library like jsPDF or html2pdf
  // For this demo, we'll create a simple PDF generation simulation
  
  console.log("Generating PDF for resume:", resumeData);
  
  try {
    // Simulate PDF generation delay
    await new Promise(resolve => setTimeout(resolve, 2000));

    // Since we can't actually generate a PDF in this demo, log success
    // and notify the user that this is a simulation
    console.log("PDF would be generated here with a real PDF library");
    
    toast.success("PDF generated successfully! In a production app, the download would start automatically.");
    
    // In reality, we would use code like this:
    /*
    import html2pdf from 'html2pdf.js';
    
    const resumeElement = document.getElementById('resume-preview');
    const opt = {
      margin: 10,
      filename: `resume_${resumeData.personalInfo.name.replace(/\s+/g, '_')}.pdf`,
      image: { type: 'jpeg', quality: 0.98 },
      html2canvas: { scale: 2, useCORS: true },
      jsPDF: { unit: 'mm', format: 'a4', orientation: 'portrait' }
    };
    
    html2pdf().set(opt).from(resumeElement).save();
    */
    
  } catch (error) {
    console.error("Error generating PDF:", error);
    toast.error("Failed to generate PDF. Please try again.");
  }
};

export const shareResume = (resumeData: ResumeData): void => {
  // In a real application, this would use the Web Share API if available,
  // or fallback to copying a link to clipboard
  
  // Check if Web Share API is available
  if (navigator.share) {
    navigator.share({
      title: `Resume - ${resumeData.personalInfo.name}`,
      text: `Check out my professional resume: ${resumeData.personalInfo.name} - ${resumeData.personalInfo.title}`,
      // In a real app, this would be a URL to the hosted resume
      url: window.location.href,
    })
      .then(() => toast.success("Resume shared successfully!"))
      .catch((error) => {
        console.error("Error sharing resume:", error);
        toast.error("Failed to share resume");
      });
  } else {
    // Fallback for browsers without Web Share API
    // Copy current URL to clipboard
    navigator.clipboard.writeText(window.location.href)
      .then(() => toast.success("Resume URL copied to clipboard!"))
      .catch(() => toast.error("Failed to copy resume URL"));
  }
};
