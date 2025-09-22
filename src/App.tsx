import { BrowserRouter, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import { useEffect } from 'react';
import { startAutoCleanupMonitor } from './services/autoCleanupMonitor';
import ChatRooms from './components/ChatRooms';
import ChatRoom from './components/ChatRoom';
import NameEntry from './components/NameEntry';
import Layout from './components/Layout';
import Home from './components/Home';
import AnonymousChat from './components/AnonymousChat';
import RegularChat from './components/RegularChat';
import AnonymousRooms from './components/AnonymousRooms';
import AnonymousRandom from './components/AnonymousRandom';
import AnonymousChatRoom from './components/AnonymousChatRoom';
import AuthenticatedRandom from './components/AuthenticatedRandom';
import AuthenticatedGroups from './components/AuthenticatedGroups';
import AuthenticatedChatRoom from './components/AuthenticatedChatRoom';
import HackPage from './components/HackPage.tsx';
import HackTransition from './components/HackTransition';
import AdminAuth from './components/AdminAuth';
import AdminDashboard from './components/AdminDashboard';

function AppContent() {
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.ctrlKey && event.shiftKey && event.key === 'H') {
        event.preventDefault();
        navigate('/hack-transition');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [navigate]);

  // Start auto-cleanup monitoring
  useEffect(() => {
    startAutoCleanupMonitor();
    
    // Cleanup function will be handled by the service itself
    return () => {
      // The service handles its own cleanup
    };
  }, []);

  return (
    <>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/name" replace />} />
          <Route path="name" element={<NameEntry />} />
          <Route path="home" element={<Home />} />
          <Route path="hack-transition" element={<HackTransition />} />
          <Route path="hack-main" element={<HackPage />} />
          <Route path="hack" element={<HackPage />} />
          <Route path="admin-auth" element={<AdminAuth />} />
          <Route path="admin-dashboard" element={<AdminDashboard />} />
          
          {/* Alias for admin login */}
          <Route path="login" element={<Navigate to="/admin-auth" replace />} />
          
          {/* Anonymous chat section */}
          <Route path="anonymous" element={<AnonymousChat />} />
          <Route path="anonymous/rooms" element={<AnonymousRooms />} />
          <Route path="anonymous/random" element={<AnonymousRandom />} />
          <Route path="anonymous/room/:id" element={<AnonymousChatRoom />} />
          
          {/* Regular chat section */}
          <Route path="chat" element={<RegularChat />} />
          <Route path="chat/random" element={<AuthenticatedRandom />} />
          <Route path="chat/groups" element={<AuthenticatedGroups />} />
          <Route path="chat/room/:id" element={<AuthenticatedChatRoom />} />
          
          {/* Legacy routes for backward compatibility */}
          <Route path="rooms" element={<ChatRooms />} />
          <Route path="rooms/:id" element={<ChatRoom />} />
          
          {/* Catch-all route for unknown paths */}
          <Route path="*" element={<Navigate to="/name" replace />} />
        </Route>
      </Routes>
    </>
  );
}

function App() {
  return (
    <BrowserRouter
      future={{
        v7_startTransition: true,
        v7_relativeSplatPath: true,
      }}
    >
      <AppContent />
    </BrowserRouter>
  );
}

export default App;