export default function Wallpaper() {
  return (
    <div className="absolute inset-0 -z-10">
      {/* right-side photo as background */}
      <div
        className="h-full w-full"
        style={{
          background: `
            linear-gradient(90deg, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.85) 35%, rgba(13,17,23,0.40) 60%, rgba(13,17,23,0.10) 72%, rgba(13,17,23,0) 80%),
            radial-gradient(60% 80% at 85% 50%, rgba(233,84,32,0.18) 0%, rgba(233,84,32,0.06) 36%, rgba(233,84,32,0) 60%),
            var(--bg)`,
          backgroundImage: `linear-gradient(90deg, rgba(13,17,23,0.95) 0%, rgba(13,17,23,0.85) 35%, rgba(13,17,23,0.40) 60%, rgba(13,17,23,0.10) 72%, rgba(13,17,23,0) 80%), url('/me.jpg')`,
          backgroundSize: 'cover',
          backgroundPosition: 'right center',
          backgroundRepeat: 'no-repeat'
        }}
      />
      {/* left text block */}
      <div className="absolute inset-y-0 left-0 right-[40%] flex items-center px-10 pt-16">
        <div className="max-w-xl">
          <h1 className="text-5xl md:text-6xl leading-tight drop-shadow-xl">Hi, I’m Niskarsh.</h1>
          <p className="mt-4 text-lg text-[var(--subtle)]">Product-minded full-stack dev. I build practical systems that ship.</p>
        </div>
      </div>
    </div>
  )
}
