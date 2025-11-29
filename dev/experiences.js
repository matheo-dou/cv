document.addEventListener('DOMContentLoaded', () => {
    // URL de votre Google Sheet en mode PUBLICATION (.csv)
    const csvUrl = 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRlSc6vx6ZK0DHSEPw8bRr3a8KDHRwOQhFLB7njz5VxP2EgopqJY39YGhoFqfh83kwZNZ4Ml4wuYDIY/pub?output=csv';

    // Fonction pour afficher les expériences dans un conteneur donné
    function loadExperiences(listContainerId) {
        const listContainer = document.getElementById(listContainerId);

        if (!listContainer) {
            console.error(`Conteneur non trouvé avec l'ID : ${listContainerId}`);
            return;
        }

        function displayError(message) {
            listContainer.innerHTML = `<li style="color: red; background-color: #ffe6e6; padding: 10px; border-radius: 5px;">
                ⚠️ ERREUR : ${message}
                <br><small style="color: #666;">Vérifiez l'URL de publication Google Sheets et les noms des colonnes (id, poste, date, etc.).</small>
            </li>`;
         }

        fetch(csvUrl)
            .then(response => {
                if (!response.ok) {
                    throw new Error(`Échec du chargement (Statut: ${response.status}). Vérifiez l'URL de publication.`);
                }
                return response.text();
            })
            .then(csvText => {
                // Ligne cruciale : csvToJSON est maintenant une fonction globale
                // (définie dans csv-utils.js et incluse dans le HTML avant celui-ci)
                const data = csvToJSON(csvText); 

                if (data.length === 0) {
                    return displayError("Aucune donnée d'expérience valide n'a été trouvée.");
                }
                
                // Tri par ID décroissant
                data.sort((a, b) => {
                    return parseInt(b.id || 0) - parseInt(a.id || 0); 
                });

                // Génération du HTML
                data.forEach(item => {
                    const listItem = document.createElement('li');
                    
                    let cleanDescription = item.description || '';
                    
                    // Remplacement des <br> pour un format paragraphe si nécessaire (basé sur votre script)
                    cleanDescription = cleanDescription.replace(/<br\s*\/?>/gi, '</p><p>');

                    if (!cleanDescription.startsWith('<p>')) {
                        cleanDescription = '<p>' + cleanDescription;
                    }
                    if (!cleanDescription.endsWith('</p>')) {
                        cleanDescription = cleanDescription + '</p>';
                    }
                    
                    listItem.classList.add('experience-item'); // Pour styliser en CSS
                    listItem.innerHTML = `
                        <div class="item-title">${item.poste || 'Titre manquant'}<span class="item-date">${item.date || ''}</span></div>
                        <div class="item-subtitle">${item.entreprise || ''}</div>
                        <div class="item-description-container">
                            ${cleanDescription}
                        </div>
                    `;
                    
                    // Assurez-vous que c'est une liste si vous utilisez <li>
                    if (listContainer.tagName !== 'UL' && listContainer.tagName !== 'OL') {
                        listContainer.innerHTML += listItem.outerHTML; // Ajout en tant qu'élément si ce n'est pas une liste
                    } else {
                        listContainer.appendChild(listItem); // Ajout standard pour une liste
                    }
                });
            })
            .catch(error => {
                displayError(error.message || "Problème général de traitement ou de réseau.");
            });
        
        // Supprimez tout le bloc de code csvToJSON ici !
    }

    // Lance le chargement pour les deux conteneurs (si ils existent)
    loadExperiences('desktop-experience-list');
    loadExperiences('mobile-experience-list');
});
