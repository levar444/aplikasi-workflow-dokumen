import React, { useState } from 'react';
import './PasswordInput.css';

export default function PasswordInput({
  value,
  onChange,
  placeholder = "Masukkan password Anda",
  disabled = false,
  error = false,
  id = "password",
  name = "password",
  autoComplete = "current-password"
}) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className={`password-input-wrapper ${error ? 'has-error' : ''}`}>
      <span className="input-icon" aria-hidden="true">🔒</span>
      <input
        type={showPassword ? 'text' : 'password'}
        id={id}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete={autoComplete}
        className="form-control-input"
      />
      <button
        type="button"
        className="toggle-password-btn"
        onClick={() => setShowPassword(!showPassword)}
        aria-label={showPassword ? "Hide password" : "Show password"}
        disabled={disabled}
      >
        {showPassword ? '🙈' : '👁'}
      </button>
    </div>
  );
}