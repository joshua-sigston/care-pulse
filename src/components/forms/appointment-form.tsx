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
import {
  createAppointment,
  updateAppointment,
} from '@/lib/actions/appointment.actions';
import { Appointment } from '@/types/appwrite.types';

export function AppointmentForm({
  userId,
  patientId,
  type,
  appointment,
  setOpen,
}: {
  userId: string;
  patientId: string;
  type: 'create' | 'cancel' | 'schedule';
  appointment?: Appointment;
  setOpen: (open: boolean) => void;
}) {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.

  const AppointmentFormValidation = getAppointmentSchema(type);

  const form = useForm<z.infer<typeof AppointmentFormValidation>>({
    resolver: zodResolver(AppointmentFormValidation),
    defaultValues: {
      primaryPhysician: appointment ? appointment?.primaryPhysician : '',
      schedule: appointment
        ? new Date(appointment?.schedule!)
        : new Date(Date.now()),
      reason: appointment ? appointment.reason : '',
      notes: appointment?.notes || '',
      cancellationReason: appointment?.cancellationReason || '',
    },
  });

  const onSubmit = async (
    values: z.infer<typeof AppointmentFormValidation>
  ) => {
    setIsLoading(true);

    let status;
    switch (type) {
      case 'schedule':
        status = 'scheduled';
        break;
      case 'cancel':
        status = 'cancelled';
        break;
      default:
        status = 'pending';
    }

    try {
      if (type === 'create' && patientId) {
        const appointment = {
          userId,
          patient: patientId,
          primaryPhysician: values.primaryPhysician,
          schedule: new Date(values.schedule),
          reason: values.reason!,
          status: status as Status,
          notes: values.notes,
        };

        const newAppointment = await createAppointment(appointment);

        if (newAppointment) {
          form.reset();
          router.push(
            `/patients/${userId}/new-appointment/success?appointmentId=${newAppointment.$id}`
          );
        }
      } else {
        const appointmentToUpdate = {
          userId,
          appointmentId: appointment?.$id!,
          appointment: {
            primaryPhysician: values.primaryPhysician,
            schedule: new Date(values.schedule),
            status: status as Status,
            cancellationReason: values.cancellationReason,
          },
          type,
        };

        const updatedAppointment = await updateAppointment(appointmentToUpdate);

        if (updatedAppointment) {
          setOpen && setOpen(false);
          form.reset();
        }
      }
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  let buttonLabel;
  switch (type) {
    case 'cancel':
      buttonLabel = 'Cancel Appointment';
      break;
    case 'schedule':
      buttonLabel = 'Schedule Appointment';
      break;
    default:
      buttonLabel = 'Submit Apppointment';
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-4'>
        {type === 'create' && (
          <section className='space-y-4'>
            <h1 className='tracking-wide font-bold text-lg'>New Appointment</h1>
            <p className='tracking-wide font-semibold'>
              Schedule your appointment with no hassel
            </p>
          </section>
        )}
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
                    {/* <Image
                      src={doctor.image}
                      height={32}
                      width={32}
                      alt='doctor image'
                      className='rounded-full'
                    /> */}
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
              name='cancellationReason'
              label='Reason for cancellation'
              placeholder='Please enter a reason for cancellation'
            />
          </>
        )}
        <SubmitButton
          isLoading={isLoading}
          className={`${type === 'cancel' ? 'shad-danger-btn' : 'bg-sky-400'}`}
        >
          {buttonLabel}
        </SubmitButton>
      </form>
    </Form>
  );
}
