"""Turn raw CMS/HCRIS/HUD files into compact JSON for the site."""
import csv, gzip, json, re, os, sys, datetime, collections
import warnings; warnings.filterwarnings("ignore")
D = sys.argv[1] if len(sys.argv) > 1 else "data"
OUT = sys.argv[2] if len(sys.argv) > 2 else "site"
os.makedirs(OUT, exist_ok=True)

def rd(name, enc="utf-8-sig"):
    return csv.DictReader(gzip.open(os.path.join(D, name), "rt", encoding=enc, errors="replace"))

def num(x):
    try: return float(str(x).replace(",", "").replace("$", "").strip())
    except: return None

def dt(s):
    for f in ("%m/%d/%Y", "%Y-%m-%d"):
        try: return datetime.datetime.strptime(s.strip(), f).date()
        except: pass
    return None

# ---------- homes ----------
homes, hidx = [], {}
for x in rd("nh_provider_info.csv.gz"):
    ccn = x["CMS Certification Number (CCN)"].strip()
    h = dict(ccn=ccn, name=x["Provider Name"].strip(), addr=x["Provider Address"].strip(), city=x["City/Town"].strip(),
             st=x["State"].strip(), zip=x["ZIP Code"].strip()[:5].zfill(5),
             lat=num(x["Latitude"]), lon=num(x["Longitude"]), beds=int(num(x["Number of Certified Beds"]) or 0),
             res=num(x["Average Number of Residents per Day"]), stars=int(num(x["Overall Rating"]) or 0),
             own=x["Ownership Type"].strip(), chain=x["Chain Name"].strip(), legal=x["Legal Business Name"].strip(),
             chg12=x["Provider Changed Ownership in Last 12 Months"].strip() == "Y",
             sff=x["Special Focus Status"].strip(), abuse=x["Abuse Icon"].strip() == "Y",
             fines=num(x["Total Amount of Fines in Dollars"]) or 0, nfines=int(num(x["Number of Fines"]) or 0),
             hprd=num(x["Reported Total Nurse Staffing Hours per Resident per Day"]))
    hidx[ccn] = len(homes); homes.append(h)
print("homes", len(homes))

# enrollment -> ccn, affiliation entity
enr2ccn, affil = {}, {}
for x in rd("snf_enrollments.csv.gz", "latin-1"):
    ccn = x["CCN"].strip()
    enr2ccn[x["ENROLLMENT ID"].strip()] = ccn
    if x["AFFILIATION ENTITY NAME"].strip():
        affil[ccn] = x["AFFILIATION ENTITY NAME"].strip()
for h in homes: h["affil"] = affil.get(h["ccn"], "")

# ---------- cost reports (PUF) ----------
fin = {}
for fn in ["snf_cost_report_1.csv.gz", "snf_cost_report.csv.gz"]:  # older first, newer overwrites
    for x in rd(fn, "latin-1"):
        ccn = x["Provider CCN"].strip().zfill(6)
        b, e = dt(x["Fiscal Year Begin Date"]), dt(x["Fiscal Year End Date"])
        if not b or not e or (e - b).days < 330: continue
        rev = (num(x["Net Patient Revenue"]) or 0) + (num(x["Total Other Income"]) or 0)
        ni = num(x["Net Income"]); beds = num(x["Number of Beds"]) or 0
        if rev is None or ni is None or rev <= 0: continue
        prev = fin.get(ccn)
        if prev and prev["fye"] > e: continue
        fin[ccn] = dict(rpt=x["rpt_rec_num"].strip(), fye=e, rev=rev, ni=ni, cost=num(x["Less Total Operating Expense"]), beds=beds)
print("finance", len(fin))

# ---------- related party A-8-1 from HCRIS ----------
def norm_co(s):
    s = re.sub(r"[^A-Z0-9 &]", " ", s.upper())
    s = re.sub(r"\b(LLC|L L C|INC|INCORPORATED|CORP|CORPORATION|CO|LTD|LP|LLP|PC|PLLC|THE|D B A|DBA)\b", " ", s)
    return re.sub(r"\s+", " ", s).strip()
