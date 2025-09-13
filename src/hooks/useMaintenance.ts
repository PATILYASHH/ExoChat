import { useEffect, useState } from 'react';
import { isMaintenanceTime, getMaintenanceInfo, shouldShowMaintenanceWarning } from '../utils/maintenance';

export function useMaintenanceStatus() {
  const [maintenanceInfo, setMaintenanceInfo] = useState(() => getMaintenanceInfo());

  useEffect(() => {
    const updateStatus = () => {
      setMaintenanceInfo(getMaintenanceInfo());
    };

    // Update every minute
    const interval = setInterval(updateStatus, 60000);
    
    return () => clearInterval(interval);
  }, []);

  return maintenanceInfo;
}

export function useMaintenanceCheck() {
  const [inMaintenance, setInMaintenance] = useState(() => isMaintenanceTime());
  const [showWarning, setShowWarning] = useState(() => shouldShowMaintenanceWarning());

  useEffect(() => {
    const checkStatus = () => {
      setInMaintenance(isMaintenanceTime());
      setShowWarning(shouldShowMaintenanceWarning());
    };

    // Check every 30 seconds for more responsive updates
    const interval = setInterval(checkStatus, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return { inMaintenance, showWarning };
}