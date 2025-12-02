async function chargerInfosContact() {
    const sectionContact = document.getElementById('contact-info-section');

    try {
        const reponse = await fetch('data/contact-infos.json');
        
        if (!reponse.ok) {
            throw new Error(`Erreur HTTP: ${reponse.status}`);
        }

        const data = await reponse.json();

        let htmlContent = `
            <h2>${data.nom}</h2>
            <p class="titre-cv">${data.titre}</p>
            <ul>
                <li>📧 <a href="mailto:${data.email}">${data.email}</a></li>
                <li>📱 ${data.telephone}</li>
                <li>📍 ${data.ville}</li>
                <li>🔗 <B>LinkedIn :</B> <a href="${data.linkedin}" target="_blank">Profil LinkedIn</a></li>
                <li>🐱 <B>GitHub :</B> <a href="${data.github}" target="_blank">Profil GitHub</a></li>
            </ul>
        `;
        
        if (data.certifications && data.certifications.length > 0) {
            htmlContent += `
                <h3>Certifications Clés</h3>
                <ul class="certifications-list">
            `;
            data.certifications.forEach(cert => {
                htmlContent += `<li>${cert}</li>`;
            });
            htmlContent += `</ul>`;
        }

        sectionContact.innerHTML = htmlContent;

    } catch (erreur) {
        console.error("Erreur lors du chargement des informations de contact:", erreur);
        sectionContact.innerHTML = '<p class="error">Impossible de charger les informations de contact. Veuillez vérifier le fichier data/contact-infos.json.</p>';
    }
}

document.addEventListener('DOMContentLoaded', chargerInfosContact);
