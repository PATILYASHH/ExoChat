import { Link } from 'react-router-dom';
import { MessageSquare, Users, Shuffle, Hash } from 'lucide-react';

export default function ChatMode() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-4 text-gray-800">
          Choose Your Chat Experience
        </h1>
        <p className="text-center text-gray-600 mb-12 text-lg">
          Select how you want to chat with others
        </p>
        
        <div className="grid md:grid-cols-2 gap-8">
          {/* Anonymous Chat Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-4">
                <MessageSquare className="h-8 w-8 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Anonymous Chat</h2>
              <p className="text-gray-600">Chat without revealing your identity</p>
            </div>
            
            <div className="space-y-4">
              <Link
                to="/anonymous/rooms"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Hash className="h-6 w-6 text-gray-500 group-hover:text-gray-700" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Chat Rooms</h3>
                    <p className="text-sm text-gray-600">Join topic-based rooms</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600">→</div>
              </Link>
              
              <Link
                to="/anonymous/random"
                className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Shuffle className="h-6 w-6 text-gray-500 group-hover:text-gray-700" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Random Chat</h3>
                    <p className="text-sm text-gray-600">Chat with random strangers</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600">→</div>
              </Link>
            </div>
            
            <div className="mt-6 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <p className="text-sm text-yellow-800">
                🔒 <strong>Privacy:</strong> Your identity remains completely anonymous. No names are shown.
              </p>
            </div>
          </div>
          
          {/* Named Chat Section */}
          <div className="bg-white rounded-xl shadow-lg p-8 border border-gray-200">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">Named Chat</h2>
              <p className="text-gray-600">Chat with your name visible to others</p>
            </div>
            
            <div className="space-y-4">
              <Link
                to="/chat/random"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Shuffle className="h-6 w-6 text-blue-500 group-hover:text-blue-700" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Random Chat</h3>
                    <p className="text-sm text-gray-600">Meet new people randomly</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600">→</div>
              </Link>
              
              <Link
                to="/chat/groups"
                className="flex items-center justify-between p-4 bg-blue-50 rounded-lg hover:bg-blue-100 transition-colors group"
              >
                <div className="flex items-center space-x-3">
                  <Hash className="h-6 w-6 text-blue-500 group-hover:text-blue-700" />
                  <div>
                    <h3 className="font-semibold text-gray-800">Group Chat</h3>
                    <p className="text-sm text-gray-600">Join organized group discussions</p>
                  </div>
                </div>
                <div className="text-gray-400 group-hover:text-gray-600">→</div>
              </Link>
            </div>
            
            <div className="mt-6 p-4 bg-blue-50 rounded-lg border border-blue-200">
              <p className="text-sm text-blue-800">
                👤 <strong>Identity:</strong> Your chosen name will be visible to other users in the chat.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}