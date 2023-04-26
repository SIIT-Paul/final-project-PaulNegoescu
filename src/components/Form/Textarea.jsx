import clsx from 'clsx';

export function Textarea({
  name,
  label,
  errors,
  register,
  className,
  ...rest
}) {
  return (
    <>
      <label htmlFor={name}>{label}</label>
      <textarea
        {...rest}
        id={name}
        className={clsx(className, { hasError: errors[name] })}
        {...register(name)}
      ></textarea>
      {errors[name] && <p className="inputError">{errors[name].message}</p>}
    </>
  );
}
