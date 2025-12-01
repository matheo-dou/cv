// Fonction asynchrone pour charger et afficher les infos de contact
async function chargerInfosContact() {
    const sectionContact = document.getElementById('contact-info-section');

    try {
        // 1. Charger les données du fichier JSON
        const reponse = await fetch('data/contact-infos.json');
        
        // Vérifier si la réponse est OK (code 200)
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP: ${reponse.status}`);
        }

        const data = await reponse.json();

        // 2. Construire le contenu HTML
        let htmlContent = `
            <h2>${data.nom}</h2>
            <p class="titre-cv">${data.titre}</p>
            <ul>
                <li>📧 <a href="mailto:${data.email}">${data.email}</a></li>
                <li>📱 ${data.telephone}</li>
                <li>📍 ${data.ville}</li>
                <li>🔗 **LinkedIn:** <a href="${data.linkedin}" target="_blank">Profil LinkedIn</a></li>
                <li>🐱 **GitHub:** <a href="${data.github}" target="_blank">Profil GitHub</a></li>
            </ul>
        `;
        
        // Ajouter les certifications (liste dynamique)
        if (data.certifications && data.certifications.length > 0) {
            htmlContent += `
                <h3>Certifications Clés</h3>
                <ul class="certifications-list">
            `;
            data.certifications.forEach(cert => {
                htmlContent += `<li>🛡️ ${cert}</li>`;
            });
            htmlContent += `</ul>`;
        }


        // 3. Insérer le contenu dans la section HTML
        sectionContact.innerHTML = htmlContent;

    } catch (erreur) {
        console.error("Erreur lors du chargement des informations de contact:", erreur);
        sectionContact.innerHTML = '<p class="error">Impossible de charger les informations de contact. Veuillez vérifier le fichier data/contact-infos.json.</p>';
    }
}

// Appeler la fonction au chargement de la page
document.addEventListener('DOMContentLoaded', chargerInfosContact);
