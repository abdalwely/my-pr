// =======================
// تخزين واسترجاع الموظفين والمشاريع من localStorage
// =======================
function getEmployees() {
    return JSON.parse(localStorage.getItem('employees') || '[]');
}
function setEmployees(list) {
    if(!Array.isArray(list)) return;
    localStorage.setItem('employees', JSON.stringify(list));
}
function getProjects() {
    return JSON.parse(localStorage.getItem('projects') || '[]');
}
function setProjects(list) {
    localStorage.setItem('projects', JSON.stringify(list));
}

// تهيئة الفريق الأساسي إذا كان LocalStorage فارغًا
(function initDefaultTeam(){
    const defaultTeam=[
        {name:'عبدالولي بازل',image:'images/abod.jpg',desc:'قائد الفريق بخبرة واسعة في إدارة المشاريع التقنية المعقدة',linkedin:'https://www.instagram.com/ab__bz?igsh=NDZ6YjQ2N3Zwd2J5',github:'https://github.com/abdalwely'},
        {name:'اسامه سيلان',image:'images/٢٠٢٤١٠١١_١٩١٠٣٦.jpg',desc:'متخصص في تطوير الواجهات التفاعلية باستخدام أحدث تقنيات الفرونت اند',linkedin:'',github:''},
        {name:'عزام المراني',image:'images/20250704_173834.jpg',desc:'خبير في تطوير أنظمة الذكاء الاصطناعي والحلول التقنية المتقدمة',linkedin:'',github:''},
        {name:'احمد محرم',image:'images/Screenshot_٢٠٢٤١٠١١-١٩٠٧٤١_Gallery.jpg',desc:'مبدع في تصميم تجارب المستخدم وواجهات التطبيقات العصرية',linkedin:'',github:''},
        {name:'انس المهدي',image:'images/1724159585328.jpg',desc:'محترف في إدارة قواعد البيانات وضمان الأداء العالي للنظم',linkedin:'',github:''}
    ];
    let current= getEmployees();
    if(!Array.isArray(current) || current.length<defaultTeam.length){
        setEmployees(defaultTeam);
    }
})();

// تهيئة مشاريع افتراضية
(function initDefaultProjects(){
    const defaultProjects=[
        {name:'نظام المتجر الإلكتروني', images:['images/store_main.jpg','images/store_1.jpg'], desc:'منصة تجارة إلكترونية متكاملة', link:'#'},
        {name:'تطبيق إدارة المهام', images:['images/tasks_main.jpg','images/tasks_1.jpg','images/tasks_2.jpg'], desc:'تطبيق لإدارة فرق العمل والمهام', link:'#'},
        {name:'موقع ملفات السيرة الذاتية', images:['images/cv_main.jpg'], desc:'موقع لعرض السير الذاتية بشكل جذاب', link:'#'}
    ];
    let current=getProjects();
    if(!Array.isArray(current) || current.length<defaultProjects.length){
        setProjects(defaultProjects);
    }
})();

// عرض الموظفين في لوحة التحكم
function renderEmployees() {
    const employees = getEmployees();
    const list = document.getElementById('employees-list');
    list.innerHTML = '';
    employees.forEach((emp, i) => {
        list.innerHTML += `
        <div class="dashboard-list-item">
            <div style="display:flex;align-items:center;">
                <img src="${emp.image}" alt="${emp.name}">
                <div>
                    <div><b>${emp.name}</b></div>
                    <div style="font-size:12px;color:#555">${emp.desc}</div>
                </div>
            </div>
            <div class="dashboard-actions">
                <button onclick="editEmployee(${i})">تعديل</button>
                <button class="delete" onclick="deleteEmployee(${i})">حذف</button>
            </div>
        </div>`;
    });
}

// عرض المشاريع في لوحة التحكم
function renderProjects() {
    const projects = getProjects();
    const list = document.getElementById('projects-list');
    list.innerHTML = '';
    projects.forEach((prj, i) => {
        list.innerHTML += `
        <div class="dashboard-list-item">
            <div style="display:flex;align-items:center;">
                <img src="${(prj.images && prj.images.length>0)?prj.images[0]: (prj.image||'')}" alt="${prj.name}">
                <div>
                    <div><b>${prj.name}</b></div>
                    <div style="font-size:12px;color:#555">${prj.desc}</div>
                </div>
            </div>
            <div class="dashboard-actions">
                <button onclick="editProject(${i})">تعديل</button>
                <button class="delete" onclick="deleteProject(${i})">حذف</button>
            </div>
        </div>`;
    });
}

