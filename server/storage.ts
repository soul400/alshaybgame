import { 
  type GameCategory, type InsertGameCategory,
  type GameQuestion, type InsertGameQuestion,
  type Player, type InsertPlayer,
  type Penalty, type InsertPenalty,
  type Setting, type InsertSetting
} from "@shared/schema";

// Storage interface for all CRUD operations
export interface IStorage {
  // Game Categories
  getAllGameCategories(): Promise<GameCategory[]>;
  getGameCategory(id: number): Promise<GameCategory | undefined>;
  createGameCategory(category: InsertGameCategory): Promise<GameCategory>;
  
  // Game Questions
  getAllGameQuestions(): Promise<GameQuestion[]>;
  getGameQuestionsByCategoryId(categoryId: number): Promise<GameQuestion[]>;
  getGameQuestion(id: number): Promise<GameQuestion | undefined>;
  createGameQuestion(question: InsertGameQuestion): Promise<GameQuestion>;
  bulkCreateGameQuestions(questions: InsertGameQuestion[]): Promise<GameQuestion[]>;
  deleteAllGameQuestions(): Promise<void>;
  
  // Players
  getAllPlayers(): Promise<Player[]>;
  getPlayer(id: number): Promise<Player | undefined>;
  createPlayer(player: InsertPlayer): Promise<Player>;
  updatePlayerScore(id: number, score: number): Promise<Player | undefined>;
  deletePlayer(id: number): Promise<void>;
  resetAllScores(): Promise<void>;
  
  // Penalties
  getAllPenalties(): Promise<Penalty[]>;
  getPenalty(id: number): Promise<Penalty | undefined>;
  createPenalty(penalty: InsertPenalty): Promise<Penalty>;
  deletePenalty(id: number): Promise<void>;
  deleteAllPenalties(): Promise<void>;
  
  // Settings
  getSetting(key: string): Promise<Setting | undefined>;
  createOrUpdateSetting(key: string, value: string): Promise<Setting>;
}

export class MemStorage implements IStorage {
  private gameCategories: Map<number, GameCategory>;
  private gameQuestions: Map<number, GameQuestion>;
  private players: Map<number, Player>;
  private penalties: Map<number, Penalty>;
  private settings: Map<string, Setting>;
  private currentCategoryId: number;
  private currentQuestionId: number;
  private currentPlayerId: number;
  private currentPenaltyId: number;
  private currentSettingId: number;

  constructor() {
    this.gameCategories = new Map();
    this.gameQuestions = new Map();
    this.players = new Map();
    this.penalties = new Map();
    this.settings = new Map();
    this.currentCategoryId = 1;
    this.currentQuestionId = 1;
    this.currentPlayerId = 1;
    this.currentPenaltyId = 1;
    this.currentSettingId = 1;
    
    // Initialize with default game categories
    this.initializeDefaultGameCategories();
  }

  private initializeDefaultGameCategories() {
    const defaultCategories: InsertGameCategory[] = [
      { name: 'بحر حرب', icon: 'fa-water', description: 'عكس الكلمات بنفس الحروف' },
      { name: 'تنقيص حرف', icon: 'fa-minus-circle', description: 'اكتشف الكلمة مع نقص حرف' },
      { name: 'متلازمة', icon: 'fa-link', description: 'اربط بين الكلمات المتلازمة' },
      { name: 'بتر أطراف', icon: 'fa-cut', description: 'كلمات مع حذف أطرافها' },
      { name: 'نادل حمام', icon: 'fa-bath', description: 'إيجاد الكلمات مع تغيير حرف من كل كلمة' },
      { name: 'معادلة', icon: 'fa-equals', description: 'حل المعادلات اللغوية' },
      { name: 'بحر بحر', icon: 'fa-water', description: 'إيجاد الكلمات نفس الحروف والترتيب' },
      { name: 'تخمين أسماء', icon: 'fa-user-tag', description: 'خمن الأسماء من التلميحات' },
    ];
    
    defaultCategories.forEach(category => {
      this.createGameCategory(category);
    });
  }

