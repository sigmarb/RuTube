var fs = require('fs');
// Take all models and reference them as .<name>
fs.readdirSync(__dirname).forEach(function(file) {
  if (file !== 'index.js' && file.split('.')[1] === 'js') {
    // take the .js away
    var moduleName = file.split('.')[0];
    exports[moduleName] = require('./' + moduleName);
  }
})
module.exports = exports;