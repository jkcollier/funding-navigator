
from docx import Document
from docx.document import Document as _Document
from docx.oxml.table import CT_Tbl
from docx.oxml.text.paragraph import CT_P
from docx.table import Table
from docx.text.paragraph import Paragraph
import re, unicodedata, difflib, json, os, csv, argparse

def iter_block_items(parent):
    parent_elm = parent.element.body if isinstance(parent, _Document) else parent._tc
    for child in parent_elm.iterchildren():
        if isinstance(child, CT_P):
            yield Paragraph(child, parent)
        elif isinstance(child, CT_Tbl):
            yield Table(child, parent)

def norm(s):
    s=s.lower()
    s=s.replace('–','-').replace('—','-').replace('‑','-')
    s=unicodedata.normalize('NFKD', s)
    s=''.join(ch for ch in s if not unicodedata.combining(ch))
    s=s.replace('gesundheit/krankheit','gesundheit krankheit')
    s=s.replace('&',' und ')
    s=re.sub(r'[^a-z0-9]+','',s)
    return s

postal_re=re.compile(r'\b(?:CH-)?\d{4}\s+[A-ZÄÖÜa-zäöü][^,\n]*')
email_re=re.compile(r'[\w.\-+]+@[\w.\-]+\.\w+')
web_re=re.compile(r'(?:https?://|www\.)[^\s,;]+|\b[a-z0-9.-]+\.(?:ch|org|com|net|info|edu|biz)(?:/[^\s,;]*)?', re.I)
phone_re=re.compile(r'(?<!\d)(?:0\d{2,3}[\s./]?\d{2,3}[\s./]?\d{2}[\s./]?\d{2}(?:/\d{2})?)(?!\d)')
labels={"ZIELGRUPPE","GESUCHSTELLENDE","EINREICHUNGSTERMIN","BEILAGEN","EMPFANGSSTELLE","AUSGELASTET"}

manual_map={
    norm('Bürgschafts- und Darlehensgenossenschaft der Evanglisch-reformierten Landeskirche des Kantons Zürich'): 'Bürgschafts- und Darlehensgenossenschaft',
    norm('Luiza Penha Walter-Renteiro-Stiftung für die Jugend des Bezirks Meilen'): 'Luiza Penha Walter-Renteiro-Stiftung – Bezirk Meilen',
    norm('Migros-Genossenschafts-Bund – Direktion Kultur und Soziales'): 'Migros-Genossenschafts-Bund',
    norm('Schweizerische Lungenstiftung'): 'Schweiz. Lungenstiftung',
    norm('Schweiz. Stiftung für blindentechnische Hilfsmittel'): 'Schweiz. Stiftung für blindentechn. Hilfsmittel',
    norm('Schweiz. Stiftung für die Förderung und Unterstützung von Berufsmusikerinnen und Berufsmusiker'): 'Schweiz. Stiftung für Berufsmusiker/innen',
    norm('Schweiz. Stiftung für die Hilfe an Straffällige und ihre Familien'): 'Schweiz. Stiftung für die Hilfe an Straffälligen',
    norm('Schweizerische Stiftung für Kinder und Jugendliche in Not'): 'Schweiz. Stiftung für Kinder und Jugendliche in Not',
    norm('Schweiz. Studienstiftung - Fonds für begabte junge Menschen'): 'Schweiz. Studienstift. – Fonds f. begabte j. Menschen',
    norm('Schweiz. Verband alleinerziehender Mütter und Väter SVAMV'): 'Schweiz. Verband alleinerziehender Mütter und Väter',
    norm('Stiftung für die Adliswiler Jugend'): 'Sekretariat Stiftung für die Adliswiler Jugend',
    norm('Stiftung «Alterswohnungen Probstei» Zürich-Schwamendingen'): 'Stiftung «Alterswohnungen Probstei»',
    norm('Stiftung Solidaritätsfonds für ausländische Studierende der ETHZ und UZH'): 'Stiftung Solidaritätsfonds für ausl. Studierende',
    norm('Stiftung CEREBRAL'): 'Schweiz. Stiftung für das cerebral gelähmte Kind',
    norm('Züricher Spendenparlament'): 'Spendenparlament Zürich',
    norm('Dora-Grob-Reinhart Stiftung'): 'Dora-Grob-Reinhart-Stiftung',
    norm('Age-Stiftung'): 'AGE-Stiftung',
    norm('Fondation Oertli-Stiftung'): 'Fondation  Oertli-Stiftung',
    norm('Frieda Locher-Hofmann-Stiftung'): 'Frieda  Locher-Hofmann-Stiftung',
    norm('Für die Kinder - Für die Zukunft'): 'Für die Kinder – Für die Zukunft',
    norm('Gemeinnützige Gesellschaft der Bezirke Zürich und Dietikon'): 'Gemeinnützige Gesellschaft der Bezirke Zürich/ Dietikon',
    norm('Gemeinnützige Gesellschaft des Bezirkes Meilen'): 'Gemeinnützige Gesellschaft des Bezirks Meilen',
    norm('Gemeinnützige Gesellschaft des Bezirks Hinwil (GGBH)'): 'Gemeinnützige Gesellschaft des Bezirks Hinwil',
    norm('Georg und Bertha Schwyzer-Winiker-Stiftung'): 'Georg und Bertha Schwyzer- Winiker-Stiftung',
    norm('Geschwister Mäder-Stiftung'): 'Geschwister  Mäder-Stiftung',
    norm('HANS JEGEN STIFTUNG'): 'Hans Jegen Stiftung',
    norm('Kaspar Spoerry-Stiftung'): 'Kaspar Spoerry Stiftung',
    norm('Moritz und Elsa von Kuffner-Stiftung'): 'Moriz und Elsa von Kuffner-Stiftung',
    norm('Reka Stiftung Ferienhilfe'): 'Reka Stiftung Ferienhilfe',
    norm('Stiftung Stiefel-Zangger'): 'Stiftung  Stiefel-Zangger',
    norm('Zürcher Stiftung für psychisch Kranke'): 'Zürcher Stiftung für psychisch Gesundheit/Krankheit',
}

