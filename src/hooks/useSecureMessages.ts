```typescript
import { useState, useEffect } from 'react';
import { supabase } from '../lib/supabase';
import { useNotifications } from './useNotifications';
import { generateKeyPair, encryptMessage, decryptMessage } from '../utils/encryption';
import { containsPHI, sanitizePHI, logPHIAccess } from '../utils/hipaa';
import { secureStorage } from '../utils/secureStorage';

interface SecureMessage {
  id: string;
  sender_id: string;
  recipient_id: string;
  encrypted_content: string;
  created_at: string;
}

export function useSecureMessages() {
  const [messages, setMessages] = useState<SecureMessage[]>([]);
  const [keyPair, setKeyPair] = useState<CryptoKeyPair | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const { addNotification } = useNotifications();

  // Initialize encryption keys
  useEffect(() => {
    const initKeys = async () => {
      try {
        // Try to load existing keys from secure storage
        const savedKeyPair = await secureStorage.getItem<CryptoKeyPair>('message_keys');
        if (savedKeyPair) {
          setKeyPair(savedKeyPair);
        } else {
          // Generate new key pair
          const newKeyPair = await generateKeyPair();
          await secureStorage.setItem('message_keys', newKeyPair);
          setKeyPair(newKeyPair);
        }
      } catch (error) {
        console.error('Failed to initialize encryption keys:', error);
        addNotification({
          type: 'error',
          title: 'Encryption Error',
          message: 'Failed to initialize message encryption'
        });
      }
    };

    initKeys();
  }, [addNotification]);

  // Fetch and decrypt messages
  useEffect(() => {
    const fetchMessages = async () => {
      if (!keyPair) return;

      try {
        setIsLoading(true);
        const { data: { user } } = await supabase.auth.getUser();
        if (!user) return;

        const { data, error } = await supabase
          .from('secure_messages')
          .select('*')
          .or(`sender_id.eq.${user.id},recipient_id.eq.${user.id}`)
          .order('created_at', { ascending: false });

        if (error) throw error;

        // Decrypt messages
        const decryptedMessages = await Promise.all(
          data.map(async (msg) => ({
            ...msg,
            content: await decryptMessage(msg.encrypted_content, keyPair.privateKey)
          }))
        );

        setMessages(decryptedMessages);

        // Log PHI access
        await logPHIAccess(
          user.id,
          'view',
          'messages',
          'Accessed encrypted messages'
        );
      } catch (error) {
        console.error('Failed to fetch messages:', error);
        addNotification({
          type: 'error',
          title: 'Error',
          message: 'Failed to load messages'
        });
      } finally {
        setIsLoading(false);
      }
    };

    fetchMessages();
  }, [keyPair, addNotification]);

  const sendMessage = async (recipientId: string, content: string) => {
    if (!keyPair) {
      throw new Error('Encryption not initialized');
    }

    try {
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) throw new Error('Not authenticated');

      // Check for PHI
      if (containsPHI(content)) {
        content = sanitizePHI(content);
      }

      // Get recipient's public key
      const { data: recipientKey } = await supabase
        .from('user_keys')
        .select('public_key')
        .eq('user_id', recipientId)
        .single();

      if (!recipientKey?.public_key) {
        throw new Error('Recipient public key not found');
      }

      // Encrypt message
      const encryptedContent = await encryptMessage(
        content,
        await importPublicKey(recipientKey.public_key)
      );

      // Save encrypted message
      const { error } = await supabase
        .from('secure_messages')
        .insert({
          sender_id: user.id,
          recipient_id: recipientId,
          encrypted_content: encryptedContent
        });

      if (error) throw error;

      // Log PHI access
      await logPHIAccess(
        user.id,
        'modify',
        'messages',
        'Sent encrypted message'
      );

      addNotification({
        type: 'success',
        title: 'Message sent',
        message: 'Your message has been encrypted and sent'
      });
    } catch (error) {
      addNotification({
        type: 'error',
        title: 'Error',
        message: error instanceof Error ? error.message : 'Failed to send message'
      });
      throw error;
    }
  };

  return {
    messages,
    isLoading,
    sendMessage
  };
}
```