rp_amt, rp_names, rpt2ccn = {}, collections.defaultdict(dict), {}
for fy in ["2024", "2025"]:
    p = os.path.join(D, f"hcris{fy}_rpt.csv.gz")
    if not os.path.exists(p): continue
    for row in csv.reader(gzip.open(p, "rt", encoding="latin-1")):
        rpt2ccn[row[0]] = row[2].strip().zfill(6)
    for row in csv.reader(gzip.open(os.path.join(D, f"hcris{fy}_a81_nmrc.csv.gz"), "rt", encoding="latin-1")):
        rpt, ws, line, col, val = row[:5]
        if ws != "A810001" or line.startswith("010"): continue  # skip total line 01000
        a = rp_amt.setdefault(rpt, {"cost": 0.0, "paid": 0.0, "adj": 0.0})
        v = num(val) or 0
        if col == "00400": a["cost"] += v
        elif col == "00500": a["paid"] += v
        elif col == "00600": a["adj"] += v
    tmp = collections.defaultdict(dict)
    for row in csv.reader(gzip.open(os.path.join(D, f"hcris{fy}_a81_alpha.csv.gz"), "rt", encoding="latin-1")):
        rpt, ws, line, col = row[:4]; val = ",".join(row[4:]).strip()
        if ws == "A810002" and col in ("00400", "00600"):
            tmp[(rpt, line)][col] = val
    for (rpt, line), d in tmp.items():
        n = d.get("00400", "").strip()
        if n and norm_co(n) and norm_co(n) not in ("NONE", "N A", "NA", "0"):
            rp_names[rpt][norm_co(n)] = (n.upper().strip(), d.get("00600", "").upper().strip())

# companies index
companies, cidx = [], {}
for h in homes:
    f = fin.get(h["ccn"])
    h["fin"] = None; h["rp"] = []
    if f:
        a = rp_amt.get(f["rpt"])
        paid = a["paid"] if a else 0
        mark = (-a["adj"] if a and a["adj"] else (a["paid"] - a["cost"]) if a else 0)
        h["fin"] = [f["fye"].isoformat(), round(f["rev"]), round(f["ni"]), round(paid), round(mark)]
        for k, (disp, typ) in rp_names.get(f["rpt"], {}).items():
            if k not in cidx:
                cidx[k] = len(companies); companies.append([disp.title(), typ.title()])
            h["rp"].append(cidx[k])
print("companies", len(companies), "homes w/ rp names", sum(1 for h in homes if h["rp"]))

# ---------- HUD 232 loans ----------
try:
    import pandas as pd
    df = pd.read_excel(os.path.join(D, "hud_mf_active.xlsx"), header=1)
    df = df[df["SOA CATEGORY/SUB CATEGORY"].astype(str).str.contains("232")]
    STOP = {"NURSING", "REHABILITATION", "REHAB", "CENTER", "HEALTH", "CARE", "HEALTHCARE", "AND", "OF", "THE", "AT",
            "LLC", "INC", "HOME", "CENTRE", "FOR", "SKILLED", "LIVING", "SNF", "OPERATIONS", "MANOR", "COMMUNITY", "POST", "ACUTE"}
    def toks(s): return {t for t in re.sub(r"[^A-Z0-9 ]", " ", str(s).upper()).split() if t not in STOP and len(t) > 1}
    byzip = collections.defaultdict(list)
    for i, h in enumerate(homes): byzip[h["zip"]].append(i)
    nm = 0
    for _, r in df.iterrows():
        z = str(r["PROPERTY ZIP"]).split(".")[0][:5].zfill(5)
        cands = byzip.get(z, [])
        if not cands: continue
        lt = toks(r["PROPERTY NAME"]); best, bs = None, 0
        for i in cands:
            ht = toks(homes[i]["name"]) | toks(homes[i]["legal"])
            if not lt or not ht: continue
            s = len(lt & ht) / len(lt | ht)
            if s > bs: best, bs = i, s
        if best is None or bs < 0.34:
            continue
        ed = r["FINAL ENDORSEMENT DATE"] if pd.notna(r["FINAL ENDORSEMENT DATE"]) else r["INITIAL ENDORSEMENT DATE"]
        homes[best]["hud"] = [str(r["PROPERTY NAME"]).strip().title(), round(float(r["ORIGINAL MORTGAGE AMOUNT"] or 0)),
                              round(float(r["AMORITIZED PRINCIPAL BALANCE"] or 0)), float(r["INTEREST RATE"] or 0),
                              str(r["HOLDER NAME"]).strip().title(), str(ed)[:10], str(r["MATURITY DATE"])[:10]]
        nm += 1
    print("hud 232 loans", len(df), "matched", nm)
