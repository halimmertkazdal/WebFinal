import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Code2, LogOut, Plus, Settings, User } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const Navbar = () => {
    const { user, logout, isAdmin } = useAuth();
    const navigate = useNavigate();
    const { addToast } = useToast();
    const [showLogoutModal, setShowLogoutModal] = useState(false);

    const handleLogout = () => {
        logout();
        addToast('Başarıyla çıkış yapıldı', 'info');
        navigate('/login');
        setShowLogoutModal(false);
    };

    return (
        <>
            <nav className="fixed top-0 w-full z-50 glass-panel border-b border-slate-200/50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center justify-between h-20">
                        <Link to="/" className="flex items-center space-x-3 group">
                            <div className="p-2 bg-indigo-600 rounded-lg shadow-lg shadow-indigo-200 group-hover:scale-105 transition-all duration-300">
                                <Code2 size={24} className="text-white" />
                            </div>
                            <span className="font-bold text-2xl tracking-tight text-slate-800 group-hover:text-indigo-600 transition-colors">
                                CodeSnip
                            </span>
                        </Link>

                        <div className="flex items-center space-x-6">
                            {user ? (
                                <>
                                    {(user.role === 'admin' || user.role === 'editor') && (
                                        <Link to="/create" className="hidden md:flex items-center space-x-2 text-slate-500 hover:text-indigo-600 transition group" title="Snippet Oluştur">
                                            <div className="p-2 rounded-full bg-slate-100 group-hover:bg-indigo-50 transition">
                                                <Plus size={20} />
                                            </div>
                                            <span className="text-sm font-medium">Oluştur</span>
                                        </Link>
                                    )}

                                    {isAdmin && (
                                        <Link to="/admin" className="p-2 text-slate-500 hover:text-indigo-600 hover:bg-indigo-50 rounded-full transition" title="Yönetici Paneli">
                                            <Settings size={20} />
                                        </Link>
                                    )}

                                    <div className="h-8 w-px bg-slate-200 mx-2 hidden sm:block"></div>

                                    <div className="flex items-center space-x-3">
                                        <Link to="/profile" className="flex items-center space-x-2 px-3 py-1.5 rounded-full bg-white border border-slate-200 shadow-sm hover:border-indigo-300 transition cursor-pointer">
                                            <User size={14} className="text-indigo-500" />
                                            <span className="text-sm font-medium text-slate-700">{user.username}</span>
                                        </Link>
                                        <button onClick={() => setShowLogoutModal(true)} className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full transition" title="Çıkış Yap">
                                            <LogOut size={18} />
                                        </button>
                                    </div>
                                </>
                            ) : (
                                <div className="flex items-center space-x-4">
                                    <Link to="/login" className="text-slate-600 hover:text-indigo-600 font-medium px-4 py-2 hover:bg-slate-50 rounded-lg transition">Giriş Yap</Link>
                                    <Link to="/register" className="btn-primary py-2 px-6 text-sm rounded-lg shadow-md shadow-indigo-200">
                                        Kayıt Ol
                                    </Link>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </nav>

            {/* Logout Confirmation Modal */}
            {showLogoutModal && (
                <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-slate-900/20 backdrop-blur-sm">
                    <div className="bg-white rounded-2xl shadow-xl border border-slate-100 p-6 w-full max-w-sm transform transition-all scale-100">
                        <h3 className="text-lg font-bold text-slate-800 mb-2">Çıkış Yap</h3>
                        <p className="text-slate-500 mb-6">Hesabınızdan çıkış yapmak istediğinize emin misiniz?</p>
                        <div className="flex space-x-3">
                            <button
                                onClick={() => setShowLogoutModal(false)}
                                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-slate-600 hover:bg-slate-50 transition border border-slate-200"
                            >
                                İptal
                            </button>
                            <button
                                onClick={handleLogout}
                                className="flex-1 py-2.5 px-4 rounded-xl font-medium text-white bg-red-500 hover:bg-red-600 shadow-lg shadow-red-200 transition"
                            >
                                Çıkış Yap
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </>
    );
};
