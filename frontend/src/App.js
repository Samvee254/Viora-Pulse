import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, Circle } from "react-leaflet";
import axios from "axios";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: require("leaflet/dist/images/marker-icon-2x.png"),
  iconUrl: require("leaflet/dist/images/marker-icon.png"),
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
});

const createColoredIcon = (color) => new L.Icon({
  iconUrl: `https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-2x-${color}.png`,
  shadowUrl: require("leaflet/dist/images/marker-shadow.png"),
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41],
});

const redIcon = createColoredIcon("red");
const greenIcon = createColoredIcon("green");

const API = "http://127.0.0.1:8000";

const styles = {
  app: {
    fontFamily: "'Segoe UI', Arial, sans-serif",
    minHeight: "100vh",
    background: "#f0f4f0",
    margin: 0,
    padding: 0,
  },
  header: {
    background: "linear-gradient(135deg, #004d00 0%, #006600 50%, #00aa44 100%)",
    padding: "0",
    boxShadow: "0 4px 20px rgba(0,100,0,0.3)",
  },
  headerInner: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "18px 30px",
    display: "flex",
    alignItems: "center",
    justifyContent: "space-between",
  },
  logoArea: {
    display: "flex",
    alignItems: "center",
    gap: "14px",
  },
  logoImg: {
    width: "52px",
    height: "52px",
    borderRadius: "50%",
    boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
  },
  brandName: {
    color: "white",
    fontSize: "28px",
    fontWeight: "800",
    letterSpacing: "1px",
    margin: 0,
    textShadow: "0 2px 4px rgba(0,0,0,0.2)",
  },
  tagline: {
    color: "rgba(255,255,255,0.85)",
    fontSize: "13px",
    margin: 0,
    letterSpacing: "2px",
    textTransform: "uppercase",
    fontWeight: "500",
  },
  liveTag: {
    background: "#ff4444",
    color: "white",
    padding: "6px 14px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    letterSpacing: "1px",
    animation: "pulse 2s infinite",
    display: "flex",
    alignItems: "center",
    gap: "6px",
  },
  main: {
    maxWidth: "1100px",
    margin: "0 auto",
    padding: "24px 20px",
  },
  statsBar: {
    display: "grid",
    gridTemplateColumns: "repeat(3, 1fr)",
    gap: "16px",
    marginBottom: "24px",
  },
  statCard: {
    background: "white",
    borderRadius: "12px",
    padding: "18px 20px",
    textAlign: "center",
    boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
    borderTop: "4px solid #006600",
  },
  statNumber: {
    fontSize: "32px",
    fontWeight: "800",
    color: "#006600",
    margin: 0,
  },
  statLabel: {
    color: "#888",
    fontSize: "13px",
    margin: "4px 0 0 0",
    textTransform: "uppercase",
    letterSpacing: "1px",
  },
  grid: {
    display: "grid",
    gridTemplateColumns: "1fr 380px",
    gap: "20px",
    alignItems: "start",
  },
  card: {
    background: "white",
    borderRadius: "16px",
    boxShadow: "0 2px 15px rgba(0,0,0,0.08)",
    overflow: "hidden",
  },
  cardHeader: {
    padding: "16px 20px",
    borderBottom: "1px solid #f0f0f0",
    display: "flex",
    alignItems: "center",
    gap: "10px",
  },
  cardTitle: {
    margin: 0,
    fontSize: "16px",
    fontWeight: "700",
    color: "#1a1a1a",
  },
  formBody: {
    padding: "20px",
  },
  input: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "2px solid #e8e8e8",
    fontSize: "14px",
    marginBottom: "12px",
    boxSizing: "border-box",
    outline: "none",
    transition: "border 0.2s",
    fontFamily: "inherit",
  },
  select: {
    width: "100%",
    padding: "12px 14px",
    borderRadius: "10px",
    border: "2px solid #e8e8e8",
    fontSize: "14px",
    marginBottom: "12px",
    boxSizing: "border-box",
    outline: "none",
    background: "white",
    fontFamily: "inherit",
  },
  btn: {
    width: "100%",
    padding: "14px",
    background: "linear-gradient(135deg, #006600, #00aa44)",
    color: "white",
    border: "none",
    borderRadius: "10px",
    fontSize: "15px",
    fontWeight: "700",
    cursor: "pointer",
    letterSpacing: "0.5px",
    marginTop: "4px",
  },
  successMsg: {
    background: "#e6ffe6",
    color: "#006600",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginTop: "12px",
    fontWeight: "600",
    textAlign: "center",
  },
  errorMsg: {
    background: "#ffe6e6",
    color: "#cc0000",
    padding: "10px 14px",
    borderRadius: "8px",
    fontSize: "14px",
    marginTop: "12px",
    fontWeight: "600",
    textAlign: "center",
  },
  reportsList: {
    padding: "0 20px 20px",
    maxHeight: "340px",
    overflowY: "auto",
  },
  reportItem: {
    padding: "14px",
    borderRadius: "10px",
    marginBottom: "10px",
    borderLeft: "4px solid",
  },
  reportName: {
    fontWeight: "700",
    fontSize: "15px",
    margin: "0 0 4px 0",
    color: "#1a1a1a",
  },
  reportDetail: {
    fontSize: "13px",
    color: "#555",
    margin: 0,
  },
  badge: {
    display: "inline-block",
    padding: "2px 10px",
    borderRadius: "20px",
    fontSize: "12px",
    fontWeight: "700",
    marginLeft: "6px",
  },
  footer: {
    textAlign: "center",
    padding: "30px",
    color: "#aaa",
    fontSize: "13px",
    marginTop: "20px",
  }
};

