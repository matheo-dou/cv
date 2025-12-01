document.addEventListener('DOMContentLoaded', () => {
    // URL de votre Google Sheet (Certifications) publiée en CSV
    const csvUrlCertifications = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQPVMO7hsB44WhjM9BwPZlw7FH_fkb2f-tKsI-n6Qk44ekNIxsxgU6xBNCxXhM-psXC_GkHM6exQX9W/pub?output=csv'; 

    /**
     * Charge et affiche les données de certifications dans le conteneur spécifié.
     * @param {string} listContainerId L'ID du conteneur cible.
     */
    function loadCertifications(listContainerId) {
        const listContainer = document.getElementById(listContainerId);

        // Vérification de la dépendance externe et du conteneur
        if (typeof csvToJSON !== 'function' || !listContainer) {
            if (!listContainer) return;
            console.error('Erreur: La fonction csvToJSON est manquante. Assurez-vous que csv-utils.js est chargé avant certifications.js.');
            return;
        }

        // Fonction pour afficher les messages d'erreur
        function displayError(message) {
            listContainer.innerHTML = `<li style="color: red; background-color: #ffe6e6; padding: 10px; border-radius: 5px;">
                ⚠️ ERREUR : ${message}
                <br><small style="color: #666;">Vérifiez l'URL et les en-têtes (id, diplome, date).</small>
            </li>`;
        }

        fetch(csvUrlCertifications)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Échec du chargement (Statut: ${response.status}).`);
                }
                return response.text();
            })
            .then(csvText => {
                let data = csvToJSON(csvText); 

                // --- Filtrage des lignes vides/invalides (Méthode utilisée précédemment) ---
                data = data.filter(item => {
                    const diplomeName = item.diplome;
                    const idNumber = parseInt(item.id);
                    
                    // Garde l'élément si le diplôme existe ET l'ID n'est pas 0
                    const isValid = (diplomeName && diplomeName.trim() !== '');
                    return isValid && (isNaN(idNumber) || idNumber !== 0);
                });
                // --- Fin du Filtrage ---

                if (data.length === 0) {
                    return displayError("Aucun diplôme ou certification valide n'a été trouvé.");
                }
                
                // Tri par ID décroissant 
                data.sort((a, b) => {
                    return parseInt(b.id || 0) - parseInt(a.id || 0); 
                });

                // Génération du HTML
                data.forEach(item => {
                    const listItem = document.createElement('li');
                    
                    listItem.classList.add('certification-item');
                    
                    // Utilisation des clés : diplome, date
                    listItem.innerHTML = `
                        <div class="item-title">
                            ${item.diplome || 'Diplôme manquant'}
                            <span class="item-date">${item.date || ''}</span>
                        </div>
                    `;
                    
                    listContainer.appendChild(listItem);
                });
            })
            .catch(error => {
                displayError(error.message || "Problème général de traitement ou de réseau.");
            });
    }

    // Lancement du chargement pour les deux conteneurs
    loadCertifications('desktop-certifications-list');
    loadCertifications('mobile-certifications-list');
});
