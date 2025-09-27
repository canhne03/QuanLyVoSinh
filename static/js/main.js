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

      if (val.toLowerCase() === "phong tang") {
        img.src = "/static/img/phongtang.jpg";
      } else {
        img.src = "/static/img/cap" + val + ".jpg";
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

  // Nút đóng kết quả
  const closeSearchResult = document.createElement("span");
  closeSearchResult.textContent = "X";
  closeSearchResult.style.cursor = "pointer";
  closeSearchResult.style.float = "right";
  closeSearchResult.style.fontWeight = "bold";
  closeSearchResult.onclick = () => {
    searchResultContainer.style.display = "none";
    searchResult.innerHTML = "";
  };
  searchResultContainer.prepend(closeSearchResult);

  // Hàm xác định đường dẫn ảnh màu đai
  function getBeltImage(capbac) {
    if (!capbac) return "/static/img/default.jpg";
    const s = String(capbac).trim().toLowerCase();
    if (s === "phong tang" || s === "phongtang" || s === "phong tặng") return "/static/img/phongtang.jpg";
    if (/^\d+$/.test(s)) return "/static/img/cap" + s + ".jpg";
    return "/static/img/default.jpg";
  }

  const renderStudents = (students) => {
    if (!students || students.length === 0)
      return '<div class="text-muted">Không tìm thấy võ sinh nào.</div>';

    return students.map(s => {
      const beltImg = getBeltImage(s.capbac);
      return `
        <div class="mb-2 p-3 border-bottom" style="text-align:left; margin-left:40px;">
          <p class="mb-1"><strong>Họ và tên:</strong> ${s.hovaten}</p>
          <p class="mb-1"><strong>Mã số:</strong> ${s.vocotruyenid || "-"}</p>
          <p class="mb-1"><strong>Năm sinh:</strong> ${s.namsinh || "-"}</p>
          <p class="mb-1"><strong>Giới tính:</strong> ${s.gioitinh || "-"}</p>
          <p class="mb-1"><strong>Đơn vị:</strong> ${s.donvi || "-"}</p>
          <p class="mb-1"><strong>Cấp bậc:</strong> ${s.capbac || "-"}</p>
          <p class="mb-1"><strong>Trình độ:</strong> ${s.trinhdo || "-"}</p>
          <p class="mb-1"><strong>Màu đai:</strong> <img src="${beltImg}" style="width:100px;height:auto;"></p>
          <p class="mb-1"><strong>Ngày thi:</strong> ${s.ngaydangky || "-"}</p>
          <p class="mb-1"><strong>Thành tích:</strong> ${s.thanhtich || "-"}</p>
        </div>
      `;
    }).join("");
  };

  // Xử lý nút search
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
      searchResultContainer.style.display = "block";
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


document.getElementById("exportBtn").addEventListener("click", () => {
    // đơn giản: mở link trực tiếp
    window.location.href = "/admin/students/export";
});
