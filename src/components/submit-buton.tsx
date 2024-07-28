import React from 'react';
import { Button } from './ui/button';

interface Props {
  isLoading: boolean;
  className?: string;
  children: React.ReactNode;
}

export default function SubmitButton({
  isLoading,
  className,
  children,
}: Props) {
  return (
    <Button
      type='submit'
      disabled={isLoading}
      className={className ?? 'bg-sky-400 w-full shadow-md'}
    >
      {isLoading ? (
        <div className='flex items-center gap-4'>...Loading</div>
      ) : (
        children
      )}
    </Button>
  );
}
