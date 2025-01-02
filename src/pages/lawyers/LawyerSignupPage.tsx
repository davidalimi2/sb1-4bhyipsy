import React from 'react';
import { LawyerSignupForm } from '../../components/lawyers/signup/LawyerSignupForm';
import { Scale } from 'lucide-react';

export default function LawyerSignupPage() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <div className="flex justify-center">
          <Scale className="h-12 w-12 text-indigo-600" />
        </div>
        <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
          Join as a Lawyer
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600">
          Create your professional profile and connect with clients who need your expertise
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-xl">
        <div className="bg-white py-8 px-4 shadow sm:rounded-lg sm:px-10">
          <LawyerSignupForm />
        </div>
      </div>
    </div>
  );
}