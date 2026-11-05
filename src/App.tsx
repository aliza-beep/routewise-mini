import { lazy, Suspense } from 'react'
import { Route, Routes } from 'react-router-dom'
import { Layout } from './components'

const Home=lazy(()=>import('./home-page'))
const Flights=lazy(()=>import('./flight-page'))
const Journal=lazy(()=>import('./news').then(m=>({default:m.JournalPage})))
const Article=lazy(()=>import('./news').then(m=>({default:m.JournalArticlePage})))
const Legal=lazy(()=>import('./legal-page'))
const Plan=lazy(()=>import('./pages').then(m=>({default:m.PlanTrip})))
const Destinations=lazy(()=>import('./pages').then(m=>({default:m.DestinationsPage})))
const Intelligence=lazy(()=>import('./pages').then(m=>({default:m.Intelligence})))
const Guide=lazy(()=>import('./pages').then(m=>({default:m.BookingGuide})))
const Trips=lazy(()=>import('./pages').then(m=>({default:m.MyTrips})))
const Loading=()=> <div className="shell py-24"><div className="h-72 animate-pulse rounded-3xl bg-mist"/></div>
export default function App(){return <Layout><Suspense fallback={<Loading/>}><Routes>
  <Route path="/" element={<Home/>}/><Route path="/plan" element={<Plan/>}/><Route path="/flights" element={<Flights/>}/><Route path="/destinations" element={<Destinations/>}/><Route path="/intelligence" element={<Intelligence/>}/><Route path="/journal" element={<Journal/>}/><Route path="/journal/:slug" element={<Article/>}/><Route path="/guide" element={<Guide/>}/><Route path="/trips" element={<Trips/>}/><Route path="/about" element={<Legal/>}/><Route path="/privacy" element={<Legal/>}/><Route path="/terms" element={<Legal/>}/><Route path="/intellectual-property" element={<Legal/>}/><Route path="/disclaimer" element={<Legal/>}/><Route path="*" element={<Home/>}/>
</Routes></Suspense></Layout>}
