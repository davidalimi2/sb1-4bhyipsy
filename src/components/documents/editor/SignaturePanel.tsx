```typescript
import React, { useState, useRef } from 'react';
import SignaturePad from 'react-signature-canvas';
import { X, Download, Upload, Pen } from 'lucide-react';
import { Button } from '../../shared/ui/Button';
import { useSignature } from '../../../hooks/documents/useSignature';

interface SignaturePanelProps {
  documentId: string;
  onClose: () => void;
  onSigned: () => void;
}

export function SignaturePanel({ documentId, onClose, onSigned }: SignaturePanelProps) {
  const signaturePadRef = useRef<any>(null);
  const [signatureType, setSignatureType] = useState<'draw' | 'upload' | 'type'>('draw');
  const [typedSignature, setTypedSignature] = useState('');
  
  const { addSignature, isProcessing } = useSignature();

  const handleSave = async () => {
    let signatureData: string | null = null;

    if (signatureType === 'draw') {
      signatureData = signaturePadRef.current?.toDataURL();
    } else if (signatureType === 'type') {
      signatureData = typedSignature;
    }

    if (signatureData) {
      await addSignature(documentId, signatureData, signatureType);
      onSigned();
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full p-6">
        <div className="flex justify-between items-center mb-4">
          <h3 className="text-lg font-medium text-gray-900">Add Signature</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-500">
            <X className="h-5 w-5" />
          </button>
        </div>

        <div className="space-y-4">
          <div className="flex space-x-4 mb-4">
            <button
              onClick={() => setSignatureType('draw')}
              className={`flex-1 py-2 px-4 rounded-md ${
                signatureType === 'draw' 
                  ? 'bg-indigo-50 text-indigo-700 border-indigo-200' 
                  : 'border border-gray-200'
              }`}
            >
              <Pen className="h-5 w-5 mx-auto mb-1" />
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
              <span className="font-signature text-lg">Aa</span>
              Type
            </button>
          </div>

          {signatureType === 'draw' && (
            <div className="border rounded-lg p-2 bg-gray-50">
              <SignaturePad
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

          <div className="flex justify-end space-x-3 pt-4">
            <Button
              variant="secondary"
              onClick={onClose}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSave}
              loading={isProcessing}
              disabled={
                (signatureType === 'draw' && !signaturePadRef.current?.toDataURL()) ||
                (signatureType === 'type' && !typedSignature.trim())
              }
            >
              Add Signature
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
```