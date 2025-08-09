/* eslint-disable no-unused-vars */
import { createContext, useContext } from 'react';

export const TodoContext = createContext({
    todos: [
        {
            _id: 1,
            title: 'Todo msg',
            completed: false,
        }
    ],
    addTodo: (todo) => {},
    updateTodo: (id, todo) => {},
    deleteTodo: (id) => {},
    toggleComplete: (id) => {}
})

export const useTodo = () => {
    return useContext(TodoContext)
}

export const TodoProvider = TodoContext.Provider