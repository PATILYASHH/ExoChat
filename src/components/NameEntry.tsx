import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { MessageSquare } from 'lucide-react';
import { useNameStore } from '../store/nameStore';
import toast from 'react-hot-toast';

export default function NameEntry() {
  const [name, setName] = useState('');
  const navigate = useNavigate();
  const setStoredName = useNameStore((state) => state.setName);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    if (name.trim().length < 2) {
      toast.error('Name must be at least 2 characters long');
      return;
    }

    setStoredName(name.trim());
    toast.success('Welcome to ExoChat!');
    navigate('/home');
  };

  return (
    <div className="max-w-md mx-auto">
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="flex justify-center mb-6">
          <MessageSquare className="h-12 w-12 text-blue-500" />
        </div>
        <h2 className="text-2xl font-bold text-center mb-6">
          Welcome to ExoChat
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Enter Your Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              required
              minLength={2}
              maxLength={30}
              placeholder="How should we call you?"
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
          >
            Start Chatting
          </button>
        </form>
      </div>
    </div>
  );
}