import { type RefObject } from 'react';
import type { Place } from '../models/Place'
import type { ZoomPanOptions } from 'leaflet';

interface Props{
    place: Place,
    mapRef: RefObject<L.Map | null>,
    onClick: () => void;
    selected: boolean;
    disabled: boolean;
}

export default function PlaceCard({place, mapRef, onClick, selected, disabled}: Props) {

    const options: ZoomPanOptions = {duration: 1.5}
    const goToPlace = () => {
        if (mapRef.current == null)
            return;
        /* const panelHeight = document.getElementById("places_panel")?.offsetHeight ?? 0;
        const offset = mapRef.current.containerPointToLatLng([0, panelHeight]).lat -
                 mapRef.current.containerPointToLatLng([0, 0]).lat; */
        mapRef.current.flyTo([place.latitude + 0.2, place.longitude], 10, options);
        onClick();
    }

    return (
        <button
          className={`
            cursor-pointer px-4 py-2 rounded-lg text-lg font-medium
            transition-colors duration-200 
            ${selected ? 'bg-blue-100 text-blue-800' : 'bg-gray-50 text-gray-800 hover:bg-gray-200'}
            shadow-sm
            focus:outline-none focus:ring-2 focus:ring-blue-800
          `}
          disabled={disabled}
          onClick={goToPlace}
        >
          {place.name}
        </button>
    )
}

