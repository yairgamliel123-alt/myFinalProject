from urllib.parse import urlparse, parse_qs

def extract_youtube_id(url: str) -> str | None:
    parsed = urlparse(url)

    if parsed.hostname == "youtu.be":
        return parsed.path[1:]

    if parsed.hostname in ("www.youtube.com", "youtube.com"):
        if parsed.path == "/watch":
            return parse_qs(parsed.query).get("v", [None])[0]

        if parsed.path.startswith("/embed/"):
            return parsed.path.split("/")[2]

    return None