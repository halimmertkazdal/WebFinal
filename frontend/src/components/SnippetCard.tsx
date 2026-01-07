import React, { useState } from 'react';
import { Copy, Check, Bookmark, Trash2 } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import client from '../api/client';

interface SnippetProps {
    snippet: any;
    onBookmarkUpdate?: () => void;
}

export const SnippetCard: React.FC<SnippetProps> = ({ snippet, onBookmarkUpdate }) => {
    const { user } = useAuth();
    const [copied, setCopied] = useState(false);
    const [bookmarked, setBookmarked] = useState(snippet.isBookmarked);

    const copyToClipboard = () => {
        navigator.clipboard.writeText(snippet.codeContent);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const toggleBookmark = async () => {
        if (!user) return;
        try {
            const { data } = await client.post(`/bookmarks/${snippet.id}`);
            setBookmarked(data.bookmarked);
            if (onBookmarkUpdate) onBookmarkUpdate();
        } catch (e) {
            console.error(e);
        }
    };

    return (
        <div className="bg-white rounded-2xl overflow-hidden border border-slate-100 shadow-[0_2px_15px_-3px_rgba(0,0,0,0.07),0_10px_20px_-2px_rgba(0,0,0,0.04)] hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:-translate-y-1 transition-all duration-300 group h-full flex flex-col">
            <div className="p-5 border-b border-slate-50 flex justify-between items-start bg-gradient-to-br from-white to-slate-50/50">
                <div>
                    <div className="flex items-center space-x-2 mb-1.5">
                        <h3 className="font-bold text-slate-800 text-lg">{snippet.title}</h3>
                        <span
                            className="text-[10px] px-2.5 py-1 rounded-full font-bold uppercase tracking-wider shadow-sm"
                            style={{ backgroundColor: snippet.language.colorCode + '15', color: snippet.language.colorCode }}
                        >
                            {snippet.language.name}
                        </span>
                    </div>
                    <p className="text-xs text-slate-500 flex items-center space-x-1.5 font-medium">
                        <span>@{snippet.user.username}</span>
                        <span className="w-1 h-1 rounded-full bg-slate-300"></span>
                        <span>{new Date(snippet.createdAt).toLocaleDateString()}</span>
                    </p>
                </div>
                <div className="flex space-x-1">
                    {/* Show delete button if user is owner or admin */}
                    {(user?.role === 'admin' || user?.username === snippet.user.username) && (
                        <button
                            onClick={async () => {
                                if (!window.confirm('Snippet silinsin mi?')) return;
                                try {
                                    await client.delete(`/snippets/${snippet.id}`);
                                    // ideally trigger a refresh here, but for now just reload or use context
                                    window.location.reload();
                                } catch (e) { alert('Silme başarısız'); }
                            }}
                            className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition"
                        >
                            <Trash2 size={18} />
                        </button>
                    )}

                    {/* Hide bookmark for editors as requested */}
                    {user?.role !== 'editor' && (
                        <button
                            onClick={toggleBookmark}
                            className={`p-2 rounded-lg transition-all duration-200 ${bookmarked ? 'text-pink-500 bg-pink-50' : 'text-slate-400 hover:text-pink-500 hover:bg-pink-50'}`}
                        >
                            <Bookmark size={18} fill={bookmarked ? "currentColor" : "none"} />
                        </button>
                    )}

                    <button
                        onClick={copyToClipboard}
                        className="p-2 text-slate-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition"
                    >
                        {copied ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                    </button>
                </div>
            </div>

            <div className="relative group/code flex-1 flex flex-col min-h-0 bg-slate-900">
                <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-b from-transparent to-black/20 pointer-events-none opacity-0 group-hover/code:opacity-100 transition-opacity duration-300"></div>
                <pre className="p-5 overflow-x-auto text-sm font-mono text-slate-300 scrollbar-thin scrollbar-thumb-slate-700 scrollbar-track-transparent flex-1">
                    <code>{snippet.codeContent}</code>
                </pre>
                {snippet.description && (
                    <div className="px-5 py-4 bg-white text-sm text-slate-600 leading-relaxed border-t border-slate-100 mt-auto">
                        {snippet.description}
                    </div>
                )}
            </div>
        </div>
    );
};
