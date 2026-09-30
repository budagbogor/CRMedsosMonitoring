const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.google.com/maps/search/Mobeng%20Cipondoh%20Tangerang', {waitUntil: 'networkidle2'});
  
  const extracted = await page.evaluate(() => {
    // Find any element containing 93
    const elements = Array.from(document.querySelectorAll('*')).filter(e => e.childNodes.length === 1 && e.childNodes[0].nodeType === 3 && e.innerText && e.innerText.includes('93'));
    
    let result = [];
    for (let el of elements) {
      result.push({
        tagName: el.tagName,
        text: el.innerText,
        className: el.className,
        ariaLabel: el.getAttribute('aria-label')
      });
    }
    return result;
  });
  
  console.log(JSON.stringify(extracted, null, 2));
  await browser.close();
})();
