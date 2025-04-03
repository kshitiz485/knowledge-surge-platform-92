
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
  status: "not-visited" | "unanswered" | "answered" | "review" | "review-with-answer";
}

const MockTestPreview = ({ isOpen, onClose, questions, testTitle }: MockTestPreviewProps) => {
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(3600); // 1 hour in seconds
  const [questionStatus, setQuestionStatus] = useState<QuestionStatus[]>([]);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);
  const [showSolution, setShowSolution] = useState(false);
  const [selectedSubject, setSelectedSubject] = useState<string>("physics");

  // Status counters
  const [statusCounts, setStatusCounts] = useState({
    "not-visited": 0,
    "unanswered": 0,
    "answered": 0,
    "review": 0,
    "review-with-answer": 0
  });

  // Initialize question status
  useEffect(() => {
    if (isOpen && questions.length > 0) {
      // Reset all state when dialog opens
      const initialStatus = questions.map(() => ({
        isAnswered: false,
        selectedOption: null,
        isCorrect: null,
        status: "not-visited" as const
      }));
      
      setQuestionStatus(initialStatus);
      setCurrentQuestionIndex(0);
      setIsSubmitted(false);
      setTestResult(null);
      setShowSolution(false);
      setSelectedSubject("physics");
      
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
      
      // Initialize status counts
      setStatusCounts({
        "not-visited": questions.length,
        "unanswered": 0,
        "answered": 0,
        "review": 0,
        "review-with-answer": 0
      });
      
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
    if (!updatedStatus[currentQuestionIndex]) {
      return; // Guard against undefined status
    }
    
    const currentStatus = updatedStatus[currentQuestionIndex].status;
    
    // Update status counts
    setStatusCounts(prev => ({
      ...prev,
      [currentStatus]: prev[currentStatus] - 1,
      "answered": prev["answered"] + 1
    }));
    
    updatedStatus[currentQuestionIndex] = {
      ...updatedStatus[currentQuestionIndex],
      isAnswered: true,
      selectedOption: optionId,
      isCorrect: null,
      status: currentStatus === "review" ? "review-with-answer" : "answered"
    };
    
    setQuestionStatus(updatedStatus);
  };

  // Handle marking for review
  const handleMarkReview = () => {
    if (isSubmitted) return;
    
    const updatedStatus = [...questionStatus];
    if (!updatedStatus[currentQuestionIndex]) {
      return; // Guard against undefined status
    }
    
    const currentStatus = updatedStatus[currentQuestionIndex].status;
    const isAnswered = updatedStatus[currentQuestionIndex].isAnswered;
    const newStatus = isAnswered ? "review-with-answer" : "review";
    
    // Update status counts
    setStatusCounts(prev => ({
      ...prev,
      [currentStatus]: prev[currentStatus] - 1,
      [newStatus]: prev[newStatus] + 1
    }));
    
    updatedStatus[currentQuestionIndex] = {
      ...updatedStatus[currentQuestionIndex],
      status: newStatus as "review" | "review-with-answer"
    };
    
    setQuestionStatus(updatedStatus);
  };

  // Handle clearing selection
  const handleClearSelection = () => {
    if (isSubmitted) return;
    
    const updatedStatus = [...questionStatus];
    if (!updatedStatus[currentQuestionIndex]) {
      return; // Guard against undefined status
    }
    
    const currentStatus = updatedStatus[currentQuestionIndex].status;
    const newStatus = currentStatus === "review-with-answer" ? "review" : "unanswered";
    
    // Update status counts
    setStatusCounts(prev => ({
      ...prev,
      [currentStatus]: prev[currentStatus] - 1,
      [newStatus]: prev[newStatus] + 1
    }));
    
    updatedStatus[currentQuestionIndex] = {
      ...updatedStatus[currentQuestionIndex],
      isAnswered: false,
      selectedOption: null,
      isCorrect: null,
      status: newStatus as "review" | "unanswered"
    };
    
    setQuestionStatus(updatedStatus);
  };

  // Handle navigation between questions
  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      const updatedStatus = [...questionStatus];
      
      // If this is the first visit to the next question, update its status
      if (updatedStatus[currentQuestionIndex + 1] && 
          updatedStatus[currentQuestionIndex + 1].status === "not-visited") {
        
        // Update status counts
        setStatusCounts(prev => ({
          ...prev,
          "not-visited": prev["not-visited"] - 1,
          "unanswered": prev["unanswered"] + 1
        }));
        
        updatedStatus[currentQuestionIndex + 1] = {
          ...updatedStatus[currentQuestionIndex + 1],
          status: "unanswered"
        };
        
        setQuestionStatus(updatedStatus);
      }
      
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

  const handlePrevQuestion = () => {
    if (currentQuestionIndex > 0) {
      setCurrentQuestionIndex(currentQuestionIndex - 1);
    }
  };

  // Handle clicking on question number
  const handleQuestionClick = (index: number) => {
    const updatedStatus = [...questionStatus];
    
    // If this is the first visit to the question, update its status
    if (updatedStatus[index] && updatedStatus[index].status === "not-visited") {
      // Update status counts
      setStatusCounts(prev => ({
        ...prev,
        "not-visited": prev["not-visited"] - 1,
        "unanswered": prev["unanswered"] + 1
      }));
      
      updatedStatus[index] = {
        ...updatedStatus[index],
        status: "unanswered"
      };
      
      setQuestionStatus(updatedStatus);
    }
    
    setCurrentQuestionIndex(index);
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
      if (!updatedStatus[index]) {
        return; // Skip if status is undefined
      }
      
      const status = updatedStatus[index];
      
      if (!status.isAnswered) {
        unattempted++;
        updatedStatus[index].isCorrect = null;
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

  // Handle subject change
  const handleSubjectChange = (subject: string) => {
    setSelectedSubject(subject);
    
    // Find the first question with matching subject
    const index = questions.findIndex(q => q.subject === subject);
    if (index >= 0) {
      setCurrentQuestionIndex(index);
    }
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

  // Get filtered questions by subject if needed
  const filteredQuestions = questions;
  const currentQuestion = filteredQuestions[currentQuestionIndex];
  
  // Safely access the current status, default to a new object if undefined
  const currentStatus = questionStatus[currentQuestionIndex] || {
    isAnswered: false,
    selectedOption: null,
    isCorrect: null,
    status: "not-visited" as const
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="max-w-7xl h-[90vh] p-0 flex">
        <div className="flex-1 p-6 overflow-y-auto main-content">
          <header className="flex justify-between items-center mb-6">
            <h1 className="text-2xl font-bold">{testTitle}</h1>
            <div className="timer flex items-center">
              <span id="timer">{formatTime(timeRemaining)}</span>&nbsp;MIN
            </div>
            <Button onClick={handleSubmitTest} className="bg-green-500 hover:bg-green-600">
              Submit
            </Button>
          </header>

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
              <section className="mb-6 bg-blue-100 p-4 rounded-lg">
                <select 
                  className="p-2 rounded-lg"
                  value={selectedSubject}
                  onChange={(e) => handleSubjectChange(e.target.value)}
                >
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="mathematics">Mathematics</option>
                </select>
              </section>
              
              <section id="question-container" className="mb-6">
                <div className="flex justify-between">
                  <h2 className="text-lg font-medium">
                    Question <span id="question-number">{currentQuestionIndex + 1}</span>/{questions.length}
                  </h2>
                  <div className="bg-gray-200 px-3 py-1 rounded-lg">4 / -1</div>
                </div>
                
                <div id="question" className="mt-4 text-lg font-medium">
                  {currentQuestion.text}
                </div>
                
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
                
                <div id="options" className="mt-4">
                  {currentQuestion.options.map((option) => (
                    <div 
                      key={option.id}
                      className={`option-container ${currentStatus.selectedOption === option.id ? 'selected' : ''}`}
                      onClick={() => handleOptionSelect(option.id)}
                    >
                      <div className="flex items-center flex-1">
                        <span className="mr-2">{option.id})</span>
                        <span>{option.text}</span>
                      </div>
                      
                      {option.imageUrl && (
                        <div className="ml-4">
                          <img 
                            src={option.imageUrl} 
                            alt={`Option ${option.id}`} 
                            className="max-h-16 max-w-32 object-contain"
                            onError={(e) => {
                              const target = e.target as HTMLImageElement;
                              target.onerror = null;
                              target.src = '/placeholder.svg';
                            }}
                          />
                        </div>
                      )}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center gap-4 mt-4">
                  <Button 
                    id="mark-review-btn" 
                    className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
                    onClick={handleMarkReview}
                  >
                    Mark Review
                  </Button>
                  <Button 
                    id="clear-selection-btn" 
                    className="px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500"
                    onClick={handleClearSelection}
                  >
                    Clear Selection
                  </Button>
                </div>
              </section>
              
              {showSolution && (
                <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg">
                  <h4 className="font-semibold text-green-800 mb-2">Solution:</h4>
                  <p>The correct answer is: {currentQuestion.options.find(opt => opt.isCorrect)?.text}</p>
                </div>
              )}
              
              <footer className="flex justify-between mt-4">
                <Button 
                  id="prev-btn" 
                  className="px-4 py-2 bg-yellow-400 rounded-full hover:bg-yellow-500"
                  onClick={handlePrevQuestion}
                  disabled={currentQuestionIndex === 0}
                >
                  ⬅
                </Button>
                <Button
                  variant="secondary"
                  onClick={handleToggleSolution}
                >
                  {showSolution ? "Hide Solution" : "Show Solution"}
                </Button>
                <Button 
                  id="next-btn" 
                  className="px-4 py-2 bg-yellow-400 rounded-full hover:bg-yellow-500"
                  onClick={handleNextQuestion}
                  disabled={currentQuestionIndex === questions.length - 1}
                >
                  ➡
                </Button>
              </footer>
            </>
          )}
        </div>
        
        <div className="aside-right w-72 border-l border-gray-200">
          <h2 className="text-lg font-bold mb-4">Question Status</h2>
          
          <ul className="grid grid-cols-5 gap-2" id="question-status-list">
            {questionStatus.map((status, index) => (
              <li 
                key={index}
                className={`question-status ${status.status}`}
                onClick={() => handleQuestionClick(index)}
              >
                {index + 1}
              </li>
            ))}
          </ul>
          
          <div className="status-legend">
            <div>
              <div className="color-box bg-gray-300"></div>
              Not Visited (<span>{statusCounts["not-visited"]}</span>)
            </div>
            <div>
              <div className="color-box bg-red-400"></div>
              Un-answered (<span>{statusCounts["unanswered"]}</span>)
            </div>
            <div>
              <div className="color-box bg-green-400"></div>
              Answered (<span>{statusCounts["answered"]}</span>)
            </div>
            <div>
              <div className="color-box bg-yellow-400"></div>
              Review (<span>{statusCounts["review"]}</span>)
            </div>
            <div>
              <div className="color-box bg-purple-400"></div>
              Review with Answer (<span>{statusCounts["review-with-answer"]}</span>)
            </div>
          </div>
        </div>
      </DialogContent>
      
      <style jsx global>{`
        .option-container {
            border: 2px solid #ddd;
            border-radius: 8px;
            padding: 12px;
            margin: 8px 0;
            cursor: pointer;
            transition: all 0.3s ease-in-out;
            display: flex;
            align-items: center;
        }
        .option-container:hover {
            background-color: #f3f4f6;
        }
        .option-container.selected {
            background-color: #e0edff;
            border-color: #3b82f6;
        }
        .timer {
            font-size: 1.2rem;
            color: red;
            font-weight: bold;
            display: flex;
            align-items: center;
        }
        .question-status {
            display: flex;
            justify-content: center;
            align-items: center;
            width: 30px;
            height: 30px;
            border-radius: 50%;
            cursor: pointer;
            transition: background-color 0.3s ease;
            font-size: 14px;
            color: #000;
        }
        .question-status.not-visited {
            background-color: #e2e8f0;
        }
        .question-status.unanswered {
            background-color: #f87171;
        }
        .question-status.answered {
            background-color: #4ade80;
        }
        .question-status.review {
            background-color: #fbbf24;
        }
        .question-status.review-with-answer {
            background-color: #a78bfa;
        }
        .status-legend {
            display: flex;
            flex-wrap: wrap;
            gap: 10px;
            margin-top: 20px;
        }
        .status-legend div {
            display: flex;
            align-items: center;
            gap: 5px;
            font-size: 12px;
        }
        .status-legend .color-box {
            width: 15px;
            height: 15px;
            border-radius: 3px;
        }
      `}</style>
    </Dialog>
  );
};

export default MockTestPreview;
