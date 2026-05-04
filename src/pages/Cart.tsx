import { useSelector, useDispatch } from 'react-redux';
import { removeFromCart, updateQuantity, clearCart } from '../store/cartSlice';
import { useState } from 'react';
import type { CartItem } from '../types';
import { Container, Row, Col, Card, Button } from 'react-bootstrap';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { useNavigate } from 'react-router-dom';

const Cart = () => {
  const cartItems = useSelector(
    (state: { cart: { items: CartItem[] } }) => state.cart.items
  );
  const dispatch = useDispatch();
  const { user } = useAuth();
  const navigate = useNavigate();
  const [checkedOut, setCheckedOut] = useState(false);

  const handleCheckout = async () => {
    const total = cartItems.reduce(
      (sum: number, item: CartItem) => sum + item.price * item.quantity,
      0
    );

    await addDoc(collection(db, 'orders'), {
      userId: user?.uid,
      items: cartItems,
      total: total.toFixed(2),
      createdAt: serverTimestamp(),
    });

    dispatch(clearCart());
    setCheckedOut(true);
    setTimeout(() => navigate('/'), 10000);
  };

  return (
    <Container className="py-4">
      <h3>Shopping Cart</h3>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <Row>
          {cartItems.map((item: CartItem) => (
            <Col key={item.id} sm={12} md={6} lg={4} className="mb-3">
              <Card>
                <Card.Img
                  variant="top"
                  src={item.image}
                  style={{
                    height: '150px',
                    objectFit: 'contain',
                    padding: '1rem',
                  }}
                />
                <Card.Body>
                  <Card.Title>{item.title}</Card.Title>
                  <Card.Text>Price: ${item.price.toFixed(2)}</Card.Text>
                  <Card.Text>Quantity: {item.quantity}</Card.Text>
                  <input
                    type="number"
                    value={item.quantity}
                    onChange={(e) =>
                      dispatch(
                        updateQuantity({
                          productId: item.id,
                          quantity: parseInt(e.target.value),
                        })
                      )
                    }
                    className="form-control mb-2"
                  />
                  <Button
                    variant="danger"
                    onClick={() => dispatch(removeFromCart(item.id))}
                  >
                    Remove Item
                  </Button>
                </Card.Body>
              </Card>
            </Col>
          ))}
        </Row>
      )}
      <div className="mt-3">
        <h4>
          Items in cart:{' '}
          {cartItems.reduce(
            (total: number, item: CartItem) => total + item.quantity,
            0
          )}
        </h4>
        <h4>
          Total: $
          {cartItems
            .reduce(
              (total: number, item: CartItem) =>
                total + item.price * item.quantity,
              0
            )
            .toFixed(2)}
        </h4>
      </div>
      <div className="mt-3">
        <Button
          variant="secondary"
          onClick={() => dispatch(clearCart())}
          className="me-2"
        >
          Clear Cart
        </Button>
        <Button variant="success" onClick={handleCheckout}>
          Checkout
        </Button>
        {checkedOut && (
          <p className="mt-2 text-success">
            Payment successful! <a href="/">Click here to shop some more</a>
          </p>
        )}
      </div>
    </Container>
  );
};

export default Cart;
