import { NextResponse } from 'next/server'
export const revalidate = 86400

export async function GET(req: Request){
  const {searchParams} = new URL(req.url)
  const username = searchParams.get('username') || process.env.GITHUB_USERNAME
  const year = parseInt(searchParams.get('year') || new Date().getFullYear().toString())
  if(!username) return NextResponse.json({error:'missing username'},{status:400})

  const from = new Date(year,0,1).toISOString()
  const to   = new Date(year,11,31,23,59,59).toISOString()
  const token = process.env.GITHUB_TOKEN
  if(!token) return NextResponse.json([])

  const query = `
  query($login:String!,$from:DateTime!,$to:DateTime!){
    user(login:$login){
      contributionsCollection(from:$from,to:$to){
        contributionCalendar{
          weeks{ contributionDays{ date contributionCount } }
        }
      }
    }
  }`

  const resp = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${token}`, 'Content-Type':'application/json' },
    body: JSON.stringify({ query, variables: { login: username, from, to } })
  })

  if(!resp.ok) return NextResponse.json({error:'github_error'},{status:resp.status})

  const json = await resp.json()
  const weeks = json?.data?.user?.contributionsCollection?.contributionCalendar?.weeks ?? []
  const days = weeks.flatMap((w:any)=>w.contributionDays).map((d:any)=>({date:d.date,count:d.contributionCount}))
  return NextResponse.json(days, { headers: {'Cache-Control':'s-maxage=86400, stale-while-revalidate=3600'} })
}
