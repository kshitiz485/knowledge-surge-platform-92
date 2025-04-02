import React, { useState, useEffect } from "react";
import { Question } from "./TestQuestionForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { TestResult } from "@/types/test";
import { Book, Clock, Flag, Check, X, ChevronLeft, ChevronRight, Trophy, Eye } from "lucide-react";

interface MockTestPreviewProps {
  isOpen: boolean;
  onClose: () => void;
  questions: Question[];
  testTitle: string;
}

const MockTestPreview: React.FC<MockTestPreviewProps> = ({ 
  isOpen, 
  onClose, 
  questions, 
  testTitle 
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(1);
  const [selectedOptions, setSelectedOptions] = useState<Record<string, string | null>>({});
  const [questionStatus, setQuestionStatus] = useState<Record<string, string>>({});
  const [subject, setSubject] = useState<string>("physics");
  const [timer, setTimer] = useState({ minutes: 180, seconds: 0 });
  const [counters, setCounters] = useState({
    "not-visited": questions.length,
    "unanswered": 0,
    "answered": 0,
    "review": 0,
    "review-with-answer": 0
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [testResult, setTestResult] = useState<TestResult | null>(null);
  const [timerInterval, setTimerInterval] = useState<NodeJS.Timeout | null>(null);

  // Initialize question status
  useEffect(() => {
    if (questions.length > 0) {
      const initialStatus: Record<string, string> = {};
      const initialSelectedOptions: Record<string, string | null> = {};
      
      questions.forEach((q) => {
        initialStatus[q.id] = "not-visited";
        initialSelectedOptions[q.id] = null;
      });

      setQuestionStatus(initialStatus);
      setSelectedOptions(initialSelectedOptions);
      setCounters({
        "not-visited": questions.length,
        "unanswered": 0,
        "answered": 0,
        "review": 0,
        "review-with-answer": 0
      });
    }
  }, [questions]);

  // Timer functionality
  useEffect(() => {
    if (!isOpen || isSubmitted) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          handleSubmitTest();
          return prev;
        }
      });
    }, 1000);

    setTimerInterval(interval);

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isOpen, isSubmitted]);

  const updateQuestionStatus = (questionId: string, newStatus: string) => {
    setQuestionStatus(prev => {
      const oldStatus = prev[questionId];
      
      // Update counters
      setCounters(prevCounters => {
        const updatedCounters = { ...prevCounters };
        
        if (oldStatus) {
          updatedCounters[oldStatus]--;
          if (oldStatus === "review-with-answer") {
            updatedCounters["answered"]--;
          }
        }

        updatedCounters[newStatus]++;
        if (newStatus === "review-with-answer") {
          updatedCounters["answered"]++;
        }

        return updatedCounters;
      });

      return { ...prev, [questionId]: newStatus };
    });
  };

  const handleOptionSelect = (optionId: string) => {
    const questionId = questions[currentQuestion - 1].id;
    
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: optionId
    }));

    if (questionStatus[questionId] === "review") {
      updateQuestionStatus(questionId, "review-with-answer");
    } else {
      updateQuestionStatus(questionId, "answered");
    }
  };

  const handleMarkReview = () => {
    const questionId = questions[currentQuestion - 1].id;
    const selectedOption = selectedOptions[questionId];

    if (selectedOption) {
      updateQuestionStatus(questionId, "review-with-answer");
    } else {
      updateQuestionStatus(questionId, "review");
    }
  };

  const handleClearSelection = () => {
    const questionId = questions[currentQuestion - 1].id;
    
    setSelectedOptions(prev => ({
      ...prev,
      [questionId]: null
    }));

    if (questionStatus[questionId] === "answered" || questionStatus[questionId] === "review-with-answer") {
      updateQuestionStatus(questionId, "unanswered");
    }
  };

  const handleNavigation = (direction: 'prev' | 'next') => {
    if (direction === 'prev' && currentQuestion > 1) {
      setCurrentQuestion(prev => prev - 1);
    } else if (direction === 'next' && currentQuestion < questions.length) {
      const questionId = questions[currentQuestion - 1].id;
      
      // If moving to next and current is not-visited, mark as unanswered
      if (questionStatus[questionId] === "not-visited") {
        updateQuestionStatus(questionId, "unanswered");
      }
      
      setCurrentQuestion(prev => prev + 1);
    }
  };

  const handleQuestionClick = (index: number) => {
    const questionId = questions[currentQuestion - 1].id;
    
    // If moving from current and it's not-visited, mark as unanswered
    if (questionStatus[questionId] === "not-visited") {
      updateQuestionStatus(questionId, "unanswered");
    }
    
    setCurrentQuestion(index + 1);
  };

  const handleSubjectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setSubject(e.target.value);
  };

  const handleSubmitTest = () => {
    // Calculate the result
    if (timerInterval) clearInterval(timerInterval);

    // Count correct and incorrect answers
    let correctCount = 0;
    let incorrectCount = 0;
    let unattemptedCount = 0;

    questions.forEach((question) => {
      const selectedOption = selectedOptions[question.id];
      if (!selectedOption) {
        unattemptedCount++;
        return;
      }

      const selectedOptionObj = question.options.find(opt => opt.id === selectedOption);
      if (selectedOptionObj?.isCorrect) {
        correctCount++;
      } else {
        incorrectCount++;
      }
    });

    // Calculate score (4 points for correct, -1 for incorrect)
    const score = (correctCount * 4) - incorrectCount;
    const totalScore = questions.length * 4;
    const accuracy = (correctCount / (correctCount + incorrectCount)) * 100 || 0;

    // Mock time taken - in a real app this would be calculated from the start time
    const timeTaken = `${180 - timer.minutes} minutes, ${60 - timer.seconds}seconds`;

    // Mock result
    const result: TestResult = {
      score,
      totalScore,
      timeTaken,
      accuracy,
      totalQuestions: questions.length,
      correctAnswers: correctCount,
      incorrectAnswers: incorrectCount,
      partiallyCorrectAnswers: 0,
      unattemptedQuestions: unattemptedCount,
      rank: {
        batch: 13,
        batchTotal: 128,
        institute: 13,
        instituteTotal: 128,
        percentile: 89.84
      }
    };

    setTestResult(result);
    setIsSubmitted(true);
  };

  const handleViewSolutions = () => {
    // In a real app, this would show detailed solutions
    console.log("Viewing solutions");
  };

  const currentQuestionData = questions[currentQuestion - 1];
  
  if (!isOpen || !currentQuestionData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[90vh] p-0 overflow-hidden flex" onInteractOutside={(e) => e.preventDefault()}>
        {!isSubmitted ? (
          // Test Taking View
          <>
            <div className="flex-1 p-6 overflow-y-auto">
              <header className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold">{testTitle}</h1>
                <div className="timer flex items-center">
                  <Clock className="text-red-500 mr-2" />
                  <span id="timer" className="text-red-500 font-bold">
                    {String(timer.minutes).padStart(2, '0')}:{String(timer.seconds).padStart(2, '0')}
                  </span>
                  <span className="ml-1 text-red-500 font-bold">MIN</span>
                </div>
                <div className="flex space-x-2">
                  <Button onClick={handleSubmitTest} className="bg-green-500 hover:bg-green-600 text-white">
                    Submit Test
                  </Button>
                  <Button onClick={onClose} className="bg-gray-500 hover:bg-gray-600 text-white">
                    Exit Preview
                  </Button>
                </div>
              </header>
              
              <section className="mb-6 bg-blue-100 p-4 rounded-lg">
                <select 
                  className="p-2 rounded-lg" 
                  value={subject}
                  onChange={handleSubjectChange}
                >
                  <option value="physics">Physics</option>
                  <option value="chemistry">Chemistry</option>
                  <option value="mathematics">Mathematics</option>
                </select>
              </section>
              
              <section id="question-container" className="mb-6">
                <div className="flex justify-between">
                  <h2 className="text-lg font-medium">
                    Question <span id="question-number">{currentQuestion}</span>/{questions.length}
                  </h2>
                  <div className="bg-gray-200 px-3 py-1 rounded-lg">4 / -1</div>
                </div>
                
                <div id="question" className="mt-4 text-lg font-medium">
                  {currentQuestionData.text}
                </div>
                
                <div id="options" className="mt-4">
                  {currentQuestionData.options.map((option) => (
                    <div 
                      key={option.id}
                      className={`option-container border-2 rounded-lg p-3 my-2 flex items-center cursor-pointer transition-all ${
                        selectedOptions[currentQuestionData.id] === option.id ? 'bg-blue-100 border-blue-500' : 'border-gray-300 hover:bg-gray-100'
                      }`}
                      onClick={() => handleOptionSelect(option.id)}
                    >
                      <span className="mr-2">{option.id})</span> {option.text}
                    </div>
                  ))}
                </div>
                
                <div className="flex justify-center gap-4 mt-4">
                  <Button 
                    onClick={handleMarkReview}
                    className="bg-amber-400 hover:bg-amber-500 text-white"
                  >
                    <Flag className="w-4 h-4 mr-2" />
                    Mark for Review
                  </Button>
                  <Button 
                    onClick={handleClearSelection}
                    className="bg-red-400 hover:bg-red-500 text-white"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Clear Selection
                  </Button>
                </div>
              </section>
              
              <footer className="flex justify-between mt-4">
                <Button 
                  onClick={() => handleNavigation('prev')}
                  disabled={currentQuestion === 1}
                  className="rounded-full p-2 bg-yellow-400 hover:bg-yellow-500"
                >
                  <ChevronLeft className="w-5 h-5" />
                </Button>
                <Button 
                  onClick={() => handleNavigation('next')}
                  disabled={currentQuestion === questions.length}
                  className="rounded-full p-2 bg-yellow-400 hover:bg-yellow-500"
                >
                  <ChevronRight className="w-5 h-5" />
                </Button>
              </footer>
            </div>
            
            <div className="w-[300px] bg-white border-l border-gray-200 p-4 overflow-y-auto">
              <h2 className="text-lg font-bold mb-4">Question Status</h2>
              <div className="grid grid-cols-5 gap-2">
                {questions.map((q, index) => (
                  <div 
                    key={q.id}
                    className={`flex justify-center items-center w-8 h-8 rounded-full cursor-pointer ${
                      questionStatus[q.id] === "not-visited" ? "bg-gray-300" :
                      questionStatus[q.id] === "unanswered" ? "bg-red-400" :
                      questionStatus[q.id] === "answered" ? "bg-green-400" :
                      questionStatus[q.id] === "review" ? "bg-yellow-400" :
                      questionStatus[q.id] === "review-with-answer" ? "bg-purple-400" : ""
                    }`}
                    onClick={() => handleQuestionClick(index)}
                  >
                    {index + 1}
                  </div>
                ))}
              </div>
              
              <div className="mt-6 space-y-2">
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-gray-300 mr-2"></div>
                  <span>Not Visited ({counters["not-visited"]})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-red-400 mr-2"></div>
                  <span>Unanswered ({counters["unanswered"]})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-green-400 mr-2"></div>
                  <span>Answered ({counters["answered"]})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-yellow-400 mr-2"></div>
                  <span>Marked for Review ({counters["review"]})</span>
                </div>
                <div className="flex items-center">
                  <div className="w-4 h-4 bg-purple-400 mr-2"></div>
                  <span>Answered & Marked ({counters["review-with-answer"]})</span>
                </div>
              </div>
              
              <div className="mt-6 p-4 bg-gray-100 rounded-lg">
                <div className="flex items-center mb-2">
                  <Book className="w-4 h-4 mr-2 text-primary" />
                  <h3 className="font-medium">Instructions</h3>
                </div>
                <ul className="text-sm space-y-1 list-disc pl-5">
                  <li>Each question carries 4 marks for correct answer</li>
                  <li>There is a negative marking of -1 for incorrect answers</li>
                  <li>You can navigate between questions using the arrows</li>
                  <li>Click on question numbers to jump directly to a question</li>
                  <li>Use "Mark for Review" to flag questions you want to revisit</li>
                </ul>
              </div>
            </div>
          </>
        ) : (
          // Test Result View
          <div className="w-full p-8 overflow-y-auto">
            <div className="max-w-3xl mx-auto">
              <h1 className="text-2xl font-bold text-center mb-6">{testTitle} - Results</h1>
              
              <div className="bg-white rounded-lg shadow-md p-8 mb-8">
                <h2 className="text-gray-600 text-center text-xl mb-2">SCORE</h2>
                <h1 className="text-blue-500 text-center text-7xl font-bold mb-2">
                  {testResult?.score}
                </h1>
                <p className="text-center text-lg mb-4">OUT OF {testResult?.totalScore}</p>
                
                <div className="flex items-center justify-center text-amber-500 mb-4">
                  <Clock className="mr-2" />
                  <span>{testResult?.timeTaken}</span>
                </div>
                
                <div className="w-full mb-4">
                  <Progress value={testResult?.accuracy} className="h-4" />
                </div>
                <p className="text-center text-gray-600 mb-8">{testResult?.accuracy.toFixed(0)}% ACCURACY</p>
                
                <div className="space-y-4">
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-purple-100 flex items-center justify-center mr-3">
                        <span className="text-lg text-purple-500">?</span>
                      </div>
                      <span className="text-lg">Total Questions</span>
                    </div>
                    <span className="text-xl font-bold">{testResult?.totalQuestions}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center mr-3">
                        <Check className="text-green-500" />
                      </div>
                      <span className="text-lg">Correct Answers</span>
                    </div>
                    <span className="text-xl font-bold">{testResult?.correctAnswers}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-red-100 flex items-center justify-center mr-3">
                        <X className="text-red-500" />
                      </div>
                      <span className="text-lg">Incorrect Answers</span>
                    </div>
                    <span className="text-xl font-bold">{testResult?.incorrectAnswers}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-yellow-100 flex items-center justify-center mr-3">
                        <span className="text-yellow-500">±</span>
                      </div>
                      <span className="text-lg">Partially Correct Answers</span>
                    </div>
                    <span className="text-xl font-bold">{testResult?.partiallyCorrectAnswers}</span>
                  </div>
                  
                  <div className="flex justify-between items-center py-2">
                    <div className="flex items-center">
                      <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center mr-3">
                        <span className="text-gray-500">-</span>
                      </div>
                      <span className="text-lg">Unattempted Questions</span>
                    </div>
                    <span className="text-xl font-bold">{testResult?.unattemptedQuestions}</span>
                  </div>
                </div>
                
                <div className="border-t border-gray-200 mt-8 pt-6 flex justify-center">
                  <Button 
                    onClick={handleViewSolutions} 
                    className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2"
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    View Solutions
                  </Button>
                </div>
              </div>
              
              {testResult?.rank && (
                <div className="bg-white rounded-lg shadow-md p-8 flex flex-wrap">
                  <div className="w-full md:w-1/2 p-4">
                    <h2 className="text-lg text-gray-600 mb-4">YOUR RANK</h2>
                    
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-green-100 flex items-center justify-center mr-4">
                        <span className="text-green-500 text-2xl">👤</span>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500">BATCH RANK</h3>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold mr-2">{testResult.rank.batch}</span>
                          <span className="text-sm text-gray-500">/ {testResult.rank.batchTotal}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center mb-6">
                      <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mr-4">
                        <span className="text-blue-500 text-2xl">🏛️</span>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500">INSTITUTE RANK</h3>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold mr-2">{testResult.rank.institute}</span>
                          <span className="text-sm text-gray-500">/ {testResult.rank.instituteTotal}</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center">
                      <div className="w-16 h-16 rounded-full bg-yellow-100 flex items-center justify-center mr-4">
                        <span className="text-yellow-500 text-2xl">📊</span>
                      </div>
                      <div>
                        <h3 className="text-sm text-gray-500">PERCENTILE</h3>
                        <div className="flex items-baseline">
                          <span className="text-2xl font-bold mr-2">{testResult.rank.percentile.toFixed(2)}</span>
                          <span className="text-sm text-gray-500">/ 100</span>
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="w-full md:w-1/2 p-4 flex flex-col items-center justify-center">
                    <h2 className="text-lg text-gray-600 mb-4">LEADERBOARD</h2>
                    <div className="w-full flex justify-end mb-2">
                      <Button variant="link" className="text-blue-500">View More</Button>
                    </div>
                    <div className="flex flex-col items-center justify-center h-40">
                      <Trophy className="text-blue-300 h-20 w-20 mb-4" />
                      <p className="text-gray-500 text-center">
                        Leaderboard will be generated as more students take the test
                      </p>
                    </div>
                  </div>
                </div>
              )}
              
              <div className="mt-8 flex justify-center">
                <Button 
                  onClick={onClose} 
                  className="bg-gray-500 hover:bg-gray-600 text-white px-6 py-2"
                >
                  Close
                </Button>
              </div>
            </div>
          </div>
        )}
      </DialogContent>
    </Dialog>
  );
};

export default MockTestPreview;
