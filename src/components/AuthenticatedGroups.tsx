import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Hash, Users, ArrowLeft, MessageSquare, Plus } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNameStore } from '../store/nameStore';
import CreateRoomModal from './CreateRoomModal';

interface ChatRoom {
  id: string;
  name: string;
  room_type: string;
}

export default function AuthenticatedGroups() {
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
      .eq('room_type', 'authenticated_group')
      .order('created_at', { ascending: true });
    
    if (data) setRooms(data);
  };

  const handleRoomCreated = () => {
    fetchRooms(); // Refresh the rooms list
  };

  if (!name) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/chat" className="mr-4 p-2 hover:bg-blue-200 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6 text-blue-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Group Chat</h1>
            <p className="text-gray-600 mt-1">Join organized group discussions with your name visible</p>
          </div>
        </div>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-blue-800 text-sm">
            👤 <strong>Named Chat:</strong> Your name "{name}" will be visible to all participants in these group chats.
          </p>
        </div>

        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Available Groups</h2>
          <button
            onClick={() => setIsCreateModalOpen(true)}
            className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            <Plus className="h-4 w-4 mr-2" />
            Create Group
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {rooms.map((room) => (
            <Link
              key={room.id}
              to={`/chat/room/${room.id}`}
              className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg transition-shadow border border-gray-200 group"
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg group-hover:bg-blue-200 transition-colors">
                    <Hash className="h-6 w-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-800">{room.name}</h2>
                </div>
              </div>
              <div className="flex items-center text-gray-500 mb-4">
                <Users className="h-5 w-5 mr-2" />
                <span>Join group discussion</span>
              </div>
              <div className="flex items-center text-sm text-blue-600">
                <div className="w-2 h-2 bg-blue-400 rounded-full mr-2"></div>
                <span>Named chat • Identity visible</span>
              </div>
            </Link>
          ))}
        </div>

        {rooms.length === 0 && (
          <div className="text-center py-12">
            <MessageSquare className="h-16 w-16 text-blue-300 mx-auto mb-4" />
            <h3 className="text-xl font-semibold text-gray-500 mb-2">No group chats available</h3>
            <p className="text-gray-400">Check back later for new group discussions</p>
          </div>
        )}

        <CreateRoomModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onRoomCreated={handleRoomCreated}
          roomType="authenticated_group"
          title="Create Group Chat"
        />
      </div>
    </div>
  );
}