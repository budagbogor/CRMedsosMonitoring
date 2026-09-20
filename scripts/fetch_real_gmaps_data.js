import fs from 'fs';
import path from 'path';
import dotenv from 'dotenv';

dotenv.config();

/**
 * FETCH REAL GOOGLE MAPS DATA - MOBENG 31 CABANG
 * 
 * Menggunakan Google Places API (New) untuk menarik data rating & jumlah ulasan
 * yang AKURAT dan RESMI langsung dari Google Maps.
 * 
 * CARA PAKAI:
 * 1. Dapatkan Google Maps API Key dari https://console.cloud.google.com
 * 2. Aktifkan "Places API (New)" di Google Cloud Console
 * 3. Tambahkan ke .env: GOOGLE_MAPS_API_KEY=AIzaSy...
 * 4. Jalankan: node scripts/fetch_real_gmaps_data.js
 */

const GOOGLE_MAPS_API_KEY = process.env.GOOGLE_MAPS_API_KEY;

if (!GOOGLE_MAPS_API_KEY) {
  console.error('═══════════════════════════════════════════════════════════');
  console.error('❌ GOOGLE_MAPS_API_KEY tidak ditemukan di file .env!');
  console.error('');
  console.error('Untuk menarik data REAL dari Google Maps, Anda perlu:');
  console.error('');
  console.error('1. Buka https://console.cloud.google.com');
  console.error('2. Buat Project baru (atau gunakan yang sudah ada)');
  console.error('3. Aktifkan "Places API (New)" di menu APIs & Services');
  console.error('4. Buat API Key di menu Credentials');
  console.error('5. Tambahkan baris berikut ke file .env:');
  console.error('   GOOGLE_MAPS_API_KEY=AIzaSy...(key Anda)');
  console.error('6. Jalankan ulang: node scripts/fetch_real_gmaps_data.js');
  console.error('');
  console.error('💡 Google Places API memberikan $200 kredit gratis per bulan.');
  console.error('   31 cabang × 1 request = ~$0.10 total (sangat murah!)');
  console.error('═══════════════════════════════════════════════════════════');
  process.exit(1);
}

// ---- Konfigurasi Branch Mobeng (nama pencarian Google Maps) ----
const MOBENG_BRANCHES = [
  { id: "br-mobeng-bsd", searchQuery: "Mobeng BSD City Tangerang Selatan" },
  { id: "br-mobeng-karawaci", searchQuery: "Mobeng Karawaci Tangerang" },
  { id: "br-mobeng-cipondoh", searchQuery: "Mobeng Cipondoh Tangerang" },
  { id: "br-mobeng-pondok-betung", searchQuery: "Mobeng Pondok Betung Tangerang Selatan" },
  { id: "br-mobeng-gading-serpong", searchQuery: "Mobeng Gading Serpong Tangerang" },
  { id: "br-mobeng-harapan-indah", searchQuery: "Mobeng Harapan Indah Bekasi" },
  { id: "br-mobeng-sunter", searchQuery: "Mobeng Sunter Jakarta Utara" },
  { id: "br-mobeng-cinere", searchQuery: "Mobeng Cinere Depok" },
  { id: "br-mobeng-tole-iskandar", searchQuery: "Mobeng Tole Iskandar Depok" },
  { id: "br-mobeng-lenteng-agung", searchQuery: "Mobeng Lenteng Agung Jakarta Selatan" },
  { id: "br-mobeng-hankam", searchQuery: "Mobeng Hankam Bekasi" },
  { id: "br-mobeng-mustika-jaya", searchQuery: "Mobeng Mustika Jaya Bekasi" },
  { id: "br-mobeng-jati-asih", searchQuery: "Mobeng Jati Asih Bekasi" },
  { id: "br-mobeng-duren-sawit", searchQuery: "Mobeng Duren Sawit Jakarta Timur" },
  { id: "br-mobeng-cileungsi", searchQuery: "Mobeng Cileungsi Bogor" },
  { id: "br-mobeng-jababeka", searchQuery: "Mobeng Jababeka Cikarang Bekasi" },
  { id: "br-mobeng-galuhmas", searchQuery: "Mobeng Galuhmas Karawang" },
  { id: "br-mobeng-kopo", searchQuery: "Mobeng Kopo Bandung" },
  { id: "br-mobeng-merr", searchQuery: "Mobeng MERR Surabaya" },
  { id: "br-mobeng-merr-surabaya", searchQuery: "Mobeng MERR Sukolilo Surabaya" },
  { id: "br-mobeng-jemursari", searchQuery: "Mobeng Jemursari Surabaya" },
  { id: "br-mobeng-citraland", searchQuery: "Mobeng Citraland Surabaya" },
  { id: "br-mobeng-kupang", searchQuery: "Mobeng Kupang Surabaya" },
  { id: "br-mobeng-kupang-surabaya", searchQuery: "Mobeng Kupang Baru Surabaya" },
  { id: "br-mobeng-pandegiling", searchQuery: "Mobeng Pandegiling Surabaya" },
  { id: "br-mobeng-brigjen-katamso", searchQuery: "Mobeng Brigjen Katamso Sidoarjo" },
  { id: "br-mobeng-mulyosari", searchQuery: "Mobeng Mulyosari Surabaya" },
  { id: "br-mobeng-manukan", searchQuery: "Mobeng Manukan Benowo Surabaya" },
  { id: "br-mobeng-cemengkalang", searchQuery: "Mobeng Cemengkalang Sidoarjo" },
  { id: "br-mobeng-taman-waru", searchQuery: "Mobeng Taman Waru Sidoarjo" },
  { id: "br-mobeng-ahmad-yani-malang", searchQuery: "Mobeng Ahmad Yani Malang" },
];

