import { execSync } from 'child_process';
import { config } from 'dotenv';
import * as path from 'path';

config({ path: path.resolve(process.cwd(), '.env.test') });

console.log('Resetando banco de dados de teste...');
execSync('npx prisma migrate reset --force', {
  stdio: 'inherit',
  env: { ...process.env },
});

console.log('✅ Banco de testes pronto!');
