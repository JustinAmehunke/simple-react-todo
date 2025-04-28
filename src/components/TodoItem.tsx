import React from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, Circle, Pencil, Trash2, Star } from 'lucide-react';
import type { Todo } from '../types/todo.types';
import { useTodo } from '../context/TodoContext';

interface TodoItemProps {
  todo: Todo;
  onEdit: (todo: Todo) => void;
}

const priorityColors = {
  low: 'bg-blue-100 text-blue-800',
  medium: 'bg-amber-100 text-amber-800',
  high: 'bg-rose-100 text-rose-800'
};

const priorityLabels = {
  low: 'Low',
  medium: 'Medium',
  high: 'High'
};

const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', {
    month: 'short',
    day: 'numeric',
    hour: 'numeric',
    minute: 'numeric'
  }).format(date);
};

const TodoItem: React.FC<TodoItemProps> = ({ todo, onEdit }) => {
  const { toggleStatus, removeTodo, selectedTodos, toggleSelectedTodo } = useTodo();
  const isSelected = selectedTodos.includes(todo.id);

  const handleToggleComplete = () => {
    toggleStatus(todo.id, !todo.completed);
  };

  const handleDelete = () => {
    removeTodo(todo.id);
  };

  const handleSelect = (e: React.MouseEvent) => {
    e.stopPropagation();
    toggleSelectedTodo(todo.id);
  };

  return (
    <motion.div 
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -10 }}
      transition={{ duration: 0.2 }}
      className={`rounded-lg shadow-soft hover:shadow-hover transition-all duration-300 mb-3 overflow-hidden
                 ${todo.completed ? 'bg-slate-50' : 'bg-white'} 
                 ${isSelected ? 'ring-2 ring-primary-500 ring-offset-2' : ''}`}
    >
      <div className="p-4 flex items-start gap-3">
        {/* Selection checkbox */}
        <div onClick={handleSelect} className="mt-1 cursor-pointer flex-shrink-0">
          {isSelected ? (
            <div className="h-5 w-5 rounded-full bg-primary-500 flex items-center justify-center">
              <CheckCircle size={20} className="text-white" />
            </div>
          ) : (
            <div className="h-5 w-5 rounded-full border-2 border-slate-300" />
          )}
        </div>

        {/* Main content */}
        <div className="flex-grow">
          <div className="flex items-center justify-between">
            <h3 className={`text-lg font-medium ${todo.completed ? 'line-through text-slate-500' : 'text-slate-800'}`}>
              {todo.title}
            </h3>
            
            <div className="flex items-center gap-2">
              <span className={`text-xs px-2 py-1 rounded-full font-medium ${priorityColors[todo.priority]}`}>
                {priorityLabels[todo.priority]}
              </span>
            </div>
          </div>
          
          {todo.description && (
            <p className={`mt-1 text-sm ${todo.completed ? 'text-slate-400' : 'text-slate-600'}`}>
              {todo.description}
            </p>
          )}
          
          <div className="mt-3 flex items-center justify-between">
            <span className="text-xs text-slate-500">
              {formatDate(todo.updatedAt)}
            </span>
            
            <div className="flex items-center gap-3">
              <button 
                onClick={handleToggleComplete}
                className="text-slate-500 hover:text-primary-600 transition-colors"
                aria-label={todo.completed ? "Mark as incomplete" : "Mark as complete"}
              >
                {todo.completed ? (
                  <CheckCircle size={18} className="text-accent-600" />
                ) : (
                  <Circle size={18} />
                )}
              </button>
              
              <button 
                onClick={() => onEdit(todo)} 
                className="text-slate-500 hover:text-amber-600 transition-colors"
                aria-label="Edit todo"
              >
                <Pencil size={18} />
              </button>
              
              <button 
                onClick={handleDelete} 
                className="text-slate-500 hover:text-rose-600 transition-colors"
                aria-label="Delete todo"
              >
                <Trash2 size={18} />
              </button>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default TodoItem;