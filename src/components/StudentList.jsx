import './StudentList.css'

function getStudentPct(records, studentId) {
  const dates = Object.keys(records)
  if (dates.length === 0) return null
  let present = 0,
    total = 0
  dates.forEach((date) => {
    const status = (records[date] || {})[studentId]
    if (status === 'present') {
      present++
      total++
    } else if (status === 'absent') total++
  })
  if (total === 0) return null
  return { pct: Math.round((present / total) * 100), present, total }
}

export default function StudentList({ students, records = {}, onRemove, isFiltered }) {
  if (students.length === 0) {
    return (
      <div className="student-list student-list--empty" role="status">
        {isFiltered ? (
          <p className="student-list__empty-text">No students match your search</p>
        ) : (
          <>
            <div className="student-list__empty-icon">👋</div>
            <p className="student-list__empty-text">No students yet</p>
            <p className="student-list__empty-hint">Add a name above to get started</p>
          </>
        )}
      </div>
    )
  }

  return (
    <ul className="student-list" aria-label="Student list">
      {students.map((student, index) => {
        const pct = getStudentPct(records, student.id)
        return (
          <li
            key={student.id}
            className="student-list__item"
            style={{ animationDelay: `${index * 0.05}s` }}
          >
            <div className="student-list__main">
              <span className="student-list__name">{student.name}</span>
              {pct && (
                <div
                  className={
                    'student-list__pct ' +
                    (pct.pct >= 75 ? 'student-list__pct--good' : 'student-list__pct--low')
                  }
                >
                  {pct.pct}% present ({pct.present}/{pct.total} days)
                </div>
              )}
            </div>
            <button
              type="button"
              className="student-list__remove"
              onClick={() => onRemove(student.id)}
              aria-label={`Remove ${student.name}`}
            >
              <span className="student-list__remove-icon">×</span>
            </button>
          </li>
        )
      })}
    </ul>
  )
}
