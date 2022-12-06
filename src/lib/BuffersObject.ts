import Program from "./Program";

export default class BufferObject
{

    private gl = Program.gl;
    private Handle: WebGLBuffer;
    private bufferType

    constructor(vertexArray: Float32Array, buffer_type: number)
    {
        this.bufferType = buffer_type;
        
        this.Handle = this.gl.createBuffer();
        this.Bind();
        this.gl.bufferData(this.bufferType, vertexArray, this.gl.STATIC_DRAW);

    }
    Bind()
    {
        this.gl.bindBuffer(this.bufferType, this.Handle);
    }
}

