import clsx from 'clsx';
import Image from 'next/image';
import React from 'react';

interface Props {
  type: 'pending' | 'appointments' | 'cancelled';
  label: string;
  icon: string;
  count: number;
}

export default function StatusCard({ count = 0, label, icon, type }: Props) {
  return (
    <div
      className={clsx('stat-card', {
        'bg-appointments': type === 'appointments',
        'bg-cancelled': type === 'cancelled',
        'bg-pending': type === 'pending',
      })}
    >
      <div className='flex items-center gap-4'>
        <Image src={icon} height={32} width={32} alt='size-8 w-fit' />
        <h2 className='text-32-bold text-black'>{count}</h2>
        <p className='text-14regular'>{label}</p>
      </div>
    </div>
  );
}
