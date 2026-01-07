import { useEffect, useState } from 'react';
import client from '../api/client';
import { SnippetCard } from '../components/SnippetCard';
import { Bookmark } from 'lucide-react';

export const Bookmarks = () => {
    const [bookmarks, setBookmarks] = useState([]);
    const [loading, setLoading] = useState(true);

    const fetchBookmarks = async () => {
        try {
            const { data } = await client.get('/bookmarks');
            setBookmarks(data);
        } catch (e) {
            console.error(e);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchBookmarks();
    }, []);

    if (loading) return <div className="text-center p-10 text-slate-400">Loading bookmarks...</div>;

    return (
        <div className="max-w-7xl mx-auto px-4 py-8">
            <div className="flex items-center space-x-3 mb-8">
                <Bookmark className="text-emerald-500" size={32} />
                <h1 className="text-3xl font-bold text-white">My Bookmarks</h1>
            </div>

            <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
                {bookmarks.length > 0 ? (
                    bookmarks.map((b: any) => (
                        <div key={b.id} className="break-inside-avoid">
                            <SnippetCard snippet={{ ...b.snippet, isBookmarked: true }} onBookmarkUpdate={fetchBookmarks} />
                        </div>
                    ))
                ) : (
                    <div className="col-span-full py-20 text-center text-slate-500">
                        You haven't bookmarked any snippets yet.
                    </div>
                )}
            </div>
        </div>
    );
};
