// main.js
document.addEventListener("DOMContentLoaded", () => {
  // ==========================
  // Navbar collapse auto hide
  // ==========================
  document.addEventListener('click', function(event) {
    const navbars = document.querySelectorAll('.navbar-collapse');
    navbars.forEach(navbar => {
      if (navbar.classList.contains('show')) {
        const toggleButton = document.querySelector(`[data-bs-target="#${navbar.id}"]`);
        if (!navbar.contains(event.target) && (!toggleButton || !toggleButton.contains(event.target))) {
          const bsCollapse = bootstrap.Collapse.getInstance(navbar);
          if (bsCollapse) {
            bsCollapse.hide();
          } else {
            new bootstrap.Collapse(navbar).hide();
          }
        }
      }
    });
  });

  // ==========================
  // Belt image change
  // ==========================
  document.querySelectorAll(".capbac-select").forEach(select => {
    select.addEventListener("change", (e) => {
      const val = e.target.value;
      const targetId = e.target.dataset.target;
      const img = document.getElementById("belt-" + targetId);

      if (val === "phong tang") {
        img.src = "/static/phongtang.jpg";
      } else {
        img.src = "/static/cap" + val + ".jpg";
      }
    });
  });

  // ==========================
  // Search võ sinh
  // ==========================
  const searchBtn = document.getElementById("searchBtn");
  const searchInput = document.getElementById("searchInput");
  const searchResultContainer = document.getElementById("searchResultContainer");
  const searchResult = document.getElementById("searchResult");

  // Nút đóng toàn bộ kết quả
  const closeSearchResult = document.createElement("span");
  closeSearchResult.textContent = "X";
  closeSearchResult.style.cursor = "pointer";
  closeSearchResult.style.float = "right";
  closeSearchResult.style.fontWeight = "bold";
  closeSearchResult.onclick = () => {
    searchResultContainer.style.display = "none";
    searchResult.innerHTML = "";
  };
  // Thêm nút đóng vào container
  searchResultContainer.prepend(closeSearchResult);

const renderStudents = (students) => {
  if (!students || students.length === 0)
    return '<div class="text-muted">Không tìm thấy võ sinh nào.</div>';

  return students.map(s => {
const imgSrc = s.maudai ? s.maudai : '/static/img/default.png';
    return `
      <div class="mb-2 p-3 border-bottom" style="text-align:left; margin-left:40px;">
        <h5 class="mb-1"><strong>Họ và tên:</strong> ${s.hovaten } <small class="text-muted">(${s.vocotruyenid})</small></h5>
        <p class="mb-1"><strong>Năm sinh:</strong> ${s.namsinh || "-"}</p>
        <p class="mb-1"><strong>Giới tính:</strong> ${s.gioitinh || "-"}</p>
        <p class="mb-1"><strong>Đơn vị:</strong> ${s.donvi || "-"}</p>
        <p class="mb-1"><strong>Cấp bậc:</strong> ${s.capbac || "-"}</p>
        <p class="mb-1"><strong>Ngày thi:</strong> ${s.ngaydangky || "-"}</small></p>
        <p class="mb-1"><strong>Trình độ:</strong> ${s.trinhdo || "-"}</p>
        <p class="mb-1"><strong>Thành tích:</strong> ${s.thanhtich || "-"}</p>
        <p class="mb-1">
          <strong>Màu đai:</strong>
          <img src="${imgSrc}" alt="Màu đai" style="height:24px; vertical-align:middle; margin-left:4px;">
        </p>
      </div>
    `;
  }).join("");
};


  // Xử lý nút Tra cứu
  searchBtn.addEventListener("click", async () => {
    const q = searchInput.value.trim();

    if (!q) {
      searchResultContainer.style.display = "block";
      searchResult.innerHTML = '<div class="text-danger">Vui lòng nhập tên hoặc mã số!</div>';
      return;
    }

    try {
      const res = await fetch(`/search/student?q=${encodeURIComponent(q)}`);
      const data = await res.json();

      searchResultContainer.style.display = "block"; // hiển thị container
      if (!data.success) {
        searchResult.innerHTML = `<div class="text-danger">${data.error}</div>`;
        return;
      }

      searchResult.innerHTML = renderStudents(data.students);

    } catch (err) {
      searchResultContainer.style.display = "block";
      searchResult.innerHTML = '<div class="text-danger">Lỗi kết nối server!</div>';
    }
  });
});

