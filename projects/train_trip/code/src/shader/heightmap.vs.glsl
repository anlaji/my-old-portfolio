// Phong Vertex Shader

attribute vec3 a_position;
attribute vec3 a_normal;

//given texture coordinates per vertex
attribute vec2 a_texCoord;

uniform mat4 u_modelView;
uniform mat3 u_normalMatrix;
uniform mat4 u_projection;
uniform mat4 u_invView;
uniform sampler2D u_heightmap;
uniform vec3 u_lightPos;

//output of this shader
varying vec3 v_normalVec;
varying vec3 v_eyeVec;
varying vec3 v_lightVec;
varying float yAmount;

//define output variable for texture coordinates
varying vec2 v_texCoord;
varying vec3 v_color;

void main() {

	yAmount = texture2D(u_heightmap, a_texCoord).r * 10.0;

	//compute vertex position in eye space
	vec4 eyePosition = u_modelView * vec4(a_position.x, yAmount, a_position.z, 1.0);
  v_normalVec = u_normalMatrix * a_normal;

  v_eyeVec = -eyePosition.xyz;
	v_lightVec = u_lightPos - eyePosition.xyz;

	//pass on texture coordinates to fragment shader
	v_texCoord = a_texCoord;

	gl_Position = u_projection * eyePosition;
	v_color = vec3(0.1,1,0.1);
}
