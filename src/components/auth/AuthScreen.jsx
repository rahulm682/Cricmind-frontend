import React, { useState } from 'react';
import { Mail, Lock, User as UserIcon, Activity, Loader2, AlertCircle, ChevronRight } from 'lucide-react';
import { useLoginUserMutation, useRegisterUserMutation } from '../../services/cricketApi';
import { useDispatch } from 'react-redux';
import { setCredentials } from '../../features/authSlice';

const CricketBallIcon = ({ size = 28 }) => (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
        <circle cx="12" cy="12" r="10" fill="#059669" />
        <circle cx="12" cy="12" r="10" stroke="#047857" strokeWidth="1" />
        <path d="M12 2 C8 6, 8 18, 12 22" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.9" />
        <path d="M12 2 C16 6, 16 18, 12 22" stroke="white" strokeWidth="1.2" strokeLinecap="round" fill="none" opacity="0.9" />
        <path d="M6.5 7.5 C8.5 8.5, 9.5 9.5, 9 12" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M17.5 7.5 C15.5 8.5, 14.5 9.5, 15 12" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M6.5 16.5 C8.5 15.5, 9.5 14.5, 9 12" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.7" />
        <path d="M17.5 16.5 C15.5 15.5, 14.5 14.5, 15 12" stroke="white" strokeWidth="0.9" strokeLinecap="round" fill="none" opacity="0.7" />
    </svg>
);

