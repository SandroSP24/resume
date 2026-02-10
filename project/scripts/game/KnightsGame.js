export default class KnightsGame {
    constructor(canvas, screenManager, soundManager, spawnLinePercent = 0.8871527777777778) {
        this.canvas = canvas;
        this.c = canvas.getContext('2d');
        this.screenManager = screenManager;
        this.soundManager = soundManager;
        this.spawnLinePercent = spawnLinePercent;

        // Загрузка изображений
        this.background = new Image();
        this.floor = new Image();
        this.playerRight = new Image();
        this.playerLeft = new Image();
        this.hp = new Image();
        this.sword = new Image();

        this.background.src = "assets/images/background.png";
        this.floor.src = "assets/images/floor.png";
        this.playerRight.src = "assets/images/2right.png";
        this.playerLeft.src = "assets/images/2left.png";
        this.hp.src = "assets/images/health.png";
        this.sword.src = "assets/images/sword.png";

        // Переменные состояния игры
        this.paused = true;
        this.skins = ["31"];
        this.playerSpeed = 3;
        this.jumpSpeed = 3;
        this.playerDir = 1;
        this.isMove = false;
        this.xAnim = 0;
        this.yAnim = 0;
        this.isAttack = false;
        this.isBlock = false;
        this.isJump = false;
        this.isFall = false;
        this.jumpHeight = 0;
        this.isTakenDamage = false;
        this.damageDir = 0;
        this.playerDamage = 2;
        this.playerDied = false;
        this.playerScore = 0;
        this.playerHealth = 100;
        this.playerDiedAnim = false;
        this.maxHealth = 100;
        this.typeMove = "run";

        this.defalutE = {
            health: 5,
            damage: 1
        };

        this.sprites = {
            right: this.playerRight,
            left: this.playerLeft
        };

        this.playerSize = 64 * 5;
        this.playerPosition = {
            x: canvas.width / 2 - this.playerSize / 2,
            y: canvas.height / 2
        };

        this.anim = {
            step: 5,
            timer: 0
        };

        this.frameWalk = {
            val: 0,
            max: 7
        };

        this.frameIdle = {
            val: 0,
            max: 4
        };

        this.frameAttack = {
            val: 0,
            max: 2
        };

        this.frameJump = {
            val: 0,
            max: 2
        };

        this.frameFall = {
            val: 0
        };

        this.frameDamage = {
            val: 0,
            max: 5
        };

        this.frameDie = {
            val: 0,
            max: 3
        };

        this.swordSize = 32;

        // Линия спавна (универсальная линия для всех мобов)
        // Процент от высоты холста (по умолчанию соответствует original newGame: 511/576)
        this.groundLevel = Math.floor(this.canvas.height * this.spawnLinePercent);

        // Инициализация переменных врагов и боссов
        this.enemies = [
            new Enemy(this, { x: -this.playerSize, y: this.groundLevel - this.playerSize * 3 / 4 }, 1),
            new Enemy(this, { x: this.canvas.width, y: this.groundLevel - this.playerSize * 3 / 4 }, 2)
        ];

        // Создание боссов
        this.minotaur = new Minotaur(this, { x: 0, y: this.groundLevel }, 1);

        this.boss = new Boss(this, { x: -this.playerSize, y: this.groundLevel - this.playerSize * 3 / 4 }, 1);
        this.bossNoWeapon = new Boss(this, { x: this.canvas.width, y: this.groundLevel - this.playerSize * 3 / 4 }, 1);
        this.boss2 = new Boss(this, { x: this.canvas.width, y: this.groundLevel - this.playerSize * 3 / 4 }, 1);
        this.bossNoWeapon2 = new Boss(this, { x: this.canvas.width, y: this.groundLevel - this.playerSize * 3 / 4 }, 1);

        this.boss.set("assets/images/axe", 4, 60, 2, 0.7, 100, 10, 3, 'easy');
        this.boss2.set("assets/images/axe", 4, 60, 2, 0.7, 100, 10, 3, 'easy2');
        this.bossNoWeapon.set("assets/images/no weapon1", 5, 20, 1, 0.8, 200, 10, 10, 'normal', "assets/images/22");
        this.bossNoWeapon.useJumpAtack = true;
        this.bossNoWeapon2.set("assets/images/no weapon1", 5, 20, 2, 0.8, 200, 10, 10, 'normal2', "assets/images/22");
        this.bossNoWeapon2.useJumpAtack = true;

        this.actions = {
            'easy': () => {
                this.paused = true;
                this.drawWindowParameters.fullString = "Уровень повышен! Скорость увеличена до 4, атака - до 3, здоровье восстановлено. НАЖМИТЕ НА ПРОБЕЛ ЧТОБЫ ПРОДОЛЖИТЬ";
                this.drawWindowParameters.val = 0;
                this.drawWindowParameters.index = 0;
                this.drawWindowParameters.drawn = "";
                this.playerSpeed = 4;
                this.playerHealth = this.maxHealth;
                this.playerDamage = 3;
                this.skins.push("32");
            },
            'normal': () => {
                this.paused = true;
                this.drawWindowParameters.fullString = "Уровень повышен! Атака увеличена до 5, максимальное здоровье увеличено, здоровье восстановлено. НАЖМИТЕ НА ПРОБЕЛ ЧТОБЫ ПРОДОЛЖИТЬ";
                this.drawWindowParameters.val = 0;
                this.drawWindowParameters.index = 0;
                this.drawWindowParameters.drawn = "";
                this.playerSpeed = 4;
                this.maxHealth = 150;
                this.playerHealth = this.maxHealth;
                this.playerDamage = 5;
                this.skins.push("31");
            },
            'easy2': () => {
                this.paused = true;
                this.drawWindowParameters.fullString = "Уровень повышен! Скорость увеличена до 5, максимальное здоровье увеличено, здоровье восстановлено. НАЖМИТЕ НА ПРОБЕЛ ЧТОБЫ ПРОДОЛЖИТЬ";
                this.drawWindowParameters.val = 0;
                this.drawWindowParameters.index = 0;
                this.drawWindowParameters.drawn = "";
                this.playerSpeed = 5;
                this.maxHealth = 180;
                this.playerHealth = this.maxHealth;
                this.skins.push("1");
            },
            'normal2': () => {
                this.paused = true;
                this.drawWindowParameters.fullString = "Уровень повышен! Атака увеличена до 7, здоровье восстановлено. НАЖМИТЕ НА ПРОБЕЛ ЧТОБЫ ПРОДОЛЖИТЬ";
                this.drawWindowParameters.val = 0;
                this.drawWindowParameters.index = 0;
                this.drawWindowParameters.drawn = "";
                this.playerDamage = 7;
                this.playerHealth = this.maxHealth;
                this.skins.push("22");
            }
        };

        this.bosses = [
            { obj: this.boss, isSpawned: false, onScore: 10 },
            { obj: this.bossNoWeapon, isSpawned: false, onScore: 20 },
            { obj: this.boss2, isSpawned: false, onScore: 30 },
            { obj: this.bossNoWeapon2, isSpawned: false, onScore: 40 }
        ];

        this.paddingWindow = 30;
        this.widthBorder = 5;
        this.drawWindowParameters = {
            drawn: "",
            fullString: "Для передвижения используй A D, для прыжка - пробел, для атаки - E, для блока удерживай F. Чтобы продолжить, нажми пробел...",
            index: 0,
            frequency: 4,
            val: 0
        };

        this.countInString = Math.floor((canvas.width * 2 / 3 - 20) / 12);

        // Переменные для спавна
        this.spawnIntervals = [];
        this.x1 = 0;
        this.x2 = 0;
        this.audioPlayed = false;
        this.animationFrameId = null;

        // Слушатели клавиш
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleKeyUp = this.handleKeyUp.bind(this);
    }

    handleKeyDown(e) {
        // ESC для паузы
        if (e.key === 'Escape' && !this.playerDied && !this.paused) {
            this.pause();
            this.screenManager.showOverlay('pause');
            return;
        }

        // ✅ НОВОЕ: снятие паузы по пробелу после босса
        if (this.paused && !this.playerDied && e.key === ' ') {
            this.paused = false;
            return;
        }

        if (!this.playerDied) {
            switch (e.key.toLowerCase()) {
                case 'a':
                case "ф":
                    this.playerDir = -1;
                    this.isMove = true;
                    this.typeMove = "run";
                    break;
                case 'd':
                case 'в':
                    this.playerDir = 1;
                    this.isMove = true;
                    this.typeMove = "run";
                    break;
                case 'e':
                case 'у':
                    this.isAttack = true;
                    break;
                case 'f':
                case 'а':
                    this.isBlock = true;
                    break;
                case ' ':
                    if (!this.isFall && !this.isJump) {
                        this.isJump = true;
                        this.jumpHeight = 0;
                    }
                    break;
            }
        }
    }

    handleKeyUp(e) {
        if (!this.playerDied) {
            switch (e.key.toLowerCase()) {
                case 'a':
                case "ф":
                    if (this.playerDir == -1)
                        this.isMove = false;
                    break;
                case 'd':
                case 'в':
                    if (this.playerDir == 1)
                        this.isMove = false;
                    break;
                case 'f':
                case 'а':
                    this.isBlock = false;
                    break;
            }
        }
    }

    atackCheck(e) {
        const result = (this.x1 > e.position.x + e.size / 2 - e.realSize / 2 && this.x1 < e.position.x + e.size / 2 + e.realSize / 2) ||
            (this.x2 > e.position.x + e.size / 2 - e.realSize / 2 && this.x2 < e.position.x + e.size / 2 + e.realSize / 2) ||
            (this.x1 < e.position.x + e.size / 2 - e.realSize / 2 && this.x2 > e.position.x + e.size / 2 + e.realSize / 2);
        return result;
    }

    drawWindow() {
        const preS = this.c.fillStyle;
        this.c.fillStyle = 'white';
        this.c.fillRect(this.canvas.width / 6 - this.widthBorder, this.canvas.height * 3 / 4 - this.paddingWindow - this.widthBorder,
            this.canvas.width * 2 / 3 + this.widthBorder * 2, this.canvas.height / 4 + this.widthBorder * 2);
        this.c.fillStyle = 'black';
        this.c.fillRect(this.canvas.width / 6, this.canvas.height * 3 / 4 - this.paddingWindow,
            this.canvas.width * 2 / 3, this.canvas.height / 4);
        this.c.fillStyle = 'white';
        this.c.font = "20px pixel font";
        this.drawWindowParameters.drawn = this.drawWindowParameters.fullString.substring(0, this.drawWindowParameters.index);
        this.drawWindowParameters.val++;
        if (this.drawWindowParameters.val == this.drawWindowParameters.frequency) {
            this.drawWindowParameters.val = 0;
            if (this.drawWindowParameters.index < this.drawWindowParameters.fullString.length)
                this.drawWindowParameters.index++;
        }
        var py = 0;
        for (var i = 0; i < this.drawWindowParameters.drawn.length; i += this.countInString) {
            this.c.fillText(this.drawWindowParameters.drawn.substring(i, this.countInString + i),
                this.canvas.width / 6 + 10, this.canvas.height * 3 / 4 - this.paddingWindow + 20 + py * 30);
            py++;
        }
        this.c.fillStyle = preS;
    }

    animate = () => {
        this.animationFrameId = requestAnimationFrame(this.animate);

        this.c.drawImage(this.background, 0, 0, this.background.width, this.background.height, 0, 0, this.canvas.width, this.canvas.height);

        // Рисуем платформу (floor)
        this.c.drawImage(this.floor, 0, 0, this.floor.width, this.floor.height, 0, this.groundLevel, this.canvas.width, this.playerSize * 3 / 4);

        if (this.playerDir == 1) {
            this.x1 = this.playerPosition.x + this.playerSize / 2;
            this.x2 = this.playerPosition.x + this.playerSize;
        }
        if (this.playerDir == -1) {
            this.x1 = this.playerPosition.x;
            this.x2 = this.playerPosition.x + this.playerSize / 2;
        }

        if (!this.playerDiedAnim && !this.paused) {
            if (this.isMove && !this.isBlock) {
                this.playerPosition.x += this.playerSpeed * this.playerDir;
                if (this.playerPosition.x < 0) this.playerPosition.x = 0;
                if (this.playerPosition.x > this.canvas.width - this.playerSize) this.playerPosition.x = this.canvas.width - this.playerSize;
                if (this.typeMove == "run" && !this.isJump && !this.isFall) {
                    if (this.frameWalk.val > this.frameWalk.max) this.frameWalk.val = 0;
                    else if (this.anim.timer % this.anim.step == 0) this.frameWalk.val++;
                    this.xAnim = (5 + this.frameWalk.val) % 7;
                    this.yAnim = Math.floor((5 + this.frameWalk.val) / 7);
                    this.anim.timer++;
                }
            }

            // Проверяем находится ли игрок на платформе (враге) — только если игрок ПАДАЕТ
            let onPlatform = false;
            if (this.isFall) {
                for (let i = 0; i < this.enemies.length; i++) {
                    const e = this.enemies[i];
                    if (e.died) continue;
                    // Проверяем по горизонтали: центр игрока должен находиться над центральной частью врага
                    const playerCenterX = this.playerPosition.x + this.playerSize / 2;
                    const enemyCentralStart = e.position.x + e.size * 0.2;
                    const enemyCentralEnd = e.position.x + e.size * 0.8;
                    if (playerCenterX >= enemyCentralStart && playerCenterX <= enemyCentralEnd) {
                        const playerBottom = this.playerPosition.y + this.playerSize;
                        // Реальная поверхность у врага (основание) — приблизительно на уровне пола (groundLevel).
                        const platformTop = e.position.y + this.playerSize * 3 / 4;
                        const tolerance = 12;
                        if (playerBottom >= platformTop - tolerance && playerBottom <= platformTop + tolerance) {
                            onPlatform = true;
                            // позиционируем игрока так, чтобы его верх совпал с рассчитанной позицией (выравнивание по игровой логике)
                            this.playerPosition.y = platformTop - this.playerSize * 3 / 4;
                            this.isFall = false;
                            this.isJump = false;
                            break;
                        }
                    }
                }
            }
            // Если не на платформе и выше уровня земли — начинаем падать
            const groundY = this.groundLevel - this.playerSize * 3 / 4;
            if (!onPlatform && this.playerPosition.y < groundY && !this.isJump && !this.isFall) {
                this.isFall = true;
            }
            if (this.isAttack) {
                if (this.frameAttack.val > this.frameAttack.max) {
                    this.frameAttack.val = 0;
                    this.isAttack = false;
                }
                else if (this.anim.timer % this.anim.step == 0) this.frameAttack.val++;
                this.xAnim = (5 + this.frameAttack.val) % 7;
                this.yAnim = Math.floor((5 + this.frameAttack.val) / 7) + 2;
                this.anim.timer++;
            }
            if (this.isBlock) {
                this.xAnim = 6;
                this.yAnim = 3;
            }
            if (this.isJump && !this.isFall) {
                if (this.frameJump.val > this.frameJump.max) {
                    this.frameJump.val = 0;
                    this.isJump = false;
                    this.isFall = true;
                }
                else if (this.anim.timer % (this.anim.step * 2) == 0) this.frameJump.val++;
                this.xAnim = (6 + this.frameJump.val) % 7;
                this.yAnim = Math.floor((6 + this.frameJump.val) / 7) + 1;
                this.anim.timer++;
                this.playerPosition.y -= this.jumpSpeed * 3;
                this.jumpHeight++;
            } else if (this.isFall) {
                this.xAnim = 2;
                this.yAnim = 2;
                this.frameFall.val++;
                this.playerPosition.y += this.jumpSpeed * 3;

                // Проверяем достиг ли земли или платформы
                const groundY = this.groundLevel - this.playerSize * 3 / 4;
                if (this.playerPosition.y >= groundY) {
                    this.playerPosition.y = groundY;
                    this.isFall = false;
                    this.frameFall.val = 0;
                }
            }
            if (!this.isMove && !this.isAttack && !this.isBlock && !this.isJump && !this.isFall) {
                if (this.frameIdle.val > this.frameIdle.max) this.frameIdle.val = 0;
                else if (this.anim.timer % this.anim.step == 0) this.frameIdle.val++;
                this.xAnim = this.frameIdle.val;
                this.yAnim = 0;
                this.anim.timer++;
            }
        }

        // ✅ БЕЗОПАСНЫЙ ЦИКЛ ДЛЯ УДАЛЕНИЯ ВРАГОВ
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const e = this.enemies[i];
            e.draw();

            if (this.paused) continue;

            if (e.name == "minotaur") {
                if (e.cooldownAtack.val == e.cooldownAtack.max) {
                    let dmg = e.damage[e.attackIndex]; // Теперь безопасно!
                    if (!this.isJump && !this.isFall && ((this.isBlock && this.playerDir == e.dir) || (!this.isBlock))) {
                        this.isTakenDamage = true;
                        this.damageDir = e.dir;
                        this.playerHealth -= dmg;
                        if (this.playerHealth <= 0) { this.playerDied = true; }
                    }
                }
                if (this.atackCheck(e) && this.isAttack && !(e.position.x + e.size / 2 < this.playerPosition.x || e.position.x + e.size / 12 > this.playerPosition.x + this.playerSize / 2)) {
                    e.keyframes[e.frames.damage.value[Math.floor(Math.random() * e.frames.damage.value.length)]].is = true;
                    e.damageDir = -e.dir;
                    e.takeDamage.v = e.takeDamage.max;
                    e.health -= this.playerDamage;
                }
                if (e.died) {
                    this.enemies.splice(i, 1);
                    this.playerScore += 2;
                    this.defalutE.damage = Math.floor(this.playerScore / 10) + 1;
                    this.defalutE.health = Math.floor(this.playerScore / 10) * 2 + 1;
                    this.bosses.forEach(b => {
                        if (b.onScore == this.playerScore && !b.isSpawned) {
                            this.enemies.push(b.obj);
                            b.isSpawned = true;
                        }
                    });
                }
            } else {
                if (e.isAttack && this.playerPosition.y + this.playerSize >= e.position.y + e.size && ((this.isBlock && this.playerDir == e.dir) || (!this.isBlock))) {
                    this.isTakenDamage = true;
                    this.damageDir = e.dir;
                    this.playerHealth -= e.damage;
                    if (this.playerHealth <= 0) { this.playerDied = true; }
                    if (this.isJump) { this.isJump = false; this.isFall = true; }
                }
                if (this.atackCheck(e) && this.isAttack && !this.isBlock && e.near && !e.died && e.health > 0 && this.playerPosition.y + this.playerSize >= e.position.y + e.size) {
                    if (Math.random() < e.chanceDodge) {
                        e.isShield = true;
                        e.isAttack = false;
                        e.frameAttack.val = 0;
                    }
                    if (!e.isShield) {
                        e.isTakenDamage = true;
                        e.damageDir = -e.dir;
                        e.health -= this.playerDamage;
                    }
                }
                if (e.died) {
                    if (e.name != "enemy") {
                        this.actions[e.name]();
                    }
                    this.enemies.splice(i, 1); // ✅ Безопасное удаление
                    this.playerScore++;
                    this.defalutE.damage = Math.floor(this.playerScore / 10) + 1;
                    this.defalutE.health = Math.floor(this.playerScore / 10) * 2 + 1;
                    this.bosses.forEach(b => {
                        if (b.onScore <= this.playerScore && !b.isSpawned) {
                            this.enemies.push(b.obj);
                            b.isSpawned = true;
                        }
                    });
                    // ✅ ПРОВЕРКА ПОБЕДЫ
                    const allBossesSpawned = this.bosses.every(boss => boss.isSpawned);
                    const noBossesAlive = this.bosses.every(boss => !this.enemies.includes(boss.obj));
                    if (allBossesSpawned && noBossesAlive) {
                        this.handleVictory();
                    }
                }
            }
        }

        if (!this.playerDiedAnim) {
            if (this.isTakenDamage && !this.playerDied) {
                this.frameAttack.val = 0;
                this.isAttack = false;
                if (this.frameDamage.val > this.frameDamage.max) {
                    this.frameDamage.val = 0;
                    this.isTakenDamage = false;
                } else if (this.anim.timer % this.anim.step == 0) this.frameDamage.val++;
                this.xAnim = 1;
                this.yAnim = 3;
                this.anim.timer++;
                this.playerPosition.x += this.damageDir;
                if (this.playerPosition.x < 0) this.playerPosition.x = 0;
                if (this.playerPosition.x > this.canvas.width - this.playerSize) this.playerPosition.x = this.canvas.width - this.playerSize;
            }
        }

        if (this.playerDied && !this.playerDiedAnim) {
            if (this.frameDie.val > this.frameDie.max) {
                this.playerDiedAnim = true;
                // Сохраняем рекорд
                const topScore = localStorage.getItem('topScore') || 0;
                if (this.playerScore > topScore) {
                    localStorage.setItem('topScore', this.playerScore);
                }
                // ✅ Останавливаем музыку игры
                this.soundManager.pause('game');
                // Показываем Game Over
                if (this.animationFrameId) {
                    cancelAnimationFrame(this.animationFrameId);
                }
                this.screenManager.showOverlay('gameOver');
                setTimeout(() => {
                    this.stop();
                }, 100);
            } else if (this.anim.timer % this.anim.step == 0) this.frameDie.val++;
            this.xAnim = 1 + this.frameDie.val;
            this.yAnim = 3;
            this.anim.timer++;
        }

        if (this.playerDiedAnim) {
            this.xAnim = 4;
            this.yAnim = 3;
        }

        if (this.playerDir == 1) {
            this.c.drawImage(this.sprites.right, this.xAnim * this.playerSize, this.yAnim * this.playerSize, this.playerSize, this.playerSize,
                this.playerPosition.x, this.playerPosition.y, this.playerSize, this.playerSize);
        }
        if (this.playerDir == -1) {
            this.c.drawImage(this.sprites.left, (6 - this.xAnim) * this.playerSize, this.yAnim * this.playerSize, this.playerSize, this.playerSize,
                this.playerPosition.x, this.playerPosition.y, this.playerSize, this.playerSize);
        }

        // UI
        this.c.drawImage(this.hp, 0, 0, 1, 1, 10, 10, this.maxHealth * this.canvas.width / 500 * this.maxHealth / 100, this.hp.height * 3);
        if (this.playerHealth > 0)
            this.c.drawImage(this.hp, 0, 0, this.hp.width, this.hp.height, 10, 10, this.playerHealth * this.canvas.width / 500 * this.maxHealth / 100, this.hp.height * 3);

        this.c.font = "bold 30px pixel font";
        this.c.fillText(this.playerScore.toString(), 10, this.hp.height * 3 + 40);
        // Рисуем меч только если он загружен
        if (this.sword.complete && this.sword.naturalWidth !== 0) {
            this.c.drawImage(this.sword, 0, 0, this.sword.width, this.sword.height, 10, 60 + this.hp.height * 3, this.swordSize, this.swordSize);
        }

        this.c.font = "25px pixel font";
        this.c.fillText("атака: " + this.playerDamage.toString(), 20 + this.swordSize, 85 + this.hp.height * 3);
        this.c.fillText("скорость: " + this.playerSpeed.toString(), 10, 130 + this.hp.height * 3);
        this.c.fillText("max hp: " + this.maxHealth.toString(), 10, 175 + this.hp.height * 3);

        if (this.paused) {
            this.drawWindow();
        }
    }

    start() {
        this.audioPlayed = false;
        // Start standing on the ground (prevent initial tiny jump)
        this.isJump = false;
        this.jumpHeight = 0;

        // Ставим игрока на землю (выравниваем с мобами)
        this.playerPosition.y = this.groundLevel - this.playerSize * 3 / 4;

        // Сразу начинаем без паузы
        this.paused = false;

        window.addEventListener("keydown", this.handleKeyDown);
        window.addEventListener("keyup", this.handleKeyUp);

        // Спавн врагов
        this.spawnIntervals.push(
            setInterval(() => {
                if (!this.paused)
                    this.enemies.push(new Enemy(this, { x: -this.playerSize, y: this.groundLevel - this.playerSize * 3 / 4 }, 1));
            }, 3000)  // ускорено для теста
        );

        this.spawnIntervals.push(
            setInterval(() => {
                if (!this.paused)
                    this.enemies.push(new Enemy(this, { x: this.canvas.width, y: this.groundLevel - this.playerSize * 3 / 4 }, 1));
            }, 2000)  // ускорено для теста
        );

        this.spawnIntervals.push(
            setInterval(() => {
                if (!this.paused)
                    this.enemies.push(new Enemy(this, { x: -this.playerSize, y: this.groundLevel - this.playerSize * 3 / 4 }, 2));
            }, 8000)  // ускорено для теста
        );

        this.spawnIntervals.push(
            setInterval(() => {
                if (!this.paused)
                    this.enemies.push(new Minotaur(this, { x: -400, y: this.groundLevel }, 1));
            }, 15000)  // ускорено для теста
        );

        this.spawnIntervals.push(
            setInterval(() => {
                if (!this.paused)
                    this.enemies.push(new Minotaur(this, { x: -400, y: this.groundLevel }, 2));
            }, 45000)  // ускорено для теста
        );

        this.spawnIntervals.push(
            setInterval(() => {
                if (!this.paused)
                    this.enemies.push(new Minotaur(this, { x: this.canvas.width, y: this.groundLevel }, 1));
            }, 20000)  // ускорено для теста
        );

        this.animate();
    }

    // Обновление размеров и пересчёт линии спавна
    onResize() {
        // canvas уже обновлён извне (DOM), пересчитываем параметры
        this.groundLevel = Math.floor(this.canvas.height * this.spawnLinePercent);
        // Поставим игрока на новую линию
        this.playerPosition.y = this.groundLevel - this.playerSize * 3 / 4;
        // Обновим уже существующих врагов
        if (this.enemies && this.enemies.length) {
            this.enemies.forEach(e => {
                if (e.name && e.name.toLowerCase() === 'minotaur') {
                    e.position.y = this.groundLevel; // Minotaur constructor will apply its own offset
                } else {
                    e.position.y = this.groundLevel - this.playerSize * 3 / 4;
                }
            });
        }
    }

    handleVictory() {
        // Сохраняем рекорд
        const topScore = localStorage.getItem('topScore') || 0;
        if (this.playerScore > topScore) {
            localStorage.setItem('topScore', this.playerScore);
        }

        // ✅ Останавливаем музыку игры перед показом победы
        this.soundManager.pause('game');

        // Останавливаем игру
        this.paused = true;
        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
        }
        this.stop();

        // Показываем экран победы
        this.screenManager.show('victory');
    }

    stop() {
        window.removeEventListener("keydown", this.handleKeyDown);
        window.removeEventListener("keyup", this.handleKeyUp);

        if (this.animationFrameId) {
            cancelAnimationFrame(this.animationFrameId);
            this.animationFrameId = null;
        }

        this.spawnIntervals.forEach(interval => clearInterval(interval));
        this.spawnIntervals = [];
    }

    resume() {
        this.paused = false;
    }

    pause() {
        this.paused = true;
    }
}

