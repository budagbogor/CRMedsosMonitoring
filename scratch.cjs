const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ 
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox', '--lang=id-ID,id']
  });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.google.com/maps/search/Mobeng%20Cipondoh%20Tangerang', {waitUntil: 'networkidle2'});
  
  const text = await page.evaluate(() => document.body.innerText.substring(0, 300));
  console.log(text);
  await browser.close();
})();
