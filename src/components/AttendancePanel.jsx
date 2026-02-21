import { useState } from 'react'
import AttendanceRow from './AttendanceRow'
import AttendanceHistory from './AttendanceHistory'
import './AttendancePanel.css'

function dateOffset(iso, days) {
  const d = new Date(iso + 'T12:00:00')
  d.setDate(d.getDate() + days)
  return d.toISOString().slice(0, 10)
}

export default function AttendancePanel({
  students,
  defaultDate,
  getAttendance,
  setAttendance,
  records,
}) {
  const [date, setDate] = useState(defaultDate)
  const attendance = getAttendance(date)
  const today = new Date().toISOString().slice(0, 10)

  const markAll = (status) => {
    students.forEach((s) => setAttendance(date, s.id, status))
  }

  if (students.length === 0) {
    return (
      <div className="attendance-panel attendance-panel--empty">
        <p>Add students first, then mark attendance here.</p>
      </div>
    )
  }

  return (
    <div className="attendance-panel">
      <AttendanceHistory records={records} onSelectDate={setDate} />

      <div className="attendance-panel__header">
        <div className="attendance-panel__date-row">
          <label className="attendance-panel__date-label" htmlFor="attendance-date">
            Date
          </label>
          <input
            id="attendance-date"
            type="date"
            value={date}
            onChange={(e) => setDate(e.target.value)}
            className="attendance-panel__date"
          />
          <div className="attendance-panel__shortcuts">
            <button
              type="button"
              className="attendance-panel__shortcut"
              onClick={() => setDate(today)}
            >
              Today
            </button>
            <button
              type="button"
              className="attendance-panel__shortcut"
              onClick={() => setDate(dateOffset(today, -1))}
            >
              Yesterday
            </button>
            <button
              type="button"
              className="attendance-panel__shortcut"
              onClick={() => setDate(dateOffset(date, -1))}
            >
              ← Prev
            </button>
            <button
              type="button"
              className="attendance-panel__shortcut"
              onClick={() => setDate(dateOffset(date, 1))}
            >
              Next →
            </button>
          </div>
        </div>
      </div>

      <div className="attendance-panel__bulk">
        <button
          type="button"
          className="attendance-panel__bulk-btn attendance-panel__bulk-btn--present"
          onClick={() => markAll('present')}
        >
          Mark all present
        </button>
        <button
          type="button"
          className="attendance-panel__bulk-btn attendance-panel__bulk-btn--absent"
          onClick={() => markAll('absent')}
        >
          Mark all absent
        </button>
      </div>

      <div className="attendance-panel__list">
        <div className="attendance-panel__row attendance-panel__row--head">
          <span className="attendance-panel__col-name">Student</span>
          <span className="attendance-panel__col-status">Status</span>
        </div>
        {students.map((student, index) => (
          <AttendanceRow
            key={student.id}
            student={student}
            status={attendance[student.id]}
            onStatusChange={(status) => setAttendance(date, student.id, status)}
            animationDelay={index * 0.04}
          />
        ))}
      </div>
    </div>
  )
}
