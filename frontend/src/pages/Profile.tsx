import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';
import { SnippetCard } from '../components/SnippetCard';
import { useToast } from '../context/ToastContext';
import { User, Lock, Save, Book, Code2 } from 'lucide-react';

export const Profile = () => {
    const { user } = useAuth();
    const [activeTab, setActiveTab] = useState<'profile' | 'content'>('profile');
    const [bookmarks, setBookmarks] = useState([]);
    const [mySnippets, setMySnippets] = useState([]);
    const [loading, setLoading] = useState(false);
    const { addToast } = useToast();

    // Profile Form States
    const [username, setUsername] = useState(user?.username || '');
    const [newPassword, setNewPassword] = useState('');

    useEffect(() => {
        if (activeTab === 'content') {
            fetchContent();
        }
    }, [activeTab, user]);

    const fetchContent = async () => {
        setLoading(true);
        try {
            if (user?.role === 'editor' || user?.role === 'admin') {
                // Fetch My Snippets (Assuming endpoint exists or filtering client side for now if not)
                // In a real app we'd have /snippets/my endpoint. For now let's filter all snippets by user ID if API doesn't support specific endpoint
                const { data } = await client.get('/snippets');
                const mine = data.filter((s: any) => s.user?.username === user?.username);
                setMySnippets(mine);
            }

            // Always fetch bookmarks for everyone
            const { data: bookmarkData } = await client.get('/bookmarks');
            setBookmarks(bookmarkData);
        } catch (error) {
            console.error(error);
            addToast('İçerik yüklenemedi', 'error');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdateProfile = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            // Update logic here (needs backend endpoint support for user update)
            // await client.patch(`/users/${user.id}`, { username, password: newPassword });
            addToast('Profil güncelleme özelliği yakında aktif olacak!', 'info');
        } catch (error) {
            addToast('Güncelleme başarısız', 'error');
        }
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-24 min-h-screen">
            <div className="flex flex-col md:flex-row gap-8">
                {/* Sidebar */}
                <div className="w-full md:w-64 flex-shrink-0">
                    <div className="bg-white rounded-2xl shadow-soft border border-slate-100 overflow-hidden sticky top-24">
                        <div className="p-6 bg-gradient-to-br from-indigo-500 to-purple-600 text-white text-center">
                            <div className="w-20 h-20 bg-white/20 backdrop-blur-md rounded-full mx-auto flex items-center justify-center mb-3">
                                <User size={32} />
                            </div>
                            <h2 className="font-bold text-lg">{user?.username}</h2>
                            <span className="inline-block px-3 py-1 bg-white/20 rounded-full text-xs font-medium uppercase tracking-wider mt-1">
                                {user?.role === 'user' ? 'Okuyucu' : user?.role === 'editor' ? 'Editör' : 'Yönetici'}
                            </span>
                        </div>
                        <nav className="p-2 space-y-1">
                            <button
                                onClick={() => setActiveTab('profile')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'profile' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                <User size={18} />
                                <span>Profil Bilgileri</span>
                            </button>
                            <button
                                onClick={() => setActiveTab('content')}
                                className={`w-full flex items-center space-x-3 px-4 py-3 rounded-xl transition font-medium ${activeTab === 'content' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-600 hover:bg-slate-50'}`}
                            >
                                {user?.role === 'editor' ? <Code2 size={18} /> : <Book size={18} />}
                                <span>{user?.role === 'editor' ? 'Snippetlarım' : 'Kaydedilenler'}</span>
                            </button>
                        </nav>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1">
                    {activeTab === 'profile' ? (
                        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">Profil Düzenle</h3>
                            <form onSubmit={handleUpdateProfile} className="space-y-6 max-w-lg">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Kullanıcı Adı</label>
                                    <div className="relative">
                                        <User className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="text"
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Yeni Şifre</label>
                                    <div className="relative">
                                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                                        <input
                                            type="password"
                                            value={newPassword}
                                            onChange={(e) => setNewPassword(e.target.value)}
                                            placeholder="Değiştirmek istemiyorsanız boş bırakın"
                                            className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 outline-none transition"
                                        />
                                    </div>
                                </div>
                                <button type="submit" className="btn-primary py-2.5 px-6 rounded-xl flex items-center space-x-2">
                                    <Save size={18} />
                                    <span>Kaydet</span>
                                </button>
                            </form>
                        </div>
                    ) : (
                        <div className="space-y-6">
                            <h3 className="text-2xl font-bold text-slate-800 mb-6">
                                {user?.role === 'editor' ? 'Paylaştığım Kodlar' : 'Kaydedilenler'}
                            </h3>

                            {loading ? (
                                <div className="text-center py-10 text-slate-400">Yükleniyor...</div>
                            ) : (
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    {user?.role === 'editor' ? (
                                        mySnippets.length > 0 ? (
                                            mySnippets.map((snippet: any) => (
                                                <SnippetCard key={snippet.id} snippet={snippet} />
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
                                                <p className="text-slate-500">Henüz hiç snippet paylaşmadınız.</p>
                                            </div>
                                        )
                                    ) : (
                                        bookmarks.length > 0 ? (
                                            bookmarks.map((bookmark: any) => (
                                                <SnippetCard key={bookmark.id} snippet={bookmark.snippet} />
                                            ))
                                        ) : (
                                            <div className="col-span-2 text-center py-10 bg-white rounded-2xl border border-dashed border-slate-300">
                                                <p className="text-slate-500">Henüz kaydedilen snippet yok.</p>
                                            </div>
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};
