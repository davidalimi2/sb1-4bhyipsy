@@ .. @@
 import { Edit, Archive } from 'lucide-react';
 import { CaseStatusBadge } from './CaseStatusBadge';
+import { Button } from '../shared/ui/Button';
 import type { Case } from '../../types';
 
 interface CaseDetailsHeaderProps {
@@ .. @@
         </div>
         <div className="flex space-x-3">
           {onEdit && caseData.status !== 'closed' && (
-            <button
+            <Button
               onClick={onEdit}
-              className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
+              variant="secondary"
+              icon={<Edit className="h-4 w-4 mr-2" />}
             >
-              <Edit className="h-4 w-4 mr-2" />
               Edit Case
-            </button>
+            </Button>
           )}
           {onClose && caseData.status !== 'closed' && (
-            <button
+            <Button
               onClick={onClose}
-              className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700"
+              variant="primary"
+              icon={<Archive className="h-4 w-4 mr-2" />}
             >
-              <Archive className="h-4 w-4 mr-2" />
               Close Case
-            </button>
+            </Button>
           )}
         </div>
       </div>
       <p className="mt-2 text-sm text-gray-500">{caseData.description}</p>
     </div>
   );
 }