"""Static server for the repo root plus POST /save?name=<file> that writes the body into sim/results/.

Run from the repo root:  python sim/server.py   (binds 127.0.0.1:8733)
"""
import http.server, json, os, re, threading, urllib.parse

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'sim', 'results')
os.makedirs(OUT, exist_ok=True)
LOCK = threading.Lock()  # appends from parallel workers must not interleave


class H(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *a, **k):
        super().__init__(*a, directory=ROOT, **k)

    def end_headers(self):
        self.send_header('Cache-Control', 'no-store')
        super().end_headers()

    def do_POST(self):
        q = urllib.parse.parse_qs(urllib.parse.urlparse(self.path).query)
        name = q.get('name', [''])[0]
        if not re.fullmatch(r'[\w.-]+', name):
            self.send_error(400, 'bad name'); return
        n = int(self.headers.get('Content-Length', 0))
        data = b''
        while len(data) < n:
            chunk = self.rfile.read(n - len(data))
            if not chunk:
                break
            data += chunk
        try:  # never write a partial record; the page retries on an error
            json.loads(data.decode('utf-8'))
        except ValueError:
            self.send_error(422, 'incomplete body'); return
        mode = 'ab' if q.get('append') else 'wb'
        with open(os.path.join(OUT, name), mode) as f:
            f.write(data)
            if mode == 'ab': f.write(b'\n')
        self.send_response(204); self.end_headers()

    def log_message(self, *a):
        pass


if __name__ == '__main__':
    http.server.ThreadingHTTPServer(('127.0.0.1', 8733), H).serve_forever()
