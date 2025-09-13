import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Send, ArrowLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useNameStore } from '../store/nameStore';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  user_name: string;
  created_at: string;
  show_names: boolean;
}

interface ChatRoom {
  id: string;
  name: string;
  room_type: string;
}

export default function AuthenticatedChatRoom() {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { name } = useNameStore();
  const [room, setRoom] = useState<ChatRoom | null>(null);
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const [isLoading, setIsLoading] = useState(false);

  // Function to fetch messages
  const fetchMessages = async () => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('room_id', id)
        .order('created_at', { ascending: true });

      if (error) throw error;
      if (data) {
        setMessages(data);
      }
    } catch (error: any) {
      console.error('Error fetching messages:', error);
    }
  };

  useEffect(() => {
    if (!name) {
      navigate('/name');
      return;
    }

    const fetchRoom = async () => {
      if (!id) return;
      
      const { data: roomData, error: roomError } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('id', id)
        .single();
      
      if (roomError) {
        toast.error('Failed to load chat room');
        navigate('/chat');
        return;
      }
      
      if (roomData) {
        setRoom(roomData);
      }
    };

    fetchRoom();
    fetchMessages(); // Initial fetch

    // Set up polling interval
    const interval = setInterval(fetchMessages, 1000);

    // Cleanup
    return () => {
      clearInterval(interval);
    };
  }, [id, navigate, name]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!room || !newMessage.trim() || !name || isLoading) return;

    setIsLoading(true);
    try {
      const message = {
        room_id: id,
        content: newMessage,
        user_name: name,
        show_names: true // Always true for authenticated chats
      };

      const { error } = await supabase.from('messages').insert([message]);
      
      if (error) throw error;
      
      setNewMessage('');
      // Fetch messages immediately after sending
      await fetchMessages();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  if (!room || !name) return null;

  const getBackLink = () => {
    if (room.room_type === 'authenticated_random') {
      return '/chat/random';
    }
    return '/chat/groups';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-4 border-b bg-blue-50 rounded-t-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-4">
                <Link to={getBackLink()} className="p-2 hover:bg-blue-200 rounded-lg transition-colors">
                  <ArrowLeft className="h-5 w-5 text-blue-600" />
                </Link>
                <div>
                  <h1 className="text-2xl font-bold text-gray-800">{room.name}</h1>
                  <p className="text-sm text-blue-600">Named Chat - Identities visible</p>
                </div>
              </div>
              <div className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm font-medium">
                👤 Named Chat
              </div>
            </div>
          </div>

          <div className="h-[600px] overflow-y-auto p-4">
            <div className="space-y-4">
              {messages.map((message) => {
                const isCurrentUser = message.user_name === name;

                return (
                  <div
                    key={message.id}
                    className={`flex flex-col ${
                      isCurrentUser ? 'items-end' : 'items-start'
                    }`}
                  >
                    <div
                      className={`max-w-[70%] rounded-lg p-3 ${
                        isCurrentUser ? 'bg-blue-500 text-white' : 'bg-gray-100'
                      }`}
                    >
                      <p className={`text-sm font-medium mb-1 ${
                        isCurrentUser ? 'text-blue-100' : 'text-blue-600'
                      }`}>
                        {isCurrentUser ? 'You' : message.user_name}
                      </p>
                      <p className={isCurrentUser ? 'text-white' : 'text-gray-900'}>
                        {message.content}
                      </p>
                    </div>
                    <span className="text-xs text-gray-500 mt-1">
                      {format(new Date(message.created_at), 'HH:mm')}
                    </span>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          </div>

          <form onSubmit={handleSubmit} className="p-4 border-t bg-blue-50 rounded-b-lg">
            <div className="flex space-x-2">
              <input
                type="text"
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                placeholder={`Type your message as ${name}...`}
                className="flex-1 p-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
                disabled={isLoading}
              />
              <button
                type="submit"
                disabled={isLoading}
                className="bg-blue-500 text-white px-6 py-3 rounded-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50 transition-colors"
              >
                <Send className="h-5 w-5" />
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}