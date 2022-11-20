#version 300 es

in vec3 aPos;
in vec2 aTexCoords;

out vec2 TexCoord;

uniform mat4 model;
uniform mat4 projection;

void main() 
{
    TexCoord = aTexCoords;
    gl_Position = projection * model * vec4(aPos.xy, -2.0, 1.0);
}