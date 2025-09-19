// main.js
document.addEventListener('click', function(event) {
  // Lấy tất cả navbar collapse trên trang
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
document.addEventListener("DOMContentLoaded", () => {
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
});
