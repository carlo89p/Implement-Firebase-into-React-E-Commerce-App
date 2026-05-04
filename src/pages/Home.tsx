import { useQuery } from '@tanstack/react-query';
import ProductCard from '../components/ProductCard';
import type { Product } from '../types';
import { Container, Row, Col } from 'react-bootstrap';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '../firebase';

const fetchProducts = async (): Promise<Product[]> => {
  const snapshot = await getDocs(collection(db, 'products'));
  return snapshot.docs.map(
    (doc) => ({ id: doc.id, ...doc.data() }) as unknown as Product
  );
};

function Home() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ['products'],
    queryFn: fetchProducts,
  });

  if (isLoading) return <div>Loading...</div>;
  if (isError) return <div>Error occurred while fetching products.</div>;

  return (
    <Container>
      <h1>Products</h1>
      <Row>
        {data?.map((product: Product) => (
          <Col key={product.id} sm={6} md={4} lg={3}>
            <ProductCard product={product} />
          </Col>
        ))}
      </Row>
    </Container>
  );
}

export default Home;
