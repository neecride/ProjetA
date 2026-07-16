// ============================================
// ÉDITEUR DE MÉTADONNÉES - Script principal
// ============================================

// Variables globales
const files = [];
const dropZone = document.getElementById('dropZone');
const fileInput = document.getElementById('fileInput');
const fileList = document.getElementById('fileList');

// ============================================
// GESTION DU DRAG & DROP
// ============================================

dropZone.addEventListener('dragover', (e) => {
    e.preventDefault();
    dropZone.classList.add('dragover');
});

dropZone.addEventListener('dragleave', () => {
    dropZone.classList.remove('dragover');
});

dropZone.addEventListener('drop', (e) => {
    e.preventDefault();
    dropZone.classList.remove('dragover');
    const droppedFiles = Array.from(e.dataTransfer.files);
    ajouterFichiers(droppedFiles);
});

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const selectedFiles = Array.from(e.target.files);
    ajouterFichiers(selectedFiles);
    fileInput.value = '';
});

// ============================================
// AJOUT DE FICHIERS
// ============================================

function ajouterFichiers(newFiles) {
    newFiles.forEach(file => {
        // Vérifier les formats supportés
        const formats = ['.mp3', '.mp4', '.mkv', '.avi', '.flac', '.wav', '.ogg', '.m4a', '.mov', '.webm', '.mpg', '.mpeg'];
        const extension = '.' + file.name.split('.').pop().toLowerCase();
        
        if (formats.includes(extension)) {
            const episode = file.name.match(/EP\s*(\d+)/i);
            const saison = file.name.match(/Saison\s*(\d+)|Season\s*(\d+)/i);
            
            files.push({
                name: file.name,
                path: file.path || file.name,
                size: file.size,
                type: extension.substring(1).toUpperCase(),
                episode: episode ? episode[1] : '',
                saison: saison ? (saison[1] || saison[2]) : '',
                titre: '',
                artiste: '',
                album: '',
                annee: '',
                genre: '',
                piste: episode ? episode[1] : '',
                commentaire: ''
            });
        } else {
            ajouterLog(`⚠️ Format non supporté: ${file.name}`, 'warning');
        }
    });
    afficherFichiers();
    ajouterLog(`✅ ${newFiles.length} fichier(s) ajouté(s)`, 'success');
}

// ============================================
// AFFICHAGE DE LA LISTE
// ============================================

