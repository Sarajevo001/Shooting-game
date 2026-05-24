export class Characters {
    constructor() {
        this.CHARACTER_TYPE = Object.freeze({
            ENTITY: "ENTITY",
            ATTACK: "ATTACK",
            ITEM: "ITEM",
            EFFECT: "EFFECT"
        });
        this.image = {
            path: null,
            width: null,
            height: null
        };
        this.range = {
            width: null,
            height: null,
            angle: null,
            speed: null
        };
        this.value = 0;
    }

    strategy = (x = 0, y = 0, sprites = []) => {
        return { angle: 0, speed: 0 };
    }

    break = () => {
        this.destroy();
        return { addSprite: [] }
    }

    destroy = () => {
        if (this._destroyed) return;

        this._destroyed = true;
    }
}