class Enemy {
    constructor(game, pos, speed) {
        this.game = game;
        this.realSize = 100;
        this.name = "enemy";
        this.imageRight = new Image();
        this.skin = game.skins[Math.floor(Math.random() * game.skins.length)];
        this.imageRight.src = "assets/images/" + this.skin + "right.png";
        this.imageLeft = new Image();
        this.imageLeft.src = "assets/images/" + this.skin + "left.png";
        this.sprites = {
            left: this.imageLeft,
            right: this.imageRight
        };
        this.dir = -1;
        this.position = pos;
        this.size = game.playerSize;
        this.speed = speed;
        this.xAnim = 0;
        this.yAnim = 0;
        this.damage = game.defalutE.damage;
        this.isRun = false;
        this.frameWalk = {
            val: 0,
            max: 7
        };
        this.anim = {
            step: 5,
            timer: 0
        };
        this.frameAttack = {
            val: 0,
            max: 2
        };
        this.isAttack = false;
        this.cooldownAtack = {
            val: 30,
            max: 40
        };
        this.frameIdle = {
            val: 0,
            max: 4
        };
        this.frameDamage = {
            val: 0,
            max: 5
        };
        this.isTakenDamage = false;
        this.damageDir = 0;
        this.health = game.defalutE.health;
        this.died = false;
        this.frameDie = {
            val: 0,
            max: 2
        };
        this.isShield = false;
        this.frameShield = {
            val: 0,
            max: 5
        };
        this.chanceDodge = 0.4;
        if (this.skin == "1") {
            this.chanceDodge = 0.5;
            this.health *= 2;
            this.damage *= 2;
            this.speed++;
        }
    }

