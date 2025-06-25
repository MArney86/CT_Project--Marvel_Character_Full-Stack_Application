import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import FormModal from './FormModal';
import Spinner from 'react-bootstrap/Spinner';
import axios from 'axios';

export default function AddProduct({loading, setLoading, error, setError}) {
    // state variables for managing form data, submission status, character data, modal visibility, and validation state
    const [formData, setFormData] = useState({
        id: 0,
        name: "",
        alias: "",
        powers: "",
        alignment: "",
        image_url: "",
    });
    const [submitted, setSubmitted] = useState(false);
    const [character, setCharacter] = useState({
        id: 0,
        name: "",
        alias: "",
        powers: "",
        alignment: "",
        image_url: "",
    });
    const [showModal, setShowModal] = useState(false);
    const [validated, setValidated] = useState(false);
  
    const handleCloseModal = () => {
        setShowModal(false); // Close the modal
        setValidated(false); // Reset validation state when modal is closed
        setSubmitted(false); // Reset submitted state when modal is closed
        setFormData({}); // Reset form data when modal is closed
    }    

    // Function to handle changes in form fields
    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({ // Update the formData state with the new value
            ...formData,
            [name]: value
        });
    }    

    // Function to handle form submission
    // It validates the form, sends a POST request to the server, and handles the response
    const handleSubmit = async (e) => {
        e.preventDefault(); // Prevent the default form submission behavior
        setLoading(true); // Set loading state to true
        setError(null); // Reset error state
        console.log(formData) // Log the form data to the console for debugging

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation(); // Stop the form submission if it is invalid
            setError("Please fill out all required fields correctly."); // Set error message if form is invalid
        } else {
            try { // If the form is valid, prepare the data for submission
                const response = await axios.post('http://127.0.0.1:5000/characters', formData);
                setCharacter(response.data); 
                setSubmitted(true);
                setShowModal(true); // Show the modal with the submitted character data
                setError(null);
                setLoading(false);
            } catch (err) {
                setError(`Error submitting the form. Please try again: ${err.message}`);
                setSubmitted(false);
                setShowModal(true); // Show the modal with an error to display the error message
                setLoading(false); // Set loading state to false if there is an error
            }
        }
        setValidated(true);
    };

    return (
        <div className='compBackground min-vh-100 min-vw-100 position-relative'>
            {/* Modal to show the submitted character data and errors*/}
            <FormModal character={character} submitted={submitted} showModal={showModal} handleCloseModal={handleCloseModal} request={"post"} error={error} />

            <Container className="translucent w-50 position-absolute top-50 start-50 translate-middle py-3">
                <h2 className='text-white'>Add New Character</h2>
                {/* Form for character data to submit */}
                <Form onSubmit={handleSubmit} noValidate validated={validated} className='m-3 p-3'>
                    {/* Show loading spinner if loading state is true */}
                    {loading && (<div className='position-absolute w-100 h-100 bg-secondary bg-opacity-50'>
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                            <Spinner as="span" animation="border" role="status" variant="info" /><span className='text-info'>loading...</span>
                        </div>
                    </div>) }
                    <Row className="mb-2 mt-2">
                        <Col md="6">
                            <FloatingLabel controlId="formName" label="Name" className="mb-2 mt-2">
                                <Form.Control
                                    type="text"
                                    placeholder="Name of the character"
                                    name="name"
                                    value={formData.name}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid name.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>

                        <Col md="6">
                            <FloatingLabel controlId="formAlias" label="Alias" className="mb-2 mt-2">
                                <Form.Control
                                    type="Text"
                                    placeholder="Character's Alias"
                                    name="alias"
                                    value={formData.alias}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please provide a valid alias.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                    </Row>

                    <Row className="mb-2 mt-2">
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
                                    />
                                </div>
                            </Form.Group>
                        </Col>

                        <Col md="8">
                            <FloatingLabel controlId="formPowers" label="Powers" className="mb-2 mt-2">
                                <Form.Control
                                    as="textarea"
                                    name="powers"
                                    placeholder="Please enter the character's powers in a comma seperated list."
                                    value={formData.powers}
                                    onChange={handleChange}
                                    style={{height:'7.25rem'}}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter the powers of your character in a comma seperated list.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                    </Row>

                    <Row className='mb-2 mt-2'>
                        <Col md="12">
                            <FloatingLabel controlId="formImageURL" label="Character Image URL" className="mb-2 mt-2">
                                <Form.Control
                                    type="url"
                                    placeholder="Please enter the URL of the character's image"
                                    name="image_url"
                                    value={formData.image_url}
                                    onChange={handleChange}
                                    required
                                />
                                <Form.Control.Feedback type='invalid'>
                                    Please enter a URL of the image of your character.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                    </Row>
                    <Row>
                        <Col md="12">
                            {/* Display error message if there is an error in the form */}
                            <Alert show={!!error} variant="danger" onClose={() => setError("")} dismissible>
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
                        {/* preview of the character image */}
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