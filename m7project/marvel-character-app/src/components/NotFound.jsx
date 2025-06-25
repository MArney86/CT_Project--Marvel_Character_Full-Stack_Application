import { useEffect, useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import './components.css'

export default function NotFound() {
  // state to manage the countdown timer and navigation using useNavigate hook
  const navigate = useNavigate();
  const [countdown, setCountdown] = useState(10); // Start countdown at 10 seconds

  useEffect(() => { // Effect to handle countdown and redirection
    // Set up an interval to decrease the countdown
    const interval = setInterval(() => {
      setCountdown((prevCountdown) => prevCountdown - 1);
    }, 1000);

    // Redirect to home route when countdown reaches zero
    const timeout = setTimeout(() => {
      navigate('/'); // Redirect to home
    }, 10000); // 10 seconds

    // Clean up the interval and timeout on component unmount
    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [navigate]);

  return (
    <div className="notFound h-100">
        <div className='text-warning text-center position-absolute top-50 start-50 translate-middle'>
            <h2 className='fw-bolder'>404 Not Found</h2>
            <p>I am sorry, that location does not exist</p>
            <p><b>You will be redirected to the home page in {countdown}...</b></p>
            <p>Or you can always <Link to="/">go home!</Link></p>
        </div>
    </div>
  );
}