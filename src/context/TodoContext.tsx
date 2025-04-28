import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { 
  getTodos, 
  createTodo, 
  updateTodo, 
  deleteTodo, 
  toggleTodoStatus,
  deleteManyTodos
} from '../services/todoService';
import type { 
  Todo, 
  TodoCreateInput, 
  TodoUpdateInput, 
  TodoFilter,
  TodoSort
} from '../types/todo.types';

interface TodoContextType {
  todos: Todo[];
  loading: boolean;
  error: string | null;
  filter: TodoFilter;
  sort: TodoSort;
  selectedTodos: number[];
  fetchTodos: () => Promise<void>;
  addTodo: (todo: TodoCreateInput) => Promise<void>;
  editTodo: (id: number, todo: TodoUpdateInput) => Promise<void>;
  removeTodo: (id: number) => Promise<void>;
  toggleStatus: (id: number, completed: boolean) => Promise<void>;
  removeSelectedTodos: () => Promise<void>;
  setFilter: (filter: TodoFilter) => void;
  setSort: (sort: TodoSort) => void;
  toggleSelectedTodo: (id: number) => void;
  selectAllTodos: () => void;
  clearSelectedTodos: () => void;
}

const TodoContext = createContext<TodoContextType | undefined>(undefined);

export const useTodo = (): TodoContextType => {
  const context = useContext(TodoContext);
  if (!context) {
    throw new Error('useTodo must be used within a TodoProvider');
  }
  return context;
};

interface TodoProviderProps {
  children: ReactNode;
}

export const TodoProvider: React.FC<TodoProviderProps> = ({ children }) => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [filter, setFilter] = useState<TodoFilter>({});
  const [sort, setSort] = useState<TodoSort>({ field: 'createdAt', direction: 'desc' });
  const [selectedTodos, setSelectedTodos] = useState<number[]>([]);

  const fetchTodos = async () => {
    try {
      setLoading(true);
      setError(null);
      const data = await getTodos(filter, sort);
      setTodos(data);
    } catch (err) {
      setError('Failed to fetch todos. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTodos();
  }, [filter, sort]);

  const addTodo = async (todo: TodoCreateInput) => {
    try {
      setLoading(true);
      await createTodo(todo);
      await fetchTodos();
    } catch (err) {
      setError('Failed to add todo. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const editTodo = async (id: number, todo: TodoUpdateInput) => {
    try {
      setLoading(true);
      await updateTodo(id, todo);
      await fetchTodos();
    } catch (err) {
      setError('Failed to update todo. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeTodo = async (id: number) => {
    try {
      setLoading(true);
      await deleteTodo(id);
      setSelectedTodos(selectedTodos.filter(todoId => todoId !== id));
      await fetchTodos();
    } catch (err) {
      setError('Failed to delete todo. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleStatus = async (id: number, completed: boolean) => {
    try {
      setLoading(true);
      await toggleTodoStatus(id, completed);
      await fetchTodos();
    } catch (err) {
      setError('Failed to update todo status. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const removeSelectedTodos = async () => {
    if (selectedTodos.length === 0) return;
    
    try {
      setLoading(true);
      await deleteManyTodos(selectedTodos);
      setSelectedTodos([]);
      await fetchTodos();
    } catch (err) {
      setError('Failed to delete selected todos. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const toggleSelectedTodo = (id: number) => {
    setSelectedTodos(prev => 
      prev.includes(id) 
        ? prev.filter(todoId => todoId !== id) 
        : [...prev, id]
    );
  };

  const selectAllTodos = () => {
    const allIds = todos.map(todo => todo.id);
    setSelectedTodos(allIds);
  };

  const clearSelectedTodos = () => {
    setSelectedTodos([]);
  };

  return (
    <TodoContext.Provider
      value={{
        todos,
        loading,
        error,
        filter,
        sort,
        selectedTodos,
        fetchTodos,
        addTodo,
        editTodo,
        removeTodo,
        toggleStatus,
        removeSelectedTodos,
        setFilter,
        setSort,
        toggleSelectedTodo,
        selectAllTodos,
        clearSelectedTodos
      }}
    >
      {children}
    </TodoContext.Provider>
  );
};