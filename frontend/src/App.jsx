import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { Analyzer } from './components/Analyzer';
import { HowItWorks } from './components/HowItWorks';
import { PhotoTips } from './components/PhotoTips';
import { History } from './components/History';
import { About } from './components/About';
import { Footer } from './components/Footer';
import { Toast } from './components/Toast';

export function App() {
  const [backendStatus, setBackendStatus] = useState({
    online: false,
    mockMode: true,
  });

  const [historyItems, setHistoryItems] = useState([]);
  const [toast, setToast] = useState(null);

  // 1. Fetch Backend Health Status
  useEffect(() => {
    const checkBackend = async () => {
      try {
        const res = await fetch('/health');
        if (res.ok) {
          const data = await res.json();
          setBackendStatus({
            online: true,
            mockMode: data.mock_mode ?? true,
          });
        } else {
          setBackendStatus({ online: false, mockMode: true });
        }
      } catch (err) {
        setBackendStatus({ online: false, mockMode: true });
      }
    };

    checkBackend();
    const interval = setInterval(checkBackend, 15000);
    return () => clearInterval(interval);
  }, []);

  // 2. Load LocalStorage History
  useEffect(() => {
    try {
      const saved = localStorage.getItem('farmeye_history');
      if (saved) {
        setHistoryItems(JSON.parse(saved));
      }
    } catch (e) {
      console.error('Failed to parse history from localStorage', e);
    }
  }, []);

  // 3. Save Entry to History (Keep max 10 entries)
  const handleSaveToHistory = (newEntry) => {
    setHistoryItems((prev) => {
      const updated = [newEntry, ...prev.filter((i) => i.id !== newEntry.id)].slice(0, 10);
      try {
        localStorage.setItem('farmeye_history', JSON.stringify(updated));
      } catch (e) {
        console.error('Failed to save history to localStorage', e);
      }
      return updated;
    });
  };

  // 4. Clear History
  const handleClearHistory = () => {
    setHistoryItems([]);
    try {
      localStorage.removeItem('farmeye_history');
      showToast('Scan history cleared.', 'info');
    } catch (e) {
      console.error('Failed to clear history', e);
    }
  };

  // Toast Helper
  const showToast = (message, type = 'info') => {
    setToast({ message, type });
  };

  const handleNavigateToAnalyzer = () => {
    const el = document.getElementById('analyzer');
    if (el) el.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen bg-[#0B0F0E] text-slate-100 flex flex-col font-sans selection:bg-emerald-500/30 selection:text-emerald-300">
      {/* Sticky Navigation */}
      <Navbar
        backendStatus={backendStatus}
        onNavigateToAnalyzer={handleNavigateToAnalyzer}
      />

      {/* Main Content Sections */}
      <main className="flex-grow">
        <Hero
          onSelectUpload={handleNavigateToAnalyzer}
          onSelectCamera={handleNavigateToAnalyzer}
        />

        <Analyzer
          onSaveToHistory={handleSaveToHistory}
          showToast={showToast}
        />

        <HowItWorks />

        <PhotoTips />

        <History
          historyItems={historyItems}
          onClearHistory={handleClearHistory}
        />

        <About />
      </main>

      {/* Footer */}
      <Footer />

      {/* Global Toast Alerts */}
      {toast && (
        <Toast
          message={toast.message}
          type={toast.type}
          onClose={() => setToast(null)}
        />
      )}
    </div>
  );
}

export default App;
