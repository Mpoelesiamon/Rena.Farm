// Supabase client for public website dynamic content
const SUPABASE_URL  = 'https://mykyvloynpiqzmqvwekv.supabase.co'
const SUPABASE_ANON = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im15a3l2bG95bnBpcXptcXZ3ZWt2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzkwMTExNzksImV4cCI6MjA5NDU4NzE3OX0.Etc2VejNiUXNJhmu5oBeiXEFe45qyzgfTFkdvRfv5ZU'

const { createClient } = supabase
const db = createClient(SUPABASE_URL, SUPABASE_ANON)

// ── Fetch published events ──
async function loadEvents(status = null) {
  let query = db.from('events').select('*').eq('is_published', true).order('event_date')
  if (status) query = query.eq('status', status)
  const { data } = await query
  return data ?? []
}

// ── Fetch upcoming events (for homepage) ──
async function loadUpcomingEvents(limit = 3) {
  const { data } = await db.from('events').select('*')
    .eq('is_published', true).eq('status', 'upcoming')
    .order('event_date').limit(limit)
  return data ?? []
}

// ── Fetch awards ──
async function loadAwards() {
  const { data } = await db.from('awards').select('*').eq('is_published', true).order('award_date', { ascending: false })
  return data ?? []
}

// ── Fetch certificates ──
async function loadCertificates() {
  const { data } = await db.from('certificates').select('*').eq('is_published', true).order('issued_date', { ascending: false })
  return data ?? []
}

// ── Fetch partners ──
async function loadPartners() {
  const { data } = await db.from('partners').select('*').eq('is_published', true).order('display_order')
  return data ?? []
}

// ── Fetch testimonials ──
async function loadTestimonials() {
  const { data } = await db.from('testimonials').select('*').eq('is_published', true).order('created_at', { ascending: false })
  return data ?? []
}

// ── Fetch listed animals (public) ──
async function loadListedAnimals() {
  const { data } = await db
    .from('animals')
    .select('*')
    .in('listing_status', ['on_sale', 'booked', 'sold'])
    .order('created_at', { ascending: false })
  return data ?? []
}

// ── Fetch images for an animal ──
async function loadAnimalImages(animalId) {
  const { data } = await db
    .from('animal_images')
    .select('*')
    .eq('animal_id', animalId)
    .order('display_order')
  return data ?? []
}

// ── Calculate age string from DOB ──
function calcAge(dob) {
  if (!dob) return null
  const diff = Date.now() - new Date(dob).getTime()
  const days  = Math.floor(diff / 86400000)
  if (days < 30)  return `${days}d old`
  if (days < 365) return `${Math.floor(days/30)}mo old`
  const yrs = Math.floor(days/365)
  const mos = Math.floor((days % 365) / 30)
  return mos > 0 ? `${yrs}yr ${mos}mo old` : `${yrs}yr old`
}

// ── Fetch a single animal by ID (public) ──
async function loadAnimalById(id) {
  const { data } = await db.from('animals').select('*').eq('id', id).single()
  return data ?? null
}

// ── Fetch active product listings ──
async function loadActiveProductListings() {
  const { data } = await db.from('product_listings').select('*').eq('listing_status', 'active').order('created_at', { ascending: false })
  return data ?? []
}

// ── Submit enquiry ──
async function submitProductEnquiry(payload) {
  // Ensure client_profiles row exists for this user before inserting
  if (payload.client_id) {
    const { data: existing } = await db.from('client_profiles').select('id').eq('id', payload.client_id).single()
    if (!existing) {
      // Create profile from whatever we have in the payload
      const session = await getClientSession()
      await db.from('client_profiles').upsert({
        id:        payload.client_id,
        full_name: `${payload.first_name ?? ''} ${payload.last_name ?? ''}`.trim() || 'Client',
        phone:     payload.phone ?? null,
      }, { onConflict: 'id' })
    }
  }
  const { error } = await db.from('enquiries').insert(payload)
  if (error) console.error('Enquiry submit error:', error)
  return !error
}

// ── Submit enquiry from contact form ──
async function submitEnquiry(formData) {
  const { error } = await db.from('enquiries').insert(formData)
  return !error
}

// ── Auth helpers ──
async function getClientSession() {
  const { data: { session } } = await db.auth.getSession()
  return session
}

async function getClientProfile() {
  const session = await getClientSession()
  if (!session) return null
  const { data } = await db.from('client_profiles').select('*').eq('id', session.user.id).single()
  return data ?? null
}

async function signInClient(email, password) {
  const { data, error } = await db.auth.signInWithPassword({ email, password })
  return { session: data?.session ?? null, error }
}

async function registerClient(email, password, fullName, phone) {
  const { data, error } = await db.auth.signUp({
    email, password,
    options: { data: { full_name: fullName, phone } }
  })
  return { user: data?.user ?? null, error }
}

async function signOutClient() {
  await db.auth.signOut()
}

// Gate helper: if not logged in, redirect to login with return URL
function requireAuth(returnUrl) {
  const url = returnUrl ?? window.location.href
  db.auth.getSession().then(({ data: { session } }) => {
    if (!session) window.location.href = `login.html?return=${encodeURIComponent(url)}`
  })
}

// ── Client messages ──
async function loadClientMessages() {
  const session = await getClientSession()
  if (!session) return []
  const { data } = await db.from('client_messages').select('*').eq('client_id', session.user.id).order('created_at', { ascending: false })
  return data ?? []
}

async function sendClientMessage(body, subject, relatedEnquiryId) {
  const session = await getClientSession()
  if (!session) return false
  const { error } = await db.from('client_messages').insert({
    client_id: session.user.id,
    sender_role: 'client',
    sender_id: session.user.id,
    subject: subject ?? null,
    body,
    related_enquiry_id: relatedEnquiryId ?? null,
  })
  return !error
}

async function markMessagesRead(ids) {
  if (!ids.length) return
  await db.from('client_messages').update({ is_read: true }).in('id', ids)
}

// ── Client enquiries ──
async function loadClientEnquiries() {
  const session = await getClientSession()
  if (!session) return []
  const { data } = await db.from('enquiries').select('*').eq('client_id', session.user.id).order('created_at', { ascending: false })
  return data ?? []
}

// ── Format date ──
function fmtDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('en-KE', { day: 'numeric', month: 'long', year: 'numeric' })
}
