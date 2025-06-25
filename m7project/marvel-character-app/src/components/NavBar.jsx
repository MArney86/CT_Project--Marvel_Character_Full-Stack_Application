import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import { NavLink } from 'react-router-dom';

// NavBar component for the Marvel Character DB application
export default function NavBar() {
    return (
        <Navbar expand="md" className="bg-secondary">
            <Container fluid>
                <Navbar.Brand href="/" className='border border-1 border-secondary-emphasis rounded px-2'>Marvel Character DB</Navbar.Brand>
                <Navbar.Toggle aria-controls='navbar-nav' />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className='d-flex align-items-center gap-3'>
                        {/* NavLink to Home Component to display the home page */}
                        <Navbar.Text><NavLink to="/" end>Home</NavLink></Navbar.Text>
                        {/* NavLink to CharacterListings Component to display all records*/}
                        <Navbar.Text><NavLink to="/characters" end>Heros/Villains</NavLink></Navbar.Text>
                        {/* Dropdown with NavLinks to pages to add/modify/delete hero/villain records */}
                        <NavDropdown title='Edit Characters' id="nav-dropdown">
                            <NavDropdown.Item href="/new">Add a Character</NavDropdown.Item>
                            <NavDropdown.Item href="/update">Update/Modify a Character</NavDropdown.Item>
                            <NavDropdown.Item href="/delete">Delete a Character</NavDropdown.Item>
                        </NavDropdown>
                    </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>

    );
}