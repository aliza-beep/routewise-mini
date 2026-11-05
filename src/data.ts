import type { Destination, NewsFeedPayload } from './types'

const img=(id:string)=>`https://images.unsplash.com/${id}?auto=format&fit=crop&w=1200&q=80`
const make=(id:string,country:string,city:string,code:string,gateways:string[],attractionNames:string[],duration:string,season:string,costs:[number,number,number],image:string,region:string):Destination=>({id,country,city,code,gateways,attractions:attractionNames.map((name,index)=>({id:`${id}-attraction-${index+1}`,name,area:`Area ${Math.floor(index/2)+1}`})),duration,season,dailyCost:{budget:costs[0],comfort:costs[1],premium:costs[2]},image:img(image),region})

export const destinations:Destination[]=[
  make('uk','United Kingdom','London','LHR',['LHR London Heathrow','LGW London Gatwick','MAN Manchester'],['British Museum','Westminster & South Bank','Tower of London','Borough Market','Greenwich'], '4–7 days','May–September',[145,260,520],'photo-1513635269975-59663e0ac1ad','Europe'),
  make('germany','Germany','Berlin','BER',['BER Berlin','FRA Frankfurt','MUC Munich'],['Museum Island','Brandenburg Gate','East Side Gallery','Reichstag dome','Kreuzberg'], '5–8 days','May–September',[120,220,430],'photo-1560969184-10fe8719e047','Europe'),
  make('france','France','Paris','CDG',['CDG Paris Charles de Gaulle','ORY Paris Orly','NCE Nice'],['Louvre Museum','Île de la Cité','Montmartre','Musée d’Orsay','Le Marais'], '4–7 days','April–June, September–October',[140,260,520],'photo-1502602898657-3e91760cbb34','Europe'),
  make('italy','Italy','Rome','FCO',['FCO Rome Fiumicino','MXP Milan Malpensa','VCE Venice'],['Colosseum & Forum','Vatican Museums','Trastevere','Pantheon','Villa Borghese'], '7–12 days','April–June, September–October',[125,230,460],'photo-1552832230-c0197dd311b5','Europe'),
  make('switzerland','Switzerland','Zurich','ZRH',['ZRH Zurich','GVA Geneva','BSL Basel'],['Old Town Zurich','Lake Zurich','Lucerne day trip','Uetliberg','Swiss National Museum'], '5–8 days','June–September, December–March',[190,340,650],'photo-1527668752968-14dc70a27c95','Europe'),
  make('spain','Spain','Barcelona','BCN',['MAD Madrid','BCN Barcelona','AGP Málaga'],['Sagrada Família','Gothic Quarter','Park Güell','Montjuïc','Picasso Museum'], '6–10 days','April–June, September–October',[105,200,400],'photo-1583422409516-2895a77efded','Europe'),
  make('pakistan','Pakistan','Lahore','LHE',['ISB Islamabad','LHE Lahore','KHI Karachi'],['Lahore Fort','Badshahi Mosque','Walled City','Shalimar Gardens','Food Street'], '7–14 days','October–March',[45,90,190],'photo-1582650625119-3a31f8fa2699','Asia'),
  make('india','India','Delhi','DEL',['DEL Delhi','BOM Mumbai','BLR Bengaluru'],['Humayun’s Tomb','Old Delhi','Lodhi Gardens','Qutub Minar','National Crafts Museum'], '8–14 days','October–March',[55,110,240],'photo-1524492412937-b28074a5d7da','Asia'),
  make('china','China','Shanghai','PVG',['PEK Beijing Capital','PVG Shanghai Pudong','CAN Guangzhou'],['The Bund','Yu Garden','Shanghai Museum','French Concession','Zhujiajiao'], '8–14 days','April–May, September–October',[75,150,300],'photo-1547981609-4b6bfe67ca0b','Asia'),
  make('japan','Japan','Tokyo','HND',['HND Tokyo Haneda','NRT Tokyo Narita','KIX Osaka Kansai'],['Meiji Shrine','Asakusa','Tokyo National Museum','Shibuya','Kamakura day trip'], '8–14 days','March–May, October–November',[110,220,430],'photo-1540959733332-eab4deabeeaf','Asia'),
  make('thailand','Thailand','Bangkok','BKK',['BKK Bangkok Suvarnabhumi','DMK Bangkok Don Mueang','HKT Phuket'],['Grand Palace','Wat Pho','Chao Phraya River','Jim Thompson House','Chatuchak Market'], '7–12 days','November–February',[55,115,240],'photo-1508009603885-50cf7c579365','Asia'),
  make('singapore','Singapore','Singapore','SIN',['SIN Singapore Changi'],['Gardens by the Bay','National Gallery','Kampong Glam','Singapore Botanic Gardens','Hawker centres'], '3–5 days','February–April',[100,210,420],'photo-1525625293386-3f8f99389edd','Asia'),
  make('azerbaijan','Azerbaijan','Baku','GYD',['GYD Baku Heydar Aliyev'],['Icherisheher','Flame Towers viewpoint','Heydar Aliyev Centre','Gobustan','Baku Boulevard'], '4–7 days','April–June, September–October',[60,125,260],'photo-1518808261-8b5f7f85569e','Asia'),
  make('malaysia','Malaysia','Kuala Lumpur','KUL',['KUL Kuala Lumpur','PEN Penang','BKI Kota Kinabalu'],['Petronas Towers','Islamic Arts Museum','Batu Caves','Merdeka Square','Jalan Alor'], '6–10 days','December–March',[55,115,240],'photo-1596422846543-75c6fc197f07','Asia'),
  make('usa','United States','New York','JFK',['JFK New York','LAX Los Angeles','ORD Chicago'],['Central Park','Metropolitan Museum','Lower Manhattan','High Line','Brooklyn waterfront'], '7–14 days','April–June, September–October',[180,330,650],'photo-1522083165195-3424ed129620','Americas'),
  make('canada','Canada','Toronto','YYZ',['YYZ Toronto','YVR Vancouver','YUL Montréal'],['Royal Ontario Museum','Toronto Islands','Distillery District','Niagara day trip','Kensington Market'], '7–12 days','June–September',[140,260,500],'photo-1517935706615-2717063c2225','Americas'),
  make('uae','United Arab Emirates','Dubai','DXB',['DXB Dubai','AUH Abu Dhabi'],['Al Fahidi district','Dubai Creek','Museum of the Future','Jumeirah Mosque','Abu Dhabi day trip'], '4–7 days','November–March',[120,250,520],'photo-1512453979798-5ea266f8880c','Middle East'),
  make('qatar','Qatar','Doha','DOH',['DOH Doha Hamad International'],['Museum of Islamic Art','Souq Waqif','National Museum of Qatar','Katara','Doha Corniche'], '3–5 days','November–March',[110,230,470],'photo-1539650116574-75c0c6d73f6e','Middle East'),
  make('saudi','Saudi Arabia','Riyadh','RUH',['RUH Riyadh','JED Jeddah','MED Madinah'],['At-Turaif district','National Museum','Edge of the World','Al Masmak Palace','Kingdom Centre'], '6–10 days','November–February',[95,190,390],'photo-1539650116574-8efeb43e2750','Middle East'),
  make('turkiye','Türkiye','Istanbul','IST',['IST Istanbul','SAW Istanbul Sabiha Gökçen','AYT Antalya'],['Hagia Sophia area','Topkapı Palace','Bosphorus ferry','Grand Bazaar','Galata'], '7–10 days','April–May, September–October',[75,150,310],'photo-1524231757912-21f4fe3a7200','Europe'),
  make('australia','Australia','Sydney','SYD',['SYD Sydney','MEL Melbourne','BNE Brisbane'],['Sydney Harbour','Art Gallery of NSW','Bondi to Coogee walk','The Rocks','Blue Mountains'], '10–18 days','September–November, March–May',[150,280,540],'photo-1506973035872-a4ec16b8e8d9','Oceania'),
  make('new-zealand','New Zealand','Auckland','AKL',['AKL Auckland','CHC Christchurch','ZQN Queenstown'],['Auckland waterfront','Waiheke Island','Auckland Museum','Waitākere Ranges','Devonport'], '10–18 days','December–March',[135,250,490],'photo-1469521669194-babb45599def','Oceania'),
]

