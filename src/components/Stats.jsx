import './Stats.css'

function getStats(students, records) {
  const dates = Object.keys(records).sort().reverse().slice(0, 30)
  let totalPresent = 0
  let totalAbsent = 0
  let totalMarked = 0
  dates.forEach((date) => {
    const day = records[date] || {}
    Object.values(day).forEach((status) => {
      if (status === 'present') totalPresent++
      else if (status === 'absent') totalAbsent++
      totalMarked++
    })
  })
  return {
    totalStudents: students.length,
    totalPresent,
    totalAbsent,
    totalMarked,
    daysRecorded: dates.length,
  }
}

export default function Stats({ students, records }) {
  const s = getStats(students, records)

  return (
    <div className="stats" role="region" aria-label="Attendance summary">
      <div className="stats__card stats__card--students" style={{ animationDelay: '0s' }}>
        <span className="stats__value">{s.totalStudents}</span>
        <span className="stats__label">Students</span>
      </div>
      <div className="stats__card stats__card--present" style={{ animationDelay: '0.05s' }}>
        <span className="stats__value">{s.totalPresent}</span>
        <span className="stats__label">Present</span>
      </div>
      <div className="stats__card stats__card--absent" style={{ animationDelay: '0.1s' }}>
        <span className="stats__value">{s.totalAbsent}</span>
        <span className="stats__label">Absent</span>
      </div>
      <div className="stats__card stats__card--days" style={{ animationDelay: '0.15s' }}>
        <span className="stats__value">{s.daysRecorded}</span>
        <span className="stats__label">Days</span>
      </div>
    </div>
  )
}
