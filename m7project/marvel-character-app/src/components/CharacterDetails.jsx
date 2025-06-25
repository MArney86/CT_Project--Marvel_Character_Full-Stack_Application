import { useParams, useNavigate, redirect } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'
import Spinner from 'react-bootstrap/Spinner'
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import Button from 'react-bootstrap/Button'
import './components.css';

export default function CharacerDetails ({loading, setLoading, error, setError}) {
    //Variables and naviations for character details page
    const { characterId } = useParams();
    const [character, setCharacter] = useState({
        id: 0,
        name: "",
        image_url: "",
        alias: "",
        alignment: "",
        powers: "",
    });
    const navigate = useNavigate();
    
    //Fetch character data from the API
    //If the character does not exist, redirect to 404 page
    //If the character exists, set the character state with the data
    useEffect(() => { 
        setLoading(true)
        axios.get(`http://127.0.0.1:5000/characters/${characterId}`) // Fetch character data from the API
        .then(response => {
            // Check if the response data is empty, if so, redirect to 404 page
            if (Object.keys(response.data).length === 0) { 
                console.log("test")
                setLoading(false);
                navigate('/404');
            }
            // If the character exists, set the character state with the data
            const data = response.data
            setCharacter({
                id: data.id,
                name: data.name,
                image_url: data.image_url,
                alias: data.alias,
                alignment: data.alignment,
                powers: data.powers,
            });
            setLoading(false); // Set loading to false after fetching the data to reveal the character details
        }).catch(e => {
            setError(`Failed to fetch character: ${e.message}`);
            setLoading(false);
        })
    },[characterId]);

    //Function to format the powers string into a list of powers
    const getPowers = () => {
            return character.powers.split(", ").map((value, index) => ( //return an array of formatted powers from splitting the powers string
                // If the power starts with "and " remove it, then; whether having to remove an and first or not, capitalize the first letter of the current first word
                value.substring(0,4) === "and " ? <span key={index}> {value.substring(4).charAt(0).toUpperCase() + value.substring(5)}</span>:<span key={index}>{value.charAt(0).toUpperCase() + value.substring(1)}</span>
            ));
    }

    //Function to handle button clicks for updating or deleting the character
    const buttonClick = (path) => {
        navigate(path);

    }

    return(
        <div className="compBackground container d-flex flex-column justify-content-center align-items-center min-vh-100 min-vw-100">
            {/* If loading is true, show a spinner overlay */}
            {loading && (<div className="position-absolute w-100 h-100 bg-secondary bg-opacity-50">
                <div className="d-flex justify-content-center align-items-center h-100 w-100">
                    <Spinner animation="border" role="status" variant="secondary" />
                </div>
            </div>)}

            <div className="translucent text-center w-50 p-3 rounded-3 h-100 text-white">
                {/*Character Names and Image*/}
                <h1 className="mb-4">{character.name}</h1>
                <img  className="border border-3 rounded-3 border-secondary-subtle m-3 p-2" src={character.image_url === '' ? null:character.image_url} />
                <h4>a.k.a.: {character.alias}</h4>
                <div>
                    <Row xs={1} className="justify-content-center">
                        <Col>
                            {/* Table to for aligning other information on the page below the image/names block */}
                            <Table hover className="tableTranslucent w-25 fw-bold mx-auto text-white">
                                <tbody>
                                    <tr>
                                        <th>Alignment:</th>
                                        <td>{character.alignment}</td>
                                    </tr>
                                    <tr>
                                        <th>Powers:</th>
                                        <td>
                                            <ul>
                                                {/* Map through the generated powers array and display each power in a list item */}
                                                {getPowers().map((value, index) => 
                                                    <li key={index}>{value}</li>
                                                )}
                                            </ul>
                                        </td>
                                    </tr>
                                </tbody>
                            </Table>
                        </Col>
                    </Row>
                    <Row className="w-50 mx-auto mt-3" xs={1} md={2}>
                        {/* (extra functionality added) Buttons for updating or deleting the character */}
                        <Col className="text-start mb-2 mb-sm-0">
                            <Button
                                variant='warning'
                                onClick={() => buttonClick(`/update/${character.id}`)}>
                                    Update Information
                            </Button>
                        </Col>
                        <Col className="text-end">
                            <Button
                                variant='danger'
                                onClick={() => buttonClick(`/delete/${character.id}`)}>
                                    Delete Entry
                            </Button>
                        </Col>
                    </Row>
                </div>
            </div>

            {/* If there is an error, show an alert with the error message */}
            {error && <Alert show={error === true} variant="danger">
                <Alert.Heading>!!!Error!!!</Alert.Heading>
                <p>{error}</p>
            </Alert>}
        </div>
    );
}