export const newsAdapter={
  async fetch(signal?:AbortSignal):Promise<NewsFeedPayload>{
    const response=await window.fetch('/api/news',{signal,headers:{Accept:'application/json'}})
    if(!response.ok)throw new Error(`News service returned ${response.status}`)
    return response.json() as Promise<NewsFeedPayload>
  },
  async list(){return (await this.fetch()).articles}
}

const airportPresentation:Record<string,{city:string;name:string}>={
  JFK:{city:'New York',name:'John F. Kennedy International Airport'},
  LHR:{city:'London',name:'Heathrow Airport'},
  LGW:{city:'London',name:'Gatwick Airport'},
  CDG:{city:'Paris',name:'Charles de Gaulle Airport'},
  FCO:{city:'Rome',name:'Fiumicino Airport'},
  HND:{city:'Tokyo',name:'Haneda Airport'},
  NRT:{city:'Tokyo',name:'Narita International Airport'},
  BKK:{city:'Bangkok',name:'Suvarnabhumi Airport'},
  KUL:{city:'Kuala Lumpur',name:'Kuala Lumpur International Airport'},
  GYD:{city:'Baku',name:'Heydar Aliyev International Airport'},
  DXB:{city:'Dubai',name:'Dubai International Airport'},
  DOH:{city:'Doha',name:'Hamad International Airport'},
  IST:{city:'Istanbul',name:'Istanbul Airport'},
  SIN:{city:'Singapore',name:'Changi Airport'},
  SYD:{city:'Sydney',name:'Sydney Airport'},
  AKL:{city:'Auckland',name:'Auckland Airport'},
}

