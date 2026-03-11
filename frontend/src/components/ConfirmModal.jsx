import React from 'react';

export default function ConfirmModal({ name, onConfirm, onCancel }) {
    return (
        <div className="modal-overlay">
            <div className="confirm-card">
                <div className="confirm-icon">🗑️</div>
                <h3 className="confirm-title">Устгах уу?</h3>
                <p className="confirm-msg">
                    <strong>{name}</strong> сурагчийг устгах гэж байна. Энэ үйлдлийг буцааж болохгүй!
                </p>
                <div className="confirm-actions">
                    <button className="cancel-btn" onClick={onCancel}>Цуцлах</button>
                    <button className="danger-btn" onClick={onConfirm}>Устгах</button>
                </div>
            </div>
        </div>
    );
}
