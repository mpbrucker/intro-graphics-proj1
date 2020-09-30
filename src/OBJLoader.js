
function loadOBJ(filename) {
    fetch(filename).then(
        response => response.text())
        .then(data => {
            console.log(data);
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
                        triangles.push(1.0);
                        triangles.push(vertices[parsedVerts[i]-1]);
                        triangles.push(1.0);
                        triangles.push(vertices[parsedVerts[i+1]-1]);
                        triangles.push(1.0);
                    }
                    console.log(triangles.flat())
                }
            }
        })
}