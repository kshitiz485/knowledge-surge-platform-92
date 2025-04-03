
import React, { useState, useEffect } from "react";
import { Question } from "./TestQuestionForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CheckCircle, XCircle, Clock, AlertCircle } from "lucide-react";

interface MockTestPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  testTitle: string;
}

interface TestResult {
  totalQuestions: number;
  correctAnswers: number;
  incorrectAnswers: number;
  unattempted: number;
  score: number;
  totalScore: number;
  percentage: number;
}

interface QuestionStatus {
  isAnswered: boolean;
  selectedOption: string | null;
  isCorrect: boolean | null;
}

const MockTestPreview = ({ isOpen, onClose, questions, testTitle }: MockTestPreviewProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [showSolution, setShowSolution] = useState(false);

  // Initialize question status
  useEffect(() => {
    if (isOpen && questions.length > 0) {
      // Reset all state when dialog opens
      setQuestionStatus(
        questions.map(() => ({
          isAnswered: false,
          selectedOption: null,
          isCorrect: null,
        }))
      );
      setCurrentQuestionIndex(0);
      setIsSubmitted(false);
      setTestResult(null);
      setShowSolution(false);
      
      // Reset and start timer
      setTimeRemaining(3600);
      const interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(interval);
            handleSubmitTest();
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      
      // Store the interval ID
      setTimerInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isOpen, questions.length]);

  // Safely handle when no questions are available
  useEffect(() => {
    if (questions.length === 0) {
      setQuestionStatus([]);
    }
  }, [questions]);

  // Format time remaining as MM:SS
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  // Handle selection of option
  const handleOptionSelect = (optionId: string) => {
    if (isSubmitted) return;
    
    const updatedStatus = [...questionStatus];
    updatedStatus[currentQuestionIndex] = {
      isAnswered: true,
      selectedOption: optionId,
      isCorrect: null,
    };
    
    setQuestionStatus(updatedStatus);
  };

  // Handle navigation between questions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Toggle solution visibility
  const handleToggleSolution = () => {
    setShowSolution(!showSolution);
  };

  // Handle test submission
  const handleSubmitTest = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    // Check if there are no questions
    if (questions.length === 0) {
      setIsSubmitted(true);
      return;
    }
    
    // Calculate results
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unattempted = 0;
    
    const updatedStatus = [...questionStatus];
    
    questions.forEach((question, index) => {
      const status = questionStatus[index];
      
      if (!status || !status.isAnswered) {
        unattempted++;
        if (status) {
          updatedStatus[index].isCorrect = null;
        }
      } else {
        // Find the correct option
        const correctOption = question.options.find(opt => opt.isCorrect)?.id;
        const isCorrect = status.selectedOption === correctOption;
        updatedStatus[index].isCorrect = isCorrect;
        
        if (isCorrect) {
          correctAnswers++;
        } else {
          incorrectAnswers++;
        }
      }
    });
    
    const totalScore = questions.length * 4;  // 4 points per correct answer
    const score = correctAnswers * 4;
    const percentage = totalScore > 0 ? (score / totalScore) * 100 : 0;
    
    setQuestionStatus(updatedStatus);
    setTestResult({
      totalQuestions: questions.length,
      correctAnswers,
      incorrectAnswers,
      unattempted,
      score,
      totalScore,
      percentage,
    });
    
    setIsSubmitted(true);
  };

  // Handle dialog close
  const handleClose = () => {
    if (timerInterval) clearInterval(timerInterval);
    onClose();
  };

  // Guard against empty questions array
  if (!isOpen) return null;
  
  // If no questions are available, show a message
  if (questions.length === 0) {
    return (
      <Dialog open={isOpen} onOpenChange={handleClose}>
        <DialogContent className="max-w-md">
          <div className="flex flex-col items-center justify-center p-4">
            <h2 className="text-xl font-bold mb-4">{testTitle}</h2>
            <p className="text-center mb-6">No questions available for this test.</p>
            <Button onClick={handleClose}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  // Safely access the current status, default to a new object if undefined
  const currentStatus = questionStatus[currentQuestionIndex] || {
    isAnswered: false,
    selectedOption: null,
    isCorrect: null
  };
  const correctOptionId = currentQuestion.options.find(opt => opt.isCorrect)?.id;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-4xl h-[90vh] flex flex-col">
        <div className="flex justify-between items-center mb-4">
          <div>
            <h2 className="text-xl font-bold">{testTitle}</h2>
            <p className="text-sm text-gray-500">
              Question {currentQuestionIndex + 1} of {questions.length}
            </p>
          </div>
          <div className="flex items-center gap-2 px-3 py-1 bg-gray-100 rounded-full">
            <Clock className="h-4 w-4 text-primary" />
            <span className="font-mono">{formatTime(timeRemaining)}</span>
          </div>
        </div>

        {isSubmitted && testResult ? (
          <div className="flex flex-col items-center justify-center flex-grow">
            <Card className="w-full max-w-md">
              <CardHeader>
                <CardTitle className="text-center">Test Results</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="text-center text-4xl font-bold">
                  {Math.round(testResult.percentage)}%
                </div>
                <div className="grid grid-cols-2 gap-2 text-sm">
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-4 w-4 text-green-500" />
                    <span>Correct: {testResult.correctAnswers}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <XCircle className="h-4 w-4 text-red-500" />
                    <span>Incorrect: {testResult.incorrectAnswers}</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="h-4 w-4 text-amber-500" />
                    <span>Unattempted: {testResult.unattempted}</span>
                  </div>
                  <div>
                    <span>Score: {testResult.score}/{testResult.totalScore}</span>
                  </div>
                </div>
                
                <Button 
                  onClick={handleClose}
                  className="w-full mt-4"
                >
                  Close
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <>
            <div className="flex-grow overflow-y-auto">
              <div className="p-4 border rounded-lg mb-4">
                <h3 className="font-semibold mb-2">Question {currentQuestionIndex + 1}:</h3>
                <p>{currentQuestion.text}</p>
                
                {currentQuestion.imageUrl && (
                  <div className="mt-4">
                    <img 
                      src={currentQuestion.imageUrl} 
                      alt="Question" 
                      className="max-h-64 mx-auto rounded-lg"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.onerror = null;
                        target.src = '/placeholder.svg';
                      }} 
                    />
                  </div>
                )}
              </div>
              
              <div className="space-y-3">
                {currentQuestion.options.map((option) => (
                  <div
                    key={option.id}
                    className={`p-3 border rounded-lg cursor-pointer transition-colors ${
                      currentStatus.selectedOption === option.id 
                        ? 'bg-primary text-white' 
                        : 'hover:bg-gray-50'
                    } ${
                      isSubmitted && currentStatus.isCorrect === false && currentStatus.selectedOption === option.id
                        ? 'bg-red-100 border-red-300'
                        : ''
                    } ${
                      (isSubmitted || showSolution) && option.isCorrect
                        ? 'bg-green-100 border-green-300'
                        : ''
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    {option.text}
                  </div>
                ))}
              </div>

              {showSolution && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                  <p>The correct answer is: {currentQuestion.options.find(opt => opt.isCorrect)?.text}</p>
                  {currentQuestion.solution && (
                    <p className="mt-2">{currentQuestion.solution}</p>
                  )}
                </div>
              )}
            </div>
            
            <div className="flex justify-between mt-4">
              <Button 
                onClick={handlePrevQuestion}
                disabled={currentQuestionIndex === 0}
                variant="outline"
              >
                Previous
              </Button>
              
              <Button 
                onClick={handleToggleSolution}
                variant="secondary"
              >
                {showSolution ? "Hide Solution" : "Show Solution"}
              </Button>
              
              <Button 
                onClick={handleSubmitTest}
                variant="destructive"
              >
                Submit Test
              </Button>
              
              <Button 
                onClick={handleNextQuestion}
                disabled={currentQuestionIndex === questions.length - 1}
              >
                Next
              </Button>
            </div>
          </>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MockTestPreview;
