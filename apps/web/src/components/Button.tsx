import { FC, HTMLAttributes } from 'react';

interface ButtonProps extends HTMLAttributes<HTMLButtonElement> {
  text: string;
}

const Button: FC<ButtonProps> = ({ text, ...props }) => {
  return <button {...props}>{text}</button>;
};

export default Button;