export default function App() {
  const [reports, setReports] = useState([]);
  const [locations, setLocations] = useState([]);
  const [form, setForm] = useState({
    location_name: "",
    county: "",
    utility_type: "water",
    status: "unavailable",
  });
  const [message, setMessage] = useState("");
  const [isError, setIsError] = useState(false);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchAll();
    const interval = setInterval(fetchAll, 30000);
    return () => clearInterval(interval);
  }, []);

  const fetchAll = async () => {
    try {
      const [locRes, repRes] = await Promise.all([
        axios.get(`${API}/locations/`),
        axios.get(`${API}/reports/`),
      ]);
      setLocations(locRes.data);
      setReports(repRes.data);
    } catch (e) {}
  };

  const submitReport = async () => {
    if (!form.location_name || !form.county) {
      setMessage("Please fill in your area and county.");
      setIsError(true);
      return;
    }
    setLoading(true);
    setMessage("");
    try {
      const knownLoc = locations.find(
        l => l.name.toLowerCase() === form.location_name.toLowerCase()
      );
      const locRes = await axios.post(`${API}/locations/`, {
        name: form.location_name,
        county: form.county,
        latitude: knownLoc ? knownLoc.latitude : -1.2921,
        longitude: knownLoc ? knownLoc.longitude : 36.8219,
      });
      await axios.post(`${API}/reports/`, {
        location_id: locRes.data.id,
        utility_type: form.utility_type,
        status: form.status,
      });
      setMessage("Report submitted! Thank you. 🇰🇪");
      setIsError(false);
      setForm({ ...form, location_name: "", county: "" });
      fetchAll();
    } catch (e) {
      setMessage("Failed to submit. Please try again.");
      setIsError(true);
    }
    setLoading(false);
  };

  const getLocation = (id) => locations.find((l) => l.id === id);
  const unavailable = reports.filter((r) => r.status === "unavailable").length;
  const available = reports.filter((r) => r.status === "available").length;

  return (
    <div style={styles.app}>
      <style>{`
        @keyframes pulse {
          0% { opacity: 1; }
          50% { opacity: 0.6; }
          100% { opacity: 1; }
        }
        input:focus, select:focus { border-color: #006600 !important; }
        button:hover { opacity: 0.92; transform: translateY(-1px); transition: all 0.2s; }
        ::-webkit-scrollbar { width: 6px; }
        ::-webkit-scrollbar-track { background: #f1f1f1; border-radius: 10px; }
        ::-webkit-scrollbar-thumb { background: #006600; border-radius: 10px; }
      `}</style>

      <header style={styles.header}>
        <div style={styles.headerInner}>
          <div style={styles.logoArea}>
            <img src="/logo.svg" alt="Viora Pulse Logo" style={styles.logoImg} />
            <div>
              <p style={styles.brandName}>Viora Pulse</p>
              <p style={styles.tagline}>Know Before You Go</p>
            </div>
          </div>
          <div style={styles.liveTag}>
            <span style={{ width: "8px", height: "8px", background: "white", borderRadius: "50%", display: "inline-block" }}></span>
            LIVE
          </div>
        </div>
      </header>

      {unavailable > 0 && (
        <div style={{
          background: "linear-gradient(135deg, #cc0000, #ff4444)",
          color: "white",
          padding: "12px 30px",
          textAlign: "center",
          fontSize: "14px",
          fontWeight: "600",
          letterSpacing: "0.5px",
          boxShadow: "0 2px 10px rgba(204,0,0,0.3)",
        }}>
          ⚠️ {unavailable} area{unavailable > 1 ? "s are" : " is"} currently reporting utility outages in Kenya
        </div>
      )}

      <main style={styles.main}>
        <div style={{
          background: "white",
          borderRadius: "16px",
          padding: "32px 28px",
          marginBottom: "24px",
          boxShadow: "0 4px 20px rgba(0,100,0,0.1)",
          textAlign: "center",
        }}>
          <h2 style={{ margin: "0 0 6px 0", color: "#1a1a1a", fontSize: "22px" }}>
            What's the status in your area?
          </h2>
          <p style={{ margin: "0 0 20px 0", color: "#888", fontSize: "14px" }}>
            Check water and electricity status before you go.
          </p>
          <div style={{
            display: "flex",
            gap: "12px",
            alignItems: "center",
            maxWidth: "600px",
            margin: "0 auto",
          }}>
            <span style={{ fontSize: "20px" }}>🔍</span>
            <input
              type="text"
              placeholder="Type your area e.g. Westlands, Kibera, Kisumu..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              autoFocus
              style={{
                flex: 1,
                padding: "14px 16px",
                borderRadius: "10px",
                border: "2px solid #e8e8e8",
                fontSize: "15px",
                outline: "none",
                fontFamily: "inherit",
              }}
            />
            {search && (
              <button
                onClick={() => setSearch("")}
                style={{ background: "none", border: "none", fontSize: "18px", cursor: "pointer", color: "#aaa" }}
              >✕</button>
            )}
          </div>
        </div>

{search && (() => {
          const matchingLocations = locations.filter(loc =>
            loc.name.toLowerCase().includes(search.toLowerCase()) ||
            loc.county.toLowerCase().includes(search.toLowerCase())
          );

          if (matchingLocations.length === 0) {
            return (
              <div style={{
                background: "white", borderRadius: "12px", padding: "20px",
                marginBottom: "20px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              }}>
                <p style={{ color: "#aaa", margin: 0 }}>No data found for "{search}" yet. Be the first to report it!</p>
              </div>
            );
          }

          return matchingLocations.map(loc => {
            const locReports = reports.filter(r => r.location_id === loc.id);
            const waterReports = locReports.filter(r => r.utility_type === "water");
            const electricityReports = locReports.filter(r => r.utility_type === "electricity");

            const latestOf = (arr) => arr.length === 0 ? null :
              arr.reduce((a, b) => new Date(a.timestamp) > new Date(b.timestamp) ? a : b);

            const latestWater = latestOf(waterReports);
            const latestElectricity = latestOf(electricityReports);

            const confidenceFor = (arr, latest) => {
              if (!latest || arr.length === 0) return null;
              const windowHrs = 6;
              const recent = arr.filter(r => (Date.now() - new Date(r.timestamp)) / 3600000 <= windowHrs);
              if (recent.length === 0) return null;
              const agreeing = recent.filter(r => r.status === latest.status).length;
              const pct = Math.round((agreeing / recent.length) * 100);
              return { pct, count: recent.length };
            };

            const waterConfidence = confidenceFor(waterReports, latestWater);
            const electricityConfidence = confidenceFor(electricityReports, latestElectricity);

            const timeAgo = (ts) => {
              const mins = Math.floor((Date.now() - new Date(ts)) / 60000);
              if (mins < 1) return "just now";
              if (mins < 60) return `${mins} min${mins > 1 ? "s" : ""} ago`;
              const hrs = Math.floor(mins / 60);
              if (hrs < 24) return `${hrs} hr${hrs > 1 ? "s" : ""} ago`;
              return `${Math.floor(hrs / 24)} day(s) ago`;
            };

            const STALE_HOURS = 6;
            const isStale = (ts) => {
              const hrs = (Date.now() - new Date(ts)) / 3600000;
              return hrs > STALE_HOURS;
            };

            const StatusRow = ({ icon, label, report, confidence }) => {
              if (!report) {
                return (
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                    <span style={{ fontWeight: "600" }}>{icon} {label}</span>
                    <span style={{ color: "#aaa", fontSize: "13px" }}>No reports yet</span>
                  </div>
                );
              }
              const isAvailable = report.status === "available";
              const stale = isStale(report.timestamp);
              return (
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "12px 0", borderBottom: "1px solid #f0f0f0" }}>
                  <span style={{ fontWeight: "600" }}>{icon} {label}</span>
                  <div style={{ textAlign: "right" }}>
                    <span style={{
                      fontWeight: "700",
                      color: stale ? "#999" : (isAvailable ? "#006600" : "#cc0000"),
                    }}>
                      {stale ? "⚪ " : (isAvailable ? "🟢 " : "🔴 ")}
                      {isAvailable ? "Available" : "Outage Reported"}
                    </span>
                    <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: stale ? "#cc8800" : "#999" }}>
                      {stale ? "⚠️ Stale — " : "Updated "}{timeAgo(report.timestamp)}
                    </p>
                    {confidence && !stale && (
                      <p style={{ margin: "2px 0 0 0", fontSize: "11px", color: "#888" }}>
                        Confidence: {confidence.pct}% ({confidence.count} report{confidence.count > 1 ? "s" : ""})
                      </p>
                    )}
                  </div>
                </div>
              );
            };

            return (
              <div key={loc.id} style={{
                background: "white", borderRadius: "12px", padding: "20px",
                marginBottom: "16px", boxShadow: "0 2px 10px rgba(0,0,0,0.07)",
              }}>
                <h3 style={{ margin: "0 0 8px 0", color: "#1a1a1a" }}>
                  📍 {loc.name}, {loc.county}
                </h3>
                <StatusRow icon="💧" label="Water" report={latestWater} confidence={waterConfidence} />
                <StatusRow icon="⚡" label="Electricity" report={latestElectricity} confidence={electricityConfidence} />
              </div>
            );
          });
        })()}

        <div style={styles.statsBar}>
          <div style={styles.statCard}>
            <p style={styles.statNumber}>{reports.length}</p>
            <p style={styles.statLabel}>Total Reports</p>
          </div>
          <div style={{ ...styles.statCard, borderTopColor: "#cc0000" }}>
            <p style={{ ...styles.statNumber, color: "#cc0000" }}>{unavailable}</p>
            <p style={styles.statLabel}>Unavailable</p>
          </div>
          <div style={{ ...styles.statCard, borderTopColor: "#00aa44" }}>
            <p style={{ ...styles.statNumber, color: "#00aa44" }}>{available}</p>
            <p style={styles.statLabel}>Available</p>
          </div>
        </div>

        <div style={styles.card}>
          <div style={styles.cardHeader}>
            <span>🗺️</span>
            <h2 style={styles.cardTitle}>Live Map — Kenya</h2>
          </div>
          <MapContainer
            center={[-1.2921, 36.8219]}
            zoom={9}
            style={{ height: "450px" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution="&copy; OpenStreetMap contributors"
            />
            {reports.map((report) => {
              const loc = getLocation(report.location_id);
              if (!loc || !loc.latitude || !loc.longitude) return null;
              const color = report.status === "unavailable" ? "#cc0000" : "#006600";
              return (
                <React.Fragment key={report.id}>
                  <Circle
                    center={[loc.latitude, loc.longitude]}
                    radius={3000}
                    pathOptions={{ color, fillColor: color, fillOpacity: 0.3 }}
                  />
                  <Marker position={[loc.latitude, loc.longitude]} icon={report.status === "unavailable" ? redIcon : greenIcon}>
                    <Popup>
                      <strong>{loc.name}, {loc.county}</strong><br />
                      {report.utility_type}: <strong style={{ color }}>{report.status}</strong><br />
                      <small>{new Date(report.timestamp).toLocaleString()}</small>
                    </Popup>
                  </Marker>
                </React.Fragment>
              );
            })}
          </MapContainer>
        </div>

        <div style={{ marginTop: "30px", marginBottom: "16px", textAlign: "center" }}>
          <h2 style={{ color: "#006600", margin: "0 0 4px 0" }}>🤝 Help Your Community</h2>
          <p style={{ color: "#888", fontSize: "14px", margin: 0 }}>
            Seen an outage or service restored? Let others know.
          </p>
        </div>

        <div style={styles.grid}>
          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span>📍</span>
              <h2 style={styles.cardTitle}>Submit a Report</h2>
            </div>
            <div style={styles.formBody}>
              <input
                style={styles.input}
                type="text"
                placeholder="Your area e.g. Mlolongo"
                value={form.location_name}
                list="known-locations"
                onChange={(e) => {
                  const typed = e.target.value;
                  const match = locations.find(
                    l => l.name.toLowerCase() === typed.toLowerCase()
                  );
                  if (match) {
                    setForm({ ...form, location_name: typed, county: match.county, locationLocked: true });
                  } else {
                    setForm({ ...form, location_name: typed, locationLocked: false });
                  }
                }}
              />
              <datalist id="known-locations">
                {[...new Set(locations.map(l => l.name))].map((name, i) => (
                  <option key={i} value={name} />
                ))}
              </datalist>
              <input
                style={{
                  ...styles.input,
                  background: form.locationLocked ? "#f0f0f0" : "white",
                  color: form.locationLocked ? "#555" : "#1a1a1a",
                }}
                type="text"
                placeholder="County e.g. Machakos"
                value={form.county}
                readOnly={form.locationLocked}
                onChange={(e) => {
                  if (!form.locationLocked) {
                    setForm({ ...form, county: e.target.value });
                  }
                }}
              />
              {form.locationLocked && (
                <p style={{ fontSize: "12px", color: "#888", margin: "-6px 0 12px 0" }}>
                  📍 County auto-filled from known location
                </p>
              )}
              <select
                style={styles.select}
                value={form.utility_type}
                onChange={(e) => setForm({ ...form, utility_type: e.target.value })}
              >
                <option value="water">💧 Water</option>
                <option value="electricity">⚡ Electricity</option>
              </select>
              <select
                style={styles.select}
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value })}
              >
                <option value="unavailable">❌ Unavailable</option>
                <option value="available">✅ Available</option>
              </select>
              <button
                style={{ ...styles.btn, opacity: loading ? 0.7 : 1 }}
                onClick={submitReport}
                disabled={loading}
              >
                {loading ? "Submitting..." : "Submit Report 🇰🇪"}
              </button>
              {message && (
                <div style={isError ? styles.errorMsg : styles.successMsg}>
                  {message}
                </div>
              )}
            </div>
          </div>

          <div style={styles.card}>
            <div style={styles.cardHeader}>
              <span>📋</span>
              <h2 style={styles.cardTitle}>Recent Reports</h2>
            </div>
            <div style={styles.reportsList}>
              {reports.length === 0 && (
                <p style={{ color: "#aaa", textAlign: "center", padding: "20px" }}>No reports yet. Be the first! 🇰🇪</p>
              )}
              {[...reports].reverse().map((report) => {
                const loc = getLocation(report.location_id);
                const isUnavailable = report.status === "unavailable";
                return (
                  <div
                    key={report.id}
                    style={{
                      ...styles.reportItem,
                      background: isUnavailable ? "#fff5f5" : "#f5fff5",
                      borderLeftColor: isUnavailable ? "#cc0000" : "#006600",
                    }}
                  >
                    <p style={styles.reportName}>
                      📍 {loc ? `${loc.name}, ${loc.county}` : "Unknown"}
                      <span style={{
                        ...styles.badge,
                        background: isUnavailable ? "#ffe6e6" : "#e6ffe6",
                        color: isUnavailable ? "#cc0000" : "#006600",
                      }}>
                        {isUnavailable ? "❌" : "✅"} {report.status}
                      </span>
                    </p>
                    <p style={styles.reportDetail}>
                      {report.utility_type === "water" ? "💧" : "⚡"} {report.utility_type} • {new Date(report.timestamp).toLocaleString()}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>
        </div>

      </main>

      <footer style={styles.footer}>
        <p>🇰🇪 Viora Pulse — Know Before You Go • Built for Kenya</p>
        <p style={{ marginTop: "4px", fontSize: "11px" }}>Auto-refreshes every 30 seconds</p>
      </footer>
    </div>
  );
}
