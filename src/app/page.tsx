import { PatientForm } from '@/components/forms/patient-form';
import PassKeyModal from '@/components/passkey-modal';
import { Button } from '@/components/ui/button';
import { HeartPulse } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';

export default function Home({ searchParams }: SearchParamProps) {
  const isAdmin = searchParams.admin === 'true';
  console.log(isAdmin);
  return (
    <main className='flex h-screen max-h-screen'>
      {isAdmin && <PassKeyModal />}
      <section className='container remove-scrollbar'>
        <div className='max-w-[496px] mx-auto'>
          <div className='flex items-center space-x-3 py-5'>
            <HeartPulse />
            <p className='text-lg font-semibold'>CarePulse</p>
          </div>
          <PatientForm />
          <div className='text-14-regular mt-20 flex justify-between'>
            <p className='justify-items-end xl:text-left'>© 2024 CarePluse</p>
            <Link href='/?admin=true' className=''>
              Admin
            </Link>
          </div>
        </div>
      </section>
      <Image
        src='/assets/images/onboarding-img.png'
        height={1000}
        width={1000}
        alt='patient'
        className='max-w-[50%] object-cover hidden md:block'
      />
    </main>
  );
}
