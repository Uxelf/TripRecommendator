"use client";
import { useState } from "react";
import BackgroundSwitcher from "./features/Background";
import SearchBox from "./features/SearchBox";

export default function Home() {
  const [searchText, setSearchText] = useState<string>("");

  const SearchPlace = () => {
    console.log("A buscar", searchText);
  };

  return (
    <div className="relative h-dvh w-dvw">
      <BackgroundSwitcher/>
      <SearchBox
        searchText={searchText}
        setSearchText={setSearchText}
        onSearch={SearchPlace}
      />
    </div>
  );
}
