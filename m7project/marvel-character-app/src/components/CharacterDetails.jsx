import { useParams } from "react-router-dom";
import { useState, useEffect } from 'react';
import axios from "axios";
import Table from 'react-bootstrap/Table'
import Alert from 'react-bootstrap/Alert'

export default function CharacerDetails ({loading, setLoading, error, setError}) {
    const { characterId } = useParams();
    const [character, setCharacter] = useState({
        id: 0,
        name: "",
        image_url: "",
        alias: "",
        alignment: "",
        powers: "",
    });
    
    useEffect(() => { 
        setLoading(true)
        axios.get(`http://127.0.0.1:5000/characters/${characterId}`)   
        .then(response => {
            const data = response.data
            setCharacter({
                id: data.id,
                name: data.name,
                image_url: data.image_url,
                alias: data.alias,
                alignment: data.alignment,
                powers: data.powers,
            });
            setLoading(false);
        }).catch(e => {
            setError(`Failed to fetch character: ${e.message}`);
            setLoading(false);
        })
    },[characterId]);

    const getPowers = () => {
            return character.powers.split(", ").map((value, index) => (
                value.substring(0,4) === "and " ? <span key={index}> {value.substring(4).charAt(0).toUpperCase() + value.substring(5)}</span>:<span key={index}>{value.charAt(0).toUpperCase() + value.substring(1)}</span>
            ));
    }


    if (loading) {
        return <div className="text-center">Loading...</div>;
    }
    return(
        <div className="container d-flex flex-column justify-content-center align-items-center min-vh-100">
            <div className="text-center w-75">
                <h1 className="mb-4">{character.name}</h1>
                <img  className="border border-3 rounded-3 border-secondary-subtle m-3 p-2" src={character.image_url} />
                <h4>a.k.a.: {character.alias}</h4>
                <div className="d-flex justify-content-center">
                    <Table hover className="w-25 fw-bold">
                        <tbody>
                            <tr>
                                <th>Alignment:</th>
                                <td>{character.alignment}</td>
                            </tr>
                            <tr>
                                <th>Powers:</th>
                                <td>
                                    <ul>
                                        {getPowers().map((value, index) => 
                                            <li key={index}>{value}</li>
                                        )}
                                    </ul>
                                </td>
                            </tr>
                        </tbody>
                    </Table>
                </div>
            </div>
            {error && <Alert show={error === true} variant="danger">
                    <Alert.Heading>!!!Error!!!</Alert.Heading>
                    <p>{error}</p>
                </Alert>}
        </div>
    );
}