import React from 'react';
import { CheckCircle, ListChecks, Plus, Trash2 } from 'lucide-react';
import { useTodo } from '../context/TodoContext';

interface TodoHeaderProps {
  onAddNew: () => void;
}

const TodoHeader: React.FC<TodoHeaderProps> = ({ onAddNew }) => {
  const { 
    todos, 
    selectedTodos, 
    removeSelectedTodos, 
    selectAllTodos, 
    clearSelectedTodos 
  } = useTodo();
  
  const totalCompleted = todos.filter(todo => todo.completed).length;
  
  const handleSelectAll = () => {
    if (selectedTodos.length === todos.length) {
      clearSelectedTodos();
    } else {
      selectAllTodos();
    }
  };
  
  return (
    <header className="bg-white shadow-sm rounded-lg p-4 mb-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800 flex items-center gap-2">
            <ListChecks size={24} className="text-primary-600" />
            <span>Todo List</span>
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            {todos.length} tasks, {totalCompleted} completed
          </p>
        </div>
        
        <div className="flex items-center gap-3">
          {selectedTodos.length > 0 ? (
            <>
              <button
                onClick={removeSelectedTodos}
                className="inline-flex items-center gap-1 px-3 py-2 border border-rose-300 text-rose-600 rounded-md hover:bg-rose-50 transition-colors"
                aria-label="Delete selected todos"
              >
                <Trash2 size={16} />
                <span>Delete {selectedTodos.length}</span>
              </button>
              
              <button 
                onClick={clearSelectedTodos}
                className="inline-flex items-center px-3 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                aria-label="Clear selection"
              >
                <span>Clear selection</span>
              </button>
            </>
          ) : (
            <>
              <button
                onClick={handleSelectAll}
                className="inline-flex items-center gap-1 px-3 py-2 border border-slate-300 text-slate-700 rounded-md hover:bg-slate-50 transition-colors"
                aria-label="Select all todos"
              >
                <CheckCircle size={16} />
                <span>Select all</span>
              </button>
              
              <button
                onClick={onAddNew}
                className="inline-flex items-center gap-1 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 transition-colors"
                aria-label="Add new todo"
              >
                <Plus size={16} />
                <span>Add new</span>
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default TodoHeader;