import urllib.request
import json
import ssl

URL = "https://script.google.com/macros/s/AKfycbw7JRTyoussBuVvI9Tm8xaD2PCCkeCyKXHp572VY_7i6ep8Dsfj6_tzSSK8oNny9iPb8w/exec"

def test_bridge():
    ctx = ssl.create_default_context()
    ctx.check_hostname = False
    ctx.verify_mode = ssl.CERT_NONE

    print("Testing GET_DATA as application/json...")
    try:
        data = json.dumps({"action": "GET_DATA"}).encode('utf-8')
        req = urllib.request.Request(URL, data=data, headers={'Content-Type': 'application/json'})
        with urllib.request.urlopen(req, context=ctx) as response:
            res = response.read().decode('utf-8')
            print(f"application/json Status: {response.getcode()}")
            print(f"application/json Response: {res[:500]}")
    except urllib.error.URLError as e:
        print(f"application/json failed: {e}")
        if hasattr(e, 'read'):
            print(e.read().decode('utf-8'))

if __name__ == "__main__":
    test_bridge()
