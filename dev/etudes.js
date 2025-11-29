document.addEventListener('DOMContentLoaded', () => {
    // ⚠️ REMPLACER par l'URL de votre Google Sheet (études/formations) publié en CSV
    const csvUrlEtudes = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRow65WkcQYqSf2FTicz3Uzd9tLfvcxn6QgtRlhDCxTacpNo8Gi6Y6ZCmjggVXlF9OQOaDFgHsyWRq7/pub?output=csv'; 

    /**
     * Charge et affiche les données d'études dans le conteneur spécifié.
     * @param {string} listContainerId L'ID du conteneur (ex: 'desktop-etudes-list').
     */
    function loadEtudes(listContainerId) {
        // La fonction csvToJSON est supposée être globale (définie dans csv-utils.js)
        if (typeof csvToJSON !== 'function') {
            console.error('Erreur: La fonction csvToJSON est manquante. Assurez-vous que csv-utils.js est chargé avant etudes.js.');
            return;
        }

        const listContainer = document.getElementById(listContainerId);

        if (!listContainer) return; // Ignore si le conteneur n'existe pas

        // Fonction d'affichage d'erreur
        function displayError(message) {
            listContainer.innerHTML = `<li style="color: red; background-color: #ffe6e6; padding: 10px; border-radius: 5px;">⚠️ ERREUR: ${message}</li>`;
        }

        fetch(csvUrlEtudes)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Échec du chargement (Statut: ${response.status}).`);
                }
                return response.text();
            })
            .then(csvText => {
                const data = csvToJSON(csvText);
                
                if (data.length === 0) {
                    return displayError("Aucune donnée d'études trouvée.");
                }

                // Optionnel: Trier par date ou ID décroissant si votre CSV le permet
                data.sort((a, b) => {
                    // Si vous avez un champ 'annee' ou 'id', utilisez-le pour trier
                    return parseInt(b.id || 0) - parseInt(a.id || 0); 
                });
                
                data.forEach(item => {
                    const listItem = document.createElement('li');
                    
                    // Assurez-vous que votre CSV contient des colonnes comme 'titre', 'etablissement', 'date'
                    listItem.classList.add('etudes-item');
                    listItem.innerHTML = `
                        <div class="item-title">${item.titre || 'Titre manquant'}</div>
                        <div class="item-subtitle">${item.etablissement || ''} 
                            <span class="item-date">${item.date || ''}</span>
                        </div>
                        <p>${item.description || ''}</p>
                    `;
                    listContainer.appendChild(listItem);
                });
            })
            .catch(error => {
                displayError(error.message || "Problème de réseau ou de traitement des données.");
            });
    }

    // Lancement du chargement pour les deux conteneurs
    loadEtudes('desktop-etudes-list');
    loadEtudes('mobile-etudes-list');
});
