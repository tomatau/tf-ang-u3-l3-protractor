exports.config = {
  seleniumAddress: 'http://localhost:4444/wd/hub',
  specs: ['e2e-tests/*Spec.js'],
  baseUrl: 'http://localhost:7777/'
}
