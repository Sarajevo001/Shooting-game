import { Matchs } from './Matchs.js';

export class MatchS1 extends Matchs {
    constructor() {
        super();
        this.sprites = [];

        this.addSprite(this.MATCH_TEAM.ONE, this.SPRITE_PARAMS.P1);
    }

    checkFinish = () => {
        //TEAM.ONEが無ければ終了
        return !this.sprites.some(sprite => sprite.params.team === this.MATCH_TEAM.ONE);
    }

    destroy = () => {
        if (this._destroyed) return;

        this.sprites.forEach(sprite => sprite.destroy());
        this.sprites = null;

        this._destroyed = true;
    }
}
