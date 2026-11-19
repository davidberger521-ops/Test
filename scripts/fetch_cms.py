import json, gzip, os, re, sys, urllib.request, shutil
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
# Care Compare (provider-data) datasets
for ds, name in [("4pq5-n9py", "nh_provider_info.csv"), ("y2hd-n93e", "nh_ownership.csv"), ("g6vv-u9sr", "nh_penalties.csv")]:
    try:
        meta = json.load(get(f"https://data.cms.gov/provider-data/api/1/metastore/schemas/dataset/items/{ds}"))
        url = meta["distribution"][0]["downloadURL"]
        save_gz(url, name)
    except Exception as e:
        log.append(f"FAIL meta {ds} {e}")
# data.cms.gov catalog
try:
    cat = json.load(get("https://data.cms.gov/data.json"))
    want = {
        "Skilled Nursing Facility All Owners": "snf_all_owners.csv",
        "Skilled Nursing Facility Enrollments": "snf_enrollments.csv",
        "Skilled Nursing Facility Change of Ownership": "snf_chow.csv",
        "Skilled Nursing Facility Change of Ownership - Owner Information": "snf_chow_owners.csv",
        "Skilled Nursing Facility Cost Report": "snf_cost_report.csv",
    }
    for d in cat["dataset"]:
        t = d.get("title", "").strip()
        if t in want:
            csvs = [x for x in d.get("distribution", []) if (x.get("mediaType") == "text/csv" or str(x.get("downloadURL","")).lower().endswith(".csv")) and x.get("downloadURL")]
            csvs.sort(key=lambda x: x.get("modified", x.get("temporal", "")), reverse=True)
            if csvs:
                log.append(f"INFO {t}: {[ (c.get('title'), c.get('modified')) for c in csvs[:3]]}")
                save_gz(csvs[0]["downloadURL"], want[t])
                # also previous cost report year for coverage
                if want[t] == "snf_cost_report.csv" and len(csvs) > 1:
                    save_gz(csvs[1]["downloadURL"], "snf_cost_report_prev.csv")
            else:
                log.append(f"NOCSV {t}")
    log.append("TITLES " + json.dumps(sorted({d.get('title','') for d in cat['dataset'] if 'Nursing' in d.get('title','') or 'SNF' in d.get('title','')})))
except Exception as e:
    log.append(f"FAIL catalog {e}")
# HUD Section 232 insured loans (best effort)
for url, name in [
    ("https://www.hud.gov/sites/dfiles/Housing/documents/FHA_SF_Section232_Insured.xlsx", "hud_232.xlsx"),
]:
    save_gz(url, name)
open(os.path.join(OUT, "fetch_log.txt"), "w").write("\n".join(log))
print("\n".join(log))
