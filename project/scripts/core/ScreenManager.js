export default class ScreenManager {
    constructor() {
        this.screens = {};
        this.activeScreen = null;
    }

    // Регистрируем экран
    register(name, element) {
        this.screens[name] = element;
    }

    // Возвращает имя активного экрана
    getActive() {
        return this.activeScreen;
    }

    // Проверяет, активен ли экран
    isActive(name) {
        return this.activeScreen === name;
    }

    // Переключает экран: если активен — скрывает, иначе показывает
    toggle(name) {
        if (this.isActive(name)) {
            this.hideAll();
        } else {
            this.show(name);
        }
    }

    // Показать экран
    show(name) {
        if (!this.screens[name]) {
            console.warn(`Экран "${name}" не зарегистрирован`);
            return;
        }

        if (this.activeScreen && this.screens[this.activeScreen]) {
            this.screens[this.activeScreen].classList.remove('active');
        }

        this.screens[name].classList.add('active');
        this.activeScreen = name;
    }

    // Показать оверлей (не деактивирует другие экраны)
    showOverlay(name) {
        if (!this.screens[name]) {
            console.warn(`Экран "${name}" не зарегистрирован`);
            return;
        }
        this.screens[name].classList.add('active');
    }

    // Скрыть оверлей (не деактивирует другие экраны)
    hideOverlay(name) {
        if (!this.screens[name]) {
            console.warn(`Экран "${name}" не зарегистрирован`);
            return;
        }
        this.screens[name].classList.remove('active');
    }

    // Скрыть все экраны
    hideAll() {
        Object.values(this.screens).forEach(screen => {
            screen.classList.remove('active');
        });
        this.activeScreen = null;
    }
}