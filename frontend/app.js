/* ==========================================
   NŌVA ADMIN – APP.JS
   ========================================== */

const API_BASE = 'http://localhost:3000/api';

/* ── UI Elements ── */
const tableBody = document.getElementById('tableBody');
const searchInput = document.getElementById('searchInput');
const statusFilter = document.getElementById('statusFilter');

const modal = document.getElementById('productModal');
const overlay = document.getElementById('productModal'); // both point to same wrapper overlay
const form = document.getElementById('productForm');
const modalTitle = document.getElementById('modalTitle');

// Form fields
const fId = document.getElementById('pId');
const fName = document.getElementById('pName');
const fSeries = document.getElementById('pSeries');
const fPrice = document.getElementById('pPrice');
const fStock = document.getElementById('pStock');
const fStatus = document.getElementById('pStatus');
const fDesc = document.getElementById('pDesc');

let products = [];
let sortOrder = null; // null | 'asc' | 'desc'

/* ── Toast Notification ── */
function showToast(message, type = 'success') {
  const toast = document.createElement('div');
  toast.className = `toast ${type}`;
  toast.innerHTML = `
    <span>${type === 'success' ? '✅' : '❌'}</span>
    <span>${message}</span>
  `;
  document.getElementById('toastStack').appendChild(toast);
  setTimeout(() => {
    toast.classList.add('fade-out');
    setTimeout(() => toast.remove(), 300);
  }, 3000);
}

/* ── Formatting ── */
const formatPrice = (v) => new Intl.NumberFormat('vi-VN').format(v);

/* ── Fetch Data ── */
async function fetchProducts() {
  try {
    const res = await fetch(`${API_BASE}/products`);
    if (!res.ok) throw new Error('Network response was not ok');
    products = await res.json();
    renderTable();
  } catch (error) {
    showToast('Lỗi khi tải dữ liệu sản phẩm', 'error');
    console.error(error);
  }
}

/* ── Render Table ── */
/* ── Sort ── */
window.sortByName = () => {
  if (sortOrder === null) sortOrder = 'asc';
  else if (sortOrder === 'asc') sortOrder = 'desc';
  else sortOrder = null;

  const btn = document.getElementById('sortBtn');
  btn.textContent = sortOrder === 'asc' ? '↑' : sortOrder === 'desc' ? '↓' : '⇅';
  btn.classList.toggle('active', sortOrder !== null);
  renderTable();
};

function renderTable() {
  let data = [...products];

  // Filters
  const q = searchInput.value.toLowerCase();
  const st = statusFilter.value;
  if (q) data = data.filter(p => p.name.toLowerCase().includes(q) || p.series.toLowerCase().includes(q));
  if (st) data = data.filter(p => p.status === st);

  // Sort
  if (sortOrder === 'asc') data.sort((a, b) => a.name.localeCompare(b.name, 'vi'));
  else if (sortOrder === 'desc') data.sort((a, b) => b.name.localeCompare(a.name, 'vi'));

  if (data.length === 0) {
    tableBody.innerHTML = `<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-muted)">Không tìm thấy sản phẩm.</td></tr>`;
    return;
  }

  tableBody.innerHTML = data.map(p => `
    <tr>
      <td style="color:var(--text-muted)">#${p.id}</td>
      <td>
        <div class="td-product-info">
          <span class="prod-name">${p.name}</span>
          <span class="prod-series">${p.series}</span>
        </div>
      </td>
      <td style="font-weight:600;color:var(--primary)">${formatPrice(p.price)}</td>
      <td>${p.stock}</td>
      <td>
        <span class="badge ${p.status === 'active' ? 'active' : 'draft'}">
          ${p.status === 'active' ? 'Đang bán' : 'Bản nháp'}
        </span>
      </td>
      <td style="text-align:right">
        <button class="icon-btn" onclick="editProduct(${p.id})" title="Sửa">✏️</button>
        <button class="icon-btn danger" onclick="deleteProduct(${p.id})" title="Xóa">🗑</button>
      </td>
    </tr>
  `).join('');
}

// Re-render on input
searchInput.addEventListener('input', renderTable);
statusFilter.addEventListener('change', renderTable);

/* ── Modal Logic ── */
document.getElementById('addBtn').addEventListener('click', () => {
  modalTitle.textContent = 'Thêm Sản Phẩm';
  form.reset();
  fId.value = '';
  fStatus.value = 'active';
  fStock.value = '0';
  overlay.classList.add('active');
});

const closeModal = () => overlay.classList.remove('active');
document.getElementById('closeModalBtn').addEventListener('click', closeModal);
document.getElementById('cancelBtn').addEventListener('click', closeModal);

window.editProduct = (id) => {
  const p = products.find(x => x.id === id);
  if (!p) return;
  modalTitle.textContent = 'Sửa Sản Phẩm';
  fId.value = p.id;
  fName.value = p.name;
  fSeries.value = p.series;
  fPrice.value = p.price;
  fStock.value = p.stock;
  fStatus.value = p.status;
  fDesc.value = p.description || '';
  overlay.classList.add('active');
};

/* ── Delete Logic ── */
window.deleteProduct = async (id) => {
  if (!confirm('Bạn có chắc chắn muốn xóa sản phẩm này?')) return;
  try {
    const res = await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
    if (!res.ok) throw new Error('Failed to delete');
    showToast('Xóa sản phẩm thành công');
    await fetchProducts();
  } catch (error) {
    showToast('Lỗi khi xóa sản phẩm', 'error');
  }
};

/* ── Form Save Logic ── */
form.addEventListener('submit', async (e) => {
  e.preventDefault();
  
  const pData = {
    name: fName.value.trim(),
    series: fSeries.value.trim(),
    price: parseInt(fPrice.value) || 0,
    stock: parseInt(fStock.value) || 0,
    status: fStatus.value,
    description: fDesc.value.trim()
  };

  const id = fId.value;
  const method = id ? 'PUT' : 'POST';
  const url = id ? `${API_BASE}/products/${id}` : `${API_BASE}/products`;

  try {
    const res = await fetch(url, {
      method,
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pData)
    });
    
    if (!res.ok) throw new Error('Request failed');
    
    showToast(id ? 'Cập nhật thành công!' : 'Thêm sản phẩm thành công!');
    closeModal();
    await fetchProducts();
  } catch (error) {
    showToast('Có lỗi xảy ra', 'error');
  }
});

/* ── Initialization ── */
fetchProducts();
