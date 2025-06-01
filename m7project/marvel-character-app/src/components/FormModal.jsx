import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert'

export default function FormModal({ character, submitted, showModal, handleCloseModal, request, error  }) {
    let aknowldegement = "";
    if (request === "post") {
        aknowldegement = "Character added successfully!";
    } else if (request === "put") {
        aknowldegement = "Character updated successfully!";
    } else if (request === "delete") {
        aknowldegement = "Character deleted successfully!";
    }

    const getPowers = () => {
            return character.powers.split(", ").map((value, index) => (
                value.substring(0,4) === "and " ? <span key={index}> {value.substring(4).charAt(0).toUpperCase() + value.substring(5)}</span>:<span key={index}>{value.charAt(0).toUpperCase() + value.substring(1)}</span>
            ));
    }

    return (
        <Modal show={showModal} onHide={handleCloseModal}>
            <Modal.Header closeButton>
                <Modal.Title>Form Submitted!</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                {submitted && (request !== "delete") ?
                    <>
                        <p>{aknowldegement}</p>
                        <p>Nice job!  Here is the information returned from the API:</p>
                        <Table hover>
                            <tbody>
                                <tr>
                                    <th>id:</th>
                                    <td>{character.id}</td>
                                </tr>
                                <tr>
                                    <th>name:</th>
                                    <td>{character.name}</td>
                                </tr>
                                <tr>
                                    <th>alias:</th>
                                    <td>{character.alias}</td>
                                </tr>
                                <tr>
                                    <th>alignment:</th>
                                    <td>{character.alignment}</td>
                                </tr>
                                <tr>
                                    <th>powers:</th>
                                    <td>{getPowers().map((value, index) => (
                                        <p key ={index}>{value}</p>
                                    ))}</td>
                                </tr>
                                <tr>
                                    <th>image:</th>
                                    <td><img src={character.image_url} alt="Character" style={{width: "200px", height: "300px"}} /></td>
                                </tr>
                            </tbody>
                        </Table>
                    </>:<>
                        <p>{aknowldegement}</p>
                    </>
                }
                {error && <Alert show={!!error} variant="danger">
                    <Alert.Heading>!!!Error!!!</Alert.Heading>
                    <p>{error}</p>
                </Alert>}
            </Modal.Body>
            <Modal.Footer>
                <Button variant="success" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}