import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Users } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNameStore } from '../store/nameStore';

interface ChatRoom {
  id: string;
  name: string;
}

export default function ChatRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const { name } = useNameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      navigate('/name');
      return;
    }

    const fetchRooms = async () => {
      const { data } = await supabase
        .from('chat_rooms')
        .select('*')
        .order('created_at', { ascending: true });
      
      if (data) setRooms(data);
    };

    fetchRooms();
  }, [name, navigate]);

  if (!name) return null;

  return (
    <div>
      <h1 className="text-3xl font-bold mb-8">Chat Rooms</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {rooms.map((room) => (
          <Link
            key={room.id}
            to={`/rooms/${room.id}`}
            className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow"
          >
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <MessageSquare className="h-6 w-6 text-blue-500" />
                <h2 className="text-xl font-semibold">{room.name}</h2>
              </div>
            </div>
            <div className="flex items-center text-gray-500">
              <Users className="h-5 w-5 mr-2" />
              <span>Join the conversation</span>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}