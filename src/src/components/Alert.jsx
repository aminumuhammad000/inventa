import React from 'react';
import CloseIcon from '@mui/icons-material/Close';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import ErrorIcon from '@mui/icons-material/Error';
import "../styles/global-style.css"

const Alert = ({ show, message, icon, onClose }) => {
  if (!show) return null;
  let IconComponent = null;
  if (icon === 'check_circle') IconComponent = CheckCircleIcon;
  else if (icon === 'error') IconComponent = ErrorIcon;
  return (
    <div className={`toast show`}>
      <div className="toast-content">
        {IconComponent && <IconComponent className="toast-icon" style={{ marginRight: 8 }} />}
        <span className="toast-message">{message}</span>
      </div>
      <button className="toast-close" onClick={onClose}>
        <CloseIcon style={{ fontSize: 24 }} />
      </button>
    </div>
  );
};

export default Alert;
