import React,  { useState } from 'react'
import { useTodo } from '../contexts'
import useTheme from '../contexts/theme.js'

function TodoForm() {

    const [todo, setTodo] = useState("")
    const { addTodo } = useTodo()
    const { themeMode } = useTheme();     // Get the current theme mode

    const add = (e) => {
        e.preventDefault()
        if (!todo.trim()) {
            alert("Todo cannot be empty")
            return
        }
        addTodo({ title:todo, completed: false })  // Changed 'todo' to 'title'
        setTodo("")
    }
    
   
    
    return (
        <div className={`
  flex items-center justify-between p-3 rounded-lg transition-colors
  ${themeMode === "dark" ? "bg-gray-700" : "bg-gray-100"}
`}>
            {/* ...rest of item */}
            <form onSubmit={add} className='flex'>
            <input
                type='text'
                placeholder='Write Todo...'
                className='w-full border border-black/10 rounded-l-lg px-3 outline-none duration-150 bg-white/20 py-1.5'
                value={todo}
                onChange={(e) => setTodo(e.target.value)}
            />
            <button type='submit' className='rounded-r-lg px-3 py-1 bg-green-600 text-white shrink-0 hover:bg-green-700 duration-150'>
                Add
            </button>
        </form>
</div>

        
    );
}

export default TodoForm 