import { useEffect, useState } from 'react';
import { configureApi } from '~/helpers/api.helper';
import { ProductCard } from './ProductCard';
import styles from './Products.module.css';

const { get } = configureApi('products');

export function ProductList() {
  const [products, setProducts] = useState(null);
  useEffect(() => {
    get().then(setProducts);
  }, []);

  return (
    <section className={styles.products}>
      <h1>Our newest products</h1>
      {products?.map((product) => (
        <ProductCard product={product} key={product.id} />
      ))}
    </section>
  );
}
