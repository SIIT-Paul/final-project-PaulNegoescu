import { useState } from 'react';
import {
  ArrowRightOnRectangleIcon,
  CheckCircleIcon,
  ExclamationTriangleIcon,
  UserPlusIcon,
} from '@heroicons/react/24/outline';
import clsx from 'clsx';
import { useLocation, useNavigate } from 'react-router-dom';

import { configureApi, ApiError } from '../../helpers/api.helper';
import { Button } from '../../components/Button/Button';

import styles from './Auth.module.css';
import { useAuth } from './Auth.context';

const { add: apiRegister } = configureApi('register');
const { add: apiLogin } = configureApi('login');

const emailRegex =
  /(?:[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*|"(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21\x23-\x5b\x5d-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])*")@(?:(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?|\[(?:(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9]))\.){3}(?:(2(5[0-5]|[0-4][0-9])|1[0-9][0-9]|[1-9]?[0-9])|[a-z0-9-]*[a-z0-9]:(?:[\x01-\x08\x0b\x0c\x0e-\x1f\x21-\x5a\x53-\x7f]|\\[\x01-\x09\x0b\x0c\x0e-\x7f])+)\])/; // eslint-disable-line
function checkFormValidity(inputs, isRegister) {
  let isValid = true;
  const errors = {};

  if (inputs.email === '' || !emailRegex.test(inputs.email)) {
    errors.email = 'The email address needs to be valid.';
    isValid = false;
  }

  if (inputs.password === '') {
    errors.password = 'The password may not be empty.';
    isValid = false;
  }

  if (isRegister) {
    if (inputs.password !== inputs.retype_password) {
      errors.retype_password = 'The passwords do not match.';
      isValid = false;
    }

    if (inputs.firstName === '') {
      errors.firstName = 'Please specify a first name.';
      isValid = false;
    }

    if (inputs.lastName === '') {
      errors.lastName = 'Please specify a last name.';
      isValid = false;
    }
  }

  return { isValid, errors };
}

const initialErrors = {
  email: '',
  password: '',
  retype_password: '',
  firstName: '',
  lastName: '',
};

export function Auth() {
  const [apiError, setApiError] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [errors, setErrors] = useState(initialErrors);

  const navigate = useNavigate();

  const { login } = useAuth();

  const { pathname: path } = useLocation();
  const isRegister = path === '/register';

  async function handleSubmit(e) {
    e.preventDefault();

    const form = e.target;
    const data = new FormData(form);
    const user = Object.fromEntries(data.entries());

    const { isValid, errors } = checkFormValidity(user, isRegister);
    if (!isValid) {
      setErrors(errors);
      return;
    }

    setApiError('');
    setErrors(initialErrors);
    setSuccessMessage('');

    delete user.retype_password;
    // for (const [key, value] of data.entries()) {
    //   user[key] = value;
    // }
    try {
      let auth;
      if (isRegister) {
        auth = await apiRegister(user);
        setSuccessMessage('You have registered successfully.');
      } else {
        auth = await apiLogin(user);
        setSuccessMessage('You have logged in successfully.');
      }
      login(auth);
      navigate('/');
    } catch (e) {
      if (e instanceof ApiError) {
        setApiError(e.message);
        return;
      }

      throw e;
    }
  }

  function wipeError(e) {
    setErrors({ ...errors, [e.target.name]: '' });
  }

  return (
    <>
      <h1>{isRegister ? 'Register' : 'Login'}</h1>
      {successMessage && (
        <div className={styles.successMessage}>
          <CheckCircleIcon width={24} />
          {successMessage}
        </div>
      )}
      {apiError && (
        <div className={styles.formError}>
          <ExclamationTriangleIcon width={24} />
          {apiError}
        </div>
      )}
      <form className={styles.authForm} onSubmit={handleSubmit}>
        <label htmlFor="email">Email</label>
        <input
          name="email"
          id="email"
          type="email"
          className={clsx({ [styles.hasError]: errors.email })}
          onChange={wipeError}
        />
        {errors.email && <p className={styles.inputError}>{errors.email}</p>}

        <label htmlFor="password">Password</label>
        <input
          name="password"
          id="password"
          type="password"
          className={clsx({ [styles.hasError]: errors.password })}
          onChange={wipeError}
        />
        {errors.password && (
          <p className={styles.inputError}>{errors.password}</p>
        )}

        {isRegister && (
          <>
            <label htmlFor="retype_password">Retype Password</label>
            <input
              name="retype_password"
              id="retype_password"
              type="password"
              className={clsx({ [styles.hasError]: errors.retype_password })}
              onChange={wipeError}
            />
            {errors.retype_password && (
              <p className={styles.inputError}>{errors.retype_password}</p>
            )}

            <label htmlFor="firstName">First Name</label>
            <input
              name="firstName"
              id="firstName"
              type="text"
              className={clsx({ [styles.hasError]: errors.firstName })}
              onChange={wipeError}
            />
            {errors.firstName && (
              <p className={styles.inputError}>{errors.firstName}</p>
            )}

            <label htmlFor="lastName">Last Name</label>
            <input
              name="lastName"
              id="lastName"
              type="text"
              className={clsx({ [styles.hasError]: errors.lastName })}
              onChange={wipeError}
            />
            {errors.lastName && (
              <p className={styles.inputError}>{errors.lastName}</p>
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
