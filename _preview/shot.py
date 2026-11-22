import base64, json, glob, os, sys

files = sorted(glob.glob(os.path.expanduser('~/.cursor/browser-logs/cdp-response-Page.captureScreenshot-*.json')))
src = files[-1]
data = json.load(open(src))
if 'data' not in data:
    data = data.get('result', data)
out = sys.argv[1] if len(sys.argv) > 1 else '/Users/aliasgarbarbarawala/Downloads/batul-world/_preview/shot.jpg'
open(out, 'wb').write(base64.b64decode(data['data']))
print(out, os.path.getsize(out))
