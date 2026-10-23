const test = require('node:test');
const assert = require('node:assert/strict');
const {googleProfilePhoto, renderProfileAvatar} = require('../js/profile-avatar.js');
test('Google identity photo takes precedence, with metadata fallback', () => {
  const photo = 'https://lh3.googleusercontent.com/a/example';
  assert.equal(googleProfilePhoto({identities:[{provider:'google',identity_data:{picture:photo}}]}),photo);
  assert.equal(googleProfilePhoto({user_metadata:{avatar_url:photo}}),photo);
  assert.equal(googleProfilePhoto({user_metadata:{avatar_url:'invalid',picture:photo}}),photo);
});
test('missing, unsafe and unrelated photo URLs fall back to initials', () => {
  for (const url of [undefined,'javascript:alert(1)','http://lh3.googleusercontent.com/a','https://googleusercontent.com.evil.test/a','https://example.com/a','https://user:pass@lh3.googleusercontent.com/a']) {
    assert.equal(googleProfilePhoto({user_metadata:{picture:url}}),null);
  }
  assert.equal(googleProfilePhoto(null),null);
});
test('photo failure retains initials; late loads cannot replace a newer avatar', () => {
  const element={children:[],setAttribute(){},appendChild(p){this.children.push(p)},contains(p){return this.children.includes(p)},replaceChildren(p){this.children=[p];this._text=''},set textContent(t){this._text=t;this.children=[]},get textContent(){return this._text}};
  global.document={createElement(){return {remove(){element.children=element.children.filter(p=>p!==this)}}}};
  const user={user_metadata:{picture:'https://lh3.googleusercontent.com/a/example'}};
  renderProfileAvatar(element,user,'Test');const failed=element.children[0];failed.onerror();assert.equal(element.textContent,'T');
  renderProfileAvatar(element,user,'Test');const stale=element.children[0];renderProfileAvatar(element,null,'Next');stale.onload();assert.equal(element.textContent,'N');
  renderProfileAvatar(element,user,'Test');const loaded=element.children[0];loaded.onload();assert.equal(loaded.hidden,false);assert.equal(element.children[0],loaded);
  delete global.document;
});
