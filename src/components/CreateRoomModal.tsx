import { useState } from 'react';
import { X, Hash } from 'lucide-react';
import { supabase } from '../lib/supabase';
import toast from 'react-hot-toast';

interface CreateRoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  onRoomCreated: () => void;
  roomType: 'anonymous_room' | 'authenticated_group';
  title: string;
}

export default function CreateRoomModal({ 
  isOpen, 
  onClose, 
  onRoomCreated, 
  roomType, 
  title 
}: CreateRoomModalProps) {
  const [roomName, setRoomName] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!roomName.trim()) {
      toast.error('Room name is required');
      return;
    }

    if (roomName.trim().length < 3) {
      toast.error('Room name must be at least 3 characters long');
      return;
    }

    setIsLoading(true);
    try {
      const { error } = await supabase
        .from('chat_rooms')
        .insert([{
          name: roomName.trim(),
          room_type: roomType
        }]);

      if (error) throw error;

      toast.success('Room created successfully!');
      setRoomName('');
      onRoomCreated();
      onClose();
    } catch (error: any) {
      toast.error('Failed to create room: ' + error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const handleClose = () => {
    setRoomName('');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-xl shadow-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b">
          <h2 className="text-2xl font-bold text-gray-800">{title}</h2>
          <button
            onClick={handleClose}
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            <X className="h-5 w-5 text-gray-500" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6">
          <div className="mb-6">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Room Name
            </label>
            <div className="relative">
              <Hash className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
              <input
                type="text"
                value={roomName}
                onChange={(e) => setRoomName(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter room name..."
                required
                minLength={3}
                maxLength={50}
                disabled={isLoading}
              />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              Room name must be between 3-50 characters
            </p>
          </div>

          <div className="bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-600">
              {roomType === 'anonymous_room' 
                ? '🔒 This will be an anonymous room where no names are shown.'
                : '👤 This will be a named room where all participants can see each other\'s names.'
              }
            </p>
          </div>

          <div className="flex space-x-3">
            <button
              type="button"
              onClick={handleClose}
              className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading || !roomName.trim()}
              className="flex-1 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {isLoading ? 'Creating...' : 'Create Room'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}