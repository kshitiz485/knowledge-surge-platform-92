
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
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus[]>(() => {
    return questions.map(() => ({
      isAnswered: false,
      selectedOption: null,
      isCorrect: null,
    }));
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize question status
  useEffect(() => {
    if (isOpen && questions.length > 0) {
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
      
      setTimerInterval(interval);
      
      return () => {
        if (interval) clearInterval(interval);
      };
    }
  }, [isOpen, questions.length]);

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

  // Handle test submission
  const handleSubmitTest = () => {
    if (timerInterval) clearInterval(timerInterval);
    
    // Calculate results
    let correctAnswers = 0;
    let incorrectAnswers = 0;
    let unattempted = 0;
    
    const updatedStatus = [...questionStatus];
    
    questions.forEach((question, index) => {
      const status = questionStatus[index];
      
      if (!status.isAnswered) {
        unattempted++;
        updatedStatus[index].isCorrect = null;
      } else {
        const isCorrect = status.selectedOption === question.correctOption;
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
    const percentage = (score / totalScore) * 100;
    
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

  if (!isOpen || questions.length === 0) return null;

  const currentQuestion = questions[currentQuestionIndex];
  const currentStatus = questionStatus[currentQuestionIndex];

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
                      isSubmitted && currentQuestion.correctOption === option.id
                        ? 'bg-green-100 border-green-300'
                        : ''
                    }`}
                    onClick={() => handleOptionSelect(option.id)}
                  >
                    {option.text}
                  </div>
                ))}
              </div>
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
