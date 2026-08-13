import { useState, useEffect, useRef } from 'react';
import { MapContainer, TileLayer, Marker, Circle, useMapEvents } from 'react-leaflet';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix default marker icon in Leaflet
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;

export default function MapPicker({ latitude, longitude, radius, onLocationChange, onRadiusChange }) {
    const [position, setPosition] = useState(latitude && longitude ? [latitude, longitude] : [14.599512, 120.984219]); // Default to Manila
    const [radiusValue, setRadiusValue] = useState(radius || 100);
    const mapRef = useRef();

    // Update position when props change (edit mode)
    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    // Update radius when prop changes
    useEffect(() => {
        if (radius) {
            setRadiusValue(radius);
        }
    }, [radius]);

    // Component to handle map click and set marker
    function LocationMarker() {
        useMapEvents({
            click(e) {
                const newPos = [e.latlng.lat, e.latlng.lng];
                setPosition(newPos);
                if (onLocationChange) {
                    onLocationChange(e.latlng.lat, e.latlng.lng);
                }
            },
        });

        return position ? (
            <Marker
                position={position}
                draggable={true}
                eventHandlers={{
                    dragend(e) {
                        const marker = e.target;
                        const newPos = [marker.getLatLng().lat, marker.getLatLng().lng];
                        setPosition(newPos);
                        if (onLocationChange) {
                            onLocationChange(newPos[0], newPos[1]);
                        }
                    },
                }}
            />
        ) : null;
    }

    // Handle radius slider change
    const handleRadiusChange = (e) => {
        const val = parseInt(e.target.value);
        setRadiusValue(val);
        if (onRadiusChange) {
            onRadiusChange(val);
        }
    };

    return (
        <div className="space-y-4">
            <div className="h-96 w-full rounded-lg overflow-hidden border border-gray-200">
                <MapContainer
                    center={position}
                    zoom={16}
                    style={{ height: '100%', width: '100%' }}
                    ref={mapRef}
                >
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker />
                    {position && (
                        <Circle
                            center={position}
                            radius={radiusValue}
                            pathOptions={{
                                fillColor: 'blue',
                                fillOpacity: 0.1,
                                color: 'blue',
                                weight: 2,
                                dashArray: '5, 5',
                            }}
                        />
                    )}
                </MapContainer>
            </div>
            <div className="flex items-center gap-4">
                <label className="text-sm font-medium text-gray-700">Radius: {radiusValue} meters</label>
                <input
                    type="range"
                    min="10"
                    max="500"
                    step="10"
                    value={radiusValue}
                    onChange={handleRadiusChange}
                    className="flex-1"
                />
            </div>
            <div className="text-xs text-gray-500">
                Click on the map to set the department location. Drag the marker to adjust. Use the slider to set the allowed radius.
            </div>
        </div>
    );
}
