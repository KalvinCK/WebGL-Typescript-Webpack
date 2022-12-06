// import libs
import { mat4, vec2, vec3 } from "gl-matrix";

// my Imports
import ShaderProgram from "./lib/ShaderProgram";
import TextureProgram from "./lib/TextureProgram";
import Colors from "./lib/Colors";
import Program from "./lib/Program";
import Timer from "./lib/Timer";

import BufferObject from "./lib/BuffersObject";
import VertexArrayObject from "./lib/VertexArrayObject";

// import resources
import "./css/style.css";
const img_texture = require("./img/goku.jpg");
const img_icon = require("./img/webgl_logo.svg");
const gl_logo = require("./img/webgl_logo.svg");

import * as vertex_code from "./shaders/vert.vert";
import * as fragment_code from "./shaders/frag.frag";


// ----------------------------------------------------------------------------------------
// WebGl 2.0
function main()
{
    // set icon html  
    const icon = document.createElement("link");
    icon.rel = "icon";
    icon.type = "image/png";
    icon.href = img_icon;
    document.head.appendChild(icon);
    

    const logo = document.createElement("img");
    logo.setAttribute("id", "logo");
    logo.src = gl_logo;
    logo.style.position = "absolute";
    logo.style.width = logo.style.height = "150px";
    logo.style.marginTop = window.innerHeight - 200 + "px";
    logo.style.marginLeft = window.innerWidth - 210 + "px";   
    document.body.appendChild(logo);

    
    // cria um elemento do tipo canvas e seta no html
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 5;
    document.body.appendChild(canvas);

    // cria um contexto webgl  apartir do canvas recem criado.
    const gl = canvas.getContext("webgl2");

    Program.gl = gl;
    Program.Width  = window.innerWidth;
    Program.Height = window.innerHeight;

    if(!gl)
    {
        alert("O navegador não suporta webgl2");
    }
    
    // a partir desse momento podemos realizar chamadas ao web gl com sucesso

    // essa funcao vai ser chamada toda vez que o cliente redimensionar a janela
    // precisamos dela para configurar a viewport de forma correta
    function WinResizeSize()
    {

        Program.Width = window.innerWidth;
        Program.Height = window.innerHeight;

        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight - 5;
        
        logo.style.marginLeft = window.innerWidth - 210 + "px";    
        logo.style.marginTop = window.innerHeight - 200 + "px";

        gl.viewport(0, 0, window.innerWidth, window.innerHeight);
    }
    window.onresize = WinResizeSize;

  

    // const timer = new Timer();
    // criamos 2 instancias                        
    const Shader = new ShaderProgram(vertex_code.default, fragment_code.default);
    const Texture = new TextureProgram(img_texture);

    const positions = 
    [
        // positions        // texture Coords
        -1.0,  1.0, 0.0,    0.0, 1.0,
        -1.0, -1.0, 0.0,    0.0, 0.0,
         1.0,  1.0, 0.0,    1.0, 1.0,
         1.0, -1.0, 0.0,    1.0, 0.0,
    ];

    const Vao = new VertexArrayObject();
    const Vbo = new BufferObject(new Float32Array(positions), gl.ARRAY_BUFFER);
    
    Vao.VinculeBufferFLoat(Vbo);
    
    Vao.VertexAtributePointer(0, 3, gl.FLOAT, 5, 0);
    Vao.VertexAtributePointer(1, 2, gl.FLOAT, 5, 3);


    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clearColor(0.1, 0.1, 0.1, 1.0);

    const fieldOfView = 90 * Math.PI / 180;   // in radians
    const aspect = Program.Width / Program.Height;
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, 0.0, 100.0);

    
    const position = vec3.create();
    vec3.set(position, 0.0, 0.0, -2.0);

    const modelViewMatrix = mat4.create();
    mat4.translate(modelViewMatrix, modelViewMatrix, position);
    
    
    // Aqui iniciamos o loop
    // todo aplicativo grafico possui um loop em WebGl não é diferente 
    function render()
    {
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        Vao.Bind();

        Shader.Use();
        Shader.setColor4("color", Colors.Cyan);
        
        Texture.Use(gl.TEXTURE0);
        Shader.setOneNumber("sampler", 0);

        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
        // ativamos o loop para esta função
        requestAnimationFrame(render);
    }
    // chamamos a funcão novamente com
    requestAnimationFrame(render);
    
    // iniciamos a nossa classe timer
    const timer = new Timer();

    // quando o cliete encerrar a aba no navegador isso sera chamado para apagarmos tudo dentro do contexto webgl
    function WhenToCLose()
    {
        Shader.Delete();
        Texture.Delete();
    }
    window.onbeforeunload = WhenToCLose;
    
}

main();
