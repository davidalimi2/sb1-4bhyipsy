```typescript
import React, { useState } from 'react';
import { FileText, Upload, Plus, Trash } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Button } from '../../shared/ui/Button';
import { STATE_NAMES } from '../../../utils/courts/states';
import { useVerification } from '../../../hooks/lawyers/useVerification';

const PRACTICE_AREAS = [
  'Civil Litigation',
  'Family Law',
  'Criminal Defense',
  'Corporate Law',
  'Real Estate',
  'Intellectual Property',
  'Immigration',
  'Tax Law',
  'Employment Law',
  'Estate Planning'
];

export function VerificationForm() {
  const { submitVerification, isSubmitting } = useVerification();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    barNumber: '',
    barState: '',
    licenseDocument: null as File | null,
    practiceAreas: [] as string[],
    yearsOfPractice: '',
    references: [] as Array<{
      name: string;
      email: string;
      phone: string;
      relationship: string;
    }>
  });

  const addReference = () => {
    setFormData(prev => ({
      ...prev,
      references: [
        ...prev.references,
        { name: '', email: '', phone: '', relationship: '' }
      ]
    }));
  };

  const removeReference = (index: number) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.filter((_, i) => i !== index)
    }));
  };

  const updateReference = (index: number, field: string, value: string) => {
    setFormData(prev => ({
      ...prev,
      references: prev.references.map((ref, i) => 
        i === index ? { ...ref, [field]: value } : ref
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 3) {
      setStep(prev => prev + 1);
      return;
    }

    if (!formData.licenseDocument) return;

    await submitVerification({
      ...formData,
      yearsOfPractice: parseInt(formData.yearsOfPractice)
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {step === 1 && (
        <>
          <h3 className="text-lg font-medium text-gray-900">Bar Information</h3>
          <Input
            label="Bar Number"
            value={formData.barNumber}
            onChange={(e) => setFormData(prev => ({ ...prev, barNumber: e.target.value }))}
            required
          />

          <Select
            label="Bar State"
            value={formData.barState}
            onChange={(e) => setFormData(prev => ({ ...prev, barState: e.target.value }))}
            required
          >
            <option value="">Select state</option>
            {Object.entries(STATE_NAMES).map(([code, name]) => (
              <option key={code} value={code}>{name}</option>
            ))}
          </Select>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Bar License Document
            </label>
            <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-md">
              <div className="space-y-1 text-center">
                {formData.licenseDocument ? (
                  <div className="flex items-center justify-center">
                    <FileText className="h-8 w-8 text-gray-400" />
                    <span className="ml-2 text-sm text-gray-600">
                      {formData.licenseDocument.name}
                    </span>
                  </div>
                ) : (
                  <>
                    <Upload className="mx-auto h-12 w-12 text-gray-400" />
                    <div className="flex text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input
                          type="file"
                          className="sr-only"
                          accept=".pdf,.jpg,.jpeg,.png"
                          onChange={(e) => setFormData(prev => ({
                            ...prev,
                            licenseDocument: e.target.files?.[0] || null
                          }))}
                        />
                      </label>
                      <p className="pl-1">or drag and drop</p>
                    </div>
                    <p className="text-xs text-gray-500">
                      PDF, JPG, or PNG up to 10MB
                    </p>
                  </>
                )}
              </div>
            </div>
          </div>
        </>
      )}

      {step === 2 && (
        <>
          <h3 className="text-lg font-medium text-gray-900">Practice Information</h3>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Practice Areas
            </label>
            <div className="grid grid-cols-2 gap-2">
              {PRACTICE_AREAS.map(area => (
                <label key={area} className="flex items-center">
                  <input
                    type="checkbox"
                    checked={formData.practiceAreas.includes(area)}
                    onChange={(e) => {
                      if (e.target.checked) {
                        setFormData(prev => ({
                          ...prev,
                          practiceAreas: [...prev.practiceAreas, area]
                        }));
                      } else {
                        setFormData(prev => ({
                          ...prev,
                          practiceAreas: prev.practiceAreas.filter(a => a !== area)
                        }));
                      }
                    }}
                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
                  />
                  <span className="ml-2 text-sm text-gray-700">{area}</span>
                </label>
              ))}
            </div>
          </div>

          <Input
            type="number"
            label="Years of Practice"
            value={formData.yearsOfPractice}
            onChange={(e) => setFormData(prev => ({
              ...prev,
              yearsOfPractice: e.target.value
            }))}
            min="0"
            required
          />
        </>
      )}

      {step === 3 && (
        <>
          <h3 className="text-lg font-medium text-gray-900">Professional References</h3>
          <div className="space-y-4">
            {formData.references.map((reference, index) => (
              <div key={index} className="bg-gray-50 p-4 rounded-lg space-y-4">
                <div className="flex justify-between items-start">
                  <h4 className="text-sm font-medium text-gray-900">
                    Reference #{index + 1}
                  </h4>
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    icon={<Trash className="h-4 w-4" />}
                    onClick={() => removeReference(index)}
                  >
                    Remove
                  </Button>
                </div>

                <Input
                  label="Name"
                  value={reference.name}
                  onChange={(e) => updateReference(index, 'name', e.target.value)}
                  required
                />

                <Input
                  type="email"
                  label="Email"
                  value={reference.email}
                  onChange={(e) => updateReference(index, 'email', e.target.value)}
                  required
                />

                <Input
                  type="tel"
                  label="Phone"
                  value={reference.phone}
                  onChange={(e) => updateReference(index, 'phone', e.target.value)}
                />

                <Input
                  label="Professional Relationship"
                  value={reference.relationship}
                  onChange={(e) => updateReference(index, 'relationship', e.target.value)}
                  required
                />
              </div>
            ))}

            <Button
              type="button"
              variant="secondary"
              onClick={addReference}
              icon={<Plus className="h-4 w-4" />}
            >
              Add Reference
            </Button>
          </div>
        </>
      )}

      <div className="flex justify-between pt-6">
        {step > 1 && (
          <Button
            type="button"
            variant="secondary"
            onClick={() => setStep(prev => prev - 1)}
          >
            Back
          </Button>
        )}
        <Button
          type="submit"
          loading={isSubmitting}
        >
          {step === 3 ? 'Submit for Verification' : 'Continue'}
        </Button>
      </div>
    </form>
  );
}
```