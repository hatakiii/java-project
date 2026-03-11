import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { studentApi } from "../api/api";
import { useAuth } from "../context/AuthContext";

export default function StudentDetailPage() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user, logout, timeLeft, formatTime } = useAuth();
  const [student, setStudent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        setLoading(true);
        const res = await studentApi.getById(id);
        setStudent(res.data.data);
      } catch (err) {
        setError("Сурагчийн мэдээлэл авахад алдаа гарлаа");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchStudent();
  }, [id]);

  if (loading) {
    return (
      <div className="dashboard">
        <div className="loading-state">
          <div className="loading-spinner"></div>
          <p>Уншиж байна...</p>
        </div>
      </div>
    );
  }

  if (error || !student) {
    return (
      <div className="dashboard">
        <div className="empty-state">
          <div className="empty-icon">❌</div>
          <h3>Алдаа гарлаа</h3>
          <p>{error || "Сурагч олдсонгүй"}</p>
          <button className="add-btn" onClick={() => navigate("/dashboard")} style={{ marginTop: "1rem" }}>
            Буцах
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="dashboard">
      {/* Navbar */}
      <nav className="navbar">
        <div className="nav-brand" onClick={() => navigate("/dashboard")} style={{ cursor: 'pointer' }}>
          <span className="nav-logo">🎓</span>
          <span className="nav-title">Сургуулийн систем</span>
        </div>
        <div className="nav-user">
          <div className={`session-timer ${timeLeft < 30 ? "danger" : ""}`} title="Session Time Remaining">
            ⏱️ {formatTime(timeLeft)}
          </div>
          <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
          <span className="user-name">{user?.username}</span>
          <button className="logout-btn" onClick={logout}>🚪 Гарах</button>
        </div>
      </nav>

      <div className="dashboard-content">
        <div className="detail-header">
          <button className="cancel-btn" onClick={() => navigate("/dashboard")}>
            ← Буцах
          </button>
          <h1 className="detail-title">Сурагчийн мэдээлэл</h1>
        </div>

        <div className="detail-grid">
          {/* Profile Card */}
          <div className="detail-card profile-card">
            <div className="profile-hero">
              <div className="profile-avatar">
                {student.firstName?.[0]}{student.lastName?.[0]}
              </div>
              <h2 className="profile-name">{student.firstName} {student.lastName}</h2>
              <span className="grade-tag">{student.grade} анги</span>
            </div>
          </div>

          {/* Info Card */}
          <div className="detail-card info-card">
            <h3>Үндсэн мэдээлэл</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Овог:</span>
                <span className="info-value">{student.lastName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Нэр:</span>
                <span className="info-value">{student.firstName}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Нас:</span>
                <span className="info-value">{student.age}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Анги:</span>
                <span className="info-value">{student.grade}</span>
              </div>
            </div>
          </div>

          {/* Contact Card */}
          <div className="detail-card info-card">
            <h3>Холбоо барих мэдээлэл</h3>
            <div className="info-list">
              <div className="info-item">
                <span className="info-label">Утасны дугаар:</span>
                <span className="info-value">{student.phoneNumber || "—"}</span>
              </div>
              <div className="info-item">
                <span className="info-label">Хаяг:</span>
                <span className="info-value">{student.address || "—"}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
