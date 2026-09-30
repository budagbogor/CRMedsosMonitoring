import fs from 'fs';
import path from 'path';

function walk(dir, callback) {
  if (!fs.existsSync(dir)) return;
  fs.readdirSync(dir).forEach(f => {
    let dirPath = path.join(dir, f);
    let isDirectory = fs.statSync(dirPath).isDirectory();
    isDirectory ? walk(dirPath, callback) : callback(dirPath);
  });
}

const coloredBgs = /(bg-blue|bg-indigo|bg-rose|bg-emerald|bg-amber|bg-sky|bg-red|bg-purple|bg-green|bg-teal|bg-cyan|bg-orange|bg-gradient|from-|to-|via-|bg-black)/;

walk('./src', (filepath) => {
  if (filepath.endsWith('.tsx') || filepath.endsWith('.ts')) {
    let content = fs.readFileSync(filepath, 'utf8');
    
    // Backgrounds
    content = content.replace(/bg-slate-950/g, 'bg-slate-100');
    content = content.replace(/bg-slate-900(\/\d+)?/g, 'bg-white$1');
    content = content.replace(/bg-slate-800(\/\d+)?/g, 'bg-slate-50$1');
    content = content.replace(/bg-slate-700/g, 'bg-slate-100');
    
    const bgColors = ['blue', 'emerald', 'amber', 'rose', 'indigo', 'purple', 'teal'];
    bgColors.forEach(c => {
      content = content.replace(new RegExp(`bg-${c}-950(\\/\\d+)?`, 'g'), `bg-${c}-100$1`);
      content = content.replace(new RegExp(`bg-${c}-900(\\/\\d+)?`, 'g'), `bg-${c}-50$1`);
      content = content.replace(new RegExp(`bg-${c}-800(\\/\\d+)?`, 'g'), `bg-${c}-50$1`);
    });
    
    // Borders
    content = content.replace(/border-slate-800(\/\d+)?/g, 'border-slate-200$1');
    content = content.replace(/border-slate-700(\/\d+)?/g, 'border-slate-300$1');
    content = content.replace(/border-slate-600/g, 'border-slate-300');
    content = content.replace(/border-t-slate-800/g, 'border-t-slate-200');
    content = content.replace(/border-b-slate-800/g, 'border-b-slate-200');
    
    // Divide
    content = content.replace(/divide-slate-800(\/\d+)?/g, 'divide-slate-200$1');
    content = content.replace(/divide-slate-700/g, 'divide-slate-200');
    
    // Text colors (Dark -> Light)
    content = content.replace(/text-slate-400/g, 'text-slate-500');
    content = content.replace(/text-slate-300/g, 'text-slate-700');
    content = content.replace(/text-slate-200/g, 'text-slate-800');
    content = content.replace(/text-slate-100/g, 'text-slate-900');
    
    const colors = ['blue', 'emerald', 'amber', 'rose', 'indigo', 'purple', 'teal'];
    colors.forEach(c => {
      content = content.replaceAll(`text-${c}-200`, `text-${c}-800`);
      content = content.replaceAll(`text-${c}-300`, `text-${c}-700`);
      content = content.replaceAll(`text-${c}-400`, `text-${c}-600`);
    });
    
    // Text white handling
    content = content.split('\n').map(line => {
      // If line has a colored background, keep text-white
      if (coloredBgs.test(line)) {
        return line;
      }
      // Otherwise replace text-white with text-slate-900
      return line.replace(/text-white/g, 'text-slate-900');
    }).join('\n');
    
    fs.writeFileSync(filepath, content, 'utf8');
  }
});

// Also update index.css to make body bg white
let cssPath = './src/index.css';
if (fs.existsSync(cssPath)) {
  let css = fs.readFileSync(cssPath, 'utf8');
  if (!css.includes('background-color: #f8fafc')) {
    css += '\nbody {\n  background-color: #f8fafc;\n  color: #0f172a;\n}\n';
    fs.writeFileSync(cssPath, css, 'utf8');
  }
}

console.log('Theme converted to light mode!');
