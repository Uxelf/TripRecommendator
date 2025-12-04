"use client";
import { useRef, useState } from "react";

interface Props {
  onSearch: (query: string) => void;
  status: "idle" | "loading" | "error" | "success";
  error: string | null;
}

export default function SearchComponent({ onSearch, status, error }: Props) {
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
    const maxHeight = 4 * 24; // 4 líneas aprox
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
  };

  return (
    <div className="w-full p-8 max-w-4xl m-auto flex flex-col">
      { status == "idle" &&
        <h1 className="text-4xl mb-4 text-center text-white">Find now your perfect place</h1>
      }
      { status == "loading" && 
        <h1 className="text-4xl mb-4 text-center text-gray-400">Searching, like a lot</h1>
      }
      {
        status == "error" &&
        <h1 className="text-4xl mb-4 text-center text-red-400">{error}</h1>
      }
      <textarea
        disabled={status === "loading"}
        ref={textareaRef}
        value={text}
        placeholder="Where 2 go?"
        onChange={handleChange}
        onKeyDown={handleKeyDown}
        className={`w-full bg-white rounded-2xl text-black placeholder:text-gray-400
          resize-none overflow-y-auto p-4 leading-6`}
        rows={1}
      />
    </div>
  );
};
