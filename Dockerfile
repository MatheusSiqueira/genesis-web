# ===== Etapa 1: Build com Node =====
FROM node:20-alpine AS builder
WORKDIR /app

# Copia configs e instala dependências
COPY package*.json ./
RUN npm ci

# Copia o resto do código
COPY . .

# Compila o projeto (gera pasta dist/)
RUN npm run build

# ===== Etapa 2: Servidor Nginx =====
FROM nginx:1.27-alpine

# Apaga config padrão do nginx
RUN rm /etc/nginx/conf.d/default.conf

# Copia config customizada
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia os arquivos buildados
COPY --from=builder /app/dist /usr/share/nginx/html

EXPOSE 8080
CMD ["nginx", "-g", "daemon off;"]