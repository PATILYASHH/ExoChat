import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { format } from 'date-fns';
import { Send } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNameStore } from '../store/nameStore';
import toast from 'react-hot-toast';

interface Message {
  id: string;
  content: string;
  user_name: string;
  created_at: string;
}

interface ChatRoom {
  id: string;
  name: string;
}

export default function ChatRoom() {
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
        navigate('/rooms');
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
        user_name: name
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

  return (
    <div className="max-w-4xl mx-auto">
      <div className="bg-white rounded-lg shadow-md">
        <div className="p-4 border-b">
          <h1 className="text-2xl font-bold">{room.name}</h1>
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
                      isCurrentUser ? 'text-white' : 'text-gray-900'
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

        <form onSubmit={handleSubmit} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 p-2 border rounded-md"
              required
              disabled={isLoading}
            />
            <button
              type="submit"
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
            >
              <Send className="h-5 w-5" />
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}