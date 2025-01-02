import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { TextArea } from '../../shared/ui/TextArea';
import { Button } from '../../shared/ui/Button';
import { SignupSteps } from './SignupSteps';
import { BarVerificationForm } from '../verification/BarVerificationForm';
import { useNotifications } from '../../../hooks/useNotifications';
import { supabase } from '../../../lib/supabase';

export function LawyerSignupForm() {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { addNotification } = useNotifications();
  const [formData, setFormData] = useState({
    // Basic Info
    email: '',
    password: '',
    name: '',
    phone: '',
    
    // Professional Info
    practiceAreas: [] as string[],
    yearsExperience: '',
    hourlyRate: '',
    languages: [] as string[],
    location: '',
    bio: '',
    availability: 'immediate' as const,

    // Bar Info
    barNumber: '',
    barState: '',
    licenseDocument: null as File | null
  });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (currentStep < 3) {
      setCurrentStep(prev => prev + 1);
      return;
    }

    try {
      setIsSubmitting(true);

      // Create auth user
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            user_type: 'lawyer'
          }
        }
      });

      if (authError) throw authError;

      // Upload license document
      const timestamp = Date.now();
      const fileExt = formData.licenseDocument?.name.split('.').pop();
      const filePath = `verifications/${timestamp}.${fileExt || ''}`;

      if (formData.licenseDocument) {
        const { error: uploadError } = await supabase.storage
          .from('documents')
          .upload(filePath, formData.licenseDocument);

        if (uploadError) throw uploadError;
      }

      // Create verification record with proper error handling
      const { error: verificationError } = await supabase
        .from('lawyer_verifications')
        .insert({
          bar_number: formData.barNumber,
          bar_state: formData.barState,
          license_document: filePath,
          practice_areas: formData.practiceAreas,
          years_of_practice: parseInt(formData.yearsExperience),
          references: [],
          status: 'pending'
        });

      if (verificationError) throw verificationError;

      // Create lawyer profile
      const { error: profileError } = await supabase
        .from('lawyers')
        .insert({
          id: authData.user?.id,
          name: formData.name,
          email: formData.email,
          phone: formData.phone,
          practice_areas: formData.practiceAreas,
          years_experience: parseInt(formData.yearsExperience),
          hourly_rate: parseInt(formData.hourlyRate),
          languages: formData.languages,
          location: formData.location,
          bio: formData.bio,
          availability: formData.availability,
          bar_number: formData.barNumber,
          bar_state: formData.barState,
          verification_status: 'pending'
        });

      if (profileError) throw profileError;

      addNotification({
        type: 'success',
        title: 'Account created',
        message: 'Your lawyer account has been created and is pending verification'
      });

      navigate('/lawyers/dashboard');
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to create account'
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const renderStep = () => {
    switch (currentStep) {
      case 0:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Basic Information</h3>
            <Input
              label="Email"
              type="email"
              required
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
            <Input
              label="Password"
              type="password"
              required
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            />
            <Input
              label="Full Name"
              required
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            />
            <Input
              label="Phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        );

      case 1:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Professional Information</h3>
            <Select
              label="Practice Areas"
              multiple
              value={formData.practiceAreas}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, practiceAreas: options });
              }}
            >
              <option value="civil">Civil Litigation</option>
              <option value="family">Family Law</option>
              <option value="criminal">Criminal Defense</option>
              <option value="business">Business Law</option>
              <option value="real_estate">Real Estate</option>
              <option value="immigration">Immigration</option>
            </Select>
            <Input
              label="Years of Experience"
              type="number"
              required
              value={formData.yearsExperience}
              onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
            />
            <Input
              label="Hourly Rate"
              type="number"
              required
              value={formData.hourlyRate}
              onChange={(e) => setFormData({ ...formData, hourlyRate: e.target.value })}
            />
            <Select
              label="Languages"
              multiple
              value={formData.languages}
              onChange={(e) => {
                const options = Array.from(e.target.selectedOptions, option => option.value);
                setFormData({ ...formData, languages: options });
              }}
            >
              <option value="en">English</option>
              <option value="es">Spanish</option>
              <option value="fr">French</option>
              <option value="zh">Chinese</option>
            </Select>
          </div>
        );

      case 2:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Bar Verification</h3>
            <BarVerificationForm
              onSubmit={async ({ barNumber, barState, licenseDocument }) => {
                setFormData(prev => ({
                  ...prev,
                  barNumber,
                  barState,
                  licenseDocument
                }));
                setCurrentStep(prev => prev + 1);
              }}
            />
          </div>
        );

      case 3:
        return (
          <div className="space-y-6">
            <h3 className="text-lg font-medium text-gray-900">Profile Setup</h3>
            <Input
              label="Location"
              required
              value={formData.location}
              onChange={(e) => setFormData({ ...formData, location: e.target.value })}
            />
            <Select
              label="Availability"
              value={formData.availability}
              onChange={(e) => setFormData({ ...formData, availability: e.target.value as any })}
            >
              <option value="immediate">Immediate</option>
              <option value="within_week">Within a Week</option>
              <option value="within_month">Within a Month</option>
              <option value="unavailable">Currently Unavailable</option>
            </Select>
            <TextArea
              label="Professional Bio"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
              rows={4}
              placeholder="Tell us about your experience and expertise..."
            />
          </div>
        );
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      <SignupSteps currentStep={currentStep} />
      {renderStep()}
      
      <div className="flex justify-between">
        {currentStep > 0 && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setCurrentStep(prev => prev - 1)}
          >
            Back
          </Button>
        )}
        <Button
          type="submit"
          loading={isSubmitting}
        >
          {currentStep === 3 ? 'Create Account' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}