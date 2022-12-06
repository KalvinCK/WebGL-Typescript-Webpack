#version 300 es

layout( location = 0) in vec3 aPos;
layout( location = 1) in vec2 aTexCoords;

out vec2 TexCoord;
// uniform mat4 projection;
// uniform mat4 view;

void main() 
{
    TexCoord = aTexCoords;
    gl_Position = vec4(aPos, 1.0);
}