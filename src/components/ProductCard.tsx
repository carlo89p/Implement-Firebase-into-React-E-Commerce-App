import { useDispatch } from 'react-redux';
import { addToCart } from '../store/cartSlice';
import type { Product } from '../types';
import { Card, Button } from 'react-bootstrap';

function ProductCard({ product }: { product: Product }) {
  const dispatch = useDispatch();

  return (
    <Card>
      <Card.Img
        style={{ height: '200px', objectFit: 'contain', padding: '1rem' }}
        variant="top"
        src={product.image}
        alt={product.title}
        className="product-image"
        onError={(e) =>
          (e.currentTarget.src = 'https://via.placeholder.com/150')
        }
      />
      <Card.Body>
        <Card.Title>{product.title}</Card.Title>

        <Card.Text>{product.description}</Card.Text>
        <Card.Text>${product.price.toFixed(2)}</Card.Text>
        <Card.Text>Category: {product.category}</Card.Text>
        <Card.Text>
          Rating: {product.rating.rate} ({product.rating.count} reviews)
        </Card.Text>
        <Button
          className="add-to-cart-button"
          onClick={() => dispatch(addToCart(product))}
        >
          Add to Cart
        </Button>
      </Card.Body>
    </Card>
  );
}

export default ProductCard;
