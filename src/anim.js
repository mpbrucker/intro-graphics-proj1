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
var ANGLE_STEP = 45.0;

function main() {
    loadOBJ('../obj/teapot.obj').then(data => mainLoop(data));
}


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

    gl.enable(gl.DEPTH_TEST);
    gl.clearDepth(0.0);
    gl.depthFunc(gl.GREATER);

    // Get storage location of u_ModelMatrix
    var u_ModelMatrix = gl.getUniformLocation(gl.program, 'u_ModelMatrix');
    if (!u_ModelMatrix) { 
        console.log('Failed to get the storage location of u_ModelMatrix');
        return;
    }

    // Current rotation angle
    var currentAnimProperties = {angle: 0.0, yOffset: 0.0};
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
//==============================================================================
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

function draw(gl, n, animProperties, modelMatrix, u_ModelMatrix) {
//==============================================================================
    // Clear <canvas>
    gl.clear(gl.COLOR_BUFFER_BIT);

    // Build our Robot Arm by successively moving our drawing axes
    //-------Draw Lower Arm---------------
    var aspect = gl.canvas.width / gl.canvas.height;
    modelMatrix.setIdentity();
    modelMatrix.scale(0.1,0.1*aspect,-0.1);
    modelMatrix.translate(-0.4,-0.4+animProperties.yOffset, 0.0);    // 'set' means DISCARD old matrix,
    modelMatrix.rotate(animProperties.angle, 0, 1, 0);    // Spin around Y axis

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINE_STRIP, 0, n);
    pushMatrix(modelMatrix);

    // DRAW LEFT LEG
    modelMatrix.translate(0,0, -1.3);    // 'set' means DISCARD old matrix,
    modelMatrix.scale(0.1,1,0.2);
    modelMatrix.rotate(-animProperties.yOffset*50, 0, 0, 1);    // Spin around Y axis
    modelMatrix.translate(0,-3.15,0)

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINE_STRIP, 0, n);

    modelMatrix = popMatrix();

    // DRAW RIGHT LEG
    modelMatrix.translate(0,0, 1.3);    // 'set' means DISCARD old matrix,
    modelMatrix.scale(0.1,1,0.2);
    modelMatrix.rotate(animProperties.yOffset*100, 0, 0, 1);    // Spin around Y axis
    modelMatrix.translate(0,-3.15,0)

    gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    gl.drawArrays(gl.LINE_STRIP, 0, n);
    





    // printMat4(modelMatrix);


    


    // //-------Draw Upper Arm----------------
    // modelMatrix.translate(0.1, 0.5, 0); 			// Make new drawing axes that
    // 						// we moved upwards (+y) measured in prev. drawing axes, and
    // 						// moved rightwards (+x) by half the width of the box we just drew.
    // modelMatrix.scale(0.6,0.6,0.6);				// Make new drawing axes that
    // 						// are smaller that the previous drawing axes by 0.6.
    // modelMatrix.rotate(currentAngle*0.8, 0,0,1);	// Make new drawing axes that
    // 						// spin around Z axis (0,0,1) of the previous drawing 
    // 						// axes, using the same origin.
    // modelMatrix.translate(-0.1, 0, 0);			// Make new drawing axes that
    // 						// move sideways by half the width of our rectangle model
    // 						// (REMEMBER! modelMatrix.scale() DIDN'T change the 
    // 						// the vertices of our model stored in our VBO; instead
    // 						// we changed the DRAWING AXES used to draw it. Thus
    // 						// we translate by the 0.1, not 0.1*0.6.)
    // // DRAW BOX: Use this matrix to transform & draw our VBO's contents:
    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);
 

	// modelMatrix.translate(0.1, 0.5, 0.0);	// Make new drawing axes at 
	// 					    // the robot's "wrist" -- at the center top of upper arm
	
	// // SAVE CURRENT DRAWING AXES HERE--------------------------
	// //    copy current matrix so that we can return to these same drawing axes
	// // later, when we draw the UPPER jaw of the robot pincer.    HOW?
	// // Try a 'push-down stack'.    We want to 'push' our current modelMatrix
	// // onto the stack to save it; then later 'pop' when we're ready to draw
	// // the upper pincer.
	// //----------------------------------------------------------
	// pushMatrix(modelMatrix);
	// //-----------------------------------------------------------
	// // CAUTION!    Instead of our textbook's matrix library 
	// //    (WebGL Programming Guide:    
	// //
	// //				lib/cuon-matrix.js
	// //
	// // be sure your HTML file loads this MODIFIED matrix library:
	// //
	// //				cuon-matrix-mod.js
	// // where Adrien Katsuya Tateno (your diligent classmate in EECS351)
	// // has added push-down matrix-stack functions 'push' and 'pop'.
	// //--------------------------------------------------------------

	// //=========Draw lower jaw of robot pincer============================
	// modelMatrix.rotate(-25.0 +0.5* currentAngle, 0,0,1);		
	// 					// make new drawing axes that rotate for lower-jaw
	// modelMatrix.scale(0.4, 0.4, 0.4);		// Make new drawing axes that
	// 					// have size of just 40% of previous drawing axes,
	// 					// (Then translate? no need--we already have the box's 
	// 					//	left corner at the wrist-point; no change needed.)
	// // Draw inner lower jaw segment:				
    // // DRAW BOX: Use this matrix to transform & draw our VBO's contents:
    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);

	// // Now move drawing axes to the centered end of that lower-jaw segment:
	// modelMatrix.translate(0.1, 0.5, 0.0);
	// modelMatrix.rotate(40.0, 0,0,1);		// make bend in the lower jaw
	// modelMatrix.translate(-0.1, 0.0, 0.0);	// re-center the outer segment,
	 
	// // Draw outer lower jaw segment:				
    // // DRAW BOX: Use this matrix to transform & draw our VBO's contents:
    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);
    
    // // RETURN to the saved drawing axes at the 'wrist':
	// // RETRIEVE PREVIOUSLY-SAVED DRAWING AXES HERE:
	// //---------------------
	// modelMatrix = popMatrix();
	// //----------------------
	
	// //=========Draw lower jaw of robot pincer============================
	// // (almost identical to the way I drew the upper jaw)
	// modelMatrix.rotate(25.0 -0.5* currentAngle, 0,0,1);		
	// 					// make new drawing axes that rotate upper jaw symmetrically
	// 					// with lower jaw: changed sign of 15.0 and of 0.5
	// modelMatrix.scale(0.4, 0.4, 0.4);		// Make new drawing axes that
	// 					// have size of just 40% of previous drawing axes,
	// modelMatrix.translate(-0.2, 0, 0);    // move box LEFT corner at wrist-point.
	
	// // Draw inner upper jaw segment:				(same as for lower jaw)
    // // DRAW BOX: Use this matrix to transform & draw our VBO's contents:
    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);

	// // Now move drawing axes to the centered end of that upper-jaw segment:
	// modelMatrix.translate(0.1, 0.5, 0.0);
	// modelMatrix.rotate(-40.0, 0,0,1);		// make bend in the upper jaw that
	// 																		// is opposite of lower jaw (+/-40.0)
	// modelMatrix.translate(-0.1, 0.0, 0.0);	// re-center the outer segment,
	 
	// // Draw outer upper jaw segment:		(same as for lower jaw)		
    // // DRAW BOX: Use this matrix to transform & draw our VBO's contents:
    // gl.uniformMatrix4fv(u_ModelMatrix, false, modelMatrix.elements);
    // gl.drawArrays(gl.LINE_STRIP, 0, n);
}

// Last time that this function was called:    (used for animation timing)
var g_last = Date.now();

function animate(properties) {
//==============================================================================
    // Calculate the elapsed time
    var now = Date.now();
    var elapsed = now - g_last;
    g_last = now;
    
    // Calculate current state variables
    var newAngle = properties.angle + (ANGLE_STEP * elapsed) / 1000.0;
    var yOffset = Math.sin(now / 100) * 0.2;
    return {angle: newAngle % 360, yOffset: yOffset};
}

function moreCCW() {
//==============================================================================

    ANGLE_STEP += 10; 
}

function lessCCW() {
//==============================================================================
    ANGLE_STEP -= 10; 
}
