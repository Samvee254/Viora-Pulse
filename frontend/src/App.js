import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import axios from 'axios';
import 'leaflet/dist/leaflet.css';
import L from 'leaflet';

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require('leaflet/dist/images/marker-icon-2x.png'),
  iconUrl: require('leaflet/dist/images/marker-icon.png'),
  shadowUrl: require('leaflet/dist/images/marker-shadow.png'),
});

const API = 'http://127.0.0.1:8000';

function App() {
  const [reports, setReports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    location_name: '',
    county: '',
    utility_type: 'water',
    status: 'unavailable'
  });
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchLocations();
    fetchReports();
  }, []);

  const fetchLocations = async () => {
    const res = await axios.get(`${API}/locations/`);
    setLocations(res.data);
  };

  const fetchReports = async () => {
    const res = await axios.get(`${API}/reports/`);
    setReports(res.data);
  };

  const submitReport = async () => {
    try {
      const locRes = await axios.post(`${API}/locations/`, {
        name: form.location_name,
        county: form.county,
        latitude: 0,
        longitude: 0
      });
      await axios.post(`${API}/reports/`, {
        location_id: locRes.data.id,
        utility_type: form.utility_type,
        status: form.status
      });
      setMessage('Report submitted successfully!');
      fetchReports();
      fetchLocations();
    } catch (err) {
      setMessage('Error submitting report.');
    }
  };

  const getLocation = (id) => locations.find(l => l.id === id);

  return (
    <div style={{ fontFamily: 'Arial, sans-serif', maxWidth: '900px', margin: '0 auto', padding: '20px' }}>
      <h1 style={{ color: '#006600', textAlign: 'center' }}>
        Viora Pulse
      </h1>
      <p style={{ textAlign: 'center', color: '#555', marginTop: '-10px' }}>
        <em>Know Before You Go</em>
      </p>
      <MapContainer
        center={[-1.2921, 36.8219]}
        zoom={10}
        style={{ height: '400px', borderRadius: '10px', marginBottom: '30px' }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution="&copy; OpenStreetMap contributors"
        />
        {reports.map(report => {
          const loc = getLocation(report.location_id);
          if (!loc) return null;
          return (
            <Marker key={report.id} position={[loc.latitude, loc.longitude]}>
              <Popup>
                <strong>{loc.name}, {loc.county}</strong><br />
                {report.utility_type}: <strong>{report.status}</strong><br />
                <small>{new Date(report.timestamp).toLocaleString()}</small>
              </Popup>
            </Marker>
          );
        })}
      </MapContainer>
      <div style={{ background: '#f9f9f9', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        <h2 style={{ color: '#006600' }}>Submit a Report</h2>
        <input
          type="text"
          placeholder="Your area e.g. Mlolongo"
          value={form.location_name}
          onChange={e => setForm({ ...form, location_name: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
        <input
          type="text"
          placeholder="County e.g. Machakos"
          value={form.county}
          onChange={e => setForm({ ...form, county: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px', border: '1px solid #ccc', boxSizing: 'border-box' }}
        />
        <select
          value={form.utility_type}
          onChange={e => setForm({ ...form, utility_type: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}
        >
          <option value="water">Water</option>
          <option value="electricity">Electricity</option>
        </select>
        <select
          value={form.status}
          onChange={e => setForm({ ...form, status: e.target.value })}
          style={{ width: '100%', padding: '10px', marginBottom: '10px', borderRadius: '5px' }}
        >
          <option value="unavailable">Unavailable</option>
          <option value="available">Available</option>
        </select>
        <button
          onClick={submitReport}
          style={{ width: '100%', padding: '12px', background: '#006600', color: 'white', border: 'none', borderRadius: '5px', fontSize: '16px', cursor: 'pointer' }}
        >
          Submit Report
        </button>
        {message && <p style={{ color: '#006600', marginTop: '10px' }}>{message}</p>}
      </div>
      <h2 style={{ color: '#006600' }}>Recent Reports</h2>
      {reports.length === 0 && <p>No reports yet.</p>}
      {reports.map(report => {
        const loc = getLocation(report.location_id);
        return (
          <div key={report.id} style={{ background: report.status === 'unavailable' ? '#ffe6e6' : '#e6ffe6', padding: '15px', borderRadius: '8px', marginBottom: '10px' }}>
            <strong>{loc ? `${loc.name}, ${loc.county}` : 'Unknown'}</strong><br />
            {report.utility_type} — <strong>{report.status}</strong><br />
            <small>{new Date(report.timestamp).toLocaleString()}</small>
          </div>
        );
      })}
    </div>
  );
}

export default App;
