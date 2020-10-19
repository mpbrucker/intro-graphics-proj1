// Vertex shader program----------------------------------
var VSHADER_SOURCE =`
        uniform mat4 u_ModelMatrix;
        attribute vec4 a_Position;
        attribute vec4 a_Color;
        varying vec4 v_Color;
        void main() {
                gl_Position = u_ModelMatrix * a_Position;
                gl_PointSize = 10.0;
                v_Color = a_Color;
        }`;
// Fragment shader program----------------------------------
var FSHADER_SOURCE =`
    precision mediump float;
    varying vec4 v_Color;
    void main() {
        gl_FragColor = v_Color;
    }`;
//    Each instance computes all the on-screen attributes for just one PIXEL.
// here we do the bare minimum: if we draw any part of any drawing primitive in 
// any pixel, we simply set that pixel to the constant color specified here.


// Global Variable -- Rotation angle rate (degrees/second)
var ratio = 1;
var mouseDown = false;
var hasMouseMoved = false;
var flowerRotation = 0;
var curLetter = 0;

// Animation variables for Dat.GUI
var maxLegAngle = 20;
var angleStep = 45.0;
var walkSpeed = 2;


// Assembly move state vars
var xDesired = 0.0;
var yDesired = 0.0;
var xDiff = 0.0;
var yDiff = 0.0;


// Mouse drag state vars
var xDrag = 0;
var yDrag = 0;
var xDown = 0;
var yDown = 0;

// Generate random position for flowers
var flowerPos = [];
for (var i=0; i<16; i++) {
    flowerPos.push(Math.random()*2-1);
}

function main() {
    window.addEventListener("mousedown", myMouseDown)
    window.addEventListener("mouseup", myMouseUp)
    window.addEventListener("mousemove", myMouseMove)
    window.addEventListener("keydown", myKeyDown, false);
    // loadOBJ('../obj/teapot.obj').then(data => mainLoop(data));
    var vertData = genTrapezoidPrism(1,0.7,1,1).concat(genTrianglePrism(1,1,1)); 
    mainLoop(vertData)
}

var loremText = document.getElementById('letters');
loremText.innerHTML = lorem.substring(curLetter, curLetter+20);
function myKeyDown(ev) {
    ev.preventDefault();
    if (ev.key == lorem.charAt(curLetter)) {
        flowerRotation += 5;
        curLetter +=1;
        loremText.innerHTML = lorem.substring(curLetter, curLetter+20);
    }
}

function myMouseUp(ev) {
    mouseDown = false;
    yDrag = 0;
    xDrag = 0;
    if (!hasMouseMoved) {
        moveAssembly(ev);
    }
}

function myMouseDown(ev) {
    mouseDown = true;
    hasMouseMoved = false;
    var pos = getStandardizedPos(ev);
    xDown = pos[0];
    yDown = pos[1];
}

function myMouseMove(ev) {
    hasMouseMoved = true;
    if (mouseDown) {
        var pos = getStandardizedPos(ev);
        xDrag = pos[0] - xDown;
        yDrag = pos[1] - yDown;
    }
}

function moveAssembly(ev) {
    var pos = getStandardizedPos(ev);
    var x = pos[0];
    var y = pos[1];
    xDesired = x;
    yDesired = y;
};

var g_canvas = document.getElementById('webgl');     
function getStandardizedPos(ev) {
    var rect = g_canvas.getBoundingClientRect();	// get canvas corners in pixels
    var xp = ev.clientX - rect.left;									// x==0 at canvas left edge
    var yp = g_canvas.height - (ev.clientY - rect.top);	// y==0 at canvas bottom edge

    var x = (xp - g_canvas.width/2)  / 	(g_canvas.width/2);			// normalize canvas to -1 <= x < +1,
    var y = (yp - g_canvas.height/2) /	(g_canvas.height/2);
    return [x, y];
}

// Current rotation angle
var currentAnimProperties = {angle: 0.0, yOffset: 0.0, xVal: 0.0, yVal: 0.0, flowerAngle: 0, legAngle: 0};
function mainLoop(vertData) {
//==============================================================================
    // Retrieve <canvas> element
    var canvas = document.getElementById('webgl');

    // Get the rendering context for WebGL
    var gl = getWebGLContext(canvas);
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    if (!gl) {
        console.log('Failed to get the rendering context for WebGL');
        return;
    }

    gl.enable(gl.DEPTH_TEST); // enabled by default, but let's be SURE.
    gl.clearDepth(0.0); // each time we 'clear' our depth buffer, set all
    //     // pixel depths to 0.0 (1.0 is DEFAULT)
    gl.depthFunc(gl.LESS); // (gl.LESS is DEFAULT; reverse it!)

    // Initialize shaders
    if (!initShaders(gl, VSHADER_SOURCE, FSHADER_SOURCE)) {
        console.log('Failed to intialize shaders.');
        return;
    }

    // Write the positions of vertices into an array, transfer
    // array contents to a Vertex Buffer Object created in the
    // graphics hardware.
    printVertProperties(vertData)
    var n = initVertexBuffers(gl, vertData);
    if (n < 0) {
        console.log('Failed to set the positions of the vertices');
        return;
    }

    // Specify the color for clearing <canvas>
    gl.clearColor(0, 0, 0, 1);

    // Get storage location of u_ModelMatrix
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) { 
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Model matrix
    var modelMatrix = new Matrix4();

    // Start drawing
    var tick = function() {
        currentAnimProperties = animate(currentAnimProperties);    // Update the rotation angle
        draw(gl, n, currentAnimProperties, modelMatrix, u_ModelMatrix);     // Draw the triangle
        requestAnimationFrame(tick, canvas);     // Request that the browser ?calls tick
    };
    tick();
}

