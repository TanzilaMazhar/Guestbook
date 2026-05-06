import { useState, useRef, useContext ,useEffect} from "react";
import { Edit2, Trash2 } from "lucide-react";
import toast from 'react-hot-toast';
import axios from "axios";
import { ThemeContext } from "../Context/ThemeContext";

export default function MessageItem({ message, onUpdateMessage, onDeleteMessage }) {
    const [isEditing, setIsEditing] = useState(false);
    const [editText, setEditText] = useState(message.text);

    const inputRef = useRef(null);
    const { theme: currentTheme } = useContext(ThemeContext);

    //ref on input when edited
    useEffect(() => {
        if (isEditing) {
            inputRef.current?.focus();
        }
    }, [isEditing]);

    // Save edited message
    const handleEditSave = async () => {
        if (!editText.trim()) {
            toast.error("Message cannot be empty");
            return;
        }
        try {
            const res = await axios.put(`http://localhost:5000/api/messages/${message.id}`, { text: editText.trim() });
            onUpdateMessage(res.data); // Update parent state
            setIsEditing(false);
            toast.success("Message updated!");
        } catch (err) {
            console.error(err);
            toast.error("Error updating message");
        }
    };

    // Delete message
    const handleDelete = async () => {
        try {
            await axios.delete(`http://localhost:5000/api/messages/${message.id}`);
            onDeleteMessage(message.id); // Remove from parent state
            toast.success("Message deleted!");
        } catch (err) {
            console.error(err);
            toast.error("Error deleting message");
        }
    };

    return (
        <div className={`p-6 border-none rounded mb-3 ${currentTheme === "dark" ? "bg-gray-800 text-white" : "bg-white"}`}>
            <strong>{message.name}</strong>
            <p>
                {isEditing ? (
                    <input
                        ref={inputRef}
                        value={editText}
                        onChange={(e) => setEditText(e.target.value)}
                        className="border p-1 rounded w-full"
                    />
                ) : (
                    message.text
                )}
            </p>

            <div className="flex space-x-4 mt-2">
                {isEditing ? (
                    <button
                        onClick={handleEditSave}
                        className="text-green-500 text-xl flex items-center cursor-pointer">
                        Save <Edit2 className="ml-1 " />
                    </button>
                ) : (
                    <button
                        onClick={() => {
                            setIsEditing(true);
                        }}
                        className="text-yellow-500 text-xl flex items-center cursor-pointer">
                        Edit <Edit2 className="ml-1 size={16}" />
                    </button>
                )}

                <button
                    onClick={handleDelete}
                    className="text-red-500 text-xl flex items-center cursor-pointer">
                    Delete <Trash2 className="ml-1" />
                </button>
            </div>
        </div>
    );
}
