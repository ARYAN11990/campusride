const fs = require('fs');
const path = require('path');

const walk = (dir, done) => {
  let results = [];
  fs.readdir(dir, (err, list) => {
    if (err) return done(err);
    let pending = list.length;
    if (!pending) return done(null, results);
    list.forEach(file => {
      file = path.resolve(dir, file);
      fs.stat(file, (err, stat) => {
        if (stat && stat.isDirectory()) {
          walk(file, (err, res) => {
            results = results.concat(res);
            if (!--pending) done(null, results);
          });
        } else {
          results.push(file);
          if (!--pending) done(null, results);
        }
      });
    });
  });
};

const replacements = [
  { from: /text-white/g, to: 'text-gray-800' },
  { from: /text-slate-300/g, to: 'text-gray-700' },
  { from: /text-slate-400/g, to: 'text-gray-500' },
  { from: /text-slate-500/g, to: 'text-gray-400' },
  { from: /border-white\/10/g, to: 'border-gray-200' },
  { from: /border-white\/5/g, to: 'border-gray-100' },
  { from: /border-white\/20/g, to: 'border-gray-300' },
  { from: /bg-white\/5/g, to: 'bg-white' },
  { from: /bg-white\/10/g, to: 'bg-gray-50' },
  { from: /bg-slate-800/g, to: 'bg-white' },
  { from: /bg-slate-900/g, to: 'bg-gray-50' },
  { from: /from-primary-500 to-accent-500/g, to: 'from-blue-500 to-indigo-500' },
  { from: /from-primary-500 to-primary-600/g, to: 'from-blue-500 to-blue-600' },
  { from: /border-primary-500/g, to: 'border-blue-500' },
  { from: /text-primary-500/g, to: 'text-blue-500' },
  { from: /text-primary-400/g, to: 'text-blue-600' },
  { from: /bg-primary-500/g, to: 'bg-blue-500' },
  { from: /text-accent-500/g, to: 'text-indigo-500' },
  { from: /text-accent-400/g, to: 'text-indigo-600' },
  { from: /bg-accent-500/g, to: 'bg-indigo-500' },
  { from: /focus:border-primary-500/g, to: 'focus:ring-2 focus:ring-blue-400 focus:border-blue-400' },
  { from: /hover:bg-white\/10/g, to: 'hover:bg-gray-100' },
  { from: /hover:bg-white\/5/g, to: 'hover:bg-gray-50' },
  { from: /hover:text-white/g, to: 'hover:text-gray-900' },
];

walk(__dirname, (err, files) => {
  if (err) throw err;
  const jsxFiles = files.filter(f => f.endsWith('.jsx') || f.endsWith('.js'));
  
  jsxFiles.forEach(file => {
    let content = fs.readFileSync(file, 'utf8');
    let original = content;
    
    replacements.forEach(({ from, to }) => {
      content = content.replace(from, to);
    });
    
    if (content !== original) {
      fs.writeFileSync(file, content);
      console.log('Updated: ' + path.basename(file));
    }
  });
});
