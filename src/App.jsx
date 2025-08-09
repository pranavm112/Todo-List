/* eslint-disable no-unused-vars */
import { useState, useEffect } from 'react'
import axios from 'axios'
import { TodoProvider } from './contexts'
import TodoForm from './components/TodoForm'
import TodoItem from './components/TodoItem'
import ThemeBtn from './components/ThemeBtn'
import { ThemeProvider } from './contexts/theme'

const BASE_URL = process.env.REACT_APP_API_URL;


function App() {

  const [todos, setTodos] = useState([])
  const [filter, setFilter] = useState('all')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  // Theme state and handlers
  const [themeMode, setThemeMode] = useState(() => {
    return localStorage.getItem('themeMode') || 'light';
  });

  const lightTheme = () => {setThemeMode("light")}

  const darkTheme = () => {setThemeMode("dark")}

  // Handlers for adding, updating, deleting, and toggling todos
  // id: Date.now(), todo, completed: false}, ...prev
 
  /*const addTodo = (todo) => {
    setTodos((prev) => [{id: Date.now(), ...todo}, ...prev])   
  }*/
  //From local Storage Add Todo is connected to backend
  /*const addTodo = async (todo) => {
    try {
      const res = await axios.post(`${BASE_URL}`, todo);
      setTodos(prev => [res.data, ...prev]);
    } catch (err) {
      console.log('Add todo erroes', err)
    }
  };*/

  const addTodo = async (todo) => {
  if (!todo.title.trim()) {
    setError("Todo cannot be empty");
    return;
  }
  try {
    //setError(null);
    const res = await axios.post(BASE_URL, todo);
    setTodos(prev => [res.data, ...prev]);
    setError(null); // Clear error on success
  } catch (err) {
    setError("Failed to add todo");
  }
};



  /*const updateTodo = (id, todo) => {
    setTodos((prev) => prev.map((prevTodo) => (prevTodo.id === id ? todo : prevTodo)))
  }*/
  
  // Update todo function
  const updateTodo = async (id, todo) => {
    if (!todo.title.trim()) {
      setError("Todo cannot be empty");
      return;
    }

    try {
      const res = await axios.put(`${BASE_URL}/${id}`, todo);
      setTodos(prev => prev.map(todo => todo._id === id ? res.data : todo))
    }
    catch (err) {
      setError('Failed to update todo')
    }
  }


  

  /*const deleteTodo = (id) => {
    setTodos((prev) => prev.filter((todo) => todo.id !== id))
  }*/
  
  const deleteTodo = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/${id}`);
      setTodos(prev => prev.filter(todo => todo._id !== id));
      setError(null);
  } catch (err) {
      setError('Delete Todo error');
    }
  };

  
/*
  const toggleComplete = (id) => {
    setTodos((prev) =>
      prev.map((prevTodo) =>
        prevTodo.id === id
          ? { ...prevTodo, completed: !prevTodo.completed } : prevTodo))
  }
*/
  // Toggle complete function
  const toggleComplete = async (id) => {
    try {
      const todoToToggle = todos.find(todo => todo._id === id)
      const res = await axios.put(`${BASE_URL}/${id}`, {
        ...todoToToggle,
        completed: !todoToToggle.completed,
      });
      setTodos(prev => prev.map(t => t._id === id ? res.data : t));
      setError(null);
    } catch (err) {
      setError('Toggle Complete error:');
    }
  }

  /*useEffect(() => {
    const todos = JSON.parse(localStorage.getItem('todos'))
    
    if (todos && todos.length > 0) {
      setTodos(todos)
    }
  }, [])*/

  // Persist todos in localStorage

  //Using localStorage to persist todos is commented out as the app is now connected to a backend API.
  /*
  useEffect(() => {
    const local = JSON.parse(localStorage.getItem('todos'));
    if (local && local.length > 0) setTodos(local);
  }, []);


  useEffect(() => {
    localStorage.setItem('todos', JSON.stringify(todos))
  }, [todos])*/

  // Filtering and searching todos
  const filteredTodos = todos.filter((todo) => {
    if (filter === "active") return !todo.completed
    if (filter === "completed") return todo.completed
    return true
  }).filter(todo => 
    todo.title.toLowerCase().includes(search.toLowerCase())  
  )
  

  // actual change in theme

  useEffect(() => {
    localStorage.setItem('themeMode', themeMode);
    document.querySelector('html').classList.remove("light", "dark")
    document.querySelector('html').classList.add(themeMode)
  }, [themeMode])


  // Axios setup for API requests
  useEffect(() => {
  setLoading(true);
  axios.get(BASE_URL)
    .then(res => setTodos(res.data))
    .catch(err => setError('Failed to fetch todos'))
    .finally(() => setLoading(false)); // Always stop loading
  }, []);

  
  /*
  useEffect(() => {

    //Fetch Todo
    axios.get(BASE_URL)
      .then(res => setTodos(res.data))
      .catch(err => console.log("Fetch Todo Error", err))
  }, []); */

  
  
  return (
  <ThemeProvider value={{ themeMode, darkTheme, lightTheme }}>
    <TodoProvider value={{ todos, addTodo, updateTodo, deleteTodo, toggleComplete }}>
      {/* Main background */}
      <div className={`min-h-screen flex items-center justify-center transition-colors duration-300
        ${themeMode === "dark" ? "bg-gray-900" : "bg-blue-100"}
      `}>
        {/* Todo Card */}
        <div className={`
          w-full max-w-2xl mx-auto shadow-lg rounded-2xl px-6 py-8 transition-colors duration-300
          ${themeMode === "dark"
            ? "bg-gray-800 text-gray-200"
            : "bg-white text-gray-800"}
        `}>
          <h1 className={`
            text-3xl font-bold text-center mb-8 mt-2 transition-colors duration-300
            ${themeMode === "dark" ? "text-teal-200" : "text-blue-800"}
          `}>Manage Your Todos</h1>
            
          {/* Error Display */}
          {error && <div className="bg-red-100 text-red-700 p-2 mb-4 rounded">{error}</div>}

          {/* Filter Buttons */}
          <div className="mb-2 flex gap-2 justify-center rounded px-1 py-1">
            <button className={`
              px-4 py-1 rounded-full font-medium hover:bg-blue-800 hover:text-white transition
              ${filter === 'all'
                ? (themeMode === "dark" ? "bg-teal-700 text-white" : "bg-blue-500 text-white")
                : (themeMode === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700")}
            `} onClick={() => setFilter('all')}>All</button>
            <button className={`
              px-4 py-1 rounded-full font-medium hover:bg-blue-800 hover:text-white transition
              ${filter === 'active'
                ? (themeMode === "dark" ? "bg-teal-700 text-white" : "bg-blue-500 text-white")
                : (themeMode === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700")}
            `} onClick={() => setFilter('active')}>Active</button>
            <button className={`
              px-4 py-1 rounded-full font-medium hover:bg-blue-800 hover:text-white transition
              ${filter === 'completed'
                ? (themeMode === "dark" ? "bg-teal-700 text-white" : "bg-blue-500 text-white")
                : (themeMode === "dark" ? "bg-gray-700 text-gray-200" : "bg-gray-200 text-gray-700")}
            `} onClick={() => setFilter('completed')}>Completed</button>
            <div className="ml-auto">
              <ThemeBtn />
            </div>
          </div>

          {/* Search */}
          <input
            className={`
              border px-3 py-2 rounded w-full mb-3 text-lg outline-none transition
              ${themeMode === "dark"
                ? "bg-gray-700 border-gray-600 text-gray-100 placeholder-gray-400"
                : "bg-gray-100 border-gray-300 text-gray-800 placeholder-gray-500"}
            `}
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Search todos..."
          />

          <div className='mb-4'>
            <TodoForm />
          </div>

          <div className='flex flex-col gap-y-3'>
            <div className="space-y-2 mt-4">
                {loading ? (
                  <div className="text-center text-gray-500">Loading...</div>
                  ) : (
                  filteredTodos.length === 0 ?
                   <div className="text-center text-gray-400">No todos found.</div> :
                   filteredTodos.map(todo => <TodoItem key={todo._id} todo={todo} />)
              )}

            </div>
          </div>
        </div>
      </div>
    </TodoProvider>
  </ThemeProvider>
);

}

export default App
