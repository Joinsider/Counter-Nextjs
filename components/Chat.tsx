'use client';

import React, { useEffect, useState, useRef } from 'react';
import { pb } from '@/lib/pocketbase';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { ScrollArea } from './ui/scroll-area';
import { Expand } from 'lucide-react';

interface Message {
  id: string;
  message: string;
  typeId: string;
  userId: string;
  created: string;
  expand?: {
    user: {
      username: string;
    }
  }
}

interface ChatProps {
  typeId: string;
}

export function Chat({ typeId }: ChatProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [newMessage, setNewMessage] = useState('');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const [formData, setFormData] = useState({
    message: ''
  })

  useEffect(() => {
    const checkAuth = async () => {
      const isValid = pb.authStore.isValid;
      const isVerified = pb.authStore.model?.verified;
      setIsLoggedIn(isValid && isVerified);
    };

    checkAuth();
  }, []);

  useEffect(() => {
    if (!isLoggedIn) return;

    const fetchMessages = async () => {
      try {
        const records = await pb.collection('messages').getFullList<Message>({
          filter: `typeId = "${typeId}"`,
          sort: 'created',
          expand: 'userId',
          fields: 'id,message,typeId,userId,expand.userId.username,created',
        });
        setMessages(records);
        setIsLoading(false);
        scrollToBottom();
      } catch (err) {
        setError('Failed to load messages');
        setIsLoading(false);
      }
    };

    fetchMessages();

    // Subscribe to realtime updates
    const unsubscribePromise = pb.collection('messages').subscribe<Message>('*', async ({ action, record }) => {
      if (record.typeId === typeId) {
        if (action === 'create') {
          const user = await pb.collection('users').getOne(record.userId);
          setMessages(prev => [...prev, { ...record, expand: { user: { username: user.username } } }]);
          scrollToBottom();
        }
      }
    });

    return () => {
      unsubscribePromise.then(unsubscribe => unsubscribe());
    };
  }, [typeId, isLoggedIn]);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    


    try {
      const uid = await pb.authStore.model?.id;
      await pb.collection('messages').create({
        text: formData.message,
        userId: uid,
        typeId: typeId,
        user: pb.authStore.model?.id,
      });
      setNewMessage('');
    } catch (err) {
      setError('Failed to send message');
    }
  };

  if (!isLoggedIn) {
    return null;
  }

  if (isLoading) {
    return <div className="text-center p-4">Loading chat...</div>;
  }

  if (error) {
    return <div className="text-red-500 p-4">{error}</div>;
  }

  return (
    <div className="flex flex-col h-[400px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="p-4 border-b dark:border-gray-700">
        <h2 className="text-lg font-semibold">Chat</h2>
      </div>

      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`flex flex-col ${message.userId === pb.authStore.model?.id
                  ? 'items-end'
                  : 'items-start'
                }`}
            >
              <div
                className={`max-w-[80%] rounded-lg p-3 ${message.userId === pb.authStore.model?.id
                    ? 'bg-blue-500 text-white'
                    : 'bg-gray-100 dark:bg-gray-700'
                  }`}
              >
                <div className="font-semibold text-sm mb-1">
                  {message.expand?.user?.username || 'Unknown User'}
                </div>
                <div className="break-words">{message.message}</div>
                <div className="text-xs mt-1 opacity-70">
                  {new Date(message.created).toLocaleTimeString()}
                </div>
              </div>
            </div>
          ))}
          <div ref={scrollRef} />
        </div>
      </ScrollArea>

      <form onSubmit={handleSendMessage} className="p-4 border-t dark:border-gray-700">
        <div className="flex gap-2">
          <Input
            type="text"
            name="message"
            value={formData.message}
            placeholder="Type your message..."
            className="flex-1"
            onChange={(e) => setFormData({ ...formData, message: e.target.value })}
          />
        </div>
        <Button type="submit" className="mt-2">Send Message</Button>
      </form>
    </div>
  );
}