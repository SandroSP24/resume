export default class SoundManager {
    constructor() {
        this.sounds = {};       // хранит все audio объекты
        this.volume = 50;       // громкость по умолчанию
        this.isMuted = false;   // звук включен
    }

    // Регистрируем аудио элемент
    register(id, element) {
        this.sounds[id] = element;
        this.sounds[id].volume = this.volume / 100;
    }

    // Воспроизвести звук
    play(id) {
        if (this.sounds[id] && !this.isMuted) {
            this.sounds[id].currentTime = 0;
            this.sounds[id].play().catch(() => { });
        }
    }

    // Поставить на паузу
    pause(id) {
        if (this.sounds[id]) this.sounds[id].pause();
    }

    // Останавливает звук и сбрасывает прогресс
    stop(id) {
        if (this.sounds[id]) {
            this.sounds[id].pause();
            this.sounds[id].currentTime = 0;
        }
    }

    // Включить/выключить звук
    toggleMute() {
        this.isMuted = !this.isMuted;
        Object.values(this.sounds).forEach(s => s.muted = this.isMuted);
    }

    // Установить громкость
    setVolume(vol) {
        this.volume = vol;
        Object.values(this.sounds).forEach(s => s.volume = this.volume / 100);
    }
}