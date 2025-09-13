import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
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

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/name" replace />} />
          <Route path="name" element={<NameEntry />} />
          <Route path="home" element={<Home />} />
          
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
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;