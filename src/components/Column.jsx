import { useDroppable } from "@dnd-kit/core";

export default function Column({id, title,count, children}) {
    const { setNodeRef } = useDroppable({
        id : id
    });

    return (
        <div
            ref={setNodeRef}
            className="bg-white p-4 rounded-lg shadow min-h-[200px]"
        >
            <h2 className="font-semibold mb-4">
                {title} ({count})
            </h2>
            {children}
        </div>
    );
}