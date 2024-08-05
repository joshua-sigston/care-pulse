'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form } from '@/components/ui/form';
import FormFieldComponent from '../form-field-component';
import SubmitButton from '../submit-buton';
import { useState } from 'react';
import { getAppointmentSchema } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import { FormFieldType } from './patient-form';
import { Doctors } from '@/constants';
import { SelectItem } from '../ui/select';
import Image from 'next/image';
import { createAppointment } from '@/lib/actions/appointment.actions';

export function AppointmentForm({
  userId,
  patientId,
  type,
}: {
  userId: string;
  patientId: string;
  type: 'create' | 'cancel' | 'schedule';
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: '',
      schedule: new Date(),
      reason: '',
      notes: '',
      cancellationReason: '',
    },
  });

  let buttonLabel;

  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
      break;
    case 'create':
      buttonLabel = 'Create Appointment';
      break;
    case 'schedule':
      buttonLabel = 'Schedule Appointment';
    default:
      break;
  }

  // 2. Define a submit handler.
  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;

    switch (type) {
      case 'cancel':
        status = 'cancel';
        break;
      case 'schedule':
        status = 'schedule';
      default:
        status = 'pending';
        break;
    }

    try {
      if (type === 'create' && patientId) {
        const appointmentData = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          notes: values.notes,
          status: status as Status,
        };
        const appointment = await createAppointment(appointmentData);

        if (appointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${appointment.$id}`
          );
        }
      }
    } catch (error) {
      console.log(error);
    }

    setIsLoading(false);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-5'>
        <section className='space-y-4'>
          <h1 className='tracking-wide font-bold text-lg'>New Appointment</h1>
          <p className='tracking-wide font-semibold'>
            Schedule your appointment with no hassel
          </p>
        </section>
        {type !== 'cancel' && (
          <>
            <FormFieldComponent
              fieldType={FormFieldType.SELECT}
              control={form.control}
              name='primaryPhysician'
              label='Doctor'
              placeholder='Select a doctor'
            >
              {Doctors.map((doctor, index) => (
                <SelectItem key={index} value={doctor.name}>
                  <div className='flex cursor-pointer items-center gap-2'>
                    <Image
                      src={doctor.image}
                      height={32}
                      width={32}
                      alt='doctor image'
                      className='rounded-full'
                    />
                    <p>{doctor.name}</p>
                  </div>
                </SelectItem>
              ))}
            </FormFieldComponent>
            <FormFieldComponent
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name='schedule'
              label='Expected appointment date'
              showTimeSelect
              dateFormat='mm/dd/yyyy - h:mm aa'
            />
            <div className='lg:grid lg:grid-cols-2 gap-3'>
              <FormFieldComponent
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name='reason'
                label='reason for appointment'
                placeholder='Enter a reason for appointment '
              />
              <FormFieldComponent
                control={form.control}
                fieldType={FormFieldType.TEXTAREA}
                name='notes'
                label='Notes'
                placeholder='Enter notes'
              />
            </div>
          </>
        )}
        {/* CANCEL APPOINTMENT */}
        {type === 'cancel' && (
          <>
            <FormFieldComponent
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name='cancelationReason'
              label='Reason for cancelation'
              placeholder='Please enter a reason for cancelation'
            />
          </>
        )}
        <SubmitButton
          isLoading={isLoading}
          className={`${
            type === 'cancel' ? 'shad-danger-btn' : 'shad-primary-btn'
          }`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
}
