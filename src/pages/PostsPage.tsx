import React, { useEffect, useState } from 'react'
import { useAppDispatch, useAppSelector } from '../app/hooks'
import { fetchPosts, deletePost, createPost } from '../features/posts/postsSlice'
import { useNavigate } from 'react-router-dom'

const PostsPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate()
    const { items, loading, error } = useAppSelector((state) => state.posts)
    const { token } = useAppSelector((state) => state.auth)

    const [showModal, setShowModal] = useState(false)
    const [form, setForm] = useState({ title: '', text: '' })

    useEffect(() => {
        if (!token) {
            navigate('/login')
            return
        }
        dispatch(fetchPosts())
    }, [dispatch, token, navigate])

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        await dispatch(createPost(form))
        setForm({ title: '', text: '' })
        setShowModal(false)
    }

    if (loading) return <p>Завантаження постів...</p>
    if (error) return <p style={{ color: 'red' }}>{error}</p>

    return (
        <div className="min-h-screen bg-gray-50 py-10">
            <div className="max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold text-center mb-6 text-gray-800">Мої пости</h2>

                <div className="flex justify-end mb-6">
                    <button
                        onClick={() => setShowModal(true)}
                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                    >
                        ➕ Додати пост
                    </button>
                </div>

                {loading && <p className="text-center text-gray-500">Завантаження постів...</p>}
                {error && <p className="text-center text-red-600">{error}</p>}

                <ul className="space-y-4">
                    {items.map((post) => (
                        <li key={post._id} className="bg-white shadow p-4 rounded-lg">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="text-lg font-semibold text-gray-800">{post.title}</h3>
                                    <p className="text-gray-700 mt-1">{post.text}</p>
                                </div>
                                <button
                                    onClick={() => dispatch(deletePost(post._id))}
                                    className="text-sm text-red-500 hover:text-red-700"
                                >
                                    Видалити
                                </button>
                            </div>
                            <p className="text-gray-400 text-sm mt-2">
                                {post.createdAt
                                    ? new Date(post.createdAt).toLocaleString()
                                    : '—'}
                            </p>
                        </li>
                    ))}
                </ul>

                {items.length === 0 && !loading && (
                    <p className="text-center text-gray-500 mt-6">Поки немає постів</p>
                )}

                {showModal && (
                    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
                        <div className="bg-white rounded-lg shadow-lg w-96 p-6">
                            <h3 className="text-xl font-semibold mb-4">Новий пост</h3>
                            <form onSubmit={handleSubmit} className="space-y-3">
                                <input
                                    type="text"
                                    placeholder="Заголовок"
                                    value={form.title}
                                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                                    className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-200"
                                    required
                                />
                                <textarea
                                    placeholder="Текст поста"
                                    value={form.text}
                                    onChange={(e) => setForm({ ...form, text: e.target.value })}
                                    rows={4}
                                    className="w-full border px-3 py-2 rounded focus:ring focus:ring-blue-200"
                                    required
                                ></textarea>
                                <div className="flex justify-between pt-2">
                                    <button
                                        type="submit"
                                        className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 transition"
                                    >
                                        Зберегти
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowModal(false)}
                                        className="bg-gray-300 px-4 py-2 rounded hover:bg-gray-400 transition"
                                    >
                                        Скасувати
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                )}
            </div>
        </div>
    )
}

export default PostsPage
