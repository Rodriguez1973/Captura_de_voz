/* Proyecto realizado por: José A. Rodríguez López-->
 * Fecha: 18/10/2022
 */

//Declaraciones.
const comandos = ['grabar', 'reproducir', 'parar', 'cerrar'] //Comandos de ejecución.

//Interfaz del reconocimiento de voz.
var SpeechRecognition = SpeechRecognition || webkitSpeechRecognition
//Interfaz que representa una lista de objetos SpeechGrammar que contienen palabras o patrones de palabras que queremos que el servicio de reconocimiento reconozca.
var SpeechGrammarList = SpeechGrammarList || webkitSpeechGrammarList

//--------------------------------------------------------------------------------------------------
//Objetos del documento.
const enlaceCerrar = document.getElementById('cerrar_navegador')
const btnGrabar = document.getElementById('grabar')
const btnParar = document.getElementById('parar')
const btnReproducir = document.getElementById('reproducir')
const contTexto = document.getElementById('contenedorTexto')

//--------------------------------------------------------------------------------------------------
//Flags de control de estados.
let grabando = false
let reproduciendo = false
let lanzar = false

//--------------------------------------------------------------------------------------------------
/*Captura de eventos*/
/*Captura el evento onclick en la etiqueta <p id="cerrar_navegador">. Cierra el navegador.*/
enlaceCerrar.onclick = function () {
  cerrarNavegador()
}

/*Captura el evento click en el <input id="grabar">. Inicia la grabación.*/
btnGrabar.addEventListener('click', grabar, false)

/*Evento click sobre el <input id="reproducir">. Reproduce el texto.*/
btnReproducir.addEventListener('click', reproducir, false)

/*Evento click sobre el <input id="parar">. Para la grabación o reproducción*/
btnParar.addEventListener('click', pararGrabacion, false)

//--------------------------------------------------------------------------------------------------
//Inicialización.
//Idioma seleccionado.
const idiomaSeleccionado = 'es-ES'
//Establecer color botones.
estableceColorBotones()

/*Gramática*/
//Definición de la gramática de navegación.//
var gramatica =
  '#JSGF V1.0; grammar actions; public <action> = grabar | reproducir | parar | cerrar'
//Crea una nueva lista de objetos SpeechGrammar que contienen palabras o patrones de palabras que queremos que el servicio de reconocimiento reconozca.
var speechRecognitionList = new SpeechGrammarList()
//Toma una gramática presente en una cadena de texto y la agrega al nuevo objeto SpeechGrammar.El 1 especifica la impñortancia de esta gramática (valores entre 0.0. y 1.0).
speechRecognitionList.addFromString(gramatica, 1)

/*Sintesis de voz*/
//Representa una solicitud de voz. Contiene el contenido que debe leer el servicio de voz e información sobre cómo leerlo (por ejemplo, idioma, tono y volumen).
const discurso = new SpeechSynthesisUtterance()
discurso.lang = idiomaSeleccionado //Establece el idioma de reproducción.
discurso.volume = 1 //Establece el volumen al máximo.
discurso.rate = 1 //Velocidad de habla.
discurso.pitch = 1 //Tono de reproducción.

/*Reconocimiento de voz*/
//Crea el objeto del reconocimiento de voz.
let reconocimiento = new SpeechRecognition()
//Selecciona idioma del reconocimiento de voz.
reconocimiento.lang = idiomaSeleccionado
//Establece que el reconocimiento se lealice continuamente mientras no se pare el proceso.
reconocimiento.continuous = true
//Establece que no se muestren los resultados provisionales sobre el texto reconocido.
reconocimiento.interimResults = false
//La propiedad maxAlternatives establece el número máximo de SpeechRecognitionAlternatives proporcionados por SpeechRecognitionResult.
reconocimiento.maxAlternatives = 1

/*Inicia en el navegador el acceso al microfono.*/
let inicio=true;
discurso.text="Aplicación iniciada."
discurso.text = contTexto.innerText.trim() //Establece el texto a reproducir
window.speechSynthesis.speak(discurso) 
window.speechSynthesis.speak(discurso);
window.speechSynthesis.cancel()
window.speechSynthesis.speak(discurso);
reconocimiento.start()

/* Captura de sonido.*/
reconocimiento.onresult = (evento) => {
  if (!window.speechSynthesis.pending && !window.speechSynthesis.speaking) {
    const resultados = evento.results //Resultados del evento.
    const frase = resultados[resultados.length - 1][0].transcript.trim()
    console.log(frase) //Muestra en la consola la palabra leída.
    if (verificarComando(frase)) {
      switch (frase) {
        case 'grabar':
          grabar()
          break
        case 'reproducir':
          reproducir()
          break
        case 'parar':
          pararGrabacion()
          break
        case 'cerrar':
          cerrarNavegador()
          break
      }
    } else {
      if (grabando) {
        contTexto.innerText = contTexto.innerText + ' ' + frase
      }
    }
  }
}

//Evento lanzado al finalizar el reconocimiento. Reinicia el reconocimiento.
reconocimiento.onend = () => {
  if (!reproduciendo && !grabando){
      reconocimiento.start()
  }
}

//Evento final del objeto SpeechSynthesisUtterance se activa cuando la expresión ha terminado de pronunciarse.
discurso.onend = ()=>{
  reproduciendo=false;
  reconocimiento.start();
  estableceColorBotones();
}

//--------------------------------------------------------------------------------------------------
/*Funciones*/
/*Función que comienza la grabación.*/
function grabar() {
  if (
    !grabando && 
    !window.speechSynthesis.speaking &&
    !window.speechSynthesis.pending
  ) {
    grabando = true
    estableceColorBotones()
    contenedorTexto.innerText = ''
  }
}

/*Función que realiza la lectura del texto y lo reproduce. Si recibe un mensaje reproduce el mensaje*/
function reproducir() {
  if (!reproduciendo && !grabando) {
    reproduciendo=true;
    reconocimiento.abort()
    estableceColorBotones()
    discurso.text = contTexto.innerText.trim() //Establece el texto a reproducir
    window.speechSynthesis.speak(discurso) //Agrega el discurso a la cola de reproducción.
  }
}

//Función que para el reconocimiento y reproducción de voz
function pararGrabacion() {
  if (grabando){
    grabando = false
    reconocimiento.abort()
    estableceColorBotones()
  }
}

//Función que cierra el navegador.
function cerrarNavegador() {
  window.close()
}

//Función que verifica si es un comando a ejecutar.
function verificarComando(comando) {
  return comandos.includes(comando)
}

/*Función que establece el background de los botones*/
function estableceColorBotones(){
  //Parar.
  if(!grabando && !reproduciendo){
    btnParar.style.backgroundColor='#be2553'
    btnGrabar.style.backgroundColor='rgb(179, 177, 177)';
    btnReproducir.style.backgroundColor='rgb(179, 177, 177)';
  //Grabar.
  }else if(grabando){
    btnGrabar.style.backgroundColor='#be2553'
    btnParar.style.backgroundColor='rgb(179, 177, 177)';
    btnReproducir.style.backgroundColor='rgb(179, 177, 177)';
  //Reproducir.
  }else if(reproduciendo){
    btnReproducir.style.backgroundColor='#be2553'
    btnParar.style.backgroundColor='rgb(179, 177, 177)';
    btnGrabar.style.backgroundColor='rgb(179, 177, 177)';
  }
}
