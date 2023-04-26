import {
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, ref, string } from 'yup';

import { configureApi } from '~/helpers/api.helper';
import { Button } from '../../components/Button/Button';
import { useAuth } from './Auth.context';
import { toast } from 'react-toastify';
import { Input } from '~/components';

const { add: apiRegister } = configureApi('register');
const { add: apiLogin } = configureApi('login');

const baseValidators = {
  email: string()
    .required('Please provide a valid email address.')
    .email('Please provide a valid email address.'),
  password: string()
    .required('Please type a password.')
    .min(4, 'The password needs to be at least 4 charcters in length.'),
};
const loginSchema = object(baseValidators);

const registerSchema = object({
  ...baseValidators,
  retype_password: string()
    .required('Please type your password again.')
    .oneOf([ref('password')], 'The two passwords did not match.'),
  firstName: string().required('Please tell us your first name.'),
  lastName: string().required('Please tell us your last name.'),
});

export function Auth() {
  const { pathname: path, state } = useLocation();
  const isRegister = path === '/register';

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(isRegister ? registerSchema : loginSchema),
  });

  const navigate = useNavigate();

  const { login } = useAuth();

  async function handleAuth(data) {
    const { retype_password, ...newUser } = data;

    try {
      let func = apiRegister;
      if (!isRegister) {
        func = apiLogin;
      }

      const auth = await toast.promise(func(newUser), {
        pending:
          "We are logging you in, it's only going to take a few seconds!",
        error: {
          render: ({ data }) => data.message,
        },
        success: 'You have logged in successfully.',
      });

      login(auth);
      navigate(state.from ? state.from : '/');
    } catch (e) {
      throw e;
    }
  }

  const bindToHookForm = {
    register,
    errors,
  };

  return (
    <>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
      <form className="pageForm" onSubmit={handleSubmit(handleAuth)}>
        <Input type="email" name="email" label="Email" {...bindToHookForm} />
        <Input
          type="password"
          name="password"
          label="Password"
          {...bindToHookForm}
        />

        {isRegister && (
          <>
            <Input
              type="password"
              name="retype_password"
              label="Retype Password"
              {...bindToHookForm}
            />
            <Input
              type="text"
              name="firstName"
              label="First Name"
              {...bindToHookForm}
            />
            <Input
              type="text"
              name="lastName"
              label="Last Name"
              {...bindToHookForm}
            />
          </>
        )}
        <Button className="submitBtn" variant="primary">
          {isRegister ? 'Register' : 'Login'}
          {isRegister && <UserPlusIcon width={20} />}
          {!isRegister && <ArrowRightOnRectangleIcon width={20} />}
        </Button>
      </form>
    </>
  );
}
