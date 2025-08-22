declare module '@launchpad/shared-ui' {
  import { ReactNode, ButtonHTMLAttributes, InputHTMLAttributes } from 'react';

  export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'default' | 'outline' | 'ghost' | 'destructive';
    size?: 'sm' | 'md' | 'lg';
    children: ReactNode;
    className?: string;
  }

  export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
    className?: string;
  }

  export interface CardProps {
    children: ReactNode;
    className?: string;
  }

  export const Button: React.FC<ButtonProps>;
  export const Input: React.FC<InputProps>;
  export const Card: React.FC<CardProps>;
}