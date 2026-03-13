import { useDroppable } from "@dnd-kit/core";

export default function Column({id, title,count, children, darkMode}) {
    const { setNodeRef } = useDroppable({
        id : id
    });

    return (
        <div
            ref={setNodeRef}
            className={`p-4 rounded-lg shadow min-h-[200px] ${darkMode ?
                "bg-gray-700 text-white" : "bg-white"
            }`}
        >
            <h2 className="font-semibold mb-4">
                {title} ({count})
            </h2>
            {children}
        </div>
    );
}