export interface Todo {
  id: number;
  title: string;
  description: string;
  completed: boolean;
  priority: 'low' | 'medium' | 'high';
  createdAt: string;
  updatedAt: string;
}

export type TodoCreateInput = Omit<Todo, 'id' | 'createdAt' | 'updatedAt'>;
export type TodoUpdateInput = Partial<TodoCreateInput>;

export type SortField = 'title' | 'priority' | 'createdAt' | 'updatedAt';
export type SortDirection = 'asc' | 'desc';

export interface TodoFilter {
  completed?: boolean;
  priority?: 'low' | 'medium' | 'high';
  search?: string;
}

export interface TodoSort {
  field: SortField;
  direction: SortDirection;
}