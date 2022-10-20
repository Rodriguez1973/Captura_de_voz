/* Proyecto realizado por: José A. Rodríguez López-->
 * Fecha: 18/10/2022
 */

/*Captura el evento onclick en la etiqueta <p id="cerrar_navegador">. Cierra el navegador.*/
cerrar_navegador.onclick = function () {
    window.close()
}

/*Captura el evento click en el <input id="grabar">. Inicia la grabación.*/
document.getElementById("grabar").addEventListener("click",grabar,false);

/*Función que comienza la grabación.*/
function grabar(){
    contenedorTexto.innerText="";
    reconocimiento.start();
};

/*Evento click sobre el <input id="reproducir">. Reproduce el texto.*/
document.getElementById("reproducir").addEventListener("click",leerTexto,false);

/*Evento click sobre el <input id="parar">. Para la grabación o reproducción*/
document.getElementById("parar").addEventListener("click",parar,false);

//Función que para el reconocimiento y reproducción de voz
function parar(){
    reconocimiento.abort();
    reconocimiento.start();
};

//Idioma seleccionado.
const idiomaSeleccionado="es-ES"

//Reconocimiento de voz.
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition

//Crea el objeto del reconocimiento de voz. 
let reconocimiento = new SpeechRecognition()

//Selecciona idioma del reconocimiento de voz.
reconocimiento.lang = idiomaSeleccionado;

//Establece que el reconocimiento se lealice continuamente mientras no se pare el proceso.
reconocimiento.continuous = true;

//Establece que no se muestren los resultados provisionales sobre el texto reconocido. 
reconocimiento.interimResults = false;

/*Inicia en el navegador el acceso al microfono.*/
reconocimiento.start();

/* Captura de sonido.*/
reconocimiento.onresult = (event) => {
    const resultados = event.results;
    /*if("parar"===event.results[0][0].transcript.tolowercase()){
        parar;
    }else{*/
        const frase = resultados[resultados.length - 1][0].transcript;
        contenedorTexto.innerText=contenedorTexto.innerText+frase;
    /*}*/
}

/*Función que realiza la lectura del texto y lo reproduce*/
function leerTexto() {
    reconocimiento.abort();
    let texto=contenedorTexto.innerText;
    var synth=window.speechSynthesis;
    synth.lang = idiomaSeleccionado
    var utterance = new SpeechSynthesisUtterance(texto)
    synth.speak(utterance)
}