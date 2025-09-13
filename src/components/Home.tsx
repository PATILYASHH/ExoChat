import { useNavigate } from 'react-router-dom';
import { useEffect } from 'react';
import { MessageSquare, Users, Shield, Eye, EyeOff } from 'lucide-react';
import { useNameStore } from '../store/nameStore';

export default function Home() {
  const navigate = useNavigate();
  const { name } = useNameStore();

  // If no name is set, redirect to name entry
  useEffect(() => {
    if (!name) {
      navigate('/name');
    }
  }, [name, navigate]);

  // Return null if no name to prevent flash of content
  if (!name) {
    return null;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-blue-500 to-purple-600 rounded-full mb-6">
            <MessageSquare className="h-10 w-10 text-white" />
          </div>
          <h1 className="text-5xl font-bold text-gray-800 mb-4">
            Welcome to ExoChat
          </h1>
          <p className="text-xl text-gray-600 mb-2">
            Hello, <span className="font-semibold text-blue-600">{name}</span>! 
          </p>
          <p className="text-lg text-gray-500">
            Choose your preferred chat experience
          </p>
        </div>
        
        {/* Main Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          
          {/* Anonymous Chat Card */}
          <div 
            onClick={() => navigate('/anonymous')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden transform hover:-translate-y-2"
          >
            <div className="h-2 bg-gradient-to-r from-gray-400 to-gray-600"></div>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4 group-hover:bg-gray-200 transition-colors">
                  <EyeOff className="h-8 w-8 text-gray-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Anonymous Chat</h2>
                <p className="text-gray-600 text-lg">
                  Chat without revealing your identity
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Shield className="h-5 w-5 text-gray-500" />
                  <span>Complete privacy protection</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <MessageSquare className="h-5 w-5 text-gray-500" />
                  <span>No names or profiles visible</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Users className="h-5 w-5 text-gray-500" />
                  <span>Topic rooms & random chats</span>
                </div>
              </div>
              
              <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 mb-6">
                <p className="text-yellow-800 text-sm">
                  🔒 <strong>Privacy Mode:</strong> Your messages will appear as "Anonymous User" to everyone
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center text-gray-500 group-hover:text-gray-700 transition-colors">
                  <span className="mr-2">Enter Anonymous Mode</span>
                  <div className="transform group-hover:translate-x-1 transition-transform">→</div>
                </div>
              </div>
            </div>
          </div>
          
          {/* Regular Chat Card */}
          <div 
            onClick={() => navigate('/chat')}
            className="group bg-white rounded-2xl shadow-lg hover:shadow-2xl transition-all duration-300 cursor-pointer border border-gray-100 overflow-hidden transform hover:-translate-y-2"
          >
            <div className="h-2 bg-gradient-to-r from-blue-400 to-purple-600"></div>
            <div className="p-8">
              <div className="text-center mb-6">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4 group-hover:bg-blue-200 transition-colors">
                  <Eye className="h-8 w-8 text-blue-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-800 mb-3">Regular Chat</h2>
                <p className="text-gray-600 text-lg">
                  Chat with your name visible to others
                </p>
              </div>
              
              <div className="space-y-4 mb-6">
                <div className="flex items-center space-x-3 text-gray-700">
                  <Users className="h-5 w-5 text-blue-500" />
                  <span>Social connections with identity</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <MessageSquare className="h-5 w-5 text-blue-500" />
                  <span>Names and profiles visible</span>
                </div>
                <div className="flex items-center space-x-3 text-gray-700">
                  <Shield className="h-5 w-5 text-blue-500" />
                  <span>Group chats & random meetings</span>
                </div>
              </div>
              
              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                <p className="text-blue-800 text-sm">
                  👤 <strong>Named Mode:</strong> Your name "{name}" will be visible to other users
                </p>
              </div>
              
              <div className="text-center">
                <div className="inline-flex items-center text-blue-500 group-hover:text-blue-700 transition-colors">
                  <span className="mr-2">Start Named Chat</span>
                  <div className="transform group-hover:translate-x-1 transition-transform">→</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Footer Info */}
        <div className="text-center mt-12">
          <p className="text-gray-500">
            You can switch between modes anytime • Your choice, your privacy
          </p>
        </div>
      </div>
    </div>
  );
}