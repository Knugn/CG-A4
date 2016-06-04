// Vertex shader
#version 150
#extension GL_ARB_explicit_attrib_location : require

layout(location = 0) in vec4 a_position;

out float v_texcoord;

//uniform mat4 u_mvp;

void main()
{
    v_texcoord = 0.5 * a_position.x + 0.5;
    gl_Position = vec4(a_position.xyz,1);
}
