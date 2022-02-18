import { minify } from 'csso';
import * as fs from 'fs';

try {
  const data = fs.readFileSync('./static/css/styles.css', 'utf8');
  const minifiedCss = minify(data).css;
  fs.writeFileSync('./static/css/styles.min.css', minifiedCss);
} catch (err) {
  console.error(err);
}
