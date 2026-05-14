interface Product {
  id: number | string;
  title: string;
  price: number;
  image: string;
  category: string;
  description: string;
  rating: {
    rate: number;
    count: number;
  };
}

interface CartItem extends Product {
  quantity: number;
}

interface Order {
  id: string;
  userId: string;
  items: CartItem[];
  total: string;
  createdAt: { toDate: () => Date };
}

export type { Product, CartItem, Order };
