import axios from 'axios';
import { Link } from 'react-router-dom';
import Spinner from'react-bootstrap/Spinner';
import Container from 'react-bootstrap/Container';
import Card from 'react-bootstrap/Card';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import { useEffect } from 'react';

export default function CharacterListings ({characters, setCharacters, loading, setLoading, error, setError}) {
    
    useEffect(() => {
        axios.get('http://127.0.0.1:5000/characters')
            .then(response => {
                /*Products response object:
                    id : Int
                    name : String
                    alias : String
                    alignment : String
                    powers : String
                    image_url : String
                */
                setCharacters(response.data);
                setLoading(false);
            }).catch(e => {
                setError(`Failed to fetch character: ${e.message}`)
                console.log(error)
            });
    },[])

    return(
        <div>
            {loading ? <Spinner animation='border' variant="success" /> : <>
                <h2>Heros and Villains</h2><br/>
                <Container fluid>
                    <Row  sm={2} lg={3} xxl={4} g={3}>
                        {characters.map(character => (
                            <Col key={character.id}>
                                <Link to={`/products/${character.id}`} className="text-decoration-none">
                                    <Card className='content-justified-center text-center bg-info-subtle'>
                                        <Card.Header>{character.name}</Card.Header>
                                        <Card.Body >
                                            <Card.Img variant="top" src={character.image} style={{maxHeight:'12.5rem', maxWidth: '100%', width:'auto', height:'auto'}} />
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
            </>}
            {error && <h1 className='text-danger'>{error}</h1>}
        </div>);
};