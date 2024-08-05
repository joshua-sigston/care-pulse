import { AppointmentForm } from '@/components/forms/appointment-form';
import { getPatient } from '@/lib/actions/patient.actions';
import { HeartPulse } from 'lucide-react';
import Image from 'next/image';

export default async function NewAppointment({
  params: { id },
}: SearchParamProps) {
  // console.log(id);
  const patient = await getPatient(id);
  // console.log(patient);
  return (
    <main className='flex h-screen max-h-screen'>
      <section className='container remove-scrollbar '>
        <div className='max-w-[860px] mx-auto flex-1 justify-between'>
          <div className='flex items-center space-x-3 py-5'>
            <HeartPulse />
            <p className='text-lg font-semibold'>CarePulse</p>
          </div>
          <AppointmentForm type='create' userId={id} patientId={patient.$id} />

          <p className='justify-items-end xl:text-left'>© 2024 CarePluse</p>
        </div>
      </section>
      <Image
        src='/assets/images/appointment-img.png'
        height={1000}
        width={1000}
        alt='patient'
        className='max-w-[390px] bg-bottom'
      />
    </main>
  );
}