const InputField = ({ label, icon: Icon, type = 'text', name, placeholder, required, onChange }) => (
    <div className="space-y-1.5">
        <label className="block text-xs font-semibold text-slate-400 tracking-wide uppercase">
            {label}
        </label>
        <div className="relative group">
            <Icon
                size={15}
                className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-500 group-focus-within:text-emerald-500 transition-colors duration-200"
            />
            <input
                type={type}
                name={name}
                required={required}
                onChange={onChange}
                placeholder={placeholder}
                className="
          w-full bg-slate-950 border border-slate-800 rounded-lg
          pl-10 pr-4 py-2.5
          text-sm text-slate-200 placeholder:text-slate-600
          focus:outline-none focus:border-emerald-500/50 focus:ring-1 focus:ring-emerald-500/30
          hover:border-slate-700
          transition-all duration-200
        "
            />
        </div>
    </div>
);

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
        favorite_team: '',
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
            console.error('Auth failed', err);
        }
    };

    const currentError = isLogin ? loginError : registerError;
    const isLoading = isLoginLoading || isRegisterLoading;

    return (
        <div className="min-h-screen flex items-center justify-center bg-slate-950 p-4 relative overflow-hidden">

            <div
                className="absolute inset-0 opacity-[0.025] pointer-events-none"
                style={{
                    backgroundImage: 'linear-gradient(#10b981 1px, transparent 1px), linear-gradient(90deg, #10b981 1px, transparent 1px)',
                    backgroundSize: '48px 48px',
                }}
            />

            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-emerald-900/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl shadow-black/50 overflow-hidden animate-in fade-in slide-in-from-bottom-4 duration-500">

                <div className="absolute top-0 inset-x-0 h-[2px] bg-gradient-to-r from-transparent via-emerald-500 to-transparent" />

                <div className="px-8 pt-10 pb-7 text-center border-b border-slate-800/80">

                    <div className="flex items-center justify-center gap-2.5 mb-6">
                        <div className="flex items-center justify-center w-11 h-11 rounded-xl bg-emerald-500/10 border border-emerald-500/25">
                            <CricketBallIcon size={24} />
                        </div>
                        <div className="flex items-baseline">
                            <span className="text-2xl font-black tracking-widest text-slate-100">CRIC</span>
                            <span className="text-2xl font-black tracking-widest text-emerald-400">MIND</span>
                        </div>
                    </div>

                    <h2 className="text-xl font-bold text-slate-100">
                        {isLogin ? 'Welcome back' : 'Create your account'}
                    </h2>
                    <p className="text-slate-500 text-sm mt-2 leading-relaxed">
                        {isLogin
                            ? 'Sign in to access your cricket analytics dashboard.'
                            : 'Join Cricmind to unlock AI-powered cricket intelligence.'}
                    </p>
                </div>

                <div className="px-8 py-7">

                    {currentError && (
                        <div className="mb-6 p-3.5 bg-red-500/8 border border-red-500/20 rounded-xl flex items-start gap-3 text-red-400 text-sm">
                            <AlertCircle size={16} className="shrink-0 mt-0.5" />
                            <p className="leading-snug">
                                {currentError?.data?.error || currentError?.data?.detail || 'Authentication failed. Please try again.'}
                            </p>
                        </div>
                    )}

                    <form onSubmit={handleSubmit} className="space-y-4">

                        {!isLogin && (
                            <div className="grid grid-cols-2 gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
                                <InputField
                                    label="First name"
                                    icon={UserIcon}
                                    name="first_name"
                                    placeholder="Rahul"
                                    required
                                    onChange={handleChange}
                                />
                                <InputField
                                    label="Last name"
                                    icon={UserIcon}
                                    name="last_name"
                                    placeholder="Maurya"
                                    required
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        <InputField
                            label="Email address"
                            icon={Mail}
                            type="email"
                            name="email"
                            placeholder="you@example.com"
                            required
                            onChange={handleChange}
                        />

                        <InputField
                            label="Password"
                            icon={Lock}
                            type="password"
                            name="password"
                            placeholder="••••••••"
                            required
                            onChange={handleChange}
                        />

                        {!isLogin && (
                            <div className="animate-in fade-in slide-in-from-top-2 duration-300">
                                <InputField
                                    label="Favorite team (optional)"
                                    icon={Activity}
                                    name="favorite_team"
                                    placeholder="e.g. India, CSK, MI..."
                                    onChange={handleChange}
                                />
                            </div>
                        )}

                        {isLogin && (
                            <div className="flex justify-end -mt-1">
                                <button
                                    type="button"
                                    className="text-xs text-slate-500 hover:text-emerald-400 transition-colors"
                                >
                                    Forgot password?
                                </button>
                            </div>
                        )}

                        <button
                            type="submit"
                            disabled={isLoading}
                            className="
                w-full mt-2 py-2.5 px-4
                bg-emerald-600 hover:bg-emerald-500
                disabled:bg-slate-800 disabled:text-slate-600 disabled:cursor-not-allowed
                text-white font-semibold text-sm
                rounded-lg
                flex items-center justify-center gap-2
                transition-all duration-200
                shadow-lg shadow-emerald-900/30
              "
                        >
                            {isLoading ? (
                                <Loader2 size={18} className="animate-spin" />
                            ) : (
                                <>
                                    {isLogin ? 'Sign in to dashboard' : 'Create account'}
                                    <ChevronRight size={16} className="opacity-70" />
                                </>
                            )}
                        </button>
                    </form>

                    <div className="flex items-center gap-3 my-6">
                        <div className="flex-1 h-px bg-slate-800" />
                        <span className="text-xs text-slate-600">or</span>
                        <div className="flex-1 h-px bg-slate-800" />
                    </div>

                    <button
                        type="button"
                        onClick={() => setIsLogin(!isLogin)}
                        className="w-full py-2.5 rounded-lg border border-slate-800 hover:border-emerald-500/40 hover:bg-emerald-500/5 text-sm text-slate-400 hover:text-emerald-400 transition-all duration-200"
                    >
                        {isLogin
                            ? "Don't have an account? Sign up"
                            : 'Already have an account? Sign in'}
                    </button>
                </div>

                <div className="px-8 pb-6 text-center">
                    <p className="text-xs text-slate-600">
                        By continuing, you agree to Cricmind's terms and privacy policy.
                    </p>
                </div>

            </div>
        </div>
    );
};

export default AuthScreen;
