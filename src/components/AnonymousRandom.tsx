import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Shuffle, ArrowLeft, MessageSquare } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { useNameStore } from '../store/nameStore';
import toast from 'react-hot-toast';

export default function AnonymousRandom() {
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
        .eq('room_type', 'anonymous_random')
        .single();
      
      if (data) {
        // Navigate to the random chat room
        navigate(`/anonymous/room/${data.id}`);
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
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-2xl mx-auto">
        <div className="flex items-center mb-8">
          <Link to="/anonymous" className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-3xl font-bold text-gray-800">Anonymous Random Chat</h1>
            <p className="text-gray-600 mt-1">Connect with random strangers anonymously</p>
          </div>
        </div>

        <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
          <div className="text-center">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-gray-100 rounded-full mb-6">
              <Shuffle className="h-10 w-10 text-gray-600" />
            </div>
            
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Ready for Random Chat?</h2>
            <p className="text-gray-600 mb-8">
              Click below to join the anonymous random chat room where you can meet strangers
              from around the world. All conversations are completely anonymous.
            </p>

            <button
              onClick={findRandomChat}
              disabled={isLoading}
              className="inline-flex items-center justify-center px-8 py-4 bg-gray-800 text-white rounded-lg hover:bg-gray-900 transition-colors disabled:opacity-50 disabled:cursor-not-allowed text-lg font-semibold"
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
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
            <p className="text-yellow-800 text-sm">
              🔒 <strong>Privacy:</strong> No names, no profiles, no history. Complete anonymity guaranteed.
            </p>
          </div>
          
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-blue-800 text-sm">
              <MessageSquare className="h-4 w-4 inline mr-2" />
              <strong>How it works:</strong> You'll join a shared room where multiple anonymous users chat together.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}