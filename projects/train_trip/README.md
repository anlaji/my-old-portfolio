# CG Lab Project SS2019

Submission template for the CG lab project at the Johannes Kepler University Linz.

**Explanation:**
This `README.md` needs to be pushed to Github for each of the 3 delivery dates.
For every submission change/extend the corresponding sections by replacing the [TODO] markers.
_In order to meet the deadlines make sure you push everything to your Github repository._
For more details see the [full specification document in the Google Drive folder](https://www.cg.jku.at/teaching/computergraphics/lab)

# Concept submission due on 29.03.2019

**Movie Name:**
Train Trip

**Group Members**

| Student ID | First Name | Last Name      |
| ---------- | ---------- | -------------- |
| K1056824   | Angela     | Laguia Jimenez |

**Concept** (Explain the basic story of your movie, i.e., planned scenes, what happens, which objects are used, etc.)

We would like to make a scene with a train driving through a landscape and a tunnel and maybe stops at a trainstation.

**Special Effects** (Selected special effects must add up to exactly 30 points)

| Selected | ID  | Name                                  | Points |
| -------- | --- | ------------------------------------- | ------ |
| no       | S1  | Multi texturing                       | 10     |
| yes      | S2  | Level of detail                       | 10     |
| no       | S3  | Billboarding                          | 10     |
| yes      | S4  | Terrain from heightmap                | 20     |
| no       | S5  | Postprocessing shader                 | 20     |
| no       | S6  | Animated water surface                | 20     |
| no       | S7  | Minimap                               | 20     |
| no       | S8  | Particle system (rain, smoke, fire)   | 20     |
| no       | S9  | Motion blur                           | 30     |
| no       | SO  | Own suggestion (preapproved by email) | [TODO] |

# Intermediate submission due on 28.04.2019

Push your code. Nothing to change here in `README` file.

# Final submission due on 19.06.2019

**Workload**

| Student ID | Workload (in %) |
| ---------- | --------------- |
| K01056824  | 100%            |

**Effects**

| Done   | ID  | Name                                                                                                   | Max. Points | Issues/Comments                                              |
| ------ | --- | ------------------------------------------------------------------------------------------------------ | ----------- | ------------------------------------------------------------ |
| yes    | 1a  | Add at least one manually composed object that consists of multiple scene graph nodes.                 | 6           |                                                              |
| yes    | 1b  | Animate separate parts of the composed object and also move the composed object itself in the scene.   | 4           |                                                              |
| yes    | 1c  | Use at least two clearly different materials for the composed object.                                  | 3           |                                                              |
| yes    | 2a  | Create one scene graph node that renders a complex 3D shape. Fully specify properties for this object. | 7           |                                                              |
| no     | 2b  | Apply a texture to your self-created complex object by setting proper texture coordinates.             | 3           | I wanted to do it for the tree, but it seems it doesn´t work |
| yes    | 3a  | Use multiple light sources.                                                                            | 5           |                                                              |
| yes    | 3b  | One light source should be moving in the scene.                                                        | 3           |                                                              |
| yes    | 3c  | Implement at least one spot-light.                                                                     | 7           |                                                              |
| yes    | 3d  | Apply Phong shading to all objects in the scene.                                                       | 3           |                                                              |
| yes    | 4a  | Use the WASD-keys to manually control the camera along the viewing direction                           | 6           |                                                              |
| yes    | 4b  | Use the mouse to control the heading and pitch of the camera relative to the ground.                   | 3           |                                                              |
| yes    | 5a  | Animations start automatically.                                                                        | 2           |                                                              |
| yes    | 5b  | Animations are framerate-independent.                                                                  | 3           |                                                              |
| yes    | 5c  | The camera is animated without user intervention.                                                      | 5           | Just at the beginning                                        |
| no     | S2  | Correctly implemented special effect: LOD.                                                             | 10          |                                                              |
| yes    | S4  | Correctly implemented special effect: Terrain from heightmap                                           | 20          |                                                              |
| mostly | SE  | Special effects are nicely integrated and well documented                                              | 10          |                                                              |

**Special Effect Description** (Describe how they work in principle and how you implemented them.)

1. Train with two composed complex objects, many cubes and a light. Wheels appear to be moving, because of the rotation of a bar.
2. Tunnel, complex object
3. Trainstation, composed object with some ilumination
4. Trees, also composed object with/without a bird -loaded model-, which rotates, different materials for the leaves and trunk
5. Terrain from heightmap, get the height from a picture (in vertex shader) and
   a mixture of textures is applied (in fragment shader).
6. Camera animation (starts automatically + manually control after animation)
7. One light moving above the terrain.
