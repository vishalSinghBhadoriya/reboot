export const rupees = (paise:number) => new Intl.NumberFormat('en-IN',{style:'currency',currency:'INR',minimumFractionDigits:paise%100?2:0,maximumFractionDigits:2}).format(paise/100)
export const validMobile = (value:string) => /^(?:\+?91)?[6-9]\d{9}$/.test(value.replace(/[\s-]/g,''))
export const whatsappUrl = (number:string,message:string) => validMobile(number) ? 'https://wa.me/91'+number.replace(/\D/g,'').slice(-10)+'?text='+encodeURIComponent(message) : null
export const localDate = () => new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Kolkata',year:'numeric',month:'2-digit',day:'2-digit'}).format(new Date())
