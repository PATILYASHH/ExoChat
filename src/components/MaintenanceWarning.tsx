import { useEffect, useState } from 'react';
import { AlertTriangle, X } from 'lucide-react';
import { shouldShowMaintenanceWarning, formatDuration, getMaintenanceInfo } from '../utils/maintenance';

interface MaintenanceWarningProps {
  onDismiss?: () => void;
}

export default function MaintenanceWarning({ onDismiss }: MaintenanceWarningProps) {
  const [showWarning, setShowWarning] = useState(false);
  const [warningMessage, setWarningMessage] = useState('');
  const [isDismissed, setIsDismissed] = useState(false);

  useEffect(() => {
    const updateWarning = () => {
      const shouldShow = shouldShowMaintenanceWarning();
      const info = getMaintenanceInfo();
      
      if (shouldShow && !isDismissed) {
        setShowWarning(true);
        const timeLeft = formatDuration(info.timeUntilMaintenance);
        setWarningMessage(`Maintenance starts in ${timeLeft}. All chats will be cleared at midnight.`);
      } else {
        setShowWarning(false);
      }
    };

    // Update immediately
    updateWarning();
    
    // Update every 30 seconds
    const interval = setInterval(updateWarning, 30000);
    
    return () => clearInterval(interval);
  }, [isDismissed]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowWarning(false);
    if (onDismiss) {
      onDismiss();
    }
  };

  if (!showWarning) {
    return null;
  }

  return (
    <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 shadow-md">
      <div className="flex items-center justify-between">
        <div className="flex items-center">
          <AlertTriangle className="h-5 w-5 text-yellow-400 mr-3" />
          <div>
            <p className="text-sm font-medium text-yellow-800">
              Scheduled Maintenance
            </p>
            <p className="text-sm text-yellow-700">
              {warningMessage}
            </p>
          </div>
        </div>
        <button
          onClick={handleDismiss}
          className="flex-shrink-0 ml-4 p-1 hover:bg-yellow-100 rounded-lg transition-colors"
        >
          <X className="h-4 w-4 text-yellow-600" />
        </button>
      </div>
    </div>
  );
}