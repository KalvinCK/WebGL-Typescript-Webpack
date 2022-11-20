// import libs
import { mat4, vec2, vec3 } from "gl-matrix";

// import resources
import "./style.css";
import img_texture from "../img/goku.jpg";
import img_icon from "../img/webgl_logo.svg";

// my Imports
import ShaderProgram from "./ShaderProgram";
import TextureProgram from "./TextureProgram";

// import shaders code
import vertex_code from "../shaders/vert.vert";
import fragment_code from "../shaders/frag.frag";
import Colors from "./Colors";

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
    
    
    // cria um elemento do tipo canvas e seta no html
    const canvas = document.createElement("canvas");
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 5;
    document.body.appendChild(canvas);

    // cria um contexto webgl 
    // a partir desse momento podemos realizar chamadas ao web gl com sucesso
    const gl = canvas.getContext("webgl2");

    if(!gl) alert("O navegador não suporta webgl2");

    // essa funcao e ser chamada toda vez que reordenamos a janela
    // precisamos dela para configurar a viewport de forma correta
    const WindowSize = vec2.create();
    vec2.set(WindowSize, canvas.width, canvas.height);
    function WinResizeSize()
    {
        vec2.set(WindowSize, window.innerWidth, window.innerHeight);

        canvas.width = WindowSize[0];
        canvas.height = WindowSize[1];

        gl.viewport(0, 0, WindowSize[0], WindowSize[1]);
    }
    window.onresize = WinResizeSize;
                            
    const Shader = new ShaderProgram(gl, vertex_code, fragment_code);
    const Texture = new TextureProgram(gl, img_texture);

    // o vao nada mais e que um buffer principal, todas as chamadas para buffers de vertices subsequentes serao "inseridas" dentro dele,
    // assim caso quisermos utilizalo basta dar um bind a ele;
    const Vao = gl.createVertexArray();
    gl.bindVertexArray(Vao);
    
    const positions = 
    [
        // positions        // texture Coords
        -0.5,  0.5, 1.0,    0.0, 1.0,
        -0.5, -0.5, 1.0,    0.0, 0.0,
         0.5,  0.5, 1.0,    1.0, 1.0,
         0.5, -0.5, 1.0,    1.0, 0.0,
    ];

    const vertexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, vertexBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(positions), gl.STATIC_DRAW);
    
    const floatSizeByte = new Float32Array([0.0]).byteLength;

    var aVertexPosition = Shader.AttributeLocation("aPos");
    gl.enableVertexAttribArray(aVertexPosition);
    // parametros: 
    // 1°: O indice localizado no shader que acabamos de pegar (codigo acima).
    // 2°: O tamanho de elementos que vamos enviar para o shader.
    // 3°: O tipo de dado que estamos usando.
    // 4°: Se os valores estão normalizados?, na maioria das vezes será sempre false.
    // 5°: A quantidade de elemetos em relaçao aos vertices, no caso 3 valores para posições
    //     e 4 valores para cores, somando tudo e multiplicando-os por 4, o motivo é simples 
    //     buffers trabalham em cima de valores em bytes, por isso que estamos muntiplicando por 4 
    //     porque 1 float = 4 bytes.
    // 6°: O passo de onde gostariamos de começar, pense o seguinte nossos dados estão todos juntos com
    //     posições e cores, por esse motivo podemos "instruir" o WebGL a começar de um determinado ponto
    //     no array.

    gl.vertexAttribPointer(aVertexPosition, 3, gl.FLOAT, false, 5 * floatSizeByte, 0);
    
    var aColors = Shader.AttributeLocation("aTexCoords");
    gl.enableVertexAttribArray(aColors);
    gl.vertexAttribPointer(aColors, 2, gl.FLOAT, false, 5 * floatSizeByte, floatSizeByte * 3);

    gl.viewport(0, 0, canvas.width, canvas.height);
    gl.clearDepth(1.0);                 // Clear everything
    gl.enable(gl.DEPTH_TEST);           // Enable depth testing
    gl.depthFunc(gl.LEQUAL);            // Near things obscure far things
    gl.clearColor(0.1, 0.1, 0.1, 1.0);

    const fieldOfView = 45 * Math.PI / 180;   // in radians
    const aspect = WindowSize[0] / WindowSize[1];
    
    const projectionMatrix = mat4.create();
    mat4.perspective(projectionMatrix, fieldOfView, aspect, 0.1, 100.0);
    
    const position = vec3.create();

    // vec3.set(position, 0.0, 0.0, -5.0);
    
    // Aqui iniciamos o loop
    // todo aplicativo grafico possui um loop em WebGl não é diferente 
    var then = 0;
    function render(now)
    {
        now *= 0.001;
        const deltatime = now - then;
        then = now;
        
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
        
        
        gl.bindVertexArray(Vao);
        
        const modelViewMatrix = mat4.create();
        
        
        mat4.translate(modelViewMatrix, modelViewMatrix, position);
        
        
        Shader.Use();
        Shader.setColor4("color", Colors.Red);

        Shader.setMatrix4("model", modelViewMatrix);
        Shader.setMatrix4("projection", projectionMatrix);
        
        Texture.Use(0);
        Shader.setTexture("sampler", 0);
        
        gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);

        requestAnimationFrame(render);
    }
    requestAnimationFrame(render);

    function WhenToCLose()
    {
        Shader.Delete();
        Texture.Delete();
        window.alert("janela esta fechando");

        gl.deleteVertexArray(Vao);
        gl.deleteBuffer(vertexBuffer);
    }
    window.onbeforeunload = WhenToCLose;
    
}

main();