import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { 
  insertGameQuestionSchema, 
  insertPlayerSchema, 
  insertPenaltySchema,
  excelDataSchema
} from "@shared/schema";
import { z } from "zod";

export async function registerRoutes(app: Express): Promise<Server> {
  // API routes for game categories
  app.get("/api/categories", async (req, res) => {
    const categories = await storage.getAllGameCategories();
    return res.json(categories);
  });

  app.get("/api/categories/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const category = await storage.getGameCategory(id);
    if (!category) {
      return res.status(404).json({ message: "Category not found" });
    }
    
    return res.json(category);
  });

  // API routes for game questions
  app.get("/api/questions", async (req, res) => {
    const categoryId = req.query.categoryId ? parseInt(req.query.categoryId as string) : undefined;
    
    if (categoryId !== undefined) {
      if (isNaN(categoryId)) {
        return res.status(400).json({ message: "Invalid category ID format" });
      }
      
      const questions = await storage.getGameQuestionsByCategoryId(categoryId);
      return res.json(questions);
    } else {
      const questions = await storage.getAllGameQuestions();
      return res.json(questions);
    }
  });
  
  // حذف جميع الأسئلة (إعادة ضبط)
  app.delete("/api/questions", async (req, res) => {
    try {
      await storage.deleteAllGameQuestions();
      return res.status(200).json({ message: "All questions have been deleted successfully" });
    } catch (error) {
      return res.status(500).json({ message: "Failed to delete all questions" });
    }
  });

  app.post("/api/questions", async (req, res) => {
    try {
      const question = insertGameQuestionSchema.parse(req.body);
      const createdQuestion = await storage.createGameQuestion(question);
      return res.status(201).json(createdQuestion);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid question data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create question" });
    }
  });

  app.post("/api/questions/bulk", async (req, res) => {
    try {
      // First clear existing questions if requested
      if (req.query.clear === "true") {
        await storage.deleteAllGameQuestions();
      }
      
      // Validate the data from Excel
      const excelData = excelDataSchema.parse(req.body);
      
      // Map the Excel data to question format
      const questions = excelData.map(row => {
        const categoryName = row.category;
        // Find the category ID based on the name
        const categories = Array.from((storage as any).gameCategories.values());
        const category = categories.find(cat => cat.name === categoryName);
        const categoryId = category ? category.id : 1; // Default to first category if not found
        
        // إنشاء كائن الأسئلة الأساسي
        const questionData: any = {
          categoryId,
          clue1: row.clue1,
          clue2: row.clue2,
          answer: row.answer,
          letterCount: typeof row.letterCount === 'string' ? parseInt(row.letterCount) : row.letterCount
        };
        
        // معالجة الحقول الخاصة بكل نوع من اللعبة
        if (categoryName === 'صور' && row.imageUrl) {
          questionData.imageUrl = row.imageUrl;
        }
        
        if (categoryName === 'أكمل المثل' && row.missingText) {
          questionData.missingText = row.missingText;
        }
        
        if (categoryName === 'من أنا') {
          // تجميع التلميحات الإضافية في مصفوفة
          const extraCluesArray = [];
          if (row.extraClue1) extraCluesArray.push(row.extraClue1);
          if (row.extraClue2) extraCluesArray.push(row.extraClue2);
          if (row.extraClue3) extraCluesArray.push(row.extraClue3);
          if (row.extraClue4) extraCluesArray.push(row.extraClue4);
          if (row.extraClue5) extraCluesArray.push(row.extraClue5);
          if (row.extraClue6) extraCluesArray.push(row.extraClue6);
          
          if (extraCluesArray.length > 0) {
            questionData.extraClues = extraCluesArray;
          }
        }
        
        return questionData;
      });
      
      const createdQuestions = await storage.bulkCreateGameQuestions(questions);
      return res.status(201).json({ count: createdQuestions.length });
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid Excel data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to import questions" });
    }
  });

  // API routes for players
  app.get("/api/players", async (req, res) => {
    const players = await storage.getAllPlayers();
    return res.json(players);
  });

  app.post("/api/players", async (req, res) => {
    try {
      const player = insertPlayerSchema.parse(req.body);
      const createdPlayer = await storage.createPlayer(player);
      return res.status(201).json(createdPlayer);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid player data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create player" });
    }
  });

  app.patch("/api/players/:id/score", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    const { score } = req.body;
    if (typeof score !== 'number') {
      return res.status(400).json({ message: "Score must be a number" });
    }
    
    const updatedPlayer = await storage.updatePlayerScore(id, score);
    if (!updatedPlayer) {
      return res.status(404).json({ message: "Player not found" });
    }
    
    return res.json(updatedPlayer);
  });

  app.delete("/api/players/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    await storage.deletePlayer(id);
    return res.status(204).end();
  });

  app.post("/api/players/reset-scores", async (req, res) => {
    await storage.resetAllScores();
    return res.status(200).json({ message: "All scores reset" });
  });

  // API routes for penalties
  app.get("/api/penalties", async (req, res) => {
    const penalties = await storage.getAllPenalties();
    return res.json(penalties);
  });

  app.post("/api/penalties", async (req, res) => {
    try {
      const penalty = insertPenaltySchema.parse(req.body);
      const createdPenalty = await storage.createPenalty(penalty);
      return res.status(201).json(createdPenalty);
    } catch (error) {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ message: "Invalid penalty data", errors: error.errors });
      }
      return res.status(500).json({ message: "Failed to create penalty" });
    }
  });

  app.delete("/api/penalties/:id", async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid ID format" });
    }
    
    await storage.deletePenalty(id);
    return res.status(204).end();
  });

  app.delete("/api/penalties", async (req, res) => {
    await storage.deleteAllPenalties();
    return res.status(200).json({ message: "All penalties deleted" });
  });

  // Create HTTP server
  const httpServer = createServer(app);
  return httpServer;
}
