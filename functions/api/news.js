const FEEDS = [
  { name: 'UK Foreign, Commonwealth & Development Office', url: 'https://www.gov.uk/foreign-travel-advice.atom', defaultCategory: 'Airlines & Important Travel Updates' },
  { name: 'Australian Government Smartraveller', url: 'https://www.smartraveller.gov.au/countries/documents/index.rss', defaultCategory: 'Airlines & Important Travel Updates' },
  { name: 'Lufthansa Group Newsroom', url: 'https://newsroom.lufthansagroup.com/feed/en', defaultCategory: 'Airlines & Important Travel Updates' },
  { name: 'Emirates Media Centre', url: 'https://www.emirates.com/media-centre/feed/en-us', defaultCategory: 'Airlines & Important Travel Updates' },
]

const entityMap = { amp: '&', lt: '<', gt: '>', quot: '"', apos: "'", '#39': "'", nbsp: ' ' }
const decode = (value = '') => value
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/gi, '$1')
  .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
  .replace(/&([a-zA-Z]+|#39);/g, (m, key) => entityMap[key] ?? m)

const cleanText = (value = '') => decode(value)
  .replace(/<script[\s\S]*?<\/script>/gi, ' ')
  .replace(/<style[\s\S]*?<\/style>/gi, ' ')
  .replace(/<[^>]+>/g, ' ')
  .replace(/\s+/g, ' ')
  .trim()

const concise = (value) => {
  const text = cleanText(value)
  if (text.length <= 320) return text
  const clipped = text.slice(0, 317)
  const sentence = clipped.lastIndexOf('. ')
  return `${(sentence > 140 ? clipped.slice(0, sentence + 1) : clipped).trim()}…`
}

const tag = (xml, names) => {
  for (const name of names) {
    const match = xml.match(new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)<\\/${name}>`, 'i'))
    if (match) return match[1]
  }
  return ''
}

const extractLink = (block) => {
  const atom = block.match(/<link\b[^>]*\bhref=["']([^"']+)["'][^>]*>/i)
  return cleanText(atom?.[1] || tag(block, ['link', 'guid']))
}

const categoryFor = (title, summary, fallback) => {
  const text = `${title} ${summary}`.toLowerCase()
  if (/\b(deal|fare sale|discount|promotion|special offer|holiday package|flight offer)\b/.test(text)) return 'Flight Deals & Holiday Packages'
  if (/\b(war|conflict|security|advisory|warning|terror|unrest|airspace|evacuat|do not travel|reconsider|disruption)\b/.test(text)) return 'Airlines & Important Travel Updates'
  if (/\b(booking|baggage|airport guide|entry requirement|visa|passport|insurance|connection|travel tip)\b/.test(text)) return 'Travel Tips & Smart Booking'
  if (/\b(romantic|honeymoon|couples|anniversary)\b/.test(text)) return "Romantic Escapes & Couples' Vacations"
  if (/\b(destination|tourism|visitor|travel advice|city|island|beach|holiday|vacation)\b/.test(text)) return 'Tourism & Trending Destinations'
  return fallback
}

const rejectPattern=/\b(vacanc|job|career|appointed|appointment|chief executive|quarterly results|operating profit|shareholder|annual general meeting|workshop|training course|certification rule|airworthiness directive|technical approval|tender|procurement|employee stor|award ceremony)\b/i
const usefulPattern=/\b(route|destination|service|passenger|airport|travel|holiday|vacation|visa|passport|entry|advisory|security|disruption|baggage|cabin|lounge|fare|deal|offer|tourism|city|island|beach|connection|schedule|flight)\b/i
const relevanceScore=(article)=>{
  const text=`${article.title} ${article.summary}`
  if(rejectPattern.test(text))return -100
  let score=usefulPattern.test(text)?4:0
  if(/\b(passenger|traveler|route|destination|entry|visa|disruption|airport)\b/i.test(text))score+=3
  if(article.publishedAt){const age=(Date.now()-Date.parse(article.publishedAt))/86400000;if(age<=14)score+=3;else if(age<=60)score+=1;else if(age>365)score-=3}
  if(article.summary.length>=80)score+=1
  return score
}

const topicKey=(title)=>cleanText(title).toLowerCase().replace(/[^a-z0-9\s]/g,' ').split(/\s+/).filter(x=>x.length>3&&!['with','from','this','that','travel','airlines','airline','group'].includes(x)).slice(0,5).sort().join('-')

const normalizeDate = (value) => {
  const time = Date.parse(cleanText(value))
  return Number.isFinite(time) ? new Date(time).toISOString() : ''
}

const stableId = (value) => {
  let hash = 2166136261
  for (let i = 0; i < value.length; i++) hash = Math.imul(hash ^ value.charCodeAt(i), 16777619)
  return `feed-${(hash >>> 0).toString(36)}`
}

function parseFeed(xml, feed) {
  const blocks = [...xml.matchAll(/<(item|entry)\b[^>]*>([\s\S]*?)<\/\1>/gi)].map(match => match[2])
  return blocks.slice(0, 30).flatMap(block => {
    const title = cleanText(tag(block, ['title']))
    const sourceUrl = extractLink(block)
    if (!title || !sourceUrl) return []
    let canonical
    try { canonical = new URL(sourceUrl).toString() } catch { return [] }
    const summary = concise(tag(block, ['description', 'summary', 'content:encoded', 'content']))
    return [{
      id: stableId(canonical), title,
      category: categoryFor(title, summary, feed.defaultCategory),
      summary: summary || 'No source summary was supplied. Open the source for details.',
      source: feed.name, sourceUrl: canonical,
      publishedAt: normalizeDate(tag(block, ['pubDate', 'published', 'updated', 'dc:date'])),
      verified: true,
    }]
  })
}

async function fetchFeed(feed) {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), 8000)
  try {
    const response = await fetch(feed.url, { signal: controller.signal, headers: { Accept: 'application/rss+xml, application/atom+xml, text/xml, application/xml;q=0.9', 'User-Agent': 'RouteWise/1.0 (+travel news reader)' } })
    if (!response.ok) throw new Error(`HTTP ${response.status}`)
    const text = await response.text()
    const articles = parseFeed(text.slice(0, 1_500_000), feed)
    if (!articles.length) throw new Error('No readable feed entries')
    return articles
  } finally { clearTimeout(timeout) }
}

export async function onRequestGet({ request }) {
  const requestUrl = new URL(request.url)
  const cacheKey = new Request(`${requestUrl.origin}${requestUrl.pathname}`, request)
  const cache = caches.default
  if (requestUrl.searchParams.get('refresh') !== '1') {
    const cached = await cache.match(cacheKey)
    if (cached) return cached
  }

  const settled = await Promise.allSettled(FEEDS.map(fetchFeed))
  const errors = []
  const deduped = new Map()
  settled.forEach((result, index) => {
    if (result.status === 'rejected') errors.push(`${FEEDS[index].name}: ${result.reason instanceof Error ? result.reason.message : 'Unavailable'}`)
    else result.value.forEach(article => deduped.set(article.sourceUrl.replace(/\/$/, ''), article))
  })
  const topicSeen=new Set()
  const articles = [...deduped.values()].map(article=>({...article,score:relevanceScore(article)})).filter(article=>article.score>=3).sort((a,b)=>b.score-a.score||(b.publishedAt||'').localeCompare(a.publishedAt||'')).filter(article=>{const key=topicKey(article.title);if(key&&topicSeen.has(key))return false;if(key)topicSeen.add(key);return true}).slice(0, 24).map(({score,...article})=>article)
  const payload = { articles, fetchedAt: new Date().toISOString(), status: articles.length ? (errors.length ? 'partial' : 'ok') : 'unavailable', errors }
  const response = new Response(JSON.stringify(payload), { headers: { 'Content-Type': 'application/json; charset=utf-8', 'Cache-Control': 'public, max-age=300, s-maxage=1800, stale-while-revalidate=86400', 'X-Content-Type-Options': 'nosniff' } })
  if (articles.length) await cache.put(cacheKey, response.clone())
  return response
}
