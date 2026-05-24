import { Sprites } from './Sprites.js';
import { CharacterP1 } from './CharacterP1.js';

export class Matchs {
    constructor() {
        this.MATCH_TEAM = Object.freeze({
            ONE: "ONE",
            TWO: "TWO",
        });
        const canvas = document.getElementById("game");
        this.ctx = canvas.getContext("2d");
        // カメラ（表示範囲）
        this.camera = {
            posX: 0,
            posY: 0,
            width: canvas.width,
            height: canvas.height
        };
        // 画像読み込み
        this.bg = new Image();
        this.bg.src = "./image/rock-quarry2.jpg";
        this.SPRITE_PARAMS = {
            P1: {
                team: this.MATCH_TEAM.ONE,
                character: new CharacterP1(),
                field: { Size: 1000, },
                position: {
                    posX: 500,
                    posY: 500,
                    angle: -1,
                    speed: 1,
                }
            }
        };

        this.sprites = [];
        this.isFinished = false;
        this.feild = { Size: 0 };
    }

    start = () => {
        //プレイヤー生成
        //const player = new Sprites(this.SPRITE_PARAMS);
        //const playerImg = new Image();
        //playerImg.src = player.src;
        //this.sprites.push(player);
        //this.addSprite(this.MATCH_TEAM.ONE, this.SPRITE_PARAMS)

        // Promise.all([
        //     new Promise(res => bg.onload = res),
        //     new Promise(res => playerImg.onload = res)
        // ]).then(loop);

        return new Promise((resolve) => {
            const loop = async () => {
                const position = this.sprites.find(sprite => sprite.params.team === this.MATCH_TEAM.ONE).params.position;
                this.camera.posX = position.posX - this.camera.width / 2;
                this.camera.posY = position.posY - this.camera.height / 2;

                this.draw(this.camera);
                //await new Promise(resolve => setTimeout(resolve, 500));
                this.sprites.forEach(sprite => sprite.action(this.sprites));

                //完了条件を判定
                if (this.checkFinish()) {
                    resolve('Match Finished');
                    return;
                }

                requestAnimationFrame(loop);
            };

            loop();
        });
    }

    addSprite = (team, params) => {
        params.team = team;
        this.sprites.push(new Sprites(params));
    }

    draw = async (camera) => {
        // 背景の一部を切り取って描画
        this.ctx.drawImage(
            this.bg,
            camera.posX, camera.posY, camera.width, camera.height, // 切り取り範囲
            0, 0, camera.width, camera.height                // キャンバスに貼る
        );
        //await new Promise(resolve => setTimeout(resolve, 300));

        this.sprites.forEach(sprite => {
            // 画面座標に変換してプレイヤーを描画
            this.ctx.drawImage(
                sprite.params.character.image,
                // sprite.params.position.posX - camera.posX - sprite.params.character.width / 2,
                // sprite.params.position.posY - camera.posY - sprite.params.character.height / 2,
                sprite.params.position.posX - camera.posX - sprite.params.character.width / 2,
                sprite.params.position.posY - camera.posY - sprite.params.character.height / 2,
                sprite.params.character.width,
                sprite.params.character.height
            );
        });
    }

    destroy = () => {
        if (this._destroyed) return;

        this.sprites.forEach(sprite => sprite.destroy());
        this.sprites = null;

        this._destroyed = true;
    }
}
