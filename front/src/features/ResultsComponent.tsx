
import { Place } from '../models/Place'
import { MapContainer, Marker, Popup, TileLayer, ZoomControl } from 'react-leaflet';
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";
import PlaceCard from '../components/PlaceCard';
import React, { useRef, useState } from 'react';

const blueIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});
const redIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-red.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props{
    results: Place[];
    onGoBack: () => void;
}

export default function ResultsComponent({results, onGoBack}: Props) {

    const mapRef = useRef<L.Map | null>(null);
    const [selectedPlaceIndex, setSelectedPlaceIndex] = useState<number>(-1)
    const markersRef = useRef<{ [key: string]: L.Marker }>({});
    const [hideResults, setHideResults] = useState<boolean>(false);

    const handleToggle = () => {
        setHideResults(!hideResults);
    };

    return (
        <div className='h-full w-full flex flex-col-reverse lg:flex-row bg-slate-950/80'>
            
            <div className="h-1/2 lg:h-full flex grow">
                <MapContainer center={[results[0].latitude, results[0].longitude]} zoom={10} zoomControl={false}
                className='w-full h-full'
                ref={mapRef}>
                    <ZoomControl position="bottomright" />
                    <div className="absolute top-0 left-0 flex flex-col gap-2 p-4 z-1000 m-4 rounded-lg backdrop-blur-lg shadow-lg border border-white/50">
                        <button
                        className="
                            text-lg cursor-pointer px-4 py-2 rounded-lg bg-gray-800 text-gray-100 
                            border border-gray-700 shadow-sm
                            hover:bg-gray-700 hover:shadow-md 
                            transition-all duration-200
                            focus:outline-none focus:ring-2 focus:ring-blue-300
                        "
                        onClick={onGoBack}
                        >
                        Back to Search
                        </button>
                        <button
                            onClick={handleToggle}
                            className="px-4 flex cursor-pointer justify-center transition-all bg-slate-700/10 hover:bg-slate-700/80 rounded-lg"
                        >
                            {hideResults ? 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                            : 
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                                <path strokeLinecap="round" strokeLinejoin="round" d="m4.5 15.75 7.5-7.5 7.5 7.5" />
                            </svg>
                            }
                        </button>
                        <div className={`flex flex-col gap-2 px-1 transition-all duration-300 overflow-hidden ${hideResults ? 'max-h-0 py-0' : 'max-h-96 py-1'}`}>

                        {
                            results.map((place, index) => (
                                <PlaceCard place={place} mapRef={mapRef} selected={selectedPlaceIndex == index} key={"place_" + index} disabled={hideResults}
                                onClick={() => {setSelectedPlaceIndex(index);
                                    const marker = markersRef.current[index];
                                    if (marker) marker.openPopup();
                                }} />
                            ))
                        }
                        </div>
                    </div>
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                    />
                    {
                        results.map((place, index) => (
                            <Marker
                            position={[place.latitude, place.longitude]}
                            icon={selectedPlaceIndex == index ? redIcon : blueIcon}
                            key={'marker_' + index}
                            ref={(el) => {
                                if (el){
                                    markersRef.current[index] = el;
                                }
                            }}
                            eventHandlers={{
                                click: () => {setSelectedPlaceIndex(index)}
                            }}>
                                <Popup autoPan={true} autoPanPaddingTopLeft={[0, 200]}>
                                    <div className='flex flex-col gap-4'>
                                        <h1 className='text-center text-4xl font-semibold'>{place.name}</h1>
                                        <div className='text-lg'>{place.description}</div>
                                    </div>
                                </Popup>
                            </Marker>
                        ))
                    }
                </MapContainer>
            </div>
        </div>
    );  
}