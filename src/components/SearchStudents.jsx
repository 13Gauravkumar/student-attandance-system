import './SearchStudents.css'

export default function SearchStudents({ value, onChange }) {
  return (
    <div className="search-box">
      <input
        type="text"
        className="search-box__input"
        placeholder="Search students by name..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Search students"
      />
    </div>
  )
}
