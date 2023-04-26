import clsx from 'clsx';

export function Select({
  name,
  label,
  errors,
  register,
  className,
  children,
  ...rest
}) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <select
        {...rest}
        id={name}
        className={clsx(className, { hasError: errors[name] })}
        {...register(name)}
      >
        {children}
      </select>
      {errors[name] && <p className="inputError">{errors[name].message}</p>}
    </>
  );
}
