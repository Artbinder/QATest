const XLSX = require('xlsx');
const path = require('path');

function readTestCases(fileName = 'CMS Production Regression Test.xlsx', sheetName = 'Sheet1') {
  const filePath = path.join(__dirname, '..', 'Test List', fileName);
  const workbook = XLSX.readFile(filePath);
  const worksheet = workbook.Sheets[sheetName];
  const data = XLSX.utils.sheet_to_json(worksheet);
  return data;
}

function getTestCase(testId, fileName = 'CMS Production Regression Test.xlsx', sheetName = 'Sheet1') {
  const testCases = readTestCases(fileName, sheetName);
  return testCases.find(row => row['Test Case ID'] === testId || Object.values(row)[0] === testId);
}

module.exports = { readTestCases, getTestCase };
