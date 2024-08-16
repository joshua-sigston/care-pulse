import { DataTable } from '@/components/table/data-table';
import StatusCard from '@/components/status-card';
import { columns } from '@/components/table/columns';
import { getRecentAppointmentList } from '@/lib/actions/appointment.actions';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function AdminPage() {
  const appointments = await getRecentAppointmentList();
  // console.log(appointments);
  return (
    <main className='mx-auto flex max-w-7xl flex-col space-y-14 bg-slate-50'>
      <header className='admin-header'>
        <Link href='/' className='cursor-pointer'>
          <Image
            src='/assets/icons/logo-full.svg'
            height={32}
            width={162}
            alt='logo'
            className='h-8 w-fit'
          />
        </Link>
        <p className='test-16-semibold'>Admin Dashboard</p>
      </header>
      <section className='admin-main'>
        <div className='width-full space-y-4'>
          <h1 className='header'>Welcome</h1>
          <p className='text-dark-700'>
            Start the day with managing new appointments
          </p>
        </div>
      </section>
      <section className='admin-stat'>
        <StatusCard
          type='appointments'
          count={appointments.scheduledCount}
          label='Scheduled Appointments'
          icon='/assets/icons/appointments.svg'
        />
        <StatusCard
          type='pending'
          count={appointments.pendingCount}
          label='Pending Appointments'
          icon='/assets/icons/pending.svg'
        />
        <StatusCard
          type='cancelled'
          count={appointments.cancelledCount}
          label='Canceled Appointments'
          icon='/assets/icons/cancelled.svg'
        />
      </section>
      <DataTable columns={columns} data={appointments.documents} />
    </main>
  );
}
