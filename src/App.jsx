
import { useState } from "react";
import { motion } from "framer-motion";
import {
  ShieldCheck,
  ScanSearch,
  Activity,
  LockKeyhole,
  ArrowRight,
  Zap,
  Globe,
  CheckCircle2,
  LogOut,
  User
} from "lucide-react";

import Auth from "./Auth";
import { scanURL } from "./services/api";
import "./App.css";

function App() {
  const [url, setUrl] = useState("");
  const [message, setMessage] = useState("");
  const [scanResult, setScanResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [showAuth, setShowAuth] = useState(false);

  const [user, setUser] = useState(() => {
    try {
      return JSON.parse(localStorage.getItem("user")) || null;
    } catch {
      return null;
    }
  });

  const handleLogin = (data) => {
    setUser(data.user);
    setShowAuth(false);
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    setMessage("");
    setUrl("");
    setScanResult(null);
  };

  const handleScan = async () => {
    if (!url.trim()) {
      setMessage("Please enter a URL first.");
      setScanResult(null);
      return;
    }

    setLoading(true);
    setMessage("");
    setScanResult(null);

    try {
      const data = await scanURL(url.trim());

      if (data.success && data.result) {
        setScanResult(data.result);
      } else {
        setMessage(data.message || "Unable to scan URL.");
      }
    } catch (error) {
      setMessage(error.message);
    } finally {
      setLoading(false);
    }
  };

  if (showAuth && !user) {
    return (
      <Auth
        onBack={() => setShowAuth(false)}
        onLogin={handleLogin}
      />
    );
  }

  return (
    <div className="app">
      <nav className="navbar">
        <a href="#" className="logo">
          <ShieldCheck size={30} />
          <span>
            Phish<span className="blue">Guard</span>
          </span>
        </a>

        <div className="nav-links">
          {user ? (
            <>
              <a href="#dashboard">Dashboard</a>
              <a href="#scanner">URL Scanner</a>
              <a href="#features">Features</a>
            </>
          ) : (
            <>
              <a href="#features">Features</a>
              <a href="#scanner">URL Scanner</a>
              <a href="#about">About</a>
            </>
          )}
        </div>

        {user ? (
          <button className="nav-btn" onClick={handleLogout}>
            <LogOut size={17} /> Logout
          </button>
        ) : (
          <button
            className="nav-btn"
            onClick={() => setShowAuth(true)}
          >
            Get Protected <ArrowRight size={16} />
          </button>
        )}
      </nav>

      <main>
        <section className="hero" id="dashboard">
          <motion.div
            className="hero-content"
            initial={{ opacity: 0, y: 25 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7 }}
          >
            <div className="announcement">
              <span className="live-dot"></span>
              {user ? "SECURE DASHBOARD" : "CYBERSECURITY PLATFORM"}
            </div>

            <h1>
              {user ? "Welcome," : "Don't Trust."}
              <br />
              <span>
                {user ? `${user.name || "User"}.` : "Verify First."}
              </span>
            </h1>

            <p className="hero-description">
              {user
                ? "Your PhishGuard account is active. Check suspicious links before clicking."
                : "Stay one step ahead of cyber threats. Analyze suspicious URLs and understand potential risks."}
            </p>

            <div className="hero-buttons">
              <a href="#scanner" className="primary-btn">
                Scan a URL <ArrowRight size={18} />
              </a>

              {user ? (
                <button className="secondary-btn" onClick={handleLogout}>
                  Logout
                </button>
              ) : (
                <button
                  className="secondary-btn"
                  onClick={() => setShowAuth(true)}
                >
                  Get Started
                </button>
              )}
            </div>

            <div className="trust-line">
              <CheckCircle2 size={17} />
              {user ? "Account authenticated" : "Privacy focused"}
            </div>
          </motion.div>

          <motion.div
            className="hero-visual"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8 }}
          >
            <div className="security-card">
              <div className="card-top">
                <span>SECURITY OVERVIEW</span>
                <span className="status">
                  <span className="live-dot"></span>
                  SYSTEM ONLINE
                </span>
              </div>

              <div className="shield-container">
                <div className="shield-ring">
                  <ShieldCheck size={76} />
                </div>
              </div>

              <h3>Your Digital World</h3>
              <p>Deserves intelligent protection.</p>

              <div className="security-stats">
                <div>
                  <User size={19} />
                  <span>{user ? user.name : "User Security"}</span>
                  <CheckCircle2 className="check" size={18} />
                </div>

                <div>
                  <LockKeyhole size={19} />
                  <span>Secure Analysis</span>
                  <CheckCircle2 className="check" size={18} />
                </div>

                <div>
                  <Globe size={19} />
                  <span>URL Scanner</span>
                  <CheckCircle2 className="check" size={18} />
                </div>
              </div>
            </div>
          </motion.div>
        </section>

        <section className="scanner-section" id="scanner">
          <div className="section-label">
            INTELLIGENT URL ANALYSIS
          </div>

          <h2>
            Check Before You <span>Click.</span>
          </h2>

          <p className="section-description">
            Enter a suspicious URL for a basic security assessment.
          </p>

          <div className="scanner-box">
            <ScanSearch size={23} />

            <input
              type="url"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value);
                setMessage("");
                setScanResult(null);
              }}
            />

            <button onClick={handleScan} disabled={loading}>
              {loading ? "Scanning..." : "Scan URL"}
              {!loading && <ArrowRight size={17} />}
            </button>
          </div>

          {message && (
            <p className="scan-message">{message}</p>
          )}

          {scanResult && (
            <div className="scanner-result">
              <h3>Scan Results</h3>

              <p><strong>URL:</strong> {scanResult.url}</p>
              <p><strong>Domain:</strong> {scanResult.domain}</p>
              <p><strong>Risk Score:</strong> {scanResult.score}/100</p>
              <p><strong>Status:</strong> {scanResult.status}</p>

              <h4>Analysis Details</h4>

              <ul>
                {scanResult.reasons.map((reason, index) => (
                  <li key={index}>{reason}</li>
                ))}
              </ul>

              <p>
                <strong>Checked:</strong>{" "}
                {new Date(scanResult.checkedAt).toLocaleString()}
              </p>

              <p className="privacy-note">
                This is a basic heuristic assessment, not verified phishing
                detection. A Low Risk result does not guarantee that a URL is safe.
              </p>
            </div>
          )}

          <p className="privacy-note">
            <LockKeyhole size={14} />
            Your security and privacy matter.
          </p>
        </section>

        <section className="features-section" id="features">
          <div className="section-label">WHY PHISHGUARD</div>

          <h2>
            Security That Thinks <span>Ahead.</span>
          </h2>

          <p className="section-description">
            Tools designed to help users understand online risks.
          </p>

          <div className="feature-grid">
            <Feature
              icon={<ScanSearch />}
              title="Smart URL Scanner"
              description="Check suspicious URLs using basic detection techniques."
            />

            <Feature
              icon={<Activity />}
              title="Risk Insights"
              description="Understand potential warning signs in a URL."
            />

            <Feature
              icon={<Zap />}
              title="Risk Assessment"
              description="Get a simple score based on detected indicators."
            />

            <Feature
              icon={<LockKeyhole />}
              title="Privacy First"
              description="Designed with user security in mind."
            />
          </div>
        </section>

        {!user && (
          <section className="bottom-cta" id="about">
            <ShieldCheck size={42} />
            <h2>Think Before You Click.</h2>
            <p>A safer digital experience starts with one smart decision.</p>

            <button
              className="primary-btn"
              onClick={() => setShowAuth(true)}
            >
              Get Started <ArrowRight size={17} />
            </button>
          </section>
        )}
      </main>

      <footer>
        <a href="#" className="logo">
          <ShieldCheck size={23} />
          <span>
            Phish<span className="blue">Guard</span>
          </span>
        </a>

        <p>© 2026 PhishGuard. Built for a safer digital world.</p>

        <a href="#about">
          <Globe size={20} />
        </a>
      </footer>
    </div>
  );
}

function Feature({ icon, title, description }) {
  return (
    <motion.div
      className="feature-card"
      whileHover={{ y: -7 }}
      transition={{ duration: 0.2 }}
    >
      <div className="feature-icon">{icon}</div>
      <h3>{title}</h3>
      <p>{description}</p>
    </motion.div>
  );
}

export default App;