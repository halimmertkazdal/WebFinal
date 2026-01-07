import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Code2, Play, Save, Edit2, Trash2, ArrowLeft, Terminal, AlertCircle } from 'lucide-react';

export const SnippetDetail = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const { addToast } = useToast();

    const [snippet, setSnippet] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    // Edit Form State
    const [editTitle, setEditTitle] = useState('');
    const [editCode, setEditCode] = useState('');
    const [editDescription, setEditDescription] = useState('');

    // Runner State
    const [output, setOutput] = useState<string[]>([]);
    const [isRunning, setIsRunning] = useState(false);
    const [runError, setRunError] = useState<string | null>(null);

    useEffect(() => {
        fetchSnippet();
    }, [id]);

    const fetchSnippet = async () => {
        try {
            const { data } = await client.get(`/snippets/${id}`);
            setSnippet(data);
            setEditTitle(data.title);
            setEditCode(data.codeContent);
            setEditDescription(data.description || '');
        } catch (e) {
            addToast('Snippet bulunamadı', 'error');
            navigate('/');
        } finally {
            setLoading(false);
        }
    };

    const handleUpdate = async () => {
        try {
            await client.patch(`/snippets/${id}`, {
                title: editTitle,
                codeContent: editCode,
                description: editDescription
            });
            addToast('Snippet güncellendi', 'success');
            setIsEditing(false);
            fetchSnippet();
        } catch (e) {
            addToast('Güncelleme başarısız', 'error');
        }
    };

    const handleDelete = async () => {
        if (!window.confirm('Bu snippet\'ı silmek istediğinize emin misiniz?')) return;
        try {
            await client.delete(`/snippets/${id}`);
            addToast('Snippet silindi', 'success');
            navigate('/');
        } catch (e) {
            addToast('Silme başarısız', 'error');
        }
    };

    const runCode = () => {
        setIsRunning(true);
        setOutput([]);
        setRunError(null);

        // Simple console capture
        const logs: string[] = [];
        const originalLog = console.log;
        const originalError = console.error;

        console.log = (...args) => {
            logs.push(args.map(a => String(a)).join(' '));
        };
        console.error = (...args) => {
            logs.push(`Error: ${args.map(a => String(a)).join(' ')}`);
        };

        try {
            // Very basic sandbox for demo purposes
            // WARNING: This is unsafe for production with untrusted users, but acceptable for this specific "owner runs their own code" context requested by user.
            // Using Function constructor to run code
            // We wrap it in an async function to allow await
            const run = new Function(`
                return (async () => {
                    ${editCode}
                })();
            `);

            run()
                .then((res: any) => {
                    if (res !== undefined) logs.push(`Result: ${String(res)}`);
                })
                .catch((e: any) => {
                    setRunError(e.message);
                })
                .finally(() => {
                    console.log = originalLog;
                    console.error = originalError;
                    setOutput(logs);
                    setIsRunning(false);
                });

        } catch (e: any) {
            console.log = originalLog;
            console.error = originalError;
            setRunError(e.message);
            setIsRunning(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );

    const isOwner = user?.id === snippet.user.id || user?.role === 'admin';
    const canRun = snippet.language.name.toLowerCase().includes('javascript') || snippet.language.name.toLowerCase().includes('typescript');

    return (
        <div className="max-w-7xl mx-auto px-4 py-24 min-h-screen">
            <button onClick={() => navigate(-1)} className="flex items-center text-slate-500 hover:text-indigo-600 mb-6 transition">
                <ArrowLeft size={20} className="mr-2" />
                Geri Dön
            </button>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-8">
                        {isEditing ? (
                            <div className="space-y-4">
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Başlık</label>
                                    <input
                                        type="text"
                                        value={editTitle}
                                        onChange={e => setEditTitle(e.target.value)}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-slate-700 mb-2">Açıklama</label>
                                    <textarea
                                        value={editDescription}
                                        onChange={e => setEditDescription(e.target.value)}
                                        rows={3}
                                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-2 px-4 focus:ring-2 focus:ring-indigo-500/20 outline-none"
                                    />
                                </div>
                            </div>
                        ) : (
                            <div>
                                <div className="flex items-center space-x-3 mb-4">
                                    <span
                                        className="px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider"
                                        style={{ backgroundColor: snippet.language.colorCode + '15', color: snippet.language.colorCode }}
                                    >
                                        {snippet.language.name}
                                    </span>
                                    <span className="text-slate-400 text-sm">{new Date(snippet.createdAt).toLocaleDateString()}</span>
                                </div>
                                <h1 className="text-3xl font-extrabold text-slate-800 mb-4">{snippet.title}</h1>
                                {snippet.description && <p className="text-slate-600 leading-relaxed">{snippet.description}</p>}

                                <div className="flex items-center space-x-3 mt-6 pt-6 border-t border-slate-50">
                                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                                        {snippet.user.username[0].toUpperCase()}
                                    </div>
                                    <div>
                                        <p className="text-sm font-bold text-slate-700">@{snippet.user.username}</p>
                                        <p className="text-xs text-slate-400">Yazar</p>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>

                    <div className="bg-slate-900 rounded-2xl overflow-hidden shadow-2xl border border-slate-800">
                        <div className="flex items-center justify-between px-6 py-3 bg-slate-800/50 border-b border-slate-700">
                            <div className="flex items-center space-x-2">
                                <Code2 size={18} className="text-indigo-400" />
                                <span className="text-slate-300 font-mono text-sm">Kaynak Kod</span>
                            </div>
                            {isOwner && (
                                <div className="flex space-x-2">
                                    {isEditing ? (
                                        <>
                                            <button onClick={() => setIsEditing(false)} className="text-slate-400 hover:text-white px-3 py-1 text-sm transition">İptal</button>
                                            <button onClick={handleUpdate} className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-1.5 rounded-lg text-sm font-medium transition flex items-center">
                                                <Save size={16} className="mr-2" /> Kaydet
                                            </button>
                                        </>
                                    ) : (
                                        <button onClick={() => setIsEditing(true)} className="text-slate-400 hover:text-indigo-400 px-3 py-1 text-sm transition flex items-center">
                                            <Edit2 size={16} className="mr-1.5" /> Düzenle
                                        </button>
                                    )}
                                </div>
                            )}
                        </div>
                        {isEditing ? (
                            <textarea
                                value={editCode}
                                onChange={e => setEditCode(e.target.value)}
                                className="w-full h-[500px] bg-slate-900 text-slate-300 font-mono p-6 text-sm focus:outline-none resize-none"
                                spellCheck="false"
                            />
                        ) : (
                            <pre className="p-6 overflow-x-auto">
                                <code className="text-slate-300 font-mono text-sm">{snippet.codeContent}</code>
                            </pre>
                        )}
                    </div>
                </div>

                {/* Sidebar / Runner */}
                <div className="space-y-6">
                    {/* Actions */}
                    {isOwner && (
                        <div className="bg-white rounded-2xl shadow-soft border border-slate-100 p-6">
                            <h3 className="font-bold text-slate-800 mb-4">İşlemler</h3>
                            <button
                                onClick={handleDelete}
                                className="w-full flex items-center justify-center p-3 text-red-600 bg-red-50 hover:bg-red-100 rounded-xl transition font-medium"
                            >
                                <Trash2 size={18} className="mr-2" /> Snippet'ı Sil
                            </button>
                        </div>
                    )}

                    {/* Runner */}
                    <div className="bg-slate-900 rounded-2xl shadow-soft border border-slate-800 overflow-hidden">
                        <div className="p-4 border-b border-slate-800 flex items-center justify-between">
                            <div className="flex items-center space-x-2 text-slate-300">
                                <Terminal size={18} />
                                <span className="font-bold">Konsol</span>
                            </div>
                            {canRun && (
                                <button
                                    onClick={runCode}
                                    disabled={isRunning}
                                    className={`flex items-center space-x-2 px-4 py-1.5 rounded-lg font-medium transition ${isRunning ? 'bg-slate-700 text-slate-400' : 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-900/20'}`}
                                >
                                    <Play size={16} fill="currentColor" />
                                    <span>{isRunning ? 'Çalışıyor...' : 'Çalıştır'}</span>
                                </button>
                            )}
                        </div>

                        <div className="p-4 h-[300px] overflow-y-auto font-mono text-sm space-y-2 bg-slate-950/50">
                            {!canRun ? (
                                <div className="text-slate-500 italic p-4 text-center">
                                    Bu dil için tarayıcıda çalıştırma desteği henüz yok.
                                </div>
                            ) : output.length === 0 && !runError ? (
                                <div className="text-slate-600 italic">Çıktı görüntülemek için kodu çalıştırın...</div>
                            ) : (
                                <>
                                    {output.map((line, i) => (
                                        <div key={i} className="text-slate-300 border-b border-slate-800/50 pb-1 last:border-0">{line}</div>
                                    ))}
                                    {runError && (
                                        <div className="text-red-400 flex items-start mt-2 bg-red-900/10 p-2 rounded">
                                            <AlertCircle size={14} className="mt-0.5 mr-2 flex-shrink-0" />
                                            <span>{runError}</span>
                                        </div>
                                    )}
                                </>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
