//'use strict';

/**
 * the OpenGL context
 * @type {WebGLRenderingContext}
 */
//the OpenGL context
var gl = null;
/**
 * our shader program
 * @type {WebGLProgram}
 */
var shaderProgram = null;
var context;

//scene graph nodes
var root = null;
var rootnofloor = null;
var rotateLight,
  translateLight,
  light,
  rotateBarNode,
  rotateBarTrainNode,
  rotateBirdNode,
  wheelNode;
var shadowNode;

const camera = {
  rotation: {
    x: 0,
    y: 0,
  },
  position: [8, 4, -20],
  lookAt: [-15, 0, 0],
  direction: vec3.set(vec3.create(), 1, 0, 0),
  upwards: [0, 1, 0],
};
//while animating the camera it is not possible to control it
var cameraIsLocked = true;

//textures
var images = [];
var textures = [];
var renderTargetColorTexture;
var renderTargetDepthTexture;
var floorTexture;

//framebuffer variables
var renderTargetFramebuffer;

var framebufferWidth = 1024;
var framebufferHeight = 1024;
var canvasWidth = 1024;
var canvasHeight = 1024;

//camera and projection settings
var animatedAngle = 0;

var trainTransformationMatrix = null;

//links to buffer stored on the GPU
var cubeVertexBuffer,
  cubeColorBuffer,
  cubeIndexBuffer,
  cubeNormalBuffer,
  cubeTextureCoordBuffer;
var tunnelVertexBuffer,
  tunnelColorBuffer,
  tunnelIndexBuffer,
  tunnelNormalBuffer;
var trainVertexBuffer, trainColorBuffer, trainIndexBuffer, trainNormalBuffer;

//VERTICES DEFINITION OF OBJECTS:

var s = 0.3; //size of cube
var cubeVertices = new Float32Array([
  -s,
  -s,
  -s,
  s,
  -s,
  -s,
  s,
  s,
  -s,
  -s,
  s,
  -s, // back face
  -s,
  -s,
  s,
  s,
  -s,
  s,
  s,
  s,
  s,
  -s,
  s,
  s, //front face
  -s,
  -s,
  -s,
  -s,
  s,
  -s,
  -s,
  s,
  s,
  -s,
  -s,
  s, //left face
  s,
  -s,
  -s,
  s,
  s,
  -s,
  s,
  s,
  s,
  s,
  -s,
  s, //right face
  -s,
  -s,
  -s,
  -s,
  -s,
  s,
  s,
  -s,
  s,
  s,
  -s,
  -s, //bottom face
  -s,
  s,
  -s,
  -s,
  s,
  s,
  s,
  s,
  s,
  s,
  s,
  -s, //top face
]);

var cubeColors = new Float32Array([
  0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 0, 1, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0,
]);

var cubeIndices = new Float32Array([
  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
  15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23,
]);

var cubeNormals = new Float32Array([
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0, // back face
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0, //front face
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0, //left face
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0, //right face
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0, //bottom face
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0, //top face
]);

const cubeTextureCoordinates = [
  // Front
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Back
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Top
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Bottom
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Right
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
  // Left
  0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0,
];

var st = 0.3; //size of tunnel dimmensions
var tunnelVertices = new Float32Array([
  -st,
  -st,
  -st,
  -st,
  st / 3,
  -st,
  -st,
  st / 3,
  st,
  -st,
  -st,
  st, //first face
  st,
  -st,
  -st,
  st,
  st / 3,
  -st,
  st,
  st / 3,
  st,
  st,
  -st,
  st, // fifth face
  -st / 3,
  st,
  -st,
  -st / 3,
  st,
  st,
  st / 3,
  st,
  st,
  st / 3,
  st,
  -st, //third face
  -st,
  st / 3,
  -st,
  -st / 3,
  st,
  -st,
  -st / 3,
  st,
  st,
  -st,
  st / 3,
  st, //second face
  st / 3,
  st,
  -st,
  st / 3,
  st,
  st,
  st,
  st / 3,
  st,
  st,
  st / 3,
  -st, // fourth face
]);

var tunnelColors = new Float32Array([
  0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 0, 1, 1, 0,
]);

var tunnelIndices = new Float32Array([
  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
  15, 16, 17, 18, 16, 18, 19,
]);

var tunnelNormals = new Float32Array([
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0, //first face
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0, // fifth face
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0, //third face
  0.4,
  0.91,
  0.0,
  0.4,
  0.91,
  0.0,
  0.4,
  0.91,
  0.0,
  0.4,
  0.91,
  0.0, //second face
  -0.8,
  -0.6,
  0.0,
  -0.8,
  -0.6,
  0.0,
  -0.8,
  -0.6,
  0.0,
  -0.8,
  -0.6,
  0.0, // fourth face
]);

var t = 0.1; //size of train dimmensions
var trainVertices = new Float32Array([
  -t,
  -t,
  -t,
  -t,
  t / 3,
  -t,
  -t,
  t / 3,
  t,
  -t,
  -t,
  t, //first face
  t,
  -t,
  -t,
  t,
  t / 3,
  -t,
  t,
  t / 3,
  t,
  t,
  -t,
  t, // fifth face
  -t / 2,
  t,
  -t,
  -t / 2,
  t,
  t,
  t / 2,
  t,
  t,
  t / 2,
  t,
  -t, //third face
  -t,
  t / 3,
  -t,
  -t / 2,
  t,
  -t,
  -t / 2,
  t,
  t,
  -t,
  t / 3,
  t, //second face
  t / 2,
  t,
  -t,
  t / 2,
  t,
  t,
  t,
  t / 3,
  t,
  t,
  t / 3,
  -t, // fourth face
  -t,
  -t,
  -t,
  -t,
  -t,
  t,
  t,
  -t,
  t,
  t,
  -t,
  -t, //bottom face
  0,
  -t,
  -t,
  -t,
  -t,
  -t,
  -t,
  t / 3,
  -t,
  -t / 2,
  t,
  -t,
  t / 2,
  t,
  -t,
  t,
  t / 3,
  -t,
  t,
  -t,
  -t, //back face
  0,
  -t,
  t,
  -t,
  -t,
  t,
  -t,
  t / 3,
  t,
  -t / 2,
  t,
  t,
  t / 2,
  t,
  t,
  t,
  t / 3,
  t,
  t,
  -t,
  t, //front face
]);

var trainColors = new Float32Array([
  0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0,
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 1, 1, 0, 1,
  1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 1, 0, 1, 1, 0, 1, 0, 1, 0, 0, 1, 0,
  0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 1, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
  0, 0, 0, 0, 0, 0, 0, 0, 0, 0,
]);

var trainIndices = new Float32Array([
  0, 1, 2, 0, 2, 3, 4, 5, 6, 4, 6, 7, 8, 9, 10, 8, 10, 11, 12, 13, 14, 12, 14,
  15, 16, 17, 18, 16, 18, 19, 20, 21, 22, 20, 22, 23, 24, 25, 26, 24, 26, 27,
  24, 27, 28, 24, 28, 29, 24, 29, 30, 31, 32, 33, 31, 33, 34, 31, 34, 35, 31,
  35, 36, 31, 36, 37,
]);

var trainNormals = new Float32Array([
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0, //first face
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0, // fifth face
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0, //third face
  0.4,
  0.91,
  0.0,
  0.4,
  0.91,
  0.0,
  0.4,
  0.91,
  0.0,
  0.4,
  0.91,
  0.0, //second face
  0.8,
  0.6,
  0.0,
  0.8,
  0.6,
  0.0,
  0.8,
  0.6,
  0.0,
  0.8,
  0.6,
  0.0, // fourth face
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0,
  0.0,
  -1.0,
  0.0, //bottom face
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0, //back face
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0,
  0.0,
  0.0,
  1.0, //front face
]);

//load the shader resources using a utility function
loadResources({
  vs: './src/shader/empty.vs.glsl',
  fs: './src/shader/empty.fs.glsl',
  vs_shadow: './src/shader/shadow.vs.glsl',
  fs_shadow: './src/shader/shadow.fs.glsl',
  vs_texture: './src/shader/texture.vs.glsl',
  fs_texture: './src/shader/texture.fs.glsl',
  vs_heightmap: './src/shader/heightmap.vs.glsl',
  fs_heightmap: './src/shader/heightmap.fs.glsl',
  floortexture: './src/models/grass.png',
  woodtexture: './src/models/wood.png',
  rockytexture: './src/models/rocky.png',
  sandytexture: './src/models/rocks.jpg',
  snowytexture: './src/models/snowy.jpg',
  oceantexture: './src/models/water.jpg',
  leavestexture: './src/models/leaves.jpg',
  vs_phong: './src/shader/phong.vs.glsl',
  fs_phong: './src/shader/phong.fs.glsl', //gouraud
  staticcolorsvs: './src/shader/staticcolor.vs.glsl',
  staticcolorsfs: './src/shader/staticcolor.fs.glsl',
  heightmap: './src/models/heightmap512x512.png',
  bird_model: './src/models/bird.obj',
  model_wheel: './src/models/wheel.obj',
}).then(
  function (
    resources /*an object containing our keys with the loaded resources*/,
  ) {
    init(resources);
    //render one frame
    render(0);
  },
);

/**
 * initializes OpenGL context, compile shader, and load buffers
 */
function init(resources) {
  //initialization of an array of images, we want for texture
  images = [
    resources.woodtexture,
    resources.floortexture,
    resources.oceantexture,
    resources.rockytexture,
    resources.sandytexture,
    resources.snowytexture,
  ];
  //create a GL context
  gl = createContext(canvasWidth, canvasHeight);
  //enable depth test to let objects in front occluse objects further away
  gl.enable(gl.DEPTH_TEST);

  //init textures
  initTextures(resources);
  initRenderToTexture(resources);
  //create scenegraph
  rootNode = createSceneGraph(gl, resources);
  //compile and link shader program
  shaderProgram = createProgram(gl, resources.vs_phong, resources.fs_phong);
  //create scenegraph without floor and texture phong shader
  rootnofloor = new ShaderSGNode(
    createProgram(gl, resources.vs_texture, resources.fs_texture),
  );

  initInteraction(gl.canvas);
  //set buffers for cube
  initCubeBuffer();
  //set buffers for tunnel
  initTunnelBuffer();
  //set buffers for the train
  initTrainBuffer();

  initializeCamera();
}

