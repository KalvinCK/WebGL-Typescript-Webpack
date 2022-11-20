#version 300 es

layout( location = 0) in vec3 aPos;
layout( location = 1) in vec2 aTexCoords;

out vec2 TexCoord;

uniform mat4 model;
uniform mat4 projection;

void main() 
{
    TexCoord = aTexCoords;
    gl_Position = projection * model * vec4(aPos, 1.0);
}