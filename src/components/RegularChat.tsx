import { Link } from 'react-router-dom';
import { ArrowLeft, Hash, Shuffle, Users } from 'lucide-react';
import { useNameStore } from '../store/nameStore';

export default function RegularChat() {
  const { name } = useNameStore();

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/home" className="mr-4 p-2 hover:bg-blue-200 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6 text-blue-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Regular Chat</h1>
            <p className="text-gray-600 mt-1">Social connections • Identity visible</p>
          </div>
        </div>

        {/* Identity Notice */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-2">
            <Users className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="font-semibold text-blue-800">Named Chat Mode</h3>
          </div>
          <p className="text-blue-700">
            Your name "<strong>{name}</strong>" will be visible to other participants. This allows for more personal and social conversations.
          </p>
        </div>

        {/* Chat Options */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Random Chat */}
          <Link
            to="/chat/random"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <Shuffle className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Random Chat</h2>
              <p className="text-gray-600 mb-6">
                Meet new people randomly with your name visible. Great for making new connections and having meaningful conversations.
              </p>
              <ul className="text-left space-y-2 text-gray-700 mb-6">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Meet new people
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Names are visible
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Social connections
                </li>
              </ul>
              <div className="text-blue-500 group-hover:text-blue-700 transition-colors">
                Start Random Chat →
              </div>
            </div>
          </Link>

          {/* Group Chat */}
          <Link
            to="/chat/groups"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-100 rounded-full mb-6 group-hover:bg-blue-200 transition-colors">
                <Hash className="h-8 w-8 text-blue-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Group Chat</h2>
              <p className="text-gray-600 mb-6">
                Join organized group discussions where everyone's identity is visible. Perfect for community building and topic discussions.
              </p>
              <ul className="text-left space-y-2 text-gray-700 mb-6">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Organized discussions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Community building
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-blue-400 rounded-full mr-3"></div>
                  Multiple participants
                </li>
              </ul>
              <div className="text-blue-500 group-hover:text-blue-700 transition-colors">
                Browse Group Chats →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}