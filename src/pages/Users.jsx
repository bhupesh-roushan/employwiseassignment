import { useState, useEffect, useRef, useCallback } from 'react';
import { useAuth } from '../contexts/AuthContext.jsx';
import { getUsers, updateUser, deleteUser } from '../services/api.js';
import toast from 'react-hot-toast';

export default function Users() {
  const [users, setUsers] = useState([]);
  const [modifiedUsers, setModifiedUsers] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingUser, setEditingUser] = useState(null);
  const [hasMore, setHasMore] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [deletingUserId, setDeletingUserId] = useState(null);
  const observer = useRef();
  const { logout } = useAuth();

  // Filter users based on search query
  const filteredUsers = users.filter(user => {
    const searchLower = searchQuery.toLowerCase();
    return (
      user.first_name.toLowerCase().includes(searchLower) ||
      user.last_name.toLowerCase().includes(searchLower) ||
      user.email.toLowerCase().includes(searchLower)
    );
  });

  const lastUserRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        setCurrentPage(prevPage => prevPage + 1);
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, hasMore]);

  useEffect(() => {
    fetchUsers();
  }, [currentPage]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      // Add longer artificial delay to make loading state more visible
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const response = await getUsers(currentPage);
      
      // Apply any modifications to the fetched users
      const modifiedData = response.data.map(user => 
        modifiedUsers[user.id] || user
      );

      // Append new users to existing ones, but only if they don't already exist
      setUsers(prevUsers => {
        const existingIds = new Set(prevUsers.map(user => user.id));
        const newUsers = modifiedData.filter(user => !existingIds.has(user.id));
        return [...prevUsers, ...newUsers];
      });
      
      setTotalPages(response.total_pages);
      setHasMore(currentPage < response.total_pages);
    } catch (err) {
      setError(err.error || 'Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (user) => {
    setEditingUser(user);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    try {
      await updateUser(editingUser.id, editingUser);
      
      // Store the modified user in our local state
      setModifiedUsers(prev => ({
        ...prev,
        [editingUser.id]: editingUser
      }));
      
      // Update the user in the users list
      setUsers(users.map(user => 
        user.id === editingUser.id ? editingUser : user
      ));
      
      setEditingUser(null);
      setError('');
      toast.success('User updated successfully!');
    } catch (err) {
      setError(err.error || 'Failed to update user');
      toast.error('Failed to update user');
    }
  };

  const handleDelete = async (id) => {
    setDeletingUserId(id);
  };

  const confirmDelete = async () => {
    try {
      await deleteUser(deletingUserId);
      // Remove the user from modified users
      setModifiedUsers(prev => {
        const newModifiedUsers = { ...prev };
        delete newModifiedUsers[deletingUserId];
        return newModifiedUsers;
      });
      // Update the users list
      setUsers(prevUsers => prevUsers.filter(user => user.id !== deletingUserId));
      
      // If we're on the first page and delete the last user, fetch more users
      if (currentPage === 1 && users.length <= 6) {
        fetchUsers();
      }
      toast.success('User deleted successfully!');
    } catch (err) {
      setError(err.error || 'Failed to delete user');
      toast.error('Failed to delete user');
    } finally {
      setDeletingUserId(null);
    }
  };

  const cancelDelete = () => {
    setDeletingUserId(null);
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg mb-6">
          {error}
        </div>
      )}

      {/* Search Bar */}
      <div className="mb-8">
        <div className="relative">
          <input
            type="text"
            placeholder="Search users by name or email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full px-4 py-3 pl-12 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        {searchQuery && (
          <p className="mt-2 text-sm text-gray-600">
            Found {filteredUsers.length} {filteredUsers.length === 1 ? 'user' : 'users'}
          </p>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredUsers.map((user, index) => (
          <div
            key={user.id}
            ref={index === filteredUsers.length - 1 ? lastUserRef : null}
            className="bg-white p-6 rounded-xl shadow-md hover:shadow-lg transition-all duration-300 transform hover:-translate-y-1"
          >
            {editingUser?.id === user.id ? (
              <form onSubmit={handleUpdate} className="space-y-4">
                <div className="flex flex-col items-center mb-6">
                  <img
                    src={editingUser.avatar}
                    alt={`${editingUser.first_name} ${editingUser.last_name}`}
                    className="w-24 h-24 rounded-full border-4 border-indigo-100 shadow-md mb-4"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    First Name
                  </label>
                  <input
                    type="text"
                    value={editingUser.first_name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, first_name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="First Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Last Name
                  </label>
                  <input
                    type="text"
                    value={editingUser.last_name}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, last_name: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Last Name"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">
                    Email
                  </label>
                  <input
                    type="email"
                    value={editingUser.email}
                    onChange={(e) =>
                      setEditingUser({ ...editingUser, email: e.target.value })
                    }
                    className="w-full p-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition duration-150 ease-in-out"
                    placeholder="Email"
                  />
                </div>
                <div className="flex space-x-3">
                  <button
                    type="submit"
                    className="flex-1 bg-gradient-to-r from-emerald-500 to-teal-500 text-white px-4 py-2 rounded-lg hover:from-emerald-600 hover:to-teal-600 transition duration-150 ease-in-out transform hover:scale-[1.02] shadow-md"
                  >
                    Save
                  </button>
                  <button
                    type="button"
                    onClick={() => setEditingUser(null)}
                    className="flex-1 bg-gradient-to-r from-slate-500 to-gray-500 text-white px-4 py-2 rounded-lg hover:from-slate-600 hover:to-gray-600 transition duration-150 ease-in-out transform hover:scale-[1.02] shadow-md"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            ) : (
              <>
                <div className="flex flex-col items-center">
                  <img
                    src={user.avatar}
                    alt={`${user.first_name} ${user.last_name}`}
                    className="w-24 h-24 rounded-full border-4 border-indigo-100 shadow-md mb-4"
                  />
                  <h2 className="text-xl font-semibold text-gray-900">
                    {user.first_name} {user.last_name}
                  </h2>
                  <p className="text-gray-600 mb-6">{user.email}</p>
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleEdit(user)}
                      className="bg-gradient-to-r from-blue-500 to-indigo-500 text-white px-4 py-2 rounded-lg hover:from-blue-600 hover:to-indigo-600 transition duration-150 ease-in-out transform hover:scale-[1.02] shadow-md"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-2 rounded-lg hover:from-rose-600 hover:to-pink-600 transition duration-150 ease-in-out transform hover:scale-[1.02] shadow-md"
                    >
                      Delete
                    </button>
                  </div>
                </div>
              </>
            )}
          </div>
        ))}
      </div>

      {/* Delete Confirmation Dialog */}
      {deletingUserId && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl p-6 max-w-md w-full mx-4 shadow-2xl transform transition-all">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-red-100 mb-4">
                <svg className="h-6 w-6 text-red-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Delete User
              </h3>
              <p className="text-sm text-gray-500 mb-6">
                Are you sure you want to delete this user? This action cannot be undone.
              </p>
            </div>
            <div className="flex justify-end space-x-3">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500 transition duration-150 ease-in-out"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 text-sm font-medium text-white bg-gradient-to-r from-red-500 to-rose-500 rounded-lg hover:from-red-600 hover:to-rose-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition duration-150 ease-in-out transform hover:scale-[1.02] shadow-md"
              >
                Delete
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-4 border-indigo-500 border-t-transparent"></div>
          <p className="mt-4 text-gray-600 text-lg">Loading more users...</p>
        </div>
      )}

      {!hasMore && users.length > 0 && filteredUsers.length === 0 && (
        <div className="text-center py-8 text-gray-600 text-lg">
          No users found matching your search
        </div>
      )}

      {!hasMore && users.length > 0 && filteredUsers.length > 0 && (
        <div className="text-center py-8 text-gray-600 text-lg">
          No more users to load
        </div>
      )}
    </div>
  );
} 