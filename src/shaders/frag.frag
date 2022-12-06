#version 300 es

precision highp float;

in vec2 TexCoord;
out vec4 FragColor;

uniform sampler2D sampler;
uniform vec4 color;

void main()
{
    FragColor = texture(sampler, TexCoord);
    FragColor = FragColor * color;
}
