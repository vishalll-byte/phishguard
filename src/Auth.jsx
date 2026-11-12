
import { useState } from "react";
import {
  ShieldCheck,
  Mail,
  LockKeyhole,
  User,
  Eye,
  EyeOff,
  ArrowRight,
  ArrowLeft,
  CheckCircle2
} from "lucide-react";

import { signup, login } from "./services/api";
import "./Auth.css";

function Auth({ onBack, onLogin }) {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");

    if (!email || !password || (!isLogin && !name)) {
      setMessage("Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      setMessage("Password must contain at least 8 characters.");
      return;
    }

    try {
      setLoading(true);

      const userData = isLogin
        ? { email, password }
        : { name, email, password };

      const data = isLogin
        ? await login(userData)
        : await signup(userData);

      if (!data.success) {
        throw new Error(data.message || "Authentication failed");
      }

      if (data.token) {
        localStorage.setItem("token", data.token);
      }

      if (data.user) {
        localStorage.setItem("user", JSON.stringify(data.user));
      }

      if (isLogin) {
        setMessage("Login successful! Welcome to PhishGuard.");

        if (onLogin) {
          onLogin(data);
        }
      } else {
        if (data.token) {
          setMessage("Account created successfully!");

          if (onLogin) {
            onLogin(data);
          }
        } else {
          setMessage("Account created! Please sign in.");
          setIsLogin(true);
          setName("");
          setPassword("");
        }
      }

    } catch (error) {
      setMessage(error.message || "Something went wrong.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-glow"></div>

      <button className="back-button" onClick={onBack}>
        <ArrowLeft size={18} /> Back to Home
      </button>

      <div className="auth-card">

        <div className="auth-logo">
          <ShieldCheck size={35} />
          <span>Phish<span>Guard</span></span>
        </div>

        <div className="auth-heading">
          <div className="auth-badge">
            <CheckCircle2 size={14} /> SECURE ACCESS
          </div>

          <h1>
            {isLogin ? "Welcome Back." : "Create Account."}
          </h1>

          <p>
            {isLogin
              ? "Sign in to continue your security journey."
              : "Join PhishGuard and take control of your online security."}
          </p>
        </div>

        <form onSubmit={handleSubmit}>

          {!isLogin && (
            <div className="auth-field">
              <label>Full Name</label>

              <div className="auth-input">
                <User size={19} />

                <input
                  type="text"
                  placeholder="Enter your full name"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>
            </div>
          )}

          <div className="auth-field">
            <label>Email Address</label>

            <div className="auth-input">
              <Mail size={19} />

              <input
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
              />
            </div>
          </div>

          <div className="auth-field">
            <label>Password</label>

            <div className="auth-input">
              <LockKeyhole size={19} />

              <input
                type={showPassword ? "text" : "password"}
                placeholder="Minimum 8 characters"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                autoComplete={
                  isLogin ? "current-password" : "new-password"
                }
              />

              <button
                type="button"
                className="eye-button"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword
                  ? <EyeOff size={19} />
                  : <Eye size={19} />}
              </button>
            </div>
          </div>

          {message && (
            <div className="auth-message" role="status">
              {message}
            </div>
          )}

          <button
            type="submit"
            className="auth-submit"
            disabled={loading}
          >
            {loading
              ? "Please wait..."
              : isLogin
                ? "Sign In"
                : "Create Account"}

            {!loading && <ArrowRight size={18} />}
          </button>

        </form>

        <div className="auth-switch">
          {isLogin
            ? "Don't have an account?"
            : "Already have an account?"}

          <button
            type="button"
            disabled={loading}
            onClick={() => {
              setIsLogin(!isLogin);
              setMessage("");
              setPassword("");
            }}
          >
            {isLogin ? "Sign Up" : "Sign In"}
          </button>
        </div>

        <div className="auth-security">
          <ShieldCheck size={16} />
          Your security is our priority.
        </div>

      </div>

      <p className="auth-footer">
        © 2026 PhishGuard. Built for a safer digital world.
      </p>
    </div>
  );
}

export default Auth;