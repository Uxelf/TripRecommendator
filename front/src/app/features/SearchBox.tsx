"use client";
import { useRef } from "react";

interface SearchBoxProps {
  searchText: string;
  setSearchText: (text: string) => void;
  onSearch: () => void;
}

const SearchBox: React.FC<SearchBoxProps> = ({
  searchText,
  setSearchText,
  onSearch,
}) => {
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  const handleChange = (event: React.ChangeEvent<HTMLTextAreaElement>) => {
    setSearchText(event.target.value);

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
      onSearch();
    }
  };

  return (
    <div className="w-full p-8 max-w-4xl my-auto">
      <textarea
        ref={textareaRef}
        value={searchText}
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

export default SearchBox;
