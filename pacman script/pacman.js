var gl;


window.onload = function init()
{
	// Get canvas and setup WebGL
	
	var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices
	
	var vertices = new Float32Array([]);	
    var colors = new Float32Array([]);
    drawPacman(3, 8, 45);
	// Configure viewport

	console.log(colors)
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(1.0,1.0,1.0,1.0);
	

	// Init shader program and bind it

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
	
	// Load positions into the GPU and associate shader variables

	var posVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posVBO);
	gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Load colors into the GPU and associate shader variables
	
	var colorVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
	gl.bufferData(gl.ARRAY_BUFFER, colors, gl.STATIC_DRAW);
	
	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLES, 0, 10); //TODO in der funktion
};


function drawPacman(radius, numberOfVertices, angleMouth)
{		
	var triangleLength = radius/10;
	alert("hallo1")
	//mittleren Punkt definieren.
	vertices = [0, 0];
	//farben vom center
	color = [1,1,0,1];
	alert("hallo2")
	alert(color)
	for(var i = 1; i<=numberOfVertices; i++ )
	{
		
		alert("forBegin");
        vertices[2*i] = sin(
        (3.145/numberOfVertices)*i
        )*triangleLength
        ;
  
        alert("bla")
        alert(vertices);
        vertices.push(cos(
       (3.145/numberOfVertices)*i
       )*triangleLength
       );
       color.push(1);
       color.push(1);
       color.push(0);
       color.push(1);
	}					
       alert("hallo3")	
}








































