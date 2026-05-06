import React, { useEffect, useState, useContext } from 'react'
import MessageItem from './MessageItem';
import { Loader } from 'lucide-react';
import axios from 'axios';

function MessageList({ messages,setMessages, onUpdateMessage, onDeleteMessage }) {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchMessages() {
            try {
                const res = await axios.get("http://localhost:5000/api/messages");
                if (messages.length === 0) {
                    setMessages(res.data);
                }
            } catch (err) {
                console.error(err)
            } finally {
                setLoading(false);
            }
        }
        fetchMessages();
    }, []);

    if (loading)
        return <Loader className="animate-spin text-blue-500" />

    return (
        <div className='w-full flex flex-wrap gap-6'>
            {messages.map(msg => (
                <MessageItem
                    key={msg.id}
                    message={msg}
                    onUpdateMessage={onUpdateMessage}
                    onDeleteMessage={onDeleteMessage}
                />
            ))}
        </div>
    );
}

export default MessageList