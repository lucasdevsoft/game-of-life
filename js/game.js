let canvas;
let ctx;
let fps = 30;

let canvasX = 800;
let canvasY = 800;

let tileX, tileY;


//Variable del tablero
let tablero;
let filas = 200;
let columnas = 200;

let verde = "#9032bb";
let gris = "#272727";



function creaArray2D(f, c) {
    let obj = new Array(f);
    for (y = 0; y < f; y++) {
        obj[y] = new Array(c);
    }

    return obj;
}


//Objeto Hormiga || Turmita
let Agente = function(x, y, estado) {
    
    this.x = x;
    this.y = y;
    this.estado = estado;            //vivo=1, muerto=2
    this.estadoProx = this.estado;   //estado del sig ciclo

    this.vecinos = []; //guardamos el listado de vecinos

    this.addVecinos = function() {
        
        let xVecino;
        let yVecino;

        for (i = -1; i < 2; i++) {
            for (j = -1; j < 2; j++) {
                
                xVecino = (this.x + j + columnas) % columnas;
                yVecino = (this.y + i + filas) % filas;


                //descartamos al agente actual
                if (i != 0 || j != 0) {
                    this.vecinos.push(tablero[yVecino][xVecino]);
                }
            }
        }
    }



    this.dibuja = function() {
        let color;
        
        if (this.estado == 1) {
            color = verde
        }
        else {
            color = gris;
        }

        ctx.fillStyle = color;
        ctx.fillRect(this.x * tileX, this.y * tileY, tileX, tileY);
    }


    //programo las leyes de Conway
    this.nuevoCiclo = function() {
        let suma = 0;

        //calculo para los vecinos vivos
        for (i = 0; i < this.vecinos.length; i++) {
            suma += this.vecinos[i].estado;
        }

        //Aplicar las normas
        this.estadoProx = this.estado; //por defecto

        //Dead: tiene menos de 2 o mas de 3
        if (suma < 2 || suma > 3) {
            this.estadoProx = 0
        }

        //vida/reproduccion: tiene 3 vecinos
        if (suma == 3) {
            this.estadoProx = 1;
        }
    }

    this.mutacion = function () {
        this.estado = this.estadoProx;
    }

}


function inicializaTablero(obj) {
    
    let estado;

    for (y = 0; y < filas; y++) {
        for (x = 0; x < columnas; x++) {
            
            estado = Math.floor(Math.random() * 2);
            obj[y][x] = new Agente(x, y, estado);
        }
    }

    for (y = 0; y < filas; y++) {
        for (x = 0; x < columnas; x++) {
            obj[y][x].addVecinos();
        }
    }
}



function inicializa() {
    
    //Asociacion del Canvas
    canvas = document.getElementById('pantalla');
    ctx = canvas.getContext('2d');
    //Definicion del tamaño
    canvas.width = canvasX;
    canvas.height = canvasY;

    //calculo del tamaño de canvas
    tileX = Math.floor(canvasX / filas);
    tileY = Math.floor(canvasY / columnas);


    //tablero creacion
    tablero = creaArray2D(filas, columnas);


    //inicializamos
    inicializaTablero(tablero);


    //Ejecutamos el bucle principal
    setInterval(principal, 1000/fps);

}


function dibujaTablero(obj) {


    //Dibuja los agentes
    for (y = 0; y < filas; y++) {
        for (x = 0; x < columnas; x++) {
            obj[y][x].dibuja();
        }
    }

    //calcula el sig ciclo
    for (y = 0; y < filas; y++) {
        for (x = 0; x < columnas; x++) {
            obj[y][x].nuevoCiclo();
        }
    }


    //aplica la mutacion
    for (y = 0; y < filas; y++) {
        for (x = 0; x < columnas; x++) {
            obj[y][x].mutacion();
        }
    }

}


function borraCanvas() {
    canvas.width = canvas.width;
    canvas.height = canvas.height;
}

function principal() {
    borraCanvas();
    dibujaTablero(tablero);
}

let n = 0;
let l = document.getElementById("number");
window.setInterval(function(){
  l.innerHTML = n;
  n++;
},1000);
