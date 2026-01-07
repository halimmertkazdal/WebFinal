import { useEffect, useState } from 'react';
import client from '../api/client';
import { SnippetCard } from '../components/SnippetCard';
import { Search, Code2 } from 'lucide-react';

export const Home = () => {
    const [snippets, setSnippets] = useState([]);
    const [filteredSnippets, setFilteredSnippets] = useState([]);
    const [search, setSearch] = useState('');
    const [loading, setLoading] = useState(true);

    const fetchSnippets = async () => {
        try {
            const { data } = await client.get('/snippets');
            setSnippets(data);
            setFilteredSnippets(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchSnippets();
    }, []);

    useEffect(() => {
        const results = snippets.filter((s: any) =>
            s.title.toLowerCase().includes(search.toLowerCase()) ||
            s.language.name.toLowerCase().includes(search.toLowerCase())
        );
        setFilteredSnippets(results);
    }, [search, snippets]);

    if (loading) return <div className="text-center p-10 text-slate-400">Yükleniyor...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-32 pb-24 min-h-screen bg-hero-gradient bg-fixed bg-cover">
            <div className="flex flex-col md:flex-row md:items-center justify-between mb-12 gap-8 relative z-10">
                <div>
                    <h1 className="text-5xl font-extrabold text-slate-900 mb-3 tracking-tight">CodeSnip'i Keşfet</h1>
                    <p className="text-slate-500 text-lg">Kodlama sorunlarınız için en iyi çözümler burada.</p>
                </div>

                <div className="relative group w-full md:w-96">
                    <div className="relative flex items-center bg-white/80 backdrop-blur-sm border-0 rounded-full px-4 py-3 shadow-sm hover:shadow-md focus-within:shadow-xl transition-all duration-300 ring-1 ring-slate-200 focus-within:ring-2 focus-within:ring-indigo-500/20">
                        <Search className="text-slate-400 group-focus-within:text-indigo-500 transition-colors" size={20} />
                        <input
                            type="text"
                            className="w-full bg-transparent border-none outline-none focus:outline-none focus:ring-0 text-slate-800 placeholder:text-slate-400 ml-3 text-sm font-medium"
                            placeholder="Snippet veya dil ara..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                        />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 pb-20">
                {filteredSnippets.map((snippet: any) => (
                    <div key={snippet.id} className="h-full">
                        <SnippetCard snippet={snippet} />
                    </div>
                ))}
            </div>

            {filteredSnippets.length === 0 && (
                <div className="text-center py-32 bg-white/50 backdrop-blur-sm rounded-3xl border border-white/50 shadow-soft">
                    <div className="inline-block p-6 rounded-full bg-indigo-50 mb-6">
                        <Code2 size={48} className="text-indigo-400" />
                    </div>
                    <h3 className="text-slate-800 text-xl font-bold mb-2">Snippet bulunamadı</h3>
                    <p className="text-slate-500">Aramanızla eşleşen hiçbir kayıt bulamadık.</p>
                </div>
            )}
        </div>
    );
};
