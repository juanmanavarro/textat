export default (sentence) => {
  return `Vamos a parsear frases. La respuesta debe de ser un JSON valido con las siguientes propiedades:
    temp: la parte de la frase que se refiere al tiempo, es decir, la indicacion temporal de la frase. Traducela a ingles
    rest: la parte restante de la frase. Lo que queda al extraer la indicacion temporal de la frase original
    frase: "tengo dentista mañana a las 10"
    respuesta: { "temp": "tomorrow at 10 a.m.", "rest": "tengo dentista" }
    frase: "ayer cene con mi amigo por la noche"
    respuesta: { "temp": "last night", "rest": "cene con mi amigo" }
    frase: "1 en un minuto"
    respuesta: { "temp": "in a minute", "rest": "1" }
    frase: "${sentence}"
    respuesta:`;
}