    move() {
        if (!this.died) {
            if (this.position.x > this.game.playerPosition.x + this.game.playerSize / 3 && !this.isAttack && !this.isTakenDamage && !this.isShield) {
                this.position.x -= this.speed;
                this.dir = -1;
                this.isRun = true;
                this.isAttack = false;
            } else if (this.position.x + this.game.playerSize / 3 < this.game.playerPosition.x && !this.isAttack && !this.isTakenDamage && !this.isShield) {
                this.position.x += this.speed;
                this.dir = 1;
                this.isRun = true;
                this.isAttack = false;
            } else if (!this.isTakenDamage && !this.isShield) {
                if (this.cooldownAtack.val == 0) {
                    this.isAttack = true;
                    this.cooldownAtack.val = this.cooldownAtack.max;
                } else this.cooldownAtack.val--;
            }
        }
    }

    draw() {
        if (!this.game.playerDied && !this.game.paused) {
            this.near = !(this.position.x > this.game.playerPosition.x + this.game.playerSize / 2 - 5 || this.position.x + this.game.playerSize / 2 - 5 < this.game.playerPosition.x);
            this.isRun = false;
            if (!this.died) {
                if (this.health > 0) {
                    this.move();
                    if (this.isRun) {
                        if (this.frameWalk.val > this.frameWalk.max) this.frameWalk.val = 0;
                        else if (this.anim.timer % this.anim.step == 0) this.frameWalk.val++;
                        this.xAnim = (5 + this.frameWalk.val) % 7;
                        this.yAnim = Math.floor((5 + this.frameWalk.val) / 7);
                        this.anim.timer++;
                    }
                    if (this.isAttack) {
                        if (this.frameAttack.val > this.frameAttack.max) {
                            this.frameAttack.val = 0;
                            this.isAttack = false;
                        } else if (this.anim.timer % this.anim.step == 0) this.frameAttack.val++;
                        this.xAnim = (5 + this.frameAttack.val) % 7;
                        this.yAnim = Math.floor((5 + this.frameAttack.val) / 7) + 2;
                        this.anim.timer++;
                    }
                    if (!this.isAttack && !this.isRun) {
                        if (this.frameIdle.val > this.frameIdle.max) this.frameIdle.val = 0;
                        else if (this.anim.timer % this.anim.step == 0) this.frameIdle.val++;
                        this.xAnim = this.frameIdle.val;
                        this.yAnim = 0;
                        this.anim.timer++;
                    }
                    if (this.isTakenDamage) {
                        if (this.frameDamage.val > this.frameDamage.max) {
                            this.frameDamage.val = 0;
                            this.isTakenDamage = false;
                        } else if (this.anim.timer % this.anim.step == 0) this.frameDamage.val++;
                        this.xAnim = 1;
                        this.yAnim = 3;
                        this.anim.timer++;
                        this.position.x += this.damageDir * 2;
                    }
                    if (this.isShield) {
                        if (this.frameShield.val > this.frameShield.max) this.isShield = false;
                        else if (this.anim.timer % this.anim.step == 0) this.frameShield.val++;
                        this.xAnim = 6;
                        this.yAnim = 3;
                        this.anim.timer++;
                    }
                }
                if (this.health <= 0) {
                    if (this.frameDie.val > this.frameDie.max) this.died = true;
                    else if (this.anim.timer % this.anim.step == 0) this.frameDie.val++;
                    this.xAnim = 1 + this.frameDie.val;
                    this.yAnim = 3;
                    this.anim.timer++;
                }
            }
            if (this.died) {
                this.xAnim = 4;
                this.yAnim = 3;
            }
        } else {
            if (this.frameIdle.val > this.frameIdle.max) this.frameIdle.val = 0;
            else if (this.anim.timer % this.anim.step == 0) this.frameIdle.val++;
            this.xAnim = this.frameIdle.val;
            this.yAnim = 0;
            this.anim.timer++;
        }

        // ✅ ПРОВЕРКА ЗАГРУЗКИ ИЗОБРАЖЕНИЙ ПЕРЕД ОТРИСОВКОЙ
        if (this.dir == -1) {
            if (this.imageLeft.complete && this.imageLeft.naturalWidth !== 0) {
                this.game.c.drawImage(this.sprites.left, (6 - this.xAnim) * this.size, this.yAnim * this.size, this.size, this.size,
                    this.position.x, this.position.y, this.size, this.size);
            }
        }
        if (this.dir == 1) {
            if (this.imageRight.complete && this.imageRight.naturalWidth !== 0) {
                this.game.c.drawImage(this.sprites.right, this.xAnim * this.size, this.yAnim * this.size, this.size, this.size,
                    this.position.x, this.position.y, this.size, this.size);
            }
        }
    }
}

