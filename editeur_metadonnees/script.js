// ============================================
// ÉDITEUR DE MÉTADONNÉES - Version WebApp
// ============================================

const API_URL = 'http://localhost:3000';
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
    uploaderFichiers(droppedFiles);
});

dropZone.addEventListener('click', () => {
    fileInput.click();
});

fileInput.addEventListener('change', (e) => {
    const selectedFiles = Array.from(e.target.files);
    uploaderFichiers(selectedFiles);
    fileInput.value = '';
});

// ============================================
// UPLOAD DES FICHIERS
// ============================================

async function uploaderFichiers(newFiles) {
    const formData = new FormData();
    newFiles.forEach(file => formData.append('files', file));
    
    try {
        ajouterLog('📤 Upload des fichiers...', 'info');
        
        const response = await fetch(`${API_URL}/upload`, {
            method: 'POST',
            body: formData
        });
        
        const data = await response.json();
        
        if (data.success) {
            data.files.forEach(file => {
                const extension = '.' + file.originalName.split('.').pop().toLowerCase();
                const formats = ['.mp3', '.mp4', '.mkv', '.avi', '.flac', '.wav', '.ogg', '.m4a', '.mov', '.webm'];
                
                if (formats.includes(extension)) {
                    const episode = file.originalName.match(/EP\s*(\d+)/i);
                    const saison = file.originalName.match(/Saison\s*(\d+)|Season\s*(\d+)/i);
                    
                    files.push({
                        name: file.originalName,
                        nouveauNom: '',  // ← Initialisé vide
                        path: file.path,
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
                }
            });
            
            afficherFichiers();
            ajouterLog(`✅ ${data.files.length} fichier(s) uploadé(s)`, 'success');
        }
    } catch (error) {
        ajouterLog(`❌ Erreur d'upload: ${error.message}`, 'error');
    }
}

// ============================================
// AFFICHAGE DE LA LISTE
// ============================================

function afficherFichiers() {
    if (files.length === 0) {
        fileList.innerHTML = '<p class="empty-message">Aucun fichier chargé</p>';
        return;
    }
    
    fileList.innerHTML = files.map((file, index) => {
        // Nom par défaut (sans extension)
        const nomParDefaut = file.nouveauNom || file.name.replace(/\.[^/.]+$/, '');
        
        return `
        <div class="file-item" data-index="${index}">
            <div class="file-header">
                <span class="file-name">${file.name}</span>
                <span class="file-type">${file.type}</span>
                <button class="btn-remove" onclick="supprimerFichier(${index})">✕</button>
            </div>
            <div class="file-size">${formatTaille(file.size)}</div>
            <div class="file-path">📁 ${file.path}</div>
            <div class="meta-grid">
                <!-- RENOMMAGE -->
                <div class="full-width" style="border: 1px solid #e94560; border-radius: 5px; padding: 8px; background: rgba(233, 69, 96, 0.05);">
                    <div class="label" style="color: #e94560;">📝 Nouveau nom (sans extension)</div>
                    <input type="text" value="${nomParDefaut}" 
                           placeholder="Ex: video, musique, episode_1" 
                           onchange="mettreAJour(${index}, 'nouveauNom', this.value)"
                           style="font-weight: bold;">
                    <div style="font-size: 0.7em; color: #888; margin-top: 4px;">
                        Le fichier sera renommé en : ${nomParDefaut}.${file.type.toLowerCase()}
                    </div>
                </div>
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
    `}).join('');
}

// ============================================
// FONCTIONS UTILITAIRES
// ============================================

function mettreAJour(index, champ, valeur) {
    files[index][champ] = valeur;
}

function supprimerFichier(index) {
    const fileName = files[index].name;
    files.splice(index, 1);
    afficherFichiers();
    ajouterLog(`🗑️ Fichier retiré: ${fileName}`, 'info');
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
// APPLICATION DES MÉTADONNÉES
// ============================================

async function appliquerMetadonnees() {
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
    
    ajouterLog('🚀 Application des métadonnées...', 'info');
    
    // Préparer les données
    const data = {
        files: files.map(file => {
            const extension = file.name.split('.').pop();
            const nouveauNom = file.nouveauNom || file.name.replace(/\.[^/.]+$/, '');
            
            return {
                name: file.name,
                path: file.path,
                nouveauNom: nouveauNom,
                extension: extension,
                titre: file.titre || file.name.replace(/\.[^/.]+$/, ''),
                artiste: file.artiste || '',
                album: file.album || '',
                piste: file.piste || '',
                annee: file.annee || '',
                genre: file.genre || '',
                commentaire: file.commentaire || ''
            };
        })
    };
    
    console.log('📤 Envoi des données:', JSON.stringify(data, null, 2));
    
    try {
        const response = await fetch(`${API_URL}/apply-metadata`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(data)
        });
        
        const result = await response.json();
        
        if (result.success) {
            let successCount = 0;
            let errorCount = 0;
            
            result.results.forEach((r, index) => {
                if (r.success) {
                    successCount++;
                    let message = `✅ ${r.name} traité avec succès`;
                    if (r.renomme) {
                        message += ` → renommé en "${r.nouveauNom}"`;
                    }
                    ajouterLog(message, 'success');
                } else {
                    errorCount++;
                    ajouterLog(`❌ Erreur pour ${r.name}: ${r.error}`, 'error');
                }
                
                const progressValue = ((index + 1) / result.results.length) * 100;
                document.getElementById('progressFill').style.width = progressValue + '%';
                document.getElementById('progressFill').textContent = Math.round(progressValue) + '%';
                document.getElementById('progressText').textContent = 
                    `Traitement... ${index + 1}/${result.results.length}`;
            });
            
            document.getElementById('progressText').textContent = 
                `✅ Terminé ! ${successCount} réussi(s), ${errorCount} erreur(s)`;
            ajouterLog(`🎉 Traitement terminé ! ${successCount} réussi(s), ${errorCount} erreur(s)`, 'success');
            
            // Recharger la liste des fichiers pour voir les nouveaux noms
            await chargerListeFichiers();
            
        } else {
            ajouterLog(`❌ Erreur: ${result.error}`, 'error');
        }
    } catch (error) {
        ajouterLog(`❌ Erreur: ${error.message}`, 'error');
        console.error('Erreur détaillée:', error);
    }
}

// ============================================
// CHARGER LA LISTE DES FICHIERS (pour mise à jour)
// ============================================

async function chargerListeFichiers() {
    try {
        const response = await fetch(`${API_URL}/files`);
        const data = await response.json();
        
        // Mettre à jour la liste des fichiers avec les nouveaux noms
        // On garde les métadonnées déjà saisies
        const oldFiles = [...files];
        files.length = 0;
        
        data.files.forEach(file => {
            const existing = oldFiles.find(f => f.name === file.name);
            if (existing) {
                files.push(existing);
            } else {
                // Nouveau fichier (renommé)
                const extension = '.' + file.name.split('.').pop().toLowerCase();
                files.push({
                    name: file.name,
                    nouveauNom: '',
                    path: file.path,
                    size: file.size,
                    type: extension.substring(1).toUpperCase(),
                    episode: '',
                    saison: '',
                    titre: '',
                    artiste: '',
                    album: '',
                    annee: '',
                    genre: '',
                    piste: '',
                    commentaire: ''
                });
            }
        });
        
        afficherFichiers();
    } catch (error) {
        console.error('Erreur lors du chargement de la liste:', error);
    }
}

// ============================================
// NETTOYER LE DOSSIER UPLOADS
// ============================================

async function nettoyerUploads() {
    try {
        const response = await fetch(`${API_URL}/cleanup`, {
            method: 'DELETE'
        });
        const data = await response.json();
        if (data.success) {
            files.length = 0;
            afficherFichiers();
            ajouterLog('🧹 Dossier uploads nettoyé', 'info');
        }
    } catch (error) {
        ajouterLog(`❌ Erreur nettoyage: ${error.message}`, 'error');
    }
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
// INITIALISATION
// ============================================

console.log('🎬 Éditeur de Métadonnées - WebApp chargé !');
ajouterLog('🚀 Application prête !', 'info');
ajouterLog('📌 Dépose des fichiers ou clique pour sélectionner', 'info');
ajouterLog('📝 Les fichiers sont copiés dans uploads/ (source préservée)', 'info');
ajouterLog('🔄 Le renommage est supporté !', 'info');