import React, { useState, useEffect } from 'react';
import { supabase } from './supabase';
import Auth from './Auth';
import Admin from './Admin';
import SubjectSelection from "./SubjectSelection";
import TestEngine from './TestEngine';
import ResultReview from './ResultReview';

export default function App() {
  const [session, setSession] = useState(null);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState('auth'); // 'auth', 'admin', 'selection', 'test', 'review'

  const [testConfig, setTestConfig] = useState(null);
  const [testResult, setTestResult] = useState(null);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setSession(session);
      if (session) fetchProfile(session.user);
      else setLoading(false);
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      setSession(session);
      if (session) fetchProfile(session.user);
      else {
        setProfile(null);
        setView('auth');
        setLoading(false);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  const fetchProfile = async (user) => {
    try {
      let { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', user.id)
        .single();

      if (error && error.code === 'PGRST116') {
        const isAdmin = user.email === 'praiz1758@gmail.com';
        const { data: newProfile, error: insertError } = await supabase
          .from('profiles')
          .insert([{ id: user.id, email: user.email, is_admin: isAdmin }])
          .select()
          .single();

        if (!insertError) data = newProfile;
      }

      setProfile(data);
      if (data?.is_admin) setView('admin');
      else setView('selection');
    } catch (err) {
      console.error('Error fetching profile:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleStartTest = (config) => {
    setTestConfig(config);
    setView('test');
  };

  const handleFinishTest = (resultData) => {
    setTestResult(resultData);
    setView('review');
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-gray-600 font-semibold">Loading CBT Portal...</p>
      </div>
    );
  }

  if (!session) return <Auth />;

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900">
      {/* Navigation Header */}
      <header className="bg-whatsapp-primary text-white p-4 shadow flex justify-between items-center">
        <h1 className="text-xl font-bold">OAU PUTME CBT PORTAL</h1>
        <div className="flex items-center space-x-4">
          <span className="text-sm">{session.user.email}</span>
          {profile?.is_admin && (
            <button
              onClick={() => setView(view === 'admin' ? 'selection' : 'admin')}
              className="bg-white text-whatsapp-primary px-3 py-1 rounded text-sm font-bold"
            >
              {view === 'admin' ? 'Student View' : 'Admin Panel'}
            </button>
          )}
          <button
            onClick={() => supabase.auth.signOut()}
            className="bg-red-600 text-white px-3 py-1 rounded text-sm font-bold hover:bg-red-700"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main App Router */}
      <main className="p-4 max-w-5xl mx-auto">
        {view === 'admin' && <Admin />}
        {view === 'selection' && <SubjectSelection onStartTest={handleStartTest} />}
        {view === 'test' && (
          <TestEngine config={testConfig} onFinish={handleFinishTest} />
        )}
        {view === 'review' && (
          <ResultReview result={testResult} onRestart={() => setView('selection')} />
        )}
      </main>
    </div>
  );
}