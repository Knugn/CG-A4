// Fragment shader
#version 150

#define MODE_TEXCOORD_AS_RG -1
#define MODE_FRONT_TEXTURE -2
#define MODE_BACK_TEXTURE -3
#define MODE_TRANSFER_FUNCTION_TEXTURE -4
#define MODE_MAX_INTENSITY 0
#define MODE_FRONT_TO_BACK_ALPHA 1
//#define MODE_ISOSURFACE_BLINN_PHONG 2

uniform int u_color_mode;
uniform int u_use_gamma_correction;
uniform int u_use_color_inversion;

uniform sampler3D u_volumeTexture;
uniform sampler2D u_backFaceTexture;
uniform sampler2D u_frontFaceTexture;
uniform sampler1D u_transferFuncTexture;

uniform float u_rayStepLength;
uniform float u_density;

in vec2 v_texcoord;

out vec4 frag_color;


float rayMaxIntensity(vec3 front, vec3 front2back, int numIterations) {
	float maxIntensity = 0.0;
	for (int i = 0; i < numIterations; i++) {
		vec3 samplePoint = front + front2back * (i + 0.5) / numIterations;
		float volumeSample = texture(u_volumeTexture, samplePoint).r;
		if (maxIntensity < volumeSample)
			maxIntensity = volumeSample;
	}
	return maxIntensity;
}

vec3 sampleToColor(float sample) {
	return texture(u_transferFuncTexture, sample).rgb;
}

float sampleToOcclusion(float sample) {
	return texture(u_transferFuncTexture, sample).a;
}

vec4 rayFrontToBackAlpha(vec3 front, vec3 front2back, int numIterations) {
	float dt = length(front2back) / numIterations; // delta step length
	float dm = dt * u_density; // delta mass per step
	vec3 C = vec3(0.0);
	float A = 0.0;
	for (int i = 0; i < numIterations; i++) {
		vec3 samplePoint = front + front2back * (i + 0.5) / numIterations;
		float volumeSample = texture(u_volumeTexture, samplePoint).r;
		C += (1-A) * sampleToColor(volumeSample) * dm;
		A += (1-A) * (1 - exp(-sampleToOcclusion(volumeSample) * dm));
	}
	return vec4(C,A);
}

vec3 gamma_correction(vec3 linear_color)
{
	return pow(linear_color, vec3(1.0/2.2));
}

void main()
{
	vec3 front = texture(u_frontFaceTexture, v_texcoord).xyz;
	vec3 back = texture(u_backFaceTexture, v_texcoord).xyz;
	vec3 front2back = back - front;
	int numIterations = 0;
	if (u_rayStepLength > 0)
		numIterations = int(ceil(length(front2back) / u_rayStepLength));


    vec4 color = vec4(0.0);
	switch(u_color_mode) {
		case MODE_TEXCOORD_AS_RG:
			color.rg = v_texcoord;
			color.a = 1.0;
			break;
		case MODE_FRONT_TEXTURE:
			color = texture(u_frontFaceTexture, v_texcoord);
			break;
		case MODE_BACK_TEXTURE:
			color = texture(u_backFaceTexture, v_texcoord);
			break;
		case MODE_TRANSFER_FUNCTION_TEXTURE:
			color = texture(u_transferFuncTexture, v_texcoord.x);
			break;
		case MODE_MAX_INTENSITY:
			float maxIntensity = rayMaxIntensity(front, front2back, numIterations);
			color = vec4(maxIntensity);
			break;
		case MODE_FRONT_TO_BACK_ALPHA:
			color = rayFrontToBackAlpha(front, front2back, numIterations);
			break;
		default:
			break;
	}

	if (u_use_gamma_correction != 0)
		color.rgb = gamma_correction(color.rgb);

	if (u_use_color_inversion != 0)
		color.rgb = vec3(1.0) - color.rgb;

    frag_color = color;
}
