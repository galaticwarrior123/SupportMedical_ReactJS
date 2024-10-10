import React from 'react';

const InformDialog = ({ title, message, onOk, isOpen, okText='OK' }) => {
  if (!isOpen) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.dialog}>
        <h2>{title}</h2>
        <p>{message}</p>
        <div style={styles.buttons}>
          <button onClick={onOk} style={styles.okButton}>{okText}</button>
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
  okButton: {
    padding: '10px 20px',
    backgroundColor: '#e0e0e0',
    color: '#000',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
  },
};

export default InformDialog;
