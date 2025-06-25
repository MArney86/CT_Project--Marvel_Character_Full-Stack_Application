import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import './components.css';

export default function Home() {
    // state variables for managing form data, submission status, character data, modal visibility, validation state, and ID/name list
    const [show, setShow] = useState(false)
    const [showSecond, setShowSecond] = useState(false);
    const [cookies, setCookies] = useState([]);

    const getCookie = (cookieKey) => {
        if (cookies.length === 0) {
            setCookies(decodeURIComponent(document.cookie).split(';').forEach(cookie => (cookie.trim()))); // save the cookies as an array in the cookies state
        }
        console.log(cookies);
        const searchKey = cookieKey + "="; // cookie key to search for
        
        for (let i = 0; i < cookies.length; i++) { // iterate through the cookies
            let c = cookies[i].trim(); // trim the cookies
            if (c.indexOf(searchKey) === 0) { // check if the cookie string starts with the search key
                return c.substring(searchKey.length, c.length); // return the cookie value
            };
        };

        return "";
    }

    useEffect(() => {
        if (getCookie("visited") !== "") {
            setShow(false);
            setShowSecond(true);
        } else {
            document.cookie = "visted=true; max-age=3600; path=/"; // set a cookie to idicatate the user has visited the site
            setShowSecond(false); 
            setShow(false); // reset the show states for the "logging in" animation

            const timeout = setTimeout(() => {
                setShow(true); // Show first alert
                const secondTimeout = setTimeout(() => {
                    setShow(false);
                    setShowSecond(true);
                    clearTimeout(secondTimeout);
                },3000);
                clearTimeout(timeout);
            },3000); // 3 seconds

        }
    },[]);

    return(
        <div className="compBackground w-100 h-100">
            <Alert show={!show && !showSecond} variant='warning' className='w-50 top-50 start-50 translate-middle'>
                <Alert.Heading>Logging in</Alert.Heading>
                <p>Verifying Credentials...</p>
            </Alert>
            <Alert show={show} variant='success' className='w-50 top-50 start-50 translate-middle'>
                <Alert.Heading>Access Granted</Alert.Heading>
                <p>Welcome to the Hero and Villain Database</p>
            </Alert>
            <Alert show={showSecond} variant="info" className="w-50 top-50 start-50 translate-middle">
                <Alert.Heading>Welcome to the Hero and Villain Database</Alert.Heading>
                <p>Here you can view, add, update, and delete characters from the Marvel Universe.</p>
                <p>Use the navigation bar to access the different features.</p>
                <p>Enjoy your stay!</p>
            </Alert>
        </div>
    );
}