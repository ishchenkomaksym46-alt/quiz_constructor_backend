FROM node:20-alpine

# Аргумент, який ми передамо з Compose
ARG NODE_ENV=development
ENV NODE_ENV=${NODE_ENV}

WORKDIR /server

# Копіюємо залежності
COPY package*.json ./
RUN npm install

# Копіюємо код
COPY .. .
# Логіка запуску: якщо NODE_ENV=production, запускаємо 'npm run start',
# інакше — 'npm run nodemon'
CMD if [ "$NODE_ENV" = "production" ]; \
    then npm run start; \
    else npm run nodemon; \
    fi
