import React from 'react'
import { useState } from 'react';
import { FaEye, FaEyeSlash } from 'react-icons/fa'
import api from '../utils/axios'
import { useNavigate } from 'react-router-dom';
export default function Register() {
    const [formData, setFormData] = useState({
        name: "",
        id: "",
        password: "",
    });
    const navigate = useNavigate();
    const [message, setMessage] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const res = await api.post('/register', formData);
            alert('Registration Successful!');
            localStorage.setItem('token', res.data.token);
            setMessage('Registration Successful you can login now!');
            navigate('/signin')
        }
        catch (err) {
            setMessage(err.response?.data?.message || 'Registration failed')
            alert('Registration failed: ' + (err.response?.data?.message || 'Unknown error'));
        }
    };


    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-100 py-12 px-4">
            <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg">
                <h2 className="text-3xl font-bold text-center mb-6 bg-gradient-to-r from-green-400 to-blue-500 bg-clip-text text-transparent">
                    Register
                </h2>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                            placeholder="Enter your Name" />
                    </div>
                    <div>
                        <input
                            type="text"
                            name="id"
                            value={formData.id}
                            onChange={handleChange}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none"
                            placeholder="Enter your id" />
                    </div>
                    <div className="relative">
                        <input
                            type={showPassword ? "text" : "password"}
                            name="password"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            placeholder="Set Password"
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-sky-400 focus:outline-none pr-12"
                        />

                        <div
                            className="absolute inset-y-0 right-3 flex items-center cursor-pointer text-gray-500"
                            onClick={() => setShowPassword(!showPassword)}
                        >
                            {showPassword ? <FaEyeSlash /> : <FaEye />}
                        </div>
                    </div>
                    <div className="flex items-center gap-2 ml-38">
                        <p>Already had an account?</p><span><a href="signin" className="hover:text-green-200 text-blue-500" >Sign In</a></span>
                    </div>
                    <button type="submit" className="w-full text-white bg-sky-500 rounded-lg py-2 font-semibold hover:bg-sky-600 transition-colors duration-300 cursor-pointer">Register</button>
                </form>
            </div>

        </div>
    )
}
