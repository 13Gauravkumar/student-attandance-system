import { useState, useEffect, useMemo } from 'react'
import AddStudent from './components/AddStudent'
import SearchStudents from './components/SearchStudents'
import StudentList from './components/StudentList'
import AttendancePanel from './components/AttendancePanel'
import Stats from './components/Stats'
import ClearDataModal from './components/ClearDataModal'
import './App.css'

const STORAGE_KEYS = {
  students: 'attendance_students',
  records: 'attendance_records',
  theme: 'attendance_theme',
}

function loadFromStorage(key, fallback) {
  try {
    const raw = localStorage.getItem(key)
    return raw ? JSON.parse(raw) : fallback
  } catch {
    return fallback
  }
}

function saveToStorage(key, data) {
  try {
    localStorage.setItem(key, JSON.stringify(data))
  } catch (_) {}
}

export default function App() {
  const [students, setStudents] = useState(() => loadFromStorage(STORAGE_KEYS.students, []))
  const [records, setRecords] = useState(() => loadFromStorage(STORAGE_KEYS.records, {}))
  const [activeTab, setActiveTab] = useState('students')
  const [searchQuery, setSearchQuery] = useState('')
  const [theme, setTheme] = useState(() => localStorage.getItem(STORAGE_KEYS.theme) || 'dark')
  const [showClearModal, setShowClearModal] = useState(false)

  const filteredStudents = useMemo(() => {
    const q = searchQuery.trim().toLowerCase()
    if (!q) return students
    return students.filter((s) => s.name.toLowerCase().includes(q))
  }, [students, searchQuery])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.students, students)
  }, [students])

  useEffect(() => {
    saveToStorage(STORAGE_KEYS.records, records)
  }, [records])

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem(STORAGE_KEYS.theme, theme)
  }, [theme])

  const addStudent = (name) => {
    const trimmed = name.trim()
    if (!trimmed) return
    setStudents((prev) => [...prev, { id: crypto.randomUUID(), name: trimmed }])
  }

  const removeStudent = (id) => {
    setStudents((prev) => prev.filter((s) => s.id !== id))
    setRecords((prev) => {
      const next = { ...prev }
      Object.keys(next).forEach((date) => {
        const day = { ...next[date] }
        delete day[id]
        if (Object.keys(day).length === 0) delete next[date]
        else next[date] = day
      })
      return next
    })
  }

  const setAttendance = (date, studentId, status) => {
    setRecords((prev) => ({
      ...prev,
      [date]: {
        ...(prev[date] || {}),
        [studentId]: status,
      },
    }))
  }

  const getAttendance = (date) => records[date] || {}

  const today = new Date().toISOString().slice(0, 10)

  const exportCSV = () => {
    const rows = [['Date', 'Student', 'Status']]
    const dates = Object.keys(records).sort()
    dates.forEach((date) => {
      const day = records[date] || {}
      students.forEach((s) => {
        const status = day[s.id] || ''
        if (status) rows.push([date, s.name, status])
      })
    })
    const csv = rows
      .map((r) => r.map((c) => '"' + String(c).replace(/"/g, '""') + '"').join(','))
      .join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `attendance-${today}.csv`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const exportJSON = () => {
    const data = {
      students,
      records,
      exported: new Date().toISOString(),
    }
    const blob = new Blob([JSON.stringify(data, null, 2)], {
      type: 'application/json',
    })
    const a = document.createElement('a')
    a.href = URL.createObjectURL(blob)
    a.download = `attendance-${today}.json`
    a.click()
    URL.revokeObjectURL(a.href)
  }

  const clearAllData = () => {
    setStudents([])
    setRecords({})
    setShowClearModal(false)
  }

  return (
    <>
      <div className="app-bg" aria-hidden="true" />
      <div className="app">
        <header className="header">
          <h1 className="header-title">
            <span className="header-icon" aria-hidden="true">
              ✓
            </span>
            Student Attendance
          </h1>
          <p className="header-sub">Mark and track attendance — all in the browser</p>
          <div className="header-actions">
            <button
              type="button"
              className="header-btn theme-toggle"
              onClick={() => setTheme((t) => (t === 'dark' ? 'light' : 'dark'))}
              aria-label="Toggle theme"
              title={theme === 'dark' ? 'Switch to light' : 'Switch to dark'}
            >
              {theme === 'dark' ? '🌙' : '☀️'}
            </button>
            <button type="button" className="header-btn" onClick={exportCSV}>
              Export CSV
            </button>
            <button type="button" className="header-btn" onClick={exportJSON}>
              Export JSON
            </button>
            <button
              type="button"
              className="header-btn header-btn--danger"
              onClick={() => setShowClearModal(true)}
            >
              Clear data
            </button>
          </div>
        </header>

        <nav className="tabs">
          <button
            className={`tab ${activeTab === 'students' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('students')}
          >
            Students
          </button>
          <button
            className={`tab ${activeTab === 'attendance' ? 'tab--active' : ''}`}
            onClick={() => setActiveTab('attendance')}
          >
            Attendance
          </button>
        </nav>

        <main className="main">
          {activeTab === 'students' && (
            <section className="section section--students" key="students">
              <SearchStudents value={searchQuery} onChange={setSearchQuery} />
              <AddStudent onAdd={addStudent} />
              <StudentList
                students={filteredStudents}
                records={records}
                onRemove={removeStudent}
                isFiltered={searchQuery.trim().length > 0}
              />
            </section>
          )}
          {activeTab === 'attendance' && (
            <section className="section section--attendance" key="attendance">
              <Stats students={students} records={records} />
              <AttendancePanel
                students={students}
                defaultDate={today}
                getAttendance={getAttendance}
                setAttendance={setAttendance}
                records={records}
              />
            </section>
          )}
        </main>
      </div>

      {showClearModal && (
        <ClearDataModal
          onConfirm={clearAllData}
          onCancel={() => setShowClearModal(false)}
        />
      )}
    </>
  )
}
