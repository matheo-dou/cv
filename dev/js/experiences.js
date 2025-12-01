document.addEventListener('DOMContentLoaded', () => {
    const container = document.getElementById('experiences-section');
    if (!container) {
        console.error("Erreur: Le conteneur '#experiences-section' est introuvable.");
        return;
    }

    fetch('data/experiences.json') 
        .then(response => {
            if (!response.ok) {
                throw new Error('Erreur de réseau ou fichier non trouvé: ' + response.statusText);
            }
            return response.json();
        })
        .then(experiences => {
            
            const reversedExperiences = experiences.reverse();

            let htmlContent = '';

            reversedExperiences.forEach(experience => {

                htmlContent += `
                    <div class="experience-entry cv-line-block">
                        
                        <h3 class="cv-line">${experience.title}</h3>
                        
                        <p class="cv-line experience-meta">
                            ${experience.date} | ${experience.company} (${experience.location})
                        </p>
                        
                        <ul>
                `;

                experience.details.forEach(detail => {
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
            console.error('Erreur lors du traitement des expériences:', error);
            container.innerHTML = `<p class="cv-line error-message">Erreur de chargement des données. (${error.message})</p>`;
        });
});
