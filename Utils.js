export class Utils {
    getAngle = (obj1, obj2) => {
        const dx = obj2.x - obj1.x;
        const dy = obj2.y - obj1.y;
        const radians = Math.atan2(dy, dx); // ラジアンで角度
        const degrees = radians * 180 / Math.PI; // 度数に変換
        return degrees;
    }

    destroy = () => {
        if (this._destroyed) return;

        this._destroyed = true;
    }
}
