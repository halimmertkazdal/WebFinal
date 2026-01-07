import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import client from '../api/client';
import { useToast } from '../context/ToastContext';
import { Check, Code2, Type, FileCode, AlignLeft } from 'lucide-react';

export const CreateSnippet = () => {
    const [title, setTitle] = useState('');
    const [codeContent, setCodeContent] = useState('');
    const [description, setDescription] = useState('');
    const [languageId, setLanguageId] = useState<number | ''>('');
    const [languages, setLanguages] = useState([]);
    const navigate = useNavigate();
    const { addToast } = useToast();

    useEffect(() => {
        client.get('/languages')
            .then(res => setLanguages(res.data))
            .catch(err => addToast('Diller yüklenemedi', 'error'));
    }, []);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            await client.post('/snippets', { title, codeContent, description, languageId: Number(languageId) });
            addToast('Snippet başarıyla oluşturuldu! 🎉', 'success');
            navigate('/');
        } catch (e: any) {
            console.error('Create error:', e);
            addToast(e.response?.data?.message || 'Snippet oluşturulurken bir hata oluştu', 'error');
        }
    };

    return (
        <div className="max-w-4xl mx-auto px-4 py-12 pt-28">
            <div className="flex items-center space-x-3 mb-8">
                <div className="p-3 bg-indigo-100 rounded-xl">
                    <Code2 className="text-indigo-600" size={28} />
                </div>
                <div>
                    <h1 className="text-3xl font-extrabold text-slate-800 tracking-tight">Snippet Paylaş</h1>
                    <p className="text-slate-500">Kodunuzu toplulukla paylaşın ve saklayın.</p>
                </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-8 bg-white p-8 rounded-3xl shadow-soft border border-slate-100">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                    <div className="md:col-span-2">
                        <label className="block text-sm font-bold text-slate-700 mb-2 pl-1 flex items-center">
                            <Type size={16} className="mr-2 text-indigo-500" /> Başlık
                        </label>
                        <input
                            type="text"
                            className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition font-medium"
                            value={title}
                            onChange={e => setTitle(e.target.value)}
                            required
                            placeholder="Örn: Hızlı Sıralama Algoritması"
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-bold text-slate-700 mb-2 pl-1 flex items-center">
                            <FileCode size={16} className="mr-2 text-indigo-500" /> Dil
                        </label>
                        <div className="relative">
                            <select
                                className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition appearance-none font-medium cursor-pointer"
                                value={languageId}
                                onChange={e => setLanguageId(Number(e.target.value))}
                                required
                            >
                                <option value="">Dil Seçin</option>
                                {languages.map((lang: any) => (
                                    <option key={lang.id} value={lang.id}>{lang.name}</option>
                                ))}
                            </select>
                            <div className="absolute right-4 top-1/2 transform -translate-y-1/2 pointer-events-none text-slate-500">
                                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
                            </div>
                        </div>
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 pl-1 flex items-center">
                        <Code2 size={16} className="mr-2 text-indigo-500" /> Kod İçeriği
                    </label>
                    <div className="relative group">
                        <div className="absolute inset-0 bg-slate-900 rounded-xl translate-x-1 translate-y-1 -z-10 group-hover:translate-x-2 group-hover:translate-y-2 transition-transform duration-300"></div>
                        <textarea
                            className="w-full h-80 font-mono text-sm bg-slate-800 border-2 border-slate-700 rounded-xl py-4 px-5 text-slate-200 focus:outline-none focus:border-indigo-500 focus:bg-slate-900 transition resize-y leading-relaxed"
                            value={codeContent}
                            onChange={e => setCodeContent(e.target.value)}
                            required
                            placeholder="// Kodunuzu buraya yapıştırın..."
                            spellCheck="false"
                        />
                    </div>
                </div>

                <div>
                    <label className="block text-sm font-bold text-slate-700 mb-2 pl-1 flex items-center">
                        <AlignLeft size={16} className="mr-2 text-indigo-500" /> Açıklama <span className="text-slate-400 font-normal ml-1">(İsteğe bağlı)</span>
                    </label>
                    <textarea
                        className="w-full bg-slate-50 border border-slate-200 rounded-xl py-3.5 px-4 text-slate-800 focus:outline-none focus:ring-4 focus:ring-indigo-100 focus:border-indigo-500 transition font-medium"
                        value={description}
                        onChange={e => setDescription(e.target.value)}
                        rows={3}
                        placeholder="Bu kod parçası ne işe yarıyor?"
                    />
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        className="flex items-center space-x-2 btn-primary hover:scale-[1.02] active:scale-[0.98]"
                    >
                        <Check size={20} />
                        <span>Yayınla</span>
                    </button>
                </div>
            </form>
        </div>
    );
};
