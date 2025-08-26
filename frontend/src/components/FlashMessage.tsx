

interface FlashMessageProps {
  message: string | null;
  type?: 'success' | 'error';
  onClose: () => void;
}

function FlashMessage({ message, type = 'success', onClose }: FlashMessageProps): React.ReactElement | null {
  if (!message) return null;

  return (
    <div 
      className={`alert alert-${type === 'error' ? 'danger' : 'success'} alert-dismissible fade show flash-message`}
      role="alert"
      style={{
        position: 'fixed',
        top: '80px', // manter abaixo da navbar
        left: '50%',
        transform: 'translateX(-50%)',
        zIndex: 1050,
        minWidth: '300px',
        maxWidth: '600px',
        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
        borderRadius: '8px'
      }}
    >
      {message}
      <button type="button" className="btn-close" onClick={onClose}></button>
    </div>
  );
}

export default FlashMessage;
