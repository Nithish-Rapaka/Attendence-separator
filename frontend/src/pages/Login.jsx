import React, { useState } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useNavigate } from "react-router-dom"
import img from '../assets/login.jpg'
import api from '../utils/axios'


export default function Login() {
    const [formData, setFormData] = useState({ id: "", password: "" });
    const [showPassword, setShowPassword] = useState(false);
    const [message, setMessage] = useState('')
    const navigate = useNavigate();
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/login', formData);
            alert('Login successful!');
            localStorage.setItem('token', res.data.token);
            localStorage.setItem("user", JSON.stringify(res.data));
            setMessage('Login Success!');
            navigate('/dashboard')
        }
        catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed')
            alert('Login failed: ' + (err.response?.data?.message || 'Unknown error'));
        }
    };

    return (
        <div
            className="h-screen bg-cover bg-center"
            style={{ backgroundImage: `url(${img})` }}
        >
            <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4">
                <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                    <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Login
                </h2>
                    <form onSubmit={handleSubmit} className="space-y-5">
                        <div>
                            <input
                                type="text"
                                name="id"
                                value={formData.id}
                                onChange={handleChange}
                                required
                                placeholder="Enter your id"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                            />
                        </div>
                        <div className="relative">
                            <input
                                type={showPassword ? "text" : "password"}
                                name="password"
                                value={formData.password}
                                onChange={handleChange}
                                required
                                placeholder="Enter your Password"
                                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none pr-12"
                            />
                            <div
                                className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                                onClick={() => setShowPassword(!showPassword)}
                            >
                                {showPassword ? <FaEyeSlash /> : <FaEye />}
                            </div>
                        </div>
                        <div className="flex items-center gap-2 ml-60">
                        <p>NewUser?</p><span><a href="signup" className="hover:text-green-200 text-blue-500" >Sign up</a></span>
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-sky-500 text-white py-2 rounded-lg font-semibold shadow-md hover:bg-sky-600 transition-colors duration-300 cursor-pointer"
                        >

                            Login
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
}
