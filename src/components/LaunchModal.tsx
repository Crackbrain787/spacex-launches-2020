import React, { useEffect } from 'react';
import ReactDOM from 'react-dom';
import type { Launch } from '../types';
import { Button } from '@mantine/core';
import './LaunchModal.css';

interface LaunchModalProps {
  launch: Launch;
  isOpen: boolean;
  onClose: () => void;
}

export const LaunchModal: React.FC<LaunchModalProps> = ({ launch, isOpen, onClose }) => {
  useEffect(() => {
    const handleEscape = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [onClose]);

  if (!isOpen) return null;

  const modalRoot = document.getElementById('modal-root');
  if (!modalRoot) {
    console.error('Элемент с id="modal-root" не найден в DOM!');
    return null;
  }

  const modalContent = (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <Button
  variant="subtle"
  color="gray"
  size="sm"
  radius="xl"
  onClick={onClose}
  style={{
    position: 'absolute',
    top: '10px',
    right: '10px',
    width: '32px',
    height: '32px',
    padding: '0',
    minWidth: 'auto'
  }}
>
  ×
</Button>
        <h2>{launch.mission_name}</h2>
        <img
          src={launch.links.mission_patch || '/placeholder.svg'}
          alt={`${launch.mission_name} patch`}
          className="modal-patch"
        />
        <div className="modal-details">
          <p><strong>Mission name:</strong></p>
          <p className="dimmed">{launch.mission_name}</p>
          <p><strong>Rocket name:</strong></p>
          <p className="dimmed">{launch.rocket.rocket_name}</p>
          {launch.details && (
            <>
              <p><strong>Details:</strong></p>
              <p className="dimmed">{launch.details}</p>
            </>
          )}
        </div>
      </div>
    </div>
  );

  return ReactDOM.createPortal(modalContent, modalRoot);
};