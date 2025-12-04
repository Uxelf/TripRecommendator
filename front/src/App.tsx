import { useState } from 'react'
import './App.css'
import BackgroundSwitcher from './features/Background';
import type { Place } from './models/Place';
import SearchComponent from './features/SearchComponent';
import ResultsComponent from './features/ResultsComponent';
import "leaflet/dist/leaflet.css";

function App() {

  type SearchStatus = "idle" | "loading" | "error" | "success";

  const [status, setStatus] = useState<SearchStatus>("idle");
  const [results, setResults] = useState<Place[]>([]);
  const [error, setError] = useState<string | null>(null);

  const handleSearch = async (query: string) => {
    setStatus("loading");
    setError(null);

    try{
      const res = await fetch('/api/search', {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ query })
      });

      if (!res.ok) throw new Error("Error while searching, try again");

      const data = await res.json();
      setResults(data.places);
      setStatus("success");
    }
    catch (err: any){
      setStatus("error");
      setError(err.message || "Error");

      setResults([{name: "Lugar", description: "Descripcion", longitude: 4, latitude: 5}])
    }
  }

  return (
    <div className="relative h-dvh w-dvw flex">
      <BackgroundSwitcher/>
      { results.length == 0 &&
        <SearchComponent
          onSearch={handleSearch}
          status={status}
          error={error}
        />
      }
      { results.length != 0 &&
        <ResultsComponent results={results}/>
      }
    </div>
  );

}

export default App
