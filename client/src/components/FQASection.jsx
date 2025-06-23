import React from "react";
import { ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";

const FQASection = () => {
  const questions = [
    {
      question: "What is ManimAI",
      answer:
        "ManimAI is an AI-powered tool that turns text prompts into animated math visualizations using the Manim engine.",
    },
    {
      question: "How does ManimAI work?",
      answer:
        "You type a math prompt, AI converts it into a Manim script, and the animation is rendered automatically.",
    },
    {
      question: "Is ManimAI free to use?",
      answer:
        "Yes, it's currently free for personal and educational use. Premium plans may come later.",
    },
    {
      question: "What are the use cases for ManimAI?",
      answer:
        "It's useful for students, teachers, content creators, and developers needing math animations.",
    },
    {
      question: "Can I use ManimAI for commercial projects?",
      answer:
        "Yes, you can use it commercially — just follow the licensing terms.",
    },
  ];

  const [activeIndex, setActiveIndex] = React.useState(null);

  const toggleQuestion = (index) => {
    setActiveIndex(activeIndex === index ? null : index);
  };

  return (
    <div className="w-full max-w-4xl mx-auto mt-24 px-4">
      <div className="text-center mb-8">
        <h2 className="text-3xl font-medium text-gray-900 dark:text-gray-50 sm:text-4xl">
          Frequently asked questions
        </h2>
        <p className="mt-2 mb-10 text-lg text-gray-600 dark:text-gray-300">
          Can't find the answer? Reach out to our support team.
        </p>
      </div>

      <div className="space-y-4">
        {questions.map((item, index) => (
          <div
            key={index}
            className="rounded-lg bg-white dark:bg-slate-900 border border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <button
              className="flex w-full items-center justify-between p-3 text-left hover:bg-gray-50 dark:hover:bg-slate-800 transition-colors cursor-pointer"
              onClick={() => toggleQuestion(index)}
            >
              <h3 className="text-base font-medium text-gray-900 dark:text-gray-50 sm:text-lg">
                {item.question}
              </h3>
              <ChevronDown
                className={`h-4 w-4 text-gray-500 transition-transform duration-200 ${
                  activeIndex === index ? "rotate-180" : ""
                }`}
              />
            </button>
            <div
              className={`px-3 pb-3 transition-all duration-200 ${
                activeIndex === index
                  ? "opacity-100 max-h-[500px]"
                  : "opacity-0 max-h-0 overflow-hidden"
              }`}
            >
              <p className="text-sm text-gray-600 dark:text-gray-300 sm:text-base">
                {item.answer}
              </p>
            </div>
          </div>
        ))}
      </div>

      <div className="mt-8 text-center">
        <p className="mb-4 text-gray-600 dark:text-gray-300">
          Still have questions?
        </p>
        <Button className="h-9 px-5 text-base">Contact Support</Button>
      </div>
    </div>
  );
};

export default FQASection;
