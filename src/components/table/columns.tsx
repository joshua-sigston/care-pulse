'use client';

import { ColumnDef } from '@tanstack/react-table';
import { MoreHorizontal } from 'lucide-react';
import { Button } from '../ui/button';
import StatusBadge from '../status-badge';
import { formatDateTime } from '@/lib/utils';
import Image from 'next/image';
import { Doctors } from '@/constants';
import { AppointmentModal } from '../appointment-modal';
import { Appointment } from '@/types/appwrite.types';

// This type is used to define the shape of our data.
// You can use a Zod schema here if you want.

export const columns: ColumnDef<Appointment>[] = [
  {
    header: '#',
    cell: ({ row }) => <p className='text-14-medium'>{row.index + 1}</p>,
  },
  {
    accessorKey: 'patient',
    header: 'Patient',
    cell: ({ row }) => (
      <p className='text-14-medium'>{row.original.patient.name}</p>
    ),
  },
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <div className='min-w-[115px]'>
        <StatusBadge status={row.original.status} />
      </div>
    ),
  },
  {
    accessorKey: 'schedule',
    header: 'Appointment',
    cell: ({ row }) => (
      <p className='text-14-regular min-w-[100px]'>
        {formatDateTime(row.original.schedule).dateTime}
      </p>
    ),
  },
  {
    accessorKey: 'primaryPhysician',
    header: () => 'Doctor',
    cell: ({ row }) => {
      const doctor = Doctors.find(
        (doc) => doc.name === row.original.primaryPhysician
      );

      return (
        <div className='flex items-center gap-3'>
          <Image
            src={doctor?.image || ''}
            height={100}
            width={100}
            alt={doctor?.name || 'doctor image'}
            className='size-8'
          />
        </div>
      );
    },
  },
  {
    id: 'actions',
    header: () => <div className='pl-4'>Actions</div>,
    cell: ({ row }) => {
      const appointment = row.original;
      return (
        <div className='flex gap-1 bg-slate-300'>
          <AppointmentModal
            type='schedule'
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            title='schedule'
            description='schedule appointment'
          />
          <AppointmentModal
            type='cancel'
            patientId={appointment.patient.$id}
            userId={appointment.userId}
            appointment={appointment}
            title='cancel'
            description='cancel appointment'
          />
        </div>
      );
    },
  },
];
