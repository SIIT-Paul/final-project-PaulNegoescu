import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import { toast } from 'react-toastify';
import { number, object, string } from 'yup';
import { Button, Input, Select, Textarea } from '~/components';
import { configureApi } from '~/helpers/api.helper';
import { useAuth } from '~/features';
import { useLocation, useNavigate } from 'react-router-dom';
import { useEffect } from 'react';

const schema = object({
  name: string().required().min(3),
  picture: string().required().url(),
  description: string().min(100),
  price: number().min(0),
  stock: number('Please provide a valid number of items in scotck.').min(1),
  brandId: number().positive(),
  categoryId: number().positive(),
});

const { add } = configureApi('products');

export function AddProduct() {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
  });

  const { accessToken, user } = useAuth();
  const navigate = useNavigate();

  async function handleAddProduct(data) {
    const newProduct = { ...data, userId: user.id };
    await toast.promise(add(newProduct, { accessToken }), {
      pending: 'Adding a product, please wait ...',
      success: 'Your product has been added.',
      error: {
        render: ({ data }) => data.message,
      },
    });

    navigate('/');
  }

  const bindToHookForm = {
    register,
    errors,
  };

  return (
    <>
      <h1>Post an Ad</h1>
      <form className="pageForm" onSubmit={handleSubmit(handleAddProduct)}>
        <Input
          type="text"
          name="name"
          label="Product Name"
          {...bindToHookForm}
        />

        <Input type="url" name="picture" label="Picture" {...bindToHookForm} />

        <Textarea name="description" label="Description" {...bindToHookForm} />

        <Input
          type="number"
          defaultValue="0"
          min="0"
          step="0.01"
          name="price"
          label="Price (Lei)"
          {...bindToHookForm}
        />

        <Input
          type="number"
          defaultValue="1"
          min="1"
          name="stock"
          label="Ammount"
          {...bindToHookForm}
        />

        <Select name="brandId" label="Brand" {...bindToHookForm}>
          <option value="1">Todo</option>
        </Select>

        <Select name="categoryId" label="Category" {...bindToHookForm}>
          <option value="1">Todo</option>
        </Select>

        <Button variant="primary" className="submitBtn">
          Create Post
        </Button>
      </form>
    </>
  );
}