class Boss extends Enemy {
    set(newSkin, newSpeed, cooldownmMax, damage, chanceDodge, health, cooldownBlock, timeGetDamage, name, extraAtackSkin = "assets/images/1") {
        this.name = name;
        this.speed = newSpeed;
        this.skin = newSkin;
        this.imageLeft.src = this.skin + "left.png";  // ✅ СО СЛЕШЕМ
        this.imageRight.src = this.skin + "right.png"; // ✅ СО СЛЕШЕМ
        this.cooldownAtack = {
            val: 30,
            max: cooldownmMax
        };
        this.damage = damage;
        this.chanceDodge = chanceDodge;
        this.health = health;
        this.maxHealth = this.health;
        this.frameShield = {
            val: 0,
            max: cooldownBlock
        };
        this.frameDamage = {
            val: 0,
            max: timeGetDamage
        };
        this.kfDraw = this.size / 3 / this.maxHealth;
        this.useJumpAtack = false;
        this.useJumpAtackLeft = new Image();
        this.useJumpAtackRight = new Image();
        this.useJumpAtackLeft.src = extraAtackSkin + "left.png";
        this.useJumpAtackRight.src = extraAtackSkin + "right.png";
        this.jumpAtack = {
            left: this.useJumpAtackLeft,
            right: this.useJumpAtackRight
        };
        this.isExtraAtack = false;
        this.defaultsSprites = this.sprites;
        this.defaultSpeed = this.speed;
        this.defaultDamage = this.damage;
        this.extraDamage = this.damage * 2;
        this.cooldownExtraAtack = {
            val: 0,
            max: 50
        };
    }

