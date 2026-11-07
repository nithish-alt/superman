import React, { useState } from 'react';
import { INITIAL_NEWS } from '../data/mockData';
import { DisasterNewsItem } from '../types';
import {
  Newspaper,
  Search,
  Filter,
  MapPin,
  Clock,
  ExternalLink,
  X,
  ShieldCheck,
  Tag,
  BookOpen,
} from 'lucide-react';

export const DisasterNewsPage: React.FC = () => {
  const [newsList] = useState<DisasterNewsItem[]>(INITIAL_NEWS);
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [activeModalNews, setActiveModalNews] = useState<DisasterNewsItem | null>(null);

  const categories = [
    'ALL',
    'Cyclone',
    'Flood',
    'Earthquake',
    'Government Notice',
    'Safety Update',
  ];

  const filteredNews = newsList.filter((item) => {
    const matchesSearch =
      item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.location.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesCategory =
      selectedCategory === 'ALL' || item.category === selectedCategory;

    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Top Banner */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/30">
              <Newspaper className="w-4 h-4" />
            </div>
            <h1 className="text-xl font-bold text-white">DAILY DISASTER NEWS (INDIA)</h1>
            <span className="text-xs bg-blue-500/20 text-blue-300 border border-blue-500/30 px-2 py-0.5 rounded font-mono">
              Press & Media Wire
            </span>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Authoritative reports, NDRF rescue dispatches, IMD warnings, and Ministry of Education safety updates for schools across India.
          </p>
        </div>

        <span className="text-[11px] font-mono text-amber-400 bg-amber-500/10 border border-amber-500/30 px-3 py-1.5 rounded-lg">
          Simulated Wire Service (Demo)
        </span>
      </div>

      {/* Search and Category Filter Toolbar */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 flex flex-col sm:flex-row items-center justify-between gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search news headlines, cities or keywords..."
            className="w-full bg-slate-950 border border-slate-700 rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-blue-500"
          />
        </div>

        {/* Categories */}
        <div className="flex flex-wrap items-center gap-1.5 w-full sm:w-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-slate-950 text-slate-400 hover:text-white border border-slate-800'
              }`}
            >
              {cat === 'ALL' ? 'All Stories' : cat}
            </button>
          ))}
        </div>
      </div>

      {/* News Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-6">
        {filteredNews.map((news) => (
          <div
            key={news.id}
            className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden hover:border-slate-700 transition-all flex flex-col justify-between group shadow-xl"
          >
            <div>
              {/* Image Frame */}
              <div className="relative h-56 w-full overflow-hidden bg-slate-950">
                <img
                  src={news.imageUrl}
                  alt={news.title}
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
                <div className="absolute top-3 left-3 flex items-center gap-2">
                  <span className="bg-slate-900/90 backdrop-blur text-white font-bold text-[10px] px-2.5 py-1 rounded-md border border-slate-700 uppercase tracking-wider">
                    {news.category}
                  </span>
                  {news.verifiedOfficial && (
                    <span className="bg-emerald-600 text-white font-semibold text-[10px] px-2 py-0.5 rounded flex items-center gap-1">
                      <ShieldCheck className="w-3 h-3" />
                      Official
                    </span>
                  )}
                </div>
                <div className="absolute bottom-3 right-3 text-[10px] font-mono bg-slate-950/80 backdrop-blur text-slate-300 px-2 py-0.5 rounded border border-slate-800">
                  {news.readTime}
                </div>
              </div>

              {/* Content Body */}
              <div className="p-5 space-y-2.5">
                <div className="flex items-center gap-3 text-[11px] text-slate-400 font-mono">
                  <span className="flex items-center gap-1">
                    <MapPin className="w-3.5 h-3.5 text-blue-400" />
                    <span>{news.location}</span>
                  </span>
                  <span>·</span>
                  <span className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-500" />
                    <span>{news.publishedDate}</span>
                  </span>
                </div>

                <h3 className="text-base font-bold text-white group-hover:text-blue-300 transition-colors line-clamp-2">
                  {news.title}
                </h3>

                <p className="text-xs text-slate-400 leading-relaxed line-clamp-3">
                  {news.description}
                </p>
              </div>
            </div>

            {/* Footer with Source & Read More Button */}
            <div className="px-5 py-3.5 bg-slate-950/50 border-t border-slate-800 flex items-center justify-between">
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[200px]">
                Source: {news.source}
              </span>

              <button
                onClick={() => setActiveModalNews(news)}
                className="px-3 py-1.5 bg-blue-600 hover:bg-blue-500 text-white rounded-lg text-xs font-bold flex items-center gap-1.5 transition-colors shadow-md"
              >
                <span>Read More</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* Detailed News Modal */}
      {activeModalNews && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-in fade-in">
          <div className="bg-slate-900 border border-slate-700 rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden max-h-[90vh] flex flex-col">
            <div className="relative h-64 w-full bg-slate-950 shrink-0">
              <img
                src={activeModalNews.imageUrl}
                alt={activeModalNews.title}
                referrerPolicy="no-referrer"
                className="w-full h-full object-cover"
              />
              <button
                onClick={() => setActiveModalNews(null)}
                className="absolute top-3 right-3 p-1.5 bg-slate-900/90 text-white rounded-lg hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="p-6 overflow-y-auto space-y-4">
              <div className="flex items-center gap-3 text-xs text-slate-400 font-mono">
                <span className="px-2 py-0.5 rounded bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">
                  {activeModalNews.category}
                </span>
                <span>{activeModalNews.location}</span>
                <span>·</span>
                <span>{activeModalNews.publishedDate}</span>
              </div>

              <h2 className="text-lg font-bold text-white">{activeModalNews.title}</h2>

              <p className="text-xs text-slate-300 leading-relaxed font-medium">
                {activeModalNews.description}
              </p>

              <div className="p-4 bg-slate-950 rounded-xl border border-slate-800 text-xs text-slate-300 leading-relaxed space-y-2">
                <div className="font-bold text-white uppercase text-[11px] tracking-wider">
                  Full Dispatch Report:
                </div>
                <p>{activeModalNews.content}</p>
              </div>

              <div className="flex items-center justify-between text-xs text-slate-400 font-mono pt-2">
                <span>Verified by: {activeModalNews.source}</span>
                <span className="text-emerald-400 font-semibold">Educational Advisory Active</span>
              </div>
            </div>

            <div className="p-4 bg-slate-950 border-t border-slate-800 flex justify-end">
              <button
                onClick={() => setActiveModalNews(null)}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-xs font-semibold"
              >
                Close Story
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
