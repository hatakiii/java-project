import React, { useState, useEffect } from 'react';
import { attendanceApi } from '../api/api';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AttendancePage() {
    const { user, logout, timeLeft, formatTime } = useAuth();
    const [students, setStudents] = useState([]);
    const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
    const [loading, setLoading] = useState(false);
    const [saving, setSaving] = useState(false);
    const [message, setMessage] = useState('');
    const navigate = useNavigate();

    const fetchAttendance = async (selectedDate) => {
        setLoading(true);
        try {
            const res = await attendanceApi.get(selectedDate);
            setStudents(res.data.data);
        } catch (err) {
            console.error(err);
            setMessage('Уучлаарай, мэдээлэл авахад алдаа гарлаа.');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchAttendance(date);
    }, [date]);

    const handleStatusChange = (studentId, status) => {
        setStudents(prev => prev.map(s =>
            s.studentId === studentId ? { ...s, status } : s
        ));
    };

    const handleSave = async () => {
        setSaving(true);
        setMessage('');
        try {
            const studentStatuses = {};
            students.forEach(s => {
                if (s.status) {
                    studentStatuses[s.studentId] = s.status;
                }
            });

            await attendanceApi.mark({
                date,
                studentStatuses
            });
            setMessage('Ирц амжилттай хадгалагдлаа!');
            setTimeout(() => setMessage(''), 3000);
        } catch (err) {
            console.error(err);
            setMessage('Ирц хадгалахад алдаа гарлаа.');
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="dashboard-container">
            <header className="dashboard-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1rem 2rem' }}>
                <div className="brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px' }}>
                    <div className="logo" style={{ width: '40px', height: '40px', borderRadius: '50%', background: 'linear-gradient(135deg, #6366f1, #8b5cf6)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>S</div>
                    <h1 style={{ fontSize: '1.2rem', margin: 0 }}>School System</h1>
                </div>
                <div className="user-profile" style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
                    <div className={`session-timer ${timeLeft < 30 ? 'danger' : ''}`} title="Session Time Remaining">
                        ⏱️ {formatTime(timeLeft)}
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                        <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#6366f1', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
                            {user?.username?.[0]?.toUpperCase()}
                        </div>
                        <span style={{ fontWeight: 500 }}>{user?.username}</span>
                    </div>
                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate('/dashboard')}
                        style={{ padding: '8px 16px' }}
                    >
                        Буцах
                    </button>
                    <button
                        className="logout-btn"
                        onClick={logout}
                        style={{
                            background: 'rgba(239, 68, 68, 0.15)',
                            color: '#ff4646',
                            border: '1px solid rgba(239, 68, 68, 0.3)',
                            padding: '8px 16px',
                            borderRadius: '8px',
                            cursor: 'pointer'
                        }}
                    >
                        Гарах
                    </button>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="content-card">
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                        <h2>Сурагчдын ирц</h2>
                        <input
                            type="date"
                            className="form-input"
                            style={{ width: 'auto', marginBottom: 0 }}
                            value={date}
                            onChange={(e) => setDate(e.target.value)}
                        />
                    </div>

                    {message && (
                        <div className={`alert ${message.includes('алдаа') ? 'alert-error' : 'alert-success'}`} style={{ marginBottom: '20px' }}>
                            {message}
                        </div>
                    )}

                    {loading ? (
                        <div style={{ textAlign: 'center', padding: '40px' }}>Уншиж байна...</div>
                    ) : (
                        <div className="table-responsive">
                            <table className="data-table">
                                <thead>
                                    <tr>
                                        <th>Овог нэр</th>
                                        <th>Төлөв</th>
                                        <th>Үйлдэл</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {students.map((student) => (
                                        <tr key={student.studentId}>
                                            <td>{student.fullName}</td>
                                            <td>
                                                <span className={`status-badge status-${student.status?.toLowerCase() || 'none'}`}>
                                                    {student.status === 'PRESENT' ? 'Идэвхтэй' :
                                                        student.status === 'ABSENT' ? 'Идэвхгүй' :
                                                            student.status === 'LATE' ? 'Хоцорсон' :
                                                                student.status === 'EXCUSED' ? 'Чөлөөтэй' : 'Бүртгээгүй'}
                                                </span>
                                            </td>
                                            <td>
                                                <div style={{ display: 'flex', gap: '5px' }}>
                                                    <button
                                                        className={`btn ${student.status === 'PRESENT' ? 'btn-primary' : 'btn-secondary'}`}
                                                        style={{ padding: '5px 10px', fontSize: '12px' }}
                                                        onClick={() => handleStatusChange(student.studentId, 'PRESENT')}
                                                    >
                                                        Идэвхтэй
                                                    </button>
                                                    <button
                                                        className={`btn ${student.status === 'ABSENT' ? 'btn-error' : 'btn-secondary'}`}
                                                        style={{ padding: '5px 10px', fontSize: '12px' }}
                                                        onClick={() => handleStatusChange(student.studentId, 'ABSENT')}
                                                    >
                                                        Идэвхгүй
                                                    </button>
                                                </div>
                                            </td>
                                        </tr>
                                    ))}
                                    {students.length === 0 && (
                                        <tr>
                                            <td colSpan="3" style={{ textAlign: 'center' }}>Сурагч олдсонгүй.</td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    )}

                    <div style={{ marginTop: '20px', display: 'flex', justifyContent: 'flex-end' }}>
                        <button
                            className="btn btn-primary"
                            disabled={saving || students.length === 0}
                            onClick={handleSave}
                        >
                            {saving ? 'Хадгалж байна...' : 'Ирц хадгалах'}
                        </button>
                    </div>
                </div>
            </main>

            <style jsx="true">{`
                .status-present { background: rgba(0, 255, 136, 0.2); color: #00ff88; }
                .status-absent { background: rgba(255, 70, 70, 0.2); color: #ff4646; }
                .status-none { background: rgba(255, 255, 255, 0.1); color: #888; }
                .alert-success { background: rgba(0, 255, 136, 0.1); color: #00ff88; border: 1px solid #00ff88; padding: 10px; border-radius: 4px; }
                .alert-error { background: rgba(255, 70, 70, 0.1); color: #ff4646; border: 1px solid #ff4646; padding: 10px; border-radius: 4px; }
            `}</style>
        </div>
    );
}
