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

    # 첫 줄: 헤더
    header = lines[0].split("\t")
    # 기대 컬럼(너 데이터 기준)
    # 순번, 앨범, 제목, 멜론, 지니, 벅스, 바이브, flo, 곡 길이
    rows = [ln.split("\t") for ln in lines[1:]]

    songs = []
    next_id = 0
    for i, cols in enumerate(rows, start=2):
        # 컬럼 부족하면 채우기
        while len(cols) < 9:
            cols.append("")

        raw_id, album, title, melon, genie, bugs, vibe, flo, length = cols[:9]

        raw_id = raw_id.strip()
        if raw_id == "":
            # 네 데이터에 순번 비어있는 줄이 하나 보이더라(유스케 '있잖아' 줄)
            # 자동으로 id 채우되, 경고 찍음
            song_id = next_id
            print(f"[warn] line {i}: missing id -> auto set id={song_id}", file=sys.stderr)
        else:
            song_id = int(raw_id)

        next_id = max(next_id, song_id + 1)

        song = {
            "id": song_id,
            "album": album.strip(),
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
    dup = [s["id"] for s in songs if (s["id"] in seen) or seen.add(s["id"])]
    if dup:
        raise ValueError(f"Duplicate ids detected: {dup}")

    # id 기준 정렬(원래 순서 유지 목적이면 이 줄 빼도 됨)
    songs.sort(key=lambda x: x["id"])

    out = {"schema": 1, "songs": songs}
    with open(out_path, "w", encoding="utf-8") as f:
        json.dump(out, f, ensure_ascii=False, indent=2)

if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("Usage: python tools/tsv_to_json.py songs.tsv songs.json")
        sys.exit(1)
    main(sys.argv[1], sys.argv[2])
