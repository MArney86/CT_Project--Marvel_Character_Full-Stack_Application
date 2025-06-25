import Button from 'react-bootstrap/Button';
import Modal from 'react-bootstrap/Modal';
import Table from 'react-bootstrap/Table';
import Alert from 'react-bootstrap/Alert';
import './components.css'

export default function FormModal({ character, submitted, showModal, handleCloseModal, request, error  }) {
    // check the type of request and set the acknowledgement message accordingly
    let acknowledgement = "";
    if (request === "post") {
        acknowledgement = "Character added successfully!";
    } else if (request === "put") {
        acknowledgement = "Character updated successfully!";
    } else if (request === "delete") {
        acknowledgement = "Character deleted successfully!";
    }

    const getPowers = () => { // This function processes the powers string and returns an array of formatted power strings for display
        if (!character.powers) {
            return ["No powers listed"];
        } else  if (character.powers === "[]") {
            return character.powers.split(", ").map((value, index) => ( // Split the string by commas and map each value to a formatted string
                value.substring(0,4) === "and " ? <span key={index}> {value.substring(4).charAt(0).toUpperCase() + value.substring(5)}</span>:<span key={index}>{value.charAt(0).toUpperCase() + value.substring(1)}</span>
            ));
        }
    }

    return (
        <Modal show={showModal} onHide={handleCloseModal} className='modalTranslucent'>
            <Modal.Header closeButton className='text-white'>
                <Modal.Title>Form Submitted!</Modal.Title>
            </Modal.Header>
            <Modal.Body className='noticeBackground text-white'>
                {submitted && (request !== "delete") ? /* If the request was successful and not a delete request, display the character information*/
                    <>
                        <p>{acknowledgement}</p>
                        <p>Nice job!  Here is the information returned from the API:</p>
                        <Table hover  className='tableTranslucent'>
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
                    </>:<> // If the request was a delete request, display just the acknowledgement message
                        <p>{acknowledgement}</p>
                    </>
                }
                // If there was an error, display the error message
                {error && <Alert show={!!error} variant="danger">
                    <Alert.Heading>!!!Error!!!</Alert.Heading>
                    <p>{error}</p>
                </Alert>}
            </Modal.Body>
            <Modal.Footer> {/* Footer with a button to close the modal*/}
                <Button variant="success" onClick={handleCloseModal}>
                    Close
                </Button>
            </Modal.Footer>
        </Modal>
    );
}