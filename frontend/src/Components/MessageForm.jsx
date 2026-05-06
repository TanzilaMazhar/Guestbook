import React, { useContext, useRef, useState, useEffect } from 'react'
import { ThemeContext } from '../Context/ThemeContext';
import axios from 'axios';
import toast from 'react-hot-toast';

export default function MessageForm({ onNewMessage }) {
    const [formData, setFormData] = useState({
        name: "",
        text: ""
    })

    const inputRef = useRef(null);
    const { theme } = useContext(ThemeContext)

    useEffect(() => {
        if (inputRef.current) {
            inputRef.current.focus();
        }
    }, [theme]);

    // const handleChange = (e) => {
    //     const { name, value } = e.target;
    //     setFormData(prev => ({
    //         ...prev,
    //         [name]: value
    //     }))
    // };

    const handleChange = (e) =>
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });


    const nameRegex = /^[A-Za-z\s]+$/;

    const handleSubmit = async (e) => {
        e.preventDefault();

        const { name, text } = formData;

        if (!name.trim() || !text.trim()) {
            toast.error("Name and Message cant be empty");
            return;
        }
        if (!nameRegex.test(name.trim())) {
            toast.error("Name must contain only letters");
            return;
        }

        //add new message
        try {
            const res = await axios.post("https://guestbook-eviu.onrender.com/api/messages", {
                name: name.trim(),
                text: text.trim()
            });
            onNewMessage(res.data);

            setFormData({
                name: "",
                text: ""
            })
            inputRef.current.focus();

            toast.success("Message added successfully!")
        } catch (error) {
            toast.error("Error adding message");
        }
    }

    return (
        <form
            onSubmit={handleSubmit}
            className={`mt-10 w-full max-w-md mx-auto mb-10 p-8 rounded-lg shadow ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-gray-900"
                }`}>
            <h2 className="text-lg font-semibold mb-4 text-center">Leave a Message</h2>

            <input
                type="text"
                ref={inputRef}
                name="name"
                placeholder="Your name"
                value={formData.name}
                onChange={handleChange}
                className={`w-full mb-3 p-2 rounded border outline-none 
                ${theme === "dark"
                        ? "bg-gray-800 text-white placeholder-gray-400"
                        : "bg-white text-black placeholder-gray-500"}`} />
            <textarea
                placeholder="Write your message..."
                name="text"
                value={formData.text}
                onChange={handleChange}
                className={`w-full mb-3 p-2 rounded border outline-none 
                ${theme === "dark"
                        ? "bg-gray-800 text-white placeholder-gray-400"
                        : "bg-white text-black placeholder-gray-500"}`} />

            <button
                type="submit"
                className="w-full bg-blue-500 text-white py-2 rounded font-medium cursor-pointer">
                Add Message
            </button>
        </form>
    );
}