  // Game Categories
  async getAllGameCategories(): Promise<GameCategory[]> {
    return Array.from(this.gameCategories.values());
  }

  async getGameCategory(id: number): Promise<GameCategory | undefined> {
    return this.gameCategories.get(id);
  }

  async createGameCategory(category: InsertGameCategory): Promise<GameCategory> {
    const id = this.currentCategoryId++;
    const newCategory: GameCategory = { ...category, id };
    this.gameCategories.set(id, newCategory);
    return newCategory;
  }

  // Game Questions
  async getAllGameQuestions(): Promise<GameQuestion[]> {
    return Array.from(this.gameQuestions.values());
  }

  async getGameQuestionsByCategoryId(categoryId: number): Promise<GameQuestion[]> {
    return Array.from(this.gameQuestions.values()).filter(
      question => question.categoryId === categoryId
    );
  }

  async getGameQuestion(id: number): Promise<GameQuestion | undefined> {
    return this.gameQuestions.get(id);
  }

  async createGameQuestion(question: InsertGameQuestion): Promise<GameQuestion> {
    const id = this.currentQuestionId++;
    const newQuestion: GameQuestion = { ...question, id };
    this.gameQuestions.set(id, newQuestion);
    return newQuestion;
  }

  async bulkCreateGameQuestions(questions: InsertGameQuestion[]): Promise<GameQuestion[]> {
    const createdQuestions: GameQuestion[] = [];
    for (const question of questions) {
      const createdQuestion = await this.createGameQuestion(question);
      createdQuestions.push(createdQuestion);
    }
    return createdQuestions;
  }

  async deleteAllGameQuestions(): Promise<void> {
    this.gameQuestions.clear();
    this.currentQuestionId = 1;
  }

  // Players
  async getAllPlayers(): Promise<Player[]> {
    return Array.from(this.players.values());
  }

  async getPlayer(id: number): Promise<Player | undefined> {
    return this.players.get(id);
  }

  async createPlayer(player: InsertPlayer): Promise<Player> {
    const id = this.currentPlayerId++;
    const newPlayer: Player = { ...player, id };
    this.players.set(id, newPlayer);
    return newPlayer;
  }

  async updatePlayerScore(id: number, score: number): Promise<Player | undefined> {
    const player = this.players.get(id);
    if (player) {
      const updatedPlayer = { ...player, score };
      this.players.set(id, updatedPlayer);
      return updatedPlayer;
    }
    return undefined;
  }

  async deletePlayer(id: number): Promise<void> {
    this.players.delete(id);
  }

  async resetAllScores(): Promise<void> {
    for (const [id, player] of this.players.entries()) {
      this.players.set(id, { ...player, score: 0 });
    }
  }

  // Penalties
  async getAllPenalties(): Promise<Penalty[]> {
    return Array.from(this.penalties.values());
  }

  async getPenalty(id: number): Promise<Penalty | undefined> {
    return this.penalties.get(id);
  }

  async createPenalty(penalty: InsertPenalty): Promise<Penalty> {
    const id = this.currentPenaltyId++;
    const newPenalty: Penalty = { ...penalty, id };
    this.penalties.set(id, newPenalty);
    return newPenalty;
  }

  async deletePenalty(id: number): Promise<void> {
    this.penalties.delete(id);
  }

  async deleteAllPenalties(): Promise<void> {
    this.penalties.clear();
    this.currentPenaltyId = 1;
  }

  // Settings
  async getSetting(key: string): Promise<Setting | undefined> {
    return this.settings.get(key);
  }

  async createOrUpdateSetting(key: string, value: string): Promise<Setting> {
    const existingSetting = this.settings.get(key);
    if (existingSetting) {
      const updatedSetting = { ...existingSetting, value };
      this.settings.set(key, updatedSetting);
      return updatedSetting;
    } else {
      const id = this.currentSettingId++;
      const newSetting: Setting = { id, key, value };
      this.settings.set(key, newSetting);
      return newSetting;
    }
  }
}

export const storage = new MemStorage();
