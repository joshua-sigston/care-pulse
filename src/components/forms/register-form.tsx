'use client';

import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Form, FormControl } from '@/components/ui/form';
import FormFieldComponent from '../form-field-component';
import SubmitButton from '../submit-buton';
import { useState } from 'react';
import { UserFormValidation } from '@/lib/validation';
import { useRouter } from 'next/navigation';
import { createUser } from '@/lib/actions/patient.actions';
import { FormFieldType } from './patient-form';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Doctors, genderOptions, IdentificationTypes } from '@/constants';
import { Label } from '../ui/label';
import { SelectItem } from '../ui/select';
import Image from 'next/image';
import { FileUploader } from '../file-uploader';

export function RegisterForm({ user }: { user: User }) {
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
  const onSubmit = async (values: z.infer<typeof UserFormValidation>) => {
    setIsLoading(true);

    try {
      const user = {
        name: values.name,
        email: values.email,
        phone: values.phone,
      };

      const newUser = await createUser(user);
      // console.log(newUser);

      if (newUser) {
        router.push(`/patients/${newUser?.$id}/register`);
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
          <h1 className='tracking-wide font-bold text-lg'>Welcome</h1>
          <p className='tracking-wide font-semibold'>
            Let us know more about yourself
          </p>
        </section>
        {/* personal information */}
        <section className='space-y-4'>
          <div>
            <h2 className='tracking-wide font-bold text-lg'>
              Personal Information
            </h2>
            <FormFieldComponent
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name='name'
              label='Full Name'
              placeholder='John Doe'
              iconSrc='/assets/icons/user.svg'
              iconAlt='user'
            />
          </div>
          <div>
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
          </div>
          <div className='flex flex-col lg:flex-row lg:space-x-3'>
            <FormFieldComponent
              fieldType={FormFieldType.DATE_PICKER}
              control={form.control}
              name='birthDate'
              label='Date of Birth'
            />
            <FormFieldComponent
              fieldType={FormFieldType.SKELETON}
              control={form.control}
              name='gender'
              label='Gender'
              renderSkeleton={(field) => (
                <FormControl>
                  <RadioGroup
                    className='flex h-11 gap-6 xl:justify-between'
                    onValueChange={field.onChange}
                    defaultValue={field.value}
                  >
                    {genderOptions.map((option, index) => (
                      <div key={index} className='radio-group'>
                        <RadioGroupItem value={option} id={option} />
                        <Label htmlFor={option} className='cursor-pointer'>
                          {option}
                        </Label>
                      </div>
                    ))}
                  </RadioGroup>
                </FormControl>
              )}
            />
          </div>
          <div className='lg:grid lg:grid-cols-2 gap-3'>
            <FormFieldComponent
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name='address'
              label='Address'
              placeholder='14th Street, New York'
            />
            <FormFieldComponent
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='occupation'
              label='Occupation'
              placeholder='Software Engineer'
            />
          </div>
          <div className='lg:grid lg:grid-cols-2 gap-3'>
            <FormFieldComponent
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name='emergencyContact'
              label='Emergency Contact'
              placeholder='Guardians Name'
            />
            <FormFieldComponent
              fieldType={FormFieldType.PHONE_INPUT}
              control={form.control}
              name='emergencyContactNumber'
              label='Emergency Contact Number'
              placeholder='(555) 123-4567'
            />
          </div>
        </section>
        {/* medical information */}
        <section className='space-y-4'>
          <div>
            <h2 className='tracking-wide font-bold text-lg'>
              Medical Information
            </h2>
          </div>
          <FormFieldComponent
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name='primaryPhysician'
            label='Primary Physician'
            placeholder='Select a physician'
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
          <div className='lg:grid lg:grid-cols-2 gap-3'>
            <FormFieldComponent
              control={form.control}
              fieldType={FormFieldType.INPUT}
              name='insuranceProvider'
              label='Insurance Provider'
              placeholder='BlueCross'
            />
            <FormFieldComponent
              fieldType={FormFieldType.INPUT}
              control={form.control}
              name='insurancePolicyNumber'
              label='Insurance Policy Number'
              placeholder='ABC123456789'
            />
          </div>
          <div className='lg:grid lg:grid-cols-2 gap-3'>
            <FormFieldComponent
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name='allergies'
              label='Allergies (if any)'
              placeholder='Peanuts, Penicillin, Pollen'
            />
            <FormFieldComponent
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name='currentMedication'
              label='Current Medication (if any)'
              placeholder='Ibuprofen 200mg, Paracetamol 500mg'
            />
          </div>
          <div className='lg:grid lg:grid-cols-2 gap-3'>
            <FormFieldComponent
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name='familyHistory'
              label='Family Medical History'
              placeholder='Mother: Lung Cancer'
            />
            <FormFieldComponent
              control={form.control}
              fieldType={FormFieldType.TEXTAREA}
              name='medicalHistory'
              label='Your Medical History'
              placeholder='Measels, Surgey for back pain...'
            />
          </div>
        </section>
        {/* identification and verification */}
        <section className='space-y-4'>
          <div>
            <h2 className='tracking-wide font-bold text-lg'>
              Identification and Verification
            </h2>
          </div>
          <FormFieldComponent
            fieldType={FormFieldType.SELECT}
            control={form.control}
            name='identificationType'
            label='Identification Type'
            placeholder='Select a identification type'
          >
            {IdentificationTypes.map((type, index) => (
              <SelectItem key={index} value={type}>
                {type}
              </SelectItem>
            ))}
          </FormFieldComponent>
          <FormFieldComponent
            control={form.control}
            fieldType={FormFieldType.INPUT}
            name='identificationNumber'
            label='Identification Number'
          />
          <FormFieldComponent
            fieldType={FormFieldType.SKELETON}
            control={form.control}
            name='identificationDocument'
            label='Scan copy of identification document'
            renderSkeleton={(field) => (
              <FormControl>
                <FileUploader files={field.value} onChange={field.onChange} />
              </FormControl>
            )}
          />
        </section>
        <section className='space-y-4'>
          <div>
            <h2 className='tracking-wide font-bold text-lg'>
              Consent to Privacy
            </h2>
          </div>
          <FormFieldComponent
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name='treatmentConsent'
            label='I consent to treatment'
          />
          <FormFieldComponent
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name='disclosureConsent'
            label='I consent to disclosure consent'
          />
          <FormFieldComponent
            fieldType={FormFieldType.CHECKBOX}
            control={form.control}
            name='privacyConsent'
            label='I consent to privacy'
          />
        </section>
        <SubmitButton isLoading={isLoading}>Get Started</SubmitButton>
      </form>
    </Form>
  );
}
