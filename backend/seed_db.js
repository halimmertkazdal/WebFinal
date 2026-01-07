const { Client } = require('pg');
const bcrypt = require('bcrypt');

const client = new Client({
  connectionString: 'postgresql://codesnip_db_user:RTGL2ly8ebHVJ0gHGUgKBXFxCvlW8anZ@dpg-d5f82du3jp1c73bngb30-a.frankfurt-postgres.render.com/codesnip_db',
  ssl: {
    rejectUnauthorized: false
  }
});

async function seed() {
  await client.connect();
  console.log('Veritabanına bağlanıldı');

  try {
    // 1. Admin Kullanıcısı
    const adminPassword = await bcrypt.hash('123456', 10);
    const adminRes = await client.query(`
      INSERT INTO "user" (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET role = $4
      RETURNING id, username;
    `, ['manterx', 'manterx@codesnip.com', adminPassword, 'admin']);
    console.log('Admin kullanıcısı hazır:', adminRes.rows[0]);

    // 2. Editör Kullanıcı
    const editorPassword = await bcrypt.hash('editor123', 10);
    const editorRes = await client.query(`
      INSERT INTO "user" (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET role = $4
      RETURNING id, username;
    `, ['editor', 'editor@codesnip.com', editorPassword, 'editor']);
    console.log('Editör kullanıcısı hazır:', editorRes.rows[0]);

    // 3. Müşteri (Normal) Kullanıcı
    const userPassword = await bcrypt.hash('musteri123', 10);
    const musteriRes = await client.query(`
      INSERT INTO "user" (username, email, password, role)
      VALUES ($1, $2, $3, $4)
      ON CONFLICT (email) DO UPDATE SET role = $4
      RETURNING id, username;
    `, ['musteri', 'musteri@codesnip.com', userPassword, 'user']);
    console.log('Müşteri kullanıcısı hazır:', musteriRes.rows[0]);

    const userIds = [adminRes.rows[0].id, editorRes.rows[0].id, musteriRes.rows[0].id];

    // 3. Yazılım Dilleri (Renk Kodları ile)
    const languages = [
      { name: 'JavaScript', colorCode: '#F7DF1E' },
      { name: 'TypeScript', colorCode: '#3178C6' },
      { name: 'Python', colorCode: '#3776AB' },
      { name: 'React', colorCode: '#61DAFB' },
      { name: 'CSS', colorCode: '#264DE4' },
      { name: 'HTML', colorCode: '#E34F26' },
      { name: 'SQL', colorCode: '#336791' },
      { name: 'Rust', colorCode: '#DEA584' },
    ];
    
    const langIds = {};
    for (const lang of languages) {
      const res = await client.query(`
        INSERT INTO "language" (name, "colorCode")
        VALUES ($1, $2)
        ON CONFLICT (name) DO UPDATE SET "colorCode" = $2
        RETURNING id, name;
      `, [lang.name, lang.colorCode]);
      langIds[lang.name] = res.rows[0].id;
    }
    console.log('Diller oluşturuldu');

    // 4. Türkçe Örnek Snippet'lar
    const snippets = [
      {
        title: 'React UseEffect Hook Kullanımı',
        codeContent: `useEffect(() => {
  const veriGetir = async () => {
    const veri = await api.get('/kullanicilar');
    setKullanicilar(veri);
  };
  veriGetir();
}, []);`,
        description: 'Bileşen yüklendiğinde veri çekmek için useEffect kullanımı.',
        lang: 'React',
        userId: musteriRes.rows[0].id
      },
      {
        title: 'Python List Comprehension',
        codeContent: `kareler = [x**2 for x in range(10)]
cift_sayilar = [x for x in range(20) if x % 2 == 0]
print(kareler)
print(cift_sayilar)`,
        description: 'Python\'da listeleri tek satırda oluşturmanın hızlı ve pratik yolu.',
        lang: 'Python',
        userId: adminRes.rows[0].id
      },
      {
        title: 'CSS ile Div Ortalama',
        codeContent: `.kapsayici {
  display: flex;
  justify_content: center;
  align_items: center;
  height: 100vh;
}`,
        description: 'Flexbox kullanarak bir öğeyi hem yatay hem dikey olarak tam ortaya hizalama.',
        lang: 'CSS',
        userId: musteriRes.rows[0].id
      },
      {
        title: 'JavaScript Async/Await',
        codeContent: `async function veriAl(url) {
  try {
    const cevap = await fetch(url);
    if (!cevap.ok) throw new Error('Ağ hatası oluştu');
    return await cevap.json();
  } catch (hata) {
    console.error('Hata:', hata);
  }
}`,
        description: 'Modern JavaScript ile asenkron veri çekme işlemi.',
        lang: 'JavaScript',
        userId: adminRes.rows[0].id
      }
    ];

    for (const snip of snippets) {
       await client.query(`
        INSERT INTO "snippet" (title, "codeContent", description, "languageId", "userId")
        VALUES ($1, $2, $3, $4, $5)
       `, [snip.title, snip.codeContent, snip.description, langIds[snip.lang], snip.userId]);
    }
    console.log('Türkçe demo içerikler eklendi');

  } catch (err) {
    console.error('Seeding hatası:', err);
  } finally {
    await client.end();
  }
}

seed();
