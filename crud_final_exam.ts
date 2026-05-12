import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import cors from "cors";
import mysql from "mysql2/promise";
import dotenv from "dotenv";

dotenv.config();

async function startServer() {
  const app = express();
  const PORT = process.env.PORT || 3000;

  app.use(cors());
  app.use(express.json());

  // MySQL Connection Pool
  let pool: mysql.Pool | null = null;

  try {
    if (process.env.MYSQL_URI) {
      console.log("Database: Initiating connection to Aiven MySQL...");
      
      // We use a config object to correctly set SSL for Aiven
      pool = mysql.createPool({
        uri: process.env.MYSQL_URI,
        ssl: {
          rejectUnauthorized: false
        },
        waitForConnections: true,
        connectionLimit: 10,
        enableKeepAlive: true,
      });

      // Initialize table and ensure gender column exists
      await pool.execute(`
        CREATE TABLE IF NOT EXISTS students (
          id INT AUTO_INCREMENT PRIMARY KEY,
          studentId VARCHAR(50) NOT NULL UNIQUE,
          fullName VARCHAR(255) NOT NULL,
          course VARCHAR(100) NOT NULL,
          yearLevel VARCHAR(50) NOT NULL,
          gender VARCHAR(20) NOT NULL,
          email VARCHAR(255) NOT NULL,
          created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
          updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
        )
      `);

      // Migration: Check if gender column exists, if not add it
      try {
        const [columns]: any = await pool.query("SHOW COLUMNS FROM students LIKE 'gender'");
        if (columns.length === 0) {
          console.log("Database: Adding 'gender' column to students table...");
          await pool.execute("ALTER TABLE students ADD COLUMN gender VARCHAR(20) NOT NULL DEFAULT 'Male' AFTER yearLevel");
        }
      } catch (err) {
        console.error("Migration error:", err);
      }

      console.log("Database: Table synchronization complete.");
    } else {
      console.warn("MYSQL_URI not found. Database features disabled.");
    }
  } catch (error) {
    console.error("Database connection failed:", error);
  }

  // API Routes
  app.get("/api/health", (req, res) => {
    res.json({ 
      status: "ok", 
      database: !!pool,
      env: process.env.MYSQL_URI ? 'connected' : 'missing_uri'
    });
  });

  // [READ] View all student records
  app.get("/api/students", async (req, res) => {
    try {
      if (!pool) return res.json([]);
      console.log("Fetching all students...");
      const [rows] = await pool.query("SELECT * FROM students ORDER BY created_at DESC");
      res.json(rows);
    } catch (error) {
      console.error("GET /api/students error:", error);
      res.status(500).json({ error: "Failed to fetch students from database" });
    }
  });

  // [CREATE] Add student record
  app.post("/api/students", async (req, res) => {
    try {
      if (!pool) throw new Error("No database connection");
      const { studentId, fullName, course, yearLevel, gender, email } = req.body;
      
      console.log("Inserting student:", { studentId, fullName });
      
      const [result] = await pool.execute(
        "INSERT INTO students (studentId, fullName, course, yearLevel, gender, email) VALUES (?, ?, ?, ?, ?, ?)",
        [studentId, fullName, course, yearLevel, gender, email]
      );
      
      const insertId = (result as any).insertId;
      console.log("Record created with ID:", insertId);
      res.status(201).json({ id: insertId, ...req.body });
    } catch (error: any) {
      console.error("POST /api/students error:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "Student ID already exists in the registry" });
      }
      res.status(500).json({ error: "Database error while creating record" });
    }
  });

  // [UPDATE] Update student information
  app.put("/api/students/:id", async (req, res) => {
    try {
      if (!pool) throw new Error("No database connection");
      const id = parseInt(req.params.id);
      const { studentId, fullName, course, yearLevel, gender, email } = req.body;
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid record ID" });
      }

      console.log(`Updating record ID: ${id}`, { studentId, fullName });
      
      const [result] = await pool.execute(
        "UPDATE students SET studentId = ?, fullName = ?, course = ?, yearLevel = ?, gender = ?, email = ? WHERE id = ?",
        [studentId, fullName, course, yearLevel, gender, email, id]
      );
      
      if ((result as any).affectedRows === 0) {
        console.warn(`Update target NOT FOUND: ID ${id}`);
        return res.status(404).json({ error: "Student record not found" });
      }
      
      console.log("Update successful for ID:", id);
      res.json({ message: "Record updated successfully" });
    } catch (error: any) {
      console.error("PUT /api/students error:", error);
      if (error.code === 'ER_DUP_ENTRY') {
        return res.status(400).json({ error: "New Student ID conflicts with an existing record" });
      }
      res.status(500).json({ error: "Database error while updating record" });
    }
  });

  // [DELETE] Delete student record
  app.delete("/api/students/:id", async (req, res) => {
    try {
      if (!pool) throw new Error("No database connection");
      const id = parseInt(req.params.id);
      
      if (isNaN(id)) {
        return res.status(400).json({ error: "Invalid record ID" });
      }

      console.log(`Deleting record ID: ${id}`);
      
      const [result] = await pool.execute("DELETE FROM students WHERE id = ?", [id]);
      
      if ((result as any).affectedRows === 0) {
        console.warn(`Delete target NOT FOUND: ID ${id}`);
        return res.status(404).json({ error: "Record not found" });
      }
      
      console.log("Delete successful for ID:", id);
      res.json({ message: "Record deleted successfully" });
    } catch (error) {
      console.error("DELETE /api/students error:", error);
      res.status(500).json({ error: "Database error while deleting record" });
    }
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer();
