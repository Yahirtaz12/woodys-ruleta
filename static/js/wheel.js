const canvas = document.getElementById("wheelCanvas");
const ctx = canvas.getContext("2d");

let codigoActual = "";
let angle = 0;

const prizes = [
    "+2 Boneless",
    "+4 Boneless",
    "Papas Gratis",
    "10% OFF",
    "Aderezo",
    "Giro Extra"
];
const probabilidades = [
    { premio: "+2 Boneless", peso: 40 },
    { premio: "+4 Boneless", peso: 10 },
    { premio: "Papas Gratis", peso: 3 },
    { premio: "10% OFF", peso: 25 },
    { premio: "Aderezo", peso: 17 },
    { premio: "Giro Extra", peso: 5 }
];

const colors = [
    "#E53935",
    "#FFB300",
    "#43A047",
    "#1E88E5",
    "#8E24AA",
    "#FB8C00"
];
function elegirPremio(){

    let total = 0;

    probabilidades.forEach(item => {
        total += item.peso;
    });

    let random = Math.random() * total;
    let acumulado = 0;

    for(let item of probabilidades){

        acumulado += item.peso;

        if(random <= acumulado){
            return item.premio;
        }
    }
}
function drawWheel(){

    ctx.clearRect(
        0,
        0,
        canvas.width,
        canvas.height
    );

    const arc =
        (2 * Math.PI) /
        prizes.length;

    for(let i=0;i<prizes.length;i++){

        ctx.beginPath();

        ctx.fillStyle =
            colors[i];

        ctx.moveTo(
            250,
            250
        );

        ctx.arc(
            250,
            250,
            250,
            i * arc,
            (i + 1) * arc
        );

        ctx.fill();

        ctx.save();

        ctx.translate(
            250,
            250
        );

        ctx.rotate(
            i * arc +
            arc / 2
        );

        ctx.fillStyle =
            "white";

        ctx.font =
            "bold 20px Arial";

        ctx.textAlign =
            "center";

        ctx.fillText(
            prizes[i],
            150,
            10
        );

        ctx.restore();
    }

    ctx.beginPath();

    ctx.fillStyle =
        "#111";

    ctx.arc(
        250,
        250,
        40,
        0,
        2 * Math.PI
    );

    ctx.fill();
}

drawWheel();

function spinWheel(){

    let premioElegido = elegirPremio();

    console.log("Premio elegido:", premioElegido);

    let indice = prizes.indexOf(premioElegido);

    let sector = 360 / prizes.length;

    let vueltas = 360 * 8;

    let posicionActual = angle % 360;

    let destino =
        (360 - (indice * sector + sector / 2)) + 270;

    let diferencia =
        (destino - posicionActual + 360) % 360;

    angle += vueltas + diferencia;

    canvas.style.transition =
        "transform 4s cubic-bezier(0.17, 0.67, 0.12, 0.99)";

    canvas.style.transform =
        `rotate(${angle}deg)`;

    setTimeout(() => {
        asignarPremio(premioElegido);
    }, 4000);
}
function validarCodigo(){

    let codigo =
        document.getElementById("codigo").value;

    codigoActual = codigo;

    let nombre =
        document.getElementById("nombre").value;

    if(codigo === "" || nombre === ""){

        alert(
            "Completa todos los campos"
        );

        return;
    }

    fetch("/validar",{

        method:"POST",

        headers:{
            "Content-Type":
            "application/x-www-form-urlencoded"
        },

        body:
        "codigo="+codigo

    })

    .then(res => res.json())

    .then(data => {

        if(data.valido){

            spinWheel();

        }else{

            alert(
                data.mensaje
            );

        }

    });

}



  function asignarPremio(premio){

    fetch("/guardar_premio",{

        method:"POST",

        headers:{
            "Content-Type":
            "application/x-www-form-urlencoded"
        },

        body:
        "codigo="+codigoActual+
        "&premio="+encodeURIComponent(premio)

    })

    .then(res => res.json())

    .then(data => {

        if(data.ok){
            mostrarPremio(premio);
        }

    });
}


function mostrarPremio(premio){

    if(premio === "Giro Extra"){

        alert(
            "🎰 ¡FELICIDADES!\n\n" +
            "Ganaste un GIRO EXTRA.\n\n" +
            "Puedes volver a girar."
        );

        return;
    }

    alert(
        "🎉 FELICIDADES 🎉\n\n" +
        "Ganaste:\n\n" +
        premio
    );

}

document
.getElementById("btnGirar")
.addEventListener(
    "click",
    validarCodigo
);

const wheelContainer =
document.querySelector(
    ".wheel-container"
);

setInterval(() => {

    wheelContainer.style.filter =
        "drop-shadow(0 0 20px red)";

    setTimeout(() => {

        wheelContainer.style.filter =
            "drop-shadow(0 0 40px orange)";

    },500);

},1000);