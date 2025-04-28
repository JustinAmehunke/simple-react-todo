import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';
import type { Todo, TodoCreateInput } from '../types/todo.types';

interface TodoFormProps {
  onSubmit: (todo: TodoCreateInput) => void;
  onCancel: () => void;
  initialValues?: Todo;
  title: string;
}

const TodoForm: React.FC<TodoFormProps> = ({ 
  onSubmit, 
  onCancel, 
  initialValues, 
  title 
}) => {
  const [formData, setFormData] = useState<TodoCreateInput>({
    title: '',
    description: '',
    completed: false,
    priority: 'medium'
  });

  useEffect(() => {
    if (initialValues) {
      setFormData({
        title: initialValues.title,
        description: initialValues.description,
        completed: initialValues.completed,
        priority: initialValues.priority
      });
    }
  }, [initialValues]);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, checked } = e.target;
    setFormData(prev => ({ ...prev, [name]: checked }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.title.trim()) return;
    onSubmit(formData);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className="bg-white rounded-lg shadow-lg overflow-hidden w-full max-w-md"
    >
      <div className="flex items-center justify-between bg-primary-600 text-white px-4 py-3">
        <h2 className="text-lg font-semibold">{title}</h2>
        <button
          onClick={onCancel}
          className="p-1 rounded-full hover:bg-primary-500 transition-colors"
          aria-label="Close"
        >
          <X size={20} />
        </button>
      </div>
      
      <form onSubmit={handleSubmit} className="p-4">
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-1">
            Title <span className="text-rose-500">*</span>
          </label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter todo title"
            required
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-1">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            value={formData.description}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            placeholder="Enter description"
            rows={3}
          />
        </div>
        
        <div className="mb-4">
          <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-1">
            Priority
          </label>
          <select
            id="priority"
            name="priority"
            value={formData.priority}
            onChange={handleChange}
            className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="low">Low</option>
            <option value="medium">Medium</option>
            <option value="high">High</option>
          </select>
        </div>
        
        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="completed"
              checked={formData.completed}
              onChange={handleCheckboxChange}
              className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-slate-300 rounded"
            />
            <span className="ml-2 text-sm text-slate-700">Mark as completed</span>
          </label>
        </div>
        
        <div className="flex justify-end gap-2 mt-6">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 bg-white border border-slate-300 rounded-md text-slate-700 hover:bg-slate-50"
          >
            Cancel
          </button>
          <button
            type="submit"
            className="px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
          >
            {initialValues ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </motion.div>
  );
};

export default TodoForm;