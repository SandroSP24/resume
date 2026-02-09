import { screenManager, soundManager } from '../main.js';
import KnightsGame from '../game/KnightsGame.js';

document.addEventListener('DOMContentLoaded', async () => {

    // =====================================
    // 1) DOM Элементы
    // =====================================

    // --- меню ---
    const mainMenu = document.getElementById('mainMenu');
    const settingsScreen = document.getElementById('settingsScreen');
    const howToPlayScreen = document.getElementById('howToPlayScreen');

    // --- игра ---
    const gameContainer = document.getElementById('gameContainer');
    const gameCanvas = document.getElementById('gameCanvas');
    let gameInstance = null;

    // Динамически подгоняем canvas под окно
    function resizeGameCanvas() {
        gameCanvas.width = window.innerWidth;
        gameCanvas.height = window.innerHeight;

        // Проверяем, что игра уже создана и уведомляем её о resize
        if (gameInstance && typeof gameInstance.onResize === 'function') {
            gameInstance.onResize();
        }
    }

    // Вызываем один раз при загрузке
    resizeGameCanvas();

    // Добавляем обработчик на изменение размера окна
    window.addEventListener('resize', resizeGameCanvas);

    // --- overlay ---
    const pauseOverlay = document.getElementById('pauseOverlay');
    const gameOverOverlay = document.getElementById('gameOverOverlay');

    // --- кнопки ---
    const playBtn = document.getElementById('playBtn');
    const settingsBtn = document.getElementById('settingsBtn');
    const howToPlayBtn = document.getElementById('howToPlayBtn');

    const resumeBtn = document.getElementById('resumeBtn');
    const menuFromPauseBtn = document.getElementById('menuFromPauseBtn');
    const restartBtn = document.getElementById('restartBtn');
    const menuFromGameOverBtn = document.getElementById('menuFromGameOverBtn');

    const backBtns = document.querySelectorAll('#backBtn, #backBtn2');

    const leaderboardBtn = document.getElementById('leaderboardBtn'); // кнопка в главном меню
    const leaderboardScreen = document.getElementById('leaderboardScreen'); // экран рекордов
    const backFromLeaderboardBtn = document.getElementById('backFromLeaderboardBtn'); // кнопка назад из рекордов
    const topScoreDisplay = document.getElementById('topScore'); // куда будем вставлять топ-1
    const soundToggle = document.getElementById('soundToggle'); // кнопка звука

    // Регистрируем звуки
    soundManager.register('nature', document.getElementById('natureSound'));
    soundManager.register('game', document.getElementById('gameSound'));

    // Кнопка и слайдер
    const volumeSlider = document.getElementById('volumeSlider');
    const volumeValue = document.getElementById('volumeValue');

    // Первый клик — автозапуск звука
    document.addEventListener('click', function initSound() {
        soundManager.play('nature');
        if (soundToggle) {
            soundToggle.textContent = soundManager.isMuted ? translations.soundOff : translations.soundOn;
        }
        document.removeEventListener('click', initSound);
    }, { once: true });

    // Кнопка MUTE
    if (soundToggle) {
        soundToggle.addEventListener('click', () => {
            soundManager.toggleMute();
            if (soundToggle) {
                soundToggle.textContent = soundManager.isMuted ? translations.soundOff : translations.soundOn;
            }
        });
    }

    // Громкость
    if (volumeSlider && volumeValue) {
        volumeSlider.addEventListener('input', (e) => {
            const vol = e.target.value;
            volumeValue.textContent = vol;
            soundManager.setVolume(vol);
        });
    }

    // =====================================
    // 2) ScreenManager (регистрация экранов)
    // =====================================

    if (mainMenu && leaderboardScreen && settingsScreen && howToPlayScreen && pauseOverlay && gameOverOverlay && gameContainer && gameCanvas) {
        screenManager.register('main', mainMenu);
        screenManager.register('leaderboard', leaderboardScreen);
        screenManager.register('settings', settingsScreen);
        screenManager.register('howToPlay', howToPlayScreen);
        screenManager.register('game', gameContainer);
        screenManager.register('pause', pauseOverlay);
        screenManager.register('gameOver', gameOverOverlay);

        screenManager.show('main');
    } else {
        console.error('Ошибка: один из экранов не найден. Проверь ID элементов в index.html');
    }

    // =====================================
    // 3) Overlay функции
    // =====================================

    function showPause() {
        screenManager.show('pause');
    }

    function showGameOver() {
        screenManager.show('gameOver');
    }


    // =====================================
    // 4) Глобальные переменные
    // =====================================

    let gameStarted = false;
    let gamePaused = false;
    let gameOver = false;


    // =====================================
    // 5) Кнопки меню (включение/переходы)
    // =====================================

    if (playBtn) {
        playBtn.addEventListener('click', () => {
            // Настраиваем canvas на весь экран перед созданием игры
            gameCanvas.width = window.innerWidth;
            gameCanvas.height = window.innerHeight;
            // Создаём экземпляр игры
            gameInstance = new KnightsGame(gameCanvas, screenManager, soundManager);

            // Показываем игровой canvas
            screenManager.show('game');

            // Останавливаем фоновый звук меню и запускаем игровой
            soundManager.pause('nature');
            soundManager.play('game');

            // Запускаем игру
            gameInstance.start();
        });
    }

    if (settingsBtn) {
        settingsBtn.addEventListener('click', () => {
            screenManager.show('settings');
        });
    }

    if (howToPlayBtn) {
        howToPlayBtn.addEventListener('click', () => {
            screenManager.show('howToPlay');
        });
    }

    // Показ экрана Рекордов при клике
    if (leaderboardBtn) {
        leaderboardBtn.addEventListener('click', () => {
            screenManager.show('leaderboard'); // показываем экран Рекордов
            // Обновляем топ-1 из localStorage
            const topScore = localStorage.getItem('topScore') || 0;
            topScoreDisplay.textContent = `Топ-1: ${topScore}`;
        });
    }

    // Назад из экрана рекордов в главное меню
    if (backFromLeaderboardBtn) {
        backFromLeaderboardBtn.addEventListener('click', () => {
            screenManager.show('main'); // возвращаемся в главное меню
        });
    }

    // --- overlay: pause ---
    if (resumeBtn) {
        resumeBtn.addEventListener('click', () => {
            screenManager.hideOverlay('pause'); // скрываем паузовый оверлей
            gameInstance.resume();                // продолжаем игру
            gameStarted = true;                   // флаг процесса
        });
    }

    // В главное меню из паузы
    if (menuFromPauseBtn) {
        menuFromPauseBtn.addEventListener('click', () => {
            // Скрываем паузовый оверлей, затем останавливаем игру и возвращаемся в меню
            screenManager.hideOverlay('pause');
            gameInstance.stop();
            screenManager.show('main'); // главное меню
            gameStarted = false;         // останавливаем игру
        });
    }

    // В главное меню из Game Over
    if (menuFromGameOverBtn) {
        menuFromGameOverBtn.addEventListener('click', () => {
            screenManager.hideOverlay('gameOver');
            gameInstance.stop();
            screenManager.show('main'); // главное меню
            gameStarted = false;         // останавливаем игру
        });
    }

    // Перезапуск игры из Game Over
    if (restartBtn) {
        restartBtn.addEventListener('click', () => {
            screenManager.hideOverlay('gameOver');
            // Подгоняем canvas к окну
            gameCanvas.width = window.innerWidth;
            gameCanvas.height = window.innerHeight;
            // Создаём новую игру
            gameInstance = new KnightsGame(gameCanvas, screenManager, soundManager);
            // Показываем игровой экран и запускаем
            screenManager.show('game');
            gameInstance.start(); // теперь полностью сбрасываем игру
        });
    }

    // Назад из настроек или "Как играть"
    if (backBtns.length) {
        backBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                screenManager.show('main'); // главное меню
                gameStarted = false;         // останавливаем игру
            });
        });
    }


    // =====================================
    // 6) Старт игры
    // =====================================

    function startGame() {
        // Скрываем все экраны и overlay через ScreenManager
        screenManager.hideAll();

        // Показываем игровое поле (канвас) через ScreenManager
        screenManager.show('game');

        // Звуки через SoundManager
        soundManager.pause('nature'); // пока stop не реализован
        soundManager.play('game');

        // Флаг начала игры
        gameStarted = true;
        console.log('Игра запущена! volume:', soundManager.volume);
    }

    function updateTopScore(score) {
        const topScore = localStorage.getItem('topScore') || 0;
        if (score > topScore) {
            localStorage.setItem('topScore', score);
        }
    }

    if (gameCanvas) {
        // Клик по canvas теперь только для теста прыжка/действия игрока, не останавливаем игру
        gameCanvas.addEventListener('click', () => {
            if (gameInstance.isRunning) {
                // Например, можно добавить какой-то эффект, пока пусто
                console.log('Canvas clicked');
            }
        });
    }

    document.addEventListener('keydown', (e) => {
        if (e.code === 'Escape' && gameStarted) {
            showPause();
            gameStarted = false;
        }
    });

    document.addEventListener('keydown', e => {
        if (e.code === 'Space' && gameInstance.isRunning) {
            // Включаем флаг атаки
            gameInstance.playerAttacking = true;
        }
    });

    document.addEventListener('keyup', e => {
        if (e.code === 'Space') {
            // Выключаем флаг атаки
            gameInstance.playerAttacking = false;
        }
    });

    // ===============================
    // 7) Локализация (язык) через JSON
    // ===============================

    let translations = {}; // сюда загрузятся переводы

    // ТЕКУЩИЙ ЯЗЫК
    let currentLang = localStorage.getItem('gameLang') || 'ru';

    // ИНИЦИАЛИЗАЦИЯ ЯЗЫКА ПРИ ЗАГРУЗКЕ
    await setLanguage(currentLang);

    // функция загрузки JSON
    async function loadTranslations(lang) {
        const res = await fetch(`translations/${lang}.json`);
        // ВАЖНО: если файл не найден, res.ok будет false
        if (!res.ok) {
            console.error(`Перевод не найден: ${lang}.json (status ${res.status})`);
            return {};
        }
        return await res.json();
    }

    // функция установки языка
    async function setLanguage(lang) {
        currentLang = lang;
        localStorage.setItem('gameLang', lang);
        translations = await loadTranslations(lang);
        // если перевод пустой — не обновляем, чтобы не получить ошибку
        if (!translations || Object.keys(translations).length === 0) return;

        // обновляем тексты
        document.querySelector('h1').textContent = translations.title;
        document.getElementById('playBtn').textContent = translations.play;
        document.getElementById('settingsBtn').textContent = translations.settings;
        document.getElementById('howToPlayBtn').textContent = translations.howToPlay;

        if (leaderboardBtn) leaderboardBtn.textContent = translations.leaderboard;
        if (soundToggle) soundToggle.textContent = soundManager.isMuted ? translations.soundOff : translations.soundOn;

        document.querySelector('#backBtn').textContent = translations.back;
        document.querySelector('#backBtn2').textContent = translations.back;

        document.querySelector('#settingsScreen h2').textContent = translations.settings;
        document.querySelector('#howToPlayScreen h2').textContent = translations.howToPlay;
        document.querySelector('.slider-container label').textContent = translations.volume + ':';
        document.querySelector('.language-container label').textContent = translations.language + ':';

        const instructions = document.querySelector('.instructions');
        instructions.innerHTML = translations.instructions.map(text => `<p>${text}</p>`).join('');

        // overlay
        document.querySelector('#pauseOverlay h2').textContent = translations.pause;
        document.getElementById('resumeBtn').textContent = translations.resume;
        document.getElementById('menuFromPauseBtn').textContent = translations.menu;

        document.querySelector('#gameOverOverlay h2').textContent = translations.gameOver;
        document.getElementById('restartBtn').textContent = translations.restart;
        document.getElementById('menuFromGameOverBtn').textContent = translations.menu;
    }

    // ОБРАБОТЧИК ВЫБОРА ЯЗЫКА
    document.getElementById('languageSelect').value = currentLang;
    document.getElementById('languageSelect').addEventListener('change', (e) => {
        setLanguage(e.target.value);
    });

});
