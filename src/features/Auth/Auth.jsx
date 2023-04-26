import {
  ArrowRightOnRectangleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import { object, ref, string } from 'yup';

import { configureApi } from '~/helpers/api.helper';
import { Button } from '../../components/Button/Button';

import styles from './Auth.module.css';
import { useAuth } from './Auth.context';
import { toast } from 'react-toastify';

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
  const { pathname: path } = useLocation();
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
      navigate('/');
    } catch (e) {
      throw e;
    }
  }

  return (
    <>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
      <form className={styles.authForm} onSubmit={handleSubmit(handleAuth)}>
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          className={clsx({ [styles.hasError]: errors.email })}
          {...register('email')}
        />
        {errors.email && (
          <p className={styles.inputError}>{errors.email.message}</p>
        )}

        <label htmlFor="password">Password</label>
        <input
          id="password"
          type="password"
          className={clsx({ [styles.hasError]: errors.password })}
          {...register('password')}
        />
        {errors.password && (
          <p className={styles.inputError}>{errors.password.message}</p>
        )}

        {isRegister && (
          <>
            <label htmlFor="retype_password">Retype Password</label>
            <input
              id="retype_password"
              type="password"
              className={clsx({ [styles.hasError]: errors.retype_password })}
              {...register('retype_password')}
            />
            {errors.retype_password && (
              <p className={styles.inputError}>
                {errors.retype_password.message}
              </p>
            )}

            <label htmlFor="firstName">First Name</label>
            <input
              id="firstName"
              type="text"
              className={clsx({ [styles.hasError]: errors.firstName })}
              {...register('firstName')}
            />
            {errors.firstName && (
              <p className={styles.inputError}>{errors.firstName.message}</p>
            )}

            <label htmlFor="lastName">Last Name</label>
            <input
              id="lastName"
              type="text"
              className={clsx({ [styles.hasError]: errors.lastName })}
              {...register('lastName')}
            />
            {errors.lastName && (
              <p className={styles.inputError}>{errors.lastName.message}</p>
            )}
          </>
        )}

        <div className={styles.submitBtn}>
          <Button variant="primary">
            {isRegister ? 'Register' : 'Login'}
            {isRegister && <UserPlusIcon width={20} />}
            {!isRegister && <ArrowRightOnRectangleIcon width={20} />}
          </Button>
        </div>
      </form>
    </>
  );
}
