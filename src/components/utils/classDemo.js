class Point {
    constructor(x, y) {
        this.x = x;
        this.y = y;
    }

    toString() {
        console.log('this.x:' + this.x + ', this.y:' + this.y);
        return '(' + this.x + ', ' + this.y + ')';
    }
}

export default Point