function createSceneGraph(gl, resources) {
  //create scenegraph
  const root = new ShaderSGNode(
    createProgram(gl, resources.vs_shadow, resources.fs_shadow),
  );
  //add node for setting shadow parameters
  shadowNode = new ShadowSGNode(
    renderTargetDepthTexture,
    9,
    framebufferWidth,
    framebufferHeight,
  );
  root.append(shadowNode);

  const hmshader = new ShaderSGNode(
    createProgram(gl, resources.vs_heightmap, resources.fs_heightmap),
  );
  root.append(hmshader);

  {
    //initialize light
    light = new LightSGNode(); //use now framework implementation of light node
    light.ambient = [0.2, 0.2, 0.2, 1];
    light.diffuse = [0.8, 0.8, 0.8, 1];
    light.specular = [1, 1, 1, 1];
    light.position = [0, 10, 10];

    rotateLight = new TransformationSGNode(mat4.create());
    translateLight = new TransformationSGNode(glm.translate(20, 30, 50)); //translating the light is the same as setting the light position

    rotateLight.append(translateLight);
    translateLight.append(light);
    translateLight.append(createLightSphere(1)); //add sphere for debugging: since we use 0,0,0 as our light position the sphere is at the same position as the light source
    shadowNode.append(rotateLight);
  }
  {
    //Define our terrain, wrap with material node and heightmap node
    let floor = new MaterialSGNode(
      new HeightmapSGNode(
        floorTexture,
        0,
        new RenderSGNode(makeTerrain(100, 100, 200, 200)),
      ),
    );

    //bronce
    floor.ambient = [0.21, 0.13, 0.05, 1];
    floor.diffuse = [0.61, 0.43, 0.18, 1];
    floor.specular = [0.39, 0.27, 0.17, 1];
    floor.shininess = 20;
    hmshader.append(
      new TransformationSGNode(
        glm.transform({ translate: [0, 0, 0], rotateX: 0, scale: 1 }),
        [floor],
      ),
    );

    const textShader = new ShaderSGNode(
      createProgram(gl, resources.vs_texture, resources.fs_texture),
    );
    floor.append(textShader);

    createTrainStation(textShader, resources);

    createTree(textShader, resources, true, -2.0, 0.55, -20.5);
    createTree(textShader, resources, false, -3.0, 0.55, -18.5);
    createTree(textShader, resources, false, 20.0, 0.55, -18.5);
    createTree(textShader, resources, false, 18.0, 0.55, -22.5);
    createTree(textShader, resources, true, -16.6, 0.55, -4.5);
    createTree(textShader, resources, false, -3.0, 0.55, 30.5);
    createTree(textShader, resources, false, 20.0, 0.55, 36.5);
    createTree(textShader, resources, false, 17.0, 0.75, 29.5);
    createTree(textShader, resources, true, -16.6, 0.75, 30.5);

    createTunnel(textShader, resources);

    createTrain(textShader, resources);
  }

  return root;
}

/**
 * render one frame
 */
function render(timeInMilliseconds) {
  // check for resize of browser window and adjust canvas sizes
  checkForWindowResize(gl);
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  //render different scene to texture
  renderToTexture(timeInMilliseconds);
  //set background color to light blue
  gl.clearColor(0.4, 0.6, 0.9, 0.8);
  //clear the buffer
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
  //enable depth test to let objects in front occluse objects further away
  gl.enable(gl.DEPTH_TEST);

  gl.enable(gl.BLEND);
  gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  //activate this shader program
  gl.useProgram(shaderProgram);

  /*TRAIN ROUTE ANIMATION*/
  if (0 < timeInMilliseconds && timeInMilliseconds < 5000) {
    //outgoing from tunnel: straight forward movemet
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 30000),
    );

    moveCameraLeft(timeInMilliseconds / 30000);
    moveCameraBackwards(timeInMilliseconds / 30000);
    rotateCamera(-timeInMilliseconds / 15000, 0);
    displayText(
      'Floor: Heightmap; CO_1: Tunnel; CO_2 + Light + Animation:Train; CO_3 + Light: TrainStation',
    );
  } else if (5000 < timeInMilliseconds && timeInMilliseconds < 8000) {
    //small rotation to come in to train station
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.rotateY(-0.05),
    );
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(
        -timeInMilliseconds / 1200000,
        0,
        timeInMilliseconds / 1000000,
      ),
    );

    camera.position = [-5, 8, 0];
    camera.lookAt = [-5, 0, 0];
    camera.upwards = [0, 1, 0];

    camera.direction = vec3.normalize(
      vec3.create(),
      vec3.subtract(vec3.create(), camera.lookAt, camera.position),
    );
    moveCameraLeft(timeInMilliseconds / 30000);
    moveCameraBackwards(timeInMilliseconds / 30000);
    rotateCamera(-timeInMilliseconds / 9500, 0);
    displayText(
      ' CO_2 + Light + Animation:Train; CO_3 + Light: TrainStation; CO4 (+model): Trees',
    );
  } else if (8000 < timeInMilliseconds && timeInMilliseconds < 14000) {
    //advance slow and wait
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 300000),
    );
  } else if (18000 < timeInMilliseconds && timeInMilliseconds < 21000) {
    //start train with small rotation
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.rotateY(-0.15),
    );
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 300000),
    );
  } else if (21000 < timeInMilliseconds && timeInMilliseconds < 21500) {
    //go on
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 300000),
    );
  } else if (21500 < timeInMilliseconds && timeInMilliseconds <= 22500) {
    //take the curve
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.rotateY(-0.35),
    );
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 300000),
    );

    camera.position = [-10, 15, 0];
    camera.lookAt = [-1, 0, 0];
    camera.upwards = [0, 1, 0];

    camera.direction = vec3.normalize(
      vec3.create(),
      vec3.subtract(vec3.create(), camera.lookAt, camera.position),
    );
    moveCameraLeft(timeInMilliseconds / 30000);
    moveCameraForward(timeInMilliseconds / 30000);
    rotateCamera(-timeInMilliseconds / 45000, 0);

    displayText(' Camera rotation');
  } else if (22500 < timeInMilliseconds && timeInMilliseconds < 23500) {
    //take the curve
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.rotateY(-0.5),
    );
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 300000),
    );

    camera.direction = vec3.normalize(
      vec3.create(),
      vec3.subtract(vec3.create(), camera.lookAt, camera.position),
    );
    moveCameraLeft(timeInMilliseconds / 300000);
    moveCameraForward(timeInMilliseconds / 300000);
    rotateCamera(-timeInMilliseconds / 45000, 0);
    displayText('Floor: Heightmap; CO_2 + Light + Animation:Train;');
  } else if (23500 < timeInMilliseconds && timeInMilliseconds < 25000) {
    //go straight
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 150000),
    );
  } else if (25000 < timeInMilliseconds && timeInMilliseconds < 27500) {
    //take botton right curve down
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.rotateY(-0.5),
    );
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 150000),
    );
  } else if (27500 < timeInMilliseconds && timeInMilliseconds < 28000) {
    //go straight
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 150000),
    );
  } else if (28000 < timeInMilliseconds && timeInMilliseconds < 30000) {
    //take botton right curve up
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.rotateY(-0.5),
    );
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 150000),
    );

    camera.position = [-10, 15, 0];
    camera.lookAt = [5, 0, 0];
    camera.upwards = [0, 1, 0];

    camera.direction = vec3.normalize(
      vec3.create(),
      vec3.subtract(vec3.create(), camera.lookAt, camera.position),
    );
    moveCameraLeft(timeInMilliseconds / 300000);
    moveCameraForward(timeInMilliseconds / 300000);
    rotateCamera(-timeInMilliseconds / 50000, -timeInMilliseconds / 300000);
    displayText(
      'Floor: Heightmap; CO_2 + Light + Animation:Train; Camera rotation',
    );
  } else if (30000 < timeInMilliseconds && timeInMilliseconds < 31500) {
    //go straight
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 150000),
    );
    rotateCamera(-timeInMilliseconds / 50000, -timeInMilliseconds / 300000);
  } else if (31500 < timeInMilliseconds && timeInMilliseconds < 32500) {
    //take botton left curve up
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.rotateY(-0.5),
    );
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 150000),
    );
  } else if (32500 < timeInMilliseconds && timeInMilliseconds < 33200) {
    //go straight
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 150000),
    );
  } else if (33200 < timeInMilliseconds && timeInMilliseconds < 35000) {
    //take middel left curve up to tunnel
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.rotateY(-1),
    );
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 150000),
    );

    camera.position = [-10, 7, -10];
    camera.lookAt = [-5, 0, 0];
    camera.upwards = [0, 1, 0];

    camera.direction = vec3.normalize(
      vec3.create(),
      vec3.subtract(vec3.create(), camera.lookAt, camera.position),
    );
    moveCameraLeft(timeInMilliseconds / 30000);
    moveCameraForward(timeInMilliseconds / 30000);
    rotateCamera(-timeInMilliseconds / 80000, 0);

    displayText(
      'Floor: Heightmap; CO_2 + Light + Animation:Train; CO_1 (): Tunnel; Camera rotation',
    );
  } else if (35000 < timeInMilliseconds && timeInMilliseconds < 37000) {
    //outgoing from tunnel: straight forward movemet
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 300000),
    );
  } else if (37000 < timeInMilliseconds && timeInMilliseconds < 40000) {
    //small rotation to come in to train station
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.rotateY(-0.05),
    );
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 10000000),
    );

    camera.position = [-10, 8, 0];
    camera.lookAt = [-5, 0, 0];
    camera.upwards = [0, 1, 0];

    camera.direction = vec3.normalize(
      vec3.create(),
      vec3.subtract(vec3.create(), camera.lookAt, camera.position),
    );
    moveCameraLeft(timeInMilliseconds / 30000);
    moveCameraForward(timeInMilliseconds / 30000);
    rotateCamera(-timeInMilliseconds / 50000, 0);
  } else if (40000 < timeInMilliseconds && timeInMilliseconds < 42000) {
    //advance slow and wait
    trainTransformationMatrix = mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.translate(0, 0, timeInMilliseconds / 300000),
    );
  } else if (timeInMilliseconds > 42000) {
    cameraIsLocked = false;
    clearText();
  }
  trainTransformationNode.setMatrix(
    mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.scale(1.5, 2.5, 7),
    ),
  );

  context = createSceneGraphContext(gl, shaderProgram);
  //birds rotate above trees
  rotateBirdNode.matrix = glm.rotateY(timeInMilliseconds * 0.005);
  //enable train wheel bar rotation
  rotateLight.matrix = glm.rotateY(timeInMilliseconds * 0.005);
  //Transformation of the mechanism of the train,if train doesnt move, there is also no movement of mechanism
  if (
    (14000 < timeInMilliseconds && timeInMilliseconds < 17500) ||
    timeInMilliseconds > 42000
  ) {
    //Train doesnt move

    trainBarTransformationMatrix = mat4.multiply(
      mat4.create(),
      mat4.create(),
      glm.translate(0.0, 0.0, 0.0),
    );
    rotateBarNode.setMatrix(trainBarTransformationMatrix);

    trainBarTransformationMatrix = mat4.multiply(
      mat4.create(),
      mat4.create(),
      glm.translate(0.0, 0.0, 0.0),
    );
    rotateBarTrainNode.setMatrix(trainBarTransformationMatrix);
  } else {
    var trainBarTransformationMatrix = mat4.multiply(
      mat4.create(),
      mat4.create(),
      glm.translate(
        0.0,
        Math.cos(animatedAngle / 10) / 25,
        Math.sin(animatedAngle / 10) / 25,
      ),
    );
    rotateBarNode.setMatrix(trainBarTransformationMatrix);

    var trainBarTransformationMatrix = mat4.multiply(
      mat4.create(),
      mat4.create(),
      glm.translate(
        0.0,
        Math.cos(animatedAngle / 10) / 40,
        Math.sin(animatedAngle / 10) / 40,
      ),
    );
    rotateBarTrainNode.setMatrix(trainBarTransformationMatrix);
  }

  rootNode.render(context);
  //request another call as soon as possible
  requestAnimationFrame(render);
  animatedAngle = timeInMilliseconds / 10;
}