false_headers = {
    'Für Gesuche konsultieren Sie bitte unsere Webseite.',
    'Einzelfallhilfe und Projektförderung im Altersbereich (Personen 65+)',
    'Einmalige Beiträge an ausserordentliche gemeinnützige und wohltätige bzw. kulturelle Projekte mit mindestens regionaler Ausstrahlung, für die keine gesetzlichen Ansprüche geltend gemacht werden können. Einzelpersonen werden nicht berücksichtigt.',
    'Die BüDa gewährt Darlehen insbesondere für',
    'Fachorganisation für Altersfragen, Bearbeitung von Altersfragen, Grundlagen- und Entwicklungsarbeit, Träger verschiedener Dienste auf kantonaler, regionaler und kommunaler Ebene. Angebote kantonal:',
}

def looks_like_header(c0, c1):
    if c0 != c1 or not c0:
        return False
    lines=[x.strip() for x in c0.split('\n') if x.strip()]
    if len(lines) < 2:
        return False
    second = lines[1]
    return bool(postal_re.search(second) or email_re.search(second) or web_re.search(second) or phone_re.search(second))

def split_list(text):
    if not text:
        return []
    t=text.replace('\n',' ')
    parts=re.split(r'\s*[,;]\s*|\s{2,}', t)
    return [p.strip(' .') for p in parts if p.strip(' .')]

def parse_contact(raw):
    raw=raw.strip()
    out={'contact_raw':raw,'phone_numbers':[],'emails':[],'websites':[],'postal_code':None,'city':None,'address':None}
    if not raw:
        return out
    out['emails']=list(dict.fromkeys(email_re.findall(raw)))
    websites=[]
    for m in web_re.findall(raw):
        mm=m.strip().rstrip('.)')
        if email_re.fullmatch(mm):
            continue
        websites.append(mm)
    out['websites']=list(dict.fromkeys(websites))
    out['phone_numbers']=list(dict.fromkeys(re.sub(r'\s+',' ',m.strip()) for m in phone_re.findall(raw)))
    m=postal_re.search(raw)
    if m:
        mm=re.match(r'(?:CH-)?(\d{4})\s+(.+)', m.group(0))
        if mm:
            out['postal_code']=mm.group(1)
            out['city']=mm.group(2).strip()
    cleaned=raw
    for token in out['emails'] + out['websites'] + out['phone_numbers']:
        cleaned=cleaned.replace(token, '')
    cleaned=re.sub(r'\s+,', ',', cleaned)
    cleaned=re.sub(r',\s*,', ',', cleaned)
    cleaned=re.sub(r'\s{2,}',' ', cleaned).strip(' ,;')
    out['address']=cleaned or None
    return out

def slugify(name):
    s=unicodedata.normalize('NFKD', name)
    s=''.join(ch for ch in s if not unicodedata.combining(ch))
    s=s.lower().replace('–','-').replace('—','-')
    s=re.sub(r'[^a-z0-9]+','-',s).strip('-')
    return s[:90]

def derive_flags(target_group, applicants):
    tg=(target_group or '').lower()
    flags={
        'youth_family': bool(re.search(r'jugend|famil|kinder|kind\b|mutter|väter|vater|alleinerzieh|student|studierende', tg)),
        'elderly': bool(re.search(r'ältere|betagt|alter|65\+|senior|alters', tg)),
        'disability': bool(re.search(r'behinder|blind|seh|cerebral|invalid|handicap', tg)),
        'health': bool(re.search(r'krank|gesund|aids|lungen|pflege|therap|psychisch|medizin', tg)),
        'migration': bool(re.search(r'migration|asyl|ausländer|auslandschweizer|de-nationalität|muslim', tg)),
        'education': bool(re.search(r'ausbildung|stud|stipend|schule|hochschule|universität|universitaet|eth|lehre|weiterbildung|beruf', tg)),
        'poverty': bool(re.search(r'armut|bedürftig|not|engpass|bedrängnis', tg)),
        'individuals': 'privatpersonen' in (applicants or '').lower(),
        'institutions': 'institutionen' in (applicants or '').lower() or 'organisationen' in (applicants or '').lower(),
        'exhausted': False,
    }
    return flags

