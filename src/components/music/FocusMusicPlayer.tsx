import React, { useState, useEffect } from 'react';
import {
  ambientMusic,
  AMBIENT_TRACKS,
  MusicPlayerState
} from '../../services/ambientMusic';
import {
  Headphones,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Radio,
  ChevronDown
} from 'lucide-react';

interface FocusMusicPlayerProps {
  embedded?: boolean;
}

export const FocusMusicPlayer: React.FC<FocusMusicPlayerProps> = ({ embedded = false }) => {
  const [playerState, setPlayerState] = useState<MusicPlayerState>(ambientMusic.getState());
  const [isOpenDropdown, setIsOpenDropdown] = useState(false);

  useEffect(() => {
    const unsubscribe = ambientMusic.subscribe(state => {
      setPlayerState(state);
    });
    return () => unsubscribe();
  }, []);

  const activeTrack =
    AMBIENT_TRACKS.find(t => t.id === playerState.activeTrackId) || AMBIENT_TRACKS[0];

  const handleToggle = () => {
    ambientMusic.toggle();
  };

  const handleSelectTrack = (trackId: string) => {
    ambientMusic.playTrack(trackId);
    setIsOpenDropdown(false);
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    ambientMusic.setVolume(parseFloat(e.target.value));
  };

  // If embedded inside Pomodoro / Study session:
  if (embedded) {
    return (
      <div className="bg-slate-900/90 dark:bg-slate-900/90 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-lg">
        <div className="flex items-center justify-between gap-3 mb-3">
          <div className="flex items-center gap-2.5">
            <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${
              playerState.isPlaying
                ? 'bg-brand-500/20 text-brand-400 ring-2 ring-brand-500/50'
                : 'bg-slate-800 text-slate-400'
            }`}>
              <Headphones className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center gap-2">
                Focus Soundscapes
                {playerState.isPlaying && (
                  <span className="flex items-center gap-0.5 h-3">
                    <span className="w-1 bg-brand-400 h-2 animate-bounce rounded-full" />
                    <span className="w-1 bg-brand-400 h-3 animate-bounce rounded-full [animation-delay:0.15s]" />
                    <span className="w-1 bg-brand-400 h-2 animate-bounce rounded-full [animation-delay:0.3s]" />
                  </span>
                )}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400">
                100% Offline Ambient Sound Generator
              </p>
            </div>
          </div>

          <button
            onClick={handleToggle}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md ${
              playerState.isPlaying
                ? 'bg-rose-500 hover:bg-rose-600 text-white shadow-rose-500/20'
                : 'bg-brand-600 hover:bg-brand-500 text-white shadow-brand-600/20'
            }`}
          >
            {playerState.isPlaying ? (
              <>
                <Pause className="w-3.5 h-3.5" /> Pause Audio
              </>
            ) : (
              <>
                <Play className="w-3.5 h-3.5" /> Play Lo-Fi
              </>
            )}
          </button>
        </div>

        {/* Track selector grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 mt-3">
          {AMBIENT_TRACKS.map(t => {
            const isSelected = t.id === playerState.activeTrackId;
            return (
              <button
                key={t.id}
                onClick={() => handleSelectTrack(t.id)}
                className={`p-2.5 rounded-xl border text-left transition-all flex items-start gap-2 ${
                  isSelected
                    ? 'bg-brand-500/15 border-brand-500/50 text-brand-600 dark:text-brand-300 ring-1 ring-brand-500/30'
                    : 'bg-slate-800/60 dark:bg-slate-950/60 border-slate-700/60 dark:border-slate-800 text-slate-600 dark:text-slate-300 hover:border-slate-600'
                }`}
              >
                <span className="text-lg">{t.icon}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-xs font-bold truncate">{t.name}</div>
                  <div className="text-[10px] text-slate-400 dark:text-slate-500 truncate mt-0.5">
                    {t.description}
                  </div>
                </div>
              </button>
            );
          })}
        </div>

        {/* Volume slider */}
        <div className="flex items-center gap-3 mt-4 pt-3 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={() => ambientMusic.setVolume(playerState.volume > 0 ? 0 : 0.6)}
            className="text-slate-400 hover:text-slate-200"
          >
            {playerState.volume === 0 ? (
              <VolumeX className="w-4 h-4 text-rose-400" />
            ) : (
              <Volume2 className="w-4 h-4 text-brand-400" />
            )}
          </button>
          <input
            type="range"
            min="0"
            max="1"
            step="0.05"
            value={playerState.volume}
            onChange={handleVolumeChange}
            className="w-full h-1.5 bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
          />
          <span className="text-xs font-mono text-slate-400 w-9 text-right">
            {Math.round(playerState.volume * 100)}%
          </span>
        </div>
      </div>
    );
  }

  // Header compact dropdown widget:
  return (
    <div className="relative">
      <div className="flex items-center gap-1.5">
        <button
          onClick={handleToggle}
          title={playerState.isPlaying ? 'Pause Focus Audio' : 'Play Focus Soundscape'}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border transition-all text-xs font-semibold ${
            playerState.isPlaying
              ? 'bg-brand-500/20 border-brand-500/40 text-brand-600 dark:text-brand-300 shadow-sm shadow-brand-500/10'
              : 'bg-slate-100 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          <Headphones className="w-4 h-4" />
          <span className="hidden sm:inline">{activeTrack.name.split(' ')[0]}</span>
          {playerState.isPlaying ? (
            <span className="flex items-center gap-0.5 h-3 ml-0.5">
              <span className="w-0.5 bg-brand-400 h-2 animate-bounce rounded-full" />
              <span className="w-0.5 bg-brand-400 h-3 animate-bounce rounded-full [animation-delay:0.1s]" />
              <span className="w-0.5 bg-brand-400 h-1.5 animate-bounce rounded-full [animation-delay:0.2s]" />
            </span>
          ) : (
            <Play className="w-3 h-3 fill-current ml-0.5 opacity-80" />
          )}
        </button>

        <button
          onClick={() => setIsOpenDropdown(!isOpenDropdown)}
          className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-white bg-slate-100 dark:bg-slate-900"
          title="Choose Focus Soundscape"
        >
          <ChevronDown className="w-3.5 h-3.5" />
        </button>
      </div>

      {isOpenDropdown && (
        <div className="absolute right-0 mt-2 w-72 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl shadow-2xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
          <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-200 dark:border-slate-800">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
              <Radio className="w-3.5 h-3.5 text-brand-500" />
              Focus Soundscapes
            </span>
            <span className="text-[10px] text-brand-600 dark:text-brand-400 font-semibold uppercase">
              100% Offline
            </span>
          </div>

          <div className="space-y-1 max-h-56 overflow-y-auto">
            {AMBIENT_TRACKS.map(t => {
              const isSelected = t.id === playerState.activeTrackId;
              return (
                <button
                  key={t.id}
                  onClick={() => handleSelectTrack(t.id)}
                  className={`w-full p-2 rounded-xl text-left flex items-center gap-2.5 transition-colors ${
                    isSelected
                      ? 'bg-brand-500/15 text-brand-600 dark:text-brand-300 font-semibold'
                      : 'hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-700 dark:text-slate-300'
                  }`}
                >
                  <span className="text-base">{t.icon}</span>
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-bold truncate">{t.name}</div>
                    <div className="text-[10px] text-slate-400 truncate">{t.description}</div>
                  </div>
                  {isSelected && playerState.isPlaying && (
                    <span className="w-2 h-2 rounded-full bg-brand-400 animate-ping" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Volume control */}
          <div className="mt-3 pt-2.5 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2.5">
            <Volume2 className="w-3.5 h-3.5 text-slate-400" />
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={playerState.volume}
              onChange={handleVolumeChange}
              className="w-full h-1 bg-slate-300 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-brand-500"
            />
            <span className="text-[11px] font-mono text-slate-400 w-8 text-right">
              {Math.round(playerState.volume * 100)}%
            </span>
          </div>
        </div>
      )}
    </div>
  );
};