function initializeCamera() {
  camera.direction = vec3.normalize(
    vec3.create(),
    vec3.subtract(vec3.create(), camera.lookAt, camera.position),
  );
  camera.rotation.x =
    (Math.atan(camera.direction[2] / camera.direction[0]) * 180) / Math.PI -
    180;
  camera.rotation.y =
    (Math.atan(
      camera.direction[1] /
        Math.sqrt(
          Math.pow(camera.direction[0], 2) + Math.pow(camera.direction[2], 2),
        ),
    ) *
      180) /
    Math.PI;
}

/*
 * camera control
 */
function initInteraction(canvas) {
  const mouse = {
    pos: { x: 0, y: 0 },
    leftButtonDown: false,
  };
  function toPos(event) {
    //convert to local coordinates
    const rect = canvas.getBoundingClientRect();
    return {
      x: event.clientX - rect.left,
      y: event.clientY - rect.top,
    };
  }
  canvas.addEventListener('mousedown', function (event) {
    mouse.pos = toPos(event);
    mouse.leftButtonDown = event.button === 0;
  });
  canvas.addEventListener('mousemove', function (event) {
    const pos = toPos(event);
    const delta = { x: mouse.pos.x - pos.x, y: mouse.pos.y - pos.y };
    //add delta mouse to camera.rotation if the left mouse button is pressed
    if (mouse.leftButtonDown && !cameraIsLocked) {
      //add the relative movement of the mouse to the rotation variables
      rotateCamera(mouse.pos.x - pos.x, mouse.pos.y - pos.y);
    }
    mouse.pos = pos;
  });
  canvas.addEventListener('mouseup', function (event) {
    mouse.pos = toPos(event);
    mouse.leftButtonDown = false;
  });
  //register globally
  document.addEventListener('keypress', function (event) {
    if (!cameraIsLocked) {
      //R-key: reset camera to the corresponding position
      if (event.code === 'KeyR') {
        camera.position = [10, 12, 40];
        camera.lookAt = [-5, 0, 0];
        camera.upwards = [0, 1, 0];

        camera.direction = vec3.normalize(
          vec3.create(),
          vec3.subtract(vec3.create(), camera.lookAt, camera.position),
        );
        camera.rotation.x =
          (Math.atan(camera.direction[2] / camera.direction[0]) * 180) /
            Math.PI -
          180;
        camera.rotation.y =
          (Math.atan(
            camera.direction[1] /
              Math.sqrt(
                Math.pow(camera.direction[0], 2) +
                  Math.pow(camera.direction[2], 2),
              ),
          ) *
            180) /
          Math.PI;

        displayText('Reset Camera-key was pressed');
      }
      //A-key: leftward movement
      if (event.code === 'KeyA') {
        moveCameraLeft(1);
      }
      //D-key: rightward movement
      if (event.code === 'KeyD') {
        moveCameraRight(1);
      }
      //W-key: forward movement
      if (event.code === 'KeyW') {
        moveCameraForward(1);
      }
      //S-key: backward movement
      if (event.code === 'KeyS') {
        moveCameraBackwards(1);
      }
    }
  });
}
//rotate camera left and right for rotx, and up and down for roty
function rotateCamera(rotx, roty) {
  camera.rotation.x = (camera.rotation.x - rotx) % 360;
  camera.rotation.y = (camera.rotation.y + roty) % 360;

  // can't move camera further up than "up" and further down than "down"
  if (camera.rotation.y > 89) {
    camera.rotation.y = 89;
  }
  if (camera.rotation.y < -89) {
    camera.rotation.y = -89;
  }
  let myvec3 = vec3.set(
    vec3.create(),
    Math.cos(glm.deg2rad(camera.rotation.y)) *
      Math.cos(glm.deg2rad(camera.rotation.x)),
    Math.sin(glm.deg2rad(camera.rotation.y)),
    Math.cos(glm.deg2rad(camera.rotation.y)) *
      Math.sin(glm.deg2rad(camera.rotation.x)),
  );
  displayText('Camera rotation');
  camera.direction = vec3.normalize(vec3.create(), myvec3);
}

function moveCameraForward(speed) {
  displayText('Camera forward movement');
  camera.position = vec3.add(
    vec3.create(),
    camera.position,
    vec3.scale(vec3.create(), camera.direction, speed),
  );
}

function moveCameraBackwards(speed) {
  displayText('Camera backward movement');
  camera.position = vec3.subtract(
    vec3.create(),
    camera.position,
    vec3.scale(vec3.create(), camera.direction, speed),
  );
}

function moveCameraRight(speed) {
  displayText('Camera right movement');
  camera.position = vec3.add(
    vec3.create(),
    camera.position,
    vec3.scale(
      vec3.create(),
      vec3.normalize(
        vec3.create(),
        vec3.cross(vec3.create(), camera.direction, camera.upwards),
      ),
      speed,
    ),
  );
}

function moveCameraLeft(speed) {
  displayText('Camera left movement');
  camera.position = vec3.subtract(
    vec3.create(),
    camera.position,
    vec3.scale(
      vec3.create(),
      vec3.normalize(
        vec3.create(),
        vec3.cross(vec3.create(), camera.direction, camera.upwards),
      ),
      speed,
    ),
  );
}

function createLightSphere(size) {
  let lightMat = new MaterialSGNode([
    new RenderSGNode(makeSphere(size, 10, 10)),
  ]);
  lightMat.emission = [1, 1, 1, 1]; // only set emission so sphere is white
  lightMat.ambient = lightMat.diffuse = lightMat.specular = [0, 0, 0, 1]; // everyting else is black (0)
  return lightMat;
}

function initTextures(resources) {
  //create texture object
  floorTexture = gl.createTexture();
  //select a texture unit
  gl.activeTexture(gl.TEXTURE0);
  //bind texture to active texture unit
  gl.bindTexture(gl.TEXTURE_2D, floorTexture);
  //set sampling parameters
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  //change texture sampling behaviour
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  //upload texture data
  gl.texImage2D(
    gl.TEXTURE_2D, //texture unit target == texture type
    0, //level of detail level (default 0)
    gl.RGBA, //internal format of the data in memory
    gl.RGBA, //image format (should match internal format)
    gl.UNSIGNED_BYTE, //image data type
    resources.heightmap,
  ); //actual image data
  //clean up/unbind texture
  gl.bindTexture(gl.TEXTURE_2D, null);
  // create textures
  for (var ii = 0; ii < images.length; ++ii) {
    var texture = gl.createTexture();
    //select a texture unit
    gl.activeTexture(gl.TEXTURE0 + ii + 1);
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we can render any size image.
    //set sampling parameters
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
    //change texture sampling behaviour
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    // Upload the image into the texture.
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      images[ii],
    );
    // add the texture to the array of textures.
    textures.push(texture);
  }
}

