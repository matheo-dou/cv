document.addEventListener('DOMContentLoaded', () => {
    // REMPLACER par l'URL de votre Google Sheet (compétences) publié en CSV
    const csvUrlCompetences = 'URL_VOTRE_GOOGLE_SHEET_COMPETENCES?output=csv'; 

    function loadCompetences(listContainerId) {
        const listContainer = document.getElementById(listContainerId);

        if (!listContainer) return; 

        fetch(csvUrlCompetences)
            .then(response => response.text())
            .then(csvText => {
                const data = csvToJSON(csvText); // Utilise csvToJSON de csv-utils.js
                
                // Exemple de génération de HTML pour les compétences
                data.forEach(item => {
                    const listItem = document.createElement('li');
                    
                    // Assurez-vous que votre CSV contient des colonnes comme 'nom' et 'niveau'
                    listItem.classList.add('competence-item'); 
                    listItem.innerHTML = `
                        <span class="competence-name">${item.nom || 'Compétence'}</span>
                        <span class="competence-level">${item.niveau || 'Non défini'}</span>
                    `;
                    listContainer.appendChild(listItem);
                });
            })
            .catch(error => {
                // Gestion des erreurs
                listContainer.innerHTML = `<li style="color: red;">Erreur de chargement des compétences.</li>`;
            });
    }

    loadCompetences('desktop-competences-list');
    loadCompetences('mobile-competences-list'); 
});
