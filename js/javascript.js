/* Proyecto realizado por: José A. Rodríguez López-->
 * Fecha: 18/10/2022
 */
let idiomaSeleccionado="es-ES"
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
//var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList
//var SpeechRecognitionEvent = SpeechRecognitionEvent || webkitSpeechRecognitionEvent

//let speechRecognitionList = new SpeechGrammarList();

//let palabrasTexto=[]
//grammar = '#JSGF V1.0; grammar palabrasTexto; public <palabrasTexto> = ' + palabrasTexto.join(' | //') + ' ;'
 
let reconocimiento = new SpeechRecognition()

reconocimiento.lang = idiomaSeleccionado;
reconocimiento.continuous = true;
reconocimiento.interimResults = false;

reconocimiento.start();

//Se produce evento de capturar sonido.
reconocimiento.onresult = (event) => {
    const resultados = event.results;
    const frase = resultados[resultados.length - 1][0].transcript;
    cajaTexto.innerText=cajaTexto.innerText+frase;
}




document.getElementById("reiniciar").addEventListener("click",()=>{
    //Solicita al navegador permiso de acceder al dispositivo microfono
    reconocimiento.start();
    cajaTexto.innerText="";
},false);

document.getElementById("reproducir").addEventListener("click",leerTexto,false);

document.getElementById("parar").addEventListener("click",()=>{
    reconocimiento.abort();
},false);

function leerTexto() {
    let texto=cajaTexto.innerText;
    var synth=window.speechSynthesis;
    synth.lang = idiomaSeleccionado //"en-US"//"es-ES"//
    var utterance = new SpeechSynthesisUtterance(texto)
    synth.speak(utterance)
    
}