
import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Image } from "lucide-react";
import { toast } from "sonner";

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  subject: "physics" | "chemistry" | "mathematics";
  imageUrl?: string;
}

interface TestQuestionFormProps {
  isOpen: boolean;
  onClose: () => void;
  onPreview: (questions: Question[]) => void;
  testTitle: string;
}

const TestQuestionForm: React.FC<TestQuestionFormProps> = ({ isOpen, onClose, onPreview, testTitle }) => {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [currentQuestion, setCurrentQuestion] = useState<Question>({
    id: "1",
    text: "",
    options: [
      { id: "A", text: "", isCorrect: false },
      { id: "B", text: "", isCorrect: false },
      { id: "C", text: "", isCorrect: false },
      { id: "D", text: "", isCorrect: false },
    ],
    subject: "physics",
    imageUrl: ""
  });

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      text: e.target.value
    });
  };

  const handleImageUrlChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      imageUrl: e.target.value
    });
  };

  const handleOptionChange = (optionId: string, value: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map(option => 
        option.id === optionId ? { ...option, text: value } : option
      )
    });
  };

  const handleCorrectOptionChange = (optionId: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map(option => 
        ({ ...option, isCorrect: option.id === optionId })
      )
    });
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      subject: e.target.value as "physics" | "chemistry" | "mathematics"
    });
  };

  const addQuestion = () => {
    // Validation checks
    if (!currentQuestion.text.trim()) {
      toast.error("Please enter a question");
      return;
    }

    if (!currentQuestion.options.some(option => option.isCorrect)) {
      toast.error("Please select a correct answer");
      return;
    }

    if (currentQuestion.options.some(option => !option.text.trim())) {
      toast.error("Please fill in all options");
      return;
    }

    // Add question to the list
    const newQuestionId = (questions.length + 1).toString();
    setQuestions([...questions, { ...currentQuestion, id: newQuestionId }]);
    
    // Reset current question form
    setCurrentQuestion({
      id: (questions.length + 2).toString(),
      text: "",
      options: [
        { id: "A", text: "", isCorrect: false },
        { id: "B", text: "", isCorrect: false },
        { id: "C", text: "", isCorrect: false },
        { id: "D", text: "", isCorrect: false },
      ],
      subject: currentQuestion.subject,
      imageUrl: ""
    });

    toast.success("Question added");
  };

  const removeQuestion = (id: string) => {
    setQuestions(questions.filter(q => q.id !== id));
    toast.success("Question removed");
  };

  const handlePreview = () => {
    if (questions.length === 0 && !currentQuestion.text.trim()) {
      toast.error("Please add at least one question");
      return;
    }

    // If there's an in-progress question with content, ask to add it
    if (currentQuestion.text.trim()) {
      if (window.confirm("You have an unsaved question. Would you like to add it before previewing?")) {
        addQuestion();
      }
    }

    onPreview(questions);
  };

  // Sample images for demonstration
  const sampleImages = [
    "/placeholder.svg",
    "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?w=500",
    "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?w=500",
    "https://images.unsplash.com/photo-1518770660439-4636190af475?w=500"
  ];

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold text-primary">
            Add Questions to {testTitle}
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Subject selector */}
          <div className="mb-4">
            <Label htmlFor="subject">Subject</Label>
            <select 
              id="subject"
              className="w-full p-2 border rounded-md"
              value={currentQuestion.subject}
              onChange={handleSubjectChange}
            >
              <option value="physics">Physics</option>
              <option value="chemistry">Chemistry</option>
              <option value="mathematics">Mathematics</option>
            </select>
          </div>

          {/* Question input */}
          <div className="space-y-2">
            <Label htmlFor="question">Question</Label>
            <Textarea 
              id="question"
              placeholder="Enter your question here..."
              value={currentQuestion.text}
              onChange={handleQuestionChange}
              className="min-h-[100px]"
            />
          </div>

          {/* Image URL input */}
          <div className="space-y-2">
            <Label htmlFor="imageUrl">Image URL (Optional)</Label>
            <div className="flex gap-2">
              <Input 
                id="imageUrl"
                placeholder="Enter image URL or choose from samples below"
                value={currentQuestion.imageUrl || ""}
                onChange={handleImageUrlChange}
                className="flex-grow"
              />
            </div>
            
            {/* Sample images */}
            <div className="mt-2">
              <Label className="text-sm text-gray-500 mb-2 block">Sample Images:</Label>
              <div className="grid grid-cols-4 gap-2">
                {sampleImages.map((url, index) => (
                  <button 
                    key={index}
                    type="button"
                    className={`p-1 border rounded-md hover:border-primary transition-all ${currentQuestion.imageUrl === url ? 'border-primary-500 ring-2 ring-primary-200' : 'border-gray-200'}`}
                    onClick={() => setCurrentQuestion({...currentQuestion, imageUrl: url})}
                  >
                    <img 
                      src={url} 
                      alt={`Sample ${index + 1}`} 
                      className="h-16 w-full object-cover rounded"
                    />
                  </button>
                ))}
              </div>
            </div>
            
            {/* Preview of selected image */}
            {currentQuestion.imageUrl && (
              <div className="mt-3 border rounded-md p-2">
                <p className="text-sm text-gray-500 mb-2">Image Preview:</p>
                <div className="relative">
                  <img 
                    src={currentQuestion.imageUrl} 
                    alt="Question illustration" 
                    className="max-h-48 mx-auto object-contain"
                    onError={() => {
                      toast.error("Failed to load image");
                      setCurrentQuestion({...currentQuestion, imageUrl: ""});
                    }}
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-2 bg-white/80"
                    onClick={() => setCurrentQuestion({...currentQuestion, imageUrl: ""})}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </div>
            )}
          </div>

          {/* Options */}
          <div className="space-y-4">
            <Label>Options (Select the correct answer)</Label>
            {currentQuestion.options.map((option) => (
              <div key={option.id} className="flex items-center space-x-2">
                <div className="w-8 h-8 rounded-full border flex items-center justify-center bg-gray-100">
                  {option.id}
                </div>
                <Input 
                  placeholder={`Option ${option.id}`}
                  value={option.text}
                  onChange={(e) => handleOptionChange(option.id, e.target.value)}
                  className="flex-grow"
                />
                <Button
                  type="button"
                  variant={option.isCorrect ? "default" : "outline"}
                  onClick={() => handleCorrectOptionChange(option.id)}
                  className={option.isCorrect ? "bg-green-500 hover:bg-green-600" : ""}
                >
                  Correct
                </Button>
              </div>
            ))}
          </div>

          <Button 
            onClick={addQuestion} 
            className="w-full bg-gold hover:bg-gold/90 text-white"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Question
          </Button>

          {/* Question List */}
          {questions.length > 0 && (
            <div className="mt-8">
              <h3 className="text-lg font-medium">Added Questions ({questions.length})</h3>
              <div className="space-y-2 mt-2">
                {questions.map((q, index) => (
                  <div key={q.id} className="p-3 border rounded-md flex justify-between items-start">
                    <div className="flex items-start gap-3 flex-1">
                      {q.imageUrl && (
                        <img 
                          src={q.imageUrl} 
                          alt="" 
                          className="h-12 w-12 object-cover rounded"
                        />
                      )}
                      <div>
                        <p className="font-medium">
                          <span className="text-gold">{index + 1}.</span> {q.text.substring(0, 60)}
                          {q.text.length > 60 ? "..." : ""}
                        </p>
                        <p className="text-sm text-gray-500">Subject: {q.subject}</p>
                      </div>
                    </div>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      onClick={() => removeQuestion(q.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        <DialogFooter className="mt-4">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handlePreview} className="bg-primary text-white">
            Preview Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestQuestionForm;
