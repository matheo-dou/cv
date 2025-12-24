document.addEventListener('DOMContentLoaded', () => {
    const config = {
        experiences: { json: 'datas/experiences.json', csv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRlSc6vx6ZK0DHSEPw8bRr3a8KDHRwOQhFLB7njw5VxP2EgopqJY39YGhoFqfh83kwZNZ4Ml4wuYDIY/pub?output=csv', ids: ['desktop-experience-list', 'mobile-experience-list'] },
        competences: { json: 'datas/competences.json', csv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRtJPv7rSa7Tb7tEamE9OPO4O0XH8ef8qtrfGlOgdJy1G5vJrOGCVfupGN_p9eTayHo_HR-CNZY0AO6/pub?output=csv', ids: ['desktop-competences-list', 'mobile-competences-list'] },
        certifications: { json: 'datas/certifications.json', csv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vQPVMO7hsB44WhjM9BwPZlw7FH_fkb2f-tKsI-n6Qk44ekNIxsxgU6xBNCxXhM-psXC_GkHM6exQX9W/pub?output=csv', ids: ['desktop-certifications-list', 'mobile-certifications-list'] },
        etudes: { json: 'datas/etudes.json', csv: 'https://docs.google.com/spreadsheets/d/e/2PACX-1vRow65WkcQYqSf2FTicz3Uzd9tLfvcxn6QgtRlhDCxTacpNo8Gi6Y6ZCmjggVXlF9OQOaDFgHsyWRq7/pub?output=csv', ids: ['desktop-etudes-list', 'mobile-etudes-list'] }
    };

    async function init() {
        for (const [key, section] of Object.entries(config)) {
            try {
                let response = await fetch(section.json);
                let data = response.ok ? await response.json() : [];

                if (data.length === 0) {
                    const csvResp = await fetch(section.csv);
                    data = csvToJSON(await csvResp.text());
                }

                data = data.filter(item => item.id && parseInt(item.id) !== 0);
                data.sort((a, b) => parseInt(b.id || 0) - parseInt(a.id || 0));

                section.ids.forEach(id => render(key, data, document.getElementById(id)));
            } catch (e) { console.error(`Erreur ${key}:`, e); }
        }
    }

    function render(type, data, container) {
        if (!container) return;
        container.innerHTML = data.map(item => {
            if (type === 'experiences') return `<li class="experience-item"><div class="item-title">${item.poste} <span class="item-date">${item.date}</span></div><div class="item-subtitle">${item.entreprise}</div><div class="item-description-container">${formatDesc(item.description)}</div></li>`;
            if (type === 'competences') return `<li class="skill-item"><div class="skill-item-content"><span class="item-title">${item.competence}</span> <span class="item-level">${item.niveau}</span></div></li>`;
            if (type === 'certifications') return `<li class="certification-item"><div class="item-title">${item.diplome} <span class="item-date">${item.date}</span></div></li>`;
            if (type === 'etudes') return `<li class="etudes-item"><div class="item-title">${item.diplome} <span class="item-date">${item.date}</span></div><div class="item-date">${item.etablissement}</div><p>${item.description || ''}</p></li>`;
        }).join('');
    }

    function formatDesc(d) {
        let res = (d || '').replace(/<br\s*\/?>/gi, '</p><p>');
        return res.startsWith('<p>') ? res : `<p>${res}</p>`;
    }

    init();
});
                                                               
