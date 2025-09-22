from flask_sqlalchemy import SQLAlchemy
from datetime import datetime
import os

db = SQLAlchemy()


# ================== BẢNG HỘI VIÊN ==================
class HoiVien(db.Model):
    __tablename__ = "hoivien"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    hovaten = db.Column(db.String(100), nullable=False)
    namsinh = db.Column(db.Integer, nullable=False)
    gioitinh = db.Column(db.String(10), nullable=False)
    role = db.Column(db.String(20), nullable=False)  # hoivien / hlv
    donvi = db.Column(db.String(100), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    taikhoan = db.relationship("TaiKhoan", backref="hoivien", uselist=False)


# ================== BẢNG TÀI KHOẢN ==================
class TaiKhoan(db.Model):
    __tablename__ = "taikhoan"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    username = db.Column(db.String(50), unique=True, nullable=False)
    password = db.Column(db.String(200), nullable=True)
    role = db.Column(db.String(20), nullable=False)  # admin / hlv / hoivien
    hoivien_id = db.Column(db.Integer, db.ForeignKey("hoivien.id"), nullable=True)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)


# ================== BẢNG HỒ SƠ VÕ SINH ==================
class HoSoVoSinh(db.Model):
    __tablename__ = "hosovosinh"

    vocotruyenid = db.Column(db.String(20), primary_key=True)
    hovaten = db.Column(db.String(100), nullable=False)
    namsinh = db.Column(db.Integer, nullable=True)
    gioitinh = db.Column(db.String(10), nullable=True)
    donvi = db.Column(db.String(100), nullable=True)

    # ⚡ capbac lưu string: "1"…"18" hoặc "phong tang"
    capbac = db.Column(db.String(20), nullable=True)

    trinhdo = db.Column(db.String(50), nullable=True)

    # maudai lưu relative path trong static (VD: "cap1.jpg")
    maudai = db.Column(db.String(200), nullable=True)

    thanhtich = db.Column(db.Text, nullable=True)

    dangky = db.relationship("DangKyKyThi", backref="vosinh")


    cascade = "all, delete-orphan"

# ================== BẢNG KỲ THI ==================
class KyThi(db.Model):
    __tablename__ = "kythi"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    tenkythi = db.Column(db.String(100), nullable=False)
    ngaythi = db.Column(db.Date, nullable=False)
    diadiem = db.Column(db.String(200), nullable=True)

    dangky = db.relationship("DangKyKyThi", backref="kythi")


# ================== BẢNG ĐĂNG KÝ KỲ THI ==================
class DangKyKyThi(db.Model):
    __tablename__ = "dangkykythi"

    id = db.Column(db.Integer, primary_key=True, autoincrement=True)
    vosinh_id = db.Column(db.String(20), db.ForeignKey("hosovosinh.vocotruyenid"), nullable=False)
    kythi_id = db.Column(db.Integer, db.ForeignKey("kythi.id"), nullable=False)
    ngaydk = db.Column(db.DateTime, default=datetime.utcnow)


# ================== HÀM HỖ TRỢ ==================
def init_db(app):
    db.init_app(app)
    with app.app_context():
        db.create_all()


def get_trinh_do(capbac: str) -> str:
    """Trả về trình độ theo cấp bậc"""
    if not capbac:
        return "Chưa xếp"

    cap = str(capbac).lower().strip()

    if cap.isdigit():
        c = int(cap)
        if 1 <= c <= 8:
            return "Võ sinh"
        elif 9 <= c <= 12:
            return "Hướng dẫn viên"
        elif 13 <= c <= 16:
            return "Huấn luyện viên"
        elif c == 17:
            return "Chuẩn võ sư"
        elif c == 18:
            return "Võ sư"

    # xử lý phong tặng
    if cap in ["phong tang", "phongtang", "phong tặng"]:
        return "Đại võ sư"

    return "Chưa xếp"


def get_mau_dai(capbac: str, mode: str = "rel") -> str | None:
    if not capbac:
        return None

    cap = str(capbac).lower().strip()

    if cap.isdigit():
        filename = f"cap{cap}.jpg"
    elif cap in ["phong tang", "phongtang", "phong tặng"]:
        filename = "phongtang.jpg"
    else:
        filename = "default.jpg"

    if mode == "rel":
        return f"img/{filename}"   # ✅ thêm thư mục img
    else:
        base_dir = os.path.abspath(os.path.dirname(__file__))
        return os.path.join(base_dir, "static", "img", filename)  # ✅ thêm img

