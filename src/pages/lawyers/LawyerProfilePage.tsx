import React from 'react';
import { useParams } from 'react-router-dom';
import { LawyerHeader } from '../../components/lawyers/profile/LawyerHeader';
import { LawyerExperience } from '../../components/lawyers/profile/LawyerExperience';
import { LawyerEducation } from '../../components/lawyers/profile/LawyerEducation';
import { LawyerContactCard } from '../../components/lawyers/messaging/LawyerContactCard';
import { LawyerReviews } from '../../components/lawyers/profile/LawyerReviews';
import { LoadingSpinner } from '../../components/shared/ui/LoadingSpinner';
import { useLawyer } from '../../hooks/lawyers/useLawyer';

export default function LawyerProfilePage() {
  const { id = '' } = useParams();
  const { lawyer, isLoading } = useLawyer(id);

  if (isLoading) {
    return (
      <div className="flex justify-center py-12">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!lawyer) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-8">
        <div className="bg-red-50 p-4 rounded-md">
          <p className="text-red-700">Lawyer not found</p>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <LawyerHeader lawyer={lawyer} />

      <div className="mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-8">
          <LawyerExperience lawyer={lawyer} />
          <LawyerEducation lawyer={lawyer} />
          <LawyerReviews reviews={[]} />
        </div>

        <div>
          <div className="sticky top-8">
            <LawyerContactCard
              lawyerId={lawyer.id}
              name={lawyer.name}
              email={lawyer.email}
              phone={lawyer.phone}
              hourlyRate={lawyer.hourly_rate}
              availability={lawyer.availability}
            />
          </div>
        </div>
      </div>
    </div>
  );
}