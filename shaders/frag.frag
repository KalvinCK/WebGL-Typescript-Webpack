#version 300 es

precision mediump float;

out vec4 FragColor;

in vec2 TexCoord;
uniform sampler2D sampler;

uniform vec4 color;

void main()
{
    FragColor = texture(sampler, TexCoord);
    FragColor = FragColor * color;
}