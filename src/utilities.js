
function genTrianglePrism(w,h,d) {
    return [
        // Front face
        w/2, -h/2, d/2, 1.0, 0.0, 1.0, 0.0,
        0.0, h/2, d/2, 1.0, 1.0, 1.0, 0.0,
        -w/2, -h/2, d/2, 1.0, 1.0, 1.0, 1.0,

        // Back face
        w/2, -h/2, -d/2, 1.0, 1.0, 0.0, 0.0,
        0.0, h/2, -d/2, 1.0, 1.0, 1.0, 0.0,
        -w/2, -h/2, -d/2, 1.0, 0.0, 1.0, 0.0,

        // Top right face
        0.0, h/2, d/2, 1.0, 1.0, 1.0, 0.0,
        w/2, -h/2, d/2, 1.0, 1.0, 0.0, 0.0,
        0.0, h/2, -d/2, 1.0, 0.0, 1.0, 0.0,

        0.0, h/2, -d/2, 1.0, 1.0, 1.0, 0.0,
        w/2, -h/2, d/2, 1.0, 1.0, 0.0, 0.0,
        w/2, -h/2, -d/2, 1.0, 1.0, 0.0, 0.0, 

        // Top left face
        0.0, h/2, d/2, 1.0, 1.0, 1.0, 0.0,
        -w/2, -h/2, d/2, 1.0, 1.0, 0.0, 0.0,
        0.0, h/2, -d/2, 1.0, 1.0, 1.0, 0.0,

        0.0, h/2, -d/2, 1.0, 1.0, 1.0, 0.0,
        -w/2, -h/2, d/2, 1.0, 1.0, 0.0, 0.0,
        -w/2, -h/2, -d/2, 1.0, 1.0, 0.0, 0.0, 

        // Bottom face
        w/2, -h/2, d/2, 1.0, 1.0, 0.0, 0.0,
        -w/2, -h/2, d/2, 1.0, 1.0, 1.0, 1.0,
        w/2, -h/2, -d/2, 1.0, 1.0, 0.0, 0.0,

        w/2, -h/2, -d/2, 1.0, 1.0, 0.0, 0.0,
        -w/2, -h/2, -d/2, 1.0, 1.0, 1.0, 1.0,
        -w/2, -h/2, d/2, 1.0, 1.0, 1.0, 1.0,
    ]
}

function genTrapezoidPrism(tw,bw,h,d) {
    return [
        // Front face
        bw/2, -h/2, d/2, 1.0, 1.0, 0.0, 0.0,
        -tw/2, h/2, d/2, 1.0, 1.0, 1.0, 0.0,
        -bw/2, -h/2, d/2, 1.0, 1.0, 1.0, 1.0,

        bw/2, -h/2, d/2, 1.0, 1.0, 0.0, 0.0,
        -tw/2, h/2, d/2, 1.0, 1.0, 1.0, 0.0,
        tw/2, h/2, d/2, 1.0, 1.0, 1.0, 1.0,

        // Back face
        bw/2, -h/2, -d/2, 1.0, 1.0, 0.0, 0.0,
        -tw/2, h/2, -d/2, 1.0, 1.0, 1.0, 0.0,
        -bw/2, -h/2, -d/2, 1.0, 1.0, 1.0, 1.0,

        bw/2, -h/2, -d/2, 1.0, 1.0, 0.0, 0.0,
        -tw/2, h/2, -d/2, 1.0, 1.0, 1.0, 0.0,
        tw/2, h/2, -d/2, 1.0, 1.0, 1.0, 1.0,

        // Top face
        -tw/2, h/2, -d/2, 1.0, 1.0, 1.0, 0.0,
        -tw/2, h/2, d/2, 1.0, 1.0, 0.0, 1.0,
        tw/2, h/2, d/2, 1.0, 1.0, 1.0, 0.0,
        
        -tw/2, h/2, -d/2, 1.0, 0.0, 1.0, 1.0,
        tw/2, h/2, -d/2, 1.0, 1.0, 1.0, 0.5,
        tw/2, h/2, d/2, 1.0, 1.0, 0.0, 1.0,

        // Right face
        tw/2, h/2, -d/2, 1.0, 1.0, 0.0, 0.0,
        tw/2, h/2, d/2, 1.0, 1.0, 1.0, 0.0,
        bw/2, -h/2, d/2, 1.0, 1.0, 0.0, 1.0,

        tw/2, h/2, -d/2, 1.0, 1.0, 0.0, 0.0,
        bw/2, -h/2, -d/2, 1.0, 1.0, 1.0, 0.0,
        bw/2, -h/2, d/2, 1.0, 1.0, 0.0, 1.0,

        // Left face
        -tw/2, h/2, -d/2, 1.0, 1.0, 0.0, 0.0,
        -tw/2, h/2, d/2, 1.0, 1.0, 1.0, 0.0,
        -bw/2, -h/2, d/2, 1.0, 1.0, 0.0, 1.0,

        -tw/2, h/2, -d/2, 1.0, 1.0, 0.0, 0.0,
        -bw/2, -h/2, -d/2, 1.0, 1.0, 1.0, 0.0,
        -bw/2, -h/2, d/2, 1.0, 1.0, 0.0, 1.0,

        // Bottom face
        -bw/2, -h/2, -d/2, 1.0, 1.0, 1.0, 0.0,
        -bw/2, -h/2, d/2, 1.0, 1.0, 0.0, 1.0,
        bw/2, -h/2, d/2, 1.0, 1.0, 1.0, 0.0,
        
        -bw/2, -h/2, -d/2, 1.0, 0.0, 1.0, 1.0,
        bw/2, -h/2, -d/2, 1.0, 1.0, 1.0, 0.5,
        bw/2, -h/2, d/2, 1.0, 1.0, 0.0, 1.0,
    ]
}