function initRenderToTexture(resources) {
  //check if depth texture extension is supported
  var depthTextureExt = gl.getExtension('WEBGL_depth_texture');
  if (!depthTextureExt) {
    alert('No depth texture support!!!');
    return;
  }

  //general setup
  gl.activeTexture(gl.TEXTURE0);
  //generate color texture (required mainly for debugging and to avoid bugs in some WebGL platforms)
  renderTargetFramebuffer = gl.createFramebuffer();
  gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetFramebuffer);

  //Setup color and depth texture and bind them to the framebuffer
  //create color texture
  renderTargetColorTexture = gl.createTexture();
  //select a texture unit
  gl.activeTexture(gl.TEXTURE3);
  gl.bindTexture(gl.TEXTURE_2D, renderTargetColorTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texImage2D(
    gl.TEXTURE_2D, //texture unit target == texture type
    0, //level of detail level (default 0)
    gl.RGBA, //internal format of the data in memory
    framebufferWidth, //texture width (required if no image given)
    framebufferHeight, //texture height (required if no image given)
    0, //border (enable or disable setting a border color for clamping, required if no image given)
    gl.RGBA, //image format (should match internal format)
    gl.UNSIGNED_BYTE, //image data type
    null,
  ); //actual image data

  //create depth texture
  renderTargetDepthTexture = gl.createTexture();
  gl.bindTexture(gl.TEXTURE_2D, renderTargetDepthTexture);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.REPEAT);
  gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.REPEAT);
  gl.texImage2D(
    gl.TEXTURE_2D,
    0,
    gl.DEPTH_COMPONENT,
    framebufferWidth,
    framebufferHeight,
    0,
    gl.DEPTH_COMPONENT,
    gl.UNSIGNED_SHORT,
    null,
  );
  //attach textures to framebuffer
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.COLOR_ATTACHMENT0,
    gl.TEXTURE_2D,
    renderTargetColorTexture,
    0,
  );
  gl.framebufferTexture2D(
    gl.FRAMEBUFFER,
    gl.DEPTH_ATTACHMENT,
    gl.TEXTURE_2D,
    renderTargetDepthTexture,
    0,
  );
  //check if framebuffer was created successfully
  if (gl.checkFramebufferStatus(gl.FRAMEBUFFER) != gl.FRAMEBUFFER_COMPLETE) {
    alert('Framebuffer incomplete!');
  }

  //clean up
  gl.bindTexture(gl.TEXTURE_2D, null);
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

/**
 * generate a floor with corresponding height and width (midpoint of the floor is (0,0)
 *   and how many faces it should have any each side (n faces => n+1 vertices)
 * @param width the width of the floor
 * @param height the height of the floor
 * @param anz_w number of faces
 * @param anz_h number of faces
 * @returns {floor}
 */
function makeTerrain(width, height, anz_w, anz_h) {
  var floor = { position: [], normal: [], texture: [], index: [] };

  for (var h = 0; h <= anz_h; h++) {
    for (var w = 0; w <= anz_w; w++) {
      var sum1 = -1 * (width / 2) + (w * width) / anz_w;
      var sum2 = -1 * (height / 2) + (h * height) / anz_h;
      var tex1 = w / anz_w;
      var tex2 = h / anz_h;

      floor.position.push(sum1);
      floor.position.push(0); // y-value, is overwritten by heightmap
      floor.position.push(sum2);

      floor.texture.push(tex1);
      floor.texture.push(tex2);

      // normals: default floor is plain, so normal is (0,1,0) everywhere
      floor.normal.push(0);
      floor.normal.push(1);
      floor.normal.push(0);
    }
  }

  //  Example: 3x3 floor with 9 vertices:
  //	*-*-*		7-8-9
  //	| | |		| | |
  //	*-*-*  	4-5-6
  //	| | |		| | |
  //	*-*-*		1-2-3

  // to get triangular faces, split the floor into triangles, for example for the area 1-2-5-4:
  //
  //	4-5
  //	|/|
  //	1-2

  // We can get the triangles with the vertices 1,2,5 and 1,4,5

  for (var h = 0; h < anz_h; h++) {
    for (var w = 0; w < anz_w; w++) {
      var pos1 = h * (anz_w + 1) + w;
      var pos2 = pos1 + 1;
      var pos3 = (h + 1) * (anz_w + 1) + w + 1;
      var pos4 = (h + 1) * (anz_w + 1) + w;

      // Vertices
      floor.index.push(pos1);
      floor.index.push(pos2);
      floor.index.push(pos3);

      floor.index.push(pos1);
      floor.index.push(pos3);
      floor.index.push(pos4);
    }
  }

  return floor;
}

function renderToTexture(timeInMilliseconds) {
  //bind framebuffer to draw scene into texture
  gl.bindFramebuffer(gl.FRAMEBUFFER, renderTargetFramebuffer);

  //setup viewport
  gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
  gl.clearColor(0.9, 0.9, 0.9, 1.0);
  gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

  //setup context and camera matrices
  context = createSGContext(gl);
  //setup a projection matrix for the light camera which is large enough to capture our scene
  context.projectionMatrix = mat4.perspective(
    mat4.create(),
    30,
    framebufferWidth / framebufferHeight,
    0.01,
    100,
  );
  //compute the light's position in world space
  let lightModelMatrix = mat4.multiply(
    mat4.create(),
    rotateLight.matrix,
    translateLight.matrix,
  );
  let lightPositionVector = vec4.fromValues(
    light.position[0],
    light.position[1],
    light.position[2],
    1,
  );
  let worldLightPos = vec4.transformMat4(
    vec4.create(),
    lightPositionVector,
    lightModelMatrix,
  );
  //let the light "shine" towards the scene center (i.e. towards C3PO)
  let worldLightLookAtPos = camera.lookAt;
  let upVector = camera.upwards;
  //setup camera to look at the scene from the light's perspective
  let lookAtMatrix = mat4.lookAt(
    mat4.create(),
    worldLightPos,
    worldLightLookAtPos,
    upVector,
  );
  context.viewMatrix = lookAtMatrix;

  //multiply and save light projection and view matrix for later use in shadow mapping shader!
  shadowNode.lightViewProjectionMatrix = mat4.multiply(
    mat4.create(),
    context.projectionMatrix,
    context.viewMatrix,
  );
  //render scenegraph
  rootnofloor.render(context); //scene graph without floor to avoid reading from the same texture as we write to...

  //disable framebuffer (render to screen again)
  gl.bindFramebuffer(gl.FRAMEBUFFER, null);
}

function initCubeBuffer() {
  cubeVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, cubeVertices, gl.STATIC_DRAW);

  cubeColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, cubeColors, gl.STATIC_DRAW);

  cubeIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(cubeIndices),
    gl.STATIC_DRAW,
  );

  cubeNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, cubeNormals, gl.STATIC_DRAW);

  cubeTextureCoordBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, cubeTextureCoordBuffer);
  gl.bufferData(
    gl.ARRAY_BUFFER,
    new Uint16Array(cubeTextureCoordinates),
    gl.STATIC_DRAW,
  );
}

function initTunnelBuffer() {
  tunnelVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tunnelVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, tunnelVertices, gl.STATIC_DRAW);

  tunnelColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tunnelColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, tunnelColors, gl.STATIC_DRAW);

  tunnelIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tunnelIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(tunnelIndices),
    gl.STATIC_DRAW,
  );

  tunnelNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, tunnelNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, tunnelNormals, gl.STATIC_DRAW);
}

function initTrainBuffer() {
  trainVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trainVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, trainVertices, gl.STATIC_DRAW);

  trainColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trainColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, trainColors, gl.STATIC_DRAW);

  trainIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trainIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(trainIndices),
    gl.STATIC_DRAW,
  );
  trainNormalBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, trainNormalBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, trainNormals, gl.STATIC_DRAW);
}

function initStarBuffer() {
  starVertexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, starVertexBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, starVertices, gl.STATIC_DRAW);

  starColorBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, starColorBuffer);
  gl.bufferData(gl.ARRAY_BUFFER, starColors, gl.STATIC_DRAW);

  starIndexBuffer = gl.createBuffer();
  gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, starIndexBuffer);
  gl.bufferData(
    gl.ELEMENT_ARRAY_BUFFER,
    new Uint16Array(starIndices),
    gl.STATIC_DRAW,
  );
}

