// Phong Vertex Shader

attribute vec3 a_position;
attribute vec3 a_normal;

//given texture coordinates per vertex
attribute vec2 a_texCoord;

uniform mat4 u_modelView;
uniform mat3 u_normalMatrix;
uniform mat4 u_projection;
uniform mat4 u_invView;
uniform vec3 u_lightPos;

//output of this shader
varying vec3 v_normalVec;
varying vec3 v_eyeVec;
varying vec3 v_lightVec;

//define output variable for texture coordinates
varying vec2 v_texCoord;

void main() {
	//compute vertex position in eye space
	vec4 eyePosition = u_modelView * vec4(a_position,1);
  // orient the normals and pass to the fragment shader
  v_normalVec = u_normalMatrix * a_normal;

  v_eyeVec = -eyePosition.xyz;

	// compute the vector of the surface to the light
  // and pass it to the fragment shader
	v_lightVec = u_lightPos - eyePosition.xyz;

	//pass on texture coordinates to fragment shader
	v_texCoord = a_texCoord;
	// Multiply the position by the matrix.
	gl_Position = u_projection * eyePosition;
}
