import React, { useState } from 'react';
import { Activity, Mail, Lock, User as UserIcon, Phone, Shield, Loader2, AlertCircle } from 'lucide-react';
import { useLoginUserMutation, useRegisterUserMutation } from '../../services/cricketApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/authSlice';

const AuthScreen = () => {
    const [isLogin, setIsLogin] = useState(true);
    const dispatch = useDispatch();

    const [loginUser, { isLoading: isLoginLoading, error: loginError }] = useLoginUserMutation();
    const [registerUser, { isLoading: isRegisterLoading, error: registerError }] = useRegisterUserMutation();

    const [formData, setFormData] = useState({
        email: '',
        password: '',
        first_name: '',
        last_name: '',
        phone_number: '',
        favorite_team: ''
    });

    const handleChange = (e) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        try {
            if (isLogin) {
                const response = await loginUser({ username: formData.email, password: formData.password }).unwrap();
                dispatch(setCredentials(response));
            } else {
                await registerUser(formData).unwrap();
                const loginResponse = await loginUser({ username: formData.email, password: formData.password }).unwrap();
                dispatch(setCredentials(loginResponse));
            }
        } catch (err) {
            console.error("Auth failed", err);
        }
    };

    const currentError = isLogin ? loginError : registerError;
    const isLoading = isLoginLoading || isRegisterLoading;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4">
            <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

                {/* Header */}
                <div className="p-8 pb-6 text-center border-b border-slate-800 bg-slate-900/50">
                    <div className="w-16 h-16 bg-blue-500/10 text-blue-500 rounded-2xl flex items-center justify-center mx-auto mb-4 border border-blue-500/20">
                        <Shield size={32} />
                    </div>
                    <h2 className="text-2xl font-bold text-slate-100">{isLogin ? 'Welcome Back' : 'Join Cricmind'}</h2>
                    <p className="text-slate-400 text-sm mt-2">
                        {isLogin ? 'Enter your credentials to access your dashboard.' : 'Create an account to save your intelligence data.'}
                    </p>
                </div>

                {/* Form */}
                <div className="p-8">
                    {currentError && (
                        <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 rounded-lg flex items-start gap-3 text-red-400 text-sm">
                            <AlertCircle size={18} className="shrink-0 mt-0.5" />
                            <p>{currentError?.data?.error || currentError?.data?.detail || "Authentication failed. Please try again."}</p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">
                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-4 animate-in fade-in slide-in-from-top-2">
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-400">First Name</label>
                                    <div className="relative">
                                        <UserIcon size={16} className="absolute left-3 top-3 text-slate-500" />
                                        <input type="text" name="first_name" required onChange={handleChange} placeholder="e.g., Rahul" className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50" />
                                    </div>
                                </div>
                                <div className="space-y-1">
                                    <label className="text-xs font-medium text-slate-400">Last Name</label>
                                    <div className="relative">
                                        <UserIcon size={16} className="absolute left-3 top-3 text-slate-500" />
                                        <input type="text" name="last_name" required onChange={handleChange} placeholder="e.g., Maurya" className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50" />
                                    </div>
                                </div>
                            </div>
                        )}

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Email Address</label>
                            <div className="relative">
                                <Mail size={16} className="absolute left-3 top-3 text-slate-500" />
                                <input type="email" name="email" required onChange={handleChange} placeholder="you@example.com" className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50" />
                            </div>
                        </div>

                        <div className="space-y-1">
                            <label className="text-xs font-medium text-slate-400">Password</label>
                            <div className="relative">
                                <Lock size={16} className="absolute left-3 top-3 text-slate-500" />
                                <input type="password" name="password" required onChange={handleChange} placeholder="••••••••" className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50" />
                            </div>
                        </div>

                        {!isLogin && (
                            <div className="space-y-1 animate-in fade-in slide-in-from-top-2">
                                <label className="text-xs font-medium text-slate-400">Favorite Team (Optional)</label>
                                <div className="relative">
                                    <Activity size={16} className="absolute left-3 top-3 text-slate-500" />
                                    <input type="text" name="favorite_team" onChange={handleChange} placeholder="e.g., India, CSK" className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-10 pr-4 py-2.5 text-slate-200 focus:outline-none focus:border-blue-500/50 focus:ring-1 focus:ring-blue-500/50" />
                                </div>
                            </div>
                        )}

                        <button type="submit" disabled={isLoading} className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center mt-6 disabled:opacity-50 disabled:cursor-not-allowed">
                            {isLoading ? <Loader2 size={20} className="animate-spin" /> : (isLogin ? 'Sign In' : 'Create Account')}
                        </button>
                    </form>

                    <div className="mt-6 text-center">
                        <button type="button" onClick={() => setIsLogin(!isLogin)} className="text-sm text-slate-400 hover:text-blue-400 transition-colors">
                            {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuthScreen;