def write_csv(path, rows, fieldnames):
    with open(path,'w',newline='',encoding='utf-8') as f:
        w=csv.DictWriter(f, fieldnames=fieldnames)
        w.writeheader()
        for r in rows:
            w.writerow({k:r.get(k) for k in fieldnames})

def main():
    ap=argparse.ArgumentParser()
    ap.add_argument('input_docx')
    ap.add_argument('output_dir')
    args=ap.parse_args()
    os.makedirs(args.output_dir, exist_ok=True)

    doc=Document(args.input_docx)
    blocks=list(iter_block_items(doc))

    overview_idxs=[282,286,288,291,293,295,297,299]
    overview_rows=[]
    for idx in overview_idxs:
        t=blocks[idx]
        for row in t.rows:
            if len(row.cells) < 2:
                continue
            name=row.cells[0].text.strip()
            page=row.cells[1].text.strip()
            if name and page.isdigit():
                overview_rows.append({'name':name,'page':int(page)})

    overview_names=[r['name'] for r in overview_rows]
    ov_map={norm(n):n for n in overview_names}
    page_by_name={r['name']:r['page'] for r in overview_rows}

    def map_name(raw_first):
        n=norm(raw_first)
        if n in ov_map:
            return ov_map[n]
        if n in manual_map:
            return manual_map[n]
        close=difflib.get_close_matches(n, ov_map.keys(), n=1, cutoff=0.9)
        return ov_map[close[0]] if close else None

    org_blocks=[b for i,b in enumerate(blocks) if isinstance(b,Table) and i>=302 and i<766]
    flat=[(row.cells[0].text.strip(), row.cells[1].text.strip() if len(row.cells)>1 else '') for b in org_blocks for row in b.rows]

    entries=[]
    current=None
    for c0,c1 in flat:
        first=c0.split('\n',1)[0].strip()
        mapped=map_name(first)
        if looks_like_header(c0,c1) and first not in false_headers and mapped:
            if current:
                entries.append(current)
            lines=[x.strip() for x in c0.split('\n') if x.strip()]
            current={'name_raw':first,'name':mapped,'contact_raw':' '.join(lines[1:]),'description':'','fields':{}}
            continue
        if current is None:
            continue
        key=c0.strip()
        if key in labels:
            current['fields'][key]=c1.strip()
        elif key:
            current['description']=(current['description']+'\n'+key).strip()
    if current:
        entries.append(current)

    best={}
    for e in entries:
        k=norm(e['name'])
        if k not in best or len(json.dumps(e,ensure_ascii=False)) > len(json.dumps(best[k],ensure_ascii=False)):
            best[k]=e
    entries=list(best.values())

    present={e['name'] for e in entries}
    for row in overview_rows:
        if row['name'] not in present:
            entries.append({'name_raw':row['name'],'name':row['name'],'contact_raw':'','description':'','fields':{},'parse_warning':'overview_row_only'})

    org_rows=[]
    overview_out=[]
    for e in sorted(entries, key=lambda x:(page_by_name.get(x['name'],999), x['name'])):
        c=parse_contact(e.get('contact_raw',''))
        fields=e.get('fields',{})
        org_id=slugify(e['name'])
        org_rows.append({
            'org_id':org_id,
            'name':e['name'],
            'page_start':page_by_name.get(e['name']),
            'description':e.get('description') or None,
            'contact_raw':e.get('contact_raw') or None,
            'address':c['address'],
            'postal_code':c['postal_code'],
            'city':c['city'],
            'phone_numbers_jsonb':json.dumps(c['phone_numbers'], ensure_ascii=False),
            'emails_jsonb':json.dumps(c['emails'], ensure_ascii=False),
            'websites_jsonb':json.dumps(c['websites'], ensure_ascii=False),
            'target_group_raw':fields.get('ZIELGRUPPE'),
            'applicants_raw':fields.get('GESUCHSTELLENDE'),
            'submission_deadline_raw':fields.get('EINREICHUNGSTERMIN'),
            'submission_address_raw':fields.get('EMPFANGSSTELLE'),
            'attachments_raw':fields.get('BEILAGEN'),
            'raw_sections_jsonb':json.dumps(fields, ensure_ascii=False),
            'parse_warning':e.get('parse_warning'),
            'source_file':os.path.basename(args.input_docx)
        })
        flags=derive_flags(fields.get('ZIELGRUPPE'), fields.get('GESUCHSTELLENDE'))
        overview_out.append({'org_id':org_id,'name':e['name'],'page':page_by_name.get(e['name']), **flags, 'derived_from':'detailed_entry','parse_warning':e.get('parse_warning')})

    write_csv(os.path.join(args.output_dir,'organizations.csv'), org_rows, list(org_rows[0].keys()))
    write_csv(os.path.join(args.output_dir,'overview_derived.csv'), overview_out, ['org_id','name','page','youth_family','elderly','disability','health','migration','education','poverty','individuals','institutions','exhausted','derived_from','parse_warning'])

if __name__ == '__main__':
    main()
