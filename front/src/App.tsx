import { useState } from "react";
import "./App.css";
import BackgroundSwitcher from "./features/Background";
import type { Place } from "./models/Place";
import SearchComponent from "./features/SearchComponent";
import ResultsComponent from "./features/ResultsComponent";
import "leaflet/dist/leaflet.css";

function App() {
  type SearchStatus = "idle" | "loading" | "error" | "success";

  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setStatus("loading");
    setError(null);

    try {
      const res = await fetch(
        `${window.location.protocol}//${window.location.hostname}:3000/api/search`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ prompt: query }),
        }
      );

      if (!res.ok) throw new Error("Error, try again");

      const data = await res.json();
      setResults(data.results);
      setStatus("success");
    } catch (err: any) {
      setStatus("error");
      setError(err.message || "Error");
    }
  };

  const handleTypingAfterError = () => {
    setStatus("idle");
  };

  const handleSearchAgain = () => {
    setResults([]);
    setStatus("idle");
  };

  return (
    <div className="relative h-dvh w-dvw overflow-hidden">
      <BackgroundSwitcher />
      
        <div
          className={`
            h-dvh w-dvw flex absolute inset-0 transition-transform duration-500 
            ${results.length === 0 ? "translate-x-0" : "-translate-x-full"} 
            ${results.length === 0 ? "pointer-events-auto" : "pointer-events-none"}
          `}
          aria-hidden={results.length !== 0}
        >
          <SearchComponent
            onSearch={handleSearch}
            onTypingAfterError={handleTypingAfterError}
            status={status}
            error={error}
            />
            </div>
    
      
        <div
          className={`
            h-dvh w-dvw flex  absolute inset-0 transition-transform duration-500 
            ${results.length !== 0 ? "translate-x-0" : "translate-x-full"} 
            ${results.length !== 0 ? "pointer-events-auto" : "pointer-events-none"}
          `}
          aria-hidden={results.length === 0}
        >
          <ResultsComponent results={results} onGoBack={handleSearchAgain} />
        </div>
      
    </div>
  );
}

export default App;
