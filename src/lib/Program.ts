import { mat4, vec2, vec3 } from "gl-matrix";

export default class Program
{
    static Size = vec2.create();
    static Width: number;
    static Height: number;
    static gl:  WebGL2RenderingContext;
}
