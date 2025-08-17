export default function Wallpaper() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* Background with subtle hues */}
      <div className="h-full w-full" style={{ background:
        'radial-gradient(60% 80% at 85% 50%, rgba(233,84,32,0.18) 0%, rgba(233,84,32,0.06) 35%, rgba(233,84,32,0) 60%), radial-gradient(40% 60% at 20% 80%, rgba(153,77,255,0.18), rgba(0,0,0,0) 60%), var(--bg)'}} />
      {/* Hero content */}
      <div className="absolute inset-0 grid grid-cols-2 items-center px-10 pt-16">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl leading-tight drop-shadow-xl">Hi, I’m Niskarsh.</h1>
          <p className="mt-4 text-lg text-[var(--subtle)]">Product-minded full-stack dev. I build practical systems that ship.</p>
        </div>
        <div className="hidden md:flex justify-end pr-6">
          <img src="/me.jpg" alt="Niskarsh" className="h-64 w-64 rounded-full ring-4 ring-[var(--panel-2)] object-cover shadow-yaru" />
        </div>
      </div>
    </div>
  )
}
