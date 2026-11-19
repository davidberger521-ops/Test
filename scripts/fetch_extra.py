import os, re, io, csv, gzip, zipfile, urllib.request, shutil, json
OUT="data"; UA={"User-Agent":"Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/120 Safari/537.36"}
log=[]
def get(u,t=900): return urllib.request.urlopen(urllib.request.Request(u,headers=UA),timeout=t)
# HUD active multifamily insured mortgages (includes Section 232 nursing homes)
for page in ["https://www.hud.gov/hud-partners/multifamily-fhasl-active","https://www.hud.gov/program_offices/housing/comp/mf_fhasl_active"]:
    try:
        html=get(page).read().decode("utf-8","ignore")
        links=re.findall(r'href="([^"]+\.xlsx?)"',html,re.I)
        log.append(f"HUDLINKS {page} {links}")
        for l in links:
            if l.upper().endswith("-RM-A.XLSX") or "active" in l.lower():
                u=l if l.startswith("http") else "https://www.hud.gov"+l
                data=get(u).read(); open(f"{OUT}/hud_mf_active.xlsx","wb").write(data); log.append(f"OK hud {u} {len(data)}"); break
        if os.path.exists(f"{OUT}/hud_mf_active.xlsx"): break
    except Exception as e: log.append(f"FAIL hud {page} {e}")
# HCRIS SNF raw: keep RPT + related-party (A-8-1) + key worksheet lines
for fy in []:
    u=f"https://downloads.cms.gov/FILES/HCRIS/SNF10FY{fy}.ZIP"
    try:
        tmp=f"/tmp/snf{fy}.zip"
        with get(u) as r, open(tmp,"wb") as f: shutil.copyfileobj(r,f,1<<20)
        z=zipfile.ZipFile(tmp); names=z.namelist(); log.append(f"ZIP {fy} {names}")
        for n in names:
            nl=n.lower()
            if "_rpt." in nl and "alpha" not in nl and "nmrc" not in nl:
                with z.open(n) as src, gzip.open(f"{OUT}/hcris{fy}_rpt.csv.gz","wb") as dst: shutil.copyfileobj(src,dst)
            elif "nmrc" in nl:
                with z.open(n) as src, gzip.open(f"{OUT}/hcris{fy}_a81_nmrc.csv.gz","wt") as dst:
                    for line in io.TextIOWrapper(src,encoding="latin-1"):
                        if ",A810001," in line or ",A810002," in line: dst.write(line)
            elif "alpha" in nl:
                with z.open(n) as src, gzip.open(f"{OUT}/hcris{fy}_a81_alpha.csv.gz","wt") as dst:
                    for line in io.TextIOWrapper(src,encoding="latin-1"):
                        if ",A810001," in line or ",A810002," in line or ",S200001," in line: dst.write(line)
        log.append(f"OK hcris {fy}")
    except Exception as e: log.append(f"FAIL hcris {fy} {e}")
open(f"{OUT}/fetch_extra_log.txt","w").write("\n".join(log)); print("\n".join(log))
