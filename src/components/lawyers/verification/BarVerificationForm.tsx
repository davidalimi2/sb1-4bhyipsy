import React, { useState } from 'react';
import { FileText, Upload } from 'lucide-react';
import { Input } from '../../shared/ui/Input';
import { Select } from '../../shared/ui/Select';
import { Button } from '../../shared/ui/Button';
import { STATE_NAMES } from '../../../utils/courts/states';

interface BarVerificationFormProps {
  onSubmit: (data: {
    barNumber: string;
    barState: string;
    licenseDocument: File;
  }) => Promise<void>;
  isSubmitting?: boolean;
}

export function BarVerificationForm({ onSubmit, isSubmitting }: BarVerificationFormProps) {
  const [barNumber, setBarNumber] = useState('');
  const [barState, setBarState] = useState('');
  const [licenseDocument, setLicenseDocument] = useState<File | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!barNumber || !barState || !licenseDocument) return;

    await onSubmit({
      barNumber,
      barState,
      licenseDocument
    });
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <Input
        label="Bar Number"
        value={barNumber}
        onChange={(e) => setBarNumber(e.target.value)}
        required
        placeholder="Enter your bar number"
      />

      <Select
        label="Bar State"
        value={barState}
        onChange={(e) => setBarState(e.target.value)}
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
            {licenseDocument ? (
              <div className="flex items-center justify-center">
                <FileText className="h-8 w-8 text-gray-400" />
                <span className="ml-2 text-sm text-gray-600">{licenseDocument.name}</span>
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
                      onChange={(e) => setLicenseDocument(e.target.files?.[0] || null)}
                    />
                  </label>
                  <p className="pl-1">or drag and drop</p>
                </div>
                <p className="text-xs text-gray-500">PDF, JPG, or PNG up to 10MB</p>
              </>
            )}
          </div>
        </div>
      </div>

      <div className="flex justify-end">
        <Button
          type="submit"
          loading={isSubmitting}
          disabled={!barNumber || !barState || !licenseDocument}
        >
          Submit for Verification
        </Button>
      </div>
    </form>
  );
}