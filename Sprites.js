import { Characters } from './Characters.js';

export class Sprites {
  constructor(params) {
    if (!(params.character instanceof Characters)) {
      throw new Error("character must implement Characters");
    };
    if (!Number.isFinite(params.position.posX) || !Number.isFinite(params.position.posY) || !Number.isFinite(params.position.angle) || !Number.isFinite(params.position.speed)) {
      throw new Error("position must position format");
    };
    this.params = {
      team: null,
      character: null,
      position: {
        posX: 0,
        posY: 0,
        angle: 0,
        speed: 0,
      }
    };
    this.params = params;

    this.prevX = this.params.position.posX;
    this.prevY = this.params.position.posY;
  }

  // 戦略関数を実行して状態を更新
  think = (sprites = []) => {
    if (typeof this.params.character.strategy === 'function') {
      const newState = this.params.character.strategy(sprites);
      if (newState.angle !== undefined) this.params.position.angle = newState.angle;
      if (newState.speed !== undefined) this.params.position.speed = newState.speed;
      // newState.addSprite?.forEach(element => {
      //   sprites.push(new Sprites(element.params));
      // });
    }
  }

  // 座標を更新
  move = (field = {}, sprites = []) => {
    ((thisCharacter, thisPosition) => {
      // 移動量を計算
      const radians = (thisPosition.angle - 90) * Math.PI / 180;
      const dx = thisPosition.speed * Math.cos(radians);
      const dy = thisPosition.speed * Math.sin(radians);

      //衝突判定
      if (thisCharacter.type === thisCharacter.CHARACTER_TYPE.ENTITY
        || thisCharacter.type === thisCharacter.CHARACTER_TYPE.ATTACK
      ) {
        sprites.forEach(sprite => {
          if (sprite !== this) {
            ((spriteCharacter, spritePosition) => {
              // Aの範囲
              const aLeft = thisPosition.posX - thisCharacter.range.width;
              const aTop = thisPosition.posY - thisCharacter.range.height;
              const aRight = thisPosition.posX + thisCharacter.range.width;
              const aBottom = thisPosition.posY + thisCharacter.range.height;

              // Bの範囲
              const bLeft = spritePosition.posX - spriteCharacter.range.width;
              const bTop = spritePosition.posY - spriteCharacter.range.height;
              const bRight = spritePosition.posX + spriteCharacter.range.width;
              const bBottom = spritePosition.posY + spriteCharacter.range.height;

              // 衝突判定
              if (!(aRight < bLeft || aLeft > bRight || aBottom < bTop || aTop > bBottom)) {
                switch (thisCharacter.type) {
                  case thisCharacter.CHARACTER_TYPE.ENTITY:
                    switch (spriteCharacter.type) {
                      case spriteCharacter.CHARACTER_TYPE.ENTITY:
                        //実体同士
                        // 衝突しているので移動をキャンセル
                        dx = 0;
                        dy = 0;
                      case spriteCharacter.CHARACTER_TYPE.ITEM:
                        //実体⇒アイテム
                        spriteCharacter.destroy();
                    }
                  case thisCharacter.CHARACTER_TYPE.ATTACK:
                    //攻撃⇒実体
                    if (spriteCharacter.type === spriteCharacter.CHARACTER_TYPE.ENTITY) {
                      if (this.params.team !== sprite.params.team) {
                        spriteCharacter.value -= thisCharacter.value;
                        if (spriteCharacter.value < 0) {
                          //破壊
                          const newState = sprite.break();
                          // newState.addSprite?.forEach(element => {
                          //   sprites.push(new Sprites(element.params));
                          // });
                        }
                      }
                    }
                }
              }
            })(sprite.parrams.character, field);
          }
        })
      }

      //移動
      thisPosition.posX += dx;
      thisPosition.posY += dy;

      //画面外判定
      if (thisPosition.posX < 0 || thisPosition.posX > field.width || thisPosition.posY < 0 || thisPosition.posY > field.height) {
        this.params.character.destroy();
      }

      //不要になった要素を削除
      sprites = sprites.filter(sprite => sprite !== null);

      if (this.prevX !== thisPosition.posX || this.prevY !== thisPosition.posY) {
        this.prevX = thisPosition.posX;
        this.prevY = thisPosition.posY;
        console.log('現在の座標  x:', Math.round(thisPosition.posX), ' y:', Math.round(thisPosition.posY), ' a:', Math.round(thisPosition.angle));
      }
    })(this.params.character, this.params.position)
  }

  action = (field, sprites = []) => {
    this.think(sprites);
    this.move(sprites, field);
  }

  destroy = () => {
    if (this._destroyed) return;

    this.params = null;
    this.prevX = null;
    this.prevY = null;

    this._destroyed = true;
  }
}