// ---- Google Places API (New) - Text Search ----
async function searchPlace(query) {
  const url = 'https://places.googleapis.com/v1/places:searchText';
  
  const response = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Goog-Api-Key': GOOGLE_MAPS_API_KEY,
      'X-Goog-FieldMask': 'places.displayName,places.rating,places.userRatingCount,places.formattedAddress,places.reviews,places.googleMapsUri'
    },
    body: JSON.stringify({
      textQuery: query,
      languageCode: 'id',
      maxResultCount: 1,
    })
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Places API Error ${response.status}: ${errorText}`);
  }

  const data = await response.json();
  return data.places?.[0] || null;
}

// ---- Utility: delay ----
function delay(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

// ---- Main Fetch Function ----
async function fetchRealGMapsData() {
  console.log('══════════════════════════════════════════════════════════════');
  console.log('🌐 FETCHING DATA REAL DARI GOOGLE MAPS PLACES API (NEW)');
  console.log('   Menarik rating, jumlah ulasan, dan review terbaru');
  console.log('   untuk 31 cabang Mobeng secara RESMI dari Google Maps.');
  console.log('══════════════════════════════════════════════════════════════\n');

  const mockPath = path.join(process.cwd(), 'src', 'data', 'mockDatasets.ts');
  let mockContent = fs.readFileSync(mockPath, 'utf-8');

  const dbPath = path.join(process.cwd(), 'data', 'local-database.json');
  let localDb = { lastUpdated: new Date().toISOString(), branches: {} };
  if (fs.existsSync(dbPath)) {
    try {
      localDb = JSON.parse(fs.readFileSync(dbPath, 'utf-8'));
    } catch (e) {}
  }

  const now = new Date();
  const fetchedAt = `${now.toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' })}, ${now.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })} WIB`;

  const results = {};
  let successCount = 0;
  let failCount = 0;
  let totalReviews = 0;
  let ratingSum = 0;

  for (let i = 0; i < MOBENG_BRANCHES.length; i++) {
    const branch = MOBENG_BRANCHES[i];
    console.log(`──────────────────────────────────────────────────`);
    console.log(`[${i + 1}/${MOBENG_BRANCHES.length}] Mencari: ${branch.searchQuery}`);

    try {
      const place = await searchPlace(branch.searchQuery);

      if (!place) {
        console.log(`   ⚠️ Tidak ditemukan di Google Maps, skip (data lama dipertahankan)`);
        failCount++;
        await delay(500);
        continue;
      }

      const rating = place.rating || 0;
      const reviewCount = place.userRatingCount || 0;
      const displayName = place.displayName?.text || branch.searchQuery;
      const address = place.formattedAddress || '';
      const mapsUrl = place.googleMapsUri || '';

      // Extract reviews dari Places API
      const reviews = (place.reviews || []).map((r, idx) => ({
        id: `gmaps-${branch.id}-${idx + 1}`,
        author: r.authorAttribution?.displayName || 'Pelanggan Google Maps',
        rating: r.rating || 0,
        date: r.relativePublishTimeDescription || 'Terbaru',
        text: r.text?.text || '',
        sentiment: r.rating <= 2 ? 'negative' : r.rating <= 3 ? 'neutral' : 'positive',
        tags: r.rating <= 3 ? ['Perlu Perhatian'] : ['Review Positif'],
      })).filter(r => r.text.trim().length > 0);

      // Hitung negatives dari review rating rendah
      const negatives = reviews
        .filter(r => r.rating <= 3)
        .map(r => r.text.substring(0, 120))
        .slice(0, 5);

      const status = rating >= 4.7 ? 'Top' : rating >= 4.4 ? 'Medium' : 'Attention Required';
      const complaintCount = reviews.filter(r => r.rating <= 3).length;

      results[branch.id] = {
        rating,
        reviewCount,
        status,
        negatives,
        complaintCount,
        reviews,
        displayName,
        address,
        mapsUrl,
      };

      ratingSum += rating;
      totalReviews += reviewCount;
      successCount++;

      console.log(`   ✅ ${displayName}`);
      console.log(`      📍 ${address}`);
      console.log(`      ⭐ Rating: ${rating.toFixed(1)} | 📊 Ulasan: ${reviewCount} | 💬 Review fetched: ${reviews.length}`);
      if (negatives.length > 0) {
        console.log(`      ⚠️ Keluhan: ${negatives.length} isu terdeteksi`);
      }

      // Update mockDatasets.ts dengan data real
      const branchBlockPattern = new RegExp(
        `(id:\\s*"${branch.id}"[\\s\\S]*?rating:\\s*)[\\d.]+([\\s\\S]*?reviewCount:\\s*)\\d+([\\s\\S]*?status:\\s*)"[^"]+"([\\s\\S]*?negatives:\\s*\\[)[\\s\\S]*(\\][\\s\\S]*?complaintCount:\\s*)\\d+`
      );

      const negListString = negatives.length > 0
        ? `\n          ${negatives.map(n => `"${n.replace(/"/g, '\\"')}"`).join(',\n          ')}\n        `
        : '';

      mockContent = mockContent.replace(
        branchBlockPattern,
        `$1${rating.toFixed(1)}$2${reviewCount}$3"${status}"$4${negListString}$5${complaintCount}`
      );

      // Update local database
      const branchNameMatch = mockContent.match(new RegExp(`id:\\s*"${branch.id}"[\\s\\S]*?name:\\s*"([^"]+)"`));
      const branchName = branchNameMatch ? branchNameMatch[1] : displayName;

      localDb.branches[branchName] = {
        reviews,
        fetchedAt,
        lastSync: new Date().toISOString(),
        meta: { rating, reviewCount },
        source: 'Google Places API (New)',
        googleMapsUrl: mapsUrl,
      };

    } catch (err) {
      console.log(`   ❌ Error: ${err.message}`);
      console.log(`   ⚠️ Data lama dipertahankan (tidak di-overwrite dengan 0)`);
      failCount++;
    }

    // Delay 300ms antar request (aman untuk Places API quota)
    await delay(300);
  }

  // Update rata-rata jaringan
  if (successCount > 0) {
    const avgRating = (ratingSum / successCount).toFixed(2);
    mockContent = mockContent.replace(/avgNetworkRating:\s*[\d.]+,/, `avgNetworkRating: ${avgRating},`);
    mockContent = mockContent.replace(/totalReviewsAnalyzed:\s*\d+,/, `totalReviewsAnalyzed: ${totalReviews},`);
  }

  // Save files
  fs.writeFileSync(mockPath, mockContent, 'utf-8');
  localDb.lastUpdated = new Date().toISOString();
  fs.writeFileSync(dbPath, JSON.stringify(localDb, null, 2), 'utf-8');

  // Save raw results
  const rawOutputPath = path.join(process.cwd(), 'data', 'mobeng-real-gmaps-results.json');
  fs.writeFileSync(rawOutputPath, JSON.stringify(results, null, 2), 'utf-8');

  console.log('\n══════════════════════════════════════════════════════════════');
  console.log('📊 LAPORAN FETCHING DATA GOOGLE MAPS');
  console.log('══════════════════════════════════════════════════════════════');
  console.log(`   ✅ Berhasil: ${successCount} cabang`);
  console.log(`   ❌ Gagal: ${failCount} cabang`);
  if (successCount > 0) {
    console.log(`   ⭐ Rata-rata Rating: ${(ratingSum / successCount).toFixed(2)} / 5.0`);
    console.log(`   📊 Total Ulasan: ${totalReviews.toLocaleString('id-ID')}`);
  }
  console.log(`   💾 Data tersimpan di mockDatasets.ts & local-database.json`);
  console.log(`   📁 Raw results: ${rawOutputPath}`);
  console.log('══════════════════════════════════════════════════════════════');
}

fetchRealGMapsData().catch(console.error);
