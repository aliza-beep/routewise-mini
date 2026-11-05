import { describe, expect, it } from 'vitest'
import { airportCodeFromValue, destinations, getAirportOption } from './data'
import type { FlightOffer, TripInput } from './types'
import { filterAirportOptions } from './airport-combobox'
import { buildItinerary, estimateCosts, layovers, loadTrips, nightsBetween, saveTrip, totalFlightMinutes } from './utils'

const input:TripInput={origin:'JFK',destinationId:'japan',departure:'2026-12-01',returnDate:'2026-12-10',travelers:2,nationality:'United States',style:'comfort'}

describe('itinerary generation',()=>{
  it('keeps arrival/departure days and never repeats curated attractions',()=>{
    const destination=destinations.find(d=>d.id==='japan')!
    const plan=buildItinerary(input,destination)
    expect(plan).toHaveLength(nightsBetween(input.departure,input.returnDate)+1)
    expect(plan[0].title).toContain('Arrive')
    expect(plan.at(-1)?.title).toBe('Departure day')
    const attractionNames=new Set(destination.attractions.map(a=>a.name))
    const scheduled=plan.flatMap(day=>day.activities).filter(name=>attractionNames.has(name))
    expect(new Set(scheduled).size).toBe(scheduled.length)
    expect(plan.some(day=>day.activities.some(activity=>activity.includes('free time')))).toBe(true)
  })

  it('preserves positive cost totals',()=>{
    const costs=estimateCosts(input,destinations.find(d=>d.id==='japan')!)
    expect(Object.values(costs).reduce((sum,value)=>sum+value,0)).toBeGreaterThan(0)
  })
})

describe('flight time calculations',()=>{
  it('uses time-zone offsets for total duration and layovers',()=>{
    const offer:FlightOffer={id:'test',airline:'Example',price:1,currency:'USD',ticketType:'single',sourceUrl:'https://example.com',verifiedDate:'2026-11-05',notes:'',segments:[
      {from:'JFK',to:'LHR',departure:'2026-12-01T18:00-05:00',arrival:'2026-12-02T06:00+00:00'},
      {from:'LHR',to:'FRA',departure:'2026-12-02T10:00+00:00',arrival:'2026-12-02T12:30+01:00'},
    ]}
    expect(layovers(offer)).toEqual([240])
    expect(totalFlightMinutes(offer)).toBe(750)
  })
})

describe('curated airport selection',()=>{
  it('defaults to the full JFK label and searches by IATA, city, airport and country',()=>{
    expect(getAirportOption('JFK')?.display).toBe('New York — John F. Kennedy International Airport (JFK)')
    expect(filterAirportOptions('LHR')[0]?.display).toBe('London — Heathrow Airport (LHR)')
    expect(filterAirportOptions('London Heathrow').some(option=>option.code==='LHR')).toBe(true)
    expect(filterAirportOptions('Pakistan').some(option=>option.code==='LHE')).toBe(true)
    expect(airportCodeFromValue('not-a-real-airport')).toBeUndefined()
  })

  it('preserves a changed curated origin when a trip is saved and loaded',()=>{
    const values=new Map<string,string>();Object.defineProperty(globalThis,'localStorage',{configurable:true,value:{getItem:(key:string)=>values.get(key)??null,setItem:(key:string,value:string)=>values.set(key,value)}})
    const origin=getAirportOption('LHR')!.display,destination=destinations.find(d=>d.id==='japan')!,costs=estimateCosts({...input,origin},destination),itinerary=buildItinerary({...input,origin},destination)
    saveTrip({id:'airport-test',createdAt:'2026-11-05T00:00:00.000Z',input:{...input,origin},itinerary,costs,nights:nightsBetween(input.departure,input.returnDate)})
    expect(loadTrips()[0].input.origin).toBe('London — Heathrow Airport (LHR)')
  })
})
