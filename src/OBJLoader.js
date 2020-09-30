
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

                if (line[0] === 'f') {


                    for (let i=2; i<line.length-2; i++) {
                        
                    }
                }
            }
        })
}