// إضافة موظف
const addEmployeeForm = document.getElementById('add-employee-form');
let editEmployeeIndex = null;
addEmployeeForm.onsubmit = function(e){
    e.preventDefault();
    const name = document.getElementById('employee-name').value.trim();
    const image = document.getElementById('employee-image').value.trim();
    const desc = document.getElementById('employee-desc').value.trim();
    const linkedin = document.getElementById('employee-linkedin').value.trim();
    if(!name || !image || !desc) return;
    let employees = getEmployees();
    if(editEmployeeIndex !== null) {
        employees[editEmployeeIndex] = {name, image, desc, linkedin};
        editEmployeeIndex = null;
    } else {
        employees.push({name, image, desc, linkedin});
    }
    setEmployees(employees);
    addEmployeeForm.reset();
    document.getElementById('employee-image-preview').style.display = 'none';
    renderEmployees();
    window.parent.postMessage({type:'updateEmployees'},'*');
    addEmployeeForm.querySelector('button[type="submit"]').textContent = 'إضافة';
};
// رفع صورة الموظف
const employeeImageFile = document.getElementById('employee-image-file');
const employeeImageInput = document.getElementById('employee-image');
const employeeImagePreview = document.getElementById('employee-image-preview');
employeeImageFile.addEventListener('change', function(e){
    const file = e.target.files[0];
    if(file){
        const reader = new FileReader();
        reader.onload = function(evt){
            employeeImageInput.value = evt.target.result;
            employeeImagePreview.src = evt.target.result;
            employeeImagePreview.style.display = 'block';
        };
        reader.readAsDataURL(file);
    }
});

// إضافة مشروع
const addProjectForm = document.getElementById('add-project-form');
let editProjectIndex = null;
let projectImagesArray = [];
const projectImagesFiles = document.getElementById('project-images-files');
const projectImagesPreview = document.getElementById('project-images-preview');

function renderProjectImagesPreview() {
    projectImagesPreview.innerHTML='';
    const grid=document.createElement('div');
    grid.className='project-images-preview-grid';
    projectImagesArray.forEach((img,idx)=>{
        const wrap=document.createElement('div');
        wrap.className='img-wrapper';
        const im=document.createElement('img');
        im.src=img;
        im.alt='صورة مشروع';
        const del=document.createElement('button');
        del.textContent='×';
        del.onclick=()=>{projectImagesArray.splice(idx,1);renderProjectImagesPreview();};
        wrap.appendChild(im);
        wrap.appendChild(del);
        grid.appendChild(wrap);
    });
    projectImagesPreview.appendChild(grid);
}

projectImagesFiles.addEventListener('change', function(e){
    const files = Array.from(e.target.files);
    files.forEach(file => {
        const reader = new FileReader();
        reader.onload = function(evt){
            projectImagesArray.push(evt.target.result);
            renderProjectImagesPreview();
        };
        reader.readAsDataURL(file);
    });
    // Reset input so same file can be reselected if deleted
    e.target.value = '';
});
addProjectForm.onsubmit = function(e){
    e.preventDefault();
    const name = document.getElementById('project-name').value.trim();
    const desc = document.getElementById('project-desc').value.trim();
    const link = document.getElementById('project-link').value.trim();
    if(!name || projectImagesArray.length === 0 || !desc) return;
    let projects = getProjects();
    if(editProjectIndex !== null) {
        projects[editProjectIndex] = {name, images: [...projectImagesArray], desc, link};
        editProjectIndex = null;
    } else {
        projects.push({name, images: [...projectImagesArray], desc, link});
    }
    setProjects(projects);
    addProjectForm.reset();
    projectImagesArray = [];
    renderProjectImagesPreview();
    renderProjects();
    window.parent.postMessage({type:'updateProjects'},'*');
    addProjectForm.querySelector('button[type="submit"]').textContent = 'إضافة';
};
function editProject(i){
    const projects = getProjects();
    const prj = projects[i];
    document.getElementById('project-name').value = prj.name;
    document.getElementById('project-desc').value = prj.desc;
    document.getElementById('project-link').value = prj.link;
    projectImagesArray = prj.images ? [...prj.images] : (prj.image ? [prj.image] : []);
    renderProjectImagesPreview();
    editProjectIndex = i;
    addProjectForm.querySelector('button[type="submit"]').textContent = 'حفظ التعديل';
}
// معاينة مشروع في الموقع الرئيسي
function previewProject(i){
    window.open(`index.html?prj=${i}`,'_blank');
}

// تحديث عرض المشاريع ليعرض أول صورة فقط
function renderProjects() {
    const projects = getProjects();
    const list = document.getElementById('projects-list');
    list.innerHTML = '';
    projects.forEach((prj, i) => {
        let img = (prj.images && prj.images.length > 0) ? prj.images[0] : (prj.image || '');
        list.innerHTML += `
        <div class="dashboard-list-item">
            <div style="display:flex;align-items:center;">
                <img src="${img}" alt="${prj.name}">
                <div>
                    <div><b>${prj.name}</b></div>
                    <div style="font-size:12px;color:#555">${prj.desc}</div>
                </div>
            </div>
            <div class="dashboard-actions">
                <button onclick="editProject(${i})">تعديل</button>
                <button class="delete" onclick="deleteProject(${i})">حذف</button>
            </div>
        </div>`;
    });
}


