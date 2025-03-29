
import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Moon, Sun, Github, Linkedin } from "lucide-react";
import { useResumeContext } from "@/context/ResumeContext";
import { exportResumeAsJSON, importResumeFromJSON } from "@/utils/resumeUtils";

const Navbar: React.FC = () => {
  const { resumeData, importResumeData, resetResumeData } = useResumeContext();
  const [isDarkMode, setIsDarkMode] = useState(false);

  // Dark mode detection
  useEffect(() => {
    const isDark = localStorage.getItem("theme") === "dark" || 
      (!localStorage.getItem("theme") && 
       window.matchMedia("(prefers-color-scheme: dark)").matches);
    
    setIsDarkMode(isDark);
    document.documentElement.classList.toggle("dark", isDark);
  }, []);

  // Toggle dark mode
  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    document.documentElement.classList.toggle("dark", newMode);
    localStorage.setItem("theme", newMode ? "dark" : "light");
  };

  // Handle file import
  const handleImport = (event: React.ChangeEvent<HTMLInputElement>) => {
    const files = event.target.files;
    if (files && files[0]) {
      importResumeFromJSON(files[0])
        .then(data => {
          importResumeData(data);
        })
        .catch(error => {
          console.error("Import error:", error);
        });
    }
    // Reset input value to allow selecting the same file again
    event.target.value = "";
  };

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 items-center justify-between">
        <div className="flex items-center space-x-2">
          <div className="font-bold text-xl text-primary">AiResume</div>
          <span className="bg-primary px-1.5 py-0.5 text-xs text-white rounded-md">Beta</span>
        </div>

        <div className="flex items-center space-x-4">
          <a 
            href="#" 
            onClick={(e) => {
              e.preventDefault();
              resetResumeData();
            }}
            className="text-sm font-medium hover:underline"
          >
            New Resume
          </a>
          
          <div className="hidden md:flex items-center space-x-4">
            <Button
              variant="outline"
              size="sm"
              onClick={() => exportResumeAsJSON(resumeData)}
            >
              Export
            </Button>
            
            <div>
              <label htmlFor="import-resume" className="cursor-pointer">
                <Button variant="outline" size="sm" asChild>
                  <span>Import</span>
                </Button>
              </label>
              <input
                id="import-resume"
                type="file"
                accept=".json"
                onChange={handleImport}
                className="hidden"
              />
            </div>
            
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={toggleDarkMode} 
              title="Toggle dark mode"
            >
              {isDarkMode ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
            </Button>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon" title="GitHub Login" className="text-gray-700 dark:text-gray-300">
              <Github className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="icon" title="LinkedIn Login" className="text-gray-700 dark:text-gray-300">
              <Linkedin className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
