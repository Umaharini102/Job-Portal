import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import API from '../services/api';
import { useToast } from './ToastContext';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [token, setToken] = useState(() => localStorage.getItem('jobconnect_token'));
  const toast = useToast();

  const fetchCurrentUser = useCallback(async () => {
    try {
      const storedToken = localStorage.getItem('jobconnect_token');
      if (!storedToken) {
        setUser(null);
        setProfile(null);
        setLoading(false);
        return;
      }

      const res = await API.get('/auth/me');
      if (res.data.success) {
        setUser(res.data.user);
        setProfile(res.data.profile);
        localStorage.setItem('jobconnect_user', JSON.stringify(res.data.user));
      }
    } catch (err) {
      console.error('Failed to restore session:', err);
      setUser(null);
      setProfile(null);
      localStorage.removeItem('jobconnect_token');
      localStorage.removeItem('jobconnect_user');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCurrentUser();
  }, [fetchCurrentUser]);

  // Login handler
  const login = async (email, password) => {
    try {
      const res = await API.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('jobconnect_token', newToken);
        localStorage.setItem('jobconnect_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        await fetchCurrentUser();
        toast.success(`Welcome back, ${userData.name}!`);
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Login failed. Please check your credentials.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Register handler
  const register = async (formData) => {
    try {
      const res = await API.post('/auth/register', formData);
      if (res.data.success) {
        const { token: newToken, user: userData } = res.data;
        localStorage.setItem('jobconnect_token', newToken);
        localStorage.setItem('jobconnect_user', JSON.stringify(userData));
        setToken(newToken);
        setUser(userData);
        await fetchCurrentUser();
        toast.success('Account created successfully! Welcome to JobConnect.');
        return { success: true, user: userData };
      }
    } catch (error) {
      const msg = error.response?.data?.message || 'Registration failed.';
      toast.error(msg);
      return { success: false, message: msg };
    }
  };

  // Logout handler
  const logout = async () => {
    try {
      await API.post('/auth/logout');
    } catch (err) {
      // ignore
    } finally {
      localStorage.removeItem('jobconnect_token');
      localStorage.removeItem('jobconnect_user');
      setToken(null);
      setUser(null);
      setProfile(null);
      toast.info('You have been logged out.');
    }
  };

  // 1-Click Quick Demo Login Helper for Testing Roles
  const quickLogin = async (role) => {
    let email = '';
    let password = '';

    if (role === 'Admin') {
      email = 'admin@jobconnect.com';
      password = 'Admin@123';
    } else if (role === 'Recruiter') {
      email = 'recruiter@jobconnect.com';
      password = 'Recruiter@123';
    } else {
      toast.info('Job Seekers register dynamically! Please sign up or enter your credentials.');
      return { success: false, message: 'Please register a Job Seeker account or sign in with your registered email.' };
    }

    return await login(email, password);
  };

  const updateUserState = (updatedUser, updatedProfile) => {
    if (updatedUser) {
      setUser(updatedUser);
      localStorage.setItem('jobconnect_user', JSON.stringify(updatedUser));
    }
    if (updatedProfile) {
      setProfile(updatedProfile);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        profile,
        token,
        loading,
        login,
        register,
        logout,
        quickLogin,
        refreshUser: fetchCurrentUser,
        updateUserState,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
