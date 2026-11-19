import urllib.parse, json, gzip, os, re, sys, urllib.request, shutil
OUT = "data"; os.makedirs(OUT, exist_ok=True)
UA = {"User-Agent": "Mozilla/5.0 data-fetch"}
log = []
def get(url, timeout=600):
    return urllib.request.urlopen(urllib.request.Request(url, headers=UA), timeout=timeout)
def save_gz(url, name):
    try:
        with get(url) as r, gzip.open(os.path.join(OUT, name + ".gz"), "wb", compresslevel=9) as f:
            shutil.copyfileobj(r, f, 1 << 20)
        sz = os.path.getsize(os.path.join(OUT, name + ".gz"))
        log.append(f"OK {name} {sz} {url}")
    except Exception as e:
        log.append(f"FAIL {name} {url} {e}")
SKIP = os.environ.get("SKIP_CARE_COMPARE") == "1"
# Care Compare (provider-data) datasets
for ds, name in ([] if SKIP else [("4pq5-n9py", "nh_provider_info.csv"), ("y2hd-n93e", "nh_ownership.csv"), ("g6vv-u9sr", "nh_penalties.csv")]):
    try:
        meta = json.load(get(f"https://data.cms.gov/provider-data/api/1/metastore/schemas/dataset/items/{ds}"))
        url = meta["distribution"][0]["downloadURL"]
        save_gz(url, name)
    except Exception as e:
        log.append(f"FAIL meta {ds} {e}")
# data.cms.gov catalog: titles carry a date suffix, pick newest
SKIP = os.environ.get("SKIP_CARE_COMPARE") == "1"
try:
    cat = json.load(get("https://data.cms.gov/data.json"))
    want = {
        "Skilled Nursing Facility All Owners": ("snf_all_owners.csv", 1),
        "Skilled Nursing Facility Enrollments": ("snf_enrollments.csv", 1),
        "Skilled Nursing Facility Change of Ownership": ("snf_chow.csv", 1),
        "Skilled Nursing Facility Change of Ownership - Owner Information": ("snf_chow_owners.csv", 1),
        "Skilled Nursing Facility Cost Report": ("snf_cost_report.csv", 2),
    }
    groups = {}
    for d in cat["dataset"]:
        t = d.get("title", "").strip()
        m = re.match(r"^(.*?)\s*:\s*([\d-]+)\w*$", t)
        base, dt = (m.group(1), m.group(2)) if m else (t, "")
        if base in want:
            groups.setdefault(base, []).append((dt, d))
    for base, items in groups.items():
        items.sort(key=lambda x: x[0], reverse=True)
        name, n = want[base]
        for i, (dt, d) in enumerate(items[:n]):
            dist = [x for x in d.get("distribution", []) if x.get("downloadURL") and ("csv" in str(x.get("mediaType","")).lower() or ".csv" in str(x["downloadURL"]).lower())]
            if not dist:
                dist = [x for x in d.get("distribution", []) if x.get("downloadURL")]
            log.append(f"INFO {base} {dt} -> {[x['downloadURL'] for x in dist][:2]}")
            if dist:
                save_gz(dist[0]["downloadURL"], name if i == 0 else name.replace(".csv", f"_{i}.csv"))
except Exception as e:
    log.append(f"FAIL catalog {e}")
# HUD Section 232 via data.gov CKAN
try:
    for q in ["section 232 residential care", "HUD insured nursing homes 232", "FHA 232 healthcare loans"]:
        r = json.load(get("https://catalog.data.gov/api/3/action/package_search?rows=10&q=" + urllib.parse.quote(q)))
        for pkg in r["result"]["results"]:
            for res in pkg.get("resources", []):
                log.append(f"HUDCAND {pkg['title']} | {res.get('name')} | {res.get('url')}")
except Exception as e:
    log.append(f"FAIL hud search {e}")
open(os.path.join(OUT, "fetch_log.txt"), "w").write("\n".join(log))
print("\n".join(log))
