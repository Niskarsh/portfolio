export default function Wallpaper() {
    return (
      <div className="absolute inset-0 -z-10">
        {/* Soft hero vibes like your reference; orange aura rhs, purple glow bottom-left */}
        <div className="h-full w-full" style={{ background:
          'radial-gradient(60% 80% at 85% 50%, rgba(233,84,32,0.25) 0%, rgba(233,84,32,0.08) 35%, rgba(233,84,32,0) 60%), radial-gradient(40% 60% at 20% 80%, rgba(153,77,255,0.25), rgba(0,0,0,0) 60%), var(--bg)'}} />
        <div className="absolute inset-0 grid grid-cols-2 items-center p-10">
          <div>
            <h1 className="text-6xl leading-tight drop-shadow-xl">Hi, I’m Niskarsh.</h1>
            <p className="mt-4 max-w-xl text-lg text-[var(--subtle)]">Product-minded full-stack dev. I build practical systems that ship.</p>
          </div>
          <div className="flex justify-end">
            {/* place your photo in /public/me.jpg */}
            <img src="/me.jpg" alt="Niskarsh" className="h-64 w-64 rounded-full ring-4 ring-[var(--panel-2)] object-cover shadow-yaru" />
          </div>
        </div>
      </div>
    )
  }
  