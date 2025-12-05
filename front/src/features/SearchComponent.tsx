"use client";
import { useRef, useState } from "react";

interface Props {
  onSearch: (query: string) => void;
  onTypingAfterError: () => void;
  status: "idle" | "loading" | "error" | "success";
  error: string | null;
}

export default function SearchComponent({ onSearch, onTypingAfterError, status, error }: Props) {
  const [text, setText] = useState("");

  const handleSubmit = () => {
    if (text.trim() !== "") onSearch(text);
  };

  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setText(event.target.value);

    const textarea = textareaRef.current;
    if (!textarea) return;

    textarea.style.height = "auto";
    const maxHeight = 4 * 24;
    textarea.style.height =
      textarea.scrollHeight > maxHeight
        ? `${maxHeight}px`
        : `${textarea.scrollHeight}px`;
  };

  const handleKeyDown = (event: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (event.key === "Enter") {
      event.preventDefault();
      handleSubmit();
    }
    else if (status == "error"){
      onTypingAfterError();
    }
  };

  return (
    <div className="w-full p-8 max-w-4xl m-auto flex flex-col ">    
      <div className="w-full p-8 flex flex-col gap-12 bg-black/30 rounded-lg backdrop-blur-lg shadow-md border border-white/50">
        <div className="flex relative">
          <h1
            className={`text-6xl text-center text-shadow-lg w-full text-white transition-all duration-200 ease-in-out overflow-hidden 
              ${status === "idle" ? "opacity-100" : "opacity-0"}`}
          >
            Find now your perfect place
          </h1>
          <div
            className={`flex flex-col-reverse md:flex-row gap-4 items-center justify-center text-6xl text-shadow-lg text-white absolute top-0 left-0 w-full h-full
              ${status === "loading" ? "text-appear" : "text-disappear"}`}
          >
            <svg className="animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" width="1em" height="1em"
            >
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
            <h1>Searching</h1>
          </div>
          <div
            className={`flex items-center justify-center text-6xl text-center text-shadow-lg text-rose-500 absolute top-0 left-0 w-full h-full
              ${status === "error" ? "text-appear" : "text-disappear"}`}
          >
            <h1>{error}</h1>
          </div>
        </div>

        <textarea
          disabled={status === "loading"}
          ref={textareaRef}
          value={text}
          placeholder="Describe what you are looking for"
          onChange={handleChange}
          onKeyDown={handleKeyDown}
          className={`w-full bg-white rounded-2xl text-black placeholder:text-gray-400
            resize-none overflow-y-auto p-4 leading-6 disabled:bg-slate-400`}
          rows={1}
        />
      </div>
    </div>
  );
}
