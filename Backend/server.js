const express = require('express')
const cors = require('cors')
const mongoose = require('mongoose')
require('dotenv').config()

const Book = require('./models/books')
const Member = require('./models/members')
const Transaction = require('./models/transactions')


const app = express()
const PORT = 5000

// Middleware
app.use(cors())
app.use(express.json())

// Test API route
app.get('/', (req, res) => {
  res.send('Library Management System Backend is running!')
})

app.get('/test-members', (req, res) => {
  res.send('Members test route is working!')
})

// Add a new book

app.post('/books', async (req, res) => {
  try {
    const book = new Book({
      title: req.body.title,
      author: req.body.author,
      category: req.body.category,
      quantity: req.body.quantity
    })

    const savedBook = await book.save()
    res.status(201).json(savedBook)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})


// Get all books
app.get('/books', async (req, res) => {
  try {
    const books = await Book.find()
    res.json(books)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

 // Update a book
app.put('/books/:id', async (req, res) => {
  try {
    const updatedBook = await Book.findByIdAndUpdate(
      req.params.id,
      {
  title: req.body.title,
  author: req.body.author,
  category: req.body.category,
  quantity: req.body.quantity
},
      { new: true, runValidators: true }
    )

    if (!updatedBook) {
      return res.status(404).json({ message: 'Book not found' })
    }

    res.json(updatedBook)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

 // Delete a book
app.delete('/books/:id', async (req, res) => {
  try {
    const deletedBook = await Book.findByIdAndDelete(req.params.id)

    if (!deletedBook) {
      return res.status(404).json({ message: 'Book not found' })
    }

    res.json({ message: 'Book deleted successfully', deletedBook })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Add a new member
app.post('/members', async (req, res) => {
  try {
    const member = new Member({
      name: req.body.name,
      email: req.body.email,
      phone: req.body.phone
    })

    const savedMember = await member.save()
    res.status(201).json(savedMember)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all members
app.get('/members', async (req, res) => {
  try {
    const members = await Member.find()
    res.json(members)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Update a member
app.put('/members/:id', async (req, res) => {
  try {
    const updatedMember = await Member.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        email: req.body.email,
        phone: req.body.phone
      },
      { new: true, runValidators: true }
    )

    if (!updatedMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    res.json(updatedMember)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Delete a member
app.delete('/members/:id', async (req, res) => {
  try {
    const deletedMember = await Member.findByIdAndDelete(req.params.id)

    if (!deletedMember) {
      return res.status(404).json({ message: 'Member not found' })
    }

    res.json({ message: 'Member deleted successfully', deletedMember })
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Issue a book
app.post('/transactions', async (req, res) => {
  try {
    const { bookTitle, memberName, issueDate, dueDate } = req.body

    if (!bookTitle || !memberName || !issueDate || !dueDate) {
      return res.status(400).json({
        message: 'Please fill all fields'
      })
    }

    if (new Date(dueDate) < new Date(issueDate)) {
      return res.status(400).json({
        message: 'Due date cannot be before issue date'
      })
    }
 const allBooks = await Book.find()

const searchTitle = bookTitle.trim().toLowerCase()

const book = allBooks.find(
  item => item.title.trim().toLowerCase() === searchTitle
)

    if (!book) {
    return res.status(404).json({
    message: 'Book not found'
  })
}

if (book.quantity <= 0) {
  return res.status(400).json({
    message: 'This book is currently out of stock'
  })
}
  book.quantity -= 1
  book.available = book.quantity > 0

  await book.save()

    const transaction = new Transaction({
      bookTitle,
      memberName,
      issueDate,
      dueDate,
      status: 'Issued'
    })

     try {
      const savedTransaction = await transaction.save()
      res.status(201).json(savedTransaction)
}    catch (error) {
       book.quantity += 1
       book.available = true
       await book.save()
       throw error
}
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Get all transactions
app.get('/transactions', async (req, res) => {
  try {
    const transactions = await Transaction.find()
    res.json(transactions)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})

// Return a book

app.put('/transactions/:id/return', async (req, res) => {
  try {
    const transaction = await Transaction.findById(req.params.id)

    if (!transaction) {
      return res.status(404).json({
        message: 'Transaction not found'
      })
    }

    if (transaction.status === 'Returned') {
      return res.status(400).json({
        message: 'This book has already been returned'
      })
    }

  const book = await Book.findOne({
  title: {
    $regex: `^${transaction.bookTitle.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}$`,
    $options: 'i'
  }
})

    if (!book) {
      return res.status(404).json({
        message: 'Book not found'
      })
    }

    book.quantity += 1
    book.available = book.quantity > 0
    await book.save()

    transaction.status = 'Returned'
    await transaction.save()

    res.json(transaction)
  } catch (error) {
    res.status(500).json({ message: error.message })
  }
})




// Connect MongoDB and start server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('MongoDB connected successfully!')

    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`)
    })
  })
  .catch((err) => {
    console.error('MongoDB connection failed:', err.message)
  })
