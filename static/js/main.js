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

  // Hàm render danh sách võ sinh
  const renderStudents = (students) => {
    if (!students || students.length === 0)
      return '<div class="text-muted">Không tìm thấy võ sinh nào.</div>';

    return students.map(s => `
      <div class="mb-2 p-2 border-bottom d-flex align-items-start">
        <div style="flex:1; display:flex;">
          <div class="ms-2">
            <h5 class="mb-1">${s.hovaten} <small class="text-muted">(${s.vocotruyenid})</small></h5>
            <p class="mb-1"><strong>Năm sinh:</strong> ${s.namsinh || "-"} | <strong>Giới tính:</strong> ${s.gioitinh || "-"}</p>
            <p class="mb-1"><strong>Đơn vị:</strong> ${s.donvi || "-"}</p>
            <p class="mb-1"><strong>Cấp bậc:</strong> ${s.capbac || "-"} | <strong>Trình độ:</strong> ${s.trinhdo || "-"}</p>
            <p class="mb-1"><strong>Thành tích:</strong> ${s.thanhtich || "-"}</p>
             <p class="mb-1">
                <strong>Màu đai:</strong>
                ${s.maudai ? `<img src="${s.maudai}" alt="Màu đai" style="height:24px; vertical-align:middle; margin-left:4px;">` : '-'}
             </p>
            <p class="mb-0"><small class="text-muted">Ngày thi: ${s.ngaydangky || "-"}</small></p>

          </div>
        </div>
      </div>
    `).join("");
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
