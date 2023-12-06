import { GoogleMap, Marker, InfoWindow, Circle } from "@react-google-maps/api";
import redbull from "../assets/images/stud.png";
import fbapp from "../firebase";
import { getDatabase, ref, onValue } from "firebase/database";
import { useEffect, useState } from "react";
import './Map.css';
// import axios from "axios";

// const master = {
//   lat: 10.9064173,
//   lng: 76.8973394,
// };


//var RADIUS = 100; //in meters

const Map = (props) => {
  const [markers, setMarkers] = useState([]);
  const { isLoaded } = props;
  const [master, setMaster] = useState({ lat: 10.9064173, lng: 76.8973394 });
  const [selectedMarker, setSelectedMarker] = useState(null);
  const [showMarkersInsideCircle, setShowMarkersInsideCircle] = useState(false);
  const [RADIUS, setRADIUS] = useState(100);
  const handleMasterMarkerClick = () => {
    setShowMarkersInsideCircle(true);
    setSelectedMarker(null);
  };
  const containerStyle = {
    width: "100vw",
    height: "50vw",
  };

  const database = getDatabase(fbapp);


  const handleMasterChange = () => {
    const lat = parseFloat(document.getElementById("latitude").value);
    const lng = parseFloat(document.getElementById("longitude").value);
    setMaster({ lat, lng });
    setRADIUS(parseFloat(document.getElementById("radius").value));
  };

    


  useEffect(() => {
    const usersRef = ref(database, "Users");
    onValue(usersRef, (snapshot) => {
      const data = snapshot.val();
      if (data) {
        const dataArray = Object.values(data);
        const transformedData = dataArray.map((user) => ({
          name: user.userName,
          location: {
            lat: parseFloat(user.loc.split(",")[0]), // Extracting lat from loc
            lng: parseFloat(user.loc.split(",")[1]), // Extracting lng from loc
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
            lat: parseFloat(user.loc.split(",")[0]), // Extracting lat from loc
            lng: parseFloat(user.loc.split(",")[1]), // Extracting lng from loc
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
    const distance = getDistance(
      master.lat,
      master.lng,
      marker.location.lat,
      marker.location.lng
    );
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
//   async function sendMessageToUser(token, title, body) {
//     //add code to send message to token
//     //api call to send message through https://fcm.googleapis.com/fcm/send
//     const response=await axios.post(
//       "https://fcm.googleapis.com/fcm/send",
//       {
//         to: token,
//         notification: {
//           title: title,
//           body: body,
//         },
//       },
//       {
//         headers: {
//           "Content-Type": "application/json",
//           "Authorization":"key=BEG28Eq9timrTUcU28VEiMmxvs1-FP2pk_ZAjCBhB5oEBbxgRO-dIaNwTvB4Su_l4mgv0VHVkWN7BsSO1x1V47Y"
//           // Add any other headers if needed
//         },
//       }
//     );
//     console.log(response);
//   }

  return (
    isLoaded && (
      <div>
      <div className="input-container">
  <div>
    <div>
      <label htmlFor="latitude">Latitude:</label>
      <input type="text" id="latitude" value={master.lat} />
    </div>
    <div>
      <label htmlFor="longitude">Longitude:</label>
      <input type="text" id="longitude" value={master.lng} />
    </div>
  </div>
  <div>
    <div>
      <label htmlFor="radius">Radius:</label>
      <input type="number" id="radius" value={RADIUS} />
    </div>
    <button onClick={handleMasterChange}>Set Class Location</button>
  </div>
</div>


        <GoogleMap mapContainerStyle={containerStyle} center={master} zoom={16}>
        <Circle
          center={master}
          radius={RADIUS}
          options={{
            strokeColor: "#FF0000",
            strokeOpacity: 0.8,
            strokeWeight: 2,
            fillColor: "#FF0000",
            fillOpacity: 0.05,
          }}
        />
        {markers.map((marker) => {
          return (
            <div key={marker.name}>
              <Marker
                position={marker.location}
                onClick={() => handleMarkerClick(marker)}
                icon={{
                  url: redbull,
                  scaledSize: new window.google.maps.Size(50, 50),
                }}
              />
              {selectedMarker === marker && (
                <InfoWindow
                  onCloseClick={handleCloseClick}
                  position={marker.location}
                >
                  <div>
                    <div>👨‍💻{marker.name}</div>
                    <div>
                      📍{marker.location.lat},{marker.location.lng}
                    </div>
                    {/* <button
                      onClick={() =>
                        sendMessageToUser(
                          marker.token,
                          "Alert",
                          "Please be inisde the Class"
                        )
                      }
                    >
                      Send Alert
                    </button> */}
                  </div>
                </InfoWindow>
              )}
              <Marker position={master} onClick={handleMasterMarkerClick} />
            </div>
          );
        })}
        {showMarkersInsideCircle && (
          <InfoWindow
            onCloseClick={() => setShowMarkersInsideCircle(false)}
            position={master}
          >
            <div>
              <div>Total Students: {markers.length}</div>
              <div>No.of Students(s) inside: {markersInsideCircle.length}</div>
              {markersInsideCircle.map((marker) => (
                <div key={marker.name}>😀 {marker.name}</div>
              ))}
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
      </div>
    )
  );
};

export default Map;
