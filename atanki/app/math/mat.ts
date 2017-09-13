import Vec2 from './vec2';

interface Transform {
    position?: {
        x?: number,
        y?: number,
    } | Vec2,
    pivot?: {
        x?: number,
        y?: number,
    } | Vec2,
    scale?: {
        x?: number,
        y?: number,
    } | Vec2,
    rotation?: number,
    skew?: {
        x?: number,
        y?: number,
    } | Vec2,
}

/**
 * The Matrix class as an object
 *  [a, b, tx],
 *  [c, d, ty],
 *  [0, 0, 1]
 * 
 *  [ x cos(), x sin(), translateX]
 *  [-y sin(), y cos(), translateY]
 *  [     0,     0,          1]
 */ 

export default class Mat {

    /**
     * A default (identity) matrix
     */
    public static get IDENTITY() {
        return new Mat()
    }

    /**
     * A temp matrix
     */
    static get TEMP_MATRIX()
    {
        return new Mat();
    }


    public a: number;
    public b: number;
    public c: number;
    public d: number;
    public tx: number;
    public ty: number;

    /**
     * @param {number} [a=1] - x scale / x cos()
     * @param {number} [b=0] - y skew / x sin()
     * @param {number} [c=0] - x skew / -y sin()
     * @param {number} [d=1] - y scale / y cos()
     * @param {number} [tx=0] - x translation
     * @param {number} [ty=0] - y translation
     */
    constructor(a?: number, b?: number, c?: number, d?: number, tx?: number, ty?: number) {
        this.a = a || 1;
        this.b = b || 0;
        this.c = c || 0;
        this.d = d || 1;
        this.tx = tx || 0;
        this.ty = ty || 0;
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

        /**
     * Creates an array from the current Matrix object.
     *
     * @param transpose - Whether we need to transpose the matrix or not
     * @return the newly created array which contains the matrix
     */
    public toArray(transpose?: boolean): Float32Array {
        const array = new Float32Array(9);

        if (transpose)
        {
            array[0] = this.a;
            array[1] = this.b;
            array[2] = 0;
            array[3] = this.c;
            array[4] = this.d;
            array[5] = 0;
            array[6] = this.tx;
            array[7] = this.ty;
            array[8] = 1;
        }
        else
        {
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
    public apply(pos: Vec2, newPos: Vec2): Vec2 {
        newPos = newPos || new Vec2();

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
    public applyInverse(pos: Vec2, newPos: Vec2): Vec2 {
        newPos = newPos || new Vec2();

        const id = 1 / ((this.a * this.d) + (this.c * -this.b));

        const x = pos.x;
        const y = pos.y;

        newPos.x = (this.d * id * x) + (-this.c * id * y) + (((this.ty * this.c) - (this.tx * this.d)) * id);
        newPos.y = (this.a * id * y) + (-this.b * id * x) + (((-this.ty * this.a) + (this.tx * this.b)) * id);

        return newPos;
    }

    /**
     * Translates the matrix on the x and y.
     *
     * @param x How much to translate x by
     * @param y How much to translate y by
     * @return This matrix. Good for chaining method calls.
     */
    translate(x: number, y: number): Mat {
        this.tx += x;
        this.ty += y;

        return this;
    }

    /**
     * Applies a scale transformation to the matrix.
     *
     * @param x The amount to scale horizontally
     * @param y The amount to scale vertically
     * @return This matrix. Good for chaining method calls.
     */
    public scale(x: number, y: number): Mat {
        this.a *= x;
        this.d *= y;
        this.c *= x;
        this.b *= y;
        this.tx *= x;
        this.ty *= y;

        return this;
    }

    /**
     * Applies a rotation transformation to the matrix.
     *
     * @param angle - The angle in radians.
     * @return This matrix. Good for chaining method calls.
     */
    public rotate(angle: number): Mat {
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
     * Sets the matrix based on all the available properties
     *
     * @param x - Position on the x axis
     * @param y - Position on the y axis
     * @param pivotX - Pivot on the x axis
     * @param pivotY - Pivot on the y axis
     * @param scaleX - Scale on the x axis
     * @param scaleY - Scale on the y axis
     * @param rotation - Rotation in radians
     * @param skewX - Skew on the x axis
     * @param skewY - Skew on the y axis
     * @return This matrix. Good for chaining method calls.
     */
    public setTransform(transform: Transform): Mat {
        const x = transform.position.x || 0;
        const y = transform.position.y || 0;
        const pivotX = transform.pivot.x || 0;
        const pivotY = transform.pivot.y || 0;
        const scaleX = transform.scale.x || 1;
        const scaleY = transform.scale.y || 1;
        const rotation = transform.rotation || 0;
        const skewX = transform.skew.x || 0;
        const skewY = transform.skew.y || 0;

        const sr = Math.sin(rotation);
        const cr = Math.cos(rotation);
        const cy = Math.cos(skewY);
        const sy = Math.sin(skewY);
        const nsx = -Math.sin(skewX);
        const cx = Math.cos(skewX);

        const a = cr * scaleX;
        const b = sr * scaleX;
        const c = -sr * scaleY;
        const d = cr * scaleY;

        this.a = (cy * a) + (sy * c);
        this.b = (cy * b) + (sy * d);
        this.c = (nsx * a) + (cx * c);
        this.d = (nsx * b) + (cx * d);

        this.tx = x + ((pivotX * a) + (pivotY * c));
        this.ty = y + ((pivotX * b) + (pivotY * d));

        return this;
    }

    /**
     * Prepends the given Matrix to this Matrix.
     *
     * @param matrix - The matrix to prepend
     * @return This matrix. Good for chaining method calls.
     */
    public prepend(matrix: Mat): Mat {
        const tx1 = this.tx;

        if (matrix.a !== 1 || matrix.b !== 0 || matrix.c !== 0 || matrix.d !== 1)
        {
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
     * Decomposes the matrix (x, y, scaleX, scaleY, and rotation) and sets the properties on to a transform.
     *
     * @param transform - The transform to apply the properties to.
     * @return The transform with the newly applied properties
     */
    public decompose(transform: Transform):Transform
    {
        // sort out rotation / skew..
        const a = this.a;
        const b = this.b;
        const c = this.c;
        const d = this.d;

        const skewX = -Math.atan2(-c, d);
        const skewY = Math.atan2(b, a);

        const delta = Math.abs(skewX + skewY);

        if (!transform.skew) {
            transform.skew = new Vec2;
        }
        if (!transform.position) {
            transform.position = new Vec2;
        }
        if (!transform.scale) {
            transform.scale = new Vec2;
        }

        if (delta < 0.00001)
        {
            transform.rotation = skewY;

            if (a < 0 && d >= 0)
            {
                transform.rotation += (transform.rotation <= 0) ? Math.PI : -Math.PI;
            }

            transform.skew.x = transform.skew.y = 0;
        }
        else
        {
            transform.skew.x = skewX;
            transform.skew.y = skewY;
        }

        // next set scale
        transform.scale.x = Math.sqrt((a * a) + (b * b));
        transform.scale.y = Math.sqrt((c * c) + (d * d));

        // next set position
        transform.position.x = this.tx;
        transform.position.y = this.ty;

        return transform;
    }

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
    public identity(): Mat
    {
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
        return 'matrix('+ this.a +', '+ this.b +', '+ this.c +', '+ this.d +', '+ this.tx +', '+ this.ty +');'
    }
}

