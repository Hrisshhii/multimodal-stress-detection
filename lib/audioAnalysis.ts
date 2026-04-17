export function analyzeAudio(buffer: Buffer) {
  let sumSquares = 0;
  let sum = 0;

  for (let i = 0; i < buffer.length; i++) {
    const val = buffer[i] - 128;
    sumSquares += val * val;
    sum += val;
  }

  const energy = sumSquares / buffer.length;
  const pitch = Math.abs(sum / buffer.length);

  let toneStress = 0;

  if (energy > 2000) toneStress += 0.5;
  if (pitch > 20) toneStress += 0.3;

  return {
    energy,
    pitch,
    toneStress: Math.min(toneStress, 1),
  };
}