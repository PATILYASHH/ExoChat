import { useEffect, useState } from 'react';
import { Settings, Clock, Database, RefreshCw } from 'lucide-react';

interface MaintenanceProps {
  onMaintenanceEnd?: () => void;
}

export default function MaintenanceMode({ onMaintenanceEnd }: MaintenanceProps) {
  const [timeRemaining, setTimeRemaining] = useState<string>('');
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date();
      const currentHour = now.getHours();
      const currentMinute = now.getMinutes();
      const currentSecond = now.getSeconds();

      // Calculate target end time (12:01 AM)
      let targetTime = new Date();
      
      if (currentHour === 23 && currentMinute >= 55) {
        // If it's between 11:55 PM and 11:59 PM, target is next day 12:01 AM
        targetTime.setDate(targetTime.getDate() + 1);
        targetTime.setHours(0, 1, 0, 0);
      } else if (currentHour === 0 && currentMinute <= 1) {
        // If it's between 12:00 AM and 12:01 AM, target is 12:01 AM today
        targetTime.setHours(0, 1, 0, 0);
      } else {
        // Not in maintenance window, shouldn't be showing this component
        if (onMaintenanceEnd) {
          onMaintenanceEnd();
        }
        return;
      }

      const timeDiff = targetTime.getTime() - now.getTime();
      
      if (timeDiff <= 0) {
        // Maintenance is over
        if (onMaintenanceEnd) {
          onMaintenanceEnd();
        }
        return;
      }

      // Calculate remaining time
      const minutes = Math.floor(timeDiff / (1000 * 60));
      const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);
      
      setTimeRemaining(`${minutes}:${seconds.toString().padStart(2, '0')}`);
      
      // Calculate progress (6 minutes total: 11:55 PM to 12:01 AM)
      const totalMaintenanceTime = 6 * 60 * 1000; // 6 minutes in milliseconds
      const elapsed = totalMaintenanceTime - timeDiff;
      const progressPercent = Math.max(0, Math.min(100, (elapsed / totalMaintenanceTime) * 100));
      setProgress(progressPercent);
    };

    // Update immediately
    updateCountdown();
    
    // Update every second
    const interval = setInterval(updateCountdown, 1000);
    
    return () => clearInterval(interval);
  }, [onMaintenanceEnd]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-orange-50 to-red-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-8 text-center">
        {/* Maintenance Icon */}
        <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-orange-400 to-red-500 rounded-full mb-6">
          <Settings className="h-10 w-10 text-white animate-spin" style={{ animationDuration: '3s' }} />
        </div>

        {/* Title */}
        <h1 className="text-3xl font-bold text-gray-800 mb-4">
          Daily Maintenance
        </h1>

        {/* Description */}
        <p className="text-gray-600 mb-6 text-lg">
          We're performing our daily system cleanup to keep ExoChat running smoothly.
        </p>

        {/* Countdown */}
        <div className="bg-gray-50 rounded-lg p-4 mb-6">
          <div className="flex items-center justify-center mb-2">
            <Clock className="h-5 w-5 text-orange-500 mr-2" />
            <span className="text-sm font-medium text-gray-700">Estimated completion time</span>
          </div>
          <div className="text-2xl font-bold text-orange-600 mb-3">
            {timeRemaining}
          </div>
          
          {/* Progress Bar */}
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-gradient-to-r from-orange-400 to-red-500 h-2 rounded-full transition-all duration-1000"
              style={{ width: `${progress}%` }}
            ></div>
          </div>
        </div>

        {/* Maintenance Tasks */}
        <div className="text-left mb-6">
          <h3 className="font-semibold text-gray-800 mb-3 flex items-center">
            <Database className="h-4 w-4 mr-2 text-blue-500" />
            Maintenance Tasks
          </h3>
          <ul className="space-y-2 text-sm text-gray-600">
            <li className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-2 text-green-500" />
              Clearing chat messages
            </li>
            <li className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-2 text-green-500" />
              Optimizing database
            </li>
            <li className="flex items-center">
              <RefreshCw className="h-3 w-3 mr-2 text-green-500" />
              Updating system cache
            </li>
          </ul>
        </div>

        {/* Info Box */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <p className="text-sm text-blue-800">
            <strong>Daily Reset:</strong> All chat messages are automatically cleared at midnight 
            to ensure optimal performance and privacy.
          </p>
        </div>

        {/* Footer */}
        <div className="mt-6 text-xs text-gray-500">
          Maintenance occurs daily from 11:55 PM to 12:01 AM
        </div>
      </div>
    </div>
  );
}