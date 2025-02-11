import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import ChatRooms from './components/ChatRooms';
import ChatRoom from './components/ChatRoom';
import NameEntry from './components/NameEntry';
import Layout from './components/Layout';

function App() {
  return (
    <BrowserRouter>
      <Toaster position="top-center" />
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Navigate to="/name" replace />} />
          <Route path="name" element={<NameEntry />} />
          <Route path="rooms" element={<ChatRooms />} />
          <Route path="rooms/:id" element={<ChatRoom />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;