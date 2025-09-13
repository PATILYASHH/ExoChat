import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';

export default function AdminAuth() {
  const [input, setInput] = useState('');
  const [timeLeft, setTimeLeft] = useState(10);
  const [isExpired, setIsExpired] = useState(false);
  const navigate = useNavigate();
  const inputRef = useRef<HTMLInputElement>(null);

  const ADMIN_PASSWORD = 'yashpatil';

  useEffect(() => {
    // Focus on input immediately
    inputRef.current?.focus();

    // Start countdown timer
    const timer = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          setIsExpired(true);
          // Redirect to home after timeout
          setTimeout(() => {
            navigate('/home');
          }, 1000);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  useEffect(() => {
    // Check password on every input change
    if (input.toLowerCase() === ADMIN_PASSWORD.toLowerCase()) {
      // Success - redirect to admin dashboard
      navigate('/admin-dashboard');
    }
  }, [input, navigate]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!isExpired) {
      setInput(e.target.value);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      navigate('/home');
    }
  };

  if (isExpired) {
    return (
      <div className="fixed inset-0 bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-6xl text-red-500 mb-4">⏰</div>
          <div className="text-2xl font-bold text-red-600 mb-2">Access Denied</div>
          <div className="text-gray-600">Time expired. Redirecting...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-white flex items-center justify-center">
      <div className="text-center max-w-md mx-auto p-8">
        {/* Timer Display */}
        <div className="mb-8">
          <div className={`text-6xl font-bold mb-4 ${timeLeft <= 3 ? 'text-red-500 animate-pulse' : 'text-gray-700'}`}>
            {timeLeft}
          </div>
          <div className="text-lg text-gray-600">
            seconds remaining
          </div>
        </div>

        {/* Input Field */}
        <div className="mb-6">
          <input
            ref={inputRef}
            type="password"
            value={input}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            className="w-full px-4 py-3 text-xl text-center border-2 border-gray-300 rounded-lg focus:outline-none focus:border-blue-500 bg-gray-50"
            placeholder="Enter admin password..."
            autoComplete="off"
            disabled={isExpired}
          />
        </div>

        {/* Progress Bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <div 
            className={`h-2 rounded-full transition-all duration-1000 ${
              timeLeft <= 3 ? 'bg-red-500' : timeLeft <= 6 ? 'bg-yellow-500' : 'bg-green-500'
            }`}
            style={{ width: `${(timeLeft / 10) * 100}%` }}
          ></div>
        </div>

        {/* Instructions */}
        <div className="text-sm text-gray-500">
          <p className="mb-1">Enter the admin password to continue</p>
          <p>Press ESC to cancel</p>
        </div>

        {/* Visual indicator for typing */}
        {input.length > 0 && (
          <div className="mt-4 flex justify-center">
            {Array.from({ length: input.length }).map((_, i) => (
              <div key={i} className="w-2 h-2 bg-blue-500 rounded-full mx-1 animate-pulse"></div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}