import { useState, useEffect, useRef } from "react";

const backgrounds = [
  "/places/bridge.jpg",
  "/places/london.jpg",
  "/places/river.jpg",
  "/places/tower.jpg",
  "/places/tower2.jpg",
];


function BackgroundSwitcher(){
    const intervalMs = 4 * 1000;
    const [currentBg, setCurrentBg] = useState(0);
    const [nextBg, setNextBg] = useState<number>(0);
    const [fade, setFade] = useState(false);


    useEffect(() => {
        const intervalId = setInterval(() => {
            setFade(true);

            const timeout1 = setTimeout(() => {
            setCurrentBg(nextBg); // ⚡ correcto
            setFade(false);
            }, 1000);

            const timeout2 = setTimeout(() => {
            setNextBg(prev => (prev + 1) % backgrounds.length); // ⚡ nunca se queda viejo
            }, 2000);

            return () => {
            clearTimeout(timeout1);
            clearTimeout(timeout2);
            };
        }, intervalMs);

        return () => clearInterval(intervalId);
    }, [nextBg]);

    return (
        <div className="h-dvh w-dvw absolute -z-10 top-0 left-0 overflow-hidden blur-xs opacity-80">
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