function initVertexBuffers(gl, vertData) {
    var vertices = new Float32Array(vertData);
    console.log(vertData)
    var n = vertData.length / 7;     // Divide by the number of items per vertex

    // Create a buffer object
    var shapeBuffer = gl.createBuffer();
    if (!shapeBuffer) {
        console.log('Failed to create the buffer object');
        return -1;
    }

    // Bind the buffer object to target
    gl.bindBuffer(gl.ARRAY_BUFFER, shapeBuffer);
    // Write date into the buffer object
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    // Get the number of bytes per elem in vertices array
    var FSIZE = vertices.BYTES_PER_ELEMENT;

    // Assign the position data in the buffer object to a_Position variable
    var a_Position = gl.getAttribLocation(gl.program, 'a_Position');
    if(a_Position < 0) {
        console.log('Failed to get the storage location of a_Position');
        return -1;
    }
    gl.vertexAttribPointer(a_Position, 4, gl.FLOAT, false, FSIZE * 7, 0);
    gl.enableVertexAttribArray(a_Position);

    // Assign the color data in the buffer object to a_Position variable
    var a_Color = gl.getAttribLocation(gl.program, 'a_Color');
    if(a_Color < 0) {
        console.log('Failed to get the storage location of a_Color');
        return -1;
    }
    gl.vertexAttribPointer(a_Color, 3, gl.FLOAT, false, FSIZE * 7, FSIZE * 4);
    gl.enableVertexAttribArray(a_Color);

    gl.bindBuffer(gl.ARRAY_BUFFER, null)

    return n;
}

function printMat4(matrix) {
    var elems = matrix.elements;
    console.log(`
    ${elems[0].toFixed(2)} ${elems[4].toFixed(2)} ${elems[8].toFixed(2)} ${elems[12].toFixed(2)}
    ${elems[1].toFixed(2)} ${elems[5].toFixed(2)} ${elems[9].toFixed(2)} ${elems[13].toFixed(2)}
    ${elems[2].toFixed(2)} ${elems[6].toFixed(2)} ${elems[10].toFixed(2)} ${elems[14].toFixed(2)}
    ${elems[3].toFixed(2)} ${elems[7].toFixed(2)} ${elems[11].toFixed(2)} ${elems[15].toFixed(2)}
    `)
}

function drawTrapezoid(gl) {
    gl.drawArrays(gl.TRIANGLES, 0, 36);
}

function drawTriangle(gl) {
    gl.drawArrays(gl.TRIANGLES, 36, 24);
}

