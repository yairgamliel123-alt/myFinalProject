import requests

HEADERS = {
    "User-Agent": "TripPlanner/1.0 (yairgamliel123@gmail.com)"
}

def geocode(location_name: str):
    url = "https://nominatim.openstreetmap.org/search"
    params = {
        "q": location_name,
        "format": "json",
        "limit": 1
    }

    try:
        res = requests.get(url, params=params, headers=HEADERS, timeout=8)
        res.raise_for_status()
        data = res.json()

        if not data:
            return None, None

        return float(data[0]["lat"]), float(data[0]["lon"])

    except Exception:
        return None, None