function loadOBJ(filename) {
    return fetch(filename).then(
        response => response.text())
        .then(data => {
            var vertices = [];
            var triangles = [];


            var lines = data.split('\n');
            for (let i=0; i<lines.length; i++) {
                let line = lines[i].split(' ');
                if (line[0] === 'v') { // If we have a vertex, parse it and add to list
                    vertices.push([parseFloat(line[1]), parseFloat(line[2]), parseFloat(line[3])])
                }

                if (line[0] === 'f') { // If we have a face, parse the correct vertices
                    let parsedVerts = [];
                    for (let i=1; i< line.length; i++) { // First, we remove textures and normals... for now
                        parsedVerts.push(line[i].split('/')[0])
                    }
                    // triangle-ification method adapted from https://stackoverflow.com/questions/23723993/converting-quadriladerals-in-an-obj-file-into-triangles
                    for (let i=1; i<parsedVerts.length-1; i++) { // Next, we break the list of vertices into triangles
                        triangles.push(vertices[parsedVerts[0]-1]); 
                        triangles.push([1.0, 1.0, 0.0, 0.0]); // Add 'w' value of position and color value
                        triangles.push(vertices[parsedVerts[i]-1]);
                        triangles.push([1.0, 0.0, 1.0, 0.0]);
                        triangles.push(vertices[parsedVerts[i+1]-1]);
                        triangles.push([1.0, 0.0, 0.0, 1.0]);
                    }
                }
            }
            return triangles.flat();
        })
}

function printVertProperties(vertices) {
    // [minX, minY, minZ, maxX, maxY, maxZ]
    var mins = [0, 0, 0];
    var maxs = [0, 0, 0];
    for (var i=0; i<3; i++) { // Iterate through the three axes
        for (var j=i; j<vertices.length; j+=4) { // Iterate through each vertex in the given axis
            if (vertices[j] < mins[i]) {
                mins[i] = vertices[j];
            }
            if (vertices[j] > maxs[i]) {
                maxs[i] = vertices[j];
            }
        }
    }
    console.log(`
    MIN/MAX VALS
    X ${mins[0]} ${maxs[0]}
    Y ${mins[1]} ${maxs[1]}
    Z ${mins[2]} ${maxs[2]}`)

}

var lorem = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Mauris et dictum nunc. Curabitur vitae diam at metus vestibulum suscipit. Nam at magna elementum, placerat massa sit amet, scelerisque enim. Pellentesque ut sollicitudin tortor. Sed feugiat risus eros, ac tempor dui tempor scelerisque. Nulla eget gravida justo, sed volutpat purus. Duis neque libero, convallis ultrices iaculis at, auctor at nisl. Sed nunc magna, vestibulum quis augue id, maximus molestie lectus. Nulla rhoncus, mi vel tincidunt lobortis, ipsum leo ultricies lorem, tincidunt feugiat nibh leo a turpis. Donec aliquam nunc eu lacinia vehicula. Praesent mattis metus quis dolor aliquam pellentesque.'