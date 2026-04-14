import React, { useEffect, useState } from 'react';
import { ArrowLeft, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { fetchPageContent, type PageContent } from '../../services/contentApi';

interface BlogPostPageProps {
    slug: string;
    onBack: () => void;
}

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onBack }) => {
    const [post, setPost] = useState<PageContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setError(null);
            try {
                const data = await fetchPageContent(slug);
                if (!data) {
                    setError('Yazı bulunamadı.');
                } else {
                    setPost(data);
                }
            } catch (err) {
                console.error(err);
                setError('Bir hata oluştu. Lütfen daha sonra tekrar deneyiniz.');
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            loadContent();
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-emerald-500" />
                <p className="text-gray-400">Yazı yükleniyor...</p>
            </div>
        );
    }

    if (error || !post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white px-4">
                <div className="bg-red-500/10 border border-red-500/20 rounded-xl p-8 max-w-lg w-full text-center">
                    <h2 className="text-2xl font-bold mb-4 text-red-500">Hata</h2>
                    <p className="text-gray-300 mb-6">{error || 'Beklenmedik bir hata oluştu.'}</p>
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors border border-white/10"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Geri Dön</span>
                    </button>
                </div>
            </div>
        );
    }

    // Clean the HTML content
    const sanitizedContent = DOMPurify.sanitize(post.content.body);

    return (
        <div className="relative min-h-screen bg-black text-white selection:bg-emerald-500/30">
            {/* Background Gradient */}
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black pointer-events-none" />

            <main className="relative z-10 container mx-auto px-4 py-24 max-w-4xl">
                {/* Navigation */}
                <button
                    onClick={onBack}
                    className="group flex items-center gap-2 text-gray-400 hover:text-emerald-400 transition-colors mb-12"
                >
                    <div className="p-2 rounded-full bg-white/5 group-hover:bg-emerald-500/10 border border-white/10 group-hover:border-emerald-500/20 transition-all">
                        <ArrowLeft className="w-5 h-5" />
                    </div>
                    <span className="font-medium">Blog'a Dön</span>
                </button>

                <article className="prose prose-invert prose-lg max-w-none">
                    {/* Header */}
                    <header className="mb-12 border-b border-white/10 pb-8">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6 leading-tight">
                            {post.title}
                        </h1>

                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                            {/* Since API doesn't return date/author yet, we use placeholders or hide them. 
                   Assuming API might update later, otherwise we keep it simple. */}
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
                                <span>{post.business.name}</span>
                            </div>
                        </div>
                    </header>

                    {/* Content */}
                    <div
                        className="markdown-content space-y-6 text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                </article>
            </main>

            {/* Custom Styles for injected HTML content */}
            <style>{`
        .markdown-content h1 { @apply text-3xl font-bold text-white mt-12 mb-6; }
        .markdown-content h2 { @apply text-2xl font-bold text-white mt-10 mb-5; }
        .markdown-content h3 { @apply text-xl font-bold text-white mt-8 mb-4; }
        .markdown-content p { @apply mb-6 leading-relaxed text-gray-300; }
        .markdown-content ul { @apply list-disc list-outside ml-6 mb-6 space-y-2; }
        .markdown-content ol { @apply list-decimal list-outside ml-6 mb-6 space-y-2; }
        .markdown-content li { @apply text-gray-300 pl-2; }
        .markdown-content a { @apply text-emerald-400 hover:text-emerald-300 underline underline-offset-4 transition-colors; }
        .markdown-content blockquote { @apply border-l-4 border-emerald-500/50 pl-6 py-2 my-8 italic text-gray-400 bg-white/5 rounded-r-lg; }
        .markdown-content img { @apply rounded-xl border border-white/10 my-8 w-full h-auto; }
        .markdown-content code { @apply bg-white/10 px-1.5 py-0.5 rounded text-emerald-300 font-mono text-sm; }
        .markdown-content pre { @apply bg-gray-900 border border-white/10 p-4 rounded-xl overflow-x-auto my-6; }
        .markdown-content pre code { @apply bg-transparent p-0 text-gray-300; }
      `}</style>
        </div>
    );
};

export default BlogPostPage;
