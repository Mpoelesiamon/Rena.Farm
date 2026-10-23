const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const root = path.join(__dirname, '..');
const client = fs.readFileSync(path.join(root,'js/supabase-client.js'),'utf8');
function helper(name) { const start = client.indexOf('async function '+name+'('); return client.slice(start,client.indexOf('\n}',start)+2); }
function dbResult(result) { const query = { select(){return this},eq(){return this},order(){return Promise.resolve(result)},update(){return this},in(){return this},then(resolve){return Promise.resolve(result).then(resolve)} }; return {from(){return query}}; }
test('failed account reads are not shown as empty accounts in strict mode', async () => {
 for(const name of ['loadClientEnquiries','loadClientMessages']) {
  const error = new Error('offline');const ctx=vm.createContext({db:dbResult({error,data:null}),getClientSession:async()=>({user:{id:'test-only'}})});
  vm.runInContext(helper(name),ctx);
  await assert.rejects(ctx[name](true),/offline/);
  assert.equal((await ctx[name]()).length,0);
 }
});
test('read acknowledgements return only IDs confirmed by the database',async()=>{
 const ctx=vm.createContext({db:dbResult({data:[{id:'confirmed'}],error:null}),getClientSession:async()=>({user:{id:'test-only'}})});
 vm.runInContext(helper('markMessagesRead'),ctx);
 assert.equal(JSON.stringify(await ctx.markMessagesRead(['confirmed','unconfirmed'])),'["confirmed"]');
});
const portal=fs.readFileSync(path.join(root,'js/portal-v2.js'),'utf8');
function renderer(){const start=portal.indexOf('function enquiryCard('),end=portal.indexOf('\nfunction sectionLabel',start);const escapeStart=portal.indexOf('function escH('),escapeEnd=portal.indexOf('\n',escapeStart);const ctx=vm.createContext({STATUS_CLS:{new:'s-new'},STATUS_LBL:{new:'New'},fmtDate:()=> '15 Oct 2026'});vm.runInContext(portal.slice(escapeStart,escapeEnd)+'\n'+portal.slice(start,end),ctx);return ctx;}
test('enquiry cards tolerate null messages and escape attribute content',()=>{
 const ctx=renderer();const result=ctx.enquiryCard({id:'" onmouseover="alert(1)',message:null,status:'new',interest:'<script>bad</script>'},true);
 assert.ok(!result.includes('<script>'));
 assert.ok(result.includes('data-enquiry-id="&quot; onmouseover=&quot;alert(1)"'));
 assert.ok(!result.includes('onclick="openEditModal(\''));
});
