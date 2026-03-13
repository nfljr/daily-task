import TaskCard from "../components/TaskCard";
import { useState, useEffect } from "react";
import { DndContext } from "@dnd-kit/core";
import Column from "../components/Column";

export default function Dashboard(){
    const [darkMode, SetDarkMode] = useState(false);

    const [tasks, setTasks] = useState(()=> {
        const saved = localStorage.getItem("tasks");

        if (saved) {
            return JSON.parse(saved)
        }

        return [
        {
            id:1,
            title: "Build login page",
            deadline: "20 maret 2026",
            priority: "High",
            status: "todo"
        },
        {
            id:2,
            title: "Fix Navbar bug",
            deadline: "18 maret 2026",
            priority: "Medium",
            status: "inprogress"
        }
        ];
    });

    const [title, setTitle] = useState ("");
    const [deadline, SetDeadline] = useState("");
    const [priority, setPriority] = useState("Medium");
    const [search, setSearch] = useState("")
    const [filterPriority, setFilterPriority] = useState("All");

    useEffect(()=> {
        const savedTheme = localStorage.getItem("theme");
        if(savedTheme){
            SetDarkMode(savedTheme === "dark")
        }
    },[]);

    useEffect(()=> {
        localStorage.setItem("tasks", JSON.stringify(tasks));
    },[tasks]);

    useEffect(()=> {
        localStorage.setItem("theme", darkMode ? "dark" : "light");
    }, [darkMode]);

    const filteredTasks = tasks.filter((task) => {
        const macthSearch = task.title
            .toLowerCase()
            .includes(search.toLowerCase());

        const matchPriority = 
            filterPriority === "All" || task.priority === filterPriority;

        return macthSearch && matchPriority;
    });

    const totalTasks = tasks.length;
    const doneCount = tasks.filter((task) => task.status === "done").length;
    const progressCount = tasks.filter((task) => task.status === "inprogress").length;
    const todoCount = tasks.filter((task) => task.status === "todo").length;

    const progressPercent = 
        totalTasks === 0 ? 0 : Math.round((doneCount/ totalTasks) * 100);

    const todoTasks = filteredTasks.filter((task) => task.status === "todo");
    const progressTasks = filteredTasks.filter((task) => task.status === "inprogress");
    const doneTasks = filteredTasks.filter((task) => task.status === "done");

    function addTask(){
        if(!title.trim()) return;
        
        const newTask = {
            id: Date.now(),
            title,
            deadline,
            priority,
            status: "todo"
        };

        setTasks([...tasks, newTask]);

        setTitle("");
        SetDeadline("");
        setPriority("Medium");
    }

    function deleteTask(id){
        setTasks(tasks.filter((task) => task.id !== id));
    }

    function moveTask(id, newStatus) {
        setTasks(
            tasks.map((task) => 
            task.id === id
            ? {...task, status:newStatus}
            : task
            )
        );
    }

    function handleDragEnd(event) {
        const {active, over} = event;

        if (!over) return;

        const taskId = active.id;
        const newStatus = over.id;

        moveTask (taskId, newStatus)
    }

    function editTask(id, updateData){
        setTasks(
            tasks.map((task) => task.id === id
                ? {...task, ...updateData}
                : task
            )
        );
    }

    return (
        <div className={`min-h-screen p-10 ${darkMode ? "bg-gray-900 text-white" : "bg-gray-100 text-gray-900"}`}>
            <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold mb-6">
                Task Manager Dashboard
            </h1>

            <button
                onClick={() => SetDarkMode(!darkMode)}
                className="px-3 py-1 rounded bg-gray-200"
            >
                {darkMode ? "☀️Light" : "🌑Dark"}
            </button>
            </div>

            <div className="grid grid-cols-4 gap-4 mb-6">
                <div className={`bg-white p-4 rounded shadow ${
                            darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white"
                        }`}>
                    <p className="text-gray-500 text-sm">Total Task</p>
                    <p className="text-xl font-bold">{totalTasks}</p>
                </div>

                <div className={`bg-white p-4 rounded shadow ${
                            darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white"
                        }`}>
                    <p className="text-gray-500 text-sm">Todo</p>
                    <p className="text-xl font-bold">{todoCount}</p>
                </div>

                <div className={`bg-white p-4 rounded shadow ${
                            darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white"
                        }`}>
                    <p className="text-gray-500 text-sm">In Progress</p>
                    <p className="text-xl font-bold">{progressCount}</p>
                </div>

                <div className={`bg-white p-4 rounded shadow ${
                            darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white"
                        }`}>
                    <p className="text-gray-500 text-sm">Completed</p>
                    <p className="text-xl font-bold">{doneCount}</p>
                </div>
            </div>

            <div className="bg-white p-4 rounded shadow mb-6">
                <p className="text-sm text-gray-200 mb-2">
                    Progress: {progressPercent}%
                </p>

                <div className="w-full bg-gray-200 h-3 rounded">
                    <div
                        className="bg-green-500 h-3 rounded"
                        style={{width: `${progressPercent}%`}}
                    ></div>
                </div>
            </div>
            <input 
                className="border p-2 rounded w-full mb-4" 
                placeholder="search task. . ."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
            />

            {filteredTasks.length === 0 && (
                <div className="text-center text-gray-400 mb-6">
                    No Tasks Found
                </div>
            )}

            <select className={`border p-2 rounded mb-4 ${
                            darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white"
                        }`}
                value={filterPriority}
                onChange={(e) => setFilterPriority(e.target.value)}
            >
                <option>All</option>
                <option>High</option>
                <option>Medium</option>
                <option>Low</option>
            </select>

            <div className="bg-white p-4 rounded-lg shadow mb-6">
                    <input 
                        className={`border p-2 rounded w-full mb-2 ${
                            darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white"
                        }`}
                        placeholder="Task Title"
                        value={title}
                        onChange={(e) => setTitle(e.target.value)}
                    />

                    <input
                        type="date"
                        className={`border p-2 rounded w-full mb-2 ${
                            darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white"
                        }`}
                        value={deadline}
                        onChange={(e) => SetDeadline(e.target.value)}                    
                    />

                    <select 
                        className={`border p-2 rounded w-full mb-2 ${
                            darkMode ? "bg-gray-700 text-white border-gray-600" : "bg-white"
                        }`}
                        value={priority}
                        onChange={(e) => setPriority(e.target.value)}
                    >
                        <option>Low</option>
                        <option >Medium</option>
                        <option >High</option>
                    </select>

                    <button 
                        onClick={addTask}
                        className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                    >
                        AddTask
                    </button>
                </div>

        <DndContext onDragEnd={handleDragEnd}>
            <div className="grid grid-cols-3 gap-6">
                {/* Todo */}
                    <Column id="todo" title="Todo" count={todoTasks.length}>
                    {todoTasks.length === 0 ?(
                        <p className="text-gray-400 text-sm text-center">
                            No Tasks
                        </p>
                    ) : (
                        todoTasks.map((task) => (
                        <TaskCard
                            key={task.id} 
                            task={task} 
                            onDelete={deleteTask}  
                            onMove={moveTask}  
                            onEdit={editTask}
                        />
                        ))
                    )}
                    </Column>
                
                {/* Inprogress */}
                    <Column id="inprogress" title="In Progress" count={progressTasks.length}>
                    {progressTasks.length === 0 ? (
                        <p className="text-gray-400 text-sm text-center">
                            No Tasks
                        </p>
                    ):(
                        progressTasks.map((task) => (
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={deleteTask}
                            onMove={moveTask}
                            onEdit={editTask}
                        />
                        ))
                    )}
                    </Column>

                {/* Done */}
                    <Column id="done" title="Done" count={doneTasks.length}>
                    {doneTasks.length === 0 ?(
                        <p className="text-gray-400 text-sm text-center">
                            No Tasks
                        </p>
                    ):(
                        doneTasks.map((task)=>(
                        <TaskCard
                            key={task.id}
                            task={task}
                            onDelete={deleteTask}
                            onMove={moveTask}
                            onEdit={editTask}
                        />
                    ))
                    )}
                    </Column>
            </div>
        </DndContext>
        </div>
    );
}