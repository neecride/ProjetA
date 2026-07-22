#!/bin/bash

# ============================================
# ÉDITEUR DE MÉTADONNÉES - Lancement rapide
# ============================================

echo "🎬 Éditeur de Métadonnées"
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Vérifier Node.js
if ! command -v node &> /dev/null; then
    echo "❌ Node.js n'est pas installé !"
    echo "   https://nodejs.org/"
    exit 1
fi
echo "✅ Node.js : $(node -v)"

# Vérifier ffmpeg
if ! command -v ffmpeg &> /dev/null; then
    echo "⚠️  ffmpeg n'est pas installé"
else
    echo "✅ ffmpeg : $(ffmpeg -version | head -n1 | cut -d' ' -f3)"
fi

# Installer les dépendances si nécessaire
if [ ! -d "node_modules" ]; then
    echo "📦 Installation des dépendances..."
    npm install
fi

# Créer le dossier uploads
mkdir -p uploads

# Ouvrir le navigateur
echo "🌐 Ouverture du navigateur..."
sleep 1
xdg-open http://localhost:3000 2>/dev/null || open http://localhost:3000 2>/dev/null || start http://localhost:3000 2>/dev/null

echo ""
echo "🚀 Lancement du serveur..."
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""
echo "   ➜ App : http://localhost:3000"
echo "   ➜ Ctrl+C pour arrêter"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"

# Lancer le serveur
node server.js
