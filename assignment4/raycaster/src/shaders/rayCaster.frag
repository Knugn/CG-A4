// Fragment shader
#version 150

in vec2 v_texcoord;

out vec4 frag_color;

uniform sampler3D u_volumeTexture;
uniform sampler2D u_backFaceTexture;
uniform sampler2D u_frontFaceTexture;

void main()
{
    vec4 color = vec4(0.0);

    color.rg = v_texcoord;
    color.a = 1.0;

    frag_color = color;
}
