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

// Views & Navigation
const navDashboard = document.getElementById('nav-dashboard');
const navProducts = document.getElementById('nav-products');
const viewDashboard = document.getElementById('view-dashboard');
const viewProducts = document.getElementById('view-products');

// Metrics
const metricTotal = document.getElementById('metric-total');
const metricActive = document.getElementById('metric-active');
const metricDraft = document.getElementById('metric-draft');
const metricValue = document.getElementById('metric-value');
let salesChartInstance = null;

// Form fields
const fId = document.getElementById('pId');
const fName = document.getElementById('pName');
const fSeries = document.getElementById('pSeries');
const fPrice = document.getElementById('pPrice');
const fStock = document.getElementById('pStock');
const fStatus = document.getElementById('pStatus');
const fDesc = document.getElementById('pDesc');

let products = [];
let sortState = { col: null, dir: null }; // col: 'name'|'price', dir: 'asc'|'desc'

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
    updateDashboard(); // Update metrics when data changes
  } catch (error) {
    showToast('Lỗi khi tải dữ liệu sản phẩm', 'error');
    console.error(error);
  }
}

/* ── Dashboard Logic ── */
function switchView(viewName) {
  if (viewName === 'dashboard') {
    navDashboard.classList.add('active');
    navProducts.classList.remove('active');
    viewDashboard.classList.remove('view-hidden');
    viewProducts.classList.add('view-hidden');
    renderChart(); // Render chart only when view is visible
  } else {
    navProducts.classList.add('active');
    navDashboard.classList.remove('active');
    viewProducts.classList.remove('view-hidden');
    viewDashboard.classList.add('view-hidden');
  }
}

navDashboard.addEventListener('click', (e) => { e.preventDefault(); switchView('dashboard'); });
navProducts.addEventListener('click', (e) => { e.preventDefault(); switchView('products'); });

function updateDashboard() {
  metricTotal.textContent = products.length;
  metricActive.textContent = products.filter(p => p.status === 'active').length;
  metricDraft.textContent = products.filter(p => p.status === 'draft').length;
  
  const totalVal = products.reduce((sum, p) => sum + (p.price * (p.stock || 0)), 0);
  metricValue.textContent = formatPrice(totalVal) + ' đ';
}

function renderChart() {
  const ctx = document.getElementById('salesChart');
  if (!ctx) return;
  
  if (salesChartInstance) salesChartInstance.destroy(); // destroy old instance to prevent hover glitch
  
  // Sample Data for 7 days
  const labels = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN'];
  const salesData = [12, 19, 15, 25, 22, 30, 28];
  const visitorsData = [45, 60, 55, 80, 75, 120, 110];

  salesChartInstance = new Chart(ctx, {
    type: 'bar',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Sản phẩm đã bán',
          data: salesData,
          backgroundColor: '#c9a96e',
          borderRadius: 4
        },
        {
          label: 'Lượt truy cập',
          data: visitorsData,
          type: 'line',
          borderColor: '#10b981',
          tension: 0.4,
          borderWidth: 2,
          pointBackgroundColor: '#10b981'
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        legend: { labels: { color: '#a1a1aa', font: { family: 'Inter' } } }
      },
      scales: {
        y: {
          beginAtZero: true,
          grid: { color: '#3f3f46' },
          ticks: { color: '#a1a1aa' }
        },
        x: {
          grid: { display: false },
          ticks: { color: '#a1a1aa' }
        }
      }
    }
  });
}

/* ── Sort ── */
window.sortByCol = (col) => {
  if (sortState.col !== col) {
    sortState = { col, dir: 'asc' };
  } else if (sortState.dir === 'asc') {
    sortState.dir = 'desc';
  } else {
    sortState = { col: null, dir: null };
  }

  ['name', 'price'].forEach(c => {
    const btn = document.getElementById(`sort-${c}`);
    const active = sortState.col === c;
    btn.textContent = active ? (sortState.dir === 'asc' ? '↑' : '↓') : '⇅';
    btn.classList.toggle('active', active);
  });

  renderTable();
};

/* ── Render Table ── */
function renderTable() {
  let data = [...products];

  // Filters
  const q = searchInput.value.toLowerCase();
  const st = statusFilter.value;
  if (q) data = data.filter(p => p.name.toLowerCase().includes(q) || p.series.toLowerCase().includes(q));
  if (st) data = data.filter(p => p.status === st);

  // Sort
  if (sortState.col === 'name')
    data.sort((a, b) => sortState.dir === 'asc' ? a.name.localeCompare(b.name, 'vi') : b.name.localeCompare(a.name, 'vi'));
  else if (sortState.col === 'price')
    data.sort((a, b) => sortState.dir === 'asc' ? a.price - b.price : b.price - a.price);

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
