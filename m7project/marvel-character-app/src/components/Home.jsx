import { useState, useEffect } from 'react';
import Alert from 'react-bootstrap/Alert';
import styles from './Home.module.css';

export default function Home() {
    const [show, setShow] = useState(false)

    useEffect(() => {
        const timeout = setTimeout(() => {
            setShow(true); // Show first alert
        },2000); // 2 seconds

        return () => {
            clearTimeout(timeout);
        };
    },[]);

    return(
        <div className={`${styles.home} w-100 h-100`}>
            <Alert show={!show} variant='warning' className='w-50 top-50 start-50 translate-middle'>
                <Alert.Heading>Logging in</Alert.Heading>
                <p>Verifying Credentials...</p>
            </Alert>
            <Alert show={show} variant='success' className='w-50 top-50 start-50 translate-middle'>
                <Alert.Heading>Access Granted</Alert.Heading>
                <p>Welcome to the Hero and Villain Database</p>
            </Alert>
        </div>
    );
}