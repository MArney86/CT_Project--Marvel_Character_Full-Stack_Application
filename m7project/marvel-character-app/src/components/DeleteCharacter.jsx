import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import FormModal from './FormModal'
import Spinner from 'react-bootstrap/Spinner';

export default function DeleteProduct() {
    const [loading, setLoading] = useState(false);
    const [charId, setCharId] = useState(0);
    const [submitted, setSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const [error, setError] = useState(null);
    const{ characterId } = useParams();
    const [preload, setPreload] = useState(false);
    const [characters, setCharacters] = useState([]);
    const [character, setCharacter] = useState({});


    useEffect(() => {
        setLoading(true); // enable loading before fetching data
        setError(null); // Reset any possible lingering errors from previous operations

        const id = parseInt(characterId);
        if (!isNaN(id) && id > 0) {
                setCharId(id); // set the formData ID to the provided characterId so that we can fetch the user's desired character data
                setPreload(true); // set preload flag to true so that we only load the character data for the provided ID
        }
        axios.get('http://127.0.0.1:5000/characters') // Fetch all characters from backend
        .then(response => {
            // Populate the idNameList with character IDs and names
            setCharacters(response.data);
            setLoading(false); // Disable loading state after successful fetch
        }).catch(err => { // Handle errors during fetch
            setLoading(false); // disable loading so error can be displayed
            setError(`Could not fetch character list: ${err.message}`);
            console.error("Error fetching character list:", err);
        })
    }, [charId]);

    // Handle change in character ID selection
    const handleChange = (e) => {
        setCharId(e.target.value);
        for (let i=0; i<characters.length; i++) { // loop through characters to find the one with the selected ID then set it in the character state
            if (characters[i].id === parseInt(e.target.value)) {
                setCharacter(characters[i]);
            }
        }
    };

    // Handle form submission for deleting a character
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent default form submission behavior
        setLoading(true); // Enable loading state while processing the request
        setSubmitted(false);
        setError(null);

        if (!charId || isNaN(charId) || Number(charId) < 1) {
            setError('Please enter a valid character ID.');
            return;
        }

        try {
            const res = await axios.delete(`http://127.0.0.1:5000/characters/${charId}`); // Send DELETE request to backend
            setSubmitted(true);
            setShowModal(true);
            setLoading(false);
        } catch (err) {
            setError(`Failed to delete product: ${err.message}`);
            setShowModal(true);
            setLoading(false);
        }
    };

    return (
        <div className='compBackground min-vh-100 min-vw-100 position-relative'>
            {/* Modal to confirm deletion or display errors*/}
            <FormModal character={character} submitted={submitted} showModal={showModal} handleCloseModal={handleCloseModal} request={"delete"} error={error}/>

            <Container className="translucent w-50 h-50 position-absolute top-50 start-50 translate-middle">
                <h2 className='text-white'>Delete Character</h2>

                {/* Form for selecting character to delete and submitting DELETE request */}
                <Form onSubmit={handleSubmit} className='m-3 p-3'>
                    {/* Display loading spinner if data is being fetched */}
                    {loading && (<div className='position-absolute w-100 h-100 bg-secondary bg-opacity-50'>
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                            <Spinner as="span" animation="border" role="status" variant="info" /><span className='text-info'>loading...</span>
                        </div>
                    </div>) }
                <Row className="mt-2 mb-2">
                    <Col md="6">
                        <FloatingLabel controlId="formId" label="ID" className="mb-2 mt-2">
                                <Form.Select 
                                aria-label="Select Character ID from the list" 
                                name="id" 
                                value={charId} 
                                onChange={handleChange} 
                                required 
                                isInvalid={!charId}
                                disabled={preload}>
                                    <option>Please select the ID of the character to update</option>
                                    { characters.map((char) => (
                                        <option 
                                        key={char.id} 
                                        value={char.id}
                                        >
                                            {char.id}: {char.name}
                                        </option>
                                    ))}
                                </Form.Select>
                                <Form.Control.Feedback type="invalid">
                                    Please select a character ID to continue.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                    </Col>
                </Row>
                <Row>
                    <Col md="12">
                        {/* Display error message if there is an error in the form */}
                        <Alert show={!!error} variant="danger">
                            <Alert.Heading>!!!Error!!!</Alert.Heading>
                            <p>{error}</p>
                        </Alert>
                    </Col>
                </Row>
                <Button variant="success" type="submit">
                    Delete
                </Button>
            </Form>
        </Container>
        </div>
    );
}