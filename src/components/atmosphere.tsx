export function Atmosphere() {
  return (
    <div className="pointer-events-none fixed inset-0 z-0 overflow-hidden" aria-hidden="true">
      <div className="fog-wash absolute inset-0" />
      <div className="fog-shift absolute inset-y-[-8%] right-[-6%] w-[min(48vw,32rem)]">
        <img
          src="/red-fog.jpg"
          alt=""
          className="size-full object-cover object-right opacity-[0.38] mix-blend-screen"
        />
      </div>
    </div>
  );
}
