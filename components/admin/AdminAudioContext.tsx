"use client";

import React, {
  createContext,
  useContext,
  useState,
  useRef,
  useEffect,
  useCallback,
} from "react";

export interface Track {
  id: number;
  title: string;
  artist: string;
  src: string;
}

export const ADMIN_PLAYLIST: Track[] = [
  {
    id: 1,
    title: "KIRIS Ambient Wave",
    artist: "Synth Focus 01",
    src: "/audio/track1.aac",
  },
  {
    id: 2,
    title: "KIRIS Cyber Pulse",
    artist: "Cyber Flow 02",
    src: "/audio/track2.mp3",
  },
];

interface AudioContextValue {
  currentTrack: Track;
  currentTrackIndex: number;
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  currentTime: number;
  duration: number;
  togglePlay: () => void;
  handleNext: () => void;
  handlePrev: () => void;
  toggleMute: () => void;
  setVolume: (v: number) => void;
  seek: (t: number) => void;
  analyser: AnalyserNode | null;
  getFrequencyData: () => Uint8Array;
  getBassEnergy: () => number;
}

const AdminAudioCtx = createContext<AudioContextValue | null>(null);

export function AdminAudioProvider({ children }: { children: React.ReactNode }) {
  const [currentTrackIndex, setCurrentTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(0.7);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const audioRef = useRef<HTMLAudioElement | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const sourceConnectedRef = useRef(false);
  const dataArrayRef = useRef<Uint8Array | null>(null);

  const currentTrack = ADMIN_PLAYLIST[currentTrackIndex];

  // Inicializar Web Audio API bajo demanda con interacción de usuario
  const setupWebAudio = useCallback(() => {
    if (typeof window === "undefined" || !audioRef.current) return;

    if (!audioContextRef.current) {
      const AudioCtxClass =
        window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtxClass) {
        try {
          const ctx = new AudioCtxClass();
          const analyser = ctx.createAnalyser();
          analyser.fftSize = 128; // 64 frequency bins
          analyser.smoothingTimeConstant = 0.82;

          if (!sourceConnectedRef.current && audioRef.current) {
            const source = ctx.createMediaElementSource(audioRef.current);
            source.connect(analyser);
            analyser.connect(ctx.destination);
            sourceConnectedRef.current = true;
          }

          analyserRef.current = analyser;
          audioContextRef.current = ctx;
          dataArrayRef.current = new Uint8Array(analyser.frequencyBinCount);
        } catch (err) {
          console.warn("[KIRIS Audio] Error inicializando AnalyserNode:", err);
        }
      }
    }

    if (audioContextRef.current && audioContextRef.current.state === "suspended") {
      audioContextRef.current.resume().catch(() => {});
    }
  }, []);

  // Configurar listeners del elemento audio
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.volume = isMuted ? 0 : volume;

    const handleTimeUpdate = () => {
      setCurrentTime(audio.currentTime);
    };

    const handleLoadedMetadata = () => {
      setDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setCurrentTrackIndex((prev) => (prev + 1) % ADMIN_PLAYLIST.length);
    };

    audio.addEventListener("timeupdate", handleTimeUpdate);
    audio.addEventListener("loadedmetadata", handleLoadedMetadata);
    audio.addEventListener("ended", handleEnded);

    return () => {
      audio.removeEventListener("timeupdate", handleTimeUpdate);
      audio.removeEventListener("loadedmetadata", handleLoadedMetadata);
      audio.removeEventListener("ended", handleEnded);
    };
  }, [isMuted, volume]);

  // Cambio de pista
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    audio.src = currentTrack.src;
    audio.load();
    if (isPlaying) {
      setupWebAudio();
      audio.play().catch(() => setIsPlaying(false));
    }
  }, [currentTrackIndex, currentTrack.src, setupWebAudio, isPlaying]);

  const togglePlay = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;

    setupWebAudio();

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => setIsPlaying(false));
    }
  }, [isPlaying, setupWebAudio]);

  const handlePrev = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev === 0 ? ADMIN_PLAYLIST.length - 1 : prev - 1));
  }, []);

  const handleNext = useCallback(() => {
    setCurrentTrackIndex((prev) => (prev + 1) % ADMIN_PLAYLIST.length);
  }, []);

  const toggleMute = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) return;
    if (isMuted) {
      audio.volume = volume;
      setIsMuted(false);
    } else {
      audio.volume = 0;
      setIsMuted(true);
    }
  }, [isMuted, volume]);

  const setVolume = useCallback((v: number) => {
    const val = Math.max(0, Math.min(1, v));
    setVolumeState(val);
    if (audioRef.current) {
      audioRef.current.volume = val;
    }
    if (val > 0 && isMuted) {
      setIsMuted(false);
    }
  }, [isMuted]);

  const seek = useCallback((time: number) => {
    if (audioRef.current) {
      audioRef.current.currentTime = time;
      setCurrentTime(time);
    }
  }, []);

  // Obtener array de frecuencias en tiempo real con fallback sintético suave
  const getFrequencyData = useCallback((): Uint8Array => {
    const analyser = analyserRef.current;
    if (analyser && dataArrayRef.current && isPlaying) {
      analyser.getByteFrequencyData(dataArrayRef.current as any);
      return dataArrayRef.current;
    }

    // Fallback: Generador determinista armónico si Web Audio no está conectado
    const size = 64;
    const fallback = new Uint8Array(size);
    if (!isPlaying) return fallback;

    const t = currentTime * 6;
    for (let i = 0; i < size; i++) {
      const freq = Math.sin(t + i * 0.25) * 0.5 + 0.5;
      const decay = Math.exp(-i / 20);
      fallback[i] = Math.floor(freq * decay * 200);
    }
    return fallback;
  }, [isPlaying, currentTime]);

  // Energía de graves (bass) para sincronizar pulsaciones e iluminación
  const getBassEnergy = useCallback((): number => {
    const freq = getFrequencyData();
    if (!isPlaying || freq.length === 0) return 0;
    // Promedio de los primeros 6 bins (sub-graves y graves)
    let sum = 0;
    const count = Math.min(6, freq.length);
    for (let i = 0; i < count; i++) {
      sum += freq[i];
    }
    return (sum / (count * 255));
  }, [getFrequencyData, isPlaying]);

  return (
    <AdminAudioCtx.Provider
      value={{
        currentTrack,
        currentTrackIndex,
        isPlaying,
        isMuted,
        volume,
        currentTime,
        duration,
        togglePlay,
        handleNext,
        handlePrev,
        toggleMute,
        setVolume,
        seek,
        analyser: analyserRef.current,
        getFrequencyData,
        getBassEnergy,
      }}
    >
      <audio ref={audioRef} preload="metadata" crossOrigin="anonymous" />
      {children}
    </AdminAudioCtx.Provider>
  );
}

export function useAdminAudio() {
  const ctx = useContext(AdminAudioCtx);
  if (!ctx) {
    throw new Error("useAdminAudio debe usarse dentro de AdminAudioProvider");
  }
  return ctx;
}
