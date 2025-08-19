import { useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';

export const SubdomainRouter = () => {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    // Only redirect if we're on the root path to avoid interfering with deep links
    if (location.pathname !== '/') return;

    const hostname = window.location.hostname;
    
    // Handle subdomain redirects
    if (hostname === 'admin.signalperformance.golf') {
      navigate('/admin', { replace: true });
    } else if (hostname === 'booking.signalperformance.golf') {
      navigate('/client', { replace: true });
    }
    // For main domain (signalperformance.golf) or localhost, do nothing - normal routing applies
  }, [navigate, location.pathname]);

  return null; // This component doesn't render anything
};