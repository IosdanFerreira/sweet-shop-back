#!/bin/bash

npm install
npm run build
npm install prisma -D
npm install @prisma/client
npx prisma generate
npx prisma migrate dev
npx ts-node prisma/seed.ts
npm run start:dev