
// essa classe e ausada para carregar texturas, facilitando bastante a nossa vida 
export default class TextureProgram
{
    #gl;
    #handle;

    // init 
    constructor(context_gl, img_url)
    {
        
        this.#gl = context_gl;

        // criamos o buffer de textura
        this.#handle = this.#gl.createTexture();
        this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#handle);
        
        this.#gl.pixelStorei(this.#gl.UNPACK_FLIP_Y_WEBGL, true);
        
        
        const img = new Image();
        img.src = img_url;
        
        
        img.onload = () =>
        {

            const internalFormat = this.#gl.RGBA;
            const format = this.#gl.RGBA;
            const type = this.#gl.UNSIGNED_BYTE;


            this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#handle);
            this.#gl.texImage2D(this.#gl.TEXTURE_2D, 0, internalFormat, img.width, img.height, 0, format, type, img);


            this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_S, this.#gl.CLAMP_TO_EDGE);
            this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_WRAP_T, this.#gl.CLAMP_TO_EDGE);
            this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MIN_FILTER, this.#gl.LINEAR);
            this.#gl.texParameteri(this.#gl.TEXTURE_2D, this.#gl.TEXTURE_MAG_FILTER, this.#gl.LINEAR);
    
            this.#gl.generateMipmap(this.#gl.TEXTURE_2D);
        }
    }
    Use(Texture_unit)
    {
        this.#gl.activeTexture(this.#gl.TEXTURE0 + Texture_unit);
        this.#gl.bindTexture(this.#gl.TEXTURE_2D, this.#handle);
    }
    Delete()
    {
        this.#gl.deleteTexture(this.#handle);
    }
}