// حذف موظف
function deleteEmployee(i){
    const employees = getEmployees();
    employees.splice(i,1);
    setEmployees(employees);
    renderEmployees();
    window.parent.postMessage({type:'updateEmployees'},'*');
    addEmployeeForm.reset();
    document.getElementById('employee-image-preview').style.display = 'none';
    editEmployeeIndex = null;
    addEmployeeForm.querySelector('button[type="submit"]').textContent = 'إضافة';
}
// حذف مشروع
function deleteProject(i){
    const projects = getProjects();
    projects.splice(i,1);
    setProjects(projects);
    renderProjects();
    window.parent.postMessage({type:'updateProjects'},'*');
}
// تعديل موظف (مبسط: يملأ النموذج)
function editEmployee(i){
    const employees = getEmployees();
    const emp = employees[i];
    document.getElementById('employee-name').value = emp.name;
    document.getElementById('employee-image').value = emp.image;
    document.getElementById('employee-desc').value = emp.desc;
    document.getElementById('employee-linkedin').value = emp.linkedin;
    document.getElementById('employee-image-preview').src = emp.image;
    document.getElementById('employee-image-preview').style.display = 'block';
    editEmployeeIndex = i;
    addEmployeeForm.querySelector('button[type="submit"]').textContent = 'حفظ التعديل';
}
// تعديل مشروع (مبسط)
function editProject(i){
    const projects = getProjects();
    const prj = projects[i];
    document.getElementById('project-name').value = prj.name;
    document.getElementById('project-image').value = prj.image;
    document.getElementById('project-desc').value = prj.desc;
    document.getElementById('project-link').value = prj.link;
    document.getElementById('project-image-preview').src = prj.image;
    document.getElementById('project-image-preview').style.display = 'block';
    editProjectIndex = i;
    addProjectForm.querySelector('button[type="submit"]').textContent = 'حفظ التعديل';
}

// إعدادات الموقع
const siteSettingsForm = document.getElementById('site-settings-form');
const resetSettingsBtn = document.getElementById('reset-settings-btn');
const defaultSiteSettings = {title:'DevMasters', mainColor:'#1e3a8a', secondaryColor:'#3b82f6', overlayColor:'rgba(30,138,73,0.7)'};
const siteTitleInput = document.getElementById('site-title');
const mainColorInput = document.getElementById('main-color');
const secondaryColorInput = document.getElementById('secondary-color');
const overlayColorInput = document.getElementById('overlay-color');

function getSiteSettings() {
    return JSON.parse(localStorage.getItem('siteSettings') || '{}');
}
function setSiteSettings(settings) {
    localStorage.setItem('siteSettings', JSON.stringify(settings));
}
function fillSiteSettingsForm() {
    const s = getSiteSettings();
    if (s.title) siteTitleInput.value = s.title;
    if (s.mainColor) mainColorInput.value = s.mainColor;
    if (s.secondaryColor) secondaryColorInput.value = s.secondaryColor;
    if (s.overlayColor) overlayColorInput.value = s.overlayColor;
}
function applySiteColors(){
    const s=getSiteSettings();
    if(s.mainColor) document.documentElement.style.setProperty('--main-color',s.mainColor);
    if(s.secondaryColor) document.documentElement.style.setProperty('--secondary-color',s.secondaryColor);
    if(s.overlayColor) document.documentElement.style.setProperty('--overlay-color',s.overlayColor);
}

siteSettingsForm.onsubmit = function(e) {
    e.preventDefault();
    const title = siteTitleInput.value.trim();
    const mainColor = mainColorInput.value;
    const secondaryColor = secondaryColorInput.value;
    const overlayColor = overlayColorInput.value;
    setSiteSettings({title, mainColor, secondaryColor, overlayColor});
    window.parent.postMessage({type:'updateSiteSettings'},'*');
    applySiteColors();
    applySiteColors();
    alert('تم حفظ الإعدادات بنجاح!');
};
fillSiteSettingsForm();
applySiteColors();

// زر استعادة الإعدادات الأصلية
resetSettingsBtn.addEventListener('click',()=>{
    setSiteSettings(defaultSiteSettings);
    fillSiteSettingsForm();
    applySiteColors();
    alert('تمت استعادة الإعدادات الأصلية');
});

// معاينة مباشرة للألوان
mainColorInput.addEventListener('input',()=>{
    document.documentElement.style.setProperty('--main-color',mainColorInput.value);
});
secondaryColorInput.addEventListener('input',()=>{
    document.documentElement.style.setProperty('--secondary-color',secondaryColorInput.value);
});
overlayColorInput.addEventListener('input',()=>{
    document.documentElement.style.setProperty('--overlay-color',overlayColorInput.value);
});
// التهيئة
renderEmployees();
renderProjects();

