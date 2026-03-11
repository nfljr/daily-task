import { FaTrash } from "react-icons/fa"
import { useDraggable } from "@dnd-kit/core";
import { CSS } from "@dnd-kit/utilities";
import { useState } from "react";

export default function TaskCard({task, onDelete, onMove, onEdit}) {
    const {attributes, listeners, setNodeRef, transform} = useDraggable({
        id: task.id
    });

    const style = {
        transform: CSS.Translate.toString(transform),
    };

    const [isEditing, setIsEditing] = useState(false);
    const [editTitle, setEditTitle] = useState(task.title);
    const [editDeadline, setEditDeadline] = useState(task.deadline);
    const [editPriority, setEditPriority] = useState(task.priority);

    function handleSave(){
        onEdit(task.id, {
            title : editTitle,
            deadline : editDeadline,
            priority : editPriority
        });

        setIsEditing(false);
    }

    function getPriorityColor(priority){
        if (priority === "High"){
            return "bg-red-100 text-red-700"
        }

        if (priority === "Medium") {
            return "bg-yellow-100 text-yellow-700"
        }

        if (priority === "Low") {
            return "bg-green-100 text-green-700";
        }

        return "bg-gray-100 text-gray-700";
    }

    return (
        <div 
            ref={setNodeRef}
            style={style}
            className="bg-white p-4 rounded-lg shadow mb-3 hover:shadow-md transition"
        >
            {/* Drag Handle */}
            <div 
                {...listeners}
                {...attributes}
                className="cursor-grab text-gray-400 mb-2"
            > 
               ☰ 
            </div>
            
        {isEditing ? (
            <div className="flex flex-col gap-2">
                <input 
                    className="border p-1 rounded"
                    value={editTitle}
                    onChange={(e) => setEditTitle(e.target.value)}
                />
                <input
                    type="date"
                    className="border p-1 rounded"
                    value={editDeadline}
                    onChange={(e)=> setEditDeadline(e.target.value)}
                />
                <select 
                    className="border p-1 rounded"
                    value={editPriority}
                    onChange={(e)=> setEditPriority(e.target.value)}
                >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                </select>

                <button 
                    onClick={handleSave}
                    className="bg-green-500 text-white px-2 py-1 rounded"
                >
                    Save
                </button>
            </div>
        ) : (
            <>
            {/* Title */}
            <h3 className="font-semibold text-gray-800">
                {task.title}
            </h3>

            {/* Deadline */}
            <p className="text-sm text-gray-500 mt-1">
                Deadline : {task.deadline}
            </p>

            {/* Priority */}
            <span className={`inline-block mt-2 px-2 py-1 text-xs rounded ${getPriorityColor(task.priority)}`}>
                {task.priority}
            </span>

            {/* Delete Button */}
            <button 
                className="mt-3 text-red-500 hover:text-red-700 flex items-center gap-1" 
                onClick={()=> onDelete(task.id)}
            >
                <FaTrash/>
                Delete
            </button>

            <button 
                onClick={()=> setIsEditing(true)}
                className="text-blue-500 text-sm mt-2"
            >
                Edit
            </button>

            <div className="flex gap-2 mt-3">
                {task.status === "todo" && (
                    <button onClick={()=> onMove(task.id, "inprogress")}
                        className="text-xs bg-yellow-400 px-2 py-1 rounded"
                    >
                        Start
                    </button>
                )}

                {task.status === "inprogress" && (
                    <button
                        onClick={()=> onMove(task.id, "done")}
                        className="text-xs bg-green-500 text-white px-2 py-1 rounded"
                    >
                        Complete
                    </button>
                )}

                {task.status === "done" && (
                    <button
                        onClick={()=> onMove(task.id, "todo")}
                        className="text-xs bg-gray-400 text-white px-2 py-1 rounded"
                    >Back</button>
                )}
            </div>
            </>
        )}
        </div>
    );
}