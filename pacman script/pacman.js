var gl;

window.onload = function init()
{
	// Get canvas and setup WebGL

	var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	// Specify position and color of the vertices
	var gf32aVertices;
	var gf32aColors;
	var gobaHelpMe;
	var gintNumberOfVertices = 80;
	//Variablen für Position und Orientierung(Aufgabe 2) in Rad.
	var gLocX = 0.0;
	var gLocY = 0.0;
	var gAlign = 0.0;

	gobaHelpMe = drawPacman(3, gintNumberOfVertices, 45);
	gf32aVertices = gobaHelpMe[0];
	gf32aColors = gobaHelpMe[1];


	// Configure viewport

	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.0,0.0,0.0,0.0);

	// Init shader program and bind it

	var program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);
	setTransformMatrix(gAlign, gLocX, gLocY, program);

	// Load positions into the GPU and associate shader variables

	var posVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, posVBO);
	gl.bufferData(gl.ARRAY_BUFFER, gf32aVertices, gl.STATIC_DRAW);

	var vPosition = gl.getAttribLocation(program, "vPosition");
	gl.vertexAttribPointer(vPosition, 2, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vPosition);

	// Load colors into the GPU and associate shader variables

	var colorVBO = gl.createBuffer();
	gl.bindBuffer(gl.ARRAY_BUFFER, colorVBO);
	gl.bufferData(gl.ARRAY_BUFFER, gf32aColors, gl.STATIC_DRAW);

	var vColor = gl.getAttribLocation(program, "vColor");
	gl.vertexAttribPointer(vColor, 4, gl.FLOAT, false, 0, 0);
	gl.enableVertexAttribArray(vColor);

requestAnimFrame(render(gobaHelpMe[2]));
//render(gobaHelpMe[2]);
//auf Index 2 von HelpMe steht NumberofVertices+2 -aussparung

};

function render(pintNumberOfVertices)
{
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, pintNumberOfVertices+1);
}

//berechnet die für das Polygon benötigten Vertices
function drawPacman(radius, pintNumberOfVertices, pintMouthAngle)
{

	gf32aVertices = new Float32Array((pintNumberOfVertices+2)*2);
	gf32aColors = new Float32Array((pintNumberOfVertices+4)*4);

	var triangleLength = radius/10;

	//mittleren Punkt definieren.
	gf32aVertices[0] = 0;
	gf32aVertices[1] = 0;
	//farben vom center
	gf32aColors[0] = 1;
	gf32aColors[1] = 1;
	gf32aColors[2] = 0;
	gf32aColors[3] = 1;

	//berechne den i shift
	var lintShiftI = Math.PI/2 + Math.PI*(pintMouthAngle/(360));
	var lintEnd = Math.round(pintNumberOfVertices - (pintMouthAngle/360) * pintNumberOfVertices)+1;


	for(var i = 0; i<=lintEnd; i++ )
	{

		gf32aVertices[2*i+2] = (Math.sin((2*Math.PI/pintNumberOfVertices)*i+lintShiftI)*triangleLength);
		gf32aVertices[2*i+3] = (Math.cos((2*Math.PI/pintNumberOfVertices)*i+lintShiftI)*triangleLength);

		gf32aColors[4*i] = 1;
		gf32aColors[4*i+1] = 1;
		gf32aColors[4*i+2] = 0;
		gf32aColors[4*i+3] = 1;

	}

	lobaHelpMe = [gf32aVertices, gf32aColors, lintEnd];
	return lobaHelpMe;

//berechnet wieviele Dreiecke beim erstellen des Kreises ausgelassen werden müssen um den Mund dar zu stellen.
//Der Mund soll bei Pi/2 dargestellt werden
//zentrum des Mundes bei Pi/2, darüber und darunter MouthAngle/2 winkel auslassen

}

function setTransformMatrix(pAlign, pLocX, pLocY, pProgram)
{
	var transformMatrix = [Math.cos(pAlign), -(Math.sin(pAlign)), 0.0, pLocX,
				                Math.sin(pAlign), Math.cos(pAlign)    , 0.0, pLocY,
								0.0                  , 0.0                        , 1.0,     0.0,
								0.0                  , 0.0                        , 0.0,    1.0];


	var matrixLoc =  gl.getUniformLocation(pProgram, "transformMatrix");
	gl.uniformMatrix4fv(matrixLoc, false, transformMatrix );
	//Übergibt die Transformationsmatrix an den Vertex-Shader.
}