function afficherFichiers() {
    if (files.length === 0) {
        fileList.innerHTML = '<p class="empty-message">Aucun fichier chargé</p>';
        return;
    }
    
    fileList.innerHTML = files.map((file, index) => `
        <div class="file-item" data-index="${index}">
            <div class="file-header">
                <span class="file-name">${file.name}</span>
                <span class="file-type">${file.type}</span>
                <button class="btn-remove" onclick="supprimerFichier(${index})">✕</button>
            </div>
            <div class="file-size">${formatTaille(file.size)}</div>
            <div class="meta-grid">
                <div class="full-width">
                    <div class="label">Titre</div>
                    <input type="text" value="${file.titre}" placeholder="Titre" 
                           onchange="mettreAJour(${index}, 'titre', this.value)">
                </div>
                <div>
                    <div class="label">Artiste / Série</div>
                    <input type="text" value="${file.artiste}" placeholder="Artiste" 
                           onchange="mettreAJour(${index}, 'artiste', this.value)">
                </div>
                <div>
                    <div class="label">Album / Saison</div>
                    <input type="text" value="${file.album || file.saison}" placeholder="Album" 
                           onchange="mettreAJour(${index}, 'album', this.value)">
                </div>
                <div>
                    <div class="label">Piste / Épisode</div>
                    <input type="text" value="${file.piste || file.episode}" placeholder="Piste" 
                           onchange="mettreAJour(${index}, 'piste', this.value)">
                </div>
                <div>
                    <div class="label">Année</div>
                    <input type="text" value="${file.annee}" placeholder="Année" 
                           onchange="mettreAJour(${index}, 'annee', this.value)">
                </div>
                <div>
                    <div class="label">Genre</div>
                    <input type="text" value="${file.genre}" placeholder="Genre" 
                           onchange="mettreAJour(${index}, 'genre', this.value)">
                </div>
                <div class="full-width">
                    <div class="label">Commentaire</div>
                    <input type="text" value="${file.commentaire}" placeholder="Commentaire" 
                           onchange="mettreAJour(${index}, 'commentaire', this.value)">
                </div>
            </div>
        </div>
    `).join('');
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function mettreAJour(index, champ, valeur) {
    files[index][champ] = valeur;
}

function supprimerFichier(index) {
    files.splice(index, 1);
    afficherFichiers();
    ajouterLog(`🗑️ Fichier supprimé`, 'info');
}

function viderListe() {
    files.length = 0;
    afficherFichiers();
    document.getElementById('log').classList.remove('active');
    document.getElementById('progress').classList.remove('active');
    ajouterLog('🗑️ Liste vidée', 'info');
}

function formatTaille(bytes) {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// ============================================
// OPTIONS GLOBALES
// ============================================

function appliquerOptionsGlobales() {
    const season = document.getElementById('globalSeason').value;
    const artist = document.getElementById('globalArtist').value;
    const year = document.getElementById('globalYear').value;
    const genre = document.getElementById('globalGenre').value;
    
    files.forEach((file, index) => {
        if (season) {
            file.album = season;
            file.saison = season;
            mettreAJour(index, 'album', season);
        }
        if (artist) {
            file.artiste = artist;
            mettreAJour(index, 'artiste', artist);
        }
        if (year) {
            file.annee = year;
            mettreAJour(index, 'annee', year);
        }
        if (genre) {
            file.genre = genre;
            mettreAJour(index, 'genre', genre);
        }
    });
    
    afficherFichiers();
    ajouterLog('📋 Options globales appliquées', 'info');
}

// ============================================
// GÉNÉRATION DU SCRIPT BASH
// ============================================

function genererScript() {
    if (files.length === 0) {
        alert('Ajoute des fichiers d\'abord !');
        return;
    }
    
    const log = document.getElementById('log');
    const progress = document.getElementById('progress');
    log.classList.add('active');
    progress.classList.add('active');
    document.getElementById('logContent').innerHTML = '';
    document.getElementById('progressFill').style.width = '0%';
    
    ajouterLog('🚀 Génération du script...', 'info');
    
    let script = `#!/bin/bash\n\n`;
    script += `# Script généré automatiquement\n`;
    script += `# Date: ${new Date().toLocaleString()}\n\n`;
    
    // === NOUVEAU : Détection automatique du dossier ===
    script += `# Détection automatique du dossier contenant les fichiers\n`;
    script += `SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"\n`;
    script += `echo "📁 Dossier du script : $SCRIPT_DIR"\n\n`;
    
    // Vérifier si on est dans le bon dossier
    script += `# Vérifier la présence des fichiers\n`;
    files.forEach((file) => {
        const name = file.name;
        script += `if [ ! -f "$SCRIPT_DIR/${name}" ] && [ ! -f "${name}" ]; then\n`;
        script += `    echo "⚠️  Fichier non trouvé : ${name}"\n`;
        script += `    echo "   Assure-toi d'être dans le bon dossier"\n`;
        script += `    exit 1\n`;
        script += `fi\n`;
    });
    script += `\n`;
    
    // === Le reste du script ===
    script += `shopt -s nullglob\n\n`;
    script += `if ! command -v ffmpeg &> /dev/null; then\n`;
    script += `    echo "❌ ffmpeg requis mais pas installé."\n`;
    script += `    exit 1\n`;
    script += `fi\n\n`;
    
    let total = files.length;
    
    files.forEach((file, index) => {
        const name = file.name;
        const extension = name.split('.').pop().toLowerCase();
        const titre = file.titre || name.replace(/\.[^/.]+$/, '');
        const artiste = file.artiste || '';
        const album = file.album || '';
        const piste = file.piste || '';
        const annee = file.annee || '';
        const genre = file.genre || '';
        const commentaire = file.commentaire || '';
        
        // Utiliser le chemin avec détection
        script += `echo "📝 Traitement: ${name}"\n`;
        script += `FILE_PATH="$SCRIPT_DIR/${name}"\n`;
        script += `if [ ! -f "$FILE_PATH" ]; then\n`;
        script += `    FILE_PATH="${name}"\n`;
        script += `fi\n`;
        script += `temp_file="\${FILE_PATH}.new.${extension}"\n`;
        script += `ffmpeg -i "\$FILE_PATH" \\\n`;
        script += `        -metadata title="${titre}" \\\n`;
        if (artiste) script += `        -metadata artist="${artiste}" \\\n`;
        if (album) script += `        -metadata album="${album}" \\\n`;
        if (piste) script += `        -metadata track="${piste}" \\\n`;
        if (annee) script += `        -metadata date="${annee}" \\\n`;
        if (genre) script += `        -metadata genre="${genre}" \\\n`;
        if (commentaire) script += `        -metadata comment="${commentaire}" \\\n`;
        
        // Option spéciale pour MP3
        if (extension === 'mp3') {
            script += `        -write_id3v2 1 \\\n`;
        }
        
        script += `        -c copy \\\n`;
        script += `        -y "\$temp_file" 2>/dev/null\n\n`;
        
        script += `if [ $? -eq 0 ]; then\n`;
        script += `    mv "\$temp_file" "\$FILE_PATH"\n`;
        script += `    echo "   ✅ ${name} traité"\n`;
        script += `else\n`;
        script += `    echo "   ❌ Erreur pour ${name}"\n`;
        script += `    rm -f "\$temp_file"\n`;
        script += `fi\n\n`;
    });
    
    script += `echo "=========================================="\n`;
    script += `echo "🎉 Traitement terminé !"\n`;
    script += `echo "📁 Fichiers dans : $SCRIPT_DIR"\n`;
    
    // Télécharger le script
    const blob = new Blob([script], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    ajouterLog('📝 Script généré avec succès', 'success');
    
    // Simuler la progression
    let progressValue = 0;
    const interval = setInterval(() => {
        progressValue += Math.random() * 5 + 2;
        if (progressValue >= 100) {
            progressValue = 100;
            clearInterval(interval);
            document.getElementById('progressText').textContent = '✅ Terminé ! Télécharge le script.';
            ajouterLog('✅ Script prêt !', 'success');
        }
        document.getElementById('progressFill').style.width = progressValue + '%';
        document.getElementById('progressFill').textContent = Math.round(progressValue) + '%';
        document.getElementById('progressText').textContent = `Génération... ${Math.round(progressValue)}%`;
    }, 100);
    
    // Télécharger le script
    const link = document.createElement('a');
    link.href = url;
    link.download = `script_metadonnees_${Date.now()}.sh`;
    link.click();
    
    ajouterLog(`💾 Script téléchargé`, 'info');
    ajouterLog(`📌 Instructions :`, 'info');
    ajouterLog(`   1. Déplace le script dans le dossier de tes fichiers`, 'info');
    ajouterLog(`   2. chmod +x script_metadonnees.sh`, 'info');
    ajouterLog(`   3. ./script_metadonnees.sh`, 'info');
}
// ============================================
// EXPORTER LE SCRIPT
// ============================================

function exporterScript() {
    // Récupérer les données modifiées
    const log = document.getElementById('log');
    log.classList.add('active');
    
    let script = `#!/bin/bash\n\n`;
    script += `# Script généré automatiquement\n`;
    script += `# Date: ${new Date().toLocaleString()}\n\n`;
    
    // ... (même logique que genererScript mais sans l'exécution)
    
    ajouterLog('💾 Script exporté !', 'success');
    genererScript(); // On réutilise la même fonction
}

// ============================================
// JOURNAL
// ============================================

function ajouterLog(message, type = 'info') {
    const logContent = document.getElementById('logContent');
    const div = document.createElement('div');
    div.className = `line ${type}`;
    div.textContent = `[${new Date().toLocaleTimeString()}] ${message}`;
    logContent.appendChild(div);
    logContent.scrollTop = logContent.scrollHeight;
}

// ============================================
// DRAG & DROP NATIF POUR LE RÉARRANGEMENT
// ============================================

let draggedIndex = null;

document.addEventListener('dragstart', (e) => {
    const item = e.target.closest('.file-item');
    if (item) {
        draggedIndex = parseInt(item.dataset.index);
        item.style.opacity = '0.5';
    }
});

document.addEventListener('dragend', (e) => {
    const item = e.target.closest('.file-item');
    if (item) {
        item.style.opacity = '1';
    }
});

document.addEventListener('dragover', (e) => {
    e.preventDefault();
});

document.addEventListener('drop', (e) => {
    e.preventDefault();
    const target = e.target.closest('.file-item');
    if (target && draggedIndex !== null) {
        const targetIndex = parseInt(target.dataset.index);
        if (draggedIndex !== targetIndex) {
            const [removed] = files.splice(draggedIndex, 1);
            files.splice(targetIndex, 0, removed);
            afficherFichiers();
            ajouterLog('📋 Ordre modifié', 'info');
        }
        draggedIndex = null;
    }
});

// Initialisation
console.log('🎬 Éditeur de Métadonnées chargé !');
ajouterLog('🚀 Application prête !', 'info');
