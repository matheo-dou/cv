    function csvToJSON(csv) {
        const lines = csv.split('\n');
        // Vérifie qu'il y a au moins une ligne d'en-tête
        if (lines.length < 2) return []; 
        
        const headers = lines[0].split(',');
        const result = [];
        
        for (let i = 1; i < lines.length; i++) {
            if (!lines[i].trim()) continue;
            
            const currentline = lines[i].split(',');
            const obj = {};
            
            // Assurez-vous que les colonnes correspondent
            if (currentline.length < headers.length) continue; 
            
            for (let j = 0; j < headers.length; j++) {
                let key = headers[j].trim().toLowerCase().replace(/['"]+/g, '');
                let value = currentline[j] ? currentline[j].trim().replace(/['"]+/g, '') : '';
                obj[key] = value;
            }
            
            // Ligne de vérification de l'ID : seulement si l'ID est un nombre > 0
            const idNumber = parseInt(obj.id);
            if (isNaN(idNumber) || idNumber > 0) { // S'assure de garder les lignes si l'ID est manquant ou valide
                result.push(obj);
            }
        }
        return result;
    }
