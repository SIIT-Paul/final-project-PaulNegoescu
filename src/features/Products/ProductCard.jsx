import { Link } from 'react-router-dom';

export function ProductCard({ product }) {
  return (
    <Link to={`products/${product.id}`}>
      <article>
        <img src={product.picture} alt={`${product.name}`} />
        <h1>{product.name}</h1>
      </article>
    </Link>
  );
}
