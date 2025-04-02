
import React, { useState, useEffect } from "react";
import { Question } from "./TestQuestionForm";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Book, Clock, Flag, Check, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";

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
    if (!isOpen) return;

    const interval = setInterval(() => {
      setTimer(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        } else {
          clearInterval(interval);
          alert("Time's up!");
          return prev;
        }
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [isOpen]);

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

  const currentQuestionData = questions[currentQuestion - 1];
  
  if (!isOpen || !currentQuestionData) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-[90vw] h-[90vh] p-0 overflow-hidden flex" onInteractOutside={(e) => e.preventDefault()}>
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
            <Button onClick={onClose} className="bg-green-500 hover:bg-green-600 text-white">
              Exit Preview
            </Button>
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
      </DialogContent>
    </Dialog>
  );
};

export default MockTestPreview;
