export class MouseDirectionTracker {
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
