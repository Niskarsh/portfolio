'use client'
import ActivityCalendar, { Activity } from 'react-activity-calendar'
import { useEffect, useState } from 'react'

type Day={date:string,count:number}

export default function Heatmap({username}:{username:string}){
  const [data,setData]=useState<Activity[]|null>(null)
  const [year,setYear]=useState<number>(new Date().getFullYear())

  useEffect(()=>{
    (async()=>{
      const r=await fetch(`/api/github?username=${encodeURIComponent(username)}&year=${year}`,{cache:'no-store'})
      const days:Day[]=await r.json()
      const mapped:Activity[]=days.map(d=>({
        date:d.date,
        count:d.count,
        level:d.count===0?0:d.count<3?1:d.count<6?2:d.count<10?3:4
      }))
      setData(mapped)
    })()
  },[username,year])

  return (
    <div className="space-y-3">
      <div className="flex items-center gap-3">
        <h3 className="text-lg font-semibold">GitHub Contributions</h3>
        <select className="bg-white/10 rounded-md px-2 py-1 border border-[var(--border)]"
                value={year} onChange={e=>setYear(parseInt(e.target.value))}>
          {Array.from({length:5}).map((_,i)=>{
            const y=new Date().getFullYear()-i; return <option key={y} value={y}>{y}</option>
          })}
        </select>
      </div>
      {data && (
        <ActivityCalendar
          data={data}
          theme={{
            light:['#161b22','#0e4429','#006d32','#26a641','#39d353'],
            dark:['#161b22','#0e4429','#006d32','#26a641','#39d353']
          }}
          labels={{totalCount:'{{count}} contributions in {{year}}'}}
        />
      )}
    </div>
  )
}
