

import { MatchS1 } from './MatchS1.js';

export class Base {
    constructor() {
        this.startMatch();
    }

    startMatch = async () => {
        const matchS1 = new MatchS1();
        const result = await matchS1.start();
        console.log('終了:', result);
    }

    destroy = () => {
        if (this._destroyed) return;

        this._destroyed = true;
    }
}
