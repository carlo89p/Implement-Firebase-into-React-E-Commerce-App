import { useEffect, useState } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../firebase';
import { useAuth } from '../AuthContext';
import { Container, Card } from 'react-bootstrap';

const OrderHistory = () => {
  const { user } = useAuth();
  const [orders, setOrders] = useState<any[]>([]);

  useEffect(() => {
    const fetchOrders = async () => {
      const q = query(
        collection(db, 'orders'),
        where('userId', '==', user?.uid)
      );
      const snapshot = await getDocs(q);
      const data = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
      setOrders(data);
    };

    if (user) fetchOrders();
  }, [user]);

  return (
    <Container className="py-4">
      <h3>Order History</h3>
      {orders.length === 0 ? (
        <p>No orders yet.</p>
      ) : (
        orders.map((order: any) => (
          <Card key={order.id} className="mb-3 p-3">
            <p>
              <strong>Order ID:</strong> {order.id}
            </p>
            <p>
              <strong>Total:</strong> ${order.total}
            </p>
            <p>
              <strong>Date:</strong>{' '}
              {order.createdAt?.toDate().toLocaleDateString()}
            </p>
            <p>
              <strong>Items:</strong> {order.items.length} product(s)
            </p>
          </Card>
        ))
      )}
    </Container>
  );
};

export default OrderHistory;
