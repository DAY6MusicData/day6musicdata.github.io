import json
import sys
import re

def dur_to_seconds(s: str) -> int:
    s = (s or "").strip()
    m = re.match(r"^\s*(\d+):(\d{2}):(\d{2})\s*$", s)
    if not m:
        raise ValueError(f"Invalid duration: {s}")
    h, mm, ss = map(int, m.groups())
    return h * 3600 + mm * 60 + ss

def main(inp_path: str, out_path: str):
    with open(inp_path, "r", encoding="utf-8") as f:
        lines = [ln.rstrip("\n") for ln in f if ln.strip()]

    # 순번, 앨범, albumKey, 제목, 멜론, 지니, 벅스, 바이브, flo, 곡 길이
    rows = [ln.split("\t") for ln in lines[1:]]

    songs = []
    next_id = 0

    for i, cols in enumerate(rows, start=2):
        while len(cols) < 10:
            cols.append("")

        raw_id, album, albumkey, title, melon, genie, bugs, vibe, flo, length = cols[:10]

        raw_id = raw_id.strip()
        if raw_id == "":
            song_id = next_id
            print(f"[warn] line {i}: missing id -> auto set id={song_id}", file=sys.stderr)
        else:
            song_id = int(raw_id)

        next_id = max(next_id, song_id + 1)

        song = {
            "id": song_id,
            "album": album.strip(),
            "albumKey": albumkey.strip(),   # ✅ 추가
            "title": title.strip(),
            "len": dur_to_seconds(length),
            "platform": {
                "melon": melon.strip() or None,
                "genie": genie.strip() or None,
                "bugs": bugs.strip() or None,
                "vibe": vibe.strip() or None,
                "flo": flo.strip() or None,
            }
        }
        songs.append(song)

    # id 중복 체크
    seen = set()
    dup = []
    for s in songs:
        if s["id"] in seen:
            dup.append(s["id"])
        seen.add(s["id"])
    if dup:
        raise ValueError(f"Duplicate ids detected: {dup}")

    songs.sort(key=lambda x: x["id"])

    out = {"schema": 1, "songs": songs}
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python tsv_to_json.py songid.tsv songs.json")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
