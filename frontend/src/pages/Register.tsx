import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Mail, Lock, User } from 'lucide-react';

export const Register = () => {
    const [username, setUsername] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [role, setRole] = useState<'user' | 'editor'>('user');
    const { login } = useAuth();
    const { addToast } = useToast();
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const { data } = await client.post('/auth/register', { username, email, password, role });
            localStorage.setItem('token', data.access_token);
            const profileRes = await client.get('/auth/profile', {
                headers: { Authorization: `Bearer ${data.access_token}` }
            });

            login(data.access_token, {
                id: profileRes.data.id, // Fixed: using id instead of userId
                username: profileRes.data.username,
                role: profileRes.data.role
            });
            addToast('Kayıt başarılı! Hoşgeldin.', 'success');
            navigate('/');
        } catch (err: any) {
            addToast(err.response?.data?.message || 'Kayıt başarısız', 'error');
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center relative overflow-hidden bg-slate-50 pt-32 pb-20">
            {/* Decorative blobs */}
            <div className="absolute top-20 right-20 w-96 h-96 bg-cyan-200 rounded-full blur-3xl opacity-30 pointer-events-none" />
            <div className="absolute bottom-20 left-20 w-80 h-80 bg-rose-200 rounded-full blur-3xl opacity-30 pointer-events-none" />

            <div className="w-full max-w-md bg-white p-10 rounded-3xl shadow-soft relative z-10 mx-4 border border-slate-100">
                <h2 className="text-4xl font-extrabold text-center mb-3 text-slate-800 tracking-tight">CodeSnip'e Katıl</h2>
                <p className="text-slate-500 text-center mb-8">Kodlarını dünyayla paylaşmaya başla</p>

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Kullanıcı Adı</label>
                        <div className="relative group">
                            <User className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input
                                type="text"
                                id="username"
                                name="username"
                                autoComplete="username"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                placeholder="johndoe"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">E-Posta Adresi</label>
                        <div className="relative group">
                            <Mail className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input
                                type="email"
                                id="email"
                                name="email"
                                autoComplete="email"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                placeholder="merhaba@ornek.com"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Şifre</label>
                        <div className="relative group">
                            <Lock className="absolute left-4 top-1/2 transform -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-600 transition-colors" size={20} />
                            <input
                                type="password"
                                id="password"
                                name="password"
                                autoComplete="new-password"
                                className="w-full bg-slate-50 border border-slate-200 focus:border-indigo-500 rounded-xl py-3.5 pl-12 pr-4 text-slate-800 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all font-medium"
                                placeholder="••••••••"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                        </div>
                    </div>
                    <div>
                        <label className="block text-sm font-semibold text-slate-700 mb-2 pl-1">Hesap Türü</label>
                        <div className="grid grid-cols-2 gap-4">
                            <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${role === 'user' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-200 text-slate-600'}`}>
                                <input type="radio" name="role" value="user" checked={role === 'user'} onChange={() => setRole('user')} className="absolute opacity-0" />
                                <span className="font-bold">Okuyucu</span>
                                <span className="text-xs text-center mt-1 opacity-75">Sadece kodları inceler</span>
                            </label>
                            <label className={`relative flex flex-col items-center justify-center p-4 rounded-xl border-2 cursor-pointer transition-all ${role === 'editor' ? 'border-indigo-500 bg-indigo-50 text-indigo-700' : 'border-slate-200 hover:border-indigo-200 text-slate-600'}`}>
                                <input type="radio" name="role" value="editor" checked={role === 'editor'} onChange={() => setRole('editor')} className="absolute opacity-0" />
                                <span className="font-bold">Editör</span>
                                <span className="text-xs text-center mt-1 opacity-75">Kod paylaşabilir</span>
                            </label>
                        </div>
                    </div>
                    <button
                        type="submit"
                        className="w-full btn-primary text-lg mt-2 shadow-indigo-200"
                    >
                        Hesap Oluştur
                    </button>
                </form>
                <p className="mt-8 text-center text-slate-500 text-sm">
                    Zaten hesabın var mı? <Link to="/login" className="text-indigo-600 hover:text-indigo-700 font-bold hover:underline transition-colors">Giriş Yap</Link>
                </p>
            </div>
        </div>
    );
};
