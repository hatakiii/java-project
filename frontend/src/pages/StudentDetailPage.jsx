import React, { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { studentApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function StudentDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, logout, timeLeft, formatTime } = useAuth();
    const [student, setStudent] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [uploading, setUploading] = useState(false);
    const [uploadMsg, setUploadMsg] = useState(null);
    const fileInputRef = useRef(null);

    const fetchStudent = async () => {
        try {
            setLoading(true);
            const res = await studentApi.getById(id);
            setStudent(res.data.data);
        } catch (err) {
            setError('Сурагчийн мэдээлэл олдсонгүй');
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchStudent();
    }, [id]);

    const handleImageUpload = async (e) => {
        const file = e.target.files[0];
        if (!file) return;

        if (file.size > 5 * 1024 * 1024) {
            setUploadMsg({ type: 'error', text: 'Зургийн хэмжээ 5MB-аас бага байх ёстой' });
            return;
        }

        try {
            setUploading(true);
            setUploadMsg(null);

            // Upload to Cloudinary
            const uploadRes = await studentApi.uploadImage(file);
            const imageUrl = uploadRes.data.data.imageUrl;

            // Update student with new image URL
            await studentApi.update(id, { ...student, imageUrl });

            // Refresh student data
            setStudent(prev => ({ ...prev, imageUrl }));
            setUploadMsg({ type: 'success', text: 'Зураг амжилттай солигдлоо!' });
        } catch (err) {
            console.error(err);
            setUploadMsg({ type: 'error', text: 'Зураг байршуулахад алдаа гарлаа' });
        } finally {
            setUploading(false);
            if (fileInputRef.current) fileInputRef.current.value = '';
        }
    };

    const handleRemoveImage = async () => {
        try {
            setUploading(true);
            await studentApi.update(id, { ...student, imageUrl: '' });
            setStudent(prev => ({ ...prev, imageUrl: '' }));
            setUploadMsg({ type: 'success', text: 'Зураг амжилттай устгагдлаа!' });
        } catch (err) {
            setUploadMsg({ type: 'error', text: 'Зураг устгахад алдаа гарлаа' });
        } finally {
            setUploading(false);
        }
    };

    // Clear upload message after 3s
    useEffect(() => {
        if (uploadMsg) {
            const t = setTimeout(() => setUploadMsg(null), 3000);
            return () => clearTimeout(t);
        }
    }, [uploadMsg]);

    if (loading) {
        return (
            <div className="dashboard">
                <nav className="navbar">
                    <div className="nav-brand">
                        <span className="nav-logo">🎓</span>
                        <span className="nav-title">Сургуулийн систем</span>
                    </div>
                </nav>
                <div className="dashboard-content">
                    <div className="loading-state">
                        <div className="loading-spinner"></div>
                        <p>Уншиж байна...</p>
                    </div>
                </div>
            </div>
        );
    }

    if (error || !student) {
        return (
            <div className="dashboard">
                <nav className="navbar">
                    <div className="nav-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                        <span className="nav-logo">🎓</span>
                        <span className="nav-title">Сургуулийн систем</span>
                    </div>
                </nav>
                <div className="dashboard-content">
                    <div className="empty-state">
                        <div className="empty-icon">😔</div>
                        <h3>{error || 'Сурагч олдсонгүй'}</h3>
                        <button className="add-btn" onClick={() => navigate('/dashboard')} style={{ marginTop: '1rem' }}>
                            ← Буцах
                        </button>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div className="dashboard">
            {/* Navbar */}
            <nav className="navbar">
                <div className="nav-brand" onClick={() => navigate('/dashboard')} style={{ cursor: 'pointer' }}>
                    <span className="nav-logo">🎓</span>
                    <span className="nav-title">Сургуулийн систем</span>
                </div>
                <div className="nav-user">
                    <div className={`session-timer ${timeLeft < 30 ? 'danger' : ''}`} title="Session Time Remaining">
                        ⏱️ {formatTime(timeLeft)}
                    </div>
                    <div className="user-avatar">{user?.username?.[0]?.toUpperCase()}</div>
                    <span className="user-name">{user?.username}</span>
                    <button className="logout-btn" onClick={logout}>🚪 Гарах</button>
                </div>
            </nav>

            <div className="dashboard-content">
                {/* Back button */}
                <button className="back-btn" onClick={() => navigate('/dashboard')}>
                    ← Жагсаалт руу буцах
                </button>

                {/* Upload feedback */}
                {uploadMsg && (
                    <div className={`toast ${uploadMsg.type}`} style={{ marginBottom: '1rem' }}>
                        {uploadMsg.type === 'success' ? '✅' : '❌'} {uploadMsg.text}
                    </div>
                )}

                {/* Student Detail Card */}
                <div className="detail-card">
                    <div className="detail-header">
                        <div className="detail-image-section">
                            {/* Clickable image area for upload */}
                            <div
                                className="detail-image-upload-wrapper"
                                onClick={() => !uploading && fileInputRef.current?.click()}
                                title="Зураг солих"
                            >
                                {student.imageUrl ? (
                                    <div className="detail-image-container">
                                        <img
                                            src={student.imageUrl}
                                            alt={`${student.firstName} ${student.lastName}`}
                                            className="detail-image"
                                        />
                                        <div className="detail-image-overlay">
                                            {uploading ? (
                                                <div className="loading-spinner" style={{ width: 28, height: 28 }}></div>
                                            ) : (
                                                <span>📷 Солих</span>
                                            )}
                                        </div>
                                    </div>
                                ) : (
                                    <div className="detail-avatar">
                                        {uploading ? (
                                            <div className="loading-spinner" style={{ width: 28, height: 28 }}></div>
                                        ) : (
                                            <>
                                                <span>{student.firstName?.[0]}{student.lastName?.[0]}</span>
                                                <span className="detail-avatar-upload-hint">📷</span>
                                            </>
                                        )}
                                    </div>
                                )}
                            </div>
                            <input
                                ref={fileInputRef}
                                type="file"
                                accept="image/*"
                                onChange={handleImageUpload}
                                style={{ display: 'none' }}
                            />
                            {/* Upload / Remove buttons */}
                            <div className="detail-image-actions">
                                <button
                                    type="button"
                                    className="detail-upload-btn"
                                    onClick={() => !uploading && fileInputRef.current?.click()}
                                    disabled={uploading}
                                >
                                    📷 {student.imageUrl ? 'Зураг солих' : 'Зураг нэмэх'}
                                </button>
                                {student.imageUrl && (
                                    <button
                                        type="button"
                                        className="remove-image-btn"
                                        onClick={handleRemoveImage}
                                        disabled={uploading}
                                    >
                                        ✕ Устгах
                                    </button>
                                )}
                            </div>
                        </div>
                        <div className="detail-title-section">
                            <h1 className="detail-name">{student.firstName} {student.lastName}</h1>
                            <div className="detail-badges">
                                <span className="grade-tag">{student.grade} анги</span>
                                <span className="age-badge">{student.age} настай</span>
                            </div>
                        </div>
                    </div>

                    <div className="detail-body">
                        <div className="detail-grid">
                            <div className="detail-item">
                                <div className="detail-item-icon">👤</div>
                                <div className="detail-item-content">
                                    <div className="detail-item-label">Нэр</div>
                                    <div className="detail-item-value">{student.firstName}</div>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-item-icon">👤</div>
                                <div className="detail-item-content">
                                    <div className="detail-item-label">Овог</div>
                                    <div className="detail-item-value">{student.lastName}</div>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-item-icon">🎂</div>
                                <div className="detail-item-content">
                                    <div className="detail-item-label">Нас</div>
                                    <div className="detail-item-value">{student.age}</div>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-item-icon">🏫</div>
                                <div className="detail-item-content">
                                    <div className="detail-item-label">Анги</div>
                                    <div className="detail-item-value">{student.grade}</div>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-item-icon">📞</div>
                                <div className="detail-item-content">
                                    <div className="detail-item-label">Утасны дугаар</div>
                                    <div className="detail-item-value">{student.phoneNumber || 'Бүртгэлгүй'}</div>
                                </div>
                            </div>

                            <div className="detail-item">
                                <div className="detail-item-icon">📍</div>
                                <div className="detail-item-content">
                                    <div className="detail-item-label">Хаяг</div>
                                    <div className="detail-item-value">{student.address || 'Бүртгэлгүй'}</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
