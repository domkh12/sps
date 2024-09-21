import React, {
  useEffect,
  useRef,
  useState,
  useMemo,
  useCallback,
} from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { Card, Progress } from "flowbite-react";

// Fix for default marker icon
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconUrl: "/icons/location.svg",
  shadowUrl: "/icons/locationShadow.svg",
});

// Sample parking data - replace with your actual data 11.598031, 104.801788
const parkingData = [
  {
    id: 1,
    name: "A",
    lat: 11.597271,
    lng: 104.801816,
    availableSpaces: 3,
    totalSpaces: 20,
  },
  {
    id: 2,
    name: "B",
    lat: 11.598031,
    lng: 104.801788,
    availableSpaces: 50,
    totalSpaces: 100,
  },
];

function ParkingMarker({ facility }) {
  return (
    <Marker position={[facility.lat, facility.lng]}>
      <Popup minWidth={90}>
        <div>
          <h3>{facility.name}</h3>
          <p>Available spaces: {facility.availableSpaces}</p>
          <p>Total spaces: {facility.totalSpaces}</p>
          <p>
            Occupancy rate:{" "}
            {(
              ((facility.totalSpaces - facility.availableSpaces) /
                facility.totalSpaces) *
              100
            ).toFixed(2)}
            %
          </p>
        </div>
      </Popup>
    </Marker>
  );
}

function ParkingMap() {
  const [parkingFacilities, setParkingFacilities] = useState([]);
  const mapRef = useRef(null);

  useEffect(() => {
    // In a real application, you would fetch this data from an API
    setParkingFacilities(parkingData);
  }, []);

  useEffect(() => {
    if (mapRef.current) {
      const map = mapRef.current;
      const [facility] = parkingFacilities;
      if (facility) {
        map.setView([facility.lat, facility.lng], 15);
      }
    }
  }, [parkingFacilities]);

  return (
    <Card className="h-[700px]">
      <MapContainer
        center={[11.59719058759501, 104.8018407262788]}
        zoom={15}
        scrollWheelZoom={true}
        style={{ height: "100%", width: "100%" }}
        ref={mapRef}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {parkingFacilities.map((facility) => (
          <ParkingMarker key={facility.id} facility={facility} />
        ))}
      </MapContainer>
      <div className="mt-4">
        {parkingFacilities.map((facility) => (
          <div key={facility.id} className="mb-2 dark:text-gray-200">
            <div className="flex justify-between mb-1">
              <span>{facility.name}</span>
              <span>
                {facility.availableSpaces} / {facility.totalSpaces}
              </span>
            </div>
            <Progress
              progressLabelPosition="inside"
              progress={(facility.availableSpaces / facility.totalSpaces) * 100}
              color={facility.availableSpaces >= 4 ? "blue" : "red"}
              size="lg"
            />
          </div>
        ))}
      </div>
    </Card>
  );
}

export default ParkingMap;
