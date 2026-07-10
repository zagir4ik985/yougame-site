const db = require('./database');

db.prepare('DELETE FROM products').run();
db.prepare('DELETE FROM downloads').run();

const product = {
  title: 'zagaDLC',
  description: 'Мощный Minecraft 1.21.4 Fabric мод-клиент для PvP. Более 30 модулей: TriggerBot, Aura, Criticals, ESP, Fly, Speed, KillAura и многое другое. Регулярные обновления, стабильная работа, обход бан-систем.',
  version: '1.21.4',
  image_url: '/images/yougame.png',
  download_url: '#',
  category: 'client'
};

db.prepare(`
  INSERT OR IGNORE INTO products (title, description, version, image_url, download_url, category)
  VALUES (@title, @description, @version, @image_url, @download_url, @category)
`).run(product);

console.log('Seed completed! zagaDLC product inserted.');
