import { Navbar, Nav, Container, Button } from 'react-bootstrap';
import { Link } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { signOut } from 'firebase/auth';
import { auth } from '../firebase';

function NavBar() {
  const { user } = useAuth();

  const handleLogout = async () => {
    await signOut(auth);
  };

  return (
    <Navbar bg="dark" variant="dark">
      <Container>
        <Nav>
          <Nav.Link as={Link} to="/">
            Home
          </Nav.Link>
          {user && (
            <>
              <Nav.Link as={Link} to="/profile">
                Profile
              </Nav.Link>
              <Nav.Link as={Link} to="/cart">
                Cart
              </Nav.Link>
            </>
          )}
        </Nav>
        <Nav className="ms-auto">
          {user ? (
            <>
              <Navbar.Text className="me-3 text-white">
                {user.email}
              </Navbar.Text>
              <Nav.Link as={Link} to="/orders" className="text-white me-2">
                Past orders
              </Nav.Link>
              <Nav.Link as={Link} to="/manage-products" className="text-white me-2">
                Administrator user: Manage Products
              </Nav.Link>
              <Button variant="outline-light" size="sm" onClick={handleLogout}>
                Logout
              </Button>
            </>
          ) : (
            <>
              <Nav.Link as={Link} to="/login">
                Login
              </Nav.Link>
              <Nav.Link as={Link} to="/register">
                Register
              </Nav.Link>
            </>
          )}
        </Nav>
      </Container>
    </Navbar>
  );
}

export default NavBar;
