import { useState, useEffect } from 'react';
import { useParams } from "react-router-dom";
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import Spinner from 'react-bootstrap/Spinner';
import FormModal from './FormModal';
import axios from 'axios';

export default function UpdateCharacter( {loading, setLoading, error, setError}) {

    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        alias: "",
        alignment: "",
        powers: "",
        image_url: "",
    });
    
    const [submitted, setSubmitted] = useState(false);
    const [character, setCharacter] = useState(null);
    const [showModal, setShowModal] = useState(false);
    const handleCloseModal = () => setShowModal(false);
    const [validated, setValidated] = useState(false);
    const [idNameList, setIdNameList] = useState([]);
    const{ characterId } = useParams();
    const [preload, setPreload] = useState(false);

    useEffect(() => {
        setLoading(true); // enable loading before fetching data
        setError(null); // Reset any possible lingering errors from previous operations

        const id = parseInt(characterId);
        if (!isNaN(id) && id > 0) {
                setFormData(prev => ({ ...prev, id: id})); // set the formData ID to the provided characterId so that we can fetch the user's desired character data
                setPreload(true); // set preload flag to true so that we only load the character data for the provided ID
        } else {
            axios.get('http://127.0.0.1:5000/characters') // Fetch all characters from backend
            .then(response => {
                const characters = response.data;
                // Populate the idNameList with character IDs and names
                setIdNameList(characters.map(char => ({id: char.id, name: char.name})));
                setLoading(false); // Disable loading state after successful fetch
            }).catch(err => { // Handle errors during fetch
                setLoading(false); // disable loading so error can be displayed
                setError(`Could not fetch character list: ${err.message}`);
                console.error("Error fetching character list:", err);
            })
        }

    }, []);
    
    useEffect(() => {
        setLoading(true);
        setError(null);

        // Fetch character data if an ID is provided
        if (formData.id && formData.id > 0) {
            axios.get(`http://127.0.0.1:5000/characters/${formData.id}`)
            .then(response => {
                setFormData({
                    id: response.data.id,
                    name: response.data.name,
                    alias: response.data.alias,
                    alignment: response.data.alignment,
                    powers: response.data.powers,
                    image_url: response.data.image_url,
                });
                setError(null);
                setLoading(false);
            }) .catch (err => {
                setError(`Could not fetch character: ${err.message}`);
                setLoading(false);
            });
        }
    }, [formData.id]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: name === 'id' ? parseInt(value): value
        });
    }
    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
        } else {
            try {
                const response = await axios.put(`127.0.0.1:5000/characters/${formData.id}`, formData);
                setCharacter(response.data);
                setSubmitted(true);
                setShowModal(true);
                setError(null);
            } catch (err) {
                setError(`Error submitting the form. Please try again: ${err.message}`);
                setSubmitted(false);
                setShowModal(true);
                console.error("Error submitting the form:", err);
            }
        }
        setValidated(true);
    };

    return (
        <>
            <Container className="mt-5">
                <h2>Edit Character</h2>
                <FormModal character={character} submitted={submitted} showModal={showModal} handleCloseModal={handleCloseModal} request={"put"} error={error} />

                <Form onSubmit={handleSubmit} noValidate validated={validated}>
                    {loading && (<div className='position-absolute w-100 h-100 bg-secondary bg-opacity-50'>
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                            <Spinner as="span" animation="border" role="status" variant="info" /><span className='text-info'>loading...</span>
                        </div>
                    </div>) }
                    <Row>
                        <Col md="6">
                            <FloatingLabel controlId="formId" label="ID" className="mb-2 mt-2" >
                                <Form.Select 
                                aria-label="Select Character ID from the list"  
                                name="id" 
                                value={formData.id} 
                                onChange={handleChange} 
                                required 
                                isInvalid={formData.id === 0}
                                disabled={preload || loading}>
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

                        <Col md="6">
                            <FloatingLabel controlId="formName" label="Name" className="mb-2 mt-2" >
                                <Form.Control
                                    type="text"
                                    placeholder="Name of the character"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    isInvalid={formData.name === ""}
                                    required
                                    disabled = {loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid name.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="8">
                            <FloatingLabel controlId="formAlias" label="Alias" className="mb-2 mt-2">
                                <Form.Control
                                    type="Text"
                                    placeholder="Character's Alias"
                                    name="alias"
                                    value={formData.alias}
                                    onChange={handleChange}
                                    isInvalid={formData.alias === ""}
                                    required
                                    disabled = {loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid alias.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>

                        <Col md="4" className='d-flex'>
                            <Container className='d-flex flex-column justify-content-center align-items-center'>
                                <Row>
                                    <Col md="6"><h3>Alignment:</h3></Col>
                                    <Col md="6">
                                        <Form.Check
                                            type="radio"
                                            name="alignment"
                                            value="hero"
                                            id="heroRadio"
                                            label="Hero"
                                            onChange={handleChange}
                                            isInvalid={formData.alignment === ""}
                                            feedback="Please choose an alignment"
                                            feedbackType='invalid'
                                            disabled={loading}
                                            checked={formData.alignment === "hero"}
                                        />
                                        <Form.Check
                                            type="radio"
                                            name="alignment"
                                            value="villain"
                                            id="villainRadio"
                                            label="Villain"
                                            onChange={handleChange}
                                            isInvalid={formData.alignment === ""}
                                            feedback="Please choose an alignment"
                                            feedbackType='invalid'
                                            disabled={loading}
                                            checked = {formData.alignment === "villain"}
                                        />
                                    </Col>
                                </Row>
                            </Container>
                        </Col>
                    </Row>

                    <Row>
                        <Col md="6">
                            <FloatingLabel controlId="formPowers" label="Powers" className="mb-2 mt-2">
                                <Form.Control
                                    as="textarea"
                                    name="powers"
                                    placeholder="Please enter the character's powers in a comma seperated list."
                                    value={formData.powers}
                                    onChange={handleChange}
                                    style={{height:'6.25rem'}}
                                    required
                                    isInvalid={formData.powers === ""}
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter the powers of your character in a comma seperated list.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                    
                        <Col md="6">
                            <FloatingLabel controlId="formImageURL" label="Character Image URL" className="mb-2 mt-2">
                                <Form.Control
                                    type="url"
                                    placeholder="Please enter the URL of the character's image"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    required
                                    isInvalid={formData.image_url === ""}
                                    disabled={loading}
                                />
                                <Form.Control.Feedback type='invalid'>
                                    Please enter a URL of the image of your character.
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

                    <Button variant="primary" type="submit" className="mt-3">
                        Submit
                    </Button>
                </Form>
            </Container>
        </>
    );
}