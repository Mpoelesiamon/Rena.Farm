/* Local review adapter; never included by production portal.html. No network or database calls. */
const getClientSession = async () => ({ user: { id: 'local-preview', email: '' } });
const getClientProfile = async () => ({ full_name: 'Your account' });
const previewRows = async () => { if(new URLSearchParams(location.search).get('state') === 'error') throw Error('Preview connection error'); return []; };
const loadClientEnquiries = previewRows;
const loadClientMessages = previewRows;
const sendClientMessage = async () => false;
const markMessagesRead = async () => false;
const fmtDate = value => new Date(value).toLocaleDateString('en-KE');
const previewChannel = { on(){return this},subscribe(){return this},send(){} };
const db = { auth: { getSession: async () => ({data:{session:null}}), onAuthStateChange(){} }, channel: () => previewChannel, from: () => ({ update: () => ({ eq: () => Promise.resolve({error:{message:'Writes disabled in preview'}}) }) }) };
document.addEventListener('DOMContentLoaded', () => {
 document.querySelector('#welcomeMsg').textContent = 'Welcome to your farm account';
 document.querySelectorAll('#saveProfileBtn,#sendMsgBtn').forEach(button => {button.disabled=true;button.title='Disabled in local design preview'});
 document.querySelector('#msgInput').placeholder='Sign in on the account page to send messages';
});
