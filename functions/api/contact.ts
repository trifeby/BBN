// Cloudflare Pages Function. No message data is stored in the website database.
// Production requires Turnstile & Resend secrets in Cloudflare Pages settings.
type Env = {
  TURNSTILE_SECRET_KEY?: string;
  RESEND_API_KEY?: string;
  CONTACT_FROM?: string;
  CONTACT_TO?: string;
};
type CFContext = { request: Request; env: Env };
const allowedTypes = new Set(['pemerintah','akademisi','komunitas','csr','lainnya']);
const clean = (s: FormDataEntryValue | null,max:number)=>typeof s === 'string' ? s.trim().slice(0,max).replace(/[\r\n\0]/g,' ') : '';
const error = (status:number,message:string)=> new Response(message,{status,headers:{'Content-Type':'text/plain; charset=utf-8','Cache-Control':'no-store'}});
const success = ()=>new Response(null,{status:303,headers:{Location:'/kolaborasi/?status=terkirim','Cache-Control':'no-store'}});

export const onRequestPost = async ({request,env}:CFContext):Promise<Response> => {
  if(!env.TURNSTILE_SECRET_KEY || !env.RESEND_API_KEY || !env.CONTACT_TO || !env.CONTACT_FROM)
    return error(503,'Formulir belum diaktifkan. Silakan hubungi pengurus BBN melalui kanal resmi.');
  const origin = request.headers.get('Origin');
  if(origin) {
    try {if(new URL(origin).host !== new URL(request.url).host)return error(403,'Asal permintaan tidak diizinkan.');}
    catch {return error(403,'Origin tidak valid.');}
  }
  const length = Number(request.headers.get('content-length')||'0');
  if(length>15000)return error(413,'Pesan terlalu besar.');
  if(!request.headers.get('content-type')?.includes('application/x-www-form-urlencoded') && !request.headers.get('content-type')?.includes('multipart/form-data'))
    return error(415,'Tipe data tidak didukung.');
  let form:FormData;
  try { form=await request.formData(); } catch { return error(400,'Data formulir tidak valid.'); }
  if(clean(form.get('website'),50)) return success(); // honeypot, do not disclose bot detection
  const name=clean(form.get('name'),120), organization=clean(form.get('organization'),150), email=clean(form.get('email'),160);
  const type=clean(form.get('collaborationType'),30), province=clean(form.get('province'),100);
  const message=typeof form.get('message')==='string' ? String(form.get('message')).trim().slice(0,3000):'';
  const token=clean(form.get('cf-turnstile-response'),2048);
  if(name.length<2 || !organization || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || !allowedTypes.has(type) || message.length<20 || form.get('consent')!=='yes')
    return error(400,'Mohon periksa kembali isian formulir.');
  if(!token)return error(400,'Verifikasi keamanan belum diselesaikan.');
  const verification = new FormData();
  verification.set('secret',env.TURNSTILE_SECRET_KEY);
  verification.set('response',token);
  const ip=request.headers.get('CF-Connecting-IP');
  if(ip)verification.set('remoteip',ip);
  let validated=false;
  try {
    const response=await fetch('https://challenges.cloudflare.com/turnstile/v0/siteverify',{method:'POST',body:verification});
    validated=response.ok && (await response.json() as {success:boolean}).success===true;
  } catch {return error(503,'Verifikasi keamanan gagal. Silakan coba lagi.');}
  if(!validated)return error(403,'Verifikasi keamanan ditolak. Muat ulang halaman dan coba lagi.');
  const plain=`PENGAJUAN KOLABORASI BBN\n\nNama: ${name}\nInstitusi: ${organization}\nEmail: ${email}\nKategori: ${type}\nProvinsi: ${province || '-'}\n\nPesan:\n${message}\n\nPersetujuan privasi: ya`;
  try {
    const delivery=await fetch('https://api.resend.com/emails',{
      method:'POST',
      headers:{'Authorization':`Bearer ${env.RESEND_API_KEY}`,'Content-Type':'application/json'},
      body:JSON.stringify({from:env.CONTACT_FROM,to:[env.CONTACT_TO],subject:`[BBN] Kolaborasi: ${type} — ${organization}`.slice(0,180),text:plain,reply_to:email})
    });
    if(!delivery.ok) return error(502,'Pesan belum berhasil dikirim. Silakan coba lagi nanti.');
    return success();
  } catch {return error(502,'Layanan pengiriman sedang terganggu.');}
};
export const onRequestGet=()=>error(405,'Gunakan formulir resmi website.');
