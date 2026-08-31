import { Button } from "@repo/ui/components/button";
import { cn } from "@repo/ui/lib/utils";
import {
  MinusIcon,
  Music2Icon,
  PauseIcon,
  PlayIcon,
  SkipBackIcon,
  SkipForwardIcon,
} from "lucide-react";
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  useSyncExternalStore,
  type ChangeEvent,
} from "react";

/**
 * Southern Machinery brand anthems, played back to back on a loop.
 *
 * Both files live on the company file host. They are served with
 * `accept-ranges: bytes`, so seeking works without downloading the whole track.
 */
const ANTHEM_TRACKS = [
  {
    title: "Powering the Future",
    subtitle: "The Southern Machinery Anthem",
    src: "https://file.autoinsertion.com/public/SMT%20Audio/Powering%20the%20Future%20(The%20Southern%20Machinery%20Anthem)%20(2).mp3",
  },
  {
    title: "Powering the EMS Future",
    subtitle: "The Southern Machinery Anthem",
    src: "https://file.autoinsertion.com/public/SMT%20Audio/Powering%20the%20EMS%20Future%20(The%20Southern%20Machinery%20Anthem).mp3",
  },
] as const;

const MUTED_STORAGE_KEY = "smthelp-anthem:muted";
const COLLAPSED_STORAGE_KEY = "smthelp-anthem:collapsed";

// Restart the current track instead of skipping back if we are this far in.
const RESTART_THRESHOLD_SECONDS = 3;

function readStoredFlag(key: string): boolean {
  try {
    return window.localStorage.getItem(key) === "1";
  } catch {
    return false;
  }
}

function writeStoredFlag(key: string, value: boolean): void {
  try {
    window.localStorage.setItem(key, value ? "1" : "0");
  } catch {
    /* storage unavailable (private mode) — the player still works, just forgets */
  }
}

/**
 * The collapsed state is persisted so the panel stays tucked away across visits.
 * `useSyncExternalStore` is the React-sanctioned way to read an external
 * source like localStorage: it is SSR-safe (the server snapshot is simply
 * "expanded") and it stays in sync if the visitor changes it in another tab.
 */
const collapsedStore = {
  subscribe: (onChange: () => void) => {
    window.addEventListener("storage", onChange);
    return () => window.removeEventListener("storage", onChange);
  },
  getSnapshot: () => readStoredFlag(COLLAPSED_STORAGE_KEY),
  getServerSnapshot: () => false,
  set: (value: boolean) => {
    writeStoredFlag(COLLAPSED_STORAGE_KEY, value);
    // The storage event only fires in *other* tabs, so nudge this one too.
    window.dispatchEvent(new StorageEvent("storage", { key: COLLAPSED_STORAGE_KEY }));
  },
};

function formatTime(seconds: number): string {
  if (!Number.isFinite(seconds) || seconds < 0) {
    return "0:00";
  }
  const total = Math.floor(seconds);
  const minutes = Math.floor(total / 60);
  const remaining = total % 60;
  return `${minutes}:${remaining < 10 ? "0" : ""}${remaining}`;
}

/**
 * Fixed lower-left anthem player.
 *
 * Autoplay reality check: every current browser blocks audible playback until
 * the visitor has interacted with the page. We still try immediately; if the
 * promise rejects we surface a hint and start on the visitor's first gesture.
 * A deliberate pause is remembered so the next visit does not ambush them.
 */
