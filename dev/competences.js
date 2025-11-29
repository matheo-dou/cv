// competences.js

document.addEventListener('DOMContentLoaded', () => {
    // 1. Utilisation de l'URL de votre Google Sheet fournie
    const csvUrlCompetences = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtJPv7rSa7Tb7tEamE9OPO4O0XH8ef8qtrfGlOgdJy1G5vJrOGCVfupGN_p9eTayHo_HR-CNZY0AO6/pub?output=csv'; 

    /**
     * Charge et affiche les données de compétences dans le conteneur spécifié.
     * @param {string} listContainerId L'ID du conteneur cible.
     */
    function loadCompetences(listContainerId) {
        const listContainer = document.getElementById(listContainerId);

        // Vérification de la dépendance externe et du conteneur
        if (typeof csvToJSON !== 'function' || !listContainer) {
            if (!listContainer) return; // Si le conteneur n'existe pas, on arrête sans erreur
            console.error('Erreur: csvToJSON est manquant. Assurez-vous que csv-utils.js est chargé avant competences.js.');
            return;
        }

        function displayError(message) {
            listContainer.innerHTML = `<li style="color: red; background-color: #ffe6e6; padding: 10px; border-radius: 5px;">
                ⚠️ ERREUR : ${message}
                <br><small style="color: #666;">Vérifiez l'URL, le format CSV et les noms des en-têtes (ex: id, competence, niveau).</small>
            </li>`;
        }

        fetch(csvUrlCompetences)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Échec du chargement (Statut: ${response.status}).`);
                }
                return response.text();
            })
            .then(csvText => {
                // Utilisation de la fonction globale de csv-utils.js
                const data = csvToJSON(csvText); 

                if (data.length === 0) {
                    return displayError("Aucune donnée de compétence valide n'a été trouvée.");
                }
                
                // Tri par ID décroissant 
                data.sort((a, b) => {
                    return parseInt(b.id || 0) - parseInt(a.id || 0); 
                });

                // Génération du HTML
                data.forEach(item => {
                    const listItem = document.createElement('li');
                    
                    // Assurez-vous que les clés 'competence' et 'niveau' sont bien dans votre CSV
                    // Note : J'ai ajouté 'competence' car votre code original n'utilisait que 'niveau'
                    listItem.classList.add('skill-item');
                    listItem.innerHTML = `
                        <div class="skill-item-content">
                            <span class="item-title">${item.competence || 'Compétence manquante'}</span>
                            <span class="item-level">${item.niveau || ''}</span>
                        </div>
                    `;
                    
                    listContainer.appendChild(listItem);
                });
            })
            .catch(error => {
                displayError(error.message || "Problème général de traitement ou de réseau.");
            });
    }

    // Lancement du chargement pour les conteneurs Desktop et Mobile
    loadCompetences('desktop-competences-list');
    loadCompetences('mobile-competences-list');
});
