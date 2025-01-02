@@ .. @@
   const validateField = (field: keyof NewMessageData, value: any) => {
     switch (field) {
       case 'recipient_id':
-        if (!value?.trim()) {
+        if (!value) {
           setErrors(prev => ({ ...prev, recipient_id: 'Recipient is required' }));
         } else {
           setErrors(prev => {
@@ .. @@
       case 'subject':
         if (!data.subject?.trim()) {
           return { valid: false, error: 'Subject is required' };
-        } else if (data.subject.length > MAX_SUBJECT_LENGTH) {
+        }
+        if (data.subject.length > MAX_SUBJECT_LENGTH) {
           return { valid: false, error: `Subject cannot exceed ${MAX_SUBJECT_LENGTH} characters` };
         }
         break;
@@ .. @@
       case 'content':
         if (!data.content?.trim()) {
           return { valid: false, error: 'Message content is required' };
-        } else if (data.content.length > MAX_CONTENT_LENGTH) {
+        }
+        if (data.content.length > MAX_CONTENT_LENGTH) {
           return { valid: false, error: `Content cannot exceed ${MAX_CONTENT_LENGTH} characters` };
         }
         break;