function draw(gl, n, animProperties, modelMatrix, u_ModelMatrix) {
//==============================================================================
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Build our Robot Arm by successively moving our drawing axes
    //-------Draw Lower Arm---------------
    var aspect = gl.canvas.width / gl.canvas.height;
    modelMatrix.setIdentity();
    modelMatrix.scale(1,1,-1); // TODO figure out how to get the reverse depth buffering working
    pushMatrix(modelMatrix);
    modelMatrix.translate(animProperties.xVal, animProperties.yVal, 0.0);    // 'set' means DISCARD old matrix,

    modelMatrix.scale(0.1,0.1*aspect,0.1);
    modelMatrix.translate(0,animProperties.yOffset, 0.0);    // 'set' means DISCARD old matrix,
    modelMatrix.rotate(animProperties.angle, 0, 1, 0);    // Spin around Y axis
    pushMatrix(modelMatrix);
    modelMatrix.scale(2,1,1);


    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawTrapezoid(gl)

    // DRAW RIGHT LEG JOINT
    modelMatrix = popMatrix();
    pushMatrix(modelMatrix);
    modelMatrix.translate(1,0,0); 
    modelMatrix.rotate(animProperties.legAngle+(yDrag*100), 1, 0, 0);   
    pushMatrix(modelMatrix);
   
    modelMatrix.scale(0.6,1,1);
    // modelMatrix.rotate(26.57, 0, 0, 1);    
    // modelMatrix.rotate(-26.57, 0, 0, 1);    
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawTriangle(gl);

    // DRAW RIGHT LEG FIRST LIMB
    modelMatrix = popMatrix();
    modelMatrix.translate(0,-1.25,0); 
    modelMatrix.rotate(90, 0, 1, 0);
    pushMatrix(modelMatrix);
    modelMatrix.scale(1,1.5,0.6);  

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawTrapezoid(gl);

    // DRAW RIGHT LEG SECOND LIMB
    modelMatrix = popMatrix();
    modelMatrix.translate(0,-1.5,0);
    modelMatrix.rotate(animProperties.legAngle+(maxLegAngle/2)+(xDrag*50), 0, 0, 1);
 
    pushMatrix(modelMatrix);
    modelMatrix.scale(0.75,1.5,0.6);  
    // modelMatrix.rotate(180, 0, 0, 1);

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawTrapezoid(gl);

    // DRAW RIGHT LEG FOOT
    modelMatrix = popMatrix();
    modelMatrix.translate(-.315,-.875,0); 
    modelMatrix.scale(1.5,0.25,0.6);  
    modelMatrix.rotate(180, 0, 0, 1)

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawTrapezoid(gl);

    // DRAW LEFT LEG JOINT
    modelMatrix = popMatrix();
    modelMatrix.translate(-1,0,0); 
    modelMatrix.rotate(-(animProperties.legAngle)-(yDrag*100), 1, 0, 0);   
    pushMatrix(modelMatrix);
   
    modelMatrix.scale(0.6,1,1);
    // modelMatrix.rotate(26.57, 0, 0, 1);    
    // modelMatrix.rotate(-26.57, 0, 0, 1);    
    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawTriangle(gl);

    // DRAW LEFT LEG FIRST LIMB
    modelMatrix = popMatrix();
    modelMatrix.translate(0,-1.25,0); 
    modelMatrix.rotate(90, 0, 1, 0);
    pushMatrix(modelMatrix);
    modelMatrix.scale(1,1.5,0.6);  

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawTrapezoid(gl);

    // DRAW LEFT LEG SECOND LIMB
    modelMatrix = popMatrix();
    modelMatrix.translate(0,-1.5,0);
    modelMatrix.rotate(-(animProperties.legAngle)+(maxLegAngle/2)-(xDrag*50), 0, 0, 1);
 
    pushMatrix(modelMatrix);
    modelMatrix.scale(0.75,1.5,0.6);  
    // modelMatrix.rotate(180, 0, 0, 1);

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawTrapezoid(gl);

    // DRAW LEFT LEG FOOT
    modelMatrix = popMatrix();
    modelMatrix.translate(-.315,-.875,0); 
    modelMatrix.scale(1.5,0.25,0.6);  
    modelMatrix.rotate(180, 0, 0, 1)

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    drawTrapezoid(gl);

    // DRAW FLOWERS
    for (var k=0; k<6; k++) {
        modelMatrix.setIdentity();
        modelMatrix.scale(1,1,-1);
        pushMatrix(modelMatrix);
        // console.log(flowerPos[k*2])
        modelMatrix.translate(flowerPos[k*2], [flowerPos[k*2+1]], -0.5);
        modelMatrix.scale(0.05,0.05*aspect,0.05);
        modelMatrix.rotate(-90, 1,0,0);
        modelMatrix.rotate(flowerRotation, 0, 1, 0);
    
        pushMatrix(modelMatrix);
        for (var j=0; j<9; j++) {
            modelMatrix = popMatrix();
            modelMatrix.rotate(40, 0,1,0);
            pushMatrix(modelMatrix);
            for (var i=0; i<4; i++) {
                modelMatrix.translate(1, 0, 0)
                modelMatrix.translate(-0.5, 0.5, 0);
                modelMatrix.rotate(-animProperties.flowerAngle*2, 0, 0, 1);
                modelMatrix.translate(0.5, -0.5, 0); 
                gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
                drawTrapezoid(gl);
            }
        }
    
    }
}

// Last time that this function was called:    (used for animation timing)
var g_last = Date.now();

function animate(properties) {
//==============================================================================
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;

    var xDiff = xDesired-properties.xVal;
    var yDiff = yDesired-properties.yVal;

    var newX = properties.xVal;
    if (Math.abs(xDiff) > 0.01) {
        newX += 0.001*elapsed*xDiff;
    }

    var newY = properties.yVal;
    if (Math.abs(yDiff) > 0.01) {
        newY += 0.001*elapsed*yDiff;
    }
    
    // Calculate current state variables
    var newAngle = properties.angle + (angleStep * elapsed) / 1000.0;
    var newLegAngle = Math.sin(now * (walkSpeed/ 400)) * maxLegAngle;
    var flowerAngle = (Math.sin(now / 1000) * 8.5) + 8.5;
    if (!mouseDown) {
        var yOffset = Math.sin(now / 250) * 0.2;
    } else {
        var yOffset = properties.yOffset;
    }
    return {angle: newAngle % 360, yOffset: yOffset, xVal: newX, yVal: newY, flowerAngle: flowerAngle, legAngle: newLegAngle};
}
