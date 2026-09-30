const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.google.com/maps/search/Mobeng%20Cipondoh%20Tangerang', {waitUntil: 'networkidle2'});
  
  const extracted = await page.evaluate(() => {
    let overallRating = 0;
    let totalReviewCount = 0;
    try {
      const ratingEl = document.querySelector('span[aria-label*="bintang"], span[aria-label*="stars"]');
      if (ratingEl) {
        const m = ratingEl.getAttribute('aria-label')?.match(/([1-5][.,][0-9])/);
        if (m) overallRating = parseFloat(m[1].replace(',', '.'));
      }
      
      const countEl = document.querySelector('span[aria-label*="ulasan"], span[aria-label*="reviews"], button[aria-label*="ulasan"], button[aria-label*="reviews"]');
      if (countEl) {
        const m = countEl.getAttribute('aria-label')?.match(/([\d,.]+)/);
        if (m) totalReviewCount = parseInt(m[1].replace(/[.,]/g, ''), 10);
      }

      if (!overallRating || !totalReviewCount) {
        const mainText = document.body.innerText;
        const match = mainText.match(/([1-5][.,][0-9])\s*(?:stars|bintang)?\n*\s*\(([\d,.]+)(?:\s*ulasan|\s*reviews)?\)/i);
        if (match) {
          if (!overallRating) overallRating = parseFloat(match[1].replace(',', '.'));
          if (!totalReviewCount) totalReviewCount = parseInt(match[2].replace(/[.,]/g, ''), 10);
        }
      }
    } catch (e) {}

    return { overallRating, totalReviewCount };
  });
  
  console.log(JSON.stringify(extracted, null, 2));
  await browser.close();
})();
