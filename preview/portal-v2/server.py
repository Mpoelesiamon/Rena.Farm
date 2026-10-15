"""Loopback-only account review; production portal still requires Supabase sign-in."""
from http.server import ThreadingHTTPServer, SimpleHTTPRequestHandler
from pathlib import Path
from urllib.parse import urlsplit,parse_qs
import os,re
ROOT=Path(__file__).resolve().parents[2]
os.chdir(ROOT)
class Handler(SimpleHTTPRequestHandler):
 def do_GET(self):
  path=urlsplit(self.path).path
  if path in ['/', '/portal-preview']:
   html=(ROOT/'portal.html').read_text()
   html=html.replace('<head>','<head><base href="/">')
   html=html.replace('<script src="js/vendor/supabase.js"></script>','').replace('<script src="js/supabase-client.js?v=portal-2"></script>','<script src="/preview/portal-v2/adapter.js"></script>')
   html=html.replace('src="js/layout.js?v=portal-2"','src="/preview-layout.js"')
   html=html.replace('<div id="rf-header"></div>','<div id="rf-header"></div><div class="preview-note" style="position:relative;margin-top:94px;padding:10px 20px;background:#f6ecd3;color:#51472f;text-align:center;font:12px Inter,sans-serif">Local design preview · No customer data or live writes · <a href="/?state=empty">Empty</a> / <a href="/?state=error">Connection error</a></div><style>.portal-shell{margin-top:0!important}</style>')
   self.reply(html.encode(),'text/html');return
  if path=='/preview-layout.js':
   js=(ROOT/'js/layout.js').read_text();a=js.index('// ── Sentry');b=js.index(';(function () {',js.index('})()',a)+4);js=js[:a]+js[b:];self.reply(js.encode(),'text/javascript');return
  if any(part.startswith('.') for part in Path(path).parts) or path.endswith(('.py','.sql','.md')):self.send_error(404);return
  super().do_GET()
 def list_directory(self,path):self.send_error(404);return None
 def reply(self,body,kind):
  self.send_response(200);self.send_header('Content-Type',kind);self.send_header('Content-Length',str(len(body)));self.send_header('Cache-Control','no-store');self.end_headers();self.wfile.write(body)
print('Account preview: http://localhost:3000',flush=True)
ThreadingHTTPServer(('127.0.0.1',3000),Handler).serve_forever()
