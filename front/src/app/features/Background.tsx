import { useState, useEffect, useRef } from "react";

const backgrounds = [
  "/places/bridge.jpg",
  "/places/london.jpg",
  "/places/river.jpg",
  "/places/tower.jpg",
  "/places/tower2.jpg",
];


function BackgroundSwitcher(){
    const intervalMs = 10 * 1000;
    const [currentBg, setCurrentBg] = useState(0);
    const [nextBg, setNextBg] = useState<number>(0);
    const [fade, setFade] = useState(false);

    const intervalRef = useRef<NodeJS.Timeout | null>(null);
    const timeoutRef = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        intervalRef.current = setInterval(() => {
        setFade(true);

        timeoutRef.current = setTimeout(() => {
            setCurrentBg(nextBg);
            setFade(false);
        }, 1000);

        const swapTimeout = setTimeout(() => {
            setNextBg((prev) => (prev + 1) % backgrounds.length);
        }, 2000);
        }, intervalMs);

        return () => {
        if (intervalRef.current) clearInterval(intervalRef.current);
        if (timeoutRef.current) clearTimeout(timeoutRef.current);
        };
    }, [intervalMs, nextBg]);

    return (
        <div className="h-screen w-screen absolute -z-10 top-0 left-0 overflow-hidden blur-xs opacity-80">
            <div
                className="h-full w-full bg-cover bg-center absolute top-0 left-0 opacity-100"
                style={{ backgroundImage: `url(${backgrounds[currentBg]})` }}
            />
            <div
            className={`h-full w-full bg-cover bg-center absolute top-0 left-0 transition-opacity duration-1000 ${
                !fade ? "opacity-0" : "opacity-100"
            }`}
            style={{ backgroundImage: `url(${backgrounds[nextBg]})` }}
            />
        
            
        </div>
    );
};

export default BackgroundSwitcher;