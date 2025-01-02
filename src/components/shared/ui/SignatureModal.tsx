import React, { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';
import SignatureCanvas from 'react-signature-canvas';
import { Button } from './Button';
import { useNotifications } from '../../../hooks/useNotifications';

interface SignatureModalProps {
  onClose: () => void;
  onSigned: (signature: string) => void;
}

export function SignatureModal({ onClose, onSigned }: SignatureModalProps) {
  const signaturePadRef = useRef<any>(null);
  const [signatureType, setSignatureType] = useState<'draw' | 'type' | 'upload'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  const [uploadedSignature, setUploadedSignature] = useState<string | null>(null);
  const { addNotification } = useNotifications();

  const handleSave = async () => {
    try {
      let signatureData: string | null = null;

      switch (signatureType) {
        case 'draw':
          if (signaturePadRef.current?.isEmpty()) {
            addNotification({
              type: 'error',
              title: 'Signature Required',
              message: 'Please draw your signature before saving'
            });
            return;
          }
          signatureData = signaturePadRef.current?.toDataURL();
          break;

        case 'type':
          if (!typedSignature.trim()) {
            addNotification({
              type: 'error',
              title: 'Signature Required',
              message: 'Please type your signature before saving'
            });
            return;
          }
          signatureData = typedSignature;
          break;

        case 'upload':
          if (!uploadedSignature) {
            addNotification({
              type: 'error',
              title: 'Signature Required',
              message: 'Please upload your signature before saving'
            });
            return;
          }
          signatureData = uploadedSignature;
          break;
      }

      if (signatureData) {
        onSigned(signatureData);
        addNotification({
          type: 'success',
          title: 'Signature Saved',
          message: 'Your signature has been saved successfully'
        });
      }
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: 'Failed to save signature'
      });
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        addNotification({
          type: 'error',
          title: 'Invalid File',
          message: 'Please upload an image file'
        });
        return;
      }

      const reader = new FileReader();
      reader.onload = (event) => {
        setUploadedSignature(event.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full">
        <div className="flex items-center justify-between p-4 border-b">
          <h3 className="text-lg font-medium">Add Signature</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-500"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="p-4 space-y-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setSignatureType('draw')}
              className={`flex-1 py-2 px-4 rounded-md ${
                signatureType === 'draw' 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'border border-gray-200'
              }`}
            >
              Draw
            </button>
            <button
              onClick={() => setSignatureType('type')}
              className={`flex-1 py-2 px-4 rounded-md ${
                signatureType === 'type'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'border border-gray-200'
              }`}
            >
              Type
            </button>
            <button
              onClick={() => setSignatureType('upload')}
              className={`flex-1 py-2 px-4 rounded-md ${
                signatureType === 'upload'
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                  : 'border border-gray-200'
              }`}
            >
              Upload
            </button>
          </div>

          {signatureType === 'draw' && (
            <div className="border rounded-lg p-2 bg-gray-50">
              <SignatureCanvas
                ref={signaturePadRef}
                canvasProps={{
                  className: 'w-full h-40 bg-white rounded border border-gray-200'
                }}
              />
              <button
                onClick={() => signaturePadRef.current?.clear()}
                className="mt-2 text-sm text-gray-600 hover:text-gray-900"
              >
                Clear
              </button>
            </div>
          )}

          {signatureType === 'type' && (
            <input
              type="text"
              value={typedSignature}
              onChange={(e) => setTypedSignature(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:ring-indigo-500 focus:border-indigo-500 font-signature text-xl"
              placeholder="Type your signature"
            />
          )}

          {signatureType === 'upload' && (
            <div className="space-y-4">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-4">
                <div className="text-center">
                  <Upload className="mx-auto h-12 w-12 text-gray-400" />
                  <div className="mt-2">
                    <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                      <span>Upload a file</span>
                      <input
                        type="file"
                        className="sr-only"
                        accept="image/*"
                        onChange={handleImageUpload}
                      />
                    </label>
                  </div>
                  <p className="mt-1 text-sm text-gray-500">
                    PNG, JPG, GIF up to 10MB
                  </p>
                </div>
              </div>

              {uploadedSignature && (
                <div className="mt-4">
                  <img
                    src={uploadedSignature}
                    alt="Uploaded signature"
                    className="max-h-40 mx-auto"
                  />
                </div>
              )}
            </div>
          )}

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              disabled={
                (signatureType === 'draw' && signaturePadRef.current?.isEmpty()) ||
                (signatureType === 'type' && !typedSignature.trim()) ||
                (signatureType === 'upload' && !uploadedSignature)
              }
            >
              Save Signature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}