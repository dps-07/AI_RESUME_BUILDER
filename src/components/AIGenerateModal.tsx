
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { generateAIContent } from "@/utils/resumeUtils";
import { Sparkles, Loader2 } from "lucide-react";
import { toast } from "sonner";

interface AIGenerateModalProps {
  open: boolean;
  onClose: () => void;
  onSave: (content: string) => void;
  section: "summary" | "experience" | "project" | "skills";
  title: string;
}

const AIGenerateModal: React.FC<AIGenerateModalProps> = ({
  open,
  onClose,
  onSave,
  section,
  title,
}) => {
  const [prompt, setPrompt] = useState("");
  const [generatedContent, setGeneratedContent] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    if (!prompt.trim()) {
      toast.error("Please enter a prompt to generate content");
      return;
    }
    
    setIsGenerating(true);
    try {
      const content = await generateAIContent(prompt, section);
      setGeneratedContent(content);
      toast.success("Content generated successfully!");
    } catch (error) {
      console.error("Error generating content:", error);
      toast.error("Failed to generate content. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = () => {
    if (!generatedContent.trim()) {
      toast.error("No content to save. Please generate content first.");
      return;
    }
    
    onSave(generatedContent);
    onClose();
    toast.success(`${title} updated successfully!`);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[32rem]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            Generate {title}
          </DialogTitle>
          <DialogDescription>
            Our AI will generate content based on your prompt. Be specific for better results.
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div>
            <Label htmlFor="prompt" className="mb-2 block">
              Your Prompt
            </Label>
            <Textarea
              id="prompt"
              placeholder={`Example: Generate a professional ${section} for a frontend developer with 5 years of experience in React and TypeScript`}
              rows={3}
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
              className="resize-none"
            />
          </div>

          {generatedContent && (
            <div>
              <Label htmlFor="generated-content" className="mb-2 block">
                Generated Content
              </Label>
              <Textarea
                id="generated-content"
                value={generatedContent}
                onChange={(e) => setGeneratedContent(e.target.value)}
                rows={8}
                className="min-h-[150px]"
              />
              <p className="mt-2 text-xs text-muted-foreground">
                You can edit the generated content before saving.
              </p>
            </div>
          )}
        </div>

        <DialogFooter className="flex justify-between sm:justify-between">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <div className="flex gap-2">
            <Button
              variant="secondary"
              onClick={handleGenerate}
              disabled={isGenerating || !prompt.trim()}
            >
              {isGenerating ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Generating...
                </>
              ) : (
                <>
                  <Sparkles className="mr-2 h-4 w-4" />
                  Generate
                </>
              )}
            </Button>
            <Button
              onClick={handleSave}
              disabled={!generatedContent.trim() || isGenerating}
            >
              Save
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default AIGenerateModal;
