import clsx from 'clsx';
import styles from './Button.module.css';

export function Button({
  children,
  className,
  variant,
  type = 'submit',
  ...props
}) {
  variant = variant && styles[`btn--${variant}`];

  return (
    <button
      {...props}
      className={clsx(styles.btn, variant, className)}
      type={type}
    >
      {children}
    </button>
  );
}
