import axios from 'axios';
import type { Todo, TodoCreateInput, TodoUpdateInput, TodoFilter, TodoSort } from '../types/todo.types';

const API_URL = 'http://localhost:3001/api/todos';

export const getTodos = async (filter?: TodoFilter, sort?: TodoSort): Promise<Todo[]> => {
  try {
    let url = API_URL;
    const params = new URLSearchParams();
    
    // Add filter parameters
    if (filter) {
      if (filter.completed !== undefined) params.append('completed', String(filter.completed));
      if (filter.priority) params.append('priority', filter.priority);
      if (filter.search) params.append('search', filter.search);
    }
    
    // Add sort parameters
    if (sort) {
      params.append('sortField', sort.field);
      params.append('sortDirection', sort.direction);
    }
    
    // Append params to URL if any exist
    if (params.toString()) {
      url += `?${params.toString()}`;
    }
    
    const response = await axios.get<Todo[]>(url);
    return response.data;
  } catch (error) {
    console.error('Error fetching todos:', error);
    throw error;
  }
};

export const getTodoById = async (id: number): Promise<Todo> => {
  try {
    const response = await axios.get<Todo>(`${API_URL}/${id}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching todo with id ${id}:`, error);
    throw error;
  }
};

export const createTodo = async (todo: TodoCreateInput): Promise<Todo> => {
  try {
    const response = await axios.post<Todo>(API_URL, todo);
    return response.data;
  } catch (error) {
    console.error('Error creating todo:', error);
    throw error;
  }
};

export const updateTodo = async (id: number, todo: TodoUpdateInput): Promise<Todo> => {
  try {
    const response = await axios.put<Todo>(`${API_URL}/${id}`, todo);
    return response.data;
  } catch (error) {
    console.error(`Error updating todo with id ${id}:`, error);
    throw error;
  }
};

export const deleteTodo = async (id: number): Promise<void> => {
  try {
    await axios.delete(`${API_URL}/${id}`);
  } catch (error) {
    console.error(`Error deleting todo with id ${id}:`, error);
    throw error;
  }
};

export const toggleTodoStatus = async (id: number, completed: boolean): Promise<Todo> => {
  try {
    const response = await axios.patch<Todo>(`${API_URL}/${id}/status`, { completed });
    return response.data;
  } catch (error) {
    console.error(`Error toggling status for todo with id ${id}:`, error);
    throw error;
  }
};

export const deleteManyTodos = async (ids: number[]): Promise<void> => {
  try {
    await axios.delete(API_URL, { data: { ids } });
  } catch (error) {
    console.error('Error deleting multiple todos:', error);
    throw error;
  }
};