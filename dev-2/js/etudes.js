document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('education-section');
    if (!container) {
        console.error("Erreur: Le conteneur '#education-section' est introuvable.");
        return;
    }

    fetch('data/etudes.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau ou fichier non trouvé: ' + response.statusText);
            }
            return response.json();
        })
        .then(educationEntries => {
            
            const reversedEducation = educationEntries.reverse();

            let htmlContent = '';

            reversedEducation.forEach(entry => {
                
                htmlContent += `
                    <div class="education-entry cv-line-block">
                        
                        <h3 class="cv-line">${entry.diplome}</h3>
                        
                        <p class="cv-line education-meta">
                            ${entry.date} | ${entry.etablissement}
                        </p>
                        
                        <ul>
                `;

                entry.details.forEach(detail => {
                    htmlContent += `<li class="cv-line">${detail}</li>`;
                });

                htmlContent += `
                        </ul>
                    </div>
                `;
            });

            container.innerHTML = htmlContent;

        })
        .catch(error => {
            console.error('Erreur lors du traitement des études:', error);
            container.innerHTML = `<p class="cv-line error-message">Erreur de chargement des données. (${error.message})</p>`;
        });
});
