import React from 'react';
import { motion } from 'framer-motion';
import { Filter, ArrowUpDown, Search, X } from 'lucide-react';
import { useTodo } from '../context/TodoContext';
import type { TodoFilter, TodoSort, SortField } from '../types/todo.types';

const TodoFilters: React.FC = () => {
  const { filter, setFilter, sort, setSort } = useTodo();
  const [searchInput, setSearchInput] = React.useState<string>(filter.search || '');
  const [isFiltersExpanded, setIsFiltersExpanded] = React.useState<boolean>(false);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchInput(e.target.value);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setFilter({ ...filter, search: searchInput });
  };

  const handleClearSearch = () => {
    setSearchInput('');
    setFilter({ ...filter, search: undefined });
  };

  const handleStatusChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === 'all') {
      const { completed, ...restFilter } = filter;
      setFilter(restFilter);
    } else {
      setFilter({ ...filter, completed: value === 'completed' });
    }
  };

  const handlePriorityChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    
    if (value === 'all') {
      const { priority, ...restFilter } = filter;
      setFilter(restFilter);
    } else {
      setFilter({ 
        ...filter, 
        priority: value as 'low' | 'medium' | 'high' 
      });
    }
  };

  const handleSortChange = (field: SortField) => {
    if (sort.field === field) {
      // Toggle direction if already sorting by this field
      setSort({
        field,
        direction: sort.direction === 'asc' ? 'desc' : 'asc'
      });
    } else {
      // Default to descending for new sort field
      setSort({ field, direction: 'desc' });
    }
  };

  const toggleFilters = () => {
    setIsFiltersExpanded(!isFiltersExpanded);
  };

  const getStatusValue = () => {
    if (filter.completed === undefined) return 'all';
    return filter.completed ? 'completed' : 'incomplete';
  };

  return (
    <div className="bg-white rounded-lg shadow-soft p-4 mb-6">
      {/* Search bar */}
      <form onSubmit={handleSearchSubmit} className="flex w-full mb-4">
        <div className="relative flex-grow">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search size={18} className="text-slate-400" />
          </div>
          <input
            type="text"
            value={searchInput}
            onChange={handleSearchChange}
            placeholder="Search todos..."
            className="block w-full pl-10 pr-10 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
          />
          {searchInput && (
            <button
              type="button"
              onClick={handleClearSearch}
              className="absolute inset-y-0 right-0 pr-3 flex items-center"
            >
              <X size={18} className="text-slate-400 hover:text-slate-600" />
            </button>
          )}
        </div>
        <button
          type="submit"
          className="ml-2 px-4 py-2 bg-primary-600 text-white rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-primary-500 focus:ring-offset-2"
        >
          Search
        </button>
      </form>

      {/* Filter toggle button */}
      <div className="flex justify-between items-center mb-2">
        <button
          onClick={toggleFilters}
          className="flex items-center gap-1 text-sm text-slate-600 hover:text-primary-600 transition-colors"
        >
          <Filter size={16} />
          <span>{isFiltersExpanded ? 'Hide filters' : 'Show filters'}</span>
        </button>

        <div className="flex gap-4">
          <button
            onClick={() => handleSortChange('createdAt')}
            className={`flex items-center gap-1 text-sm ${
              sort.field === 'createdAt' ? 'text-primary-600 font-medium' : 'text-slate-600'
            } hover:text-primary-600 transition-colors`}
          >
            <span>Date</span>
            {sort.field === 'createdAt' && (
              <ArrowUpDown size={14} className={`${sort.direction === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </button>

          <button
            onClick={() => handleSortChange('priority')}
            className={`flex items-center gap-1 text-sm ${
              sort.field === 'priority' ? 'text-primary-600 font-medium' : 'text-slate-600'
            } hover:text-primary-600 transition-colors`}
          >
            <span>Priority</span>
            {sort.field === 'priority' && (
              <ArrowUpDown size={14} className={`${sort.direction === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </button>

          <button
            onClick={() => handleSortChange('title')}
            className={`flex items-center gap-1 text-sm ${
              sort.field === 'title' ? 'text-primary-600 font-medium' : 'text-slate-600'
            } hover:text-primary-600 transition-colors`}
          >
            <span>Title</span>
            {sort.field === 'title' && (
              <ArrowUpDown size={14} className={`${sort.direction === 'asc' ? 'rotate-180' : ''}`} />
            )}
          </button>
        </div>
      </div>

      {/* Expandable filter options */}
      {isFiltersExpanded && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-slate-200"
        >
          <div>
            <label htmlFor="status-filter" className="block text-sm font-medium text-slate-700 mb-1">
              Status
            </label>
            <select
              id="status-filter"
              value={getStatusValue()}
              onChange={handleStatusChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All</option>
              <option value="completed">Completed</option>
              <option value="incomplete">Incomplete</option>
            </select>
          </div>
          
          <div>
            <label htmlFor="priority-filter" className="block text-sm font-medium text-slate-700 mb-1">
              Priority
            </label>
            <select
              id="priority-filter"
              value={filter.priority || 'all'}
              onChange={handlePriorityChange}
              className="w-full px-3 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
            >
              <option value="all">All</option>
              <option value="low">Low</option>
              <option value="medium">Medium</option>
              <option value="high">High</option>
            </select>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default TodoFilters;