const contactData = {
    mail: "mon.mail@exemple.com",
    tel: "06 00 00 00 00",
    adresse: "Ville, Pays",
};

function updateContactInfo(elementClass) {
    const elements = document.querySelectorAll('.' + elementClass);
    
    elements.forEach(element => {
        const contactHTML = `
            <p><strong>Mail</strong> : ${contactData.mail}</p>
            <p><strong>Tél</strong> : ${contactData.tel}</p>
            <p><strong>Localisation</strong> : ${contactData.adresse}</p>
        `;
        element.innerHTML = contactHTML;
    });
}
