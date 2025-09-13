import { Link } from 'react-router-dom';
import { ArrowLeft, Hash, Shuffle, Shield } from 'lucide-react';

export default function AnonymousChat() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="flex items-center mb-8">
          <Link to="/home" className="mr-4 p-2 hover:bg-gray-200 rounded-lg transition-colors">
            <ArrowLeft className="h-6 w-6 text-gray-600" />
          </Link>
          <div>
            <h1 className="text-4xl font-bold text-gray-800">Anonymous Chat</h1>
            <p className="text-gray-600 mt-1">Complete privacy • No identity required</p>
          </div>
        </div>

        {/* Privacy Notice */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 mb-8">
          <div className="flex items-center mb-2">
            <Shield className="h-5 w-5 text-yellow-600 mr-2" />
            <h3 className="font-semibold text-yellow-800">Privacy Protected</h3>
          </div>
          <p className="text-yellow-700">
            In anonymous mode, your identity is completely hidden. All messages will appear as "Anonymous User" regardless of who sends them.
          </p>
        </div>

        {/* Chat Options */}
        <div className="grid md:grid-cols-2 gap-6">
          
          {/* Chat Rooms */}
          <Link
            to="/anonymous/rooms"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6 group-hover:bg-gray-200 transition-colors">
                <Hash className="h-8 w-8 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Chat Rooms</h2>
              <p className="text-gray-600 mb-6">
                Join topic-based discussions with complete anonymity. Perfect for sharing thoughts without revealing identity.
              </p>
              <ul className="text-left space-y-2 text-gray-700 mb-6">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  General discussions
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  Topic-based rooms
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  Persistent conversations
                </li>
              </ul>
              <div className="text-gray-500 group-hover:text-gray-700 transition-colors">
                Browse Anonymous Rooms →
              </div>
            </div>
          </Link>

          {/* Random Chat */}
          <Link
            to="/anonymous/random"
            className="bg-white p-8 rounded-xl shadow-lg hover:shadow-xl transition-all duration-300 border border-gray-200 group transform hover:-translate-y-1"
          >
            <div className="text-center">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-gray-100 rounded-full mb-6 group-hover:bg-gray-200 transition-colors">
                <Shuffle className="h-8 w-8 text-gray-600" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Random Chat</h2>
              <p className="text-gray-600 mb-6">
                Connect with random strangers instantly. Both participants remain completely anonymous throughout the conversation.
              </p>
              <ul className="text-left space-y-2 text-gray-700 mb-6">
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  Instant connections
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  Complete strangers
                </li>
                <li className="flex items-center">
                  <div className="w-2 h-2 bg-gray-400 rounded-full mr-3"></div>
                  No identity traces
                </li>
              </ul>
              <div className="text-gray-500 group-hover:text-gray-700 transition-colors">
                Start Random Chat →
              </div>
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
}