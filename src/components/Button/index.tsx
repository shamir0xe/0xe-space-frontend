type ButtonProps = {
  onMouseDown: React.MouseEventHandler<HTMLAnchorElement>;
  children: React.ReactNode;
  className?: string;
};

const Button = ({
  onMouseDown,
  children,
  className,
}: ButtonProps): JSX.Element => {
  return (
    <div
      className={`inline cursor-pointer px-5 border rounded border-transparent hover:border-white bg-gray-700 ${className}`}
    >
      <a
        onMouseDown={(e) => {
          if (e) e.preventDefault();
          onMouseDown(e);
        }}
      >
        {children}
      </a>
    </div>
  );
};

export default Button;
