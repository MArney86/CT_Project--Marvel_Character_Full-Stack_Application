import axios from 'axios';
import { Link } from 'react-router-dom';
import Placeholder from 'react-bootstrap/Placeholder';
import Alert from'react-bootstrap/Alert';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useState, useEffect } from 'react';

export default function CharacterListings ({loading, setLoading, error, setError}) {
    const [characters, setCharacters] = useState([]);
    const placeholder = [1,2,3,4,5,6,7,8,9,10,11,12]; // Placeholder array to simplify loading display
    
    // Fetch Character Data from backend
    useEffect(() => {
        setLoading(true); // Enable loading before fetching data
        setError(null); // Reset any possible lingereing errors from previous operations
        axios.get('http://127.0.0.1:5000/characters') // Fetch all from backend
            .then(response => {
                /*Products response object:
                    id : Int
                    name : String
                    alias : String
                    alignment : String
                    powers : String
                    image_url : String
                */
                setCharacters(response.data); //store character data in state
                setLoading(false); // Disable loading state after succesful fetch
            }).catch(e => { // Catach and display errors that may occur during fetch
                setError(`Failed to fetch character: ${e.message}`)
                console.log(error)
            });
    },[])

    return(
        <div>
            {error && <Alert show={!!error} variant="danger">
                    <Alert.Heading>!!!Error!!!</Alert.Heading>
                    <p>{error}</p>
                </Alert>}
            {loading ? (<>
            <h2>Heros and Villains</h2><br/>
            <Container fluid>
                <Row  sm={2} lg={3} xxl={4}>
                    {placeholder.map(holder => (
                        <Col key={holder}>
                            <Card className='content-justified-center text-center bg-secondary-subtle mt-2 mb-2'>
                                <Placeholder as={Card.Header} animation="glow">
                                    <Placeholder xs={6} bg="secondary"  size="lg" />
                                </Placeholder>
                                <Card.Body >
                                    <Card.Img src={null} variant="top" style={{height:"300px",width:"200px"}} className="left-50" />
                                    <Placeholder as={Card.Title} animation="glow">
                                        <Placeholder xs={6} size="lg" bg="secondary" />
                                    </Placeholder>
                                    <Placeholder as="p" animation="glow">
                                        <Placeholder xs={2} bg="secondary" /> <Placeholder xs={2} bg="secondary" /> <Placeholder xs={2} bg="secondary" />
                                    </Placeholder>
                                    <Placeholder as="p" animation="glow">
                                        <Placeholder xs={3} bg="secondary" /> <Placeholder xs={2} bg="secondary" />
                                    </Placeholder>
                                </Card.Body>
                            </Card>
                        </Col>
                    ))}
                </Row>
            </Container>
            </>):(<>
            <h2>Heros and Villains</h2><br/>
            <Container fluid>
                <Row  sm={2} lg={3} xxl={4}>
                    {characters.map(character => (
                        <Col key={character.id}>
                            <Link to={`/characters/${character.id}`} className="text-decoration-none">
                                <Card className={`content-justified-center text-center mt-2 mb-2 ${character.alignment === 'hero' ? 'bg-success-subtle' : 'bg-danger-subtle'}`}>
                                    <Card.Header>{character.name}</Card.Header>
                                    <Card.Body >
                                        <Card.Img variant="top" src={character.image_url ? character.image_url:null} style={{maxHeight:'18.75rem', maxWidth: '100%', width:'auto', height:'auto'}} />
                                        <Card.Title className='p-3 border-secondary border-3'>{character.name}</Card.Title>
                                        <Card.Text>Alias: {character.alias}</Card.Text>
                                        <Card.Text>Alignment: {character.alignment}</Card.Text>
                                    </Card.Body>
                                </Card>
                            </Link>
                        </Col>
                    ))}
                </Row>
            </Container>
            </>)}
            
        </div>);
};