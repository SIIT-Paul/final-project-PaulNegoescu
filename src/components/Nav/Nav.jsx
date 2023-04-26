import { Link, NavLink } from 'react-router-dom';
import clsx from 'clsx';
import { useAuth } from '~/features';

import styles from './Nav.module.css';

function BrandNavLink({ children, className, ...props }) {
  return (
    <NavLink
      className={({ isActive }) =>
        clsx(className, { [styles.active]: isActive })
      }
      {...props}
    >
      {children}
    </NavLink>
  );
}

export function Nav() {
  const { user, logout } = useAuth();

  function handleLogout(e) {
    e.preventDefault();

    logout();
  }

  return (
    <nav className={styles['main-menu']}>
      <Link to="/">My Cool Shop</Link>
      <menu>
        <li>
          <BrandNavLink to="/">Products</BrandNavLink>
        </li>
      </menu>

      <menu>
        {!user && (
          <>
            <li className={styles.pushRight}>
              <BrandNavLink to="/login">Login</BrandNavLink>
            </li>
            <li>
              <BrandNavLink to="/register">Register</BrandNavLink>
            </li>
          </>
        )}
        {user && (
          <li className={styles.pushRight}>
            Welcome {user.firstName}!{' '}
            <a href="/" onClick={handleLogout}>
              Logout
            </a>
          </li>
        )}
      </menu>
    </nav>
  );
}
