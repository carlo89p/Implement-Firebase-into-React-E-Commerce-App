import { collection, addDoc } from 'firebase/firestore';
import { db } from './firebase';

export const seedProducts = async () => {
  const response = await fetch('https://fakestoreapi.com/products');
  const products = await response.json();

  for (const product of products) {
    await addDoc(collection(db, 'products'), product);
  }

  console.log('Products seeded!');
};
