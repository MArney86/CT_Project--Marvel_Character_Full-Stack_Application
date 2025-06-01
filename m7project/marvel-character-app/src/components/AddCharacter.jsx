import { useState } from 'react';
import Container from 'react-bootstrap/Container';
import Form from 'react-bootstrap/Form';
import Col from 'react-bootstrap/Col';
import Row from 'react-bootstrap/Row';
import Button from 'react-bootstrap/Button';
import Alert from 'react-bootstrap/Alert';
import FloatingLabel from 'react-bootstrap/FloatingLabel';
import FormModal from './FormModal';
import axios from 'axios';

export default function AddProduct({loading, setLoading, error, setError}) {

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
  const handleCloseModal = () => setShowModal(false);
  const [validated, setValidated] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData({
            ...formData,
            [name]: value
        });
    }    

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError(null);

        const form = e.currentTarget;
        if (form.checkValidity() === false) {
            e.stopPropagation();
            setError("Please fill out all required fields correctly.");
        } else {
            try {
                const response = await axios.post('http://127.0.0.1:5000/characters', formData);
                setProduct(response.data);
                setSubmitted(true);
                setShowModal(true);
                setError(null);
            } catch (err) {
                setError(`Error submitting the form. Please try again: ${err.message}`);
                setSubmitted(false);
            }
        }
        setValidated(true);
    };

    return (
        <>
            <Container className="mt-5">
                <h2>Add New Product</h2>
                <FormModal character={character} submitted={submitted} showModal={showModal} handleCloseModal={handleCloseModal} request={"post"} error={error} />

                <Form onSubmit={handleSubmit} noValidate validated={validated}>
                    {loading && (<div className='position-absolute w-100 h-100 bg-secondary bg-opacity-50'>
                        <div className="d-flex justify-content-center align-items-center h-100 w-100">
                            <Spinner as="span" animation="border" role="status" variant="info" /><span className='text-info'>loading...</span>
                        </div>
                    </div>) }
                    <Row>
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

                    <Row>
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
                                    </Col>
                                </Row>
                            </Container>
                        </Col>

                        <Col md="8">
                            <FloatingLabel controlId="formPowers" label="Powers" className="mb-2 mt-2">
                                <Form.Control
                                    as="textarea"
                                    name="powers"
                                    placeholder="Please enter the character's powers in a comma seperated list."
                                    value={formData.powers}
                                    onChange={handleChange}
                                    style={{height:'6.25rem'}}
                                    required
                                />
                                <Form.Control.Feedback type="invalid">
                                    Please enter the powers of your character in a comma seperated list.
                                </Form.Control.Feedback>
                            </FloatingLabel>
                        </Col>
                    </Row>

                    <Row>
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