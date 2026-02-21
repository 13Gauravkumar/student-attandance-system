import './AttendanceRow.css'

export default function AttendanceRow({ student, status, onStatusChange, animationDelay }) {
  return (
    <div
      className="attendance-row"
      style={{ animationDelay: `${animationDelay}s` }}
      role="row"
    >
      <span className="attendance-row__name">{student.name}</span>
      <div className="attendance-row__actions">
        <button
          type="button"
          className={`attendance-row__btn attendance-row__btn--present ${status === 'present' ? 'attendance-row__btn--active' : ''}`}
          onClick={() => onStatusChange('present')}
          aria-pressed={status === 'present'}
          aria-label={`${student.name} present`}
        >
          <span className="attendance-row__check">
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" aria-hidden="true">
              <path
                className="attendance-row__check-path"
                d="M2 7l3.5 3.5L12 4"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeDasharray="12"
                strokeDashoffset={status === 'present' ? 0 : 12}
              />
            </svg>
          </span>
          Present
        </button>
        <button
          type="button"
          className={`attendance-row__btn attendance-row__btn--absent ${status === 'absent' ? 'attendance-row__btn--active' : ''}`}
          onClick={() => onStatusChange('absent')}
          aria-pressed={status === 'absent'}
          aria-label={`${student.name} absent`}
        >
          <span className="attendance-row__cross">×</span>
          Absent
        </button>
      </div>
    </div>
  )
}
