const fs = require('fs');

let content = fs.readFileSync('src/data/initialData.ts', 'utf8');

const replacements = {
  "'pengaju'": "'PENGAJU'",
  "'sekretariat'": "'ADMIN'",
  "'medis'": "'MEDIS'",
  "'hukum'": "'HUKUM'",
  "'koordinator'": "'KOORDINATOR'",
  "'rehabilitasi'": "'REHABILITASI'"
};

for (const [oldVal, newVal] of Object.entries(replacements)) {
  const regex = new RegExp(`(dariPeran|kepadaPeran|actorPeran):\\s*${oldVal}`, 'g');
  content = content.replace(regex, `$1: ${newVal}`);
}

fs.writeFileSync('src/data/initialData.ts', content);
console.log('Done!');
