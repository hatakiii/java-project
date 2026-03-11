import React, { useState, useEffect } from 'react';

const INITIAL = { firstName: '', lastName: '', age: '', grade: '', phoneNumber: '', address: '' };

export default function StudentModal({ student, onSave, onClose }) {
    const [form, setForm] = useState(INITIAL);
    const [errors, setErrors] = useState({});
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (student) {
            setForm({
                firstName: student.firstName || '',
                lastName: student.lastName || '',
                age: student.age || '',
                grade: student.grade || '',
                phoneNumber: student.phoneNumber || '',
                address: student.address || '',
            });
        } else {
            setForm(INITIAL);
        }
        setErrors({});
    }, [student]);

    const validate = () => {
        const e = {};
        if (!form.firstName.trim()) e.firstName = 'Нэр оруулна уу';
        if (!form.lastName.trim()) e.lastName = 'Овог оруулна уу';
        if (!form.age || form.age < 5 || form.age > 25) e.age = '5-25 хооронд байх ёстой';
        if (!form.grade.trim()) e.grade = 'Анги оруулна уу';
        setErrors(e);
        return Object.keys(e).length === 0;
    };

    const handleChange = (e) => {
        setForm({ ...form, [e.target.name]: e.target.value });
        setErrors({ ...errors, [e.target.name]: '' });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!validate()) return;
        setLoading(true);
        try {
            await onSave({ ...form, age: parseInt(form.age) });
        } finally {
            setLoading(false);
        }
    };

    const grades = ['1А', '1Б', '2А', '2Б', '3А', '3Б', '4А', '4Б', '5А', '5Б', '6А', '6Б', '7А', '7Б', '8А', '8Б', '9А', '9Б', '10А', '10Б', '11А', '11Б', '12А', '12Б'];

    return (
        <div className="modal-overlay" onClick={e => e.target === e.currentTarget && onClose()}>
            <div className="modal-card">
                <div className="modal-header">
                    <h2>{student ? '✏️ Сурагч засах' : '➕ Шинэ сурагч нэмэх'}</h2>
                    <button className="modal-close" onClick={onClose}>✕</button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-grid">
                        <div className="form-group">
                            <label>Нэр <span className="required">*</span></label>
                            <input
                                name="firstName"
                                value={form.firstName}
                                onChange={handleChange}
                                placeholder="Жишээ: Болд"
                                className={`form-input ${errors.firstName ? 'input-error' : ''}`}
                            />
                            {errors.firstName && <span className="field-error">{errors.firstName}</span>}
                        </div>

                        <div className="form-group">
                            <label>Овог <span className="required">*</span></label>
                            <input
                                name="lastName"
                                value={form.lastName}
                                onChange={handleChange}
                                placeholder="Жишээ: Батаа"
                                className={`form-input ${errors.lastName ? 'input-error' : ''}`}
                            />
                            {errors.lastName && <span className="field-error">{errors.lastName}</span>}
                        </div>

                        <div className="form-group">
                            <label>Нас <span className="required">*</span></label>
                            <input
                                type="number"
                                name="age"
                                value={form.age}
                                onChange={handleChange}
                                min="5"
                                max="25"
                                placeholder="15"
                                className={`form-input ${errors.age ? 'input-error' : ''}`}
                            />
                            {errors.age && <span className="field-error">{errors.age}</span>}
                        </div>

                        <div className="form-group">
                            <label>Анги <span className="required">*</span></label>
                            <select
                                name="grade"
                                value={form.grade}
                                onChange={handleChange}
                                className={`form-input ${errors.grade ? 'input-error' : ''}`}
                            >
                                <option value="">— Анги сонгох —</option>
                                {grades.map(g => <option key={g} value={g}>{g}</option>)}
                            </select>
                            {errors.grade && <span className="field-error">{errors.grade}</span>}
                        </div>

                        <div className="form-group">
                            <label>Утасны дугаар</label>
                            <input
                                name="phoneNumber"
                                value={form.phoneNumber}
                                onChange={handleChange}
                                placeholder="99001122"
                                className="form-input"
                            />
                        </div>

                        <div className="form-group">
                            <label>Хаяг</label>
                            <input
                                name="address"
                                value={form.address}
                                onChange={handleChange}
                                placeholder="Улаанбаатар хот..."
                                className="form-input"
                            />
                        </div>
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Цуцлах</button>
                        <button type="submit" className="save-btn" disabled={loading}>
                            {loading ? '⏳ Хадгалж байна...' : student ? '💾 Шинэчлэх' : '✨ Нэмэх'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
