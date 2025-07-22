type SlidingDrawerProps = {
  open: boolean;
  setOpen: (open: boolean) => void;
  track: any;
};

export default function SlidingDrawer({
  open,
  setOpen,
  track,
}: SlidingDrawerProps) {
  return (
    <>
      <div
        className={`fixed top-0 right-0 h-full bg-[#000000c9] text-white transition-transform duration-300 flex flex-col w-[600px]`}
        style={{
          transform: open ? "translateX(0px)" : `translateX(950px)`,
        }}
      >
        <button
          className="absolute top-2 left-4 text-white text-5xl"
          onClick={() => setOpen(false)}
        >
          &times;
        </button>

        <div className="p-4">
          {track ? (
            <div className="mt-20">
              <h2 className="text-2xl font-bold">{track.name}</h2>
              <p>Region: {track.region?.[0]}</p>
              <p>ID: {track.assetId}</p>
              <p>X: {track.x}</p>
              <p>Y: {track.y}</p>
            </div>
          ) : (
            <p>No track selected.</p>
          )}
        </div>
      </div>

      {open && <div className="fixed inset-0" onClick={() => setOpen(false)} />}
    </>
  );
}
