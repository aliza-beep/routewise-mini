import type { CostKey, DayPlan, Destination, FlightOffer, GoogleFlightResearch, SavedTrip, TripInput } from './types'

export const formatMoney=(amount:number,currency='USD')=>new Intl.NumberFormat('en-US',{style:'currency',currency,maximumFractionDigits:0}).format(amount||0)
export const nightsBetween=(a:string,b:string)=>Math.max(0,Math.round((new Date(`${b}T12:00:00`).getTime()-new Date(`${a}T12:00:00`).getTime())/86400000))
export const durationMinutes=(from:string,to:string)=>Math.round((new Date(to).getTime()-new Date(from).getTime())/60000)
export const totalFlightMinutes=(offer:FlightOffer)=>offer.segments.length?durationMinutes(offer.segments[0].departure,offer.segments.at(-1)!.arrival):0
export const layovers=(offer:FlightOffer)=>offer.segments.slice(0,-1).map((s,i)=>durationMinutes(s.arrival,offer.segments[i+1].departure))
export const formatDuration=(m:number)=>`${Math.floor(m/60)}h ${m%60}m`

export function buildItinerary(input:TripInput,d:Destination):DayPlan[]{
  const nights=nightsBetween(input.departure,input.returnDate), total=nights+1
  const unique=Array.from(new Map(d.attractions.map(a=>[a.id,a])).values())
  const grouped=Array.from(new Map(unique.map(a=>[a.area,unique.filter(x=>x.area===a.area)])).values()).flat()
  let attractionIndex=0
  return Array.from({length:total},(_,i)=>{
    if(i===0)return {day:1,title:`Arrive in ${d.city}`,activities:[`Arrival from ${input.origin} and hotel check-in`,`Gentle orientation walk near your stay`],note:'Keep arrival day flexible for delays and rest.'}
    if(i===total-1)return {day:total,title:'Departure day',activities:['Check out and confirm baggage','Allow generous time for airport transfer'],note:'Verify terminal and departure time with your airline.'}
    const available=grouped.slice(attractionIndex,attractionIndex+2);attractionIndex+=available.length
    const activities=available.map(a=>a.name)
    if(activities.length<2)activities.push('Unstructured free time for rest or a neighbourhood walk')
    if(activities.length<2)activities.push('Flexible café, park or personal-interest time')
    return {day:i+1,title:available.length?`Explore ${d.city}`:'A slower day in '+d.city,activities:[...activities,'Local neighbourhood dinner'],note:i===1?'Book timed-entry attractions in advance when required.':available.length===0?'No attraction is repeated; use this day as flexible time.':undefined}
  })
}
export function estimateCosts(input:TripInput,d:Destination):Record<CostKey,number>{
  const nights=nightsBetween(input.departure,input.returnDate),p=input.travelers,day=d.dailyCost[input.style]
  const subtotal= p*day*Math.max(nights,1)
  const base={flights:0,accommodation:Math.round(subtotal*.44),food:Math.round(subtotal*.27),transport:Math.round(subtotal*.11),attractions:Math.round(subtotal*.18),visaInsurance:Math.round(p*(input.style==='premium'?180:110)),contingency:0}
  return {...base,contingency:Math.round(Object.values(base).reduce((a,b)=>a+b,0)*.1)}
}
export function offerScore(o:FlightOffer,all:FlightOffer[]){
  const maxPrice=Math.max(...all.map(x=>x.price),1),maxDur=Math.max(...all.map(totalFlightMinutes),1)
  const cost=100-(o.price/maxPrice*65),duration=100-(totalFlightMinutes(o)/maxDur*65),connections=Math.max(20,100-(o.segments.length-1)*28),protection=o.ticketType==='single'?100:35
  return Math.round(cost*.35+duration*.25+connections*.15+protection*.25)
}
export const saveTrip=(trip:SavedTrip)=>{const x=loadTrips();localStorage.setItem('routewise-trips',JSON.stringify([trip,...x.filter(t=>t.id!==trip.id)]))}
export const loadTrips=():SavedTrip[]=>{try{return JSON.parse(localStorage.getItem('routewise-trips')||'[]')}catch{return[]}}
export const saveOffers=(x:FlightOffer[])=>localStorage.setItem('routewise-offers',JSON.stringify(x))
export const loadOffers=():FlightOffer[]=>{try{return JSON.parse(localStorage.getItem('routewise-offers')||'[]')}catch{return[]}}
export const saveFlightResearch=(x:GoogleFlightResearch[])=>localStorage.setItem('routewise-google-flight-research',JSON.stringify(x))
export const loadFlightResearch=():GoogleFlightResearch[]=>{try{return JSON.parse(localStorage.getItem('routewise-google-flight-research')||'[]')}catch{return[]}}

export const googleFlightsUrl=(origin:string,destination:string,departure:string,returnDate:string)=>{
  const query=`Flights from ${origin} to ${destination} ${departure}${returnDate?` returning ${returnDate}`:''}`
  return `https://www.google.com/travel/flights?q=${encodeURIComponent(query)}`
}
