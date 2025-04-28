import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useTodo } from '../context/TodoContext';
import TodoItem from './TodoItem';
import { FileQuestion } from 'lucide-react';
import type { Todo } from '../types/todo.types';

interface TodoListProps {
  onEditTodo: (todo: Todo) => void;
}

const TodoList: React.FC<TodoListProps> = ({ onEditTodo }) => {
  const { todos, loading, error } = useTodo();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="inline-flex items-center px-4 py-2 bg-primary-50 text-primary-700 rounded-md">
          <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-primary-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
          </svg>
          <span>Loading todos...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="rounded-lg bg-rose-50 p-4 text-rose-700 text-center">
        <p>{error}</p>
        <p className="text-sm mt-2">Please try refreshing the page.</p>
      </div>
    );
  }

  if (todos.length === 0) {
    return (
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="flex flex-col items-center justify-center h-64 bg-slate-50 rounded-lg p-8 text-center"
      >
        <FileQuestion size={48} className="text-slate-400 mb-4" />
        <h3 className="text-xl font-medium text-slate-700 mb-2">No tasks found</h3>
        <p className="text-slate-500 max-w-md">
          You don't have any tasks yet. Add a new task to get started or try adjusting your filter settings.
        </p>
      </motion.div>
    );
  }

  return (
    <div>
      <AnimatePresence>
        {todos.map(todo => (
          <TodoItem 
            key={todo.id} 
            todo={todo} 
            onEdit={onEditTodo} 
          />
        ))}
      </AnimatePresence>
    </div>
  );
};

export default TodoList;