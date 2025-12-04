
import { Place } from '../models/Place'
import { MapContainer, Marker, Popup, TileLayer } from 'react-leaflet';
import L from "leaflet";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

const greenIcon = new L.Icon({
  iconUrl:
    "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: markerShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

interface Props{
    results: Place[];
}

export default function ResultsComponent({results}: Props) {
    return (
        <div className='h-full w-full flex flex-col-reverse lg:flex-row bg-slate-950/80'>
            <div className="h-1/2 lg:h-full w-full lg:w-sm bg-rose-400">
                <button>Search again</button>
            </div>
            <div className="h-1/2 lg:h-full flex grow">
                <MapContainer center={[40.4168, -3.7038]} zoom={13}
                className='w-full h-full'>
                    <TileLayer
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    attribution="&copy; OpenStreetMap contributors"
                    />
                    <Marker
                    position={[40.4168, -3.7038]}
                    icon={greenIcon}>
                        <Popup>You</Popup>
                    </Marker>
                </MapContainer>
            </div>
        </div>
    );  
}