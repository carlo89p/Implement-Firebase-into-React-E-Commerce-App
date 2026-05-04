import { useState, useEffect } from 'react';
import {
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  doc,
} from 'firebase/firestore';
import { db } from '../firebase';
import {
  Container,
  Row,
  Col,
  Card,
  Button,
  Form,
  Modal,
} from 'react-bootstrap';
import type { Product } from '../types';

const ManageProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [showModal, setShowModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState<Product | null>(null);
  const [title, setTitle] = useState('');
  const [price, setPrice] = useState('');
  const [category, setCategory] = useState('');
  const [description, setDescription] = useState('');
  const [image, setImage] = useState('');
  const [error, setError] = useState('');

  const loadProducts = async () => {
    const snapshot = await getDocs(collection(db, 'products'));
    const data = snapshot.docs.map((doc) => ({
      ...doc.data(),
      id: doc.id,
    })) as unknown as Product[];
    setProducts(data);
  };

  useEffect(() => {
    loadProducts();
  }, []);

  const handleOpen = (product?: Product) => {
    if (product) {
      setEditingProduct(product);
      setTitle(product.title);
      setPrice(product.price.toString());
      setCategory(product.category);
      setDescription(product.description);
      setImage(product.image);
    } else {
      setEditingProduct(null);
      setTitle('');
      setPrice('');
      setCategory('');
      setDescription('');
      setImage('');
    }
    setError('');
    setShowModal(true);
  };

  const handleSave = async () => {
    try {
      const productData = {
        title,
        price: parseFloat(price),
        category,
        description,
        image,
        rating: { rate: 0, count: 0 },
      };

      if (editingProduct) {
        await updateDoc(
          doc(db, 'products', String(editingProduct.id)),
          productData
        );
      } else {
        await addDoc(collection(db, 'products'), productData);
      }

      setShowModal(false);
      loadProducts();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  const handleDelete = async (id: number | string) => {
    const confirm = window.confirm('Delete this product?');
    if (!confirm) return;
    try {
      await deleteDoc(doc(db, 'products', String(id)));
      loadProducts();
    } catch (err) {
      setError((err as Error).message);
    }
  };

  return (
    <Container className="py-4">
      <div className="d-flex justify-content-between align-items-center mb-4">
        <h2>Manage Products</h2>
        <Button variant="primary" onClick={() => handleOpen()}>
          + Add Product
        </Button>
      </div>
      <Row>
        {products.map((product) => (
          <Col key={product.id} sm={6} md={4} lg={3} className="mb-3">
            <Card className="h-100">
              <Card.Img
                variant="top"
                src={product.image}
                style={{
                  height: '150px',
                  objectFit: 'contain',
                  padding: '1rem',
                }}
              />
              <Card.Body>
                <Card.Title style={{ fontSize: '0.9rem' }}>
                  {product.title}
                </Card.Title>
                <Card.Text>${product.price}</Card.Text>
                <Button
                  variant="warning"
                  size="sm"
                  className="me-2"
                  onClick={() => handleOpen(product)}
                >
                  Edit
                </Button>
                <Button
                  variant="danger"
                  size="sm"
                  onClick={() => handleDelete(product.id)}
                >
                  Delete
                </Button>
              </Card.Body>
            </Card>
          </Col>
        ))}
      </Row>

      <Modal show={showModal} onHide={() => setShowModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>
            {editingProduct ? 'Edit Product' : 'Add Product'}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {error && <p className="text-danger">{error}</p>}
          <Form.Group className="mb-3">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Price</Form.Label>
            <Form.Control
              type="number"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Category</Form.Label>
            <Form.Control
              type="text"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </Form.Group>
          <Form.Group className="mb-3">
            <Form.Label>Image URL</Form.Label>
            <Form.Control
              type="text"
              value={image}
              onChange={(e) => setImage(e.target.value)}
            />
          </Form.Group>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </Container>
  );
};

export default ManageProducts;
