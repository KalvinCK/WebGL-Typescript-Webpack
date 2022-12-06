import { vec2, vec3, vec4, mat4 } from "gl-matrix";
import Program from "./Program";

// Essa classe e feita de forma para facilitar a forma de como utilizamos os nossos shaders

//-------------------------------------------------------------------
export default class ShaderProgram
{
    // atributos privados
    private gl= Program.gl;
    private Programa: WebGLProgram;
    private uniformLocations = new Map<string, WebGLUniformLocation>();

    // init contructor
    // ------------------------------------------------------------------------
    constructor(vert_shader: string, frag_shader: string)
    {
        // compila os shaders
        const vertexShader = this.CompileShader(vert_shader, this.gl.VERTEX_SHADER);
        const fragmentShader = this.CompileShader(frag_shader, this.gl.FRAGMENT_SHADER);

        // criamos o programaShader principal
        this.Programa = this.gl.createProgram();   
        
        // anexa os dois shaders que acabamos de criar ao programa principal
        this.gl.attachShader(this.Programa, vertexShader);
        this.gl.attachShader(this.Programa, fragmentShader);

        // compile o program principal
        this.gl.linkProgram(this.Programa);
        
        // desanexa e apague os dois shader pois eles ja foram vinculados ao programa principal
        this.gl.detachShader(this.Programa, vertexShader);
        this.gl.detachShader(this.Programa, fragmentShader);
        this.gl.deleteShader(vertexShader);
        this.gl.deleteShader(fragmentShader);
    
        // verifica se o shader está ok!
        if (!this.gl.getProgramParameter(this.Programa, this.gl.LINK_STATUS)) 
        {
            console.log('Erro ao iniciar o ShaderProgram ' + this.gl.getProgramInfoLog(this.Programa));
        }
        
        // ---------------------------------------------------------------
        // agora vamos salvar todos os nossos unifoms
        // porque é bem pesado acessá-los durante a rederização.
        this.uniformLocations = new Map();
        var countUniforms = this.gl.getProgramParameter(this.Programa, this.gl.ACTIVE_UNIFORMS);
        
        for(let i = 0; i < countUniforms; ++i)
        {
            // const info = new WebGLActiveInfo();
            const info = this.gl.getActiveUniform(this.Programa, i);
            const uniform = this.gl.getUniformLocation(this.Programa, info.name); 
            
            if(info.size > 1)
            {
                for(let j = 0; j < info.size; j++)
                {
                    const arrayName = `${info.name.substring(0, info.name.length - 2)}${j}]`;
                    const arrayUniform = this.gl.getUniformLocation(this.Programa, arrayName); 

                    this.uniformLocations.set(arrayName, arrayUniform);                    
                }
            }
            else
            {

                this.uniformLocations.set(info.name, uniform);
            }
        }
    }
    // ------------------------------------------------------------------------
    // ativa o estado do shader
    Use()
    {
        this.gl.useProgram(this.Programa);
    }
    // chame ao término do programa
    Delete()
    {
        this.gl.deleteShader(this.Programa);
    }
    
    // serao usados para setar dados nos nossos shaders, como vc pode ver podemos enviar qualquer tipo de valor
    // para os nosso shaders 
    // ------------------------------------------------------------------------
    AttributeLocation(attribute_name: string) : GLint
    {
        return this.gl.getAttribLocation(this.Programa, attribute_name);
    }
    setBool(name: string, value: boolean)
    {
        this.gl.uniform1i(this.uniformLocations.get(name), value ? 1 : 0);
    }
    setOneNumber(name: string, value: number)
    {
        this.gl.uniform1i(this.uniformLocations.get(name), value);
    }
    setVec2(name: string, value: vec2)
    {
        this.gl.uniform2fv(this.uniformLocations.get(name), value);
    }
    setVec3(name: string, value: vec3)
    {
        this.gl.uniform3fv(this.uniformLocations.get(name), value);
    }
    setVec4(name: string, value: vec4)
    {
        this.gl.uniform4fv(this.uniformLocations.get(name), value);
    }
    setColor4(name: string, value: number[])
    {
        this.gl.uniform4fv(this.uniformLocations.get(name), value);
    }
    setMatrix4(name: string, value: mat4)
    {
        this.gl.uniformMatrix4fv(this.uniformLocations.get(name), false, value);
    }
    // ------------------------------------------------------------------------
    // parte privada
    private CompileShader(shader_code: string, type : number) 
    {
        const shader = this.gl.createShader(type);

        
        this.gl.shaderSource(shader, shader_code);
        
        this.gl.compileShader(shader);
        
        var result = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
        if (result) 
        {
            return shader;
        }
        else
        {
            var type_text = "";
            if(type === this.gl.VERTEX_SHADER)
            {
                type_text = "Vertex Shader";
            }
            else if(type === this.gl.FRAGMENT_SHADER)
            {
                type_text = "Fragment Shader";
            }
            console.log(`Erro ao compilar o shader: ${type_text} ${this.gl.getShaderInfoLog(shader)}`);
            this.gl.deleteShader(shader);
            return null;
            
        }
        
    }
}