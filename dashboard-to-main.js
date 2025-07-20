// هذا الملف يحقن الموظفين والمشاريع وإعدادات الموقع من localStorage إلى الصفحة الرئيسية

function injectSiteSettings() {
    const settings = JSON.parse(localStorage.getItem('siteSettings') || '{}');

    // العنوان الرئيسي
    if (settings.title) {
        const heroTitle = document.querySelector('.hero-title .highlight');
        if (heroTitle) heroTitle.textContent = settings.title;
    }

    // الألوان
    if (settings.mainColor || settings.secondaryColor) {
        const root = document.documentElement;

        if (settings.mainColor) {
            root.style.setProperty('--main-color', settings.mainColor);

            document.querySelectorAll('.navbar, .section-title').forEach(el => {
                el.style.color = settings.mainColor;
            });
            document.querySelectorAll('.btn-primary').forEach(el => {
                el.style.background = settings.mainColor;
            });
        }

        if (settings.overlayColor) {
            root.style.setProperty('--overlay-color', settings.overlayColor);
        }

        if (settings.secondaryColor) {
            root.style.setProperty('--secondary-color', settings.secondaryColor);
            document.querySelectorAll('.btn-secondary').forEach(el => {
                el.style.background = settings.secondaryColor;
            });
        }
    }
}

