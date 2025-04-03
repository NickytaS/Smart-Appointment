// src/utils/database.ts
import * as SQLite from "expo-sqlite";
import { User, Appointment } from "./types";

// Initialize the database and create the necessary tables if they don't exist
export const initializeDatabase = async (): Promise<boolean> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    // Execute multiple SQL statements asynchronously
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS users (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        firstName TEXT,
        lastName TEXT,
        email TEXT UNIQUE,
        phone TEXT,
        password TEXT
      );
      CREATE TABLE IF NOT EXISTS specialties (
        id TEXT PRIMARY KEY,
        name TEXT,
        icon TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS doctors (
        id TEXT PRIMARY KEY,
        first_name TEXT,
        last_name TEXT,
        title TEXT,
        bio TEXT,
        avatar_url TEXT,
        specialty_id TEXT REFERENCES specialties(id),
        rating NUMERIC,
        reviews_count INTEGER,
        is_available BOOLEAN,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
      CREATE TABLE IF NOT EXISTS appointments (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        userId INTEGER,
        doctorId TEXT,
        date TEXT,
        time TEXT,
        status TEXT CHECK(status IN ('pending', 'confirmed', 'completed', 'cancelled')),
        notes TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (userId) REFERENCES users(id),
        FOREIGN KEY (doctorId) REFERENCES doctors(id)
      );
    `);
    console.log("Database initialized with all tables");
    return true;
  } catch (error) {
    console.error("Error initializing database:", error);
    return false;
  }
};

export const createSpecialtiesTable = async (): Promise<void> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS specialties (
        id TEXT PRIMARY KEY,
        name TEXT,
        icon TEXT,
        description TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);
    console.log("Specialties table created");
  } catch (error) {
    console.error("Error creating specialties table:", error);
    throw error;
  }
};

// Add this function to check if database exists and create tables if needed
export const ensureDatabaseInitialized = async (): Promise<void> => {
  try {
    const db = await SQLite.openDatabaseAsync("app.db");
    
    // Check if appointments table exists
    const result = db.getAllSync<{ name: string }>(
      "SELECT name FROM sqlite_master WHERE type='table' AND name='appointments';"
    );

    if (!result || result.length === 0) {
      console.log("Database tables not found. Initializing...");
      const success = await initializeDatabase();
      if (success) {
        console.log("Database initialized successfully");
      } else {
        console.error("Failed to initialize database");
      }
    } else {
      console.log("Database tables already exist");
    }
  } catch (error) {
    console.error("Error checking database:", error);
    throw error;
  }
};

export const deleteUser = async (id: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    await db.runAsync("DELETE FROM users WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting user:", error);
    throw error; // Rethrow the error after logging it
  }
};

export const updateUser = async (
  id: number,
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string
): Promise<void> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    await db.runAsync(
      "UPDATE users SET firstName = ?, lastName = ?, email = ?, phone = ?, password = ? WHERE id = ?",
      [firstName, lastName, email, phone, password, id]
    );
  } catch (error) {
    console.error("Error updating user:", error);
    throw error; // Rethrow the error after logging it
  }
};

export const deleteAllUsers = async (): Promise<void> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    await db.runAsync("DELETE FROM users");
  } catch (error) {
    console.error("Error deleting all users:", error);
    throw error; // Rethrow the error after logging it
  }
};

export const addUser = async (
  firstName: string,
  lastName: string,
  email: string,
  phone: string,
  password: string
): Promise<void> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    await db.runAsync(
      "INSERT INTO users (firstName, lastName, email, phone, password) VALUES (?, ?, ?, ?, ?);",
      [firstName, lastName, email, phone, password]
    );
  } catch (error) {
    console.error("Error adding user:", error);
    throw error; // Rethrow the error after logging it
  }
};

// Add this function after your other database functions
export const getUserByEmail = async (email: string): Promise<User | null> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    const user = await db.getFirstAsync<User>(
      `SELECT id, firstName, lastName, email, phone, password 
       FROM users 
       WHERE email = ?`,
      [email]
    );
    
    if (!user) {
      return null;
    }

    return user;
  } catch (error) {
    console.error("Error getting user by email:", error);
    throw error;
  }
};

export const createAppointment = async (
  userId: number,
  doctorId: string,
  date: string,
  time: string,
  notes?: string
): Promise<number> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    const result = await db.runAsync(
      `INSERT INTO appointments (userId, doctorId, date, time, status, notes) 
       VALUES (?, ?, ?, ?, 'pending', ?);`,
      [userId, doctorId, date, time, notes ?? ""]
    );
    return result.lastInsertRowId;
  } catch (error) {
    console.error("Error creating appointment:", error);
    throw error;
  }
};

export const getUpcomingAppointments = async (userId: number): Promise<Appointment[]> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    return await db.getAllAsync<Appointment>(
      `SELECT * FROM appointments 
       WHERE userId = ? 
       AND date >= date('now')
       AND status IN ('pending', 'confirmed')
       ORDER BY date, time`,
      [userId]
    );
  } catch (error) {
    console.error("Error getting upcoming appointments:", error);
    throw error;
  }
};

export const updateAppointmentStatus = async (
  id: number,
  status: Appointment['status']
): Promise<void> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    await db.runAsync(
      `UPDATE appointments 
       SET status = ?, updated_at = CURRENT_TIMESTAMP 
       WHERE id = ?`,
      [status, id]
    );
  } catch (error) {
    console.error("Error updating appointment status:", error);
    throw error;
  }
};

export const deleteAppointment = async (id: number): Promise<void> => {
  const db = await SQLite.openDatabaseAsync("app.db");

  try {
    await db.runAsync("DELETE FROM appointments WHERE id = ?", [id]);
  } catch (error) {
    console.error("Error deleting appointment:", error);
    throw error;
  }
};


