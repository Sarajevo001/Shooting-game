import { Characters } from './Characters.js';
import { InputDirectionTracker } from './InputDirectionTracker.js';

export class CharacterP1 extends Characters {
    constructor() {
        super();
        this.inputDirectionTracker = new InputDirectionTracker();
        this.type = this.CHARACTER_TYPE.ENTITY;
        const charImage = new Image();
        charImage.src = './image/ロケットのアイコン素材 1.png';
        this.image = charImage;
        this.width = 100;
        this.height = 100;
        this.life = 100;
    }

    strategy = () => {
        const angle = this.inputDirectionTracker.getDirection();
        let speed = 0;
        if (angle === -1) {
            speed = 0;
        } else {
            speed = 10;
        }
        return { angle: angle, speed: speed, addSprite: [] };
    }

    brake = () => {
        this.destroy();
        return { addSprite: [] }
    }

    destroy = () => {
        if (this._destroyed) return;

        this.inputDirectionTracker.destroy();
        this.inputDirectionTracker = null;

        this._destroyed = true;
    }
}
