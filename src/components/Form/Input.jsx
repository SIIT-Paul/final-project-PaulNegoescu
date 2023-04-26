import clsx from 'clsx';

export function Input({ name, label, errors, register, className, ...rest }) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <input
        {...rest}
        id={name}
        className={clsx(className, { hasError: errors[name] })}
        {...register(name)}
      />
      {errors[name] && <p className="inputError">{errors[name].message}</p>}
    </>
  );
}
