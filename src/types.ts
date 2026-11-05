export type TravelStyle = 'budget' | 'comfort' | 'premium'
export type CostKey = 'flights'|'accommodation'|'food'|'transport'|'attractions'|'visaInsurance'|'contingency'

export interface Attraction { id:string; name:string; area:string }

export interface Destination {
  id:string; country:string; city:string; code:string; gateways:string[]; attractions:Attraction[];
  duration:string; season:string; dailyCost:Record<TravelStyle,number>; image:string; region:string
}
export interface TripInput { origin:string; destinationId:string; departure:string; returnDate:string; travelers:number; nationality:string; style:TravelStyle }
export interface DayPlan { day:number; title:string; activities:string[]; note?:string }
export interface SavedTrip { id:string; createdAt:string; input:TripInput; itinerary:DayPlan[]; costs:Record<CostKey,number>; nights:number }
export interface FlightSegment { from:string; to:string; departure:string; arrival:string }
export interface FlightOffer { id:string; airline:string; segments:FlightSegment[]; price:number; currency:string; ticketType:'single'|'separate'; sourceUrl:string; verifiedDate:string; notes:string }
export interface GoogleFlightResearch { id:string; origin:string; destination:string; departure:string; returnDate:string; travelers:number; style:TravelStyle; url:string; airline?:string; observedFare?:number; currency:string; notes:string; savedAt:string }
export interface NewsArticle { id:string; title:string; category:string; summary:string; source:string; sourceUrl:string; publishedAt:string; verified:boolean }
export interface NewsFeedPayload { articles:NewsArticle[]; fetchedAt:string; status:'ok'|'partial'|'unavailable'; errors:string[] }
