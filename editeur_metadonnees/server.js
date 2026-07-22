const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');
const multer = require('multer');

const app = express();
const PORT = 3000;

// Middleware
app.use(cors());
app.use(express.json({ limit: '50mb' }));
app.use(express.static('.'));

// ============================================
// CONFIGURATION MULTER (upload)
// ============================================

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const uploadDir = './uploads';
        if (!fs.existsSync(uploadDir)) {
            fs.mkdirSync(uploadDir, { recursive: true });
        }
        cb(null, uploadDir);
    },
    filename: (req, file, cb) => {
        // Garder le nom original
        cb(null, file.originalname);
    }
});

const upload = multer({ 
    storage: storage,
    limits: { fileSize: 1024 * 1024 * 1024 } // 1GB max
});

// ============================================
// ROUTE : UPLOAD
// ============================================

app.post('/upload', upload.array('files'), (req, res) => {
    try {
        const files = req.files.map(file => ({
            originalName: file.originalname,
            path: file.path,
            size: file.size
        }));
        res.json({ success: true, files });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ROUTE : APPLICATION DES MÉTADONNÉES (sur la copie)
// ============================================

app.post('/apply-metadata', async (req, res) => {
    try {
        const { files } = req.body;
        const results = [];

        for (const fileData of files) {
            // Le fichier est dans uploads/
            const uploadDir = './uploads';
            const filePath = path.join(uploadDir, fileData.name);
            
            if (!fs.existsSync(filePath)) {
                results.push({
                    name: fileData.name,
                    success: false,
                    error: `Fichier non trouvé dans uploads/`
                });
                continue;
            }

            const extension = path.extname(fileData.name).substring(1);
            
            // Déterminer le nouveau nom
            const nouveauNom = fileData.nouveauNom || fileData.name.replace(/\.[^/.]+$/, '');
            const nouveauChemin = path.join(uploadDir, `${nouveauNom}.${extension}`);
            
            // Fichier temporaire pour ffmpeg
            const tempPath = filePath + '.new.' + extension;

            try {
                // Construire la commande ffmpeg
                let cmd = `ffmpeg -i "${filePath}"`;
                
                if (fileData.titre) cmd += ` -metadata title="${fileData.titre}"`;
                if (fileData.artiste) cmd += ` -metadata artist="${fileData.artiste}"`;
                if (fileData.album) cmd += ` -metadata album="${fileData.album}"`;
                if (fileData.piste) cmd += ` -metadata track="${fileData.piste}"`;
                if (fileData.annee) cmd += ` -metadata date="${fileData.annee}"`;
                if (fileData.genre) cmd += ` -metadata genre="${fileData.genre}"`;
                if (fileData.commentaire) cmd += ` -metadata comment="${fileData.commentaire}"`;
                
                if (extension === 'mp3') {
                    cmd += ' -write_id3v2 1';
                }
                
                cmd += ` -c copy -y "${tempPath}" 2>&1`;

                console.log(`📝 Traitement: ${fileData.name}`);
                console.log(`   Chemin: ${filePath}`);
                console.log(`   Nouveau nom: ${nouveauNom}.${extension}`);

                await new Promise((resolve, reject) => {
                    exec(cmd, (error, stdout, stderr) => {
                        if (error) {
                            reject(new Error(stderr || error.message));
                        } else {
                            resolve(stdout);
                        }
                    });
                });

                if (fs.existsSync(tempPath)) {
                    // Supprimer l'original (ancienne copie)
                    fs.unlinkSync(filePath);
                    
                    // Renommer le fichier temporaire vers le nouveau nom
                    fs.renameSync(tempPath, nouveauChemin);
                    
                    results.push({
                        name: fileData.name,
                        nouveauNom: `${nouveauNom}.${extension}`,
                        renomme: true,
                        success: true
                    });
                    
                    console.log(`   ✅ Traité et renommé en: ${nouveauNom}.${extension}`);
                } else {
                    throw new Error('Fichier temporaire non créé');
                }

            } catch (error) {
                if (fs.existsSync(tempPath)) {
                    fs.unlinkSync(tempPath);
                }
                results.push({
                    name: fileData.name,
                    success: false,
                    error: error.message
                });
                console.error(`   ❌ Erreur: ${error.message}`);
            }
        }

        res.json({ success: true, results });

    } catch (error) {
        console.error('❌ Erreur:', error);
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// ROUTE : TÉLÉCHARGER UN FICHIER
// ============================================

app.get('/download/:filename', (req, res) => {
    const filename = req.params.filename;
    const filePath = path.join('./uploads', filename);
    
    if (fs.existsSync(filePath)) {
        res.download(filePath);
    } else {
        res.status(404).json({ error: 'Fichier non trouvé' });
    }
});

// ============================================
// ROUTE : LISTER LES FICHIERS
// ============================================

app.get('/files', (req, res) => {
    const uploadDir = './uploads';
    if (!fs.existsSync(uploadDir)) {
        return res.json({ files: [] });
    }
    
    const files = fs.readdirSync(uploadDir).map(file => ({
        name: file,
        path: path.join(uploadDir, file),
        size: fs.statSync(path.join(uploadDir, file)).size
    }));
    
    res.json({ files });
});

// ============================================
// ROUTE : NETTOYER LE DOSSIER UPLOADS
// ============================================

app.delete('/cleanup', (req, res) => {
    try {
        const uploadDir = './uploads';
        if (fs.existsSync(uploadDir)) {
            fs.readdirSync(uploadDir).forEach(file => {
                const filePath = path.join(uploadDir, file);
                fs.unlinkSync(filePath);
            });
        }
        res.json({ success: true });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
});

// ============================================
// DÉMARRAGE
// ============================================

app.listen(PORT, () => {
    console.log(`🚀 Serveur démarré sur http://localhost:${PORT}`);
    console.log(`📁 Dossier d'upload : ./uploads/`);
    console.log(`📝 Les fichiers sources ne sont pas modifiés`);
    console.log(`🔄 Renommage supporté`);
});