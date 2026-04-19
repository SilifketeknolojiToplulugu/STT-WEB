import React, { useEffect, useState } from 'react';
import { ArrowLeft, Calendar, Clock, User, Loader2 } from 'lucide-react';
import DOMPurify from 'dompurify';
import { fetchPageContent, type PageContent } from '../../services/contentApi';
import type { BlogPostData } from './BlogPage';

interface BlogPostPageProps {
    slug: string;
    onBack: () => void;
    fallbackPost?: BlogPostData | null;
}

const BackButton: React.FC<{ onClick: () => void }> = ({ onClick }) => (
    <button
        onClick={onClick}
        className="group flex items-center gap-2 text-gray-400 hover:text-yellow-300 transition-colors mb-12"
    >
        <div className="p-2 rounded-full bg-white/5 group-hover:bg-yellow-500/10 border border-white/10 group-hover:border-yellow-400/30 transition-all">
            <ArrowLeft className="w-5 h-5" />
        </div>
        <span className="font-medium">Blog'a Dön</span>
    </button>
);

const FallbackPostRenderer: React.FC<{ post: BlogPostData; onBack: () => void }> = ({ post, onBack }) => (
    <div className="relative min-h-screen bg-black text-white">
        <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black pointer-events-none" />
        <main className="relative z-10 container mx-auto px-4 py-24 max-w-4xl">
            <BackButton onClick={onBack} />
            <article>
                <header className="mb-10 border-b border-yellow-400/20 pb-8">
                    <div className="flex flex-wrap gap-2 mb-4">
                        {post.tags.map((tag) => (
                            <span key={tag} className="bg-yellow-400/10 border border-yellow-400/20 rounded-full px-3 py-1 text-xs text-yellow-200/80 uppercase tracking-wider">
                                #{tag}
                            </span>
                        ))}
                    </div>
                    <h1 className="text-3xl md:text-5xl font-bold text-white mb-6 leading-tight">
                        {post.title}
                    </h1>
                    <p className="text-gray-300 text-lg md:text-xl leading-relaxed mb-6">
                        {post.description}
                    </p>
                    <div className="flex flex-wrap items-center gap-5 text-sm text-gray-400">
                        <span className="flex items-center gap-2">
                            <User className="w-4 h-4 text-yellow-300/70" />
                            {post.metadata.author}
                        </span>
                        <span className="flex items-center gap-2">
                            <Calendar className="w-4 h-4 text-yellow-300/70" />
                            {post.metadata.date}
                        </span>
                        <span className="flex items-center gap-2">
                            <Clock className="w-4 h-4 text-yellow-300/70" />
                            {post.metadata.readingTime}
                        </span>
                    </div>
                </header>

                <div className="space-y-10">
                    {post.sections.map((section, i) => (
                        <section key={i} className="space-y-4">
                            {section.heading && (
                                <h2 className="text-2xl font-semibold text-white leading-snug">
                                    {section.heading}
                                </h2>
                            )}
                            {section.paragraphs.map((p, j) => (
                                <p key={j} className="text-gray-300 leading-relaxed text-base md:text-lg">
                                    {p}
                                </p>
                            ))}
                            {section.bullets && section.bullets.length > 0 && (
                                <ul className="list-disc list-outside ml-6 space-y-2 text-gray-300">
                                    {section.bullets.map((b, k) => (
                                        <li key={k} className="leading-relaxed">{b}</li>
                                    ))}
                                </ul>
                            )}
                        </section>
                    ))}
                </div>

                {post.callToAction && (
                    <div className="mt-14 pt-8 border-t border-yellow-400/20">
                        <a
                            href={post.callToAction.href}
                            target={post.callToAction.href.startsWith('http') ? '_blank' : undefined}
                            rel={post.callToAction.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                            className="inline-flex items-center gap-2 rounded-full border border-yellow-400/40
                                     px-6 py-3 text-sm font-semibold text-yellow-200 transition-all duration-300
                                     hover:bg-yellow-500/10 hover:border-yellow-300/60"
                        >
                            {post.callToAction.label}
                        </a>
                    </div>
                )}
            </article>
        </main>
    </div>
);

const BlogPostPage: React.FC<BlogPostPageProps> = ({ slug, onBack, fallbackPost }) => {
    const [post, setPost] = useState<PageContent | null>(null);
    const [loading, setLoading] = useState(true);
    const [apiError, setApiError] = useState(false);

    useEffect(() => {
        const loadContent = async () => {
            setLoading(true);
            setApiError(false);
            try {
                const data = await fetchPageContent(slug);
                if (data) {
                    setPost(data);
                } else {
                    setApiError(true);
                }
            } catch (err) {
                console.error(err);
                setApiError(true);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            loadContent();
        } else {
            setLoading(false);
        }
    }, [slug]);

    if (loading) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black">
                <Loader2 className="w-10 h-10 animate-spin mb-4 text-yellow-400" />
                <p className="text-gray-400">Yazı yükleniyor...</p>
            </div>
        );
    }

    if (apiError && fallbackPost) {
        return <FallbackPostRenderer post={fallbackPost} onBack={onBack} />;
    }

    if (apiError || !post) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen text-white bg-black px-4">
                <div className="bg-yellow-500/5 border border-yellow-400/20 rounded-2xl p-8 max-w-lg w-full text-center">
                    <h2 className="text-2xl font-bold mb-4 text-yellow-300">Yazı Bulunamadı</h2>
                    <p className="text-gray-400 mb-6">Bu yazıya doğrudan erişilemedi. Blog listesinden ulaşabilirsiniz.</p>
                    <button
                        onClick={onBack}
                        className="flex items-center justify-center gap-2 mx-auto px-6 py-3 rounded-full bg-yellow-500/10 hover:bg-yellow-500/20 transition-colors border border-yellow-400/30"
                    >
                        <ArrowLeft className="w-4 h-4" />
                        <span>Blog'a Dön</span>
                    </button>
                </div>
            </div>
        );
    }

    const sanitizedContent = DOMPurify.sanitize(post.content.body);

    return (
        <div className="relative min-h-screen bg-black text-white">
            <div className="fixed inset-0 bg-gradient-to-br from-gray-900 to-black pointer-events-none" />
            <main className="relative z-10 container mx-auto px-4 py-24 max-w-4xl">
                <BackButton onClick={onBack} />
                <article className="prose prose-invert prose-lg max-w-none">
                    <header className="mb-12 border-b border-white/10 pb-8">
                        <h1 className="text-4xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-white via-gray-200 to-gray-400 mb-6 leading-tight">
                            {post.title}
                        </h1>
                        <div className="flex flex-wrap items-center gap-6 text-sm text-gray-400">
                            <div className="flex items-center gap-2">
                                <span className="w-1.5 h-1.5 rounded-full bg-yellow-400" />
                                <span>{post.business.name}</span>
                            </div>
                        </div>
                    </header>
                    <div
                        className="markdown-content space-y-6 text-gray-300 leading-relaxed"
                        dangerouslySetInnerHTML={{ __html: sanitizedContent }}
                    />
                </article>
            </main>
            <style>{`
        .markdown-content h1 { font-size: 1.875rem; font-weight: 700; color: white; margin-top: 3rem; margin-bottom: 1.5rem; }
        .markdown-content h2 { font-size: 1.5rem; font-weight: 700; color: white; margin-top: 2.5rem; margin-bottom: 1.25rem; }
        .markdown-content h3 { font-size: 1.25rem; font-weight: 700; color: white; margin-top: 2rem; margin-bottom: 1rem; }
        .markdown-content p { margin-bottom: 1.5rem; line-height: 1.75; color: #d1d5db; }
        .markdown-content ul { list-style-type: disc; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .markdown-content ol { list-style-type: decimal; margin-left: 1.5rem; margin-bottom: 1.5rem; }
        .markdown-content li { color: #d1d5db; padding-left: 0.5rem; margin-bottom: 0.5rem; }
        .markdown-content a { color: #fbbf24; text-decoration: underline; text-underline-offset: 4px; }
        .markdown-content a:hover { color: #fcd34d; }
        .markdown-content blockquote { border-left: 4px solid rgba(251, 191, 36, 0.5); padding-left: 1.5rem; padding-top: 0.5rem; padding-bottom: 0.5rem; margin: 2rem 0; font-style: italic; color: #9ca3af; background: rgba(255,255,255,0.03); border-radius: 0 0.5rem 0.5rem 0; }
        .markdown-content img { border-radius: 0.75rem; border: 1px solid rgba(255,255,255,0.1); margin: 2rem 0; width: 100%; height: auto; }
        .markdown-content code { background: rgba(255,255,255,0.1); padding: 0.125rem 0.375rem; border-radius: 0.25rem; color: #fbbf24; font-family: monospace; font-size: 0.875rem; }
        .markdown-content pre { background: #111827; border: 1px solid rgba(255,255,255,0.1); padding: 1rem; border-radius: 0.75rem; overflow-x: auto; margin: 1.5rem 0; }
        .markdown-content pre code { background: transparent; padding: 0; color: #d1d5db; }
      `}</style>
        </div>
    );
};

export default BlogPostPage;
