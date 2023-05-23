import { useState, useEffect } from 'react';

const useAuth = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const admin_role = localStorage.getItem('token');
    setIsLoggedIn(!!token);
  }, []);

  return isLoggedIn;
};

export default useAuth;
