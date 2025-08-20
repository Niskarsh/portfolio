'use client'
import Image from 'next/image'

export default function Wallpaper() {
  return (
    <div className="fixed inset-0 z-1">
      {/* Full-bleed image */}
      <div className="absolute inset-0">
        <Image
          src="/me.jpg"          // make sure this exists under /public
          alt="Background"
          fill                           // expands to parent size
          priority
          sizes="100vw"
          className="object-cover"
        />
      </div>

      {/* Optional dark overlay for readability */}
      <div className="absolute inset-0 bg-[linear-gradient(to_bottom,rgba(0,0,0,.2),rgba(0,0,0,.55))]" />
    </div>
  )
}
