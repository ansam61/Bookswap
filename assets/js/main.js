// BookSwap - client-side simple implementation using localStorage
const LS_KEY = 'bookswap_books_v1';

function loadBooks(){
  const raw = localStorage.getItem(LS_KEY);
  if(!raw) return [];
  try{return JSON.parse(raw)}catch(e){return []}
}

function saveBooks(arr){
  localStorage.setItem(LS_KEY, JSON.stringify(arr));
}

function addBook(book){
  const arr = loadBooks();
  book.id = Date.now().toString();
  arr.unshift(book);
  saveBooks(arr);
  return book;
}

function deleteBook(id){
  let arr = loadBooks();
  arr = arr.filter(b=>b.id!==id);
  saveBooks(arr);
  renderLibrary();
}

function renderLibrary(filter=''){
  const grid = document.getElementById('libraryGrid');
  if(!grid) return;
  const arr = loadBooks();
  const out = arr.filter(b=> (b.title+b.author+b.desc).toLowerCase().includes(filter.toLowerCase()) )
    .map(b=>`
    <div class="card" data-id="${b.id}">
      <img src="${b.cover}" alt="${b.title}">
      <div><strong>${b.title}</strong></div>
      <div class="small">المؤلف: ${b.author}</div>
      <div class="small">${b.category || ''}</div>
      <div style="margin-top:auto;display:flex;gap:8px;justify-content:space-between;align-items:center">
        <button class="btn" onclick="openDetails('${b.id}')">تفاصيل</button>
        <button class="btn secondary" onclick="deleteBook('${b.id}')">حذف</button>
      </div>
    </div>
  `).join('');
  grid.innerHTML = out || '<div class="small">لا توجد كتب بعد — أضف كتابًا من صفحة "أضف كتاب".</div>';
}

function openDetails(id){
  const arr = loadBooks();
  const b = arr.find(x=>x.id===id);
  if(!b) return alert('لم نعثر على الكتاب');
  const modal = document.getElementById('modal');
  modal.querySelector('.modal-title').innerText = b.title;
  modal.querySelector('.modal-body').innerHTML = `
    <img src="${b.cover}" style="width:180px;border-radius:8px;display:block;margin-bottom:10px"/>
    <div><strong>المؤلف:</strong> ${b.author}</div>
    <div style="margin-top:8px">${b.desc}</div>
    <div style="margin-top:8px"><strong>الحالة:</strong> ${b.condition || 'ممتاز'}</div>
  `;
  modal.style.display = 'block';
}

function closeModal(){ document.getElementById('modal').style.display='none' }

function initAddForm(){
  const form = document.getElementById('addForm');
  if(!form) return;
  form.addEventListener('submit', e=>{
    e.preventDefault();
    const data = {
      title: form.title.value || 'بدون عنوان',
      author: form.author.value || 'غير معروف',
      desc: form.desc.value || '',
      cover: form.cover.value || 'assets/images/cover1.svg',
      category: form.category.value || '',
      condition: form.condition.value || ''
    };
    addBook(data);
    renderLibrary();
    form.reset();
    toast('تم إضافة الكتاب بنجاح ✅');
    location.href = 'library.html';
  });
}

function toast(msg){
  const t = document.createElement('div');
  t.innerText = msg;
  t.style.position='fixed';
  t.style.left='20px';
  t.style.bottom='20px';
  t.style.padding='12px 16px';
  t.style.borderRadius='10px';
  t.style.background='rgba(60,20,100,0.9)';
  t.style.color='#fff';
  t.style.zIndex=9999;
  document.body.appendChild(t);
  setTimeout(()=>{t.style.transition='300ms';t.style.opacity=0;setTimeout(()=>t.remove(),300)},2500);
}

document.addEventListener('DOMContentLoaded', ()=>{
  renderLibrary();
  initAddForm();
  const search = document.getElementById('searchInput');
  if(search){
    search.addEventListener('input', ()=> renderLibrary(search.value));
  }
  const closeBtn = document.getElementById('modalClose');
  if(closeBtn) closeBtn.addEventListener('click', closeModal);
});