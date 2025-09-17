import React, { useState, useEffect } from "react";

const username = "natisen";
const baseURL = `https://playground.4geeks.com/todo/users/${username}`;
const tasksURL = `https://playground.4geeks.com/todo/todos/${username}`;

const defaultTasks = [
  { label: "Read 10 pages of a book", is_done: false },
  { label: "Go for a walk", is_done: false },
  { label: "Finish React project", is_done: false },
];

const TodoList = () => {
  const [tasks, setTasks] = useState([]);
  const [inputValue, setInputValue] = useState("");
  const [hoveredIndex, setHoveredIndex] = useState(null);

  const loadTasks = () => {
    fetch("https://playground.4geeks.com/todo/users/natisen")
      .then((resp) => resp.json())
      .then((data) => {
        if (Array.isArray(data.todos)) {
          setTasks(data.todos);
        } else if (Array.isArray(data)) {
          setTasks(data);
        } else {
          setTasks([]);
        }
      })
      .catch((error) => {
        console.error("Fetch error:", error);
        setTasks([]);
      });
  };

  const createDefaultTasksIfEmpty = () => {
    if (tasks.length === 0) {
      defaultTasks.forEach((task) => {
        fetch("https://playground.4geeks.com/todo/todos/natisen", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(task),
        })
          .then((res) => res.json())
          .then(() => loadTasks())
          .catch((err) => console.error("OH NO! Error adding default task:", err));
      });
    }
  };

  useEffect(() => {
    fetch("https://playground.4geeks.com/todo/todos/natisen", { method: "GET" })
      .then((resp) => {
        if (!resp.ok) {
          return fetch(baseURL, { method: "POST" });
        }
        return resp;
      })
      .then(() => {
        loadTasks();
        setTimeout(() => createDefaultTasksIfEmpty(), 500); 
      })
      .catch((error) => {
        console.error("User creation or loading tasks error:", error);
      });
  }, []);

  const addTask = () => {
    if (!inputValue.trim()) return;

    const newTask = {
      label: inputValue.trim(),
      is_done: false,
    };

    fetch("https://playground.4geeks.com/todo/todos/natisen", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(newTask),
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error adding task, status " + response.status);
        }
        return response.json();
      })
      .then(() => {
        setInputValue("");
        loadTasks();
      })
      .catch((error) => console.error("Add error:", error));
  };

  const updateTask = (taskId, newLabel, newStatus) => {
    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        label: newLabel,
        is_done: newStatus
      })
    })
      .then((resp) => {
        console.log("PUT response status:", resp.status);
        if (!resp.ok) {
          throw new Error("Update failed: " + resp.status);
        }
        return resp.json();
      })
      .then((updatedTask) => {
        console.log("Updated task from backend:", updatedTask);

        setTasks((prevTasks) =>
          prevTasks.map((task) =>
            task.id === updatedTask.id ? updatedTask : task
          )
        );
      })
      .catch((err) => {
        console.error("Update error:", err);
        alert("Update failed. See console for details.");
      });
  };


  const removeTask = (taskId) => {
    console.log("Deleting task with ID:", taskId);

    fetch(`https://playground.4geeks.com/todo/todos/${taskId}`, {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error(`Failed to delete task ${taskId}, status ${response.status}`);
        }

        setTasks((prevTasks) => prevTasks.filter((task) => task.id !== taskId));
      })
      .catch((error) => {
        console.error("Remove error:", error);
        alert("Could not delete task. See console for details.");
      });
  };


  const clearAllTasks = () => {
    fetch("https://playground.4geeks.com/todo/todos/natisen", {
      method: "DELETE",
    })
      .then((response) => {
        if (!response.ok) {
          throw new Error("Error clearing all tasks, status " + response.status);
        }
        setTasks([]);
      })
      .catch((error) => console.error("Clear error:", error));
  };

  const getRotationStyle = (index) => ({
    transform: `rotate(${index % 2 === 0 ? -1 : 1}deg) translateY(${index * -2}px)`,
    zIndex: hoveredIndex === index ? 10 : index,
  });

  return (
    <>
      <input
        type="text"
        placeholder="Add new task..."
        value={inputValue}
        onChange={(e) => setInputValue(e.target.value)}
        onKeyDown={(e) => e.key === "Enter" && addTask()}
        className="todo-input"
      />
      <button onClick={addTask} className="add-task-button">
        Add
      </button>

      <button onClick={clearAllTasks} className="clear-btn">
        Clear All Tasks
      </button>



      <ul className="task-list">
        {tasks.length === 0 ? (
          <p>No tasks added</p>
        ) : (
          tasks.map((task, i) => (
            <li
              key={task.id}
              className={`task-item task-color-${(i % 3) + 1} ${hoveredIndex === i ? "task-item-hover" : ""
                }`}
              style={getRotationStyle(i)}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
            >
              <input
                type="checkbox"
                checked={task.is_done}
                onChange={() =>
                  updateTask(task.id, task.label, !task.is_done)
                }
              />

              <span>{task.label}</span>
              <button className="remove-btn" onClick={() => removeTask(task.id)}>
                ×
              </button>
            </li>
          ))
        )}
      </ul>
    </>
  );
};

export default TodoList;
