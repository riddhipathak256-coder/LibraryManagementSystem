import {
  BrowserRouter,
  Routes,
  Route,
  NavLink,
  useLocation,
  useNavigate
} from 'react-router-dom'
import { useState, useEffect } from 'react'

import {
  LayoutDashboard,
  BookOpen,
  Users,
  Repeat2,
  Palette
} from 'lucide-react'

import Books from './Pages/Books'
import Members from './Pages/Members'
import Transactions from './Pages/Transactions'
import './index.css'

const themes = [
  { value: 'pink', label: '🌸 Soft Pink' },
  { value: 'blue', label: '🌊 Ocean Blue' },
  { value: 'lavender', label: '💜 Lavender' },
  { value: 'green', label: '🌿 Forest Green' },
  { value: 'beige', label: '🤎 Warm Beige' },
  { value: 'dark', label: '🌙 Dark Mode' }
]

function Dashboard() {
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalMembers: 0,
    issuedBooks: 0,
    returnedBooks: 0
  })

  useEffect(() => {
    async function fetchStats() {
      try {
        const [
          booksResponse,
          membersResponse,
          transactionsResponse
        ] = await Promise.all([
          fetch('http://localhost:5000/books'),
          fetch('http://localhost:5000/members'),
          fetch('http://localhost:5000/transactions')
        ])

        if (
          !booksResponse.ok ||
          !membersResponse.ok ||
          !transactionsResponse.ok
        ) {
          throw new Error('Could not load dashboard data')
        }

        const books = await booksResponse.json()
        const members = await membersResponse.json()
        const transactions = await transactionsResponse.json()

        setStats({
          totalBooks: books.reduce(
            (total, book) => total + (Number(book.quantity) || 0),
            0
          ),
          totalMembers: members.length,
          issuedBooks: transactions.filter(
            transaction => transaction.status === 'Issued'
          ).length,
          returnedBooks: transactions.filter(
            transaction => transaction.status === 'Returned'
          ).length
        })
      } catch (error) {
        console.error('Error loading dashboard:', error)
      }
    }

    fetchStats()
  }, [])

  return (
    <section className="dashboard-section">
      <h1>
        <LayoutDashboard size={25} />
        Welcome to Library Management System
      </h1>

      <p>Manage your books, members and transactions easily.</p>

      <div className="stats-container">
        <div className="stat-card">
          <h3><BookOpen size={19} /> Total Books</h3>
          <p>{stats.totalBooks}</p>
        </div>

        <div className="stat-card">
          <h3><Users size={19} /> Total Members</h3>
          <p>{stats.totalMembers}</p>
        </div>

        <div className="stat-card">
          <h3><Repeat2 size={19} /> Issued Books</h3>
          <p>{stats.issuedBooks}</p>
        </div>

        <div className="stat-card">
          <h3><BookOpen size={19} /> Returned Books</h3>
          <p>{stats.returnedBooks}</p>
        </div>
      </div>
    </section>
  )
}