function injectEmployees() {
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const teamGrid = document.querySelector('.team-grid');
    if (!teamGrid) return;

    // حدّث أو أنشئ بطاقات حسب ترتيب المصفوفة
    employees.forEach((emp, idx) => {
        let card = teamGrid.querySelector(`.team-card[data-emp-index="${idx}"]`);
        if (!card) {
            card = document.createElement('div');
            card.className = 'team-card';
            card.dataset.dynamic = 'true';
            card.dataset.empIndex = idx;
            teamGrid.appendChild(card);
        }
        card.innerHTML = `
            <div class="team-image">
                <img src="${emp.image}" alt="${emp.name}">
                <div class="team-overlay">
                    <div class="social-links">
                        ${emp.linkedin ? `<a href="${emp.linkedin}" class="social-link"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${emp.github ? `<a href="${emp.github}" class="social-link"><i class="fab fa-github"></i></a>` : ''}
                        ${emp.twitter ? `<a href="${emp.twitter}" class="social-link"><i class="fab fa-twitter"></i></a>` : ''}
                        ${emp.email ? `<a href="mailto:${emp.email}" class="social-link"><i class="fas fa-envelope"></i></a>` : ''}
                    </div>
                </div>
            </div>
            <div class="team-info">
                <h3>${emp.name}</h3>
                <p class="role">${emp.role || ''}</p>
                <p class="description">${emp.desc || ''}</p>
            </div>`;
    });

    // احذف البطاقات الزائدة إن وُجدت
    teamGrid.querySelectorAll('.team-card[data-dynamic="true"]').forEach(card => {
        if (parseInt(card.dataset.empIndex, 10) >= employees.length) card.remove();
    });
}

function injectProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    projects.forEach((prj, idx) => {
        let card = projectsGrid.querySelector(`.project-card[data-proj-index="${idx}"]`);
        if (!card) {
            card = document.createElement('div');
            card.className = 'project-card';
            card.dataset.dynamic = 'true';
            card.dataset.projIndex = idx;
            projectsGrid.appendChild(card);
        }
        const images = Array.isArray(prj.images) ? prj.images : (prj.image ? [prj.image] : []);
        const mainImg = images[0] || '';
        const previewBar = images.length > 1 ? `<div class='project-images-bar' style='display:flex;gap:4px;margin-top:6px;'>${images.slice(1).map(img => `<img src='${img}' style='width:32px;height:32px;object-fit:cover;border-radius:6px;border:1px solid #ccc;'>`).join('')}</div>` : '';

        card.innerHTML = `
            <div class="project-image">
                <img src="${mainImg}" alt="${prj.name}">
                <div class="project-overlay">
                    <div class="project-actions">
                        ${prj.link ? `<a href="${prj.link}" class="btn btn-primary" target="_blank">زيارة المشروع</a>` : ''}
                    </div>
                </div>
                ${previewBar}
            </div>
            <div class="project-info">
                <h3>${prj.name}</h3>
                <p class="description">${prj.desc}</p>
            </div>`;
    });

    // احذف البطاقات الزائدة إن وُجدت
    projectsGrid.querySelectorAll('.project-card[data-dynamic="true"]').forEach(card => {
        if (parseInt(card.dataset.projIndex, 10) >= projects.length) card.remove();
    });
}
    const employees = JSON.parse(localStorage.getItem('employees') || '[]');
    const teamGrid = document.querySelector('.team-grid');
    if (!teamGrid) return;

    // إزالة العناصر الديناميكية فقط للحفاظ على العناصر الأصلية
    teamGrid.querySelectorAll('.team-card[data-dynamic="true"]').forEach(e => e.remove());

    employees.forEach(emp => {
        const existingCard = [...teamGrid.querySelectorAll('.team-card')]
            .find(c => c.querySelector('h3') && c.querySelector('h3').textContent.trim() === emp.name.trim());

        let card;
        if (existingCard) {
            card = existingCard;
            card.innerHTML = '';
        } else {
            card = document.createElement('div');
            card.className = 'team-card';
            card.setAttribute('data-dynamic', 'true');
            teamGrid.appendChild(card);
        }

        card.innerHTML = `
            <div class="team-image">
                <img src="${emp.image}" alt="${emp.name}">
                <div class="team-overlay">
                    <div class="social-links">
                        ${emp.linkedin ? `<a href="${emp.linkedin}" class="social-link"><i class="fab fa-linkedin"></i></a>` : ''}
                        ${emp.github ? `<a href="${emp.github}" class="social-link"><i class="fab fa-github"></i></a>` : ''}
                        ${emp.twitter ? `<a href="${emp.twitter}" class="social-link"><i class="fab fa-twitter"></i></a>` : ''}
                        ${emp.email ? `<a href="mailto:${emp.email}" class="social-link"><i class="fas fa-envelope"></i></a>` : ''}
                    </div>
                </div>
            </div>
            <div class="team-info">
                <h3>${emp.name}</h3>
                <p class="role">${emp.role || 'موظف جديد'}</p>
                <p class="description">${emp.desc || ''}</p>
            </div>
        `;
    });


function injectProjects() {
    const projects = JSON.parse(localStorage.getItem('projects') || '[]');
    const projectsGrid = document.querySelector('.projects-grid');
    if (!projectsGrid) return;

    // إزالة العناصر الديناميكية فقط للحفاظ على المشاريع الأصلية المدمجة في HTML
    projectsGrid.querySelectorAll('.project-card[data-dynamic="true"]').forEach(e => e.remove());

    projects.forEach(prj => {
        const existing = [...projectsGrid.querySelectorAll('.project-card')]
            .find(c => c.querySelector('h3') && c.querySelector('h3').textContent.trim() === prj.name.trim());

        let card;
        if (existing) {
            card = existing;
            card.innerHTML = '';
        } else {
            card = document.createElement('div');
            card.className = 'project-card';
            card.setAttribute('data-dynamic', 'true');
            projectsGrid.appendChild(card);
        }

        let images = prj.images && Array.isArray(prj.images) ? prj.images : (prj.image ? [prj.image] : []);
        let mainImg = images.length ? images[0] : '';
        let previewBar = '';

        if (images.length > 1) {
            previewBar = `<div class='project-images-bar' style='display:flex;gap:4px;margin-top:6px;'>` +
                images.slice(1).map(img => `<img src='${img}' style='width:32px;height:32px;object-fit:cover;border-radius:6px;border:1px solid #ccc;'>`).join('') +
                `</div>`;
        }

        card.innerHTML = `
            <div class="project-image">
                <img src="${mainImg}" alt="${prj.name}">
                <div class="project-overlay">
                    <div class="project-actions">
                        ${prj.link ? `<a href="${prj.link}" class="btn btn-primary" target="_blank">زيارة المشروع</a>` : ''}
                    </div>
                </div>
                ${previewBar}
            </div>
            <div class="project-info">
                <h3>${prj.name}</h3>
                <p class="description">${prj.desc}</p>
            </div>
        `;
    });
}

// مراقبة التغييرات من لوحة التحكم
window.addEventListener('storage', function (e) {
    if (e.key === 'employees') injectEmployees();
    if (e.key === 'projects') injectProjects();
    if (e.key === 'siteSettings') injectSiteSettings();
});

// استقبال postMessage من لوحة التحكم (حفظ الإعدادات)
window.addEventListener('message', function (e) {
    if (e.data && e.data.type === 'updateSiteSettings') injectSiteSettings();
    if (e.data && e.data.type === 'updateEmployees') injectEmployees();
    if (e.data && e.data.type === 'updateProjects') injectProjects();
});

// تحديث فوري عند العودة من لوحة التحكم
window.addEventListener('focus', () => {
    injectSiteSettings();
    injectEmployees();
    injectProjects();
});

// استدعاء أولي
injectSiteSettings();
injectEmployees();
injectProjects();
