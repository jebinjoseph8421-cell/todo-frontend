import { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

const API_URL = "https://todo-backend-bvux.onrender.com/api/todos";

function App() {
  const [task, setTask] = useState("");
  const [todos, setTodos] = useState([]);

  // Get todos from Spring Boot
  const getTodos = async () => {
    try {
      const response = await axios.get(API_URL);
      setTodos(response.data);
    } catch (error) {
      console.error("Error getting todos:", error);
    }
  };

  // Load todos when page opens
  useEffect(() => {
    getTodos();
  }, []);

  // Add todo
  const addTodo = async () => {
    if (task.trim() === "") {
      return;
    }

    try {
      const response = await axios.post(API_URL, {
        title: task,
        completed: false,
      });

      setTodos([...todos, response.data]);
      setTask("");
    } catch (error) {
      console.error("Error adding todo:", error);
    }
  };

  // Complete / uncomplete todo
  const toggleTodo = async (todo) => {
    try {
      const response = await axios.put(`${API_URL}/${todo.id}`, {
        title: todo.title,
        completed: !todo.completed,
      });

      setTodos(
        todos.map((item) => (item.id === todo.id ? response.data : item)),
      );
    } catch (error) {
      console.error("Error updating todo:", error);
    }
  };

  // Delete todo
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`);

      setTodos(todos.filter((todo) => todo.id !== id));
    } catch (error) {
      console.error("Error deleting todo:", error);
    }
  };

  return (
    <div className="app">
      <div className="todo-container">
        <h1>Todo List</h1>

        <p className="subtitle">Manage your daily tasks</p>

        <div className="input-section">
          <input
            type="text"
            placeholder="Enter a task..."
            value={task}
            onChange={(e) => setTask(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                addTodo();
              }
            }}
          />

          <button onClick={addTodo}>Add</button>
        </div>

        <div className="todo-list">
          {todos.length === 0 ? (
            <p className="empty">No tasks yet.</p>
          ) : (
            todos.map((todo) => (
              <div className="todo-item" key={todo.id}>
                <div
                  className={`todo-title ${todo.completed ? "completed" : ""}`}
                  onClick={() => toggleTodo(todo)}
                >
                  <input
                    type="checkbox"
                    checked={todo.completed}
                    onChange={() => toggleTodo(todo)}
                  />

                  <span>{todo.title}</span>
                </div>

                <button
                  className="delete-btn"
                  onClick={() => deleteTodo(todo.id)}
                >
                  Delete
                </button>
              </div>
            ))
          )}
        </div>

        <div className="todo-count">Total tasks: {todos.length}</div>
      </div>
    </div>
  );
}

export default App;