// construct a train station scenegraph
function createTrainStation(parentNode, resources) {
  //transformations on whole building
  var trainstationTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle * 1, 03),
  );
  trainstationTransformationMatrix = mat4.multiply(
    mat4.create(),
    trainstationTransformationMatrix,
    glm.translate(8.5, 0.6, -20.7),
  );
  trainstationTransformationMatrix = mat4.multiply(
    mat4.create(),
    trainstationTransformationMatrix,
    glm.scale(8, 1.9, -3),
  );

  var trainstationTransformationNode = new TransformationSceneGraphNode(
    trainstationTransformationMatrix,
  );

  let trainstationTextNode = new MaterialNode(trainstationTransformationNode);
  //chrome
  trainstationTextNode.ambient = [0.25, 0.25, 0.25, 1];
  trainstationTextNode.diffuse = [0.4, 0.4, 0.4, 1];
  trainstationTextNode.specular = [0.774597, 0.774597, 0.774597, 1];
  trainstationTextNode.shininess = 76.8;
  parentNode.append(trainstationTextNode);
  trainstationTextNode.append(trainstationTransformationNode);

  //mainbuilding
  var cubeNode = new CubeRenderNode();
  trainstationTransformationNode.append(cubeNode);

  //transformations for the upperBuilding
  var upperBuildingTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  upperBuildingTransformationMatrix = mat4.multiply(
    mat4.create(),
    upperBuildingTransformationMatrix,
    glm.translate(0.0, 0.4, 0),
  );
  upperBuildingTransformationMatrix = mat4.multiply(
    mat4.create(),
    upperBuildingTransformationMatrix,
    glm.scale(0.4, 0.9, 1),
  );
  var upperBuildingTransformationNode = new TransformationSceneGraphNode(
    upperBuildingTransformationMatrix,
  );
  trainstationTransformationNode.append(upperBuildingTransformationNode);
  //upperBuilding
  cubeNode = new CubeRenderNode();
  upperBuildingTransformationNode.append(cubeNode);

  //transformations for the  railroad
  var railroadTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.translate(0, -0.3, -0.16),
  );
  railroadTransformationMatrix = mat4.multiply(
    mat4.create(),
    railroadTransformationMatrix,
    glm.scale(3.5, 0.1, 1.5),
  );
  var roailroadTransformationNode = new TransformationSceneGraphNode(
    railroadTransformationMatrix,
  );
  trainstationTransformationNode.append(roailroadTransformationNode);
  //railroad
  cubeNode = new CubeRenderNode();
  roailroadTransformationNode.append(cubeNode);
  {
    let head_light = new LightSGNode();
    head_light.position = [-8, -0.3, -0.3];
    //head_light.append(new TransformationSGNode(glm.translate(0.5,0.0,0.5)));
    trainstationTransformationNode.append(head_light);
  }
  //transformations for the  left Column
  var leftColumnTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.translate(1, 0, -0.3),
  );
  leftColumnTransformationMatrix = mat4.multiply(
    mat4.create(),
    leftColumnTransformationMatrix,
    glm.scale(0.1, 1, 0.2),
  );
  var leftColumnTransformationNode = new TransformationSceneGraphNode(
    leftColumnTransformationMatrix,
  );
  trainstationTransformationNode.append(leftColumnTransformationNode);
  //left Column
  cubeNode = new CubeRenderNode();
  leftColumnTransformationNode.append(cubeNode);
  {
    let head_light = new LightSGNode();
    head_light.position = [-2, 0.5, -0.3];
    trainstationTransformationNode.append(head_light);
  }

  //transformations for the right Column
  var rightColumnTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.translate(-1, 0, -0.3),
  );
  rightColumnTransformationMatrix = mat4.multiply(
    mat4.create(),
    rightColumnTransformationMatrix,
    glm.scale(0.1, 1, 0.2),
  );
  var rightColumnTransformationNode = new TransformationSceneGraphNode(
    rightColumnTransformationMatrix,
  );
  trainstationTransformationNode.append(rightColumnTransformationNode);
  //right Column
  cubeNode = new CubeRenderNode();
  rightColumnTransformationNode.append(cubeNode);
  {
    let head_light = new LightSGNode();
    head_light.position = [2, 0.5, -0.3];
    trainstationTransformationNode.append(head_light);
  }
  //transformations for the 2nd left Column
  var leftMittelColumnTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.translate(0.5, 0, -0.3),
  );
  leftMittelColumnTransformationMatrix = mat4.multiply(
    mat4.create(),
    leftMittelColumnTransformationMatrix,
    glm.scale(0.1, 1, 0.2),
  );
  var leftMittelColumnTransformationNode = new TransformationSceneGraphNode(
    leftMittelColumnTransformationMatrix,
  );
  trainstationTransformationNode.append(leftMittelColumnTransformationNode);
  //left Column
  cubeNode = new CubeRenderNode();
  leftMittelColumnTransformationNode.append(cubeNode);

  {
    let head_light = new LightSGNode();
    head_light.position = [2, 0.5, -0.3];
    trainstationTransformationNode.append(head_light);
  }
  //transformations for the right Column
  var rightMittelColumnTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.translate(-0.5, 0, -0.3),
  );
  rightMittelColumnTransformationMatrix = mat4.multiply(
    mat4.create(),
    rightMittelColumnTransformationMatrix,
    glm.scale(0.1, 1, 0.2),
  );
  var rightMittelColumnTransformationNode = new TransformationSceneGraphNode(
    rightMittelColumnTransformationMatrix,
  );
  trainstationTransformationNode.append(rightMittelColumnTransformationNode);
  //right Column
  cubeNode = new CubeRenderNode();
  rightMittelColumnTransformationNode.append(cubeNode);
  {
    let head_light = new LightSGNode();
    head_light.position = [-2, 0.5, -0.3];
    trainstationTransformationNode.append(head_light);
  }
  //transformations for the roof
  var roofTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.translate(0, 0.3, -0.4),
  );
  roofTransformationMatrix = mat4.multiply(
    mat4.create(),
    roofTransformationMatrix,
    glm.scale(3.5, 0.1, 0.5),
  );
  var roofTransformationNode = new TransformationSceneGraphNode(
    roofTransformationMatrix,
  );
  trainstationTransformationNode.append(roofTransformationNode);
  //roof
  cubeNode = new CubeRenderNode();
  roofTransformationNode.append(cubeNode);
  {
    let head_light = new LightSGNode();
    head_light.position = [-1.7, 0.3, 0.0];
    trainstationTransformationNode.append(head_light);
  }
}

// construct a tree scenegraph
function createTree(parentNode, resources, withBird, x, y, z) {
  let trunk = new MaterialSGNode(
    new TextureSGNode(textures[0], 0, new CubeRenderNode()),
  );

  //bronce
  trunk.ambient = [0.21, 0.13, 0.05, 1];
  trunk.diffuse = [0.61, 0.43, 0.18, 1];
  trunk.specular = [0.39, 0.27, 0.17, 1];
  trunk.shininess = 20;

  //transformations on the trunk
  var treeTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  treeTransformationMatrix = mat4.multiply(
    mat4.create(),
    treeTransformationMatrix,
    glm.translate(x, y, z),
  );
  treeTransformationMatrix = mat4.multiply(
    mat4.create(),
    treeTransformationMatrix,
    glm.scale(0.5, 2, 0.5),
  );
  var treeTransformationNode = new TransformationSceneGraphNode(
    treeTransformationMatrix,
  );
  parentNode.append(treeTransformationNode);

  var leaves = new CubeRenderNode();
  treeTransformationNode.append(trunk);

  var staticBranchColorShaderNode = new ShaderSceneGraphNode(
    createProgram(gl, resources.staticcolorsvs, resources.staticcolorsfs),
  );
  treeTransformationNode.append(staticBranchColorShaderNode);
  //transformations for the first Branch
  var firstBranchTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.translate(-0.7, 0.3, -0.4),
  );
  firstBranchTransformationMatrix = mat4.multiply(
    mat4.create(),
    firstBranchTransformationMatrix,
    glm.scale(2.5, 0.35, 3),
  );
  var firstBranchTransformationNode = new TransformationSceneGraphNode(
    firstBranchTransformationMatrix,
  );
  staticBranchColorShaderNode.append(firstBranchTransformationNode);
  //first Branch
  firstBranchTransformationNode.append(leaves);
  //transformations for the second Branch
  var secondBranchTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.translate(0.7, 0.27, 0.6),
  );
  secondBranchTransformationMatrix = mat4.multiply(
    mat4.create(),
    secondBranchTransformationMatrix,
    glm.scale(2.5, 0.35, 3),
  );
  var secondBranchTransformationNode = new TransformationSceneGraphNode(
    secondBranchTransformationMatrix,
  );
  staticBranchColorShaderNode.append(secondBranchTransformationNode);
  //second Branch
  secondBranchTransformationNode.append(leaves);

  //transformations for the third Branch
  var thirdBranchTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.translate(0, 0.36, 0.3),
  );
  thirdBranchTransformationMatrix = mat4.multiply(
    mat4.create(),
    thirdBranchTransformationMatrix,
    glm.scale(2.5, 0.35, 3),
  );
  var thirdBranchTransformationNode = new TransformationSceneGraphNode(
    thirdBranchTransformationMatrix,
  );
  staticBranchColorShaderNode.append(thirdBranchTransformationNode);
  //third Branch
  thirdBranchTransformationNode.append(leaves);
  if (withBird == true) {
    //wrap with material node
    let bird = new MaterialNode([new RenderSGNode(resources.bird_model)]);
    //gold
    bird.ambient = [0.24725, 0.1995, 0.0745, 1];
    bird.diffuse = [0.75164, 0.60648, 0.22648, 1];
    bird.specular = [0.628281, 0.555802, 0.366065, 1];
    bird.shininess = 0.4;
    rotateBirdNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({ translate: [0.5, 0.4, 0], rotateX: 0, scale: 0.4 }),
        [bird],
      ),
    ]);
    treeTransformationNode.append(rotateBirdNode);
  }
}

// construct a tunnel scenegraph
function createTunnel(parentNode, resources) {
  var tunnelTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  tunnelTransformationMatrix = mat4.multiply(
    mat4.create(),
    tunnelTransformationMatrix,
    glm.rotateY(100),
  );
  tunnelTransformationMatrix = mat4.multiply(
    mat4.create(),
    tunnelTransformationMatrix,
    glm.translate(14.5, 0.75, -22),
  );
  tunnelTransformationMatrix = mat4.multiply(
    mat4.create(),
    tunnelTransformationMatrix,
    glm.scale(6, 3, 10),
  );
  tunnelTransformationNode = new TransformationSceneGraphNode(
    tunnelTransformationMatrix,
  );

  let tunnelTextNode = new MaterialSGNode(tunnelTransformationNode);
  //copper
  tunnelTextNode.ambient = [0.19125, 0.0735, 0.0225, 1.0];
  tunnelTextNode.diffuse = [0.7038, 0.27048, 0.0828, 1.0];
  tunnelTextNode.specular = [0.256777, 0.137622, 0.086014, 1.0];
  tunnelTextNode.shininess = 12.8;

  parentNode.append(tunnelTextNode);
  tunnelTextNode.append(tunnelTransformationNode);

  tunnelNode = new TunnelRenderNode();
  tunnelTransformationNode.append(tunnelNode);
}