    draw() {
        if (this.health < this.maxHealth / 2 && (Math.random() < 0.2) && !this.isExtraAtack && this.cooldownExtraAtack.val == 0) {
            this.isExtraAtack = true;
        }
        if (this.cooldownExtraAtack.val > 0) this.cooldownExtraAtack.val--;
        if (this.isExtraAtack) {
            this.damage = this.extraDamage;
            this.sprites = this.jumpAtack;
            this.speed = this.defaultSpeed + 2;
            if (this.near && this.frameAttack.val == this.frameAttack.max) {
                this.isExtraAtack = false;
                this.cooldownExtraAtack.val = this.cooldownExtraAtack.max;
            }
        } else {
            this.damage = this.defaultDamage;
            this.sprites = this.defaultsSprites;
            this.speed = this.defaultSpeed;
        }
        super.draw();

        // ✅ ПРОВЕРКА ЗАГРУЗКИ ИЗОБРАЖЕНИЯ ЗДОРОВЬЯ
        if (this.game.hp.complete && this.game.hp.naturalWidth !== 0) {
            this.game.c.drawImage(this.game.hp, 0, 0, 1, 1, this.position.x + this.size / 3, this.position.y + this.size / 6, this.maxHealth * this.kfDraw, 15);
            this.game.c.drawImage(this.game.hp, 0, 0, this.game.hp.width, this.game.hp.height, this.position.x + this.size / 3, this.position.y + this.size / 6, this.health * this.kfDraw, 15);
        }

        this.game.c.drawImage(this.game.hp, 0, 0, 1, 1, this.position.x + this.size / 3, this.position.y + this.size / 6, this.maxHealth * this.kfDraw, 15);
        this.game.c.drawImage(this.game.hp, 0, 0, this.game.hp.width, this.game.hp.height, this.position.x + this.size / 3, this.position.y + this.size / 6, this.health * this.kfDraw, 15);
    }
}

