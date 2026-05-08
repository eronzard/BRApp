
import React, { useState, useEffect } from 'react';
import { supabase } from '../services/supabaseClient';
import { AppUser } from '../types';
import { User, Lock, Mail, Loader2, AlertCircle, ArrowLeft, CheckCircle, Info, Sun, Moon, Eye, EyeOff } from 'lucide-react';
import { Logo } from './Logo';

interface AuthProps {
  onLogin: (userId: string) => void;
  onCancelRecovery?: () => void;
  initialMode?: AuthMode;
  isDarkMode: boolean;
  onToggleTheme: () => void;
}

type AuthMode = 'signin' | 'signup' | 'forgot' | 'reset';

export const Auth: React.FC<AuthProps> = ({ onLogin, onCancelRecovery, initialMode = 'signin', isDarkMode, onToggleTheme }) => {
  const [loading, setLoading] = useState(false);
  const [mode, setMode] = useState<AuthMode>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [username, setUsername] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState<{ type: 'success' | 'error' | 'info', text: string } | null>(null);

  // 1. Detect Password Reset / Recovery from URL
  useEffect(() => {
    if (initialMode === 'reset') {
      setMode('reset');
      setMessage({ 
        type: 'info', 
        text: 'Recovery link verified. Please set a new secure password (at least 8 characters with numbers).' 
      });
    }

    // Check if the URL contains the recovery type or path
    const handleRecovery = async () => {
      const hash = window.location.hash;
      const path = window.location.pathname;
      const isRecovery = hash.includes('type=recovery') || path === '/reset-password';
      
      if (isRecovery) {
        setMode('reset');
        if (!message) {
          setMessage({ 
            type: 'info', 
            text: 'Recovery link verified. Please set a new secure password (at least 8 characters with numbers).' 
          });
        }
        // Clear the hash/path after a short delay
        setTimeout(() => {
          if (window.location.hash.includes('access_token')) {
            window.history.replaceState(null, '', window.location.pathname);
          }
        }, 1000);
      }
    };
    
    handleRecovery();

    // Also listen for auth state changes specifically for recovery
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (event === 'PASSWORD_RECOVERY') {
        setMode('reset');
      }
    });

    return () => subscription.unsubscribe();
  }, [initialMode]);

  const clearRecoveryUrl = () => {
    window.history.replaceState(null, '', window.location.origin);
  };

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setMessage(null);

    const normalizedEmail = email.toLowerCase().trim();

    try {
      if (mode === 'signup') {
        const { data, error } = await supabase.auth.signUp({
          email: normalizedEmail,
          password,
          options: {
            data: { username: username || email.split('@')[0] },
            emailRedirectTo: window.location.origin,
          }
        });

        if (error) throw error;
        
        // If 'Confirm Email' is OFF, data.session will exist immediately
        if (data.user && data.session) {
           console.log("Sign up successful, session created immediately.");
           onLogin(data.user.id);
        } else if (data.user) {
           // If 'Confirm Email' is ON, session is null until they click the link
           setMessage({ 
             type: 'success', 
             text: "Account created! Please check your inbox or spam folder to verify your email. Please allow up to 5 minutes if you don't see it immediately." 
           });
        }

      } else if (mode === 'signin') {
        const { data, error } = await supabase.auth.signInWithPassword({
          email: normalizedEmail,
          password,
        });

        if (error) {
          throw error;
        }
        if (data.user) onLogin(data.user.id);

      } else if (mode === 'forgot') {
        const { error } = await supabase.auth.resetPasswordForEmail(normalizedEmail, {
          redirectTo: `${window.location.origin}/reset-password`,
        });
        if (error) throw error;
        setMessage({ type: 'success', text: "Recovery link sent! If the email doesn't arrive in 5 minutes, please check your spam folder." });

      } else if (mode === 'reset') {
        const { data, error } = await supabase.auth.updateUser({ password });
        if (error) throw error;
        setMessage({ type: 'success', text: "Password updated successfully! Entering Bible Room..." });
        
        // After reset, the user is already signed in. 
        // We wait a moment for the success message then call onLogin to clear recovery state in App.tsx
        setTimeout(() => {
          if (data.user) onLogin(data.user.id);
        }, 2000);
      }
    } catch (err: any) {
      setMessage({ type: 'error', text: err.message || "An unexpected error occurred" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-bible-50 dark:bg-bible-950 p-4 transition-colors duration-300 relative">
      <button 
        onClick={onToggleTheme}
        className="absolute top-6 right-6 p-3 rounded-full bg-white dark:bg-bible-900 text-gray-500 dark:text-gray-400 shadow-lg border border-bible-100 dark:border-bible-800 hover:scale-110 transition-all active:scale-95"
        title={isDarkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
      >
        {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
      </button>
      <div className="bg-white dark:bg-bible-900 p-8 rounded-2xl shadow-xl w-full max-w-md border border-bible-100 dark:border-bible-800">
        <div className="text-center mb-8">
           <div className="inline-block mb-4">
             <Logo size={80} iconOnly />
           </div>
           <h1 className="font-serif text-4xl text-bible-900 dark:text-white mb-2 font-bold tracking-tight">Bible Room</h1>
           <p className="text-gray-500 dark:text-gray-400 text-lg">
             {mode === 'forgot' ? 'Reset Password' : 
              mode === 'reset' ? 'Set New Password' : 
              'Secure Team Workspace'}
           </p>
        </div>

        {message && (
          <div className={`mb-6 p-4 rounded-lg text-sm flex items-start gap-3 animate-fade-in-up ${
            message.type === 'success' ? 'bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-400 border border-green-200 dark:border-green-800' : 
            message.type === 'info' ? 'bg-bible-50 dark:bg-bible-800 text-bible-800 dark:text-bible-300 border border-bible-200 dark:border-bible-700' :
            'bg-red-50 dark:bg-red-900/20 text-red-700 dark:text-red-400 border border-red-200 dark:border-red-800'
          }`}>
            {message.type === 'success' ? <CheckCircle className="mt-0.5" size={18} /> : <AlertCircle className="mt-0.5" size={18} />}
            <p>{message.text}</p>
          </div>
        )}

        {((mode !== 'forgot' && mode !== 'reset') || !message || message.type !== 'success') ? (
          <form onSubmit={handleAuth} className="space-y-4">
            {(mode === 'signup') && (
              <div className="relative">
                <User className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="text"
                  placeholder="Name"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-bible-800 rounded-lg focus:ring-2 focus:ring-bible-400 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-bible-950"
                  required
                />
              </div>
            )}
            
            {(mode !== 'reset') && (
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                <input
                  type="email"
                  placeholder="Email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-10 pr-4 py-3 border border-gray-200 dark:border-bible-800 rounded-lg focus:ring-2 focus:ring-bible-400 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-bible-950"
                  required
                />
              </div>
            )}

            {(mode !== 'forgot') && (
              <div className="space-y-1">
                <div className="relative">
                  <Lock className="absolute left-3 top-3 text-gray-400 dark:text-gray-500" size={20} />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder={mode === 'reset' ? "New password (min 8 chars)" : "Password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full pl-10 pr-12 py-3 border border-gray-200 dark:border-bible-800 rounded-lg focus:ring-2 focus:ring-bible-400 outline-none transition-all text-gray-900 dark:text-white bg-white dark:bg-bible-950"
                    required
                    minLength={8}
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-3 text-gray-400 dark:text-gray-500 hover:text-bible-700 dark:hover:text-bible-400 transition-colors"
                  >
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                {(mode === 'signup' || mode === 'reset') && (
                  <p className="text-[10px] text-gray-400 dark:text-gray-500 px-1 italic">
                    Must be 8+ characters with at least one letter and one number.
                  </p>
                )}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-bible-800 dark:bg-bible-700 hover:bg-bible-900 dark:hover:bg-bible-600 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95 disabled:opacity-50"
            >
              {loading ? <Loader2 className="animate-spin" size={20} /> : (
                mode === 'signin' ? 'Sign In' : 
                mode === 'signup' ? 'Create Secure Account' : 
                mode === 'forgot' ? 'Send Recovery Email' : 'Update Password'
              )}
            </button>
          </form>
        ) : null}

        {mode === 'reset' && message?.type === 'success' && (
          <button
            onClick={() => {
              // The user is already signed in after updateUser
              supabase.auth.getUser().then(({ data: { user } }) => {
                if (user) onLogin(user.id);
              });
            }}
            className="w-full bg-bible-800 hover:bg-bible-900 text-white font-medium py-3 rounded-lg transition-all flex items-center justify-center gap-2 shadow-lg active:scale-95"
          >
            Continue to Bible Room
          </button>
        )}

        <div className="mt-6 text-center space-y-4">
          {mode === 'signin' && (
            <>
              <button
                onClick={() => { setMode('signup'); setMessage(null); }}
                className="block w-full text-bible-700 dark:text-bible-400 hover:text-bible-900 dark:hover:text-bible-200 text-sm font-semibold"
              >
                New here? Create Account
              </button>
              <button
                onClick={() => { setMode('forgot'); setMessage(null); }}
                className="block w-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 text-xs"
              >
                Forgot your password?
              </button>
            </>
          )}

          {mode === 'signup' && (
            <button
              onClick={() => { setMode('signin'); setMessage(null); }}
              className="block w-full text-bible-700 dark:text-bible-400 hover:text-bible-900 dark:hover:text-bible-200 text-sm font-semibold"
            >
              Already have an account? Sign In
            </button>
          )}

          {(mode === 'forgot' || mode === 'reset') && (
            <button
              onClick={() => { 
                clearRecoveryUrl();
                if (onCancelRecovery) onCancelRecovery();
                setMode('signin'); 
                setMessage(null); 
                setPassword(''); 
              }}
              className="flex items-center justify-center gap-2 w-full text-gray-400 dark:text-gray-500 hover:text-bible-700 dark:hover:text-bible-400 text-sm font-medium"
            >
              <ArrowLeft size={16} />
              Back to Sign In
            </button>
          )}
        </div>
      </div>
    </div>
  );
};
