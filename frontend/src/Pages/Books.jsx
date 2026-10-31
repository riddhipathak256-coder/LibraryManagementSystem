import { useState, useEffect } from 'react'

function Books() {
  const [books, setBooks] = useState([])
  const [title, setTitle] = useState('')
  const [author, setAuthor] = useState('')
  const [category, setCategory] = useState('')
  const [quantity, setQuantity] = useState('')
  const [editingId, setEditingId] = useState(null)
  const [image, setImage] = useState('')

  //    MongoDB se books load karna

  useEffect(() => {
    fetch('http://localhost:5000/books')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch books')
        }
        return response.json()
      })
      .then(data => setBooks(data))
      .catch(error => console.error('Error fetching books:', error))
  }, [])

  //    Book add ya update karna

  async function addBook(e) {
    e.preventDefault()

    if (
      !title.trim() ||
      !author.trim() ||
      !category.trim() ||
      quantity === '' ||
      !Number.isInteger(Number(quantity)) ||
      Number(quantity) < 1
    ) {
      alert('Please fill all fields correctly')
      return
    }

    const bookData = {
    title: title.trim(),
    author: author.trim(),
    category: category.trim(),
    quantity: Number(quantity),
    image: image.trim()
}

    try {
      const url = editingId
        ? `http://localhost:5000/books/${editingId}`
        : 'http://localhost:5000/books'

      const response = await fetch(url, {
        method: editingId ? 'PUT' : 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(bookData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Could not save book')
      }

      const savedBook = await response.json()

      if (editingId) {
        setBooks(books.map(book =>
          book._id === editingId ? savedBook : book
        ))
      } else {
        setBooks([...books, savedBook])
      }

      setTitle('')
      setAuthor('')
      setCategory('')
      setQuantity('')
      setImage('')
      setEditingId(null)
    } catch (error) {
      console.error('Error saving book:', error)
      alert(error.message || 'Book save nahi hui. Please try again.')
    }
  }

  // Book edit karne ke liye form mein details lana

  function editBook(book) {
    setTitle(book.title)
    setAuthor(book.author)
    setCategory(book.category)
    setQuantity(String(book.quantity))
    setImage(book.image || '')
    setEditingId(book._id)
  }

  // Book delete karna
  
  async function deleteBook(id) {
    if (!window.confirm('Are you sure you want to delete this book?')) {
      return
    }

    try {
      const response = await fetch(`http://localhost:5000/books/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) {
        throw new Error('Book delete nahi hui')
      }

      setBooks(books.filter(book => book._id !== id))

      if (editingId === id) {
        setTitle('')
        setAuthor('')
        setCategory('')
        setQuantity('')
        setImage('')
        setEditingId(null)
      }
    } catch (error) {
      console.error('Error deleting book:', error)
      alert(error.message)
    }
  }

  return (
    <div className="books-page">
      <h1>Book Management</h1>
      <p>Add and manage your library books.</p>

      <form className="book-form" onSubmit={addBook}>
        <input
          placeholder="Book Title"
          value={title}
          onChange={e => setTitle(e.target.value)}
        />

        <input
          placeholder="Author Name"
          value={author}
          onChange={e => setAuthor(e.target.value)}
        />

        <input
          placeholder="Category"
          value={category}
          onChange={e => setCategory(e.target.value)}
        />

        <input
          type="number"
          min="1"
          step="1"
          placeholder="Quantity"
          value={quantity}
          onChange={e => setQuantity(e.target.value)}
        />
        <input
          type="url"
          placeholder="Book Cover Image URL"
          value={image}
          onChange={e => setImage(e.target.value)}
        />

        <button type="submit">
          {editingId ? 'Update Book' : 'Add Book'}
        </button>
      </form>

      <div className="books-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Title</th>
              <th>Author</th>
              <th>Category</th>
              <th>Quantity</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {books.map(book => (
              <tr key={book._id}>
                <td>
                 <div className="book-title-cell">
                 <img
                  className="book-cover"
                src={`https://covers.openlibrary.org/b/title/${encodeURIComponent(book.title)}-L.jpg`}
                   onError={(e) => {
                   e.currentTarget.style.display = 'none'
              }}
             />
              <span>{book.title}</span>
           </div>
       </td>
                <td>{book.author}</td>
                <td>{book.category}</td>
                <td>{book.quantity}</td>
                <td>
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => editBook(book)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteBook(book._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {books.length === 0 && (
              <tr>
                <td colSpan="5">No books added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Books
