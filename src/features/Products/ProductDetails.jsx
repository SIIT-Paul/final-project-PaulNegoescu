import { useEffect, useState } from 'react';
import { ProductSkeleton } from './ProductSkeleton';
import { configureApi } from '~/helpers/api.helper';
import { Link, useParams } from 'react-router-dom';
import { ShoppingCartIcon } from '@heroicons/react/24/outline';
import { Button } from '~/components';
import { useAuth } from '~/features';

const { get: getProduct } = configureApi('products');
const { get: getBrand } = configureApi('brands');

export function ProductDetails() {
  const [product, setProduct] = useState(null);
  const [brand, setBrand] = useState(null);
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    async function loadData() {
      const product = await getProduct(id);
      const brand = await getBrand(product.brandId);
      setProduct(product);
      setBrand(brand);
    }

    loadData();
  }, [id]);

  if (!product) {
    return <ProductSkeleton />;
  }

  return (
    <article>
      <h1>
        {brand.name} {product.name}
      </h1>
      <img src={product.picture} alt={product.name} />
      <p>{product.price} lei</p>
      {user.id === product.userId && (
        <Link to={`/products/${product.id}/edit`}>Edit this post</Link>
      )}
      <Button>
        Add to Cart <ShoppingCartIcon width="20" />
      </Button>
    </article>
  );
}
