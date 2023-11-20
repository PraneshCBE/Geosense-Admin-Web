import './App.css';
import Map from './components/Map';
import {useJsApiLoader } from '@react-google-maps/api';

function App() {
  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: "AIzaSyDThQ5eZp2jQPmHpRJYppCOe9LxhXXS62A"
  })
  return (
    <div>
      <center className='bg-gradient-to-r from-indigo-500 from-10% via-sky-500 via-30% to-emerald-500 to-90% ...'><h1 className='text-3xl font-bold text-green-50'>GeoSense Admin</h1></center>
      <Map isLoaded={isLoaded}></Map>
    </div>
    
  );
}

export default App;