export const airportOptions=Array.from(new Map(destinations.flatMap(d=>d.gateways.map(g=>{
  const code=g.slice(0,3).toUpperCase(),raw=g.replace(/^\w{3}\s+/,'').trim(),detail=airportPresentation[code]
  const city=detail?.city||raw,name=detail?.name||(raw.toLowerCase().endsWith('airport')?raw:`${raw} Airport`)
  const display=`${city} — ${name} (${code})`
  return [code,{code,label:g,country:d.country,city,name,display,searchText:`${code} ${city} ${name} ${raw} ${d.country}`.toLowerCase()}]
}))).values()).sort((a,b)=>a.code==='JFK'?-1:b.code==='JFK'?1:a.display.localeCompare(b.display))

export const getAirportOption=(code:string)=>airportOptions.find(option=>option.code===code.toUpperCase())
export const airportCodeFromValue=(value:string)=>{
  const normalized=value.trim().toLowerCase()
  return airportOptions.find(option=>option.code.toLowerCase()===normalized||option.display.toLowerCase()===normalized||value.trim().toUpperCase().startsWith(`${option.code} `)||value.trim().toUpperCase().startsWith(`${option.code} —`))?.code
}

export const airlineResearchReferences=[
  {airline:'British Airways',hub:'LHR',city:'London',characteristic:'Large international hub; compare terminal and connection time carefully.'},
  {airline:'Lufthansa',hub:'FRA',city:'Frankfurt',characteristic:'European hub pattern; verify airport minimums and baggage protection.'},
  {airline:'Turkish Airlines',hub:'IST',city:'Istanbul',characteristic:'Broad hub-search starting point; check transit and overnight timing.'},
  {airline:'Emirates',hub:'DXB',city:'Dubai',characteristic:'Gulf hub research option; compare total elapsed time, not only stop count.'},
  {airline:'Qatar Airways',hub:'DOH',city:'Doha',characteristic:'Gulf hub research option; review connection buffer and fare conditions.'},
  {airline:'Singapore Airlines',hub:'SIN',city:'Singapore',characteristic:'Asia-Pacific hub reference; longer routings may trade time for schedule choice.'},
  {airline:'Japan Airlines',hub:'HND',city:'Tokyo',characteristic:'Japan hub reference; verify operating carrier and arrival airport.'},
  {airline:'Air Canada',hub:'YYZ',city:'Toronto',characteristic:'North American hub reference; check transit entry requirements.'},
  {airline:'Qantas',hub:'SYD',city:'Sydney',characteristic:'Australia hub reference; compare long-haul elapsed time and stop structure.'},
]

export const journalCategories=[
  {name:'Flight Deals & Holiday Packages',description:'Only dated, source-linked promotions whose terms can be checked.'},
  {name:'Travel Tips & Smart Booking',description:'Practical ways to compare, protect and prepare a journey.'},
  {name:'Airlines & Important Travel Updates',description:'Passenger-relevant routes, disruption and service changes.'},
  {name:'Tourism & Trending Destinations',description:'Useful destination developments and reasons to look closer.'},
  {name:"Romantic Escapes & Couples' Vacations",description:'Thoughtful trip ideas for two, without package-price claims.'},
  {name:'Where to Travel Next',description:'Evergreen RouteWise guides grounded in curated destination data.'},
]