// construct a train scenegraph
function createTrain(parentNode, resources) {
  rotateBarNode = new TransformationSceneGraphNode(mat4.create());
  rotateBarTrainNode = new TransformationSceneGraphNode(mat4.create());
  //transformations
  trainTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  trainTransformationMatrix = mat4.multiply(
    mat4.create(),
    trainTransformationMatrix,
    glm.rotateY(100),
  );
  trainTransformationMatrix = mat4.multiply(
    mat4.create(),
    trainTransformationMatrix,
    glm.translate(15.0, 0.3, -22),
  );
  //trainTransformationMatrix = mat4.multiply(mat4.create(), trainTransformationMatrix, glm.scale(1.5,2.5,7));
  trainTransformationNode = new TransformationSceneGraphNode(
    mat4.multiply(
      mat4.create(),
      trainTransformationMatrix,
      glm.scale(1.5, 2.5, 7),
    ),
  );
  //if we modify the trainstationTransformationMatrix, there is a distorsion when moving.
  //By creating the Node with the scalation of the matrix, we avoid it.
  let trainTextNode = new MaterialSGNode(trainTransformationNode);
  //chrome
  trainTextNode.ambient = [0.25, 0.25, 0.25, 1];
  trainTextNode.diffuse = [0.4, 0.4, 0.4, 1];
  trainTextNode.specular = [0.774597, 0.774597, 0.774597, 1];
  trainTextNode.shininess = 76.8;
  parentNode.append(trainTextNode);
  trainTextNode.append(trainTransformationNode);

  var trainNode = new TrainRenderNode();
  trainTransformationNode.append(trainNode);
  var trainHeadTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  trainHeadTransformationMatrix = mat4.multiply(
    mat4.create(),
    trainHeadTransformationMatrix,
    glm.rotateY(0),
  );
  trainHeadTransformationMatrix = mat4.multiply(
    mat4.create(),
    trainHeadTransformationMatrix,
    glm.translate(0, 0.1, -0.04),
  );
  trainHeadTransformationMatrix = mat4.multiply(
    mat4.create(),
    trainHeadTransformationMatrix,
    glm.scale(1.0, 1.35, 0.8),
  );
  var trainHeadTransformationNode = new TransformationSceneGraphNode(
    trainHeadTransformationMatrix,
  );
  trainTransformationNode.append(trainHeadTransformationNode);

  var trainHeadNode = new TrainRenderNode();
  trainHeadTransformationNode.append(trainHeadNode);

  {
    //initialize light
    let head_light = new LightNode(); //use now our implementation of light node
    light.ambient = [0.2, 0.2, 0.2, 1];
    light.diffuse = [0.8, 0.8, 0.8, 1];
    light.specular = [1, 1, 1, 1];
    light.position = [0, 10, 10];

    translateLight = new TransformationSGNode(glm.translate(0.0, 0.0, 0.1)); //translating the light is the same as setting the light position
    translateLight.append(head_light);
    translateLight.append(createLightSphere(0.05)); //add sphere for debugging: since we use 0,0,0 as our light position the sphere is at the same position as the light source
    trainTransformationNode.append(translateLight);
  }

  //wrap with material node
  let wheel = new MaterialNode([new RenderSGNode(resources.model_wheel)]);
  //gold
  wheel.ambient = [0.24725, 0.1995, 0.0745, 1];
  wheel.diffuse = [0.75164, 0.60648, 0.22648, 1];
  wheel.specular = [0.628281, 0.555802, 0.366065, 1];
  wheel.shininess = 0.4;
  {
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [0.1, -0.07, 0],
          rotateX: -90,
          scale: 0.0008,
        }),
        [wheel],
      ),
    ]);
    trainTransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [0.1, -0.07, -0.08],
          rotateX: -90,
          scale: 0.0008,
        }),
        [wheel],
      ),
    ]);
    trainTransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [0.1, -0.07, 0.08],
          rotateX: -90,
          scale: 0.0008,
        }),
        [wheel],
      ),
    ]);
    trainTransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [-0.1, -0.07, 0],
          rotateX: -90,
          scale: 0.0008,
        }),
        [wheel],
      ),
    ]);
    trainTransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [-0.1, -0.07, -0.08],
          rotateX: -90,
          scale: 0.0008,
        }),
        [wheel],
      ),
    ]);
    trainTransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [-0.1, -0.07, 0.08],
          rotateX: -90,
          scale: 0.0008,
        }),
        [wheel],
      ),
    ]);
    trainTransformationNode.append(wheelNode);
  }

  //transformations for the bar in the head of the train
  var leftBarMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  leftBarMatrix = mat4.multiply(
    mat4.create(),
    leftBarMatrix,
    glm.translate(-0.11, -0.075, 0.0),
  );
  leftBarMatrix = mat4.multiply(
    mat4.create(),
    leftBarMatrix,
    glm.scale(0.05, 0.025, 0.3),
  );
  var leftBarTransformationNode = new TransformationSceneGraphNode(
    leftBarMatrix,
  );
  rotateBarTrainNode.append(leftBarTransformationNode);
  barNode = new CubeRenderNode();
  leftBarTransformationNode.append(barNode);

  var rightBarMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  rightBarMatrix = mat4.multiply(
    mat4.create(),
    rightBarMatrix,
    glm.translate(0.11, -0.075, 0.0),
  );
  rightBarMatrix = mat4.multiply(
    mat4.create(),
    rightBarMatrix,
    glm.scale(0.05, 0.025, 0.3),
  );
  var rightBarTransformationNode = new TransformationSceneGraphNode(
    rightBarMatrix,
  );
  rotateBarTrainNode.append(rightBarTransformationNode);
  trainTransformationNode.append(rotateBarTrainNode); //add bars to the headtrain
  rightBarTransformationNode.append(barNode);

  var vagonTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  vagonTransformationMatrix = mat4.multiply(
    mat4.create(),
    vagonTransformationMatrix,
    glm.translate(0.0, 0.1, -0.3),
  );
  vagonTransformationMatrix = mat4.multiply(
    mat4.create(),
    vagonTransformationMatrix,
    glm.scale(0.4, 0.6, 0.4),
  );
  var vagonTransformationNode = new TransformationSceneGraphNode(
    vagonTransformationMatrix,
  );

  //first vagon
  trainTransformationNode.append(vagonTransformationNode);
  trainTextNode = new MaterialNode(vagonTransformationNode);
  trainTextNode.ambient = [0.0, 0.0, 0.0, 1];
  trainTextNode.diffuse = [0.1, 0.35, 0.1, 1];
  trainTextNode.specular = [0.45, 0.55, 0.45, 1];
  trainTextNode.shininess = 32;
  trainTransformationNode.append(trainTextNode);
  trainTextNode.append(vagonTransformationNode);
  cubeNode = new CubeRenderNode();
  vagonTransformationNode.append(cubeNode);

  var vagon2TransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  vagon2TransformationMatrix = mat4.multiply(
    mat4.create(),
    vagon2TransformationMatrix,
    glm.translate(0.0, 0.0, -0.6),
  );
  vagon2TransformationMatrix = mat4.multiply(
    mat4.create(),
    vagon2TransformationMatrix,
    glm.scale(0.7, 1.0, 0.7),
  );
  vagon2TransformationNode = new TransformationSceneGraphNode(
    vagon2TransformationMatrix,
  );
  // second vagon
  trainTextNode = new MaterialNode(vagon2TransformationNode);
  //bronce
  trainTextNode.ambient = [0.21, 0.13, 0.05, 1];
  trainTextNode.diffuse = [0.61, 0.43, 0.18, 1];
  trainTextNode.specular = [0.39, 0.27, 0.17, 1];
  trainTextNode.shininess = 20;
  vagonTransformationNode.append(trainTextNode);
  trainTextNode.append(vagon2TransformationNode);
  vagon2TransformationNode.append(cubeNode);

  //transformations for the union between headtrain and first vagon
  var jointVagonsTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  jointVagonsTransformationMatrix = mat4.multiply(
    mat4.create(),
    jointVagonsTransformationMatrix,
    glm.translate(0, -0.05, -0.16),
  );
  jointVagonsTransformationMatrix = mat4.multiply(
    mat4.create(),
    jointVagonsTransformationMatrix,
    glm.scale(0.05, 0.05, 0.2),
  );
  var jointVagonsTransformationNode = new TransformationSceneGraphNode(
    jointVagonsTransformationMatrix,
  );
  trainTransformationNode.append(jointVagonsTransformationNode);
  jointVagonsTransformationNode.append(cubeNode);

  {
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [0.3, -0.28, 0.0],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagonTransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [0.3, -0.28, -0.2],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagonTransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [0.3, -0.28, 0.2],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagonTransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [-0.3, -0.28, 0],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagonTransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [-0.3, -0.28, -0.2],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagonTransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [-0.3, -0.28, 0.2],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagonTransformationNode.append(wheelNode);
  }

  //transformations for the bars in the first vagon
  var leftBarMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  leftBarMatrix = mat4.multiply(
    mat4.create(),
    leftBarMatrix,
    glm.translate(-0.35, -0.28, 0.0),
  );
  leftBarMatrix = mat4.multiply(
    mat4.create(),
    leftBarMatrix,
    glm.scale(0.05, 0.05, 0.75),
  );
  var leftBarVagonTransformationNode = new TransformationSceneGraphNode(
    leftBarMatrix,
  );
  rotateBarNode.append(leftBarVagonTransformationNode);
  leftBarVagonTransformationNode.append(barNode);

  var rightBarMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  rightBarMatrix = mat4.multiply(
    mat4.create(),
    rightBarMatrix,
    glm.translate(0.35, -0.28, 0.0),
  );
  rightBarMatrix = mat4.multiply(
    mat4.create(),
    rightBarMatrix,
    glm.scale(0.05, 0.05, 0.75),
  );
  var rightBarVagonTransformationNode = new TransformationSceneGraphNode(
    rightBarMatrix,
  );
  rotateBarNode.append(rightBarVagonTransformationNode);
  vagonTransformationNode.append(rotateBarNode); //add the two last defined bars to the first vagon
  rightBarVagonTransformationNode.append(barNode);

  //transformations for the union between vagons
  var joint2VagonsTransformationMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  joint2VagonsTransformationMatrix = mat4.multiply(
    mat4.create(),
    joint2VagonsTransformationMatrix,
    glm.translate(0, -0.25, -0.36),
  );
  joint2VagonsTransformationMatrix = mat4.multiply(
    mat4.create(),
    joint2VagonsTransformationMatrix,
    glm.scale(0.05, 0.05, 0.2),
  );
  var joint2VagonsTransformationNode = new TransformationSceneGraphNode(
    joint2VagonsTransformationMatrix,
  );
  vagonTransformationNode.append(joint2VagonsTransformationNode);
  joint2VagonsTransformationNode.append(cubeNode);

  {
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [0.3, -0.28, 0.0],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagon2TransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [0.3, -0.28, -0.2],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagon2TransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [0.3, -0.28, 0.2],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagon2TransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [-0.3, -0.28, 0.0],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagon2TransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [-0.3, -0.28, -0.2],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagon2TransformationNode.append(wheelNode);
    wheelNode = new TransformationSGNode(mat4.create(), [
      new TransformationSGNode(
        glm.transform({
          translate: [-0.3, -0.28, 0.2],
          rotateX: -90,
          scale: 0.0018,
        }),
        [wheel],
      ),
    ]);
    vagon2TransformationNode.append(wheelNode);
  }

  //transformations for the bars in the second vagon
  leftBarMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  leftBarMatrix = mat4.multiply(
    mat4.create(),
    leftBarMatrix,
    glm.translate(-0.35, -0.28, 0.0),
  );
  leftBarMatrix = mat4.multiply(
    mat4.create(),
    leftBarMatrix,
    glm.scale(0.05, 0.05, 0.75),
  );
  var leftBarVagon2TransformationNode = new TransformationSceneGraphNode(
    leftBarMatrix,
  );
  rotateBarNode.append(leftBarVagon2TransformationNode);
  leftBarVagon2TransformationNode.append(barNode);

  rightBarMatrix = mat4.multiply(
    mat4.create(),
    mat4.create(),
    glm.rotateY(animatedAngle),
  );
  rightBarMatrix = mat4.multiply(
    mat4.create(),
    rightBarMatrix,
    glm.translate(0.35, -0.28, 0.0),
  );
  rightBarMatrix = mat4.multiply(
    mat4.create(),
    rightBarMatrix,
    glm.scale(0.05, 0.05, 0.75),
  );
  var rightBarVagon2TransformationNode = new TransformationSceneGraphNode(
    rightBarMatrix,
  );
  rotateBarNode.append(rightBarVagon2TransformationNode);
  vagon2TransformationNode.append(rotateBarNode); //add the last two defined Bars to the second vagon
  rightBarVagon2TransformationNode.append(barNode);
}

