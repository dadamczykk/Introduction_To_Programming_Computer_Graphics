var collisionsHelper = []

function initHelper() {
  const n = 200
  const angle = Math.PI * (1 + Math.sqrt(5));

  for (var i = 0; i < n; i++) {
    const t = i / n
    const inclination = Math.acos(1 - 2 * t)
    const azimuth = angle * i

    const x = Math.sin (inclination) * Math.cos (azimuth)
    const y = Math.sin (inclination) * Math.sin (azimuth)
    const z = Math.cos (inclination)
    collisionsHelper.push(new THREE.Vector3 (x, y, z))
  }
}

initHelper();

function getRandomArbitrary(min, max) {
    return Math.random() * (max - min) + min;
}



export const utils = {
  getRandomArbitrary,
  collisionsHelper
}