import {useNavigate} from "react-router-dom";
import {useAppDispatch, useAppSelector} from "../app/hooks.ts";
import {registerUser} from "../features/auth/authSlice.ts";
import {useState} from "react";


const RegisterPage = () => {
    const dispatch = useAppDispatch()
    const navigate = useNavigate();
    const { loading, error } = useAppSelector((state)=>state.auth)

    const [form, setForm] = useState({ email: '', password: '' })

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setForm({ ...form, [e.target.name]: e.target.value })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        const res = await dispatch(registerUser(form))
        if (registerUser.fulfilled.match(res)) {
            navigate('/login')
        }
    }

    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
            <div className="bg-white shadow-md rounded-lg p-8 w-96">
                <h2 className="text-2xl font-semibold text-center mb-6">Реєстрація</h2>

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-gray-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <div>
                        <label className="block text-gray-700 mb-1">Пароль</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            className="w-full border rounded px-3 py-2 focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
                    >
                        {loading ? 'Реєстрація...' : 'Зареєструватися'}
                    </button>

                    {error && <p className="text-red-600 text-center">{error}</p>}
                </form>

                <p className="text-center text-sm mt-4">
                    Вже маєте акаунт?{' '}
                    <span
                        onClick={() => navigate('/login')}
                        className="text-blue-600 hover:underline cursor-pointer"
                    >
                        Увійти
                    </span>
                </p>
            </div>
        </div>
    );
};

export default RegisterPage;