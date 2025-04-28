import express from 'express';
import { getDatabase } from '../database.js';

const router = express.Router();
const db = getDatabase();

// GET all todos with optional filtering and sorting
router.get('/', (req, res) => {
  try {
    // Initialize the base query
    let query = 'SELECT * FROM todos';
    const queryParams = [];
    const conditions = [];
    
    // Process filter parameters
    const { completed, priority, search, sortField, sortDirection } = req.query;
    
    if (completed !== undefined) {
      conditions.push('completed = ?');
      queryParams.push(completed === 'true' ? 1 : 0);
    }
    
    if (priority) {
      conditions.push('priority = ?');
      queryParams.push(priority);
    }
    
    if (search) {
      conditions.push('(title LIKE ? OR description LIKE ?)');
      queryParams.push(`%${search}%`, `%${search}%`);
    }
    
    // Add WHERE clause if there are conditions
    if (conditions.length > 0) {
      query += ' WHERE ' + conditions.join(' AND ');
    }
    
    // Add sorting
    const validSortFields = ['title', 'priority', 'createdAt', 'updatedAt'];
    const validSortDirections = ['asc', 'desc'];
    
    const field = validSortFields.includes(sortField) ? sortField : 'createdAt';
    const direction = validSortDirections.includes(sortDirection) ? sortDirection : 'desc';
    
    query += ` ORDER BY ${field} ${direction}`;
    
    // Execute query
    const todos = db.prepare(query).all(...queryParams);
    
    res.json(todos);
  } catch (error) {
    console.error('Error fetching todos:', error);
    res.status(500).json({ error: 'Failed to fetch todos' });
  }
});

// GET a specific todo by ID
router.get('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const todo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    
    if (!todo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    res.json(todo);
  } catch (error) {
    console.error(`Error fetching todo with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to fetch todo' });
  }
});

// POST a new todo
router.post('/', (req, res) => {
  try {
    const { title, description, completed, priority } = req.body;
    
    if (!title) {
      return res.status(400).json({ error: 'Title is required' });
    }
    
    const stmt = db.prepare(`
      INSERT INTO todos (title, description, completed, priority)
      VALUES (?, ?, ?, ?)
    `);
    
    const result = stmt.run(
      title,
      description || '',
      completed ? 1 : 0,
      priority || 'medium'
    );
    
    // Get the newly created todo
    const newTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(result.lastInsertRowid);
    
    res.status(201).json(newTodo);
  } catch (error) {
    console.error('Error creating todo:', error);
    res.status(500).json({ error: 'Failed to create todo' });
  }
});

// PUT to update a todo
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const { title, description, completed, priority } = req.body;
    
    // Check if todo exists
    const existingTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    // Validate title if provided
    if (title !== undefined && !title) {
      return res.status(400).json({ error: 'Title cannot be empty' });
    }
    
    // Build update query dynamically based on provided fields
    const updates = [];
    const params = [];
    
    if (title !== undefined) {
      updates.push('title = ?');
      params.push(title);
    }
    
    if (description !== undefined) {
      updates.push('description = ?');
      params.push(description);
    }
    
    if (completed !== undefined) {
      updates.push('completed = ?');
      params.push(completed ? 1 : 0);
    }
    
    if (priority !== undefined) {
      updates.push('priority = ?');
      params.push(priority);
    }
    
    if (updates.length === 0) {
      return res.status(400).json({ error: 'No fields to update' });
    }
    
    // Add ID to params
    params.push(id);
    
    const updateQuery = `
      UPDATE todos
      SET ${updates.join(', ')}
      WHERE id = ?
    `;
    
    db.prepare(updateQuery).run(...params);
    
    // Get the updated todo
    const updatedTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    
    res.json(updatedTodo);
  } catch (error) {
    console.error(`Error updating todo with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update todo' });
  }
});

// PATCH to toggle todo status
router.patch('/:id/status', (req, res) => {
  try {
    const { id } = req.params;
    const { completed } = req.body;
    
    // Check if todo exists
    const existingTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    if (completed === undefined) {
      return res.status(400).json({ error: 'Completed status is required' });
    }
    
    db.prepare('UPDATE todos SET completed = ? WHERE id = ?').run(
      completed ? 1 : 0,
      id
    );
    
    // Get the updated todo
    const updatedTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    
    res.json(updatedTodo);
  } catch (error) {
    console.error(`Error updating status for todo with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to update todo status' });
  }
});

// DELETE a todo
router.delete('/:id', (req, res) => {
  try {
    const { id } = req.params;
    
    // Check if todo exists
    const existingTodo = db.prepare('SELECT * FROM todos WHERE id = ?').get(id);
    
    if (!existingTodo) {
      return res.status(404).json({ error: 'Todo not found' });
    }
    
    db.prepare('DELETE FROM todos WHERE id = ?').run(id);
    
    res.status(204).end();
  } catch (error) {
    console.error(`Error deleting todo with ID ${req.params.id}:`, error);
    res.status(500).json({ error: 'Failed to delete todo' });
  }
});

// DELETE multiple todos
router.delete('/', (req, res) => {
  try {
    const { ids } = req.body;
    
    if (!ids || !Array.isArray(ids) || ids.length === 0) {
      return res.status(400).json({ error: 'Valid array of IDs is required' });
    }
    
    // Use a transaction to delete multiple todos
    const deleteMany = db.transaction((todoIds) => {
      const stmt = db.prepare('DELETE FROM todos WHERE id = ?');
      for (const id of todoIds) {
        stmt.run(id);
      }
    });
    
    deleteMany(ids);
    
    res.status(204).end();
  } catch (error) {
    console.error('Error deleting multiple todos:', error);
    res.status(500).json({ error: 'Failed to delete todos' });
  }
});

export default router;