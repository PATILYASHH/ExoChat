import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { MessageSquare, Users, ArrowLeft, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNameStore } from '../store/nameStore';
import CreateRoomModal from './CreateRoomModal';

interface ChatRoom {
  id: string;
  name: string;
  room_type: string;
}

export default function AnonymousRooms() {
  const [rooms, setRooms] = useState<ChatRoom[]>([]);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const { name } = useNameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      navigate('/name');
      return;
    }

    fetchRooms();
  }, [name, navigate]);

  const fetchRooms = async () => {
    const { data } = await supabase
      .from('chat_rooms')
      .select('*')
      .eq('room_type', 'anonymous_room')
      .order('created_at', { ascending: true });
    
    if (data) setRooms(data);
  };

  const handleRoomCreated = () => {
    fetchRooms(); // Refresh the rooms list
  };

  if (!name) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/anonymous" className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Anonymous Chat Rooms</h1>
            <p className="text-gray-600 mt-1">Join discussions without revealing your identity</p>
          </div>
        </div>

        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-8">
          <p className="text-yellow-800 text-sm">
            🔒 <strong>Anonymous Mode:</strong> Your messages will not show any name. Everyone appears as "Anonymous User"
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Available Rooms</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Room
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link
              key={room.id}
              to={`/anonymous/room/${room.id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-gray-100 rounded-lg group-hover:bg-gray-200 transition-colors">
                    <MessageSquare className="h-6 w-6 text-gray-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">{room.name}</h2>
                </div>
              </div>
              <div className="flex items-center text-gray-500">
                <Users className="h-5 w-5 mr-2" />
                <span>Join anonymous discussion</span>
              </div>
              <div className="mt-4 flex items-center text-sm text-gray-400">
                <div className="w-2 h-2 bg-green-400 rounded-full mr-2"></div>
                <span>Anonymous • No names shown</span>
              </div>
            </Link>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No anonymous rooms available</h3>
            <p className="text-gray-400">Check back later for new chat rooms</p>
          </div>
        )}

        <CreateRoomModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onRoomCreated={handleRoomCreated}
          roomType="anonymous_room"
          title="Create Anonymous Room"
        />
      </div>
    </div>
  );
}