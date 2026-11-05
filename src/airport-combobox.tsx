import { useEffect, useId, useMemo, useRef, useState } from 'react'
import { Check, ChevronsUpDown, MapPin } from 'lucide-react'
import { airportOptions, getAirportOption } from './data'
import { Label } from './components'

export const filterAirportOptions=(query:string)=>{
  const terms=query.toLowerCase().trim().split(/\s+/).filter(Boolean)
  return airportOptions.filter(option=>terms.every(term=>option.searchText.includes(term)))
}

export function AirportCombobox({id,label,value,onChange,required=false}:{id?:string;label:string;value:string;onChange:(code:string)=>void;required?:boolean}){
  const generatedId=useId(),inputId=id||`airport-${generatedId}`,listId=`${inputId}-listbox`
  const selected=getAirportOption(value);const [query,setQuery]=useState(selected?.display||'');const [open,setOpen]=useState(false);const [active,setActive]=useState(0);const root=useRef<HTMLDivElement>(null)
  const matches=useMemo(()=>filterAirportOptions(query===selected?.display?'':query).slice(0,12),[query,selected?.display])
  useEffect(()=>{setQuery(selected?.display||'')},[selected?.display])
  useEffect(()=>{const close=(event:MouseEvent)=>{if(!root.current?.contains(event.target as Node)){setOpen(false);setQuery(selected?.display||'')}};document.addEventListener('mousedown',close);return()=>document.removeEventListener('mousedown',close)},[selected?.display])
  const choose=(code:string)=>{const option=getAirportOption(code);if(!option)return;onChange(option.code);setQuery(option.display);setOpen(false);setActive(0)}
  const onKeyDown=(event:React.KeyboardEvent<HTMLInputElement>)=>{
    if(event.key==='ArrowDown'){event.preventDefault();setOpen(true);setActive(index=>Math.min(index+1,Math.max(matches.length-1,0)))}
    else if(event.key==='ArrowUp'){event.preventDefault();setOpen(true);setActive(index=>Math.max(index-1,0))}
    else if(event.key==='Enter'&&open&&matches[active]){event.preventDefault();choose(matches[active].code)}
    else if(event.key==='Escape'){event.preventDefault();setOpen(false);setQuery(selected?.display||'')}
  }
  return <div ref={root} className="relative"><Label>{label}</Label><div className="relative"><MapPin className="pointer-events-none absolute left-3 top-3 text-navy/35" size={17}/><input id={inputId} role="combobox" aria-autocomplete="list" aria-controls={listId} aria-expanded={open} aria-activedescendant={open&&matches[active]?`${inputId}-option-${matches[active].code}`:undefined} aria-invalid={required&&!selected} required={required} autoComplete="off" className="pl-9 pr-10" value={query} onFocus={event=>{setOpen(true);event.currentTarget.select()}} onChange={event=>{setQuery(event.target.value);setOpen(true);setActive(0)}} onKeyDown={onKeyDown} onBlur={()=>setTimeout(()=>{setQuery(selected?.display||'');setOpen(false)},120)} placeholder="Search city, airport, country or IATA code"/><ChevronsUpDown className="pointer-events-none absolute right-3 top-3 text-navy/35" size={17}/></div>{open&&<ul id={listId} role="listbox" aria-label={`${label} suggestions`} className="absolute z-50 mt-2 max-h-72 w-full overflow-y-auto rounded-xl border bg-white p-1 shadow-lift">{matches.length?matches.map((option,index)=><li id={`${inputId}-option-${option.code}`} role="option" aria-selected={option.code===value} key={option.code} onMouseDown={event=>event.preventDefault()} onClick={()=>choose(option.code)} className={`flex cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-sm ${index===active?'bg-mist':'hover:bg-ivory'}`}><span><b className="block text-navy">{option.display}</b><span className="text-xs text-navy/45">{option.country}</span></span>{option.code===value&&<Check size={16} className="shrink-0 text-teal"/>}</li>):<li className="px-3 py-4 text-sm text-navy/50">No curated airport matches your search.</li>}</ul>}</div>
}