class Minotaur {
    constructor(game, pos, speed) {
        this.game = game;
        this.realSize = 130;
        this.name = "minotaur";
        this.image = new Image();
        this.image.src = "assets/images/minotaur.png";
        this.dir = -1;
        this.position = pos;
        this.size = 384;
        this.position.y -= this.size * 2 / 3;
        this.speed = speed;

        // ✅ ФИКСИРОВАННЫЙ УРОН БЕЗ ЗАВИСИМОСТИ ОТ ГЛОБАЛЬНОГО МНОЖИТЕЛЯ
        this.damage = {
            3: 12,  // средняя атака
            4: 8,   // слабая атака
            6: 20   // сильная атака (максимум 20 урона)
        };

        this.takeDamage = {
            v: 0,
            max: 20
        };
        this.keyframes = [
            { is: true, vx: 0, max: 3, anim: { step: 5, timer: 0 } },
            { is: false, vx: 0, max: 6, anim: { step: 4, timer: 0 } },
            { is: false, vx: 0, max: 3, anim: { step: 5, timer: 0 } },
            { is: false, vx: 0, max: 7, anim: { step: 5, timer: 0 } },
            { is: false, vx: 0, max: 3, anim: { step: 6, timer: 0 } },
            { is: false, vx: 0, max: 4, anim: { step: 6, timer: 0 } },
            { is: false, vx: 0, max: 7, anim: { step: 6, timer: 0 } },
            { is: false, vx: 0, max: 1, anim: { step: 10, timer: 0 } },
            { is: false, vx: 0, max: 1, anim: { step: 10, timer: 0 } },
            { is: false, vx: 0, max: 5, anim: { step: 10, timer: 0 } }
        ];
        this.frames = {
            idle: { value: 0 },
            run: { value: 1 },
            taunt: { value: 2 },
            atack: { value: [3, 4, 6] },
            atackWtf: { value: 5 },
            damage: { value: [7, 8] },
            die: { value: 9 }
        };
        this.cooldownAtack = {
            val: 30,
            max: 200
        };
        this.damageDir = 0;
        this.health = 150; // ✅ ФИКСИРОВАННОЕ ЗДОРОВЬЕ (не зависит от defalutE.health)
        this.died = false;
        this.chanceDodge = 0.4;
        this.cooldownStay = {
            v: 10,
            max: 100
        };
        this.attackIndex = 6; // ✅ Инициализация по умолчанию
    }
    update() {
        this.keyframes[0].is = true;
        if (this.takeDamage.v == 0) {
            if (this.cooldownAtack.val > 0)
                this.cooldownAtack.val--;
            if (this.takeDamage.v == 0) {
                if (this.position.x + this.size / 2 < this.game.playerPosition.x) {
                    if (this.cooldownStay.v == 0) {
                        this.dir = 1;
                        this.keyframes[this.frames.run.value].is = true;
                        this.position.x += this.speed;
                    }
                } else if (this.position.x + this.size / 12 > this.game.playerPosition.x + this.game.playerSize / 2) {
                    if (this.cooldownStay.v == 0) {
                        this.dir = -1;
                        this.keyframes[this.frames.run.value].is = true;
                        this.position.x -= this.speed;
                    }
                } else if (this.cooldownAtack.val == 0) {
                    this.attackIndex = this.frames.atack.value[Math.floor(Math.random() * this.frames.atack.value.length)];
                    this.keyframes[this.attackIndex].is = true;
                    this.cooldownAtack.val = this.cooldownAtack.max;
                    this.cooldownStay.v = this.cooldownStay.max;
                } else {
                    this.keyframes[this.frames.run.value].is = false;
                }
                if (this.cooldownStay.v > 0) this.cooldownStay.v--;
            }
        }
        if (this.takeDamage.v > 0) {
            this.takeDamage.v--;
            this.position.x += this.speed * this.damageDir;
            if (this.takeDamage.v == 0) {
                this.frames.damage.value.forEach(v => {
                    this.keyframes[v].is = false;
                });
            }
        }
    }
    draw() {
        if (this.health > 0 && !this.game.paused)
            this.update();
        else if (this.health <= 0) {
            this.keyframes.forEach(e => { e.is = false; });
            this.keyframes[this.frames.die.value].is = true;
        }
        for (let i = this.keyframes.length - 1; i >= 0; i--) {
            if (this.keyframes[i].is) {
                if (this.keyframes[i].vx > this.keyframes[i].max) {
                    this.keyframes[i].vx = 0;
                    this.keyframes[i].is = false;
                    if (this.health < 0) this.died = true;
                } else if (this.keyframes[i].anim.timer % this.keyframes[i].anim.step == 0) this.keyframes[i].vx++;
                this.xAnim = this.keyframes[i].vx;
                this.yAnim = i;
                this.keyframes[i].anim.timer++;
                break;
            }
        }
        if (this.dir === -1) this.yAnim += this.keyframes.length;
        this.game.c.drawImage(this.image, this.xAnim * this.size, this.yAnim * this.size, this.size, this.size,
            this.position.x, this.position.y, this.size, this.size);
    }
}
