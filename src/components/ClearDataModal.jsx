import './ClearDataModal.css'

export default function ClearDataModal({ onConfirm, onCancel }) {
  return (
    <div
      className="modal-overlay"
      onClick={(e) => e.target === e.currentTarget && onCancel()}
      role="dialog"
      aria-modal="true"
      aria-labelledby="modal-title"
    >
      <div className="modal">
        <h2 id="modal-title" className="modal__title">
          Clear all data?
        </h2>
        <p className="modal__text">
          This will remove all students and attendance records. This cannot be
          undone.
        </p>
        <div className="modal__actions">
          <button type="button" className="modal__btn" onClick={onCancel}>
            Cancel
          </button>
          <button
            type="button"
            className="modal__btn modal__btn--danger"
            onClick={onConfirm}
          >
            Clear all
          </button>
        </div>
      </div>
    </div>
  )
}
