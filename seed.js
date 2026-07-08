const db = require('./database');

const products = [
  {
    title: 'YouGame Client 1.20.4',
    description: 'Оптимизированный клиент для PvP с улучшенным FPS. Встроенные модули: кейстрапы, анимации, мини-карта.',
    version: '1.20.4',
    image_url: '/images/client1.png',
    download_url: 'https://example.com/downloads/yougame-1.20.4.zip',
    category: 'client'
  },
  {
    title: 'YouGame Client 1.8.9',
    description: 'Легендарная версия для PvP на серверах. Lunar-подобный интерфейс, бланк-спот блокировка.',
    version: '1.8.9',
    image_url: '/images/client2.png',
    download_url: 'https://example.com/downloads/yougame-1.8.9.zip',
    category: 'client'
  },
  {
    title: 'YouGame Client 1.21',
    description: 'Новейшая версия для последних серверов. Поддержка трим-текстур, обновлённый рендер.',
    version: '1.21',
    image_url: '/images/client3.png',
    download_url: 'https://example.com/downloads/yougame-1.21.zip',
    category: 'client'
  },
  {
    title: 'YouGame Client 1.16.5',
    description: 'Стабильная версия для модных сборок. Совместимость с OptiFine, улучшенные шейдеры.',
    version: '1.16.5',
    image_url: '/images/client4.png',
    download_url: 'https://example.com/downloads/yougame-1.16.5.zip',
    category: 'client'
  },
  {
    title: 'Resource Pack: 32x PvP',
    description: 'Текстур-пак в разрешении 32x для PvP. Яркие цвета, короткие свады, понятные эффекты.',
    version: '1.20.x',
    image_url: '/images/resourcepack.png',
    download_url: 'https://example.com/downloads/32x-pvp.zip',
    category: 'resourcepack'
  },
  {
    title: 'YouGame Utility Mod',
    description: 'Набор утилит: фуллбрайт, зум, чанк-границы, TPS-монитор и многое другое.',
    version: '1.20.4',
    image_url: '/images/mod.png',
    download_url: 'https://example.com/downloads/yougame-utils.zip',
    category: 'mod'
  }
];

const insert = db.prepare(`
  INSERT OR IGNORE INTO products (title, description, version, image_url, download_url, category)
  VALUES (@title, @description, @version, @image_url, @download_url, @category)
`);

const insertMany = db.transaction((items) => {
  for (const item of items) {
    insert.run(item);
  }
});

insertMany(products);
console.log('Seed completed! Products inserted.');
