# Editeur de métadonnées ffmpeg

L'idée de se (site) et de généré un ficher bash .sh pour ffmpeg, je suis meilleur en html css donc une vrai app viendra un jour je ne sais pas ? pour l'instant c'est un test a voir si ça fonctionnera dans tout les cas !

Glisser simplement vos fichers dans l'inreface et ajouter vos métadonnée, je déteste la console qui pour moi est obsolète :) 

Vous pouvez éditer plusieur fichier en même temps ou un seul a la foi.. vous choisissez de généré un fichier .sh il faudrai faire un chmod dessus et ou appliquer les changement dans l'interface et les fichiers seront stocker dans /outputs

PS : _réaliser avec le peut de connaissance que j'ai sous linux je ne sais pas si il existe mieux ? j'ai eu un moment des tas de fichier a édité et ça devenez énervant de taper des commande a répétition_

## J'ai ajouter une version avec serveur nodeJS 

Il faut installer nodeJS lancer `❯ npm install` dans le dossier là où se trouve server.js pour ajouter les dépendances, et ensuite démarré le serveur avec `❯ node server.js`

# Le run_serveur.sh est là pour du confort il n'est pas nésséssaire 

# Utilisation

## Rendre le script exécutable
`❯ chmod +x run_server.sh`

## Lancer le serveur avec menu interactif
`❯ ./run-server.sh`

## Lancer directement le serveur
`❯ ./run_server.sh --start`

## Lancer en mode développement (redémarrage automatique)
`❯ ./run_server.sh --dev`
