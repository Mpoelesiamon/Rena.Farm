
const STATUS_LBL = { new:'New', in_progress:'In Progress', responded:'Responded', converted:'Converted', closed:'Closed' }
const STATUS_CLS = { new:'s-new', in_progress:'s-in_progress', responded:'s-responded', converted:'s-converted', closed:'s-closed' }

let currentSession = null
let clientProfile  = null
let allEnquiries   = []
let allMessages    = []
let enquiriesFailed = false
let messagesFailed = false

const style = document.createElement('style')
style.textContent = '@keyframes spin{from{transform:rotate(0deg)}to{transform:rotate(360deg)}}'
document.head.appendChild(style)

function escH(s) { return String(s||'').replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;').replace(/'/g,'&#39;') }

async function initPortal() {
  currentSession = await getClientSession()
  if (!currentSession) {
    window.location.href = `login.html?return=${encodeURIComponent(window.location.href)}`
    return
  }

  clientProfile = await getClientProfile()
  const user = currentSession.user

  const displayName = clientProfile?.full_name?.trim() || user.user_metadata?.full_name || user.email || 'Your account'
  document.getElementById('sidebarName').textContent   = displayName
  document.getElementById('sidebarEmail').textContent  = user.email
  renderProfileAvatar(document.getElementById('sidebarAvatar'), user, displayName)
  renderProfileAvatar(document.getElementById('profileAvatar'), user, displayName)
  document.getElementById('welcomeMsg').textContent    = `Welcome back, ${displayName.split(' ')[0]}`

  document.getElementById('profileName').value     = clientProfile?.full_name ?? ''
  document.getElementById('profilePhone').value    = clientProfile?.phone ?? ''
  document.getElementById('profileLocation').value = clientProfile?.location ?? ''
  document.getElementById('profileEmail').value    = user.email

  const results = await Promise.allSettled([loadClientEnquiries(true), loadClientMessages(true)])
  enquiriesFailed = results[0].status === 'rejected'
  messagesFailed = results[1].status === 'rejected'
  allEnquiries = enquiriesFailed ? [] : results[0].value
  allMessages = messagesFailed ? [] : results[1].value

  renderOverview()
  renderEnquiries()
  renderMessages()

  document.getElementById('loadingState').style.display  = 'none'
  document.getElementById('portalContent').style.display = 'block'

}

