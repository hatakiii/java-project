import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { studentApi } from "../api/api";
import { useAuth } from "../context/AuthContext";
import StudentModal from "../components/StudentModal";
import ConfirmModal from "../components/ConfirmModal";

export default function DashboardPage() {
  const { user, logout, timeLeft, formatTime } = useAuth();
  const navigate = useNavigate();
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editStudent, setEditStudent] = useState(null);
  const [deleteTarget, setDeleteTarget] = useState(null);
  const [search, setSearch] = useState("");
  const [toast, setToast] = useState(null);
  const [stats, setStats] = useState({ total: 0, grades: {} });

  const showToast = (msg, type = "success") => {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      const res = await studentApi.getAll();
      const data = res.data.data || [];
      setStudents(data);
      // Stats
      const gradeMap = {};
      data.forEach((s) => {
        gradeMap[s.grade] = (gradeMap[s.grade] || 0) + 1;
      });
      setStats({ total: data.length, grades: gradeMap });
    } catch {
      showToast("Сурагчдын жагсаалт авахад алдаа гарлаа", "error");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleSave = async (formData) => {
    try {
      if (editStudent) {
        await studentApi.update(editStudent.id, formData);
        showToast("Сурагчийн мэдээлэл шинэчлэгдлээ ✓");
      } else {
        await studentApi.create(formData);
        showToast("Шинэ сурагч нэмэгдлээ ✓");
      }
      setShowModal(false);
      setEditStudent(null);
      fetchStudents();
    } catch (err) {
      showToast(err.response?.data?.message || "Алдаа гарлаа", "error");
    }
  };

  const handleDelete = async () => {
    try {
      await studentApi.delete(deleteTarget.id);
      showToast("Сурагч устгагдлаа ✓");
      setDeleteTarget(null);
      fetchStudents();
    } catch {
      showToast("Устгахад алдаа гарлаа", "error");
    }
  };

  const filtered = students.filter((s) =>
    `${s.firstName} ${s.lastName} ${s.grade} ${s.phoneNumber}`
      .toLowerCase()
      .includes(search.toLowerCase()),
  );

  const gradeColors = [
    "#6366f1",
    "#8b5cf6",
    "#ec4899",
    "#f59e0b",
    "#10b981",
    "#3b82f6",
    "#ef4444",
    "#14b8a6",
  ];

  return (
    <div className="dashboard">
      {/* Toast */}
      {toast && (
        <div className={`toast toast-${toast.type}`}>
          {toast.type === "success" ? "✅" : "❌"} {toast.msg}
        </div>
      )}

      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand">
          <span className="nav-logo">🎓</span>
          <span className="nav-title">Сургуулийн систем</span>
        </div>
        <div className="nav-user">
          <div
            className={`session-timer ${timeLeft < 30 ? "danger" : ""}`}
            title="Session Time Remaining"
          >
            ⏱️ {formatTime(timeLeft)}
          </div>
          <div className="user-avatar">
            {user?.username?.[0]?.toUpperCase()}
          </div>
          <span className="user-name">{user?.username}</span>
          <button className="logout-btn" onClick={logout}>
            🚪 Гарах
          </button>
        </div>
      </nav>

      <div className="dashboard-content">
        {/* Stats */}
        <div className="stats-grid">
          <div className="stat-card primary">
            <div className="stat-icon">👨‍🎓</div>
            <div className="stat-info">
              <div className="stat-value">{stats.total}</div>
              <div className="stat-label">Нийт сурагч</div>
            </div>
          </div>
          <div className="stat-card secondary">
            <div className="stat-icon">🏫</div>
            <div className="stat-info">
              <div className="stat-value">
                {Object.keys(stats.grades).length}
              </div>
              <div className="stat-label">Анги</div>
            </div>
          </div>
          <div className="stat-card accent">
            <div className="stat-icon">📋</div>
            <div className="stat-info">
              <div className="stat-value">{filtered.length}</div>
              <div className="stat-label">Хайлтын үр дүн</div>
            </div>
          </div>
        </div>

        {/* Grade breakdown */}
        {Object.keys(stats.grades).length > 0 && (
          <div className="grade-pills">
            {Object.entries(stats.grades).map(([grade, count], i) => (
              <span
                key={grade}
                className="grade-pill"
                style={{ background: gradeColors[i % gradeColors.length] }}
              >
                {grade}: {count} сурагч
              </span>
            ))}
          </div>
        )}

        {/* Toolbar */}
        <div className="toolbar">
          <div className="search-wrapper">
            <span className="search-icon">🔍</span>
            <input
              className="search-input"
              type="text"
              placeholder="Нэр, анги, утасны дугааргаар хайх..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
            {search && (
              <button className="clear-search" onClick={() => setSearch("")}>
                ✕
              </button>
            )}
          </div>
          <div className="toolbar-btns">
            <button
              className="attendance-btn"
              onClick={() => navigate("/attendance")}
              style={{
                marginRight: "10px",
                background: "#14b8a6",
                color: "white",
                border: "none",
                padding: "10px 20px",
                borderRadius: "8px",
                cursor: "pointer",
                fontWeight: "bold",
              }}
            >
              📋 Ирц бүртгэх
            </button>
            <button
              className="add-btn"
              onClick={() => {
                setEditStudent(null);
                setShowModal(true);
              }}
            >
              ＋ Сурагч нэмэх
            </button>
          </div>
        </div>

        {/* Student Table */}
        {loading ? (
          <div className="loading-state">
            <div className="loading-spinner"></div>
            <p>Уншиж байна...</p>
          </div>
        ) : filtered.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📭</div>
            <h3>
              {search
                ? "Хайлтад тохирох сурагч олдсонгүй"
                : "Сурагч байхгүй байна"}
            </h3>
            <p>
              {search
                ? "Өөр түлхүүр үгээр хайна уу"
                : "Дээрх товчийг дарж эхний сурагчаа нэмнэ үү"}
            </p>
          </div>
        ) : (
          <div className="table-wrapper">
            <table className="student-table">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Нэр</th>
                  <th>Нас</th>
                  <th>Анги</th>
                  <th>Утас</th>
                  <th>Хаяг</th>
                  <th>Үйлдэл</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map((student, idx) => (
                  <tr key={student.id} className="student-row">
                    <td className="row-num">{idx + 1}</td>
                    <td>
                      <div className="student-name-cell">
                        <div
                          className="student-avatar"
                          style={{
                            background: gradeColors[idx % gradeColors.length],
                          }}
                        >
                          {student.firstName?.[0]}
                          {student.lastName?.[0]}
                        </div>
                        <div>
                          <div
                            className="student-fullname"
                            onClick={() => navigate(`/student/${student.id}`)}
                            style={{ cursor: "pointer", display: "inline-block" }}
                          >
                            {student.firstName} {student.lastName}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td>
                      <span className="age-badge">{student.age}</span>
                    </td>
                    <td>
                      <span className="grade-tag">{student.grade}</span>
                    </td>
                    <td>{student.phoneNumber || "—"}</td>
                    <td className="address-cell">{student.address || "—"}</td>
                    <td>
                      <div className="action-btns">
                        <button
                          className="action-btn edit"
                          onClick={() => {
                            setEditStudent(student);
                            setShowModal(true);
                          }}
                          title="Засах"
                        >
                          ✏️
                        </button>
                        <button
                          className="action-btn delete"
                          onClick={() => setDeleteTarget(student)}
                          title="Устгах"
                        >
                          🗑️
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modals */}
      {showModal && (
        <StudentModal
          student={editStudent}
          onSave={handleSave}
          onClose={() => {
            setShowModal(false);
            setEditStudent(null);
          }}
        />
      )}
      {deleteTarget && (
        <ConfirmModal
          name={`${deleteTarget.firstName} ${deleteTarget.lastName}`}
          onConfirm={handleDelete}
          onCancel={() => setDeleteTarget(null)}
        />
      )}
    </div>
  );
}
