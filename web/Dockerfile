FROM node:20

# Dossier de travail
WORKDIR /app

# Copier les fichiers de dépendances
COPY package*.json ./

# Installer les dépendances
RUN npm install
RUN npm install axios react-router-dom prop-types
RUN npm install @tanstack/react-query
RUN npm install @tanstack/react-query-devtools

# Copier le reste du projet
COPY . .

# Exposer le port Vite
EXPOSE 5173

# Commande par défaut (DEV)
CMD ["npm", "run", "dev", "--", "--host"]
