"use client";

import React, { useState, useEffect } from 'react';
import { GlassCard } from '../glass-card';
import { MessageSquare, ThumbsUp, Calendar, Trophy, Share2, Award } from 'lucide-react';

interface Post {
  id: string;
  title: string;
  content: string;
  author: string;
  category: string;
  likes: number;
  replies: number;
  timestamp: string;
}

export default function DiscussionBoard() {
  const [posts, setPosts] = useState<Post[]>([]);
  const [newTitle, setNewTitle] = useState('');
  const [newContent, setNewContent] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');

  useEffect(() => {
    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/community/posts`)
      .then(res => res.json())
      .then(data => setPosts(data))
      .catch(() => {
        // Fallback static posts if backend is offline in preview
        setPosts([
          { id: "p1", title: "Tips for passing the React Work Sample challenge", content: "Ensure your state changes are batch updated correctly, and that tailwind variables are configured cleanly.", author: "Sarah Jenkins", category: "Mock Interviews", likes: 14, replies: 3, timestamp: "2 hrs ago" },
          { id: "p2", title: "How to stand out in Placify Expert Marketplace", content: "Always grade according to standard rubrics and write detailed qualitative review summaries.", author: "David Chen", category: "Expert Sessions", likes: 8, replies: 1, timestamp: "5 hrs ago" }
        ]);
      });
  }, []);

  const handleCreatePost = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle || !newContent) return;

    const postObj = {
      title: newTitle,
      content: newContent,
      author: "Alex Vance",
      category: "Mock Interviews"
    };

    fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000'}/api/community/posts`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(postObj)
    })
      .then(res => res.json())
      .then(newPost => {
        setPosts(prev => [newPost, ...prev]);
        setNewTitle('');
        setNewContent('');
      })
      .catch(() => {
        // Fallback local append
        const mockNew: Post = {
          id: `p${posts.length + 1}`,
          title: newTitle,
          content: newContent,
          author: "Alex Vance",
          category: "Mock Interviews",
          likes: 0,
          replies: 0,
          timestamp: "Just now"
        };
        setPosts(prev => [mockNew, ...prev]);
        setNewTitle('');
        setNewContent('');
      });
  };

  const filteredPosts = activeCategory === 'All' 
    ? posts 
    : posts.filter(p => p.category === activeCategory);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 text-left">
      {/* Left side posts list */}
      <div className="lg:col-span-8 space-y-6">
        
        {/* Create Post Form */}
        <GlassCard>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4">Create Community Post</h3>
          <form onSubmit={handleCreatePost} className="space-y-4">
            <input
              type="text"
              value={newTitle}
              onChange={(e) => setNewTitle(e.target.value)}
              placeholder="Topic Title"
              className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none"
            />
            <textarea
              value={newContent}
              onChange={(e) => setNewContent(e.target.value)}
              placeholder="What would you like to discuss?"
              rows={3}
              className="w-full bg-slate-900 border border-slate-800 focus:border-slate-700 rounded-xl px-4 py-2.5 text-sm outline-none resize-none"
            />
            <button type="submit" className="bg-orange-600 hover:bg-orange-500 text-white font-bold px-5 py-2.5 rounded-xl text-xs transition-colors">
              Publish Post
            </button>
          </form>
        </GlassCard>

        {/* Categories Bar */}
        <div className="flex gap-2 border-b border-slate-900 pb-2">
          {['All', 'Mock Interviews', 'Expert Sessions', 'Events'].map(cat => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${activeCategory === cat ? 'bg-slate-900 text-orange-400 border border-slate-800' : 'text-slate-500 hover:text-slate-300'}`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Posts List */}
        <div className="space-y-4">
          {filteredPosts.map(post => (
            <GlassCard key={post.id} className="hover:border-slate-800 transition-colors">
              <div className="flex justify-between items-start gap-4">
                <div>
                  <span className="text-[10px] bg-slate-900 border border-slate-800 text-slate-400 px-2 py-0.5 rounded font-bold uppercase tracking-wider">
                    {post.category}
                  </span>
                  <h4 className="text-sm font-bold text-slate-250 mt-2 hover:text-orange-450 transition-colors cursor-pointer">
                    {post.title}
                  </h4>
                  <p className="text-xs text-slate-400 mt-2 leading-relaxed">{post.content}</p>
                  
                  <div className="flex gap-4 mt-4 text-[10px] text-slate-500 font-semibold">
                    <span>By {post.author}</span>
                    <span>• {post.timestamp}</span>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <button className="flex items-center gap-1 hover:text-orange-400 text-slate-600 transition-colors">
                    <ThumbsUp className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{post.likes}</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-orange-400 text-slate-600 transition-colors">
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span className="text-xs font-bold">{post.replies}</span>
                  </button>
                </div>
              </div>
            </GlassCard>
          ))}
        </div>

      </div>

      {/* Right side widgets */}
      <div className="lg:col-span-4 space-y-6">
        
        {/* Leaderboard */}
        <GlassCard>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Trophy className="w-4.5 h-4.5 text-amber-500" /> Top Verifiers
          </h3>
          <div className="space-y-3">
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">1. Sarah Jenkins</span>
              <span className="text-emerald-400 font-bold">95 pts</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">2. Elena Rostova</span>
              <span className="text-emerald-400 font-bold">91 pts</span>
            </div>
            <div className="flex justify-between items-center text-xs">
              <span className="text-slate-300">3. David Chen</span>
              <span className="text-emerald-400 font-bold">87 pts</span>
            </div>
          </div>
        </GlassCard>

        {/* Badges / Referral */}
        <GlassCard glow>
          <h3 className="text-sm font-bold text-slate-200 uppercase tracking-wider mb-4 flex items-center gap-1.5">
            <Award className="w-4.5 h-4.5 text-orange-400" /> Achievements
          </h3>
          <div className="grid grid-cols-3 gap-3 text-center">
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
              <div className="w-6 h-6 rounded-full bg-orange-500/10 text-orange-400 flex items-center justify-center mx-auto text-xs font-black">10</div>
              <div className="text-[8px] text-slate-500 mt-1 uppercase font-bold">Perfect Attendance</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
              <div className="w-6 h-6 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto text-xs font-black">A</div>
              <div className="text-[8px] text-slate-500 mt-1 uppercase font-bold">Code Grade</div>
            </div>
            <div className="bg-slate-950 p-2.5 rounded-lg border border-slate-900">
              <div className="w-6 h-6 rounded-full bg-violet-500/10 text-violet-400 flex items-center justify-center mx-auto text-xs font-black">🔑</div>
              <div className="text-[8px] text-slate-500 mt-1 uppercase font-bold">Passport Owner</div>
            </div>
          </div>
        </GlassCard>

        {/* Referral banner */}
        <GlassCard className="bg-gradient-to-tr from-slate-950 to-orange-950/20 border-orange-500/10">
          <h4 className="text-xs uppercase tracking-widest text-orange-400 font-bold mb-1">Referral Program</h4>
          <p className="text-xs text-slate-400 leading-relaxed">
            Invite candidates to build their Passport. Earn 1% success commission on active hires.
          </p>
          <button className="w-full mt-4 bg-slate-900 border border-slate-800 hover:text-white px-3 py-2 rounded-xl text-xs font-bold flex justify-center items-center gap-1 transition-all">
            <Share2 className="w-3.5 h-3.5" /> Copy Referral Link
          </button>
        </GlassCard>

      </div>
    </div>
  );
}
