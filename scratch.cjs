const puppeteer = require('puppeteer');
(async () => {
  const browser = await puppeteer.launch({ headless: true });
  const page = await browser.newPage();
  await page.setViewport({ width: 1280, height: 800 });
  await page.setUserAgent('Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36');
  await page.goto('https://www.google.com/maps/search/Mobeng%20Cipondoh%20Tangerang', {waitUntil: 'networkidle2'});

  console.log("Looking for reviews tab...");
  const clickedTab = await page.evaluate(() => {
    const buttons = Array.from(document.querySelectorAll('button'));
    const b = buttons.find(b => b.innerText && (b.innerText.includes('Reviews') || b.innerText.includes('Ulasan')));
    if (b) { b.click(); return true; }
    return false;
  });
  
  if (clickedTab) {
    await new Promise(r => setTimeout(r, 3000));
    console.log("Clicked reviews tab!");
    
    // Look for Sort button
    const clickedSort = await page.evaluate(() => {
      const buttons = Array.from(document.querySelectorAll('button'));
      const b = buttons.find(b => b.innerText && (b.innerText.includes('Urutkan') || b.innerText.includes('Sort')));
      if (b) { b.click(); return true; }
      return false;
    });
    
    if (clickedSort) {
      await new Promise(r => setTimeout(r, 1000));
      console.log("Clicked Sort button!");
      
      // Click Lowest rating
      await page.evaluate(() => {
        const menuItems = Array.from(document.querySelectorAll('div[data-index]'));
        const lowest = menuItems.find(el => el.innerText && (el.innerText.includes('Lowest') || el.innerText.includes('terendah')));
        if (lowest) {
          lowest.click();
        } else {
          const fallback = menuItems.find(el => el.getAttribute('data-index') === '2');
          if (fallback) fallback.click();
        }
      });
      await new Promise(r => setTimeout(r, 3000));
      console.log("Clicked Lowest rating!");
    }
    
    // Extract reviews
    const extracted = await page.evaluate(() => {
      const reviewTexts = document.querySelectorAll('.wiI7pd');
      const reviews = [];
      reviewTexts.forEach(textEl => {
        let container = textEl.parentElement;
        for (let i = 0; i < 5; i++) {
          if (container && container.parentElement) container = container.parentElement;
        }
        
        let author = "Google User (Scraped)";
        let date = new Date().toISOString();
        let rating = 0;
        
        if (container) {
          const allSpans = container.querySelectorAll('span, div');
          for (const el of allSpans) {
            const text = el.innerText || '';
            if (text.includes('lalu') || text.includes('ago') || text.includes('hari') || text.includes('bulan') || text.includes('tahun')) {
              if (text.length > 3 && text.length < 20) date = text;
            }
            if (el.getAttribute('aria-label') && (el.getAttribute('aria-label').includes('bintang') || el.getAttribute('aria-label').includes('stars'))) {
              const m = el.getAttribute('aria-label').match(/([1-5])/);
              if (m && !rating) rating = parseInt(m[1]);
            }
          }
          
          const img = container.querySelector('img');
          if (img && img.alt) {
            author = img.alt;
          } else {
            const btn = container.querySelector('button');
            if (btn && btn.innerText && btn.innerText.length > 2) author = btn.innerText.split('\n')[0];
          }
        }
        
        reviews.push({ author, rating, date, text: textEl.innerText });
      });
      return reviews;
    });
    
    console.log(JSON.stringify(extracted.filter(r => r.rating <= 3), null, 2));
  }

  await browser.close();
})();
