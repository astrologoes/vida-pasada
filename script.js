const letterValues = {
  A:1,B:2,C:3,D:4,E:5,F:6,G:7,H:8,I:9,
  J:1,K:2,L:3,M:4,N:5,O:6,P:7,Q:8,R:9,
  S:1,T:2,U:3,V:4,W:5,X:6,Y:7,Z:8
};
const vowels = new Set(['A','E','I','O','U']);

function reduceNumber(num) {
  if ([11,22,33].includes(num)) return num; // números maestros
  while (num > 9) {
    num = num.toString().split('').reduce((a,b) => a + +b, 0);
    if ([11,22,33].includes(num)) return num;
  }
  return num;
}

function calculateNameNumbers(name) {
  const letters = name.toUpperCase().replace(/[^A-Z]/g, '');
  let total = 0, soul = 0, personality = 0;
  for (const letter of letters) {
    const val = letterValues[letter] || 0;
    total += val;
    if (vowels.has(letter)) soul += val;
    else personality += val;
  }
  return {
    total,
    soul,
    personality,
    totalReduced: reduceNumber(total),
    soulReduced: reduceNumber(soul),
    personalityReduced: reduceNumber(personality)
  };
}

function calculateLifePath(day, month, year) {
  const digits = (''+day+month+year).replace(/[^0-9]/g, '').split('');
  let sum = digits.reduce((a,b) => a + Number(b), 0);
  return reduceNumber(sum);
}

function checkPastLifeCouple(
  womanLifePath, womanSoul,
  manLifePath, manSoul,
  womanNumbers, manNumbers
) {
  const cond1 = (womanLifePath + manSoul) === 10;
  const cond2 = (womanSoul === manLifePath);
  const cond3 = (
    womanNumbers.totalReduced !== manNumbers.totalReduced &&
    womanNumbers.soulReduced !== manNumbers.soulReduced &&
    womanNumbers.personalityReduced !== manNumbers.personalityReduced &&
    womanLifePath !== manLifePath
  );
  return cond1 && cond2 && cond3;
}

document.getElementById('numerologyForm').addEventListener('submit', e => {
  e.preventDefault();

  const outputDiv = document.getElementById('output');
  outputDiv.innerHTML = '';  // Limpiar salida previa

  const womanName = document.getElementById('womanName').value.trim();
  const manName = document.getElementById('manName').value.trim();

  const womanDay = parseInt(document.getElementById('womanDay').value, 10);
  const womanMonth = parseInt(document.getElementById('womanMonth').value, 10);
  const womanYear = parseInt(document.getElementById('womanYear').value, 10);

  const manDay = parseInt(document.getElementById('manDay').value, 10);
  const manMonth = parseInt(document.getElementById('manMonth').value, 10);
  const manYear = parseInt(document.getElementById('manYear').value, 10);

  if (
    !womanName || !manName ||
    isNaN(womanDay) || isNaN(womanMonth) || isNaN(womanYear) ||
    isNaN(manDay) || isNaN(manMonth) || isNaN(manYear)
  ) {
    outputDiv.innerHTML = '<p style="color:#c0392b; font-weight:bold; text-align:center;">Por favor completa todos los campos correctamente.</p>';
    return;
  }

  if (
    womanDay < 1 || womanDay > 31 || womanMonth < 1 || womanMonth > 12 ||
    manDay < 1 || manDay > 31 || manMonth < 1 || manMonth > 12
  ) {
    outputDiv.innerHTML = '<p style="color:#c0392b; font-weight:bold; text-align:center;">Por favor ingresa fechas válidas.</p>';
    return;
  }

  const womanNumbers = calculateNameNumbers(womanName);
  const manNumbers = calculateNameNumbers(manName);

  const womanLifePath = calculateLifePath(womanDay, womanMonth, womanYear);
  const manLifePath = calculateLifePath(manDay, manMonth, manYear);

  const isCouple = checkPastLifeCouple(
    womanLifePath, womanNumbers.soulReduced,
    manLifePath, manNumbers.soulReduced,
    womanNumbers, manNumbers
  );

  const output = `
    <h2>Resultados</h2>
    <table>
      <thead>
        <tr>
          <th></th>
          <th>Mujer</th>
          <th>Hombre</th>
        </tr>
      </thead>
      <tbody>
        <tr><td>Nombre (total)</td><td>${womanNumbers.totalReduced}</td><td>${manNumbers.totalReduced}</td></tr>
        <tr><td>Número del alma</td><td>${womanNumbers.soulReduced}</td><td>${manNumbers.soulReduced}</td></tr>
        <tr><td>Número de personalidad</td><td>${womanNumbers.personalityReduced}</td><td>${manNumbers.personalityReduced}</td></tr>
        <tr><td>Camino de vida</td><td>${womanLifePath}</td><td>${manLifePath}</td></tr>
      </tbody>
    </table>

    <p style="color:${isCouple ? '#27ae60' : '#c0392b'}; font-weight:bold; font-size:1.3rem; text-align:center;">
      ${isCouple ? '¡Fueron pareja en vidas pasadas!' : 'No fueron pareja en vidas pasadas.'}
    </p>
  `;

  outputDiv.innerHTML = output;
});