function AppLayout() {
  const [theme, setTheme] = useState(() => {
    return localStorage.getItem('library-theme') || 'pink'
  })

  const [searchTerm, setSearchTerm] = useState('')
  const [searchResults, setSearchResults] = useState([])
  const [hasSearched, setHasSearched] = useState(false)
  const [searchPageType, setSearchPageType] = useState('books')

  const [suggestionItems, setSuggestionItems] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)

  const location = useLocation()
  const navigate = useNavigate()
  const currentPage = location.pathname
  
  useEffect(() => {
  async function loadSuggestions() {
    let apiUrl = 'http://localhost:5000/books'

    if (currentPage === '/members') {
      apiUrl = 'http://localhost:5000/members'
    } else if (currentPage === '/transactions') {
      apiUrl = 'http://localhost:5000/transactions'
    }

    try {
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error('Failed to load suggestions')
      }

      const data = await response.json()
      setSuggestionItems(data)
    } catch (error) {
      console.error('Suggestion loading error:', error)
    }
  }

  if (currentPage !== '/search') {
    loadSuggestions()
  }
}, [currentPage])



  async function handleSearch() {
    const term = searchTerm.trim().toLowerCase()

    if (!term) {
      alert('Please enter something to search')
      return
    }

    let apiUrl = 'http://localhost:5000/books'
    let fields = ['title', 'author', 'category']
    let pageType = 'books'

    if (currentPage === '/members') {
      apiUrl = 'http://localhost:5000/members'
      fields = ['name', 'email', 'phone']
      pageType = 'members'
    } else if (currentPage === '/transactions') {
      apiUrl = 'http://localhost:5000/transactions'
      fields = ['bookTitle', 'memberName', 'status']
      pageType = 'transactions'
    }

    try {
      const response = await fetch(apiUrl)

      if (!response.ok) {
        throw new Error('Could not fetch data')
      }

      const data = await response.json()

      const results = data.filter(item =>
        fields.some(field =>
          String(item[field] ?? '')
            .toLowerCase()
            .includes(term)
        )
      )

      setSearchResults(results)
      setSearchPageType(pageType)
      setHasSearched(true)
      navigate('/search')
    } catch (error) {
      console.error('Search error:', error)
      alert('Search nahi ho paayi. Backend check karo.')
    }
  }

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    localStorage.setItem('library-theme', theme)
  }, [theme])

  function goBackFromSearch() {
    setHasSearched(false)
    setSearchTerm('')
    setSearchResults([])
    navigate(-1)
  }

  return (
    <div className="app-container">
      <aside className="sidebar">
        <h2><BookOpen size={24} /> LibraryMS</h2>

        <nav>
          <NavLink to="/" end>
            <LayoutDashboard size={18} /> Dashboard
          </NavLink>

          <NavLink to="/books">
            <BookOpen size={18} /> Books
          </NavLink>

          <NavLink to="/members">
            <Users size={18} /> Members
          </NavLink>

          <NavLink to="/transactions">
            <Repeat2 size={18} /> Issue & Return
          </NavLink>
        </nav>

        <div className="sidebar-decoration">
          <div className="book-art">
            <span className="heart heart-left">♡</span>
            <BookOpen size={58} strokeWidth={1.3} />
            <span className="heart heart-right">♡</span>
          </div>

          <p>A little world of books</p>

          <div className="bottom-floral-border">
            🌸 ❀ 🌸 ❀
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="navbar">
        
<div className="dashboard-search">
  <div className="search-input-wrapper">
    <input
      type="text"
      placeholder={
        currentPage === '/members'
          ? 'Search members by name, email or phone...'
          : currentPage === '/transactions'
          ? 'Search by book, member or status...'
          : 'Search books by title, author or category...'
      }
      value={searchTerm}
      onChange={(event) => {
        setSearchTerm(event.target.value)
        setShowSuggestions(true)
      }}
      onFocus={() => setShowSuggestions(true)}
      onKeyDown={(event) => {
        if (event.key === 'Enter') {
          setShowSuggestions(false)
          handleSearch()
        }
        if (event.key === 'Escape') {
          setShowSuggestions(false)
        }
      }}
    />

    {showSuggestions && searchTerm.trim() && (
      <div className="search-suggestions">
        {suggestionItems
          .filter((item) => {
            const term = searchTerm.trim().toLowerCase()

            const fields =
              currentPage === '/members'
                ? [item.name, item.email, item.phone]
                : currentPage === '/transactions'
                ? [item.bookTitle, item.memberName, item.status]
                : [item.title, item.author, item.category]

            return fields.some((field) =>
              String(field ?? '').toLowerCase().includes(term)
            )
          })
          .slice(0, 6)
          .map((item) => {
            const label =
              currentPage === '/members'
                ? item.name
                : currentPage === '/transactions'
                ? `${item.bookTitle} — ${item.memberName}`
                : item.title

            return (
              <button
                key={item._id}
                type="button"
                onClick={() => {
                  const selectedValue =
                    currentPage === '/members'
                      ? item.name
                      : currentPage === '/transactions'
                      ? item.memberName || item.bookTitle
                      : item.title

                  setSearchTerm(selectedValue || '')
                  setShowSuggestions(false)
                }}
              >
                {label || 'Untitled'}
              </button>
            )
          })}

        {suggestionItems.filter((item) => {
          const term = searchTerm.trim().toLowerCase()
          const fields =
            currentPage === '/members'
              ? [item.name, item.email, item.phone]
              : currentPage === '/transactions'
              ? [item.bookTitle, item.memberName, item.status]
              : [item.title, item.author, item.category]

          return fields.some((field) =>
            String(field ?? '').toLowerCase().includes(term)
          )
        }).length === 0 && (
          <p style={{ padding: '10px 14px', margin: 0 }}>
            No suggestions found
          </p>
        )}
      </div>
    )}
  </div>

  <button
    type="button"
    onClick={() => {
      setShowSuggestions(false)
      handleSearch()
    }}
  >
    Search
  </button>
</div>
          <div className="theme-control">
            <Palette size={19} />

            <select
              id="theme-select"
              value={theme}
              onChange={event => setTheme(event.target.value)}
            >
              {themes.map(item => (
                <option key={item.value} value={item.value}>
                  {item.label}
                </option>
              ))}
            </select>
          </div>
        </header>

        <Routes>
          <Route
            path="/"
            element={<Dashboard />}
          />

          <Route
            path="/search"
            element={
              <section className="search-results-page">
                <button
                  className="back-to-dashboard"
                  type="button"
                  onClick={goBackFromSearch}
                >
                  ← Back
                </button>

                <h1>
                  {searchPageType === 'members'
                    ? 'Member Search Results'
                    : searchPageType === 'transactions'
                    ? 'Issue & Return Search Results'
                    : 'Book Search Results'}
                </h1>

                <p className="search-subtitle">
                  {searchPageType === 'members'
                    ? 'Find your library members'
                    : searchPageType === 'transactions'
                    ? 'Find your library transactions'
                    : 'Discover your next favourite book'}
                </p>

                {hasSearched && searchResults.length > 0 ? (
                  <div className="search-results-grid">
                    {searchResults.map(item => (
                      <div  
className={`search-result-card ${
  searchPageType === 'members'
    ? 'member-result-card'
    : searchPageType === 'transactions'
    ? 'transaction-result-card'
    : ''
}`}>
    {searchPageType === 'books' && (
    <div className="search-book-cover">
    <img
src={`https://covers.openlibrary.org/b/title/${encodeURIComponent(item.title || '')}-M.jpg?default=false`}
   alt={`${item.title} book cover`}
   onError={event => {
       event.currentTarget.style.display = 'none'
         event.currentTarget.nextElementSibling.style.display = 'block'
             }}
       />

                            <span className="cover-book-icon">
                              📚
                            </span>
                          </div>
                        )}
<div className="search-book-info">
  <h3>
    {item.title || item.bookTitle || item.name || 'Untitled'}
  </h3>

  {/* Member Search Details */}
  {searchPageType === 'members' && (
    <div className="member-details">
      <p>
        <strong>Email:</strong>
        <span>{item.email || 'Not available'}</span>
      </p>

      <p>
        <strong>Phone:</strong>
        <span>{item.phone || 'Not available'}</span>
      </p>
    </div>
  )}

  {/* Transaction Search Details */}
  {searchPageType === 'transactions' && (
    <div className="transaction-details">
      <p>
        <strong>Book:</strong>
        <span>{item.bookTitle || 'Not available'}</span>
      </p>

      <p>
        <strong>Member:</strong>
        <span>{item.memberName || 'Not available'}</span>
      </p>

      <p>
        <strong>Issue Date:</strong>
        <span>
          {item.issueDate
            ? new Date(item.issueDate).toLocaleDateString('en-GB')
            : 'Not available'}
        </span>
      </p>

      <p>
        <strong>Due Date:</strong>
        <span>
          {item.dueDate
            ? new Date(item.dueDate).toLocaleDateString('en-GB')
            : 'Not available'}
        </span>
      </p>

      <p>
        <strong>Status:</strong>
        <span className="transaction-status">
          {item.status || 'Not available'}
        </span>
      </p>
    </div>
  )}

  {/* Book Search Details */}
  {searchPageType === 'books' && (
    <>
      {item.author && (
        <p><strong>Author:</strong> {item.author}</p>
      )}

      {item.category && (
        <p><strong>Category:</strong> {item.category}</p>
      )}

      {item.quantity !== undefined && (
        <p><strong>Quantity:</strong> {item.quantity}</p>
      )}
    </>
  )}
</div>
                   
                      </div>
                    ))}
                  </div>
                ) : (
                  <p className="no-search-results">
                    No matching results found. Try another search.
                  </p>
                )}
              </section>
            }
          />

          <Route path="/books" element={<Books />} />
          <Route path="/members" element={<Members />} />
          <Route path="/transactions" element={<Transactions />} />
        </Routes>
      </main>
    </div>
  )
}

function App() {
  return (
    <BrowserRouter>
      <AppLayout />
    </BrowserRouter>
  )
}

export default App
