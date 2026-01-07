import React, { useEffect, useState } from 'react';
import client from '../api/client';
import { Trash2, Plus, Users, Globe } from 'lucide-react';
import { useToast } from '../context/ToastContext';

export const AdminDashboard = () => {
    const [activeTab, setActiveTab] = useState<'users' | 'languages' | 'snippets'>('users');
    const { addToast } = useToast();

    // Data States
    const [users, setUsers] = useState([]);
    const [languages, setLanguages] = useState([]);
    // const [snippets, setSnippets] = useState([]); // Implement later if needed

    // Language Form
    const [langName, setLangName] = useState('');
    const [langColor, setLangColor] = useState('');

    const fetchData = async () => {
        try {
            if (activeTab === 'users') {
                const { data } = await client.get('/users');
                setUsers(data);
            } else if (activeTab === 'languages') {
                const { data } = await client.get('/languages');
                setLanguages(data);
            }
        } catch (error) {
            console.error(error);
            addToast('Veri yüklenemedi', 'error');
        }
    };

    useEffect(() => {
        fetchData();
    }, [activeTab]);

    // --- User Actions ---
    const handleUpdateRole = async (userId: number, newRole: string) => {
        try {
            await client.patch(`/users/${userId}`, { role: newRole });
            addToast('Rol güncellendi', 'success');
            fetchData();
        } catch (e) {
            addToast('Rol güncellenemedi', 'error');
        }
    };

    const handleDeleteUser = async (userId: number) => {
        if (!window.confirm('Kullanıcıyı ve tüm verilerini silmek istediğinize emin misiniz?')) return;
        try {
            await client.delete(`/users/${userId}`);
            addToast('Kullanıcı silindi', 'success');
            fetchData();
        } catch (e) {
            addToast('Silme başarısız', 'error');
        }
    };

    // --- Language Actions ---
    const handleAddLanguage = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.post('/languages', { name: langName, colorCode: langColor });
            setLangName('');
            setLangColor('');
            addToast('Dil eklendi', 'success');
            fetchData();
        } catch (e) {
            addToast('Dil eklenemedi', 'error');
        }
    };

    const handleDeleteLanguage = async (id: number) => {
        if (!window.confirm('Bu dili silmek istediğinize emin misiniz?')) return;
        try {
            await client.delete(`/languages/${id}`);
            addToast('Dil silindi', 'success');
            fetchData();
        } catch (e) {
            addToast('Silme başarısız', 'error');
        }
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
            <h1 className="text-3xl font-extrabold text-slate-800 mb-8 tracking-tight">Yönetici Paneli</h1>

            {/* Tabs */}
            <div className="flex space-x-4 mb-8 bg-white p-2 rounded-xl border border-slate-100 shadow-sm w-fit">
                <button
                    onClick={() => setActiveTab('users')}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg transition font-medium ${activeTab === 'users' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Users size={18} />
                    <span>Kullanıcılar</span>
                </button>
                <button
                    onClick={() => setActiveTab('languages')}
                    className={`flex items-center space-x-2 px-6 py-2.5 rounded-lg transition font-medium ${activeTab === 'languages' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-500 hover:bg-slate-50'}`}
                >
                    <Globe size={18} />
                    <span>Diller</span>
                </button>
                {/* <button disabled className="flex items-center space-x-2 px-6 py-2.5 rounded-lg text-slate-300 cursor-not-allowed">
                    <Code size={18} />
                    <span>Snippetlar (Yakında)</span>
                </button> */}
            </div>

            {/* Content Area */}
            <div className="bg-white rounded-3xl shadow-soft border border-slate-100 overflow-hidden min-h-[500px]">
                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div className="p-8">
                        <div className="overflow-x-auto">
                            <table className="w-full text-left">
                                <thead className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider border-b border-slate-100">
                                    <tr>
                                        <th className="p-4 rounded-tl-xl">ID</th>
                                        <th className="p-4">Kullanıcı Adı</th>
                                        <th className="p-4">E-posta</th>
                                        <th className="p-4">Rol</th>
                                        <th className="p-4 text-right rounded-tr-xl">İşlemler</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100">
                                    {users.map((u: any) => (
                                        <tr key={u.id} className="hover:bg-slate-50 transition">
                                            <td className="p-4 text-slate-400 font-mono text-sm">#{u.id}</td>
                                            <td className="p-4 font-bold text-slate-700">{u.username}</td>
                                            <td className="p-4 text-slate-500">{u.email}</td>
                                            <td className="p-4">
                                                <select
                                                    value={u.role}
                                                    onChange={(e) => handleUpdateRole(u.id, e.target.value)}
                                                    className="bg-white border border-slate-200 text-slate-700 text-sm rounded-lg focus:ring-indigo-500 focus:border-indigo-500 block p-2"
                                                >
                                                    <option value="user">Okuyucu</option>
                                                    <option value="editor">Editör</option>
                                                    <option value="admin">Yönetici</option>
                                                </select>
                                            </td>
                                            <td className="p-4 text-right">
                                                <button
                                                    onClick={() => handleDeleteUser(u.id)}
                                                    className="text-slate-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg"
                                                    title="Kullanıcıyı Sil"
                                                >
                                                    <Trash2 size={18} />
                                                </button>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                )}

                {/* Languages Tab */}
                {activeTab === 'languages' && (
                    <div className="grid grid-cols-1 lg:grid-cols-3 gap-0 lg:divide-x divide-slate-100 h-full">
                        <div className="p-8 bg-slate-50/50">
                            <h3 className="text-xl font-bold text-slate-800 mb-6 flex items-center">
                                <Plus size={20} className="mr-2 text-indigo-500" /> Yeni Dil Ekle
                            </h3>
                            <form onSubmit={handleAddLanguage} className="space-y-5">
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Dil Adı</label>
                                    <input
                                        type="text"
                                        className="w-full bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition font-medium"
                                        value={langName}
                                        onChange={e => setLangName(e.target.value)}
                                        required
                                        placeholder="Örn: TypeScript"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-semibold text-slate-700 mb-2">Renk Kodu (Hex)</label>
                                    <div className="flex space-x-2">
                                        <input
                                            type="color"
                                            className="h-12 w-14 bg-white border border-slate-200 rounded-xl cursor-pointer p-1"
                                            value={langColor}
                                            onChange={e => setLangColor(e.target.value)}
                                        />
                                        <input
                                            type="text"
                                            className="flex-1 bg-white border border-slate-200 rounded-xl py-3 px-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition font-medium font-mono"
                                            value={langColor}
                                            onChange={e => setLangColor(e.target.value)}
                                            placeholder="#5B5B5B"
                                            pattern="^#([A-Fa-f0-9]{6}|[A-Fa-f0-9]{3})$"
                                            required
                                        />
                                    </div>
                                </div>
                                <button className="w-full btn-primary py-3 rounded-xl shadow-indigo-200">
                                    Ekle
                                </button>
                            </form>
                        </div>

                        <div className="lg:col-span-2 p-8">
                            <div className="overflow-x-auto">
                                <table className="w-full text-left">
                                    <thead className="bg-slate-50 text-slate-500 text-sm font-semibold uppercase tracking-wider border-b border-slate-100">
                                        <tr>
                                            <th className="p-4 rounded-tl-xl">ID</th>
                                            <th className="p-4">Ad</th>
                                            <th className="p-4">Renk</th>
                                            <th className="p-4 text-right rounded-tr-xl">İşlemler</th>
                                        </tr>
                                    </thead>
                                    <tbody className="divide-y divide-slate-100">
                                        {languages.map((lang: any) => (
                                            <tr key={lang.id} className="hover:bg-slate-50 transition">
                                                <td className="p-4 text-slate-400 font-mono text-sm">#{lang.id}</td>
                                                <td className="p-4 font-bold text-slate-700">{lang.name}</td>
                                                <td className="p-4">
                                                    <div className="flex items-center space-x-3">
                                                        <div className="w-8 h-8 rounded-lg shadow-sm border border-slate-200" style={{ backgroundColor: lang.colorCode }} />
                                                        <span className="text-slate-500 font-bold font-mono text-xs bg-slate-100 px-2 py-1 rounded">{lang.colorCode}</span>
                                                    </div>
                                                </td>
                                                <td className="p-4 text-right">
                                                    <button
                                                        onClick={() => handleDeleteLanguage(lang.id)}
                                                        className="text-slate-400 hover:text-red-500 transition p-2 hover:bg-red-50 rounded-lg"
                                                    >
                                                        <Trash2 size={18} />
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
};
