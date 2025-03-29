
import React from "react";
import Navbar from "@/components/Navbar";
import ResumeBuilder from "@/components/ResumeBuilder";
import ResumePreview from "@/components/ResumePreview";
import { ResumeProvider } from "@/context/ResumeContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { FileText, Edit, Star, ArrowDownToLine } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

const Index = () => {
  const isMobile = useIsMobile();
  
  return (
    <ResumeProvider>
      <div className="min-h-screen flex flex-col bg-background">
        <Navbar />
        
        <main className="flex-1 container py-6">
          {isMobile ? (
            <Tabs defaultValue="editor" className="w-full">
              <TabsList className="grid grid-cols-2 mb-4">
                <TabsTrigger value="editor" className="flex items-center gap-1">
                  <Edit className="h-4 w-4" />
                  Editor
                </TabsTrigger>
                <TabsTrigger value="preview" className="flex items-center gap-1">
                  <FileText className="h-4 w-4" />
                  Preview
                </TabsTrigger>
              </TabsList>
              <TabsContent value="editor">
                <ResumeBuilder />
              </TabsContent>
              <TabsContent value="preview" className="mt-0">
                <div className="bg-gray-100 dark:bg-gray-900 p-4 rounded-lg overflow-x-auto">
                  <ResumePreview />
                </div>
              </TabsContent>
            </Tabs>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div className="space-y-6">
                <ResumeBuilder />
              </div>
              <div className="hidden lg:block sticky top-20 h-[calc(100vh-6rem)] overflow-y-auto bg-gray-100 dark:bg-gray-900 p-4 rounded-lg">
                <ResumePreview />
              </div>
            </div>
          )}
        </main>
        
        <footer className="border-t py-4 bg-background">
          <div className="container flex flex-col md:flex-row justify-between items-center text-sm text-muted-foreground">
            <p>© {new Date().getFullYear()} AI Resume Builder</p>
            <div className="flex items-center mt-2 md:mt-0">
              <p>Build professional resumes with the power of AI</p>
            </div>
          </div>
        </footer>
      </div>
    </ResumeProvider>
  );
};

export default Index;
