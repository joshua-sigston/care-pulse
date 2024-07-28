'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Form } from '@/components/ui/form';
import FormFieldComponent from '../form-field-component';
import SubmitButton from '../submit-buton';
import { useState } from 'react';
import { UserFormValidation } from '@/lib/validation';
import { useRouter } from 'next/navigation';

export enum FormFieldType {
  INPUT = 'input',
  TEXTAREA = 'textarea',
  PHONE_INPUT = 'phoneInput',
  CHECKBOX = 'checkbox',
  DATE_PICKER = 'datePicker',
  SELECT = 'select',
  SKELETON = 'skeleton',
}

export function PatientForm() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  // 1. Define your form.
  const form = useForm<z.infer<typeof UserFormValidation>>({
    resolver: zodResolver(UserFormValidation),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
    },
  });

  // 2. Define a submit handler.
  async function onSubmit({
    name,
    email,
    phone,
  }: z.infer<typeof UserFormValidation>) {
    // Do something with the form values.
    // ✅ This will be type-safe and validated.
    setIsLoading(true);

    try {
      const userData = { name, email, phone };
      console.log(userData);
      // const user = await createUser(user)

      // if (user) {
      //   router.push(`/patients/${user.$id}/register`)
      // }
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8 mt-5'>
        <section className='space-y-4'>
          <h1 className='tracking-wide font-bold text-lg'>Hello there</h1>
          <p className='tracking-wide font-semibold'>
            Schedule your first appointment
          </p>
        </section>
        <FormFieldComponent
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name='name'
          label='Full name'
          placeholder='John Doe'
          iconSrc='/assets/icons/user.svg'
          iconAlt='user'
        />
        <FormFieldComponent
          control={form.control}
          fieldType={FormFieldType.INPUT}
          name='email'
          label='Email'
          placeholder='example@google.com'
          iconSrc='/assets/icons/email.svg'
          iconAlt='email'
        />
        <FormFieldComponent
          fieldType={FormFieldType.PHONE_INPUT}
          control={form.control}
          name='phone'
          label='Phone number'
          placeholder='(555) 123-4567'
        />
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
}
