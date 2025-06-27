"use client";

import { useEffect, useState } from "react";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Check,
  X,
  RefreshCw,
  Trophy,
  RotateCcw,
} from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

type Question = {
  question: string;
  options: string[];
  answer: string;
  type: "mcq" | "short";
  selected: string;
  revealed: boolean;
  correct?: boolean;
};

type QuizState = "active" | "completed" | "reviewing";

export default function QuizPage() {
  const { id } = useParams();
  const [questions, setQuestions] = useState<Question[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [summaryTitle, setSummaryTitle] = useState("");
  const [quizState, setQuizState] = useState<QuizState>("active");
  const [score, setScore] = useState(0);
  const [showResults, setShowResults] = useState(false);

  const fetchQuizData = async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`/api/summaries/${id}/quiz`);
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || "Failed to fetch quiz data");
      }

      const data = await response.json();
      setSummaryTitle(data.summaryTitle || "");

      const processedQuestions = data.questions.map((q: { question: string; options?: string[]; answer: string }) => ({
        question: q.question,
        options: q.options || [],
        answer: q.answer,
        type: q.options && q.options.length > 0 ? "mcq" : "short",
        selected: "",
        revealed: false,
        correct: undefined,
      }));

      setQuestions(processedQuestions);
      setQuizState("active");
      setShowResults(false);
    } catch (err) {
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuizData();
  }, [id, fetchQuizData]);

  const handleOptionSelect = (questionIndex: number, option: string) => {
    if (quizState === "completed") return;

    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === questionIndex ? { ...q, selected: option } : q,
      ),
    );
  };

  const checkAnswer = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) => {
        if (idx !== questionIndex) return q;

        let isCorrect = false;
        if (q.type === "mcq") {
          const selectedIndex = q.options.findIndex(
            (opt) => opt === q.selected,
          );
          const selectedLetter = String.fromCharCode(65 + selectedIndex);
          isCorrect = selectedLetter === q.answer;
        } else {
          const userAnswer = q.selected.toLowerCase().trim();
          const correctAnswer = q.answer.toLowerCase().trim();
          isCorrect =
            userAnswer.includes(correctAnswer) ||
            correctAnswer.includes(userAnswer);
        }

        return { ...q, correct: isCorrect, revealed: true };
      }),
    );
  };

  const revealAnswer = (questionIndex: number) => {
    setQuestions((prev) =>
      prev.map((q, idx) =>
        idx === questionIndex ? { ...q, revealed: true } : q,
      ),
    );
  };

  const submitQuiz = () => {
    const updatedQuestions = questions.map((q) => {
      if (!q.revealed && q.selected) {
        let isCorrect = false;
        if (q.type === "mcq") {
          const selectedIndex = q.options.findIndex(
            (opt) => opt === q.selected,
          );
          const selectedLetter = String.fromCharCode(65 + selectedIndex);
          isCorrect = selectedLetter === q.answer;
        } else {
          const userAnswer = q.selected.toLowerCase().trim();
          const correctAnswer = q.answer.toLowerCase().trim();
          isCorrect =
            userAnswer.includes(correctAnswer) ||
            correctAnswer.includes(userAnswer);
        }
        return { ...q, correct: isCorrect, revealed: true };
      }
      return q;
    });

    setQuestions(updatedQuestions);

    const finalScore = updatedQuestions.filter(
      (q) => q.correct === true,
    ).length;
    setScore(finalScore);
    setQuizState("completed");
    setShowResults(true);

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const resetQuiz = () => {
    setQuestions((prev) =>
      prev.map((q) => ({
        ...q,
        selected: "",
        revealed: false,
        correct: undefined,
      })),
    );
    setQuizState("active");
    setShowResults(false);
    setScore(0);
  };

  const getScoreColor = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 80) return "text-green-600";
    if (percentage >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreMessage = (score: number, total: number) => {
    const percentage = (score / total) * 100;
    if (percentage >= 90) return "Outstanding! 🌟";
    if (percentage >= 80) return "Great job! 👏";
    if (percentage >= 70) return "Good work! 👍";
    if (percentage >= 60) return "Not bad! 📚";
    return "Keep studying! 💪";
  };

  if (loading) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary" />
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="max-w-3xl mx-auto py-8 px-4">
        <div className="text-center py-12">
          <p className="text-lg text-red-500 mb-4">{error}</p>
          <div className="space-x-4">
            <Button variant="outline" onClick={fetchQuizData}>
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
            <Button asChild variant="ghost">
              <Link href={`/summaries/${id}`}>
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back to Summary
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-8 px-4">
      <div className="mb-6">
        <Button asChild variant="ghost" className="pl-0">
          <Link href={`/summaries/${id}`} className="flex items-center">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Summary
          </Link>
        </Button>
        <h1 className="text-3xl font-bold mt-4">Test Your Knowledge</h1>
        <p className="text-muted-foreground mt-2">
          Quiz for:{" "}
          <span className="font-medium text-primary">{summaryTitle}</span>
        </p>
      </div>

      {showResults && (
        <div className="mb-6 p-6 bg-gradient-to-r from-blue-50 to-purple-50 border border-blue-200 rounded-lg">
          <div className="text-center">
            <Trophy className="w-12 h-12 mx-auto mb-4 text-yellow-500" />
            <h2 className="text-2xl font-bold mb-2">Quiz Complete!</h2>
            <div
              className={`text-4xl font-bold mb-2 ${getScoreColor(
                score,
                questions.length,
              )}`}
            >
              {score}/{questions.length}
            </div>
            <p className="text-lg text-muted-foreground mb-4">
              {getScoreMessage(score, questions.length)}
            </p>
            <div className="space-x-4">
              <Button onClick={resetQuiz} variant="outline">
                <RotateCcw className="w-4 h-4 mr-2" />
                Try Again
              </Button>
              <Button onClick={fetchQuizData} variant="outline">
                <RefreshCw className="w-4 h-4 mr-2" />
                New Questions
              </Button>
            </div>
          </div>
        </div>
      )}

      {questions.length === 0 ? (
        <div className="text-center py-12">
          <p className="text-lg text-muted-foreground mb-4">
            No questions available.
          </p>
          <Button onClick={fetchQuizData} variant="outline">
            <RefreshCw className="w-4 h-4 mr-2" />
            Generate Questions
          </Button>
        </div>
      ) : (
        <div className="space-y-6">
          {questions.map((q, index) => (
            <div
              key={index}
              className={`border rounded-lg overflow-hidden transition-colors ${
                q.revealed
                  ? q.correct
                    ? "bg-green-50 border-green-200"
                    : "bg-red-50 border-red-200"
                  : "bg-card"
              }`}
            >
              <div className="p-6">
                <div className="flex items-start">
                  <div className="flex items-center justify-center bg-primary/10 text-primary rounded-full w-8 h-8 mr-4 flex-shrink-0">
                    {index + 1}
                  </div>
                  <div className="flex-1">
                    <h2 className="text-lg font-semibold mb-4">{q.question}</h2>

                    {q.type === "mcq" ? (
                      <div className="space-y-3">
                        {q.options.map((opt, i) => {
                          const isSelected = q.selected === opt;
                          const correctLetter = q.answer;
                          const isCorrectAnswer =
                            String.fromCharCode(65 + i) === correctLetter;
                          const isRevealed = q.revealed;

                          return (
                            <div key={i} className="flex items-center">
                              <input
                                type="radio"
                                id={`q${index}-opt${i}`}
                                name={`q${index}`}
                                className="peer hidden"
                                checked={isSelected}
                                onChange={() => handleOptionSelect(index, opt)}
                                disabled={quizState === "completed"}
                              />
                              <label
                                htmlFor={`q${index}-opt${i}`}
                                className={`flex-1 p-3 border rounded-lg cursor-pointer transition-colors ${
                                  quizState === "completed"
                                    ? "cursor-not-allowed"
                                    : ""
                                } ${
                                  isSelected
                                    ? "border-primary bg-primary/5"
                                    : "border-muted hover:border-primary/50"
                                } ${
                                  isRevealed && isCorrectAnswer
                                    ? "bg-green-100 border-green-300"
                                    : ""
                                } ${
                                  isRevealed &&
                                  isSelected &&
                                  !isCorrectAnswer
                                    ? "bg-red-100 border-red-300"
                                    : ""
                                }`}
                              >
                                <span className="font-medium text-primary mr-2">
                                  {String.fromCharCode(65 + i)})
                                </span>
                                {opt}
                                {isRevealed && isCorrectAnswer && (
                                  <Check className="w-4 h-4 ml-auto text-green-600" />
                                )}
                                {isRevealed &&
                                  isSelected &&
                                  !isCorrectAnswer && (
                                    <X className="w-4 h-4 ml-auto text-red-600" />
                                  )}
                              </label>
                            </div>
                          );
                        })}
                      </div>
                    ) : (
                      <div className="space-y-4">
                        <textarea
                          value={q.selected}
                          onChange={(e) =>
                            handleOptionSelect(index, e.target.value)
                          }
                          placeholder="Type your answer here..."
                          className="w-full p-3 border rounded-lg focus:ring-2 focus:ring-primary/50 focus:border-primary"
                          rows={3}
                          disabled={quizState === "completed"}
                        />
                        {q.revealed && (
                          <div className="p-3 bg-secondary rounded-lg">
                            <p className="font-medium mb-1">Correct answer:</p>
                            <p>{q.answer}</p>
                          </div>
                        )}
                      </div>
                    )}

                    {quizState === "active" && (
                      <div className="mt-4 flex justify-end space-x-3">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => checkAnswer(index)}
                          disabled={!q.selected || q.revealed}
                        >
                          <Check className="w-4 h-4 mr-2 text-green-500" />
                          Check Answer
                        </Button>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => revealAnswer(index)}
                          disabled={q.revealed}
                        >
                          <X className="w-4 h-4 mr-2 text-red-500" />
                          Reveal Answer
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))}

          {quizState === "active" && (
            <div className="flex justify-between mt-8">
              <Button
                variant="outline"
                onClick={() =>
                  window.scrollTo({ top: 0, behavior: "smooth" })
                }
              >
                Back to Top
              </Button>
              <Button onClick={submitQuiz}>
                <Trophy className="w-4 h-4 mr-2" />
                Submit Quiz
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}