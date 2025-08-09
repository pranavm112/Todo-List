import React from 'react'
import { useState } from 'react'
import { useTodo } from '../contexts/TodoContext'
import useTheme from '../contexts/theme.js'

function TodoItem({ todo }) {
    const [isTodoEditable, setIsTodoEditable] = useState(false)
    const [todoMsg, setTodoMsg] = useState(todo.title)
    const { updateTodo, deleteTodo, toggleComplete } = useTodo()
    const { themeMode } = useTheme();   // Get the current theme mode

    const editTodo = () => {
        if (!todoMsg.trim()) {
        alert("Todo cannot be empty!");
        return;
    } 
        updateTodo(todo._id, { ...todo, title: todoMsg })
        setIsTodoEditable(false)
    }

    const toggleCompleted = () => {
        toggleComplete(todo._id)
    }
    

    return (
      <div className={`
     flex items-center justify-between p-3 rounded-lg transition-colors
         ${themeMode === "dark" ? "bg-gray-700 hover:bg-gray-600" : "bg-gray-100 hover:bg-gray-200"}
        `}>
            {/* ...rest of item */}
            <div
                className={`flex border border-black/10 rounded-lg px-3 py-1.5 gap-x-3 shadow-sm shadow-white/50 duration-300 text-black
                 ${todo.completed ? "bg-[#c6e9a7]" : "bg-[#ccbed7]"}`}
            >
            {/* Toggle completed */}
          <input
              type='checkbox'
              className='cursor-pointer'
              checked={todo.completed}
              onChange={toggleCompleted }
            />
                
            {/* Editable text input */}
          <input 
                type='text'
                className={`border outline-none w-full bg-transparent rounded-lg 
                ${isTodoEditable ? "border-black/10 px-2" : "border-transparent"}
                ${todo.completed ? "line-through" : ""}`}
                value={todoMsg}
                onChange={(e) => setTodoMsg(e.target.value)}
                readOnly={!isTodoEditable}
            />
                
          {/* Edit/Save Button */}
          <button
              className='inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center
                        items-center bg-gray-50 hover:bg-gray-100 shrink-0 disabled:opacity-50'
              onClick={() => {
                  if (todo.completed) return;
                  
                  if (isTodoEditable) {
                      editTodo()
                  }
                  else setIsTodoEditable(true)
              }}
          
              disabled={todo.completed}>
              {isTodoEditable ? "📂" : "✏️"}
            </button>
                
                {/* Delete Button */}
          <button className='inline-flex w-8 h-8 rounded-lg text-sm border border-black/10 justify-center
                        items-center bg-gray-50 hover:bg-red-100 shrink-0 disabled:opacity-50'
              onClick={() => deleteTodo(todo._id)}
          >
              🗑️
          </button>
    </div>
</div>
    
  )
}

export default TodoItem