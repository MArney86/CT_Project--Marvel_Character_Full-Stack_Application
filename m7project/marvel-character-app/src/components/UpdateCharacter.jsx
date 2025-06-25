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

    // state variables for managing form data, submission status, character data, modal visibility, validation state, and ID/name list
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

    // fetch character IDs and names from backend on component mount
    // and set the formData ID if a characterId is provided in the URL to allow preloading of character data for that ID
    useEffect(() => {
        setLoading(true); // enable loading before fetching data
        setError(null); // reset any lingering errors

        const id = parseInt(characterId);
        if (!isNaN(id) && id > 0) { // check if characterId is a valid number greater than 0
            setFormData(prev => ({ ...prev, id: id})); // set the formData ID to the provided characterId so that we can fetch the user's desired character data
            setPreload(true); // set preload flag to true so that we only load the character data for the provided ID
        }
        axios.get('http://127.0.0.1:5000/characters') // Fetch all characters from backend
        .then(response => {
            const characters = response.data;
            // Populate the idNameList with character IDs and names
            setIdNameList(characters.map(char => ({id: char.id, name: char.name})));
            setLoading(false); // Disable loading state after successful fetch
        }).catch(err => {
            setLoading(false); // disable loading so error can be displayed
            setError(`Could not fetch character list: ${err.message}`);
            console.error("Error fetching character list:", err);
        })
    }, []);
    
        // fetch character data, and update formData state if an ID is provided, and preload form with character data
    useEffect(() => {
        setLoading(true);
        setError(null);

        // fetch character data if an ID is provided
        if (formData.id && formData.id > 0) {
            axios.get(`http://127.0.0.1:5000/characters/${formData.id}`)
            .then(response => {
                if (Object.keys(response.data).length === 0) {
                    setLoading(false);
                    setError("Character not found: Please select a valid ID.");
                }
                setFormData({ // update formData state with the fetched character data
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

    // handle form input changes and update formData state
    const handleChange = (e) => {
        const { name, value } = e.target; // destructure name and value from the event target

        setFormData({ // update formData state
            ...formData, // spread the previous state
            [name]: name === 'id' ? parseInt(value): value // parse ID as an integer, otherwise keep the value as is
        });
    }
    
    // handle form submission, validate the form, and send a PUT request to update the character data
    const handleSubmit = async (e) => {
        e.preventDefault(); // prevent default form submission behavior
        setLoading(true);
        setError(null);

        // Check if the form is valid before proceeding
        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation(); // stop the form submission if validation fails
        } else {
            try {
                const response = await axios.put(`http://127.0.0.1:5000/characters/${formData.id}`, formData); // send PUT request to update character data
                setCharacter(response.data);
                setSubmitted(true);
                setShowModal(true);
                setError(null);
                setLoading(false);
            } catch (err) {
                setError(`Error submitting the form. Please try again: ${err.message}`); // set error message if the request fails
                setSubmitted(false); // reset submitted state
                setShowModal(true); // show the modal with the error message
                console.error("Error submitting the form:", err);
                setLoading(false)
            }
        }
        setValidated(true);
    };

    return (
        <div className='compBackground min-vh-100 min-vw-100 position-relative'>
            {/* Modal to confirm update or display errors*/}
            <FormModal character={character} submitted={submitted} showModal={showModal} handleCloseModal={handleCloseModal} request={"put"} error={error} />

            <Container className="translucent w-50 position-absolute top-50 start-50 translate-middle py-3">
                <h2 className='text-white'>Update Character</h2>
                {/* Form to choose the character, and load/edit the characters data */}
                <Form onSubmit={handleSubmit} noValidate validated={validated} className='m-3 p-4'>
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
                                disabled={loading || preload}>
                                    <option>Please select the ID of the character to update</option>
                                    { idNameList.map((char) => (
                                        <option 
                                        key={char.id} 
                                        value={char.id}
                                        selected={preload && char.id === formData.id}
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

                        <Col md="4" className='d-flex align-items-center'>
                            <Form.Group 
                            className='w-100 border border-1 border-secondary rounded p-3 mb-2 mt-2 bg-white' 
                            controlId="formAlignment">
                                <Form.Label className="mb-2">Alignment</Form.Label>
                                <div>
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
                                        checked={formData.alignment === "hero" ? true : false}
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
                                        checked={formData.alignment === "villain" ? true : false}
                                    />
                                </div>
                            </Form.Group>
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
                            {/* Display error message if there is an error in the form */}{/* Display error message if there is an error in the form */}
                            <Alert show={!!error} variant="danger">
                                <Alert.Heading>!!!Error!!!</Alert.Heading>
                                <p>{error}</p>
                            </Alert>
                        </Col>
                    </Row>

                    <Row className="mb-2 mt-2">
                        <Col>
                            <Button variant="primary" type="submit" className="mt-3">
                                Submit
                            </Button>
                        </Col>
                        {/* character image preview section */}
                        <Col>
                            {formData.image_url.length === 0 ? (
                                <div
                                className="d-flex align-items-center justify-content-center rounded border border-secondary fw-bold fs-5 bg-secondary-subtle text-secondary"
                                style={{ width: "200px", height: "300px" }}
                                >
                                No image to load
                                </div>) : (<img
                                src={formData.image_url}
                                alt="Character image preview"
                                style={{ width: "152px", height: "228px", objectFit: "cover", borderColor: "#adb5bd" }} 
                                className='border rounded-3 '/>
                            )}
                        </Col>
                    </Row>
                </Form>
            </Container>
        </div>
    );
}