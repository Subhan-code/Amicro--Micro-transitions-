import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Share2, Check, X } from 'lucide-react';
import { useWebHaptics } from '../hooks/useWebHaptics';
import { BLOG_POSTS, BlogPost } from '../data/blogsData';

interface BlogPageProps {
  theme: 'dark' | 'light';
  onNavigateHome: () => void;
  showToast?: (message: string) => void;
  triggerHaptic?: (type: 'light' | 'medium' | 'success' | 'error') => void;
}

export function BlogPage({
  theme = 'dark',
  showToast,
  triggerHaptic,
}: BlogPageProps) {
  const [activePost, setActivePost] = useState<BlogPost | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);
  const { trigger } = useWebHaptics();
  const isDark = theme === 'dark';

  const handleShare = (post: BlogPost) => {
    (triggerHaptic || trigger)('light');
    const shareUrl = `${window.location.origin}/blog/${post.slug}`;
    navigator.clipboard.writeText(shareUrl)
      .then(() => {
        setCopiedLink(true);
        if (showToast) showToast('Article link copied to clipboard!');
        setTimeout(() => setCopiedLink(false), 1800);
      });
  };

  const handleOpenPost = (post: BlogPost) => {
    (triggerHaptic || trigger)('medium');
    setActivePost(post);
    window.history.pushState(null, '', `/blog/${post.slug}`);
  };

  const handleClosePost = () => {
    (triggerHaptic || trigger)('light');
    setActivePost(null);
    window.history.pushState(null, '', '/blog');
  };

  return (
    <div className={`w-full min-h-dvh font-sans pb-20 transition-colors select-none ${
      isDark ? 'bg-[#08080a] text-[#ededed] selection:bg-neutral-800' : 'bg-[#FAFAFA] text-neutral-900 selection:bg-neutral-200'
    }`}>
      
      {/* Left-aligned header inside max-w-[960px] */}
      <section className="w-full max-w-[960px] mx-auto px-4 sm:px-6 pt-16 pb-6">
        <div className="flex w-full flex-col gap-[4px]">
          <p className={`text-[16px] leading-[22px] font-medium tracking-[-0.24px] m-0 ${
            isDark ? 'text-white/40' : 'text-neutral-500'
          }`}>
            Engineering notes
          </p>
          <h1 className={`text-[24px] leading-[30px] font-semibold tracking-[-0.6px] m-0 ${
            isDark ? 'text-[#fafafa]' : 'text-neutral-900'
          }`}>
            Blog
          </h1>
        </div>
      </section>

      {/* Blog Posts Shell Section */}
      <section className="w-full max-w-[960px] mx-auto px-4 sm:px-6">
        {/* Shell */}
        <div className={`relative overflow-hidden rounded-[16px] outline -outline-offset-1 ${
          isDark ? 'outline-white/[0.03]' : 'outline-black/[0.04]'
        }`}>
          {/* Grid inside shell */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {BLOG_POSTS.slice(0, 4).map((post) => {
              const cleanReadTime = post.readTime.replace(' read', '');
              
              return (
                <a
                  key={post.id}
                  href={`/blog/${post.slug}`}
                  onClick={(e) => {
                    e.preventDefault();
                    handleOpenPost(post);
                  }}
                  className={`group relative flex flex-col gap-[14px] overflow-hidden rounded-[16px] px-[20px] pt-[18px] pb-[18px] transition-colors no-underline cursor-pointer select-none ${
                    isDark
                      ? 'bg-white/[0.08] hover:bg-white/[0.11]'
                      : 'bg-white hover:bg-neutral-50/80 border border-neutral-200/80'
                  }`}
                >
                  {/* Title */}
                  <h2 className={`text-[17px] leading-[24px] font-semibold tracking-[-0.02em] m-0 transition-colors ${
                    isDark ? 'text-[#fafafa] group-hover:text-white' : 'text-neutral-900 group-hover:text-black'
                  }`}>
                    {post.title}
                  </h2>

                  {/* Excerpt */}
                  <p className={`text-[13.5px] leading-[20px] font-normal line-clamp-2 m-0 ${
                    isDark ? 'text-white/50' : 'text-neutral-600'
                  }`}>
                    {post.excerpt}
                  </p>

                  {/* Bottom Row */}
                  <div className="flex items-center justify-between gap-[16px] mt-auto pt-1">
                    <p className={`text-[13px] leading-[18px] font-medium tracking-tight m-0 ${
                      isDark ? 'text-white/40' : 'text-neutral-500'
                    }`}>
                      {post.date} · {cleanReadTime}
                    </p>

                    {/* Ghost Control */}
                    <span className={`flex h-[32px] shrink-0 items-center justify-center rounded-[8px] px-[14px] py-[7px] text-[13px] leading-[16px] font-medium transition-colors ${
                      isDark
                        ? 'bg-white/[0.06] text-[#fafafa] hover:bg-white/[0.12]'
                        : 'bg-black/[0.05] text-neutral-900 hover:bg-black/[0.10]'
                    }`}>
                      Read
                    </span>
                  </div>
                </a>
              );
            })}
          </div>
        </div>

        {/* Footnote under the shell */}
        <div className="mt-3 flex flex-wrap items-center gap-1.5 text-[14px] leading-[20px]">
          <p className="text-neutral-500 m-0">
            Notes on motion, registries, and interface physics.
          </p>
          <a
            href="/blog"
            className="inline-flex cursor-pointer flex-shrink-0 items-center justify-center gap-[5px] text-blue-600 hover:text-blue-700 font-medium no-underline transition-colors focus:outline-none"
          >
            <span>View all</span>
            <span>
              <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg" className="size-4">
                <path d="M11.9985 4L4 11.9985M11.9985 4L4.00146 4.00146M11.9985 4L12 12" stroke="currentColor" strokeWidth="1.25" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </span>
          </a>
        </div>
      </section>

      {/* Reader Modal / Overlay View */}
      <AnimatePresence>
        {activePost && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className={`fixed inset-0 z-50 overflow-y-auto backdrop-blur-md flex justify-center p-3 sm:p-6 ${
              isDark ? 'bg-black/85' : 'bg-black/45'
            }`}
          >
            <motion.div
              initial={{ scale: 0.98, y: 12 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.98, y: 12 }}
              transition={{ duration: 0.2 }}
              className={`relative w-full max-w-[760px] rounded-2xl border p-6 sm:p-8 my-auto overflow-hidden ${
                isDark
                  ? 'bg-[#0f0f11] border-white/10 text-white shadow-2xl'
                  : 'bg-white border-neutral-200 text-neutral-900 shadow-2xl'
              }`}
            >
              {/* Close Button */}
              <button
                type="button"
                onClick={handleClosePost}
                className={`absolute top-5 right-5 p-2 rounded-full cursor-pointer border-0 transition-colors z-10 ${
                  isDark ? 'bg-white/10 hover:bg-white/20 text-white' : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800'
                }`}
                aria-label="Close"
              >
                <X className="w-4 h-4" />
              </button>

              {/* Article Header */}
              <div className="mb-6 pr-8">
                <span className={`text-[11px] font-mono uppercase tracking-wider block mb-2 ${
                  isDark ? 'text-neutral-400' : 'text-neutral-500'
                }`}>
                  {activePost.category}
                </span>
                
                <h1 className="text-2xl sm:text-3xl font-bold tracking-tight leading-snug mb-3">
                  {activePost.title}
                </h1>

                <div className={`flex items-center gap-3 text-xs font-mono pb-4 border-b ${
                  isDark ? 'text-neutral-400 border-white/10' : 'text-neutral-500 border-neutral-200'
                }`}>
                  <span>{activePost.date}</span>
                  <span>•</span>
                  <span>{activePost.readTime}</span>
                </div>
              </div>

              {/* Article Body */}
              <div className={`text-[14.5px] leading-[26px] space-y-4 font-sans ${
                isDark ? 'text-neutral-300' : 'text-neutral-700'
              }`}>
                {activePost.content.split('\n\n').map((paragraph, pIdx) => {
                  if (paragraph.startsWith('## ')) {
                    return (
                      <h2 key={pIdx} className={`text-base sm:text-lg font-bold tracking-tight pt-4 pb-1 border-b ${
                        isDark ? 'text-white border-white/10' : 'text-neutral-900 border-neutral-200'
                      }`}>
                        {paragraph.replace('## ', '')}
                      </h2>
                    );
                  }
                  if (paragraph.startsWith('```')) {
                    const lines = paragraph.split('\n');
                    const code = lines.slice(1, -1).join('\n');
                    return (
                      <div key={pIdx} className={`p-4 rounded-xl border font-mono text-xs overflow-x-auto ${
                        isDark ? 'bg-black/60 border-white/10 text-neutral-200' : 'bg-neutral-50 border-neutral-200 text-neutral-800'
                      }`}>
                        <pre className="m-0"><code>{code}</code></pre>
                      </div>
                    );
                  }
                  if (paragraph.startsWith('---')) {
                    return <hr key={pIdx} className={`my-4 ${isDark ? 'border-white/10' : 'border-neutral-200'}`} />;
                  }
                  return (
                    <p key={pIdx} className={isDark ? 'text-neutral-300' : 'text-neutral-700'}>
                      {paragraph}
                    </p>
                  );
                })}
              </div>

              {/* Article Bottom Actions */}
              <div className={`flex items-center justify-between pt-6 mt-6 border-t ${
                isDark ? 'border-white/10' : 'border-neutral-200'
              }`}>
                <button
                  type="button"
                  onClick={handleClosePost}
                  className={`px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
                    isDark
                      ? 'bg-white/5 hover:bg-white/10 text-white border-white/10'
                      : 'bg-neutral-100 hover:bg-neutral-200 text-neutral-800 border-neutral-200'
                  }`}
                >
                  Close
                </button>

                <button
                  type="button"
                  onClick={() => handleShare(activePost)}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg text-xs font-medium cursor-pointer border transition-colors ${
                    isDark
                      ? 'bg-white text-black hover:bg-neutral-200 border-transparent'
                      : 'bg-neutral-900 text-white hover:bg-neutral-800 border-transparent'
                  }`}
                >
                  {copiedLink ? (
                    <Check className={`w-3.5 h-3.5 ${isDark ? 'text-black' : 'text-white'}`} />
                  ) : (
                    <Share2 className={`w-3.5 h-3.5 ${isDark ? 'text-black' : 'text-white'}`} />
                  )}
                  <span>{copiedLink ? 'Copied' : 'Share'}</span>
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
