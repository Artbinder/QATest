const XLSX = require('xlsx');

const workbook = XLSX.readFile('Test List/CMS Production Regression Test.xlsx');
const sheet = workbook.Sheets[workbook.SheetNames[0]];
const data = XLSX.utils.sheet_to_json(sheet);

console.log('First test:');
console.log(JSON.stringify(data[0], null, 2));
