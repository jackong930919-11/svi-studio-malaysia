import React, { useState } from 'react';
import {
  Film,
  Play,
  Star,
  Sparkles,
  Eye,
  Tv,
  CheckCircle2,
  X,
  MessageCircle,
  Flame,
  Volume2,
  Layers,
  Pause,
  PlayCircle,
  SlidersHorizontal,
} from 'lucide-react';
import { MOVIE_POSTERS, MoviePoster } from '../data/moviePosterData';
import { Language } from '../types';
import { UI_COPY } from '../data/uiTranslations';

interface MoviePosterWallProps {
  currentLang: Language;
  onSelectBox?: (boxId?: string) => void;
}

export const MoviePosterWall: React.FC<MoviePosterWallProps> = ({ currentLang, onSelectBox }) => {
  const [selectedFilter, setSelectedFilter] = useState<'all' | 'movie' | 'drama' | 'anime' | 'sports'>('all');
  const [activePoster, setActivePoster] = useState<MoviePoster | null>(null);
  const [isPaused, setIsPaused] = useState<boolean>(false);
  const copy = UI_COPY[currentLang].movieWall;

  // Filter items
  const filteredPosters = selectedFilter === 'all'
    ? MOVIE_POSTERS
    : MOVIE_POSTERS.filter((item) => item.category === selectedFilter);

  // Split into Row 1 and Row 2 for dynamic bi-directional cinematic movement
  const row1Posters = filteredPosters.filter((_, idx) => idx % 2 === 0);
  const row2Posters = filteredPosters.filter((_, idx) => idx % 2 === 1);

  // Double arrays for infinite seamless loop
  const loopRow1 = [...row1Posters, ...row1Posters, ...row1Posters];
  const loopRow2 = [...row2Posters, ...row2Posters, ...row2Posters];

  const handleOpenWhatsApp = (movieTitle: string) => {
    const text = encodeURIComponent(
      copy.orderMessage.replace('{title}', movieTitle)
    );
    window.open(`https://wa.me/60186663311?text=${text}`, '_blank');
  };

  return (
    <div className="relative w-full overflow-hidden mt-6 sm:mt-10 pt-4 sm:pt-6 pb-6 sm:pb-10 border-t border-b border-cyan-900/40 bg-gradient-to-b from-slate-950/40 via-slate-900/60 to-slate-950/80">
      {/* Background Cinematic Atmosphere */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-3/4 h-64 bg-cyan-500/5 blur-3xl pointer-events-none rounded-full" />

      {/* Header Bar */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mb-4 sm:mb-6">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-3">
          <div>
            <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-cyan-950/90 border border-cyan-800 text-cyan-300 text-[10px] sm:text-xs font-semibold mb-1.5 shadow-sm">
              <Film className="w-3 h-3 text-cyan-400 animate-pulse" />
              <span>{copy.eyebrow}</span>
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping ml-1" />
            </div>
            <h2 className="text-lg sm:text-2xl lg:text-3xl font-extrabold text-white tracking-tight flex items-center gap-2">
              <span>{copy.title}</span>
              <span className="hidden sm:inline-block text-xs font-bold px-2 py-0.5 rounded bg-gradient-to-r from-amber-500 to-orange-500 text-slate-950">
                {copy.lifetime}
              </span>
            </h2>
            <p className="text-[11px] sm:text-xs text-slate-300 mt-1 max-w-2xl leading-relaxed">
              {copy.description}
            </p>
          </div>

          {/* Controls: Category Filter + Play/Pause */}
          <div className="flex items-center flex-wrap gap-1.5 sm:gap-2">
            <div className="flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-800 text-[10px] sm:text-xs">
              <button
                onClick={() => setSelectedFilter('all')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedFilter === 'all'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {copy.all}
              </button>
              <button
                onClick={() => setSelectedFilter('movie')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedFilter === 'movie'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {copy.movies}
              </button>
              <button
                onClick={() => setSelectedFilter('drama')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedFilter === 'drama'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {copy.dramas}
              </button>
              <button
                onClick={() => setSelectedFilter('anime')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedFilter === 'anime'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {copy.anime}
              </button>
              <button
                onClick={() => setSelectedFilter('sports')}
                className={`px-2 sm:px-2.5 py-1 rounded-lg font-medium transition-all ${
                  selectedFilter === 'sports'
                    ? 'bg-cyan-500 text-slate-950 font-bold shadow'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {copy.sports}
              </button>
            </div>

            {/* Pause / Resume Button */}
            <button
              onClick={() => setIsPaused(!isPaused)}
              title={isPaused ? copy.resumeTitle : copy.pauseTitle}
              className="p-1.5 sm:p-2 rounded-xl bg-slate-900/90 border border-slate-800 text-slate-300 hover:text-cyan-400 transition-colors flex items-center gap-1 text-[10px] sm:text-xs"
            >
              {isPaused ? (
                <>
                  <PlayCircle className="w-3.5 h-3.5 text-emerald-400" />
                  <span className="hidden sm:inline">{copy.resume}</span>
                </>
              ) : (
                <>
                  <Pause className="w-3.5 h-3.5 text-amber-400" />
                  <span className="hidden sm:inline">{copy.pause}</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* The Moving Wall Marquee Container */}
      <div className="relative w-full overflow-hidden group">
        {/* Left & Right Soft Fade Masks for Cinematic Infinite Loop */}
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-8 sm:w-24 lg:w-36 bg-gradient-to-r from-slate-950 via-slate-950/90 to-transparent z-20" />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-8 sm:w-24 lg:w-36 bg-gradient-to-l from-slate-950 via-slate-950/90 to-transparent z-20" />

        {/* Row 1: Leftward Moving Stream */}
        <div className="flex gap-2.5 sm:gap-4 py-1.5 sm:py-2">
          <div
            className={`flex gap-2.5 sm:gap-4 animate-movie-marquee-left shrink-0 ${
              isPaused ? 'marquee-paused' : ''
            }`}
          >
            {loopRow1.map((movie, index) => (
              <PosterCard
                key={`r1-${movie.id}-${index}`}
                movie={movie}
                currentLang={currentLang}
                onSelect={() => setActivePoster(movie)}
              />
            ))}
          </div>
        </div>

        {/* Row 2: Rightward Moving Stream */}
        <div className="flex gap-2.5 sm:gap-4 py-1.5 sm:py-2">
          <div
            className={`flex gap-2.5 sm:gap-4 animate-movie-marquee-right shrink-0 ${
              isPaused ? 'marquee-paused' : ''
            }`}
          >
            {loopRow2.map((movie, index) => (
              <PosterCard
                key={`r2-${movie.id}-${index}`}
                movie={movie}
                currentLang={currentLang}
                onSelect={() => setActivePoster(movie)}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Bottom Information Hint */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 mt-3 sm:mt-4 flex flex-wrap items-center justify-between text-[10px] sm:text-xs text-slate-400 gap-2">
        <div className="flex items-center gap-2">
          <span className="inline-block w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
          <span>{copy.hint}</span>
        </div>
        <div className="flex items-center gap-3 text-slate-300">
          <span className="flex items-center gap-1 text-emerald-400">
            <CheckCircle2 className="w-3 h-3" /> {copy.originalQuality}
          </span>
          <span className="flex items-center gap-1 text-cyan-400">
            <CheckCircle2 className="w-3 h-3" /> {copy.dolby}
          </span>
          <span className="flex items-center gap-1 text-amber-400">
            <CheckCircle2 className="w-3 h-3" /> {copy.adFree}
          </span>
        </div>
      </div>

      {/* Interactive Movie Details Lightbox Modal */}
      {activePoster && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in duration-200"
          onClick={() => setActivePoster(null)}
        >
          <div
            className="relative w-full max-w-xl bg-slate-900 border border-cyan-800/80 rounded-2xl p-4 sm:p-6 shadow-2xl shadow-cyan-950/80 overflow-hidden text-left"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button at top-right */}
            <button
              onClick={() => setActivePoster(null)}
              className="absolute top-3 right-3 p-1.5 rounded-full bg-slate-800 text-slate-400 hover:text-white hover:bg-slate-700 transition-colors z-20"
              title={copy.close}
            >
              <X className="w-4 h-4" />
            </button>

            <div className="grid grid-cols-1 sm:grid-cols-12 gap-4 items-center">
              {/* Poster Column - Strictly Centered, uncompressed */}
              <div className="sm:col-span-5 flex justify-center">
                <div className="relative w-40 sm:w-full aspect-[2/3] rounded-xl overflow-hidden bg-slate-950 border border-slate-700 shadow-xl flex items-center justify-center">
                  <img
                    src={activePoster.posterUrl}
                    alt={displayTitle(activePoster, currentLang)}
                    className="w-full h-full object-cover object-center"
                    loading="lazy"
                  />
                  <div className="absolute top-2 left-2 px-2 py-0.5 rounded bg-black/75 text-cyan-400 text-[10px] font-bold border border-cyan-800/80">
                    {currentLang === 'zh' ? activePoster.badge : currentLang === 'ms' ? 'Popular' : 'Popular'}
                  </div>
                  <div className="absolute top-2 right-2 px-1.5 py-0.5 rounded bg-amber-500 text-slate-950 text-[10px] font-black flex items-center gap-0.5">
                    <Star className="w-3 h-3 fill-slate-950 text-slate-950" />
                    {activePoster.rating}
                  </div>
                </div>
              </div>

              {/* Details Column */}
              <div className="sm:col-span-7 space-y-2.5 sm:space-y-3">
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="px-2 py-0.5 rounded text-[10px] font-semibold bg-cyan-950 text-cyan-300 border border-cyan-800">
                      {getCategoryLabel(activePoster, currentLang, copy)}
                    </span>
                    <span className="text-slate-400 text-xs">{activePoster.year}</span>
                  </div>
                  <h3 className="text-lg sm:text-xl font-black text-white leading-tight">
                    {displayTitle(activePoster, currentLang)}
                  </h3>
                  {currentLang === 'zh' && activePoster.originalTitle && (
                    <p className="text-xs text-slate-400">{activePoster.originalTitle}</p>
                  )}
                </div>

                <p className="text-xs text-slate-300 leading-relaxed">
                  {currentLang === 'zh' ? activePoster.description : copy.availabilityNote}
                </p>

                {/* Tags */}
                {currentLang === 'zh' && <div className="flex flex-wrap gap-1">
                  {activePoster.tags.map((tag, i) => (
                    <span
                      key={i}
                      className="text-[10px] px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 border border-slate-700"
                    >
                      {tag}
                    </span>
                  ))}
                </div>}

                {/* Svicloud Hardware Experience Perks */}
                <div className="p-2.5 rounded-xl bg-cyan-950/40 border border-cyan-850 space-y-1.5 text-[11px]">
                  <p className="text-cyan-300 font-bold flex items-center gap-1.5">
                    <Tv className="w-3.5 h-3.5 text-cyan-400" />
                    {copy.playbackTitle}
                  </p>
                  <ul className="grid grid-cols-1 gap-1 text-slate-300">
                    {(currentLang === 'zh' ? activePoster.features : [copy.originalQuality, copy.dolby, copy.adFree]).map((feat, idx) => (
                      <li key={idx} className="flex items-center gap-1.5 text-[10px] sm:text-[11px]">
                        <CheckCircle2 className="w-3 h-3 text-emerald-400 shrink-0" />
                        <span>{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* WhatsApp Action Buttons */}
                <div className="pt-1 flex gap-2">
                  <button
                    onClick={() => handleOpenWhatsApp(displayTitle(activePoster, currentLang))}
                    className="flex-1 py-2 px-3 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-white font-bold text-xs flex items-center justify-center gap-1.5 shadow-lg shadow-emerald-950/50 transition-all"
                  >
                    <MessageCircle className="w-3.5 h-3.5" />
                    <span>{copy.consult}</span>
                  </button>
                  <button
                    onClick={() => setActivePoster(null)}
                    className="py-2 px-3 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-semibold"
                  >
                    {copy.back}
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// Sub-component for an Individual Movie Poster Card in the wall
interface PosterCardProps {
  movie: MoviePoster;
  currentLang: Language;
  onSelect: () => void;
}

const PosterCard: React.FC<PosterCardProps> = ({ movie, currentLang, onSelect }) => {
  const copy = UI_COPY[currentLang].movieWall;
  const title = displayTitle(movie, currentLang);

  return (
    <div
      onClick={onSelect}
      className="group relative w-32 sm:w-40 lg:w-44 shrink-0 rounded-xl overflow-hidden bg-slate-900 border border-slate-800/90 hover:border-cyan-400/90 shadow-md hover:shadow-xl hover:shadow-cyan-950/60 transition-all duration-300 cursor-pointer transform hover:-translate-y-1"
    >
      {/* 2:3 Vertical Movie Poster Ratio with Centered Image */}
      <div className="relative w-full aspect-[2/3] overflow-hidden bg-slate-950 flex items-center justify-center">
        <img
          src={movie.posterUrl}
          alt={title}
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Gradient Shadow Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/30 to-transparent opacity-85 group-hover:opacity-60 transition-opacity" />

        {/* Category Badge Top Left */}
        <div className="absolute top-1.5 left-1.5">
          <span className="px-1.5 py-0.5 rounded text-[9px] font-bold bg-black/70 backdrop-blur-sm text-cyan-300 border border-cyan-800/60">
            {getCategoryLabel(movie, currentLang, copy)}
          </span>
        </div>

        {/* Rating Badge Top Right */}
        <div className="absolute top-1.5 right-1.5">
          <span className="flex items-center gap-0.5 px-1.5 py-0.5 rounded text-[9px] font-black bg-amber-500/90 text-slate-950 backdrop-blur-sm shadow">
            <Star className="w-2.5 h-2.5 fill-slate-950 text-slate-950" />
            {movie.rating}
          </span>
        </div>

        {/* Hover Action Quick Overlay */}
        <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity bg-slate-950/40 backdrop-blur-[2px]">
          <div className="p-2 rounded-full bg-cyan-500 text-slate-950 shadow-lg transform scale-90 group-hover:scale-100 transition-transform">
            <Play className="w-4 h-4 fill-slate-950 translate-x-0.5" />
          </div>
        </div>

        {/* Bottom Title & Specs Info */}
        <div className="absolute bottom-0 left-0 right-0 p-2 text-left">
          <span className="inline-block text-[8px] font-semibold text-emerald-400 mb-0.5 truncate max-w-full">
            {currentLang === 'zh' ? movie.badge : currentLang === 'ms' ? 'Popular' : 'Popular'}
          </span>
          <h4 className="text-[11px] sm:text-xs font-bold text-white truncate drop-shadow">
            {title}
          </h4>
          <p className="text-[9px] text-slate-400 truncate mt-0.5">
            {currentLang === 'zh' ? movie.tags.slice(0, 2).join(' · ') : movie.year}
          </p>
        </div>
      </div>
    </div>
  );
};

const displayTitle = (movie: MoviePoster, currentLang: Language) =>
  currentLang === 'zh' ? movie.title : movie.originalTitle || movie.title;

const getCategoryLabel = (
  movie: MoviePoster,
  currentLang: Language,
  copy: (typeof UI_COPY)[Language]['movieWall']
) => {
  if (currentLang === 'zh') return movie.categoryLabel;

  switch (movie.category) {
    case 'movie':
      return copy.movies;
    case 'drama':
      return copy.dramas;
    case 'anime':
      return copy.anime;
    case 'sports':
      return copy.sports;
  }
};