function convertDegreeToRadians(degree) {
  return (degree * Math.PI) / 180;
}

function getZoomScale() {
  return Math.pow(0.95, scope.zoomSpeed);
}

function setUpModelViewMatrix(sceneMatrix, viewMatrix) {
  var modelViewMatrix = mat4.multiply(mat4.create(), viewMatrix, sceneMatrix);
  gl.uniformMatrix4fv(
    gl.getUniformLocation(context.shader, 'u_modelView'),
    false,
    modelViewMatrix,
  );
}

/**
 * returns a new rendering context
 * @param gl the gl context
 * @param shader the shader program
 * @returns {ISceneGraphContext}
 */
function createSceneGraphContext(gl, shader) {
  // Compute the projection matrix
  projectionMatrix = mat4.perspective(
    mat4.create(),
    glm.deg2rad(45),
    gl.drawingBufferWidth / gl.drawingBufferHeight,
    0.1,
    200,
  );
  //set projectionMatrix
  gl.uniformMatrix4fv(
    gl.getUniformLocation(shader, 'u_projection'),
    false,
    projectionMatrix,
  );

  viewMatrix = calculateViewMatrix();
  invViewMatrix = mat4.invert(mat4.create(), viewMatrix);
  return {
    gl: gl,
    sceneMatrix: mat4.create(),
    viewMatrix: viewMatrix,
    projectionMatrix: projectionMatrix,
    shader: shader,
    invViewMatrix: invViewMatrix,
  };
}
/*
 * Compute the camera's matrix
 */
function calculateViewMatrix() {
  // Make a view matrix from the camera matrix.
  var viewMatrix;
  camera.lookAt = vec3.add(vec3.create(), camera.position, camera.direction);
  let lookAtMatrix = mat4.lookAt(
    mat4.create(),
    camera.position,
    camera.lookAt,
    camera.upwards,
  );
  viewMatrix = lookAtMatrix;
  //compute the camera's matrix
  return viewMatrix;
}

/**
 * Base node of the scenegraph
 */
class SceneGraphNode {
  constructor() {
    this.children = [];
  }

  /**
   * appends a new child to this node
   * @param child the child to append
   * @returns {SceneGraphNode} the child
   */
  append(child) {
    this.children.push(child);
    return child;
  }

  /**
   * removes a child from this node
   * @param child
   * @returns {boolean} whether the operation was successful
   */
  remove(child) {
    var i = this.children.indexOf(child);
    if (i >= 0) {
      this.children.splice(i, 1);
    }
    return i >= 0;
  }

  /**
   * render method to render this scengraph
   * @param context
   */
  render(context) {
    //render all children
    this.children.forEach(function (c) {
      return c.render(context);
    });
  }
}

//Implementation class CubeRenderNode
/**
 * a cube node that renders a cube at its local origin
 */
class CubeRenderNode extends SceneGraphNode {
  render(context) {
    setUpModelViewMatrix(context.sceneMatrix, context.viewMatrix);
    gl.uniformMatrix4fv(
      gl.getUniformLocation(context.shader, 'u_projection'),
      false,
      context.projectionMatrix,
    );

    var positionLocation = gl.getAttribLocation(context.shader, 'a_position');
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeVertexBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    var normalLocation = gl.getAttribLocation(context.shader, 'a_normal');
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeNormalBuffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLocation);

    var textCoorLocation = gl.getAttribLocation(context.shader, 'a_texCoord');
    gl.bindBuffer(gl.ARRAY_BUFFER, cubeTextureCoordBuffer);
    gl.vertexAttribPointer(textCoorLocation, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(textCoorLocation);
    // Draw face 0
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 0);

    // Draw face 1
    gl.bindTexture(gl.TEXTURE_2D, textures[1]);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 12);

    // Draw face 2
    gl.bindTexture(gl.TEXTURE_2D, textures[2]);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 24);

    // Draw face 3
    gl.bindTexture(gl.TEXTURE_2D, textures[3]);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 36);

    // Draw face 4
    gl.bindTexture(gl.TEXTURE_2D, textures[4]);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 48);

    // Draw face 5
    gl.bindTexture(gl.TEXTURE_2D, textures[5]);
    gl.drawElements(gl.TRIANGLES, 6, gl.UNSIGNED_SHORT, 60);

    //set alpha value for blending
    gl.uniform1f(gl.getUniformLocation(context.shader, 'u_alpha'), 0.5);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, cubeIndexBuffer);
    gl.drawElements(gl.TRIANGLES, cubeIndices.length, gl.UNSIGNED_SHORT, 0);

    //render children
    super.render(context);
  }
}
//Implementation class TunnelRenderNode
/**
 * a tunnel node that renders a tunnel
 */
class TunnelRenderNode extends SceneGraphNode {
  render(context) {
    setUpModelViewMatrix(context.sceneMatrix, context.viewMatrix);
    gl.uniformMatrix4fv(
      gl.getUniformLocation(context.shader, 'u_projection'),
      false,
      context.projectionMatrix,
    );

    var positionLocation = gl.getAttribLocation(context.shader, 'a_position');
    gl.bindBuffer(gl.ARRAY_BUFFER, tunnelVertexBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    //set alpha value for blending
    gl.uniform1f(gl.getUniformLocation(context.shader, 'u_alpha'), 0.5);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, tunnelIndexBuffer);
    gl.drawElements(gl.TRIANGLES, tunnelIndices.length, gl.UNSIGNED_SHORT, 0);

    var normalLocation = gl.getAttribLocation(context.shader, 'a_normal');
    gl.bindBuffer(gl.ARRAY_BUFFER, tunnelNormalBuffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLocation);

    //render children
    super.render(context);
  }
}
//Implementation class TrainRenderNode
/**
 * a train node that renders a train
 */
class TrainRenderNode extends SceneGraphNode {
  render(context) {
    setUpModelViewMatrix(context.sceneMatrix, context.viewMatrix);
    gl.uniformMatrix4fv(
      gl.getUniformLocation(context.shader, 'u_projection'),
      false,
      context.projectionMatrix,
    );

    var positionLocation = gl.getAttribLocation(context.shader, 'a_position');
    gl.bindBuffer(gl.ARRAY_BUFFER, trainVertexBuffer);
    gl.vertexAttribPointer(positionLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(positionLocation);

    var normalLocation = gl.getAttribLocation(context.shader, 'a_normal');
    gl.bindBuffer(gl.ARRAY_BUFFER, trainNormalBuffer);
    gl.vertexAttribPointer(normalLocation, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(normalLocation);

    //set alpha value for blending
    gl.uniform1f(gl.getUniformLocation(context.shader, 'u_alpha'), 0.5);
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, trainIndexBuffer);
    gl.drawElements(gl.TRIANGLES, trainIndices.length, gl.UNSIGNED_SHORT, 0);

    //render children
    super.render(context);
  }
}
/**
 * a transformation node, i.e applied a transformation matrix to its successors
 */
class TransformationSceneGraphNode extends SceneGraphNode {
  /**
   * the matrix to apply
   * @param matrix
   */
  constructor(matrix) {
    super();
    this.matrix = matrix || mat4.create();
  }

