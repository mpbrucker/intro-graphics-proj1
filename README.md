# CS 351 Project 1: Typing Adventure
### Matt Brucker, mpb0492
 
## Goals

My main goal for this project was understand how to create and animate more complex assemblies in WebGL. However, because I have a decent amount of Javascript experience, my secondary goals for this project were to explore how to write well-structured, reusaable WebGL code and to explore more complex and intuitive forms of user controls. I chose to create a small "typing game," which I call Typing Adventure, as a way to explore different forms of user controls.

## User Guide

There are three ways to interact with the Typing Adventure game. You can move your "character" (the disembodied pair of legs) around the screen by clicking your mouse--the character will "walk" to wherever you click. If you hold down the left mouse button and drag, you can manually control the leg joints of your character: up-down movement rotates the hip joints, and left-right movement rotates the knee joints.

The primary form of interaction is typing! If you (correctly) type the words at the bottom of the screen, the flowers in the background will rotate. So, the faster you type, the faster the flowers rotate!

## Help / Code Structure

The source code for the project resides in `/src.` I chose to separate the code into two separate JS files. `utilities.js`  contains utility functions, including a basic OBJ file loader and a print function for debugging, but it also contains two critical functions: `genTrianglePrism` and `genTrapezoidPrism`, which return a parametric series of vertices for generating triangular and trapezoidal prisms, respectively. `anim.js` contains all of my user control and rendering/animation code.

## Results

![](img/img1.png)

![](img/img2.png)

![](img/img3.png)

![](img/img4.png)