function switchTab(tab) {
  if (!['overview','enquiries','messages','profile'].includes(tab)) return
  document.querySelectorAll('.p-tab').forEach(el => el.classList.toggle('active', el.id === `tab-${tab}`))
  document.querySelectorAll('.p-tab-btn').forEach(el => {
    const active = el.id === `account-tab-${tab}`
    el.classList.toggle('active', active)
    el.setAttribute('aria-selected', String(active))
    el.tabIndex = active ? 0 : -1
  })
  if (tab === 'messages') acknowledgeVisibleMessages()
  document.getElementById(`account-tab-${tab}`).focus({ preventScroll: true })
  window.scrollTo({ top: 0, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' })
}

document.querySelector('[role="tablist"]').addEventListener('keydown', event => {
  const tabs = [...document.querySelectorAll('.p-tab-btn')]
  const index = tabs.indexOf(document.activeElement)
  if (index < 0 || !['ArrowLeft','ArrowRight','Home','End'].includes(event.key)) return
  event.preventDefault()
  const next = event.key === 'Home' ? 0 : event.key === 'End' ? tabs.length - 1 : (index + (event.key === 'ArrowRight' ? 1 : -1) + tabs.length) % tabs.length
  switchTab(tabs[next].id.replace('account-tab-', ''))
})
function loadError(kind) {
  return `<div class="empty-state account-error" role="alert"><i class="ph ph-cloud-slash" aria-hidden="true"></i><h3>We couldn't load your ${kind}.</h3><p>Your information hasn't been changed. Please try again.</p><button class="btn btn-outline-green" onclick="initPortal().catch(showPortalError)">Try again</button></div>`
}
function showPortalError() {
  document.getElementById('loadingState').innerHTML = '<div role="alert"><h2>We couldn’t open your account.</h2><p>Please check your connection and try again.</p><button class="btn btn-primary" onclick="location.reload()">Try again</button></div>'
}

let markingRead = false
async function acknowledgeVisibleMessages() {
  if (markingRead || messagesFailed) return
  const ids = allMessages.filter(m => !m.is_read && m.sender_role === 'staff').map(m => m.id)
  if (!ids.length) return
  markingRead = true
  try {
    const marked = await markMessagesRead(ids)
    const updated = new Set(marked || [])
    allMessages = allMessages.map(m => updated.has(m.id) ? { ...m, is_read: true } : m)
    renderOverview()
  } catch (_) { /* Keep the unread badge until the server confirms the update. */ }
  finally { markingRead = false }
}

function renderOverview() {
  const unread = allMessages.filter(m => !m.is_read && m.sender_role === 'staff').length

  const activeEnq = allEnquiries.filter(e => e.status === 'new' || e.status === 'in_progress').length
  document.getElementById('statEnquiries').textContent = enquiriesFailed ? '—' : activeEnq
  document.getElementById('statMessages').textContent = enquiriesFailed ? '—' : allEnquiries.length
  document.getElementById('statUnread').textContent = messagesFailed ? '—' : unread
  for (const [id, count] of [['chipMsgBadge', unread], ['msgBadge', activeEnq]]) {
    const badge = document.getElementById(id)
    badge.textContent = count
    badge.style.display = count > 0 ? 'inline' : 'none'
  }
  if (enquiriesFailed) { document.getElementById('overviewEnquiries').innerHTML = loadError('enquiries'); return }
  const recent = allEnquiries.slice(0, 3)
  document.getElementById('overviewEnquiries').innerHTML = recent.length
    ? recent.map(e => enquiryCard(e, false)).join('')
    : `<div class="empty-state account-first"><span class="empty-icon"><i class="ph ph-chat-circle-dots" aria-hidden="true"></i></span><h3>Your first enquiry starts here.</h3><p>Find something for your farm. Ask about availability, quantities or delivery, and follow the conversation here.</p><a href="products.html" class="btn btn-primary">Browse products <i class="ph ph-arrow-right" aria-hidden="true"></i></a><span class="empty-note">Your enquiries will appear here once sent.</span></div>`
}

function enquiryCard(e, showEdit = false) {
  const canEdit    = e.status === 'new' || e.status === 'in_progress'
  const isArranged = e.status === 'converted'
  return `<div class="enquiry-card" ${isArranged ? 'style="border-left:3px solid #10b981;"' : ''}>
    <div style="display:flex;align-items:flex-start;justify-content:space-between;gap:1rem;flex-wrap:wrap;">
      <div style="flex:1;min-width:0;">
        <div style="font-weight:700;color:var(--f950);margin-bottom:0.2rem;">${escH(e.interest ?? 'General Enquiry')}</div>
        <p style="font-size:0.85rem;color:var(--gray-500);margin-bottom:0.5rem;">${escH((e.message || '').substring(0,120))}${(e.message || '').length>120?'…':''}</p>
        ${e.quantity ? `<div style="font-size:0.78rem;color:var(--f600);margin-bottom:0.3rem;"><strong>Qty:</strong> ${escH(e.quantity)}</div>` : ''}
        ${isArranged ? `<div style="font-size:0.78rem;color:#10b981;font-weight:700;margin-bottom:0.3rem;"><i class="ph ph-check-circle"></i> Purchase arranged with the farm</div>` : ''}
        <div style="font-size:0.75rem;color:var(--gray-400);">${fmtDate(e.created_at)}</div>
        <button class="account-text-link" onclick="switchTab('messages')">Open messages <i class="ph ph-arrow-right" aria-hidden="true"></i></button>
      </div>
      <div style="display:flex;flex-direction:column;align-items:flex-end;gap:0.5rem;flex-shrink:0;">
        <span class="enquiry-status ${STATUS_CLS[e.status] || ''}">${STATUS_LBL[e.status] || 'Received'}</span>
        ${showEdit && canEdit ? `<button class="enquiry-edit-btn" data-enquiry-id="${escH(e.id)}" onclick="openEditModal(this.dataset.enquiryId)"><i class="ph ph-pencil-simple"></i> Edit</button>` : ''}
      </div>
    </div>
  </div>`
}

function sectionLabel(dotClass, text, count) {
  return `<div class="eq-section"><span class="eq-section-dot ${dotClass}"></span>${escH(text)} <span style="color:var(--gray-400);font-weight:600;">(${count})</span></div>`
}

function renderEnquiries() {
  if (enquiriesFailed) { document.getElementById('enquiriesList').innerHTML = loadError('enquiries'); return }
  if (!allEnquiries.length) {
    document.getElementById('enquiriesList').innerHTML = `<div class="empty-state enquiry-empty"><span class="empty-icon"><i class="ph ph-chats-circle" aria-hidden="true"></i></span><h3>Your next farm connection starts here.</h3><p>Ask about livestock, fodder or a farm visit. Your enquiries and their progress will appear here.</p><a href="enquire.html" class="btn btn-primary">Make your first enquiry <i class="ph ph-arrow-right" aria-hidden="true"></i></a><a href="products.html" class="account-text-link">Explore our products</a></div>`
    return
  }
  const gActive    = allEnquiries.filter(e => e.status === 'new' || e.status === 'in_progress')
  const gResponded = allEnquiries.filter(e => e.status === 'responded')
  const gArranged  = allEnquiries.filter(e => e.status === 'converted')
  const gClosed    = allEnquiries.filter(e => e.status === 'closed')

  let html = ''
  if (gActive.length)    { html += sectionLabel('dot-active',    'Pending / In Progress', gActive.length);    html += gActive.map(e => enquiryCard(e, true)).join('') }
  if (gResponded.length) { html += sectionLabel('dot-responded', 'Responded',             gResponded.length); html += gResponded.map(e => enquiryCard(e, false)).join('') }
  if (gArranged.length)  { html += sectionLabel('dot-arranged',  'Purchase Arranged',     gArranged.length);  html += gArranged.map(e => enquiryCard(e, false)).join('') }
  if (gClosed.length)    { html += sectionLabel('dot-closed',    'Closed',                gClosed.length);    html += gClosed.map(e => enquiryCard(e, false)).join('') }

  document.getElementById('enquiriesList').innerHTML = html
}

function renderMessages() {
  const thread = document.getElementById('msgThread')
  if (messagesFailed) { thread.innerHTML = loadError('messages'); return }
  const empty  = document.getElementById('msgEmpty')
  if (!allMessages.length) { thread.innerHTML = '<div class="chat-empty" id="msgEmpty"><i class="ph ph-chat-dots" aria-hidden="true"></i><h3>A direct line to the farm.</h3><p>Ask a question or follow up on an enquiry.<br>The Rena Farm team will reply here.</p></div>'; return }
  if (empty) empty.style.display = 'none'
  const bubbles = [...allMessages].sort((a, b) => new Date(a.created_at) - new Date(b.created_at)).map(m => {
    const isClient = m.sender_role === 'client'
    return `<div class="chat-bubble-wrap ${isClient ? 'from-client' : 'from-farm'}">
      <div class="chat-bubble">
        ${m.subject ? `<div class="chat-subject">${escH(m.subject)}</div>` : ''}
        ${escH(m.body)}
      </div>
      <div class="chat-meta">${isClient ? 'You' : 'Rena Farm'} · ${fmtDate(m.created_at)}</div>
    </div>`
  }).join('')
  const typing = document.getElementById('farmTypingWrap')
  thread.innerHTML = (empty ? empty.outerHTML : '') + bubbles + (typing ? typing.outerHTML : '')
  thread.scrollTop = thread.scrollHeight
}

async function sendMsg() {
  const input = document.getElementById('msgInput')
  const body  = input.value.trim()
  if (!body) return
  const btn = document.getElementById('sendMsgBtn')
  btn.disabled = true; input.value = ''

  const tempMsg = {
    id: 'temp-' + Date.now(), client_id: currentSession.user.id,
    sender_role: 'client', body, subject: null,
    created_at: new Date().toISOString()
  }
  allMessages.push(tempMsg)
  renderMessages()

  const errorEl = document.getElementById('messageError')
  errorEl.hidden = true
  const ok = await sendClientMessage(body).catch(() => false)
  if (!ok) {
    allMessages = allMessages.filter(m => m.id !== tempMsg.id)
    renderMessages(); input.value = body
    errorEl.textContent = 'Your message was not sent. Please try again.'
    errorEl.hidden = false
  }
  btn.disabled = false
  renderOverview()
}

async function saveProfile() {
  const btn   = document.getElementById('saveProfileBtn')
  const msgEl = document.getElementById('profileSaveMsg')
  btn.disabled = true; btn.textContent = 'Saving…'

  const { error } = await db.from('client_profiles').update({
    full_name: document.getElementById('profileName').value.trim(),
    phone:     document.getElementById('profilePhone').value.trim(),
    location:  document.getElementById('profileLocation').value.trim(),
    updated_at: new Date().toISOString(),
  }).eq('id', currentSession.user.id)

  msgEl.style.display = 'block'
  msgEl.style.color   = error ? '#dc2626' : '#16a34a'
  msgEl.textContent   = error ? 'Failed to save. Please try again.' : '✓ Profile updated successfully.'
  btn.disabled = false; btn.textContent = 'Save Changes'
  setTimeout(() => { msgEl.style.display = 'none' }, 3000)
}

function openEditModal(enquiryId) {
  const e = allEnquiries.find(x => x.id === enquiryId)
  if (!e) return
  document.getElementById('editEnquiryId').value  = e.id
  document.getElementById('editInterest').value   = e.interest ?? ''
  document.getElementById('editQuantity').value   = e.quantity ?? ''
  document.getElementById('editMessage').value    = e.message ?? ''
  document.getElementById('editLocation').value   = e.delivery_location ?? ''
  document.getElementById('editSaveMsg').style.display = 'none'
  document.getElementById('editOverlay').classList.add('open')
}

function closeEditModal(event) {
  if (event.target === document.getElementById('editOverlay'))
    document.getElementById('editOverlay').classList.remove('open')
}

async function saveEditedEnquiry() {
  const id = document.getElementById('editEnquiryId').value
  const interest = document.getElementById('editInterest').value.trim()
  const quantity = document.getElementById('editQuantity').value.trim()
  const message  = document.getElementById('editMessage').value.trim()
  const location = document.getElementById('editLocation').value.trim()

  if (!message) {
    document.getElementById('editSaveMsg').textContent = 'Message cannot be empty.'
    document.getElementById('editSaveMsg').style.cssText = 'display:block;color:#dc2626;'
    return
  }

  const btn = document.getElementById('editSaveBtn')
  btn.disabled = true; btn.textContent = 'Saving…'

  const { error } = await db.from('enquiries').update({
    interest: interest || null, quantity: quantity || null,
    message, delivery_location: location || null,
    updated_at: new Date().toISOString(),
  }).eq('id', id).eq('client_id', currentSession.user.id)

  if (error) {
    document.getElementById('editSaveMsg').textContent = 'Failed to save. Please try again.'
    document.getElementById('editSaveMsg').style.cssText = 'display:block;color:#dc2626;'
  } else {
    allEnquiries = allEnquiries.map(e => e.id === id
      ? { ...e, interest, quantity, message, delivery_location: location } : e)
    renderEnquiries(); renderOverview()
    document.getElementById('editOverlay').classList.remove('open')
  }
  btn.disabled = false; btn.textContent = 'Save Changes'
}

// ── Real-time ──────────────────────────────────
let chatChannel     = null
let farmTypingTimer = null

async function initRealtime() {
  const session = await getClientSession()
  if (!session) return
  const clientId = session.user.id

  chatChannel = db.channel(`client-chat-${clientId}`)
    .on('postgres_changes', {
      event: 'INSERT', schema: 'public', table: 'client_messages',
      filter: `client_id=eq.${clientId}`
    }, payload => {
      const msg = payload.new
      if (!allMessages.find(m => m.id === msg.id)) {
        allMessages.push(msg)
        renderMessages()
        renderOverview()
        if (document.getElementById('tab-messages').classList.contains('active')) acknowledgeVisibleMessages()
      }
    })
    .on('broadcast', { event: 'typing' }, payload => {
      if (payload.payload?.sender === 'staff') showFarmTyping()
    })
    .subscribe()

  const input = document.getElementById('msgInput')
  if (input) {
    input.addEventListener('input', () => {
      if (chatChannel) chatChannel.send({ type:'broadcast', event:'typing', payload:{ sender:'client' } })
    })
  }
}

function showFarmTyping() {
  const wrap = document.getElementById('farmTypingWrap')
  if (!wrap) return
  wrap.style.display = 'flex'
  const thread = document.getElementById('msgThread')
  if (thread) thread.scrollTop = thread.scrollHeight
  clearTimeout(farmTypingTimer)
  farmTypingTimer = setTimeout(() => { wrap.style.display = 'none' }, 3000)
}

// Keep currentSession fresh and handle expiry/sign-out
db.auth.onAuthStateChange((event, session) => {
  if (event === 'SIGNED_OUT') {
    window.location.href = `login.html?return=${encodeURIComponent(window.location.pathname + window.location.search)}`
  }
  if (event === 'TOKEN_REFRESHED' && session) {
    currentSession = session
    const name = document.getElementById('sidebarName').textContent
    renderProfileAvatar(document.getElementById('sidebarAvatar'), session.user, name)
    renderProfileAvatar(document.getElementById('profileAvatar'), session.user, name)
  }
})

function scheduleSessionWarning() {
  if (!currentSession?.expires_at) return
  const msUntilWarn = (currentSession.expires_at * 1000) - Date.now() - (5 * 60 * 1000)
  if (msUntilWarn > 0) {
    setTimeout(() => {
      const banner = document.getElementById('sessionWarning')
      if (banner) banner.style.display = 'flex'
    }, msUntilWarn)
  }
}

initPortal().then(() => { scheduleSessionWarning(); if (currentSession) initRealtime(); }).catch(showPortalError)
