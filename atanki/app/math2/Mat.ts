import {
    Vec2,
    Point
} from './vec2';

export interface Transformation {
    transform ? : Vec2 | Point;
    pivot ? : Vec2 | Point;
    scale ? : Vec2 | Point;
    rotation ? : number;
    skew ? : Vec2 | Point;
}


/**
 * Transformation matrix
 * The Matrix class as an object
 *  [a, b, tx],
 *  [c, d, ty],
 *  [0, 0, 1]
 *
 *  [ x cos(), x sin(), translateX]
 *  [-y sin(), y cos(), translateY]
 *  [     0,     0,          1]
 */
export class Mat {

    /**
     * A default (identity) matrix
     */
    public static get IDENTITY() {
        return new Mat();
    }

    /**
     * A temp matrix
     */
    public static get TEMP_MATRIX() {
        return new Mat();
    }

    public a: number;
    public b: number;
    public c: number;
    public d: number;
    public tx: number;
    public ty: number;

    // private _position: Vec2;
    private _pivot: Point;
    // private _scale: Vec2;
    // private _rotation: number;
    // private _skew: Vec2;

    /**
     * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
     *
     * @param transform - The transform to apply the properties to.
     * @return The transform with the newly applied properties
     */
    public static decompos(matrix: Mat): Transformation {
        let transform: Point = {
            x: 0,
            y: 0
        };
        let pivot: Point = {
            x: 0,
            y: 0
        };
        let scale: Point = {
            x: 1,
            y: 1
        };
        let rotation: number = 0;
        let skew: Point = {
            x: 0,
            y: 0
        };

        const a = matrix.a;
        const b = matrix.b;
        const c = matrix.c;
        const d = matrix.d;

        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);

        const delta = Math.abs(skewX + skewY);

        if (delta < 0.00001) {
            rotation = skewY;

            if (a < 0 && d >= 0) {
                rotation += (rotation <= 0) ? Math.PI : -Math.PI;
            }

            skew.x = skew.y = 0;
        } else {
            skew.x = skewX;
            skew.y = skewY;
        }

        // next set scale
        scale.x = Math.sqrt((a * a) + (b * b));
        scale.y = Math.sqrt((c * c) + (d * d));

        // next set position
        transform.x = matrix.tx;
        transform.y = matrix.ty;

