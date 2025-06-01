import { useState, useEffect } from 'react';
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
    const [characterId, setCharacterId] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const [error, setError] = useState(null);
    const [response, setResponse] = useState(null);
    const idNameList = [];
    preload = false; // Flag to indicate if we are preloading data based on characterId

    useEffect(() => {
        setLoading(true); // enable loading before fetching data
        setError(null); // Reset any possible lingering errors from previous operations

        const id = parseInt(characterId);
        if (!isNaN(id) && id > 0) {
                setFormData(prev => ({ ...prev, id: id})); // set the formData ID to the provided characterId so that we can fetch the user's desired character data
                setPreload(true); // set preload flag to true so that we only load the character data for the provided ID
        } else {
            axios.get('127.0.0.1:5000/characters') // Fetch all characters from backend
            .then(response => {
                // Populate the idNameList with character IDs and names
                response.data.forEach(char => {
                    idNameList.push({id: char.id, name: char.name})
                });
                preload = false; // set preload flag to false so that we can load the character data for the selected ID
            }).catch(err => { // Handle errors during fetch
                setLoading(false); // disable loading so error can be displayed
                setError(`Could not fetch character list: ${err.message}`);
                console.error("Error fetching character list:", err);
            })
        }

    }, []);

    const handleChange = (e) => {
        setCharacterId(e.target.value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(false);
        setError(null);
        setResponse(null);

        if (!characterId || isNaN(productId) || Number(productId) < 1) {
            setError('Please enter a valid product ID.');
            return;
        }

        try {
            const res = await axios.delete(`http://127.0.0.1:5000/characters/${characterId}`);
            setResponse(res.data);
            setSubmitted(true);
            setShowModal(true);
        } catch (err) {
            setError(`Failed to delete product: ${err.message}`);
            setShowModal(true);
        }
    };

    return (
        <Container className="mt-5">
            <h2>Delete Product</h2>
            <FormModal product={response} submitted={submitted} showModal={showModal} handleCloseModal={handleCloseModal} request={'delete'} error={error} />
            <Form onSubmit={handleSubmit}>
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
                                value="{characterId}" 
                                onChange="{handleChange}" 
                                required 
                                isInvalid={!characterId}
                                disabled={preload}>
                                    <option>Please select the ID of the character to update</option>
                                    { idNameList.map((char) => (
                                        <option key={char.id} value={char.id}>id: {char.id}, name: {char.name}</option>
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
    );
}