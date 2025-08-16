export default function Wallpaper() {
  return (
    <div className="absolute inset-0 -z-10">
      <div className="h-full w-full" style={{background:
        'radial-gradient(50% 70% at 85% 40%, var(--ubuntu-orange) 0%, rgba(233,84,32,0.16) 35%, rgba(233,84,32,0) 60%), radial-gradient(40% 60% at 20% 80%, rgba(119,33,111,0.7), rgba(44,0,30,0) 60%), var(--ubuntu-aubergine)'}} />
      <div className="absolute inset-0 grid grid-cols-2 items-center p-10">
        <div>
          <h1 className="text-6xl leading-tight drop-shadow-xl">Hi, I’m Niskarsh.</h1>
          <p className="mt-4 max-w-xl text-lg text-[#F6EDEB]">Product‑minded full‑stack dev. I build practical systems that ship.</p>
        </div>
        <div className="flex justify-end"><img src="/me.jpg" alt="Niskarsh" className="h-64 w-64 rounded-full ring-4 ring-ubuntu-aubergineMid object-cover shadow-yaru" /></div>
      </div>
    </div>
  )
}
