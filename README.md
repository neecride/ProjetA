L'idée de se (site) et de généré un ficher bash .sh pour ffmpeg, je suis meilleur en html css donc une vrai app viendra un jour je ne sais pas ? pour l'instant c'est un test a voir si ça fonctionnera dans tout les cas !

Glisser simplement vos fichers dans l'inreface et ajouetr vos métadonnée je déteste la console qui pour moi est obsolète, vous pouvez éditer plusieur fichier et sortir un seul fichier bash a la foi pour un seul titre .mp3 ou plusieur en même temps 

<img height="700" alt="Capture d&#39;écran_20260715_234536" src="https://github.com/user-attachments/assets/d39f13b0-49cb-4109-b265-c7e9339de2e0" />

Voilà un exemple de script.sh en sortie : il faudra toujours faire un chmod dans la cosole et l'executer mais c'est un bon début, c'est une semi interface.

Avec 1 fichier

```
#!/bin/bash

# Script généré automatiquement
# Date: 15/07/2026 23:39:11

shopt -s nullglob

if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg requis mais pas installé."
    exit 1
fi

echo "📝 Traitement: 2pac - Still Ballin.mp3"
temp_file="2pac - Still Ballin.mp3.new.mp3"
ffmpeg -i "2pac - Still Ballin.mp3" \
        -metadata title="Still Ballin" \
        -metadata artist="2pac fr Trick Daddy" \
        -metadata album="Better Dayz - single" \
        -metadata track="1" \
        -metadata date="1995" \
        -metadata genre="rap" \
        -c copy \
        -y "$temp_file" 2>/dev/null

if [ $? -eq 0 ]; then
    mv "$temp_file" "2pac - Still Ballin.mp3"
    echo "   ✅ 2pac - Still Ballin.mp3 traité"
else
    echo "   ❌ Erreur pour 2pac - Still Ballin.mp3"
    rm -f "$temp_file"
fi

echo "=========================================="
echo "🎉 Traitement terminé !"

```

Avec 2 fichier 

```
#!/bin/bash

# Script généré automatiquement
# Date: 15/07/2026 23:43:23

shopt -s nullglob

if ! command -v ffmpeg &> /dev/null; then
    echo "❌ ffmpeg requis mais pas installé."
    exit 1
fi

echo "📝 Traitement: 2pac - Still Ballin.mp3"
temp_file="2pac - Still Ballin.mp3.new.mp3"
ffmpeg -i "2pac - Still Ballin.mp3" \
        -metadata title="Still Ballin" \
        -metadata artist="2pac fr Trick Daddy" \
        -metadata album="Better Dayz - single" \
        -metadata track="1" \
        -metadata date="1995" \
        -metadata genre="rap" \
        -c copy \
        -y "$temp_file" 2>/dev/null

if [ $? -eq 0 ]; then
    mv "$temp_file" "2pac - Still Ballin.mp3"
    echo "   ✅ 2pac - Still Ballin.mp3 traité"
else
    echo "   ❌ Erreur pour 2pac - Still Ballin.mp3"
    rm -f "$temp_file"
fi

echo "📝 Traitement: black widow.mp3"
temp_file="black widow.mp3.new.mp3"
ffmpeg -i "black widow.mp3" \
        -metadata title="Fame on Fire" \
        -metadata artist="Black widow ft twiggy" \
        -metadata album="black widow" \
        -metadata genre="rock" \
        -c copy \
        -y "$temp_file" 2>/dev/null

if [ $? -eq 0 ]; then
    mv "$temp_file" "black widow.mp3"
    echo "   ✅ black widow.mp3 traité"
else
    echo "   ❌ Erreur pour black widow.mp3"
    rm -f "$temp_file"
fi

echo "=========================================="
echo "🎉 Traitement terminé !"

```

PS : réaliser avec le peut de connaissance que j'ai sous linux je ne sais pas si il existe mieux ?
