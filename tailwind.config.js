/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  theme: { extend: {
    colors: { navy:'#102743', ivory:'#F5F4F0', teal:'#176E83', gold:'#E8B66B', mist:'#E8EFF1' },
    fontFamily: { sans:['Inter','ui-sans-serif','system-ui'], display:['Georgia','ui-serif','serif'] },
    boxShadow: { lift:'0 18px 48px -28px rgba(16,39,67,.28)', card:'0 10px 30px -22px rgba(16,39,67,.32)' }
  }}, plugins: []
}
