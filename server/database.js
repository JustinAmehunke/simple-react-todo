import Database from 'better-sqlite3';
import { fileURLToPath } from 'url';
import { dirname, join } from 'path';
import fs from 'fs';

// Get the current file's directory
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Database file path
const dbPath = join(__dirname, 'todos.db');

let db;

export function initializeDatabase() {
  if (db) return db;

  console.log(`Initializing database at ${dbPath}`);
  const newDb = new Database(dbPath);

  // Enable foreign keys
  newDb.pragma('foreign_keys = ON');

  // Create todos table if it doesn't exist
  newDb.exec(`
    CREATE TABLE IF NOT EXISTS todos (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT,
      completed BOOLEAN NOT NULL DEFAULT 0,
      priority TEXT NOT NULL DEFAULT 'medium',
      createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      updatedAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )
  `);

  // Create trigger to update the updatedAt timestamp
  newDb.exec(`
    CREATE TRIGGER IF NOT EXISTS update_todos_timestamp
    AFTER UPDATE ON todos
    BEGIN
      UPDATE todos SET updatedAt = CURRENT_TIMESTAMP WHERE id = NEW.id;
    END
  `);

  // Insert sample data if the table is empty
  const count = newDb.prepare('SELECT COUNT(*) as count FROM todos').get();

  if (count.count === 0) {
    const sampleTodos = [
      {
        title: 'Complete project proposal',
        description: 'Write up the initial proposal for the client project',
        completed: false,
        priority: 'high'
      },
      {
        title: 'Buy groceries',
        description: 'Milk, eggs, bread, and vegetables',
        completed: true,
        priority: 'medium'
      },
      {
        title: 'Schedule dentist appointment',
        description: 'Call Dr. Smith for a cleaning',
        completed: false,
        priority: 'low'
      },
      {
        title: 'Finish reading book',
        description: 'Complete the last three chapters',
        completed: false,
        priority: 'medium'
      },
      {
        title: 'Update portfolio website',
        description: 'Add recent projects and update skills section',
        completed: false,
        priority: 'high'
      }
    ];

    const insert = newDb.prepare(`
      INSERT INTO todos (title, description, completed, priority)
      VALUES (@title, @description, @completed, @priority)
    `);

    const insertMany = newDb.transaction((todos) => {
      for (const todo of todos) {
        insert.run(todo);
      }
    });

    insertMany(sampleTodos);
    console.log('Sample todos inserted into database');
  }

  db = newDb;
  return db;
}

export function getDatabase() {
  if (!db) {
    return initializeDatabase();
  }
  return db;
}