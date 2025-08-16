'use client'
import { Rnd } from 'react-rnd'
import { PropsWithChildren } from 'react'

export default function Window(props: PropsWithChildren<{
  title: string
  z: number
  onFocus: () => void
  onClose?: () => void
  default?: { x: number, y: number, w: number, h: number }
  icon?: React.ReactNode
}>) {
  const { title, children, onClose, onFocus, z, icon } = props
  const def = props.default ?? { x: 180, y: 140, w: 720, h: 480 }
  return (
    <Rnd default={{ x: def.x, y: def.y, width: def.w, height: def.h }}
         bounds="window" dragHandleClassName="win-drag" className="yaru-window overflow-hidden"
         style={{ zIndex: z, position: 'fixed' }} onMouseDown={onFocus}>
      <div className="window-header win-drag cursor-move">
        <div className="window-controls"><span className="btn-circle btn-close" onClick={onClose} /><span className="btn-circle btn-min" /><span className="btn-circle btn-max" /></div>
        <div className="window-title">{icon}<span>{title}</span></div><div className="w-16" />
      </div>
      <div className="p-4 h-[calc(100%-44px)] overflow-auto">{children}</div>
    </Rnd>
  )
}
