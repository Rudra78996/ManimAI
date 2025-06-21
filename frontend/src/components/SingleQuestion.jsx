import React, { useState } from "react";
import { Plus, Minus } from "lucide-react";

const SingleQuestion = ({ question, answer }) => {
  const [open, setOpen] = useState(false);

  return (
    <div className="w-full rounded-2xl border border-border bg-background transition-all hover:shadow-md overflow-hidden">
      <button
        onClick={() => setOpen(!open)}
        className="w-full flex items-center justify-between gap-4 px-6 py-4 sm:px-8 sm:py-5 text-left"
      >
        <span className="text-base sm:text-lg font-medium text-foreground break-words">
          {question}
        </span>
        <span className="flex-shrink-0">
          {open ? (
            <Minus className="w-5 h-5 text-muted-foreground" />
          ) : (
            <Plus className="w-5 h-5 text-muted-foreground" />
          )}
        </span>
      </button>

      {open && (
        <div className="px-6 sm:px-8 pb-5 sm:pb-6 border-t border-border">
          <p className="text-sm text-muted-foreground leading-relaxed break-words whitespace-pre-wrap">
            {answer}
          </p>
        </div>
      )}
    </div>
  );
};

export default SingleQuestion;
