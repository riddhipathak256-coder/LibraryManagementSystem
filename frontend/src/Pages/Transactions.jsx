import { useState, useEffect } from 'react'

function Transactions() {
  const [transactions, setTransactions] = useState([])
    useEffect(() => {
    async function fetchTransactions() {
      try {
        const response = await fetch('http://localhost:5000/transactions')
        const data = await response.json()
        setTransactions(data)
      } catch (error) {
        console.error('Error fetching transactions:', error)
      }
    }

    fetchTransactions()
  }, [])
  const [bookTitle, setBookTitle] = useState('')
  const [memberName, setMemberName] = useState('')
  const [issueDate, setIssueDate] = useState('')
  const [dueDate, setDueDate] = useState('')
 
async function issueBook(e) {
  e.preventDefault()

  if (!bookTitle.trim() || !memberName.trim() || !issueDate || !dueDate) {
    alert('Please fill all fields')
    return
  }

  if (dueDate < issueDate) {
    alert('Due date cannot be before issue date')
    return
  }

  try {
    const response = await fetch('http://localhost:5000/transactions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        bookTitle: bookTitle.trim(),
        memberName: memberName.trim(),
        issueDate,
        dueDate
      })
    })

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Could not issue book')
    }

    setTransactions([...transactions, data])

    setBookTitle('')
    setMemberName('')
    setIssueDate('')
    setDueDate('')

    alert('Book issued successfully!')
  } catch (error) {
    console.error('Error issuing book:', error)
    alert(error.message)
  }
}
  
async function returnBook(id) {
  try {
    const response = await fetch(
      `http://localhost:5000/transactions/${id}/return`,
      { method: 'PUT' }
    )

    const data = await response.json()

    if (!response.ok) {
      throw new Error(data.message || 'Could not return book')
    }

    setTransactions(
      transactions.map(transaction =>
        transaction._id === data._id ? data : transaction
      )
    )

    alert('Book returned successfully!')
  } catch (error) {
    console.error('Error returning book:', error)
    alert(error.message)
  }
}


  return (
    <section className="transactions-page">
      <h1>Issue & Return Books</h1>
      <p>Manage book issues and returns.</p>

      <form className="transaction-form" onSubmit={issueBook}>
        <input
          type="text"
          placeholder="Book Title"
          value={bookTitle}
          onChange={e => setBookTitle(e.target.value)}
          required
        />

        <input
          type="text"
          placeholder="Member Name"
          value={memberName}
          onChange={e => setMemberName(e.target.value)}
          required
        />

        <label>
          Issue Date
          <input
            type="date"
            value={issueDate}
            onChange={e => setIssueDate(e.target.value)}
            required
          />
        </label>

        <label>
          Due Date
          <input
            type="date"
            value={dueDate}
            min={issueDate || undefined}
            onChange={e => setDueDate(e.target.value)}
            required
          />
        </label>

        <button type="submit">Issue Book</button>
      </form>

      <div className="transactions-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Book</th>
              <th>Member</th>
              <th>Issue Date</th>
              <th>Due Date</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id}>
                <td>{transaction.bookTitle}</td>
                <td>{transaction.memberName}</td>
                <td>{new Date(transaction.issueDate).toLocaleDateString('en-GB')}</td>
                <td>{new Date(transaction.dueDate).toLocaleDateString('en-GB')}</td>
                <td>{transaction.status}</td>
                <td>
                  {transaction.status === 'Issued' ? (
                    <button
                      type="button"
                      className="return-btn"
                      onClick={() => returnBook(transaction._id)}
                    >
                      Return
                    </button>
                  ) : (
                    'Completed'
                  )}
                </td>
              </tr>
            ))}

            {transactions.length === 0 && (
              <tr>
                <td colSpan="6">No transactions yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </section>
  )
}

export default Transactions
