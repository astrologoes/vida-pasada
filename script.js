const vocales = ['A', 'E', 'I', 'O', 'U'];
const numerologia = {
  A: 1, B: 2, C: 3, D: 4, E: 5,
  F: 6, G: 7, H: 8, I: 9, J: 1,
  K: 2, L: 3, M: 4, N: 5, O: 6,
  P: 7, Q: 8, R: 9, S: 1, T: 2,
  U: 3, V: 4, W: 5, X: 6, Y: 7, Z: 8
};

function reducirADigito(numero) {
  while (numero > 9 && numero !== 11 && numero !== 22 && numero !== 33) {
    numero = numero.toString().split('').reduce((a, b) => a + parseInt(b), 0);
  }
  return numero;
}

function calcularNumeros(nombre, dia, mes, anio) {
  nombre = nombre.toUpperCase().replace(/[^A-Z]/g, '');

  let total = 0, alma = 0, personalidad = 0;

  for (let letra of nombre) {
    let valor = numerologia[letra] || 0;
    total += valor;
    if (vocales.includes(letra)) {
      alma += valor;
    } else {
      personalidad += valor;
    }
  }

  const fechaNumeros = [...dia.toString(), ...mes.toString(), ...anio.toString()];
  const sumaFecha = fechaNumeros.reduce((a, b) => a + parseInt(b), 0);

  const caminoVida = reducirADigito(sumaFecha);

  return {
    nombre: reducirADigito(total),
    alma: reducirADigito(alma),
    personalidad: reducirADigito(personalidad),
    caminoVida
  };
}

function comparar(mujer, hombre) {
  const condiciones = [];

  // Condición 1
  condiciones.push(mujer.caminoVida === hombre.personalidad);

  // Condición 2
  condiciones.push(mujer.alma === hombre.caminoVida);

  // Condición 3
  const iguales = (
    mujer.nombre === hombre.nombre ||
    mujer.alma === hombre.alma ||
    mujer.personalidad === hombre.personalidad ||
    mujer.caminoVida === hombre.caminoVida
  );
  condiciones.push(!iguales);

  return condiciones.every(cond => cond);
}

document.getElementById('formulario').addEventListener('submit', function (e) {
  e.preventDefault();

  const nombreMujer = document.getElementById('nombreMujer').value;
  const diaMujer = parseInt(document.getElementById('diaMujer').value);
  const mesMujer = parseInt(document.getElementById('mesMujer').value);
  const anioMujer = parseInt(document.getElementById('anioMujer').value);

  const nombreHombre = document.getElementById('nombreHombre').value;
  const diaHombre = parseInt(document.getElementById('diaHombre').value);
  const mesHombre = parseInt(document.getElementById('mesHombre').value);
  const anioHombre = parseInt(document.getElementById('anioHombre').value);

  // Validación básica
  if (
    isNaN(diaMujer) || isNaN(mesMujer) || isNaN(anioMujer) ||
    isNaN(diaHombre) || isNaN(mesHombre) || isNaN(anioHombre)
  ) {
    document.getElementById('resultado').innerHTML = "<p style='color:red;'>Por favor, completa todas las fechas correctamente.</p>";
    return;
  }

  const mujer = calcularNumeros(nombreMujer, diaMujer, mesMujer, anioMujer);
  const hombre = calcularNumeros(nombreHombre, diaHombre, mesHombre, anioHombre);

  const fueronPareja = comparar(mujer, hombre);

  const resultado = document.getElementById('resultado');
  resultado.innerHTML = `
    <h2>Resultados:</h2>
    <h3>Mujer (${nombreMujer})</h3>
    <ul>
      <li>Número del Nombre: ${mujer.nombre}</li>
      <li>Número del Alma: ${mujer.alma}</li>
      <li>Número de la Personalidad: ${mujer.personalidad}</li>
      <li>Camino de Vida: ${mujer.caminoVida}</li>
    </ul>

    <h3>Hombre (${nombreHombre})</h3>
    <ul>
      <li>Número del Nombre: ${hombre.nombre}</li>
      <li>Número del Alma: ${hombre.alma}</li>
      <li>Número de la Personalidad: ${hombre.personalidad}</li>
      <li>Camino de Vida: ${hombre.caminoVida}</li>
    </ul>

    <h3>¿Fueron pareja en una vida pasada?</h3>
    <p><strong>${fueronPareja ? 'Sí' : 'No'}</strong></p>
  `;
});
