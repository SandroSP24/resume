import ScreenManager from './core/ScreenManager.js';
import SoundManager from './core/SoundManager.js';

// создаём и экспортируем один общий ScreenManager
export const screenManager = new ScreenManager();

// создаём и экспортируем один общий SoundManager
export const soundManager = new SoundManager();