except Exception as e:
    print("HUD fail", e)

# ---------- owners & links ----------
owners, oidx, links = [], {}, []
seen = set()
FLAGS = [("PRIVATE EQUITY COMPANY - OWNER", "PE"), ("REIT - OWNER", "REIT"), ("TRUST OR TRUSTEE - OWNER", "Trust"),
         ("MANAGEMENT SERVICES COMPANY - OWNER", "Mgmt"), ("HOLDING COMPANY - OWNER", "Holding"),
         ("INVESTMENT FIRM - OWNER", "Invest"), ("FINANCIAL INSTITUTION - OWNER", "Bank"), ("NON PROFIT - OWNER", "Nonprofit")]
for x in rd("snf_all_owners.csv.gz", "latin-1"):
    role = x["ROLE CODE - OWNER"].strip()
    if role == "72": continue
    ccn = enr2ccn.get(x["ENROLLMENT ID"].strip())
    if ccn not in hidx: continue
    oid = x["ASSOCIATE ID - OWNER"].strip()
    if oid not in oidx:
        if x["TYPE - OWNER"] == "I":
            name = " ".join(p for p in [x["FIRST NAME - OWNER"], x["MIDDLE NAME - OWNER"], x["LAST NAME - OWNER"]] if p.strip()).title()
        else:
            name = x["ORGANIZATION NAME - OWNER"].strip()
            name = name.title() if name.isupper() else name
        fl = ",".join(f for c, f in FLAGS if x.get(c, "") == "Y")
        oidx[oid] = len(owners)
        owners.append([oid, name, x["TYPE - OWNER"], x["CITY - OWNER"].strip().title(), x["STATE - OWNER"].strip(), fl])
    o = oidx[oid]; hi = hidx[ccn]
    key = (hi, o, role)
    if key in seen: continue
    seen.add(key)
    pct = num(x["PERCENTAGE OWNERSHIP"])
    d = dt(x["ASSOCIATION DATE - OWNER"])
    links.append([hi, o, int(role), round(pct, 2) if pct else 0, d.year if d else 0])
print("owners", len(owners), "links", len(links))

# ---------- activity (ownership changes) ----------
acts = []
for x in rd("snf_chow.csv.gz", "latin-1"):
    d = dt(x["EFFECTIVE DATE"])
    if not d: continue
    ccn = x["CCN - BUYER"].strip()
    acts.append([d.isoformat(), hidx.get(ccn, -1), x["ENROLLMENT STATE - BUYER"].strip(),
                 (x["DOING BUSINESS AS NAME - BUYER"] or x["ORGANIZATION NAME - BUYER"]).strip().title(),
                 x["ORGANIZATION NAME - BUYER"].strip().title(), x["ORGANIZATION NAME - SELLER"].strip().title(),
                 x["CHOW TYPE TEXT"].strip().title()])
acts.sort(key=lambda a: a[0], reverse=True)
print("activity", len(acts))
cut = (datetime.date.today() - datetime.timedelta(days=730)).isoformat()
recent = {a[1] for a in acts if a[0] >= cut and a[1] >= 0}

# ---------- write ----------
HC = ["ccn", "name", "addr", "city", "st", "zip", "lat", "lon", "beds", "res", "stars", "own", "chain", "affil", "legal",
      "chg2", "sff", "abuse", "fines", "nfines", "hprd", "fin", "rp", "hud"]
rows = []
for i, h in enumerate(homes):
    h["chg2"] = 1 if (i in recent or h["chg12"]) else 0
    rows.append([h.get(c) if c != "lat" and c != "lon" else (round(h[c], 4) if h[c] is not None else None) for c in HC])
def w(name, obj):
    s = json.dumps(obj, separators=(",", ":"), ensure_ascii=False)
    open(os.path.join(OUT, name), "w").write(s); print(name, len(s) // 1024, "KB")
w("homes.json", {"cols": HC, "rows": rows})
w("owners.json", owners)
w("links.json", links)
w("activity.json", acts)
w("companies.json", companies)
w("meta.json", {"built": datetime.date.today().isoformat(), "homes": len(homes), "owners": len(owners)})
