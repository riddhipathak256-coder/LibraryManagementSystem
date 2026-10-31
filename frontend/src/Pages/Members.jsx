import { useState, useEffect } from 'react'

function Members() {
  const [members, setMembers] = useState([])
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [editingId, setEditingId] = useState(null)

  const API_URL = 'http://localhost:5000/members'

  async function fetchMembers() {
    try {
      const response = await fetch(API_URL)
      if (!response.ok) throw new Error('Could not load members')
      const data = await response.json()
      setMembers(data)
    } catch (error) {
      console.error('Error fetching members:', error)
      alert('Members load nahi hue. Backend check karo.')
    }
  }

  useEffect(() => {
  async function loadMembers() {
    await fetchMembers()
  }
  loadMembers()
}, [])

  async function addMember(e) {
    e.preventDefault()

    if (!name.trim() || !email.trim() || !phone.trim()) {
      alert('Please fill all fields')
      return
    }

    const memberData = {
      name: name.trim(),
      email: email.trim(),
      phone: phone.trim()
    }

    try {
      const response = await fetch(
        editingId ? `${API_URL}/${editingId}` : API_URL,
        {
          method: editingId ? 'PUT' : 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(memberData)
        }
      )

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.message || 'Could not save member')
      }

      const savedMember = await response.json()

      if (editingId) {
        setMembers(members.map(member =>
          member._id === editingId ? savedMember : member
        ))
      } else {
        setMembers([...members, savedMember])
      }

      cancelEdit()
    } catch (error) {
      console.error('Error saving member:', error)
      alert(error.message)
    }
  }

  function editMember(member) {
    setName(member.name)
    setEmail(member.email)
    setPhone(member.phone)
    setEditingId(member._id)
  }

  async function deleteMember(id) {
    if (!window.confirm('Are you sure you want to delete this member?')) {
      return
    }

    try {
      const response = await fetch(`${API_URL}/${id}`, {
        method: 'DELETE'
      })

      if (!response.ok) throw new Error('Could not delete member')

      setMembers(members.filter(member => member._id !== id))

      if (editingId === id) cancelEdit()
    } catch (error) {
      console.error('Error deleting member:', error)
      alert(error.message)
    }
  }

  function cancelEdit() {
    setEditingId(null)
    setName('')
    setEmail('')
    setPhone('')
  }

  return (
    <div className="members-page">
      <h1>Library Members</h1>
      <p>Add and manage your library members.</p>

      <form className="member-form" onSubmit={addMember}>
        <input
          type="text"
          placeholder="Full Name"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <input
          type="email"
          placeholder="Email Address"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <input
          type="tel"
          placeholder="Phone Number"
          value={phone}
          onChange={e => setPhone(e.target.value)}
          required
        />

        <button type="submit">
          {editingId ? 'Update Member' : 'Add Member'}
        </button>

        {editingId && (
          <button
            type="button"
            className="cancel-btn"
            onClick={cancelEdit}
          >
            Cancel
          </button>
        )}
      </form>

      <div className="members-table-wrapper">
        <table>
          <thead>
            <tr>
              <th>Name</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Action</th>
            </tr>
          </thead>

          <tbody>
            {members.map(member => (
              <tr key={member._id}>
                <td>{member.name}</td>
                <td>{member.email}</td>
                <td>{member.phone}</td>
                <td>
                  <button
                    type="button"
                    className="edit-btn"
                    onClick={() => editMember(member)}
                  >
                    Edit
                  </button>

                  <button
                    type="button"
                    className="delete-btn"
                    onClick={() => deleteMember(member._id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}

            {members.length === 0 && (
              <tr>
                <td colSpan="4">No members added yet.</td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default Members
