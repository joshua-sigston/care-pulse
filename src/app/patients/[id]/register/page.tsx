import { RegisterForm } from '@/components/forms/register-form';
import { getUser } from '@/lib/actions/patient.actions';
import { HeartPulse } from 'lucide-react';
import * as Sentry from '@sentry/nextjs';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

export default async function UserRegistration({
  params: { id },
}: SearchParamProps) {
  const user = await getUser(id);

  // Add 'jane' to a set
  // used for tracking the number of users that viewed a page.
  Sentry.metrics.set('user_view_register', user.name);

  return (
    <main className='flex h-screen max-h-screen'>
      <section className='container'>
        <div className='max-w-[496px] mx-auto'>
          <div className='flex items-center space-x-3 py-5'>
            <HeartPulse />
            <p className='text-lg font-semibold'>CarePulse</p>
          </div>
          <RegisterForm user={user} />
          <div className='text-14-regular mt-20 flex justify-between'>
            <p className='justify-items-end xl:text-left'>© 2024 CarePluse</p>
            <Link href='/?admin=true' className=''>
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src='/assets/images/register-img.png'
        height={1000}
        width={1000}
        alt='patient'
        className='max-w-[390px] object-cover hidden md:block'
      />
    </main>
  );
}
