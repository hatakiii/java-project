import React, { useState } from 'react';
import { authApi } from '../api/api';
import { useAuth } from '../context/AuthContext';

export default function AuthPage() {
    const { login } = useAuth();
    const [isLogin, setIsLogin] = useState(true);
    const [formData, setFormData] = useState({ username: '', email: '', password: '' });
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
        setError('');
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        try {
            let res;
            if (isLogin) {
                res = await authApi.login({ username: formData.username, password: formData.password });
            } else {
                res = await authApi.register(formData);
            }
            const { data: responseData } = res.data;
            login({ username: responseData.username, email: responseData.email, id: responseData.id }, responseData.token);
        } catch (err) {
            setError(err.response?.data?.message || 'Алдаа гарлаа. Дахин оролдоно уу.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-logo">
                    <div className="logo-icon">🎓</div>
                    <h1 className="auth-title">Сургуулийн систем</h1>
                    <p className="auth-subtitle">Багш нарт зориулсан удирдлагын систем</p>
                </div>

                <div className="tab-switcher">
                    <button
                        className={`tab-btn ${isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(true); setError(''); setFormData({ username: '', email: '', password: '' }); }}
                    >
                        Нэвтрэх
                    </button>
                    <button
                        className={`tab-btn ${!isLogin ? 'active' : ''}`}
                        onClick={() => { setIsLogin(false); setError(''); setFormData({ username: '', email: '', password: '' }); }}
                    >
                        Бүртгүүлэх
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="auth-form">
                    <div className="form-group">
                        <label>Хэрэглэгчийн нэр</label>
                        <input
                            type="text"
                            name="username"
                            placeholder="username"
                            value={formData.username}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    {!isLogin && (
                        <div className="form-group">
                            <label>И-мэйл</label>
                            <input
                                type="email"
                                name="email"
                                placeholder="email@example.com"
                                value={formData.email}
                                onChange={handleChange}
                                required
                                className="form-input"
                            />
                        </div>
                    )}

                    <div className="form-group">
                        <label>Нууц үг</label>
                        <input
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            className="form-input"
                        />
                    </div>

                    {error && <div className="error-msg">⚠️ {error}</div>}

                    <button type="submit" className="submit-btn" disabled={loading}>
                        {loading ? (
                            <span className="btn-loading"><span className="spinner"></span> Уншиж байна...</span>
                        ) : (
                            isLogin ? '🔐 Нэвтрэх' : '✨ Бүртгүүлэх'
                        )}
                    </button>
                </form>

                <p className="auth-toggle">
                    {isLogin ? 'Бүртгэл байхгүй юу?' : 'Бүртгэлтэй юу?'}{' '}
                    <span className="toggle-link" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
                        {isLogin ? 'Бүртгүүлэх' : 'Нэвтрэх'}
                    </span>
                </p>
            </div>
        </div>
    );
}
