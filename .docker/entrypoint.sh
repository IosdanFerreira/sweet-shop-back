#!/bin/bash

npm install
npm run build
npm install prisma -D
npm install @prisma/client
npx prisma generate
npx prisma migrate dev
npm run start:dev