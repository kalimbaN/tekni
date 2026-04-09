const app = require('./src/app');
const { PORT } = require('./src/config/env');

app.listen(PORT, () => {
  console.log(`🚀 Tekni API running on port ${PORT}`);
});