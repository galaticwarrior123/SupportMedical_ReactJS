import React from 'react';

const YesNoDialog = ({ title, message, onConfirm, onCancel, isOpen, yesText='Yes', noText='No' }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div style={styles.buttons}>
          <button onClick={onCancel} style={styles.noButton}>{noText}</button>
          <button onClick={onConfirm} style={styles.yesButton}>{yesText}</button>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    zIndex: 1000,
    position: 'fixed',
    top: 0,
    left: 0,
    width: '100%',
    height: '100%',
    backgroundColor: 'rgba(0, 0, 0, 0.6)',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  dialog: {
    backgroundColor: '#F7EEDD',
    width: '400px',    
    padding: '20px',
    borderRadius: '8px',
    boxShadow: '0 2px 10px rgba(0, 0, 0, 0.1)',
    textAlign: 'center',
  },
  buttons: {
    marginTop: '20px',
    display: 'flex',
    justifyContent: 'space-around',
  },
  yesButton: {
    marginRight: '10px',
    padding: '10px 20px',
    backgroundColor: '#4caf50',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
  noButton: {
    padding: '10px 20px',
    backgroundColor: '#f44336',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default YesNoDialog;
