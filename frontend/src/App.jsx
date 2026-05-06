import React, { useState, useContext, useEffect } from "react";
import "./App.css";
import MessageList from "./Components/MessageList";
import MessageForm from "./Components/MessageForm";
import { ThemeProvider, ThemeContext } from "./Context/ThemeContext";
import { Toaster } from "react-hot-toast";
import axios from 'axios';
import { Sun, Moon } from "lucide-react";

function AppContent() {
  //consume context
  const { theme, toggle } = useContext(ThemeContext);

  // Lifted messages state
  const [messages, setMessages] = useState([]);

  // Fetch messages on mount
  useEffect(() => {
    const fetchMessages = async () => {
      try {
        const res = await axios.get("http://localhost:5000/api/messages");
        setMessages(res.data);
      } catch (err) {
        console.error(err);
      }
    };
    fetchMessages();
  }, []);

  // Add new message
  const handleNewMessage = (msg) => {
    setMessages((prev) => [msg, ...prev]);
  };

  // Update message
  const handleUpdateMessage = (updatedMsg) => {
    setMessages((prev) =>
      prev.map((msg) => (msg.id === updatedMsg.id ? updatedMsg : msg))
    );
  };

  // Delete message
  const handleDeleteMessage = (id) => {
    setMessages((prev) => prev.filter((msg) => msg.id !== id));
  };

  return (
    <div
      className={`min-h-screen ${theme === "dark" ? "bg-gray-900 text-white" : "bg-gray-100 text-black"
        }`}>
      <Toaster position="top-right" />

      {/* Header */}
      <div
        className={`p-6 flex justify-between items-center mb-4 rounded-lg shadow ${theme === "dark" ? "bg-gray-800 text-white" : "bg-white text-black"
          }`}>
        <h1 className="text-xl font-bold">Guestbook</h1>
        <button
          onClick={toggle}
          className="cursor-pointer flex items-center px-3 py-1 rounded font-bold text-black dark:text-white space-x-2" >
          {theme === "dark" ? <Sun size={32} /> : <Moon size={32} />}
        </button>
      </div>

      {/* Main content wrapper */}
      <div className="w-full mx-auto px-4">
        {/* Add Message Form */}
        <MessageForm onNewMessage={handleNewMessage} />

        {/* Message List */}
        <MessageList
          messages={messages}
          setMessages={setMessages}
          onUpdateMessage={handleUpdateMessage}
          onDeleteMessage={handleDeleteMessage}
        />
      </div>
    </div>

  );
}

function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

export default App;