  render(context) {
    //backup previous one
    var previous = context.sceneMatrix;
    //set current world matrix by multiplying it
    if (previous === null) {
      context.sceneMatrix = mat4.clone(this.matrix);
    } else {
      context.sceneMatrix = mat4.multiply(mat4.create(), previous, this.matrix);
    }

    //render children
    super.render(context);
    //restore backup
    context.sceneMatrix = previous;
  }

  setMatrix(matrix) {
    this.matrix = matrix;
  }
}
/**
 * a shader node sets a specific shader for the successors
 */
class ShaderSceneGraphNode extends SceneGraphNode {
  /**
   * constructs a new shader node with the given shader program
   * @param shader the shader program to use
   */
  constructor(shader) {
    super();
    this.shader = shader;
  }

  render(context) {
    //backup prevoius one
    var backup = context.shader;
    //set current shader
    context.shader = this.shader;
    //activate the shader
    context.gl.useProgram(this.shader);
    //render children
    super.render(context);
    //restore backup
    context.shader = backup;
    //activate the shader
    context.gl.useProgram(backup);
  }
}

/*
 * a scene graph node for setting texture parameters
 */
class TextureSGNode extends SGNode {
  constructor(texture, textureunit, children) {
    super(children);
    this.texture = texture;
    this.textureunit = textureunit;
  }

  render(context) {
    //tell shader to use our texture
    gl.uniform1i(
      gl.getUniformLocation(context.shader, 'u_enableObjectTexture'),
      1,
    );
    //set additional shader parameters
    gl.uniform1i(
      gl.getUniformLocation(context.shader, 'u_tex'),
      this.textureunit,
    );
    //activate/select texture unit and bind texture
    gl.activeTexture(gl.TEXTURE0 + this.textureunit);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    //render children
    super.render(context);

    //clean up
    gl.activeTexture(gl.TEXTURE0 + this.textureunit); //set active texture unit since it might have changed in children render functions
    gl.bindTexture(gl.TEXTURE_2D, null);
    //disable texturing in shader
    gl.uniform1i(
      gl.getUniformLocation(context.shader, 'u_enableObjectTexture'),
      0,
    );
  }
}

//a scene graph node for setting heightmap parameters
class HeightmapSGNode extends SGNode {
  constructor(texture, textureunit, children) {
    super(children);
    this.texture = texture;
    this.textureunit = textureunit;
  }

  render(context) {
    // lookup the sampler locations.
    var u_image0Location = gl.getUniformLocation(context.shader, 'u_texture1');
    var u_image1Location = gl.getUniformLocation(context.shader, 'u_texture2');
    var u_image2Location = gl.getUniformLocation(context.shader, 'u_texture3');
    var u_image3Location = gl.getUniformLocation(context.shader, 'u_texture4');
    var u_image4Location = gl.getUniformLocation(context.shader, 'u_texture5');
    //tell shader to use our texture
    gl.uniform1i(
      gl.getUniformLocation(context.shader, 'u_enableObjectTexture'),
      1,
    );
    //set additional shader parameters
    //set texture units
    gl.uniform1i(
      gl.getUniformLocation(context.shader, 'u_heightmap'),
      this.textureunit,
    );
    gl.uniform1i(
      gl.getUniformLocation(context.shader, 'u_tex'),
      this.textureunit + 1,
    );
    // set which texture units to render with.
    gl.uniform1i(u_image0Location, this.textureunit + 2); // texture unit 1
    gl.uniform1i(u_image1Location, this.textureunit + 3); // texture unit 2
    gl.uniform1i(u_image2Location, this.textureunit + 4); // texture unit 3
    gl.uniform1i(u_image3Location, this.textureunit + 5); // texture unit 4
    gl.uniform1i(u_image4Location, this.textureunit + 6); // texture unit 5

    //activate/select texture unit and bind texture
    gl.activeTexture(gl.TEXTURE0 + this.textureunit);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 1);
    gl.bindTexture(gl.TEXTURE_2D, this.texture);
    // Set each texture unit to use a particular texture.
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 2);
    gl.bindTexture(gl.TEXTURE_2D, textures[0]);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 3);
    gl.bindTexture(gl.TEXTURE_2D, textures[1]);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 4);
    gl.bindTexture(gl.TEXTURE_2D, textures[2]);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 5);
    gl.bindTexture(gl.TEXTURE_2D, textures[3]);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 6);
    gl.bindTexture(gl.TEXTURE_2D, textures[4]);

    //render children
    super.render(context);

    //clean up
    //activate/select texture unit and bind null as texture
    //set active textures unit since it might have changed in children render functions
    gl.activeTexture(gl.TEXTURE0 + this.textureunit);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 1);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 2);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 3);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 4);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 5);
    gl.bindTexture(gl.TEXTURE_2D, null);
    gl.activeTexture(gl.TEXTURE0 + this.textureunit + 6);
    gl.bindTexture(gl.TEXTURE_2D, null);

    //disable texturing in shader
    gl.uniform1i(
      gl.getUniformLocation(context.shader, 'u_enableObjectTexture'),
      0,
    );
  }
}

//a scene graph node for setting shadow parameters
class ShadowSGNode extends SGNode {
  constructor(shadowtexture, textureunit, width, height, children) {
    super(children);
    this.shadowtexture = shadowtexture;
    this.textureunit = textureunit;
    this.texturewidth = width;
    this.textureheight = height;
    this.lightViewProjectionMatrix = mat4.create(); //has to be updated each frame
  }

  render(context) {
    //set additional shader parameters
    gl.uniform1i(
      gl.getUniformLocation(context.shader, 'u_depthMap'),
      this.textureunit,
    );

    //pass shadow map size to shader (required for extra task)
    gl.uniform1f(
      gl.getUniformLocation(context.shader, 'u_shadowMapWidth'),
      this.texturewidth,
    );
    gl.uniform1f(
      gl.getUniformLocation(context.shader, 'u_shadowMapHeight'),
      this.textureheight,
    );

    //compute eye-to-light matrix by multiplying this.lightViewProjectionMatrix and context.invViewMatrix
    //Hint: Look at the computation of lightViewProjectionMatrix to see how to multiply two matrices and for the correct order of the matrices!
    var eyeToLightMatrix = mat4.multiply(
      mat4.create(),
      this.lightViewProjectionMatrix,
      context.invViewMatrix,
    );
    gl.uniformMatrix4fv(
      gl.getUniformLocation(context.shader, 'u_eyeToLightMatrix'),
      false,
      eyeToLightMatrix,
    );

    //activate and bind texture
    gl.activeTexture(gl.TEXTURE0 + this.textureunit);
    gl.bindTexture(gl.TEXTURE_2D, this.shadowtexture);

    //render children
    super.render(context);

    //clean up
    gl.activeTexture(gl.TEXTURE0 + this.textureunit);
    gl.bindTexture(gl.TEXTURE_2D, null);
  }
}
/**
 * a material node contains the material properties for the underlying models
 */
class MaterialNode extends SGNode {
  constructor(children) {
    super(children);
    this.ambient = [0.2, 0.2, 0.2, 1.0];
    this.diffuse = [0.8, 0.8, 0.8, 1.0];
    this.specular = [0, 0, 0, 1];
    this.emission = [0, 0, 0, 1];
    this.shininess = 0;
    this.uniform = 'u_material';
  }

  setMaterialUniforms(context) {
    const gl = context.gl,
      shader = context.shader;

    //set uniforms
    //hint setting a structure element using the dot notation, e.g. u_material.test
    gl.uniform4fv(
      gl.getUniformLocation(shader, this.uniform + '.ambient'),
      this.ambient,
    );
    gl.uniform4fv(
      gl.getUniformLocation(shader, this.uniform + '.diffuse'),
      this.diffuse,
    );
    gl.uniform4fv(
      gl.getUniformLocation(shader, this.uniform + '.specular'),
      this.specular,
    );
    gl.uniform4fv(
      gl.getUniformLocation(shader, this.uniform + '.emission'),
      this.emission,
    );
    gl.uniform1f(
      gl.getUniformLocation(shader, this.uniform + '.shininess'),
      this.shininess,
    );
  }

  render(context) {
    this.setMaterialUniforms(context);

    //render children
    super.render(context);
  }
}

/**
 * a light node represents a light including light position and light properties (ambient, diffuse, specular)
 * the light position will be transformed according to the current model view matrix
 */
class LightNode extends TransformationSGNode {
  constructor(position, children) {
    super(children);
    this.position = position || [0, 0, 0];
    this.ambient = [0, 0, 0, 1];
    this.diffuse = [1, 1, 1, 1];
    this.specular = [1, 1, 1, 1];
    //uniform name
    this.uniform = 'u_light';
  }

  /**
   * computes the absolute light position in world coordinates
   */
  computeLightPosition(context) {
    //transform with the current model view matrix
    const modelViewMatrix = mat4.multiply(
      mat4.create(),
      context.viewMatrix,
      context.sceneMatrix,
    );
    const pos = [this.position[0], this.position[1], this.position[2], 1];
    return vec4.transformMat4(vec4.create(), pos, modelViewMatrix);
  }

  setLightUniforms(context) {
    const gl = context.gl,
      shader = context.shader,
      position = this.computeLightPosition(context);

    //set uniforms
    gl.uniform4fv(
      gl.getUniformLocation(shader, this.uniform + '.ambient'),
      this.ambient,
    );
    gl.uniform4fv(
      gl.getUniformLocation(shader, this.uniform + '.diffuse'),
      this.diffuse,
    );
    gl.uniform4fv(
      gl.getUniformLocation(shader, this.uniform + '.specular'),
      this.specular,
    );

    gl.uniform3f(
      gl.getUniformLocation(shader, this.uniform + 'Pos'),
      position[0],
      position[1],
      position[2],
    );
  }

  render(context) {
    this.setLightUniforms(context);
    //since this a transformation node update the matrix according to my position
    this.matrix = glm.translate(
      this.position[0],
      this.position[1],
      this.position[2],
    );

    //render children
    super.render(context);
  }
}