export function AnthemPlayer() {
  const audioRef = useRef<HTMLAudioElement>(null);
  const wantPlayRef = useRef(true);

  const [trackIndex, setTrackIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isBlocked, setIsBlocked] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);

  const isCollapsed = useSyncExternalStore(
    collapsedStore.subscribe,
    collapsedStore.getSnapshot,
    collapsedStore.getServerSnapshot,
  );

  const track = ANTHEM_TRACKS[trackIndex];

  const startPlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    wantPlayRef.current = true;
    void audio
      .play()
      .then(() => {
        setIsBlocked(false);
        writeStoredFlag(MUTED_STORAGE_KEY, false);
      })
      .catch(() => {
        // Autoplay policy (NotAllowedError) or a media error. Wait for a
        // genuine gesture rather than retrying in a loop.
        setIsBlocked(true);
      });
  }, []);

  const pausePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    wantPlayRef.current = false;
    audio.pause();
    writeStoredFlag(MUTED_STORAGE_KEY, true);
    setIsBlocked(false);
  }, []);

  const togglePlayback = useCallback(() => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    if (audio.paused) {
      startPlayback();
    } else {
      pausePlayback();
    }
  }, [pausePlayback, startPlayback]);

  const goToTrack = useCallback((nextIndex: number) => {
    setCurrentTime(0);
    setDuration(0);
    setTrackIndex((nextIndex + ANTHEM_TRACKS.length) % ANTHEM_TRACKS.length);
  }, []);

  const handleNext = useCallback(() => {
    goToTrack(trackIndex + 1);
  }, [goToTrack, trackIndex]);

  const handlePrevious = useCallback(() => {
    const audio = audioRef.current;
    if (audio && audio.currentTime > RESTART_THRESHOLD_SECONDS) {
      audio.currentTime = 0;
      setCurrentTime(0);
      return;
    }
    goToTrack(trackIndex - 1);
  }, [goToTrack, trackIndex]);

  // Honour a previous deliberate pause: stay silent instead of ambushing the
  // visitor on the next visit. From here on, the audio element's own events
  // drive playback state — no state is set synchronously in this effect.
  useEffect(() => {
    wantPlayRef.current = !readStoredFlag(MUTED_STORAGE_KEY);
  }, []);

  // Keep playing across track changes (including the initial load).
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio || !wantPlayRef.current) {
      return;
    }
    void audio.play().catch(() => setIsBlocked(true));
  }, [trackIndex]);

  // Autoplay fallback: begin on the first real interaction anywhere on the page.
  useEffect(() => {
    if (!isBlocked) {
      return;
    }
    const gestureEvents = ["pointerdown", "keydown", "touchstart"] as const;
    const handleFirstGesture = () => {
      if (wantPlayRef.current) {
        startPlayback();
      }
    };
    for (const eventName of gestureEvents) {
      document.addEventListener(eventName, handleFirstGesture, { once: true, capture: true });
    }
    return () => {
      for (const eventName of gestureEvents) {
        document.removeEventListener(eventName, handleFirstGesture, true);
      }
    };
  }, [isBlocked, startPlayback]);

  // A native range input gives us pointer, touch and keyboard seeking for free.
  const handleSeek = (event: ChangeEvent<HTMLInputElement>) => {
    const audio = audioRef.current;
    if (!audio) {
      return;
    }
    const nextTime = Number(event.currentTarget.value);
    audio.currentTime = nextTime;
    setCurrentTime(nextTime);
  };

  return (
    <div
      className={cn(
        "fixed bottom-3 left-3 z-50 sm:bottom-4 sm:left-4",
        isCollapsed && "size-12 sm:size-14",
      )}
    >
      {isCollapsed ? (
        <Button
          type="button"
          onClick={() => collapsedStore.set(false)}
          aria-label="Open the Southern Machinery anthem player"
          className={cn(
            "size-12 rounded-full shadow-lg sm:size-14",
            isBlocked && "ring-2 ring-primary/40",
          )}
        >
          <Music2Icon className="size-5 sm:size-6" />
        </Button>
      ) : (
        <div className="w-[300px] max-w-[calc(100vw-1.5rem)] overflow-hidden rounded-xl border border-border bg-background/95 shadow-lg backdrop-blur supports-[backdrop-filter]:bg-background/80">
          <div className="flex items-start gap-3 p-3">
            <div className="grid size-10 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Music2Icon className={cn("size-5", isPlaying && "animate-pulse")} />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
                Now Playing
              </p>
              <p className="truncate text-sm font-semibold text-foreground">{track.title}</p>
              <p className="truncate text-xs text-muted-foreground">{track.subtitle}</p>
            </div>
            <Button
              type="button"
              variant="ghost"
              size="icon-sm"
              onClick={() => collapsedStore.set(true)}
              aria-label="Minimize the anthem player"
            >
              <MinusIcon className="size-4" />
            </Button>
          </div>

          <div className="mx-3 mb-2">
            <input
              type="range"
              min={0}
              max={duration || 0}
              step={0.5}
              value={Math.min(currentTime, duration || 0)}
              onChange={handleSeek}
              disabled={!duration}
              aria-label="Seek"
              className="h-1 w-full cursor-pointer accent-primary disabled:cursor-default disabled:opacity-60"
            />
          </div>

          <div className="flex items-center gap-1 px-3 pb-3">
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handlePrevious}
              aria-label="Previous track"
              className="size-11 sm:size-9"
            >
              <SkipBackIcon className="size-4" />
            </Button>
            <Button
              type="button"
              onClick={togglePlayback}
              aria-label={isPlaying ? "Pause" : "Play"}
              className="size-12 rounded-full sm:size-11"
            >
              {isPlaying ? (
                <PauseIcon className="size-5" />
              ) : (
                <PlayIcon className="size-5 translate-x-px" />
              )}
            </Button>
            <Button
              type="button"
              variant="ghost"
              size="icon"
              onClick={handleNext}
              aria-label="Next track"
              className="size-11 sm:size-9"
            >
              <SkipForwardIcon className="size-4" />
            </Button>
            <span className="ml-auto text-xs tabular-nums text-muted-foreground">
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
          </div>

          {isBlocked ? (
            <p className="mx-3 mb-3 rounded-md bg-muted px-2.5 py-2 text-xs leading-snug text-muted-foreground">
              Your browser blocked autoplay. Click anywhere on the page to start the anthem.
            </p>
          ) : null}
        </div>
      )}

      {/* Instrumental brand anthem: there is no speech to caption. */}
      <audio
        // eslint-disable-next-line jsx-a11y/media-has-caption
        ref={audioRef}
        src={track.src}
        preload="metadata"
        onEnded={handleNext}
        onPlay={() => {
          setIsPlaying(true);
          setIsBlocked(false);
        }}
        onPause={() => setIsPlaying(false)}
        onTimeUpdate={(event) => setCurrentTime(event.currentTarget.currentTime)}
        onLoadedMetadata={(event) => setDuration(event.currentTarget.duration)}
        onError={() => {
          // Skip a track that fails to load instead of dead-ending the rotation.
          if (ANTHEM_TRACKS.length > 1) {
            setIsBlocked(true);
            goToTrack(trackIndex + 1);
          }
        }}
      />
    </div>
  );
}
