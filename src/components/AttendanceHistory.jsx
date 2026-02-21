import './AttendanceHistory.css'

function formatDateDisplay(iso) {
  const d = new Date(iso + 'T12:00:00')
  return d.toLocaleDateString(undefined, {
    weekday: 'short',
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}

export default function AttendanceHistory({ records, onSelectDate }) {
  const dates = Object.keys(records).sort().reverse().slice(0, 20)
  if (dates.length === 0) {
    return (
      <div className="history history--empty">
        <div className="history__title">Past dates</div>
        <div className="history__list">No attendance recorded yet.</div>
      </div>
    )
  }

  return (
    <div className="history">
      <div className="history__title">Past dates (click to load)</div>
      <ul className="history__list">
        {dates.map((date) => {
          const day = records[date] || {}
          let present = 0,
            absent = 0
          Object.values(day).forEach((s) => {
            if (s === 'present') present++
            else if (s === 'absent') absent++
          })
          const label = `${present} present, ${absent} absent`
          return (
            <li key={date}>
              <button
                type="button"
                className="history__item"
                onClick={() => onSelectDate(date)}
              >
                <span className="history__date">{formatDateDisplay(date)}</span>
                <span className="history__summary">{label}</span>
              </button>
            </li>
          )
        })}
      </ul>
    </div>
  )
}
