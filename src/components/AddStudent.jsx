import { useState, useRef } from 'react'
import './AddStudent.css'

export default function AddStudent({ onAdd }) {
  const [name, setName] = useState('')
  const [focused, setFocused] = useState(false)
  const inputRef = useRef(null)

  const handleSubmit = (e) => {
    e.preventDefault()
    onAdd(name)
    setName('')
    inputRef.current?.focus()
  }

  return (
    <form className="add-student" onSubmit={handleSubmit}>
      <div className={`add-student__field ${focused ? 'add-student__field--focused' : ''}`}>
        <input
          ref={inputRef}
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          placeholder="Student name"
          className="add-student__input"
          aria-label="Student name"
        />
        <button type="submit" className="add-student__btn" aria-label="Add student">
          <span className="add-student__btn-text">Add</span>
          <span className="add-student__btn-icon">+</span>
        </button>
      </div>
    </form>
  )
}
