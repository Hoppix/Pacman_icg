var gl;
//Variablen für Position und Orientierung.
var gLocX = 0.0;
var gLocY = 0.0;
var gAlign = degreeToRadian(0.0);
var gMoveSpeed = 0.1;
var gRotationSpeed = 1;
//Anzahl der Polygone definieren
var gintNumberOfVertices = 80;
// Specify position and color of the vertices
var gf32aVertices;
var gf32aColors;
//hilfsarray
var gobaHelpMe;
//renderprogramm
var program;

window.onload = function init()
{
	// Get canvas and setup WebGL
	var canvas = document.getElementById("gl-canvas");
	gl = WebGLUtils.setupWebGL(canvas);
	if (!gl) { alert("WebGL isn't available"); }

	//Event für Pfeiltasteninput
	window.addEventListener("keypress", eventHandling);

	//Zeichnen des Pacman auf dem ersten frame.
	gobaHelpMe = drawPacman(0.75, gintNumberOfVertices, 45);
	gf32aVertices = gobaHelpMe[0];
	gf32aColors = gobaHelpMe[1];

	// Configure viewport
	gl.viewport(0,0,canvas.width,canvas.height);
	gl.clearColor(0.0,0.0,0.0,1.0);

	// Init shader program and bind it
	program = initShaders(gl, "vertex-shader", "fragment-shader");
	gl.useProgram(program);

	//konfigurieren der Vertex-Buffer-Objects
	setVBO();
	setTransformMatrix();

	//rendern des ersten frames und initialisierung des Frame-buffers.
	render();
  requestAnimFrame(frameRender);
};

function frameRender()
{
	setTransformMatrix();
	render();
	requestAnimFrame(frameRender);
}

function render()
{
	//render via TRIANGLE_FAN von Zentrum aus.
	//gobaHelpMe[2]+1 = Vertices für die  Mundausparung
	gl.clear(gl.COLOR_BUFFER_BIT);
	gl.drawArrays(gl.TRIANGLE_FAN, 0, gobaHelpMe[2]+1);
}


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


	//berechnet wieviele Dreiecke beim erstellen des Kreises ausgelassen werden müssen um den Mund darzustellen.
	//Der Mund soll bei Pi/2 dargestellt werden
	//zentrum des Mundes bei Pi/2, darüber und darunter MouthAngle/2 winkel auslassen
	for(var i = 0; i<=lintEnd; i++ )
	{
		gf32aVertices[2*i+2] = (Math.sin((2*Math.PI/pintNumberOfVertices)*i+lintShiftI)*triangleLength);
		gf32aVertices[2*i+3] = (Math.cos((2*Math.PI/pintNumberOfVertices)*i+lintShiftI)*triangleLength);

		gf32aColors[4*i] = 1;
		gf32aColors[4*i+1] = 1;
		gf32aColors[4*i+2] = 0;
		gf32aColors[4*i+3] = 1;
	}

	//Return des localen hilfsarrays
	lobaHelpMe = [gf32aVertices, gf32aColors, lintEnd];
	return lobaHelpMe;
	}

function setTransformMatrix()
{
	//Aufsetzen der Transformationsmatrix für Rotation und Translation.
	var transformMatrix = [Math.cos(gAlign), -(Math.sin(gAlign)), 0.0, gLocX,
				                Math.sin(gAlign), Math.cos(gAlign)    , 0.0, gLocY,
								0.0                  , 0.0                        , 1.0,     0.0,
								0.0                  , 0.0                        , 0.0,    1.0];


	var matrixLoc =  gl.getUniformLocation(program, "transformMatrix");
	gl.uniformMatrix4fv(matrixLoc, false, transformMatrix );
	//Übergibt die Transformationsmatrix an den Vertex-Shader.
}

function degreeToRadian(x)
{
	//Einfache Hilfsfunktion zum Konvertieren von Grad zu Bogenmaß.
	return x * (Math.PI / 180);
}

function setVBO()
{
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
}

function eventHandling(e)
{
	//Auslesen des keycodes zum spezifizieren welche Taste gedrückt wurde.
	//38: ArrowUp, 37: ArrowLeft, 39: ArrowRight
	switch(e.keyCode)
	{
		case 38:
					moveFoward();
					break;
		case 37:
					turnLeft();
					break;
		case 39:
					turnRight();
					break;
		default:
					//alert(gAlign);
					break;
	}
}

function turnLeft()
{
	gAlign = gAlign + degreeToRadian(rotationSpeed);
}

function turnRight()
{
	gAlign = gAlign - degreeToRadian(rotationSpeed);
}

function moveFoward()
{
	var isInLineX = (gLocX + moveSpeed * Math.cos(gAlign) < 1) && (gLocX + moveSpeed * Math.cos(gAlign) > -1);
	var isInLineY = (gLocY + moveSpeed * Math.sin(gAlign) < 1) && (gLocY + moveSpeed * Math.sin(gAlign) > -1);
	//Pacman darf den canvas nicht verlassen.
	if(isInLineX)
	{
			gLocX = gLocX + moveSpeed * Math.cos(gAlign);
	}

	if (isInLineY)
	{
			gLocY = gLocY + moveSpeed * Math.sin(gAlign);
	}
}
