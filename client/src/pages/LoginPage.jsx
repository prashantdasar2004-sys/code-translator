import { useState } from 'react';
import { useNavigate, Navigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuth } from '../context/AuthContext.jsx';
import '../styles/login.css';

const features = [
  { icon: '🔧', title: 'Code Debugging',   desc: 'Find and fix bugs instantly'        },
  { icon: '📚', title: 'Code Explanation', desc: 'Understand code in plain English'    },
  { icon: '⚡', title: 'AI Optimization',  desc: 'Improve performance and efficiency'  },
  { icon: '🧪', title: 'Test Generation',  desc: 'Create comprehensive test cases'     },
];

function LoginPage() {
  const { user, login, register, loading } = useAuth();
  const navigate = useNavigate();
  const [isSignUp, setIsSignUp] = useState(false);
  const [formData, setFormData] = useState({ username: '', email: '', password: '' });

  if (user) return <Navigate to="/" />;

  const handleInputChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { username, email, password } = formData;
    if (!email || !password) { toast.error('Please fill in all required fields'); return; }
    if (isSignUp && !username) { toast.error('Please enter a username'); return; }
    if (password.length < 6)  { toast.error('Password must be at least 6 characters'); return; }
    try {
      const result = isSignUp
        ? await register(username, email, password)
        : await login(email, password);
      if (result.success) navigate('/');
    } catch { /* handled in AuthContext */ }
  };

  const switchMode = () => {
    setIsSignUp(!isSignUp);
    setFormData({ username: '', email: '', password: '' });
  };

  return (
    <div className="login-page">
      {/* Left branding panel */}
      <div className="login-left">
        <div className="login-left-inner">
          <div className="login-logo">
            <div className="login-logo-icon">&lt;/&gt;</div>
            <span className="login-logo-text">Code Assistant</span>
          </div>
          <h1 className="login-hero-title">AI-Powered<br />Code Assistant</h1>
          <p className="login-hero-subtitle">
            Debug, optimize, and understand your code with advanced AI.
            Supports 10+ programming languages.
          </p>
          <div className="login-features">
            {features.map((f, i) => (
              <div key={i} className="login-feature-card">
                <div className="login-feature-icon">{f.icon}</div>
                <div>
                  <div className="login-feature-title">{f.title}</div>
                  <div className="login-feature-desc">{f.desc}</div>
                </div>
              </div>
            ))}
          </div>
          <div className="login-footer">Powered by OpenRouter AI</div>
        </div>
      </div>

      {/* Right form panel */}
      <div className="login-right">
        <div className="login-form-card">
          <div className="login-form-header">
            <h2>{isSignUp ? 'Create account' : 'Welcome back'}</h2>
            <p>{isSignUp ? 'Fill in your details to get started' : 'Enter your credentials to continue'}</p>
          </div>

          <form className="login-form" onSubmit={handleSubmit} noValidate>
            {isSignUp && (
              <div className="form-group">
                <label htmlFor="username">Username</label>
                <input type="text" id="username" name="username"
                  value={formData.username} onChange={handleInputChange}
                  placeholder="Enter your username" autoComplete="username" />
              </div>
            )}
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input type="email" id="email" name="email"
                value={formData.email} onChange={handleInputChange}
                placeholder="you@example.com" autoComplete="email" />
            </div>
            <div className="form-group">
              <label htmlFor="password">Password</label>
              <input type="password" id="password" name="password"
                value={formData.password} onChange={handleInputChange}
                placeholder="Min. 6 characters" minLength="6"
                autoComplete={isSignUp ? 'new-password' : 'current-password'} />
            </div>
            <button type="submit" className="login-btn" disabled={loading}>
              {loading
                ? <span className="login-btn-inner"><span className="login-spinner" />Please wait…</span>
                : isSignUp ? 'Create Account' : 'Sign In'}
            </button>
          </form>

          <div className="login-toggle">
            {isSignUp ? 'Already have an account?' : "Don't have an account?"}
            <button type="button" className="toggle-btn" onClick={switchMode}>
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default LoginPage;