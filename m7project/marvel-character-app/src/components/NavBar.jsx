import Container from 'react-bootstrap/Container'
import Nav from 'react-bootstrap/Nav';
import Navbar from 'react-bootstrap/Navbar';
import NavDropdown from 'react-bootstrap/NavDropdown'
import { NavLink } from 'react-router-dom';

export default function NavBar() {
    return (
        <Navbar expand="md" className="bg-secondary">
            <Container>
                <Navbar.Brand href="/">Marvel Character DB</Navbar.Brand>
                <Navbar.Toggle aria-controls='navbar-nav' />
                <Navbar.Collapse id="navbar-nav">
                    <Nav className='d-flex align-items-center gap-3'>
                        <Navbar.Text><NavLink to="/" end>Home</NavLink></Navbar.Text>
                        <Navbar.Text><NavLink to="/characters" end>Heros/Villains</NavLink></Navbar.Text>
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