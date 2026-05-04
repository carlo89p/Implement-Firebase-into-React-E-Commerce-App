import { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, deleteDoc } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { Container, Form, Button, Row, Col, Card } from 'react-bootstrap';
import { updatePassword, deleteUser } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';

const Profile = () => {
  const { user } = useAuth();
  const [name, setName] = useState('');
  const [lastName, setLastName] = useState('');
  const [address1, setAddress1] = useState('');
  const [address2, setAddress2] = useState('');
  const [city, setCity] = useState('');
  const [state, setState] = useState('');
  const [zip, setZip] = useState('');
  const [country, setCountry] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      if (!user) return;
      const docRef = doc(db, 'users', user.uid);
      const docSnap = await getDoc(docRef);
      if (docSnap.exists()) {
        const data = docSnap.data();
        setName(data.name || '');
        setLastName(data.lastName || '');
        setAddress1(data.address1 || '');
        setAddress2(data.address2 || '');
        setCity(data.city || '');
        setState(data.state || '');
        setZip(data.zip || '');
        setCountry(data.country || '');
      }
    };
    fetchProfile();
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;
    try {
      await setDoc(doc(db, 'users', user.uid), {
        name,
        lastName,
        address1,
        address2,
        city,
        state,
        zip,
        country,
        email: user.email,
      });

      if (newPassword) {
        await updatePassword(user, newPassword);
      }

      setSaved(true);
      setError('');
      setTimeout(() => setSaved(false), 2000);
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async () => {
    if (!user) return;
    const confirm = window.confirm(
      'Are you sure you want to delete your account? This cannot be undone.'
    );
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, 'users', user.uid));
      await deleteUser(user);
      navigate('/register');
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Container className="mt-5">
      <Row>
        {/* Profile Card */}
        <Col md={4}>
          <Card bg="dark" text="white" className="p-3">
            <Card.Body>
              <div className="text-center mb-3">
                <div
                  style={{
                    width: '80px',
                    height: '80px',
                    borderRadius: '50%',
                    background: '#6c757d',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: '2rem',
                    margin: '0 auto',
                  }}
                >
                  {name ? name[0].toUpperCase() : '?'}
                </div>
              </div>
              <Card.Title className="text-center">
                {name} {lastName}
              </Card.Title>
              <Card.Text className="text-center text-muted">
                {user?.email}
              </Card.Text>
              <hr style={{ borderColor: '#6c757d' }} />
              <p>
                <strong>Address:</strong>
              </p>
              {address1 && <p className="mb-0">{address1}</p>}
              {address2 && <p className="mb-0">{address2}</p>}
              {city && (
                <p className="mb-0">
                  {city}, {state} {zip}
                </p>
              )}
              {country && <p className="mb-0">{country}</p>}
            </Card.Body>
          </Card>
        </Col>

        {/* Edit Form */}
        <Col md={8}>
          <h2>Edit Profile</h2>
          {saved && <p className="text-success">Profile saved!</p>}
          {error && <p className="text-danger">{error}</p>}
          <form onSubmit={handleSave}>
            <Row>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>First Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group className="mb-3">
                  <Form.Label>Last Name</Form.Label>
                  <Form.Control
                    type="text"
                    value={lastName}
                    onChange={(e) => setLastName(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 1</Form.Label>
              <Form.Control
                type="text"
                value={address1}
                onChange={(e) => setAddress1(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>Address Line 2</Form.Label>
              <Form.Control
                type="text"
                value={address2}
                onChange={(e) => setAddress2(e.target.value)}
              />
            </Form.Group>
            <Row>
              <Col md={5}>
                <Form.Group className="mb-3">
                  <Form.Label>City</Form.Label>
                  <Form.Control
                    type="text"
                    value={city}
                    onChange={(e) => setCity(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={3}>
                <Form.Group className="mb-3">
                  <Form.Label>State</Form.Label>
                  <Form.Control
                    type="text"
                    value={state}
                    onChange={(e) => setState(e.target.value)}
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group className="mb-3">
                  <Form.Label>ZIP Code</Form.Label>
                  <Form.Control
                    type="text"
                    value={zip}
                    onChange={(e) => setZip(e.target.value)}
                  />
                </Form.Group>
              </Col>
            </Row>
            <Form.Group className="mb-3">
              <Form.Label>Country</Form.Label>
              <Form.Control
                type="text"
                value={country}
                onChange={(e) => setCountry(e.target.value)}
              />
            </Form.Group>
            <Form.Group className="mb-3">
              <Form.Label>New Password</Form.Label>
              <Form.Control
                type="password"
                value={newPassword}
                placeholder="Leave blank to keep current password"
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </Form.Group>
            <Button type="submit" variant="primary" className="me-2">
              Save Profile
            </Button>
            <Button variant="danger" onClick={handleDelete}>
              Delete Account
            </Button>
          </form>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;
