import { GoogleMap, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import redbull from '../assets/images/redbull.png';
import fbapp from "../firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";


const master={
    lat:10.8788310,
    lng:76.9065511
}

var RADIUS=200; //in meters

const Map = (props) => {
    const [markers, setMarkers] = useState([]);
    const { isLoaded } = props;
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [showMarkersInsideCircle, setShowMarkersInsideCircle] = useState(false);
    const handleMasterMarkerClick = () => {
        setShowMarkersInsideCircle(true);
        setSelectedMarker(null);
    };
    const containerStyle = {
        width: '100vw',
        height: '50vw'
    };


    const database = getDatabase(fbapp);



    useEffect(() => {
        const usersRef = ref(database, 'Users');
        onValue(usersRef, (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const dataArray = Object.values(data);
                const transformedData = dataArray.map((user) => ({
                    name: user.userName,
                    location: {
                        lat: parseFloat(user.loc.split(',')[0]), // Extracting lat from loc
                        lng: parseFloat(user.loc.split(',')[1]), // Extracting lng from loc
                    },
                }));

                setMarkers(transformedData);
            }
        });
        const onDataChange = (snapshot) => {
            const data = snapshot.val();
            if (data) {
                const dataArray = Object.values(data);
                const transformedData = dataArray.map((user) => ({
                    name: user.userName,
                    location: {
                        lat: parseFloat(user.loc.split(',')[0]), // Extracting lat from loc
                        lng: parseFloat(user.loc.split(',')[1]), // Extracting lng from loc
                    },
                }));

                setMarkers(transformedData);
            }
        };
        onValue(usersRef, onDataChange);


    }, []);


    const handleMarkerClick = (marker) => {
        setSelectedMarker(marker);
    };
    const handleCloseClick = () => {
        setSelectedMarker(null);
    };

   


    //calculating marker inside the circle
    const markersInsideCircle = markers.filter((marker) => {
        const distance = getDistance(master.lat, master.lng, marker.location.lat, marker.location.lng);
        return distance <= RADIUS;
    });

    function getDistance(lat1, lon1, lat2, lon2) {
        const R = 6371e3; // Earth radius in meters
        const φ1 = (lat1 * Math.PI) / 180;
        const φ2 = (lat2 * Math.PI) / 180;
        const Δφ = ((lat2 - lat1) * Math.PI) / 180;
        const Δλ = ((lon2 - lon1) * Math.PI) / 180;

        const a =
            Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
            Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
        const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

        const distance = R * c;
        return distance; // Distance in meters
    }

    return isLoaded && (
        <GoogleMap mapContainerStyle={containerStyle} center={master} zoom={16}>
            <Marker position={master} onClick={handleMasterMarkerClick}/>
            <Circle
                center={master}
                radius={RADIUS}
                options={{
                    strokeColor: "#FF0000",
                    strokeOpacity: 0.8,
                    strokeWeight: 2,
                    fillColor: "#FF0000",
                    fillOpacity: 0.35,
                }}
            />
            {markers.map((marker) => {
                return (
                    <div key={marker.name}>
                        <Marker position={marker.location}
                            onClick={() => handleMarkerClick(marker)}
                            icon={{
                                url: redbull,
                                scaledSize: new window.google.maps.Size(50, 50)
                            }}
                        />
                        {selectedMarker === marker && (
                            <InfoWindow
                                onCloseClick={handleCloseClick}
                                position={marker.location}
                            >
                                <div>
                                <div>🐂{marker.name}</div>
                                <div>📍{marker.location.lat},{marker.location.lng}</div>    
                                </div>
                            </InfoWindow>
                        )}
                    </div>
                )
            })}
             {showMarkersInsideCircle && (
                <InfoWindow
                    onCloseClick={() => setShowMarkersInsideCircle(false)}
                    position={master}
                >
                    <div>
                        <div>Total Bulls: {markers.length}</div>
                        <div>No.of Bull(s) inside: {markersInsideCircle.length}</div>
                        {markersInsideCircle.map((marker) => (
                            <div key={marker.name}>🐂 {marker.name}</div>
                        ))}
                    </div>
                </InfoWindow>
            )}
        </GoogleMap>
    )
};

export default Map;