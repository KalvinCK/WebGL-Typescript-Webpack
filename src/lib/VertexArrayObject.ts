import Program from "./Program";
import BufferObject from "./BuffersObject";

export default class VertexArrayObject
{
    private gl = Program.gl;
    private Handle: WebGLVertexArrayObject;

    constructor()
    {
        this.Handle = this.gl.createVertexArray();
        this.Bind();
    }
    VinculeBufferFLoat(bufferObject : BufferObject)
    {
        this.Bind();
        bufferObject.Bind();
    }
    VertexAtributePointer(index: number, count: number, type: number, vertexSize: number, offSet: number)
    {
        this.gl.vertexAttribPointer(index, count, type, false, vertexSize * 4, offSet * 4);
        this.gl.enableVertexAttribArray(index);
    }
    Bind()
    {
        this.gl.bindVertexArray(this.Handle);
    }
}