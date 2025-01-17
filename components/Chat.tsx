'use client';

import React, {useEffect, useRef, useState} from 'react';
import {pb} from '@/lib/pocketbase';
import {Button} from './ui/button';
import {Input} from './ui/input';
import {ScrollArea} from './ui/scroll-area';
import useContextMenu from "@/hooks/useContextMenu";
import ContextMenu from "@/components/ContextMenu";

interface Message {
    id: string;
    message: string;
    typeId: string;
    userId: string;
    created: string;
    expand?: {
        userId: {
            username: string;
        }
    }
}

interface Usernames {
    id: string;
    userId: string;
    username: string;
    created: string;
    updated: string;
}

interface ChatProps {
    typeId: string;
}


export function Chat({typeId}: ChatProps) {
    const [messages, setMessages] = useState<Message[]>([]);
    const [usernames, setUsernames] = useState<Record<string, string>>({});
    const [failedUserFetches, setFailedUserFetches] = useState<Record<string, number>>({});
    const [isLoading, setIsLoading] = useState(true);
    const [isError, setIsError] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const scrollAreaRef = useRef<HTMLDivElement>(null);

    const [formData, setFormData] = useState({
        message: ''
    })

    const { menuVisible, menuPosition, showMenu, hideMenu } = useContextMenu();

    const handleContextMenu = (e: React.MouseEvent) => {
        e.preventDefault();
        showMenu(e.pageX, e.pageY);
    };

    const menuItems = [
        {
            label: 'Edit message',
            action: () => console.log('Option 1 clicked')
        },
        {
            label: 'Delete message',
            action: () => console.log('Option 2 clicked')
        }
    ];

    const fetchUsername = async (userId: string) => {
        // Skip if we've already failed twice for this user
        if (failedUserFetches[userId] >= 2) return null;

        try {
            const userInfo = await pb.collection('user_info').getFirstListItem<Usernames>(`userId="${userId}"`);
            setUsernames(prev => ({...prev, [userId]: userInfo.username}));
            return userInfo.username;
        } catch (err) {
            setFailedUserFetches(prev => ({
                ...prev,
                [userId]: (prev[userId] || 0) + 1
            }));
            return null;
        }
    };


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
                // Fetch all messages
                const records = await pb.collection('messages').getFullList<Message>({
                    filter: `typeId = "${typeId}"`,
                    sort: 'created'
                });

                // Fetch all usernames
                const usernameRecords = await pb.collection('user_info').getFullList<Usernames>();

                // Create username mapping
                const usernameMap = usernameRecords.reduce((acc, user) => ({
                    ...acc,
                    [user.userId]: user.username
                }), {});

                setUsernames(usernameMap);
                setMessages(records);
                setIsLoading(false);
            } catch (err) {
                setError('Failed to load messages');
                setIsLoading(false);
            } finally {
                scrollToBottom();
            }
        };

        fetchMessages();

        // Subscribe to realtime updates
        const unsubscribePromise = pb.collection('messages').subscribe<Message>('*', async ({action, record}) => {
            if (record.typeId === typeId) {
                if (action === 'create') {
                    if (!usernames[record.userId]) {
                        await fetchUsername(record.userId);
                    }
                    setMessages(prev => [...prev, record]);
                    scrollToBottom();
                }
            }
        });

        return () => {
            unsubscribePromise.then(unsubscribe => unsubscribe());
        };
    }, [typeId, isLoggedIn]);

    const scrollToBottom = () => {
        if (scrollAreaRef.current) {
            const scrollContainer = scrollAreaRef.current.querySelector('[data-radix-scroll-area-viewport]');
            if (scrollContainer) {
                scrollContainer.scrollTop = scrollContainer.scrollHeight;
            }
        }
    };

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        try {
            const uid = await pb.authStore.model?.id;
            if (formData.message.length === 0) {
                setIsError(true);
                setError("Message must contain at least one non-whitespace character");
                return;
            } else {
                setIsError(false);
                await pb.collection('messages').create({
                    message: formData.message,
                    userId: uid,
                    typeId: typeId
                }).then(() => {
                    setTimeout(scrollToBottom, 100);
                });
                formData.message = '';
            }

        } catch (err) {
            setError('Failed to send message');
        } finally {
            setFormData({message: ''});
            setTimeout(scrollToBottom, 100)
        }
    };

    if (!isLoggedIn) {
        return null;
    }

    if (isLoading) {
        return <div className="text-center p-4">Loading chat...</div>;
    }

    return (
        <div className="flex flex-col h-[800px] bg-white dark:bg-gray-800 rounded-lg shadow-lg">
            <div className="p-4 border-b dark:border-gray-700">
                <h2 className="text-lg font-semibold">Chat</h2>
            </div>

            <ScrollArea ref={scrollAreaRef} className="flex-1 p-4" onScroll={scrollToBottom}>
                {
                    messages.length === 0 && (
                        <div className="text-center text-gray-500 dark:text-gray-400">
                            No messages found
                        </div>
                    )
                }
                <div className="space-y-4">
                    {messages.map((message) => (
                        <div
                            key={message.id}
                            className={`flex flex-col ${message.userId === pb.authStore.model?.id
                                ? 'items-end'
                                : 'items-start'
                            }`}
                            onContextMenu={handleContextMenu}
                        >
                            <div
                                className={`max-w-[80%] rounded-lg p-3 ${message.userId === pb.authStore.model?.id
                                    ? 'bg-blue-500 text-white drop-shadow-xl'
                                    : 'bg-gray-100 drop-shadow-xl dark:bg-gray-700'
                                }`}
                            >
                                <div className="font-semibold text-sm mb-1">
                                    {usernames[message.userId] || 'Unknown User'}
                                </div>
                                <div className="break-words">{message.message}</div>
                                <div className="text-xs mt-1 opacity-70">
                                    {new Date(message.created).toLocaleString()}
                                </div>
                            </div>
                            {menuVisible && (
                                <ContextMenu
                                    position={menuPosition}
                                    items={menuItems}
                                />
                            )}
                        </div>
                    ))}
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
                        minLength={1}
                        required={true}
                        onChange={(e) => setFormData({...formData, message: e.target.value})}
                    />
                </div>
                <Button type="submit" className="mt-2">Send Message</Button>
                {isError && (
                    <div className="text-red-500 dark:text-red-400">
                        Error: {error}
                    </div>
                )}
            </form>
        </div>
    );
}