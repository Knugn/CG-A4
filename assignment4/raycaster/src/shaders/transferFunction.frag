// Fragment shader
#version 150

in float v_texcoord;

out vec4 frag_color;

#define MAX_NUM_COLORS 16
#define MAX_DEGREE 1

layout (std140) uniform bSpline
{
	vec4 colors[MAX_NUM_COLORS];
	float knots[MAX_NUM_COLORS + MAX_DEGREE + 1];
	int num_colors;
	int degree;
} ubo_bSpline;

float basis_function_j0(int i, float t)
{
	if (ubo_bSpline.knots[i] <= t && t < ubo_bSpline.knots[i+1])
		return 1;
	return 0;
}

float basis_function_j1(int i, float t)
{
	float ti0 = ubo_bSpline.knots[i];
	float ti1 = ubo_bSpline.knots[i+1];
	float tij0 = ubo_bSpline.knots[i+1+0];
	float tij1 = ubo_bSpline.knots[i+1+1];
	float value = 0;
	if (tij0 != ti0)
		value += (t-ti0) / (tij0-ti0) * basis_function_j0(i,t);
	if (tij1 != ti1)
		value += (tij1-t) / (tij1-ti1) * basis_function_j0(i+1,t);
	return value;
}

vec4 spline_color(float t) {
	vec4 color = vec4(0,0,0,0);
	for (int i = 0; i < ubo_bSpline.num_colors; i++) {
		color += ubo_bSpline.colors[i] * basis_function_j1(i,t);
	}
	return color;
}

void main()
{
	float t = v_texcoord;
	frag_color = spline_color(t);
}
