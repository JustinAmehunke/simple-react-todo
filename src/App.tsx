import React, { useState } from 'react';
import { CheckCheck } from 'lucide-react';
import { TodoProvider } from './context/TodoContext';
import TodoHeader from './components/TodoHeader';
import TodoFilters from './components/TodoFilters';
import TodoList from './components/TodoList';
import TodoForm from './components/TodoForm';
import Modal from './components/Modal';
import type { Todo, TodoCreateInput } from './types/todo.types';
import { useTodo } from './context/TodoContext';

const TodoApp: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTodo, setEditingTodo] = useState<Todo | undefined>(undefined);
  const { addTodo, editTodo } = useTodo();

  const handleAddNew = () => {
    setEditingTodo(undefined);
    setIsModalOpen(true);
  };

  const handleEdit = (todo: Todo) => {
    setEditingTodo(todo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTodo(undefined);
  };

  const handleFormSubmit = (todoData: TodoCreateInput) => {
    if (editingTodo) {
      editTodo(editingTodo.id, todoData);
    } else {
      addTodo(todoData);
    }
    handleCloseModal();
  };

  return (
    <div className="min-h-screen bg-slate-100 px-4 py-8">
      <div className="max-w-4xl mx-auto">
        <TodoHeader onAddNew={handleAddNew} />
        <TodoFilters />
        <TodoList onEditTodo={handleEdit} />

        <Modal isOpen={isModalOpen} onClose={handleCloseModal}>
          <TodoForm
            onSubmit={handleFormSubmit}
            onCancel={handleCloseModal}
            initialValues={editingTodo}
            title={editingTodo ? 'Edit Task' : 'Add New Task'}
          />
        </Modal>
      </div>
    </div>
  );
};

function App() {
  return (
    <div className="min-h-screen bg-slate-100">
      <header className="bg-primary-700 text-white py-4">
        <div className="max-w-6xl mx-auto px-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <CheckCheck size={28} />
              <h1 className="text-xl font-semibold">TODO</h1>
            </div>
            <p className="text-sm text-primary-200">Simple, beautiful task management</p>
          </div>
        </div>
      </header>

      <TodoProvider>
        <TodoApp />
      </TodoProvider>

      <footer className="py-6 text-center text-slate-500 text-sm">
        <p>© 2025 TODO. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;