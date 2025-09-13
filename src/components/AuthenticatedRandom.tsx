import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shuffle, ArrowLeft, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNameStore } from '../store/nameStore';
import toast from 'react-hot-toast';

export default function AuthenticatedRandom() {
  const [isLoading, setIsLoading] = useState(false);
  const { name } = useNameStore();
  const navigate = useNavigate();

  useEffect(() => {
    if (!name) {
      navigate('/name');
      return;
    }
  }, [name, navigate]);

  const findRandomChat = async () => {
    setIsLoading(true);
    try {
      // Get the pre-existing random chat room
      const { data } = await supabase
        .from('chat_rooms')
        .select('*')
        .eq('room_type', 'authenticated_random')
        .single();
      
      if (data) {
        // Navigate to the random chat room
        navigate(`/chat/room/${data.id}`);
      } else {
        toast.error('Random chat room not available at the moment');
      }
    } catch (error) {
      console.error('Error finding random chat:', error);
      toast.error('Failed to connect to random chat');
    } finally {
      setIsLoading(false);
    }
  };

  if (!name) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/chat" className="mr-4 p-2 hover:bg-blue-200 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6 text-blue-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Random Chat</h1>
            <p className="text-gray-600 mt-1">Meet new people with your name visible</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-blue-100 rounded-full mb-6">
              <Shuffle className="h-10 w-10 text-blue-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready to Meet Someone New?</h2>
            <p className="text-gray-600 mb-2">
              Click below to join the random chat lounge where you can meet multiple people
              and have conversations with your name visible.
            </p>
            <p className="text-blue-600 font-medium mb-8">
              Your name "{name}" will be visible to others in this chat.
            </p>

            <button
              onClick={findRandomChat}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
            >
              {isLoading ? (
                <>
                  <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-white mr-3"></div>
                  Finding Chat...
                </>
              ) : (
                <>
                  <Shuffle className="h-5 w-5 mr-3" />
                  Join Random Chat
                </>
              )}
            </button>
          </div>
        </div>

        <div className="mt-8 space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              👤 <strong>Identity:</strong> Your name will be shown to other users in this conversation.
            </p>
          </div>
          
          <div className="bg-green-50 border border-green-200 rounded-lg p-4">
            <p className="text-green-800 text-sm">
              <MessageSquare className="h-4 w-4 inline mr-2" />
              <strong>How it works:</strong> You'll join a shared lounge where multiple users with visible names chat together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}