        return {
            transform,
            pivot,
            scale,
            rotation: rotation,
            skew,
        };
    }

    /**
     * Sets the matrix based on all the available properties
     * @param obj all available properties
     */
    public static compos(obj: Transformation): Mat {
        const transform = obj.transform || {
            x: 0,
            y: 0
        };
        const pivot = obj.pivot || {
            x: 0,
            y: 0
        };
        const scale = obj.scale || {
            x: 1,
            y: 1
        };
        const rotation = obj.rotation || 0;
        const skew = obj.skew || {
            x: 0,
            y: 0
        };

        const sinRotation = Math.sin(rotation);
        const cosRotation = Math.cos(rotation);

        const cosY = Math.cos(skew.y);
        const sinY = Math.sin(skew.y);
        const negSinX = -Math.sin(skew.x);
        const cosX = Math.cos(skew.x);

        const ax = cosRotation * scale.x;
        const bx = sinRotation * scale.x;
        const cx = -sinRotation * scale.y;
        const dx = cosRotation * scale.y;

        const a = (cosY * ax) + (sinY * cx);
        const b = (cosY * bx) + (sinY * dx);
        const c = (negSinX * ax) + (cosX * cx);
        const d = (negSinX * bx) + (cosX * dx);

        const tx = transform.x + ((pivot.x * ax) + (pivot.y * cx));
        const ty = transform.y + ((pivot.x * bx) + (pivot.y * dx));

        return new Mat(a, b, c, d, tx, ty);
    }

    /**
     * matrix1 × matrix2  
     * multiplication
     * @param mat1 matrix1
     * @param mat2 matrix2
     */
    public static mult(mat1: Mat, mat2: Mat): Mat {
        let a = mat1.a;
        let b = mat1.b;
        let c = mat1.c;
        let d = mat1.d;
        if (mat2.a !== 1 || mat2.b !== 0 || mat2.c !== 0 || mat2.d !== 1) {
            a = (mat1.a * mat2.a) + (mat1.b * mat2.c);
            b = (mat1.a * mat2.b) + (mat1.b * mat2.d);
            c = (mat1.c * mat2.a) + (mat1.d * mat2.c);
            d = (mat1.c * mat2.b) + (mat1.d * mat2.d);
        }

        const tx = (mat1.tx * mat2.a) + (mat1.ty * mat2.c) + mat2.tx;
        const ty = (mat1.tx * mat2.b) + (mat1.ty * mat2.d) + mat2.ty;

        return new Mat(a, b, c, d, tx, ty);
    }

    /**
     * matrix1 - matrix2  
     * subtracting of two Matrices
     * @param mat1 matrix1
     * @param mat2 matrix2
     */
    public static sub(mat1: Mat, mat2: Mat): Mat {
        const a = mat1.a - mat2.a;
        const b = mat1.b - mat2.b;
        const c = mat1.c - mat2.c;
        const d = mat1.d - mat2.d;
        const tx = mat1.tx - mat2.tx;
        const ty = mat1.ty - mat2.ty;
        return new Mat(a, b, c, d, tx, ty);
    }

    /**
     * matrix1 + matrix2  
     * subtracting of two Matrices
     * @param mat1 matrix1
     * @param mat2 matrix2
     */
    public static sum(mat1: Mat, mat2: Mat): Mat {
        const a = mat1.a + mat2.a;
        const b = mat1.b + mat2.b;
        const c = mat1.c + mat2.c;
        const d = mat1.d + mat2.d;
        const tx = mat1.tx + mat2.tx;
        const ty = mat1.ty + mat2.ty;
        return new Mat(a, b, c, d, tx, ty);
    }

    /**
     * -[m]
     * Inverts this matrix  
     *
     * @return This matrix. Good for chaining method calls.
     */
    public static invert(mat: Mat): Mat {
        const n = (mat.a * mat.d) - (mat.b * mat.c);

        const a = mat.d / n;
        const b = -mat.b / n;
        const c = -mat.c / n;
        const d = mat.a / n;
        const tx = ((mat.c * mat.ty) - (mat.d * mat.tx)) / n;
        const ty = -((mat.a * mat.ty) - (mat.b * mat.tx)) / n;

        return new Mat(a, b, c, d, tx, ty);
    }

    public setTransform(vec: Point) {
        this.tx = vec.x + ((this.getPivot().x * this.a) + (this.getPivot().y * this.c));
        this.ty = vec.y + ((this.getPivot().x * this.b) + (this.getPivot().y * this.d));
        return this;
    }
    public get transform(): Point {
        return {
            x: this.tx,
            y: this.ty
        };
    }

    public setPivot(vec: Point) {
        this._pivot = vec;
    }
    public getPivot(): Point {
        return this._pivot;
    }

    public setScale(obj: Point) {
        const sin = Math.sin(this.rotation);
        const cos = Math.cos(this.rotation);
        this.a = cos * obj.x;
        this.b = sin * obj.x;
        this.c = -sin * obj.y;
        this.d = cos * obj.y;
        return this;
    }
    public get scale(): Point {
        return {
            x: Math.sqrt((this.a * this.a) + (this.b * this.b)),
            y: Math.sqrt((this.c * this.c) + (this.d * this.d))
        };
    }

    public setRotation(angle: number) {
        const sin = Math.sin(angle);
        const cos = Math.cos(angle);

        const tx = this.tx;

        this.a = cos;
        this.b = sin;
        this.c = -sin;
        this.d = cos;
        this.tx = (tx * cos) - (this.ty * sin);
        this.ty = (tx * sin) + (this.ty * cos);
        return this;
    }
    public get rotation(): number {
        let rotation;
        if (this._delta < 0.00001) {
            rotation = this.skew.y;

            if (this.a < 0 && this.d >= 0) {
                rotation += (rotation <= 0) ? Math.PI : -Math.PI;
            }
        }
        return rotation;
    }

    public setSkew(vec: Vec2) {
        const cosy = Math.cos(vec.y);
        const siny = Math.sin(vec.y);
        const nsinx = -Math.sin(vec.x);
        const cosx = Math.cos(vec.x);
        this.a = (cosy * this.a) + (siny * this.c);
        this.b = (cosy * this.b) + (siny * this.d);
        this.c = (nsinx * this.a) + (cosx * this.c);
        this.d = (nsinx * this.b) + (cosx * this.d);
        return this;
    }
    public get skew(): Vec2 {
        let skew;
        skew = new Vec2(-Math.atan2(-this.c, this.d), Math.atan2(this.b, this.a));
        return skew;
    }



    /**
     * @param {number} [a=1] - x scale / x cos()
     * @param {number} [b=0] - y skew / x sin()
     * @param {number} [c=0] - x skew / -y sin()
     * @param {number} [d=1] - y scale / y cos()
     * @param {number} [tx=0] - x translation
     * @param {number} [ty=0] - y translation
     */
    constructor(
        a: number = 1,
        b: number = 0,
        c: number = 0,
        d: number = 1,
        tx: number = 0,
        ty: number = 0
    ) {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;
        this._pivot = {x: 0, y: 0};
    }

    /**
     * Creates a Matrix object based on the given array. The Element to Matrix mapping order is as follows:  
     *
     * a = array[0]  
     * b = array[1]  
     * c = array[3]  
     * d = array[4]  
     * tx = array[2]  
     * ty = array[5]  
     *
     * @param {number[]} array - The array that the matrix will be populated from.
     */
    public fromArray(array): Mat {
        this.a = array[0];
        this.b = array[1];
        this.c = array[3];
        this.d = array[4];
        this.tx = array[2];
        this.ty = array[5];
        return this;
    }

    /**
     * sets the matrix properties
     *
     * @param a - Matrix component
     * @param b - Matrix component
     * @param c - Matrix component
     * @param d - Matrix component
     * @param tx - Matrix component
     * @param ty - Matrix component
     *
     * @return This matrix. Good for chaining method calls.
     */
    public set(a: number, b: number, c: number, d: number, tx: number, ty: number): Mat {
        this.a = a;
        this.b = b;
        this.c = c;
        this.d = d;
        this.tx = tx;
        this.ty = ty;

        return this;
    }

    public get() {
        return new Mat(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    /**
     * Creates an array from the current Matrix object.
     *
     * @param transpose - Whether we need to transpose the matrix or not
     * @return the newly created array which contains the matrix
     */
    public toArray(transpose ? : boolean): Float32Array {
        const array = new Float32Array(9);

        if (transpose) {
            array[0] = this.a;
            array[1] = this.b;
            array[2] = 0;
            array[3] = this.c;
            array[4] = this.d;
            array[5] = 0;
            array[6] = this.tx;
            array[7] = this.ty;
            array[8] = 1;
        } else {
            array[0] = this.a;
            array[1] = this.c;
            array[2] = this.tx;
            array[3] = this.b;
            array[4] = this.d;
            array[5] = this.ty;
            array[6] = 0;
            array[7] = 0;
            array[8] = 1;
        }

        return array;
    }

    /**
     * Get a new position with the current transformation applied.
     * Can be used to go from a child's coordinate space to the world coordinate space. (e.g. rendering)
     *
     * @param pos - The origin
     * @param newPos - The point that the new position is assigned to (allowed to be same as input)
     * @return The new point, transformed through this matrix
     */
    public apply(pos: Point, newPos: Point): Point {
        newPos = newPos || {
            x: 0,
            y: 0
        };

        const x = pos.x;
        const y = pos.y;

        newPos.x = (this.a * x) + (this.c * y) + this.tx;
        newPos.y = (this.b * x) + (this.d * y) + this.ty;

        return newPos;
    }

    /**
     * Get a new position with the inverse of the current transformation applied.
     * Can be used to go from the world coordinate space to a child's coordinate space. (e.g. input)
     *
     * @param pos - The origin
     * @param newPos - The point that the new position is assigned to (allowed to be same as input)
     * @return The new point, inverse-transformed through this matrix
     */
    public applyInverse(pos: Point, newPos: Point): Point {
        newPos = newPos || {
            x: 0,
            y: 0
        };

        const id = 1 / ((this.a * this.d) + (this.c * -this.b));

        const x = pos.x;
        const y = pos.y;

        newPos.x = (this.d * id * x) + (-this.c * id * y) + (((this.ty * this.c) - (this.tx * this.d)) * id);
        newPos.y = (this.a * id * y) + (-this.b * id * x) + (((-this.ty * this.a) + (this.tx * this.b)) * id);

        return newPos;
    }

    /**
     * Translates (move) the matrix by vector.
     *
     * @param vec How much to translate by vector
     * @return This matrix. Good for chaining method calls.
     */
    public translateTo(vec: Point): Mat {
        this.tx += vec.x;
        this.ty += vec.y;

        return this;
    }

    /**
     * Applies a scale transformation to the matrix.
     *
     * @param x The amount to scale by vetor
     * @return This matrix. Good for chaining method calls.
     */
    public scaleBy(obj: number | Point): Mat {
        if (typeof obj === 'number') {
            this.a *= obj;
            this.d *= obj;
            this.c *= obj;
            this.b *= obj;
            this.tx *= obj;
            this.ty *= obj;
        } else {
            this.a *= obj.x;
            this.d *= obj.y;
            this.c *= obj.x;
            this.b *= obj.y;
            this.tx *= obj.x;
            this.ty *= obj.y;
        }
        return this;
    }

    /**
     * Applies a rotation transformation to the matrix.
     *
     * @param angle - The angle in radians.
     * @return This matrix. Good for chaining method calls.
     */
    public rotateTo(angle: number): Mat {
        const cos = Math.cos(angle);
        const sin = Math.sin(angle);

        const a1 = this.a;
        const c1 = this.c;
        const tx1 = this.tx;

        this.a = (a1 * cos) - (this.b * sin);
        this.b = (a1 * sin) + (this.b * cos);
        this.c = (c1 * cos) - (this.d * sin);
        this.d = (c1 * sin) + (this.d * cos);
        this.tx = (tx1 * cos) - (this.ty * sin);
        this.ty = (tx1 * sin) + (this.ty * cos);

        return this;
    }

    /**
     * [matrix] × [this]  
     * Appends the given Matrix to this Matrix.
     *
     * @param matrix - The matrix to append.
     * @return This matrix. Good for chaining method calls.
     */
    public append(matrix: Mat): Mat {
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;

        this.a = (matrix.a * a1) + (matrix.b * c1);
        this.b = (matrix.a * b1) + (matrix.b * d1);
        this.c = (matrix.c * a1) + (matrix.d * c1);
        this.d = (matrix.c * b1) + (matrix.d * d1);

        this.tx = (matrix.tx * a1) + (matrix.ty * c1) + this.tx;
        this.ty = (matrix.tx * b1) + (matrix.ty * d1) + this.ty;

        return this;
    }

    /**
     * [this] × [matrix] 
     * Prepends the given Matrix to this Matrix.
     *
     * @param matrix - The matrix to prepend
     * @return This matrix. Good for chaining method calls.
     */
    public prepend(matrix: Mat): Mat {
        const tx1 = this.tx;

        if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1) {
            const a1 = this.a;
            const c1 = this.c;

            this.a = (a1 * matrix.a) + (this.b * matrix.c);
            this.b = (a1 * matrix.b) + (this.b * matrix.d);
            this.c = (c1 * matrix.a) + (this.d * matrix.c);
            this.d = (c1 * matrix.b) + (this.d * matrix.d);
        }

        this.tx = (tx1 * matrix.a) + (this.ty * matrix.c) + matrix.tx;
        this.ty = (tx1 * matrix.b) + (this.ty * matrix.d) + matrix.ty;

        return this;
    }

    /**
     * Sets the matrix based on all the available properties
     *
     * @return This matrix. Good for chaining method calls.
     */
    public compos(obj: Transformation): Mat {
        return Mat.compos(obj);
    }

    /**
     * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
     *
     * @return The transform with the newly applied properties
     */
    public decompos(): Transformation {
        return Mat.decompos(this);
    }



    /**
     * in progress
     * @param angle - The angle in radians.
     * @return This matrix. Good for chaining method calls.
     */
    // public setRotation(angle: number): Mat {
    //     return this;
    // }

    // public getRotation(): number {
    //     const a = this.a;
    //     const b = this.b;
    //     const d = this.d;

    //     const skewY = Math.atan2(b, a);
    //     let rotation = skewY;

    //     if (a < 0 && d >= 0) {
    //         rotation += (rotation <= 0) ? Math.PI : -Math.PI;
    //     }
    //     return rotation;
    // }


    // public setScale(vec: Vec2): Mat {
    //     const scaleX = vec.x;
    //     const scaleY = vec.y;

    //     const sr = 0;
    //     const cr = 1;
    //     const cy = 1;
    //     const sy = 0;
    //     const nsx = 0;
    //     const cx = 1;

    //     const a = 1 * scaleX;
    //     const b = 0 * scaleX;
    //     const c = -0 * scaleY;
    //     const d = 1 * scaleY;

    //     this.a = (1 * scaleX);
    //     this.b = (1 * 0);
    //     this.c = (1 * 0);
    //     this.d = (1 * scaleY);

    //     return this;
    // }

    // public getScale(): Vec2 {
    //     const a = this.a;
    //     const b = this.b;
    //     const c = this.c;
    //     const d = this.d;

    //     const scaleX = Math.sqrt((a * a) + (b * b));
    //     const scaleY = Math.sqrt((c * c) + (d * d));
    //     return new Vec2(scaleX, scaleY);
    // }

    // public getSkew(): Vec2 {
    //     const a = this.a;
    //     const b = this.b;
    //     const c = this.c;
    //     const d = this.d;

    //     const skewX = -Math.atan2(-c, d);
    //     const skewY = Math.atan2(b, a);

    //     return new Vec2(skewX, skewY);
    // }



    /**
     * Inverts this matrix
     *
     * @return This matrix. Good for chaining method calls.
     */
    public invert(): Mat {
        const a1 = this.a;
        const b1 = this.b;
        const c1 = this.c;
        const d1 = this.d;
        const tx1 = this.tx;
        const n = (a1 * d1) - (b1 * c1);

        this.a = d1 / n;
        this.b = -b1 / n;
        this.c = -c1 / n;
        this.d = a1 / n;
        this.tx = ((c1 * this.ty) - (d1 * tx1)) / n;
        this.ty = -((a1 * this.ty) - (b1 * tx1)) / n;

        return this;
    }

    /**
     * Resets this Matix to an identity (default) matrix.
     *
     * @return This matrix. Good for chaining method calls.
     */
    public identity(): Mat {
        this.a = 1;
        this.b = 0;
        this.c = 0;
        this.d = 1;
        this.tx = 0;
        this.ty = 0;

        return this;
    }

    /**
     * Creates a new Matrix object with the same values as this one.
     *
     * @return A copy of this matrix. Good for chaining method calls.
     */
    public clone(): Mat {
        return new Mat(this.a, this.b, this.c, this.d, this.tx, this.ty);
    }

    /**
     * Changes the values of the given matrix to be the same as the ones in this matrix
     *
     * @param matrix - The matrix to copy from.
     * @return The matrix given in parameter with its values updated.
     */
    public copy(matrix: Mat): Mat {
        matrix.a = this.a;
        matrix.b = this.b;
        matrix.c = this.c;
        matrix.d = this.d;
        matrix.tx = this.tx;
        matrix.ty = this.ty;

        return matrix;
    }

    public toCSSstring(): string {
        return `matrix(${this.a}, ${this.b}, ${this.c}, ${this.d}, ${this.tx}, ${this.ty})`;
    }

    public toString(): string {
        return `a:${this.a} b:${this.b} c:${this.c} d:${this.d} tx:${this.tx} ty:${this.ty}`;
    }

    // public getScale(): number {
    //     return
    // }

    // private sin(): number {
    //     return Math.sin(this.rotation);
    // }
    // private cos(): number {
    //     return Math.sin(this.rotation);
    // }
    // private cosX(): number {
    //     return Math.cos(this.skew.x);
    // }
    // private nsinX(): number {
    //     return -Math.sin(this.skew.x);
    // }
    // private sinY(): number {
    //     return Math.sin(this.skew.y);
    // }
    // private cosY(): number {
    //     return Math.cos(this.skew.y);
    // }

    // private _a(): number {
    //     return this.cos() * this.scale.x;
    // }
    // private _b(): number {
    //     return this.sin() * this.scale.x;
    // }
    // private _c(): number {
    //     return -this.sin() * this.scale.y;
    // }
    // private _d(): number {
    //     return this.cos() * this.scale.y;
    // }
    private get _delta(): number {
        return Math.abs(this.skew.x + this.skew.y);
    }
}
