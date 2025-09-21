import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api from '../api';

const AuthForm = ({ isLogin }: { isLogin: boolean }) => {
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!isLogin && password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }
        try {
            const endpoint = isLogin ? '/auth/login' : '/auth/register';
            const data = isLogin ? { email, password } : { name, email, password };
            const res = await api.post(endpoint, data);
            localStorage.setItem('token', res.data.token);
            localStorage.setItem('isLoggedIn', 'true');
            navigate('/dashboard');
        } catch (err) {
            setError('Error: ' + (err.response?.data?.error || 'Unknown error'));
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            {!isLogin && (
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Full Name</label>
                    <input type="text" id="name" required value={name} onChange={e => setName(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
            )}
            <div>
                <label htmlFor="email" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Email address</label>
                <input type="email" id="email" required value={email} onChange={e => setEmail(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            <div>
                <label htmlFor="password" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Password</label>
                <input type="password" id="password" required value={password} onChange={e => setPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
            </div>
            {!isLogin && (
                <div>
                    <label htmlFor="confirm-password" className="block text-sm font-medium text-text-muted-light dark:text-text-muted-dark">Confirm Password</label>
                    <input type="password" id="confirm-password" required value={confirmPassword} onChange={e => setConfirmPassword(e.target.value)} className="mt-1 block w-full px-4 py-3 bg-background-light dark:bg-background-dark border border-gray-300 dark:border-gray-600 rounded-lg shadow-sm focus:outline-none focus:ring-primary focus:border-primary" />
                </div>
            )}
            {error && <p className="text-red-500">{error}</p>}
            <div className="flex items-center justify-between">
                {isLogin && (
                    <a href="#" className="text-sm text-primary hover:underline">Forgot your password?</a>
                )}
            </div>
            <div>
                <button type="submit" className="w-full flex justify-center py-3 px-4 border border-transparent rounded-full shadow-sm text-lg font-medium text-white bg-primary hover:bg-opacity-90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-transform hover:scale-105">
                    {isLogin ? 'Sign In' : 'Create Account'}
                </button>
            </div>
        </form>
    );
};

export default function AuthPage() {
    const [isLoginView, setIsLoginView] = useState(true);

    return (
        <div className="min-h-screen flex bg-background-light dark:bg-background-dark">
            <div className="w-1/2 min-h-screen relative hidden lg:block">
                <img src="https://picsum.photos/seed/auth/1000/1200" className="absolute inset-0 w-full h-full object-cover" alt="Architectural detail" />
                <div className="absolute inset-0 bg-black/60 flex items-end p-12">
                    <div>
                        <h1 className="text-5xl font-serif font-bold text-white leading-tight">Your Journey to Financial Freedom Starts Here.</h1>
                        <p className="text-xl text-white/80 mt-4 max-w-xl">Join a community of investors building wealth through intelligent real estate investment.</p>
                    </div>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="max-w-md w-full">
                    <div>
                        <h2 className="text-center text-4xl font-serif font-bold text-text-light dark:text-text-dark">
                            {isLoginView ? 'Welcome Back' : 'Create Your Account'}
                        </h2>
                        <p className="mt-2 text-center text-md text-text-muted-light dark:text-text-muted-dark">
                            Or{' '}
                            <button onClick={() => setIsLoginView(!isLoginView)} className="font-medium text-primary hover:text-primary-dark">
                                {isLoginView ? 'create a new account' : 'sign in to your account'}
                            </button>
                        </p>
                    </div>
                    <div className="mt-8 bg-surface-light dark:bg-surface-dark p-8 rounded-2xl shadow-xl">
                        <AuthForm isLogin={isLoginView} />
                    </div>
                </div>
            </div>
        </div>
    );
}