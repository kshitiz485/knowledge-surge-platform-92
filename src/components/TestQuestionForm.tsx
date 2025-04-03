
import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Plus, X, Image, Upload, Save, Eye } from "lucide-react";
import { toast } from "sonner";
import { saveTestToGoogleDrive } from "@/services/googleDriveService";

export interface Option {
  id: string;
  text: string;
  isCorrect: boolean;
  imageUrl?: string;
}

export interface Question {
  id: string;
  text: string;
  options: Option[];
  subject: "physics" | "chemistry" | "mathematics";
  imageUrl?: string;
  solution?: string;
  marks?: number;
  negativeMarks?: number;
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
      { id: "A", text: "", isCorrect: false, imageUrl: "" },
      { id: "B", text: "", isCorrect: false, imageUrl: "" },
      { id: "C", text: "", isCorrect: false, imageUrl: "" },
      { id: "D", text: "", isCorrect: false, imageUrl: "" },
    ],
    subject: "physics",
    imageUrl: "",
    solution: "",
    marks: 4,
    negativeMarks: 1
  });
  
  const questionImageInputRef = useRef<HTMLInputElement>(null);
  const optionImageInputRefs = {
    A: useRef<HTMLInputElement>(null),
    B: useRef<HTMLInputElement>(null),
    C: useRef<HTMLInputElement>(null),
    D: useRef<HTMLInputElement>(null),
  };

  // Auto-save draft to localStorage
  useEffect(() => {
    // Load saved questions from localStorage if any
    const savedQuestions = localStorage.getItem(`test_questions_${testTitle}`);
    if (savedQuestions) {
      try {
        const parsedQuestions = JSON.parse(savedQuestions);
        setQuestions(parsedQuestions);
      } catch (error) {
        console.error("Error parsing saved questions:", error);
      }
    }
  }, [testTitle]);

  // Save questions to localStorage when they change
  useEffect(() => {
    if (questions.length > 0) {
      localStorage.setItem(`test_questions_${testTitle}`, JSON.stringify(questions));
    }
  }, [questions, testTitle]);

  const handleQuestionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      text: e.target.value
    });
  };

  const handleSolutionChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setCurrentQuestion({
      ...currentQuestion,
      solution: e.target.value
    });
  };

  const handleMarksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCurrentQuestion({
      ...currentQuestion,
      marks: value
    });
  };

  const handleNegativeMarksChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = parseInt(e.target.value) || 0;
    setCurrentQuestion({
      ...currentQuestion,
      negativeMarks: value
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

  const handleOptionImageUrlChange = (optionId: string, value: string) => {
    setCurrentQuestion({
      ...currentQuestion,
      options: currentQuestion.options.map(option => 
        option.id === optionId ? { ...option, imageUrl: value } : option
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

  const handleQuestionImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // In a real app, you'd upload this file to a server or cloud storage
      // For now, we'll convert it to a data URL for preview
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentQuestion({
          ...currentQuestion,
          imageUrl: reader.result as string
        });
        toast.success("Question image uploaded");
      };
      reader.readAsDataURL(file);
    }
  };

  const handleOptionImageUpload = (optionId: string, e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        setCurrentQuestion({
          ...currentQuestion,
          options: currentQuestion.options.map(option => 
            option.id === optionId ? { ...option, imageUrl: reader.result as string } : option
          )
        });
        toast.success(`Option ${optionId} image uploaded`);
      };
      reader.readAsDataURL(file);
    }
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
    const updatedQuestions = [...questions, { ...currentQuestion, id: newQuestionId }];
    setQuestions(updatedQuestions);
    
    // Reset current question form
    setCurrentQuestion({
      id: (questions.length + 2).toString(),
      text: "",
      options: [
        { id: "A", text: "", isCorrect: false, imageUrl: "" },
        { id: "B", text: "", isCorrect: false, imageUrl: "" },
        { id: "C", text: "", isCorrect: false, imageUrl: "" },
        { id: "D", text: "", isCorrect: false, imageUrl: "" },
      ],
      subject: currentQuestion.subject,
      imageUrl: "",
      solution: "",
      marks: 4,
      negativeMarks: 1
    });

    toast.success("Question added");
    
    // Auto-save to Google Drive
    saveToGoogleDrive(updatedQuestions);
  };

  const removeQuestion = (id: string) => {
    const updatedQuestions = questions.filter(q => q.id !== id);
    setQuestions(updatedQuestions);
    toast.success("Question removed");
    
    // Auto-save to Google Drive after removing
    saveToGoogleDrive(updatedQuestions);
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

    // Save to Google Drive
    saveToGoogleDrive(questions);

    onPreview(questions);
  };

  const saveToGoogleDrive = async (questions: Question[]) => {
    // Save test data to Google Drive
    const saved = await saveTestToGoogleDrive({
      title: testTitle,
      questions,
      lastSaved: new Date().toISOString()
    });
    
    if (saved) {
      toast.success("Test data saved to Google Drive folder");
    }
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div>
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
            <div>
              <Label htmlFor="marks">Marks</Label>
              <Input 
                id="marks"
                type="number" 
                min="0"
                value={currentQuestion.marks} 
                onChange={handleMarksChange}
              />
            </div>
            <div>
              <Label htmlFor="negativeMarks">Negative Marks</Label>
              <Input 
                id="negativeMarks"
                type="number" 
                min="0"
                value={currentQuestion.negativeMarks} 
                onChange={handleNegativeMarksChange}
              />
            </div>
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

          {/* Question Image upload */}
          <div className="space-y-2">
            <Label htmlFor="questionImage">Question Image</Label>
            <div className="flex gap-2">
              <Input 
                id="imageUrl"
                placeholder="Enter image URL or upload/choose below"
                value={currentQuestion.imageUrl?.startsWith("data:") ? "Image Uploaded" : currentQuestion.imageUrl || ""}
                onChange={handleImageUrlChange}
                className="flex-grow"
                disabled={currentQuestion.imageUrl?.startsWith("data:")}
              />
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => questionImageInputRef.current?.click()}
              >
                <Upload className="h-4 w-4 mr-2" />
                Upload
              </Button>
              <input
                type="file"
                ref={questionImageInputRef}
                onChange={handleQuestionImageUpload}
                accept="image/*"
                className="hidden"
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
              <div key={option.id} className="space-y-2 border rounded-md p-3">
                <div className="flex items-center space-x-2">
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
                
                {/* Option Image Upload */}
                <div className="flex gap-2 mt-2">
                  <Input 
                    placeholder={`Image URL for Option ${option.id} (optional)`}
                    value={option.imageUrl?.startsWith("data:") ? "Image Uploaded" : option.imageUrl || ""}
                    onChange={(e) => handleOptionImageUrlChange(option.id, e.target.value)}
                    className="flex-grow"
                    disabled={option.imageUrl?.startsWith("data:")}
                  />
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => optionImageInputRefs[option.id as keyof typeof optionImageInputRefs].current?.click()}
                  >
                    <Upload className="h-4 w-4 mr-2" />
                    Upload
                  </Button>
                  <input
                    type="file"
                    ref={optionImageInputRefs[option.id as keyof typeof optionImageInputRefs]}
                    onChange={(e) => handleOptionImageUpload(option.id, e)}
                    accept="image/*"
                    className="hidden"
                  />
                </div>
                
                {/* Option image preview */}
                {option.imageUrl && (
                  <div className="mt-2 border rounded-md p-2">
                    <div className="relative">
                      <img 
                        src={option.imageUrl} 
                        alt={`Option ${option.id}`} 
                        className="max-h-24 mx-auto object-contain"
                        onError={() => {
                          toast.error(`Failed to load image for Option ${option.id}`);
                          handleOptionImageUrlChange(option.id, "");
                        }}
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80"
                        onClick={() => handleOptionImageUrlChange(option.id, "")}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>

          {/* Solution or explanation */}
          <div className="space-y-2">
            <Label htmlFor="solution">Solution/Explanation</Label>
            <Textarea
              id="solution"
              placeholder="Enter the solution or explanation for this question..."
              value={currentQuestion.solution || ""}
              onChange={handleSolutionChange}
              className="min-h-[100px]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Button 
              onClick={addQuestion} 
              className="w-full bg-gold hover:bg-gold/90 text-white"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Question
            </Button>
            
            <Button
              onClick={() => saveToGoogleDrive(questions)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Draft to Google Drive
            </Button>
          </div>

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
                        <div className="flex items-center gap-3 text-sm text-gray-500">
                          <span>Subject: {q.subject}</span>
                          <span>Marks: +{q.marks} / -{q.negativeMarks}</span>
                        </div>
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
            <Eye className="h-4 w-4 mr-2" />
            Preview Test
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default TestQuestionForm;
