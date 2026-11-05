import { Bar, BarChart, CartesianGrid, ResponsiveContainer, Tooltip, XAxis, YAxis } from 'recharts'
import type { CostKey } from './types'
import { formatMoney } from './utils'

export default function CostChart({costs}:{costs:Record<CostKey,number>}){return <ResponsiveContainer width="100%" height="100%"><BarChart data={Object.entries(costs).map(([name,value])=>({name:name==='visaInsurance'?'visa':name,value}))}><CartesianGrid strokeDasharray="3 3" vertical={false}/><XAxis dataKey="name" fontSize={10}/><YAxis fontSize={10}/><Tooltip formatter={(v)=>formatMoney(Number(v))}/><Bar dataKey="value" fill="#176E83" radius={[6,6,0,0]}/></BarChart></ResponsiveContainer>}
