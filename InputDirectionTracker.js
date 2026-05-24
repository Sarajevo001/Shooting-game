export class InputDirectionTracker {
  constructor() {
    this.direction = -1;
    this.keyDirectionTracker = new KeyDirectionTracker();
    this.mouseDirectionTracker = new MouseDirectionTracker();
  }

  getDirection = () => {
    const keyAngle = this.keyDirectionTracker.getDirection();
    const mouseAngle = this.mouseDirectionTracker.getDirection();

    let angle = -1;
    if (keyAngle >= 0) angle = keyAngle;
    if (mouseAngle >= 0) angle = mouseAngle;

    return angle;
  }

  destroy = () => {
    if (this._destroyed) return;

    this.keyDirectionTracker.destroy();
    this.keyDirectionTracker = null;
    this.mouseDirectionTracker.destroy();
    this.mouseDirectionTracker = null;

    // 内部参照クリア
    this.direction = null;

    this._destroyed = true;
  }
}

class KeyDirectionTracker {
  constructor() {
    this.pressedKeys = new Set();

    this.onKeydown = (event) => {
      this.pressedKeys.add(event.key);
      this.updateDirection();
    }
    document.addEventListener('keydown', this.onKeydown);

    this.onKeyup = (event) => {
      this.pressedKeys.delete(event.key);
      this.updateDirection();
    }
    document.addEventListener('keyup', this.onKeyup);
  }

  updateDirection() {
    const up = this.pressedKeys.has('ArrowUp');
    const down = this.pressedKeys.has('ArrowDown');
    const left = this.pressedKeys.has('ArrowLeft');
    const right = this.pressedKeys.has('ArrowRight');

    if (up && !right && !down && !left) {
      this.direction = 0;
    } else if (up && right && !down && !left) {
      this.direction = 45;
    } else if (!up && right && !down && !left) {
      this.direction = 90;
    } else if (!up && right && down && !left) {
      this.direction = 135;
    } else if (!up && !right && down && !left) {
      this.direction = 180;
    } else if (!up && !right && down && left) {
      this.direction = 225;
    } else if (!up && !right && !down && left) {
      this.direction = 270;
    } else if (up && !right && !down && left) {
      this.direction = 315;
    } else {
      this.direction = -1;
    }

    return this.direction;
  }

  getDirection() {
    return this.direction;
  }

  destroy = () => {
    if (this._destroyed) return;

    this.targetElement.removeEventListener('keydown', this.onKeydown);
    this.onKeydown = null;
    this.targetElement.removeEventListener('click', this.onKeyup);
    this.onKeyup = null;

    // 内部参照クリア
    this.direction = null;
    this.pressedKeys = null;

    this._destroyed = true;
  }
}

class MouseDirectionTracker {
  constructor(targetElement = document) {
    this.startX = null;
    this.startY = null;
    this.currentDirection = -1;
    this.isDragging = false;

    this.onMousedown = (event) => {
      this.startX = event.clientX;
      this.startY = event.clientY;
      this.isDragging = true;
    }
    targetElement.addEventListener('mousedown', this.onMousedown);

    this.onMousemove = (event) => {
      if (!this.isDragging) {
        this.currentDirection = -1;
        return;
      }

      const dx = event.clientX - this.startX;
      const dy = this.startY - event.clientY; // Y軸は上が正方向にしたいので逆転

      this.currentDirection = this.calculateDirection(dx, dy);
    }
    targetElement.addEventListener('mousemove', this.onMousemove);

    this.onMouseup = () => {
      this.isDragging = false;
      this.currentDirection = -1;
    }
    targetElement.addEventListener('mouseup', this.onMouseup);
  }

  calculateDirection(dx, dy) {
    // dx: X方向の差分, dy: Y方向の差分（上が正）
    let radians = Math.atan2(dx, dy); // 引数を逆にすることで基準を上方向に
    let degrees = radians * 180 / Math.PI;

    if (degrees < 0) {
      degrees += 360; // 0～360に正規化
    }

    return degrees; // 上方向が0°, 時計回りに増加
  }

  getDirection() {
    return this.currentDirection;
  }

  destroy = () => {
    if (this._destroyed) return;

    this.targetElement.removeEventListener('mousedown', this.onMousedown);
    this.onMousedown = null;
    this.targetElement.removeEventListener('mousemove', this.onMousemove);
    this.onMousemove = null;
    this.targetElement.removeEventListener('mouseup', this.onMouseup);
    this.onMouseup = null;

    // 内部参照クリア
    this.startX = null;
    this.startY = null;
    this.currentDirection = null;
    this.isDragging = null;

    this._destroyed = true;
  }
}
