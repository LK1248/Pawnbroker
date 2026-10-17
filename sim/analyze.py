"""Summarise self-play results:  python sim/analyze.py sim/results/games.jsonl [more.jsonl ...]"""
import json, sys, collections as C, statistics as st


def load(paths):
    g = []
    for p in paths:
        for line in open(p, encoding='utf-8', errors='replace'):
            if line.strip():
                try:
                    g.append(json.loads(line))
                except ValueError:
                    print(f'skipping a corrupt line in {p}', file=sys.stderr)
    return g


def pct(a, b):
    return f'{100*a/b:.1f}%' if b else '-'


def table(head, rows):
    out = ['| ' + ' | '.join(head) + ' |', '|' + '|'.join('---' for _ in head) + '|']
    out += ['| ' + ' | '.join(str(x) for x in r) + ' |' for r in rows]
    return '\n'.join(out)


def summary(games, title):
    n = len(games)
    out = [f'### {title} ({n} games)', '']
    res = C.Counter(g['result'] for g in games)
    wins = C.Counter(g['winner'] for g in games if g['result'] == 'mate')
    rows = [[k, v, pct(v, n)] for k, v in res.most_common()]
    out += [table(['Result', 'Games', 'Share'], rows), '']
    out.append(f"Mates won by White {wins['w']}, by Black {wins['b']}. ")
    # adjudicate unfinished games by material + points/2
    adj = C.Counter()
    for g in games:
        if g['result'] in ('cap', 'fifty'):
            f = g['final']; d = f['matW'] - f['matB']
            adj['W ahead' if d >= 3 else 'B ahead' if d <= -3 else 'level'] += 1
    if adj:
        out.append(f"Unfinished (cap/fifty) by material at the end: {dict(adj)}. ")
    L = [g['plies'] for g in games]
    ml = [g['plies'] for g in games if g['result'] == 'mate']
    out.append(f"Length in plies: median {st.median(L)}, mean {st.mean(L):.0f}, min {min(L)}, max {max(L)}; mates median {st.median(ml) if ml else '-'}.")
    out.append('')
    ups = [u for g in games for u in g['ups']]
    nu = len(ups)
    kinds = C.Counter(f"{u['from']}→{u['to']}" for u in ups)
    rows = [[k, v, pct(v, nu), f"{st.median([u['ply'] for u in ups if u['from'] + '→' + u['to'] == k]):.0f}"] for k, v in kinds.most_common()]
    out += [f'Upgrades bought: {nu} ({nu/n:.1f} per game).', '', table(['Upgrade', 'Count', 'Share', 'Median ply'], rows), '']
    direct = sum(1 for u in ups if u['from'] == 'P'); step = nu - direct
    chk = [u for u in ups if u['check']]; nonchk = [u for u in ups if not u['check']]
    out.append(f"Direct (from a pawn) {direct} vs stepwise (from a minor/Rook) {step}. ")
    out.append(f"Checking upgrades (turn ends, no move): {len(chk)} = {pct(len(chk), nu)} of upgrades, {len(chk)/n:.1f} per game; "
               f"{sum(1 for u in chk if u['mate'])} of them delivered mate. ")
    out.append(f"Capture on the move right after a non-checking upgrade: {sum(1 for u in nonchk if u['capNext'])}/{len(nonchk)} = {pct(sum(1 for u in nonchk if u['capNext']), len(nonchk))}; "
               f"the upgraded piece itself moved in {pct(sum(1 for u in nonchk if u['ownPiece']), len(nonchk))}.")
    ms = [max(g['maxCheckStreak'].values()) for g in games]
    out.append(f"Longest run of consecutive checking upgrades by one side: median {st.median(ms)}, max {max(ms)}; games with a run of 3+: {sum(1 for m in ms if m >= 3)}.")
    out.append('')
    # timing buckets
    bk = C.Counter(); bkq = C.Counter()
    for u in ups:
        b = min(u['ply'] // 20 * 20, 120)
        bk[b] += 1
        if u['to'] == 'Q': bkq[b] += 1
    rows = [[f"{b}-{b+19}" if b < 120 else '120+', bk[b], bkq[b]] for b in sorted(bk)]
    out += [table(['Ply', 'Upgrades', 'of which to Queen'], rows), '']
    # Queens
    qb = sum(1 for u in ups if u['to'] == 'Q')
    proms = [p for g in games for p in g['promos']]
    qp = sum(1 for p in proms if p['to'] == 'Q')
    fq = [g['firstQ'] for g in games if g['firstQ'] is not None]
    out.append(f"Queens: {qb} bought, {qp} by free promotion ({len(proms)} promotions total, {len(proms)/n:.2f} per game). "
               f"Games with any Queen: {len(fq)} ({pct(len(fq), n)}); first Queen at median ply {st.median(fq) if fq else '-'}.")
    out.append(f"Promotions by pawns that started on the back row are not tracked separately; promotion median ply {st.median([p['ply'] for p in proms]) if proms else '-'}.")
    # points
    out.append('')
    rows = []
    for ply in (10, 20, 40, 60, 100, 150, 200, 300):
        vals = [x for g in games for (p, w, b) in g['pts'] if p == ply for x in (w, b)]
        if vals:
            rows.append([ply, len(vals)//2, f'{st.median(vals):.0f}', f'{st.mean(vals):.1f}', max(vals)])
    out += [table(['Ply', 'Games still running', 'Median banked pts (per side)', 'Mean', 'Max'], rows), '']
    fin = [x for g in games for x in g['final']['points'].values()]
    out.append(f"Points banked at game end: median {st.median(fin)}, max {max(fin)}.")
    cas = [c for g in games for c in g['castles']]
    out.append(f"Castling: {len(cas)} times in {sum(1 for g in games if g['castles'])} games ({C.Counter(c['side'] for c in cas)}). ")
    esc = sum(len(g['upgradeEscapes']) for g in games); dod = sum(len(g['stalemateDodges']) for g in games)
    out.append(f"Turns where the side to move was in check with no legal move and survived only by upgrading: {esc}. Turns with no legal move, not in check, saved by an upgrade: {dod}.")
    cap = [c for g in games for c in g['captures'].values()]
    out.append(f"Captures per side per game: mean {st.mean(cap):.1f}.")
    b100 = [g['block100'] for g in games if g.get('block100')]
    if b100:
        out.append(f"At ply 100: pawns left per side mean {st.mean([b['wTot']+b['bTot'] for b in b100])/2:.1f}, of which blocked (no pawn move) {st.mean([b['w']+b['b'] for b in b100])/2:.1f}.")
    an = C.Counter(a['kind'] for g in games for a in g['anomalies'])
    out.append(f"Anomalies: {dict(an) if an else 'none'}.")
    out.append('')
    return '\n'.join(out)


import re
SQ = lambda q: ('abcdefgh'.index(q[0]), int(q[1]))
UPCAP = re.compile(r'^↑(\w\d) (\w)→(\w) · \w?(\w\d)x(\w\d)')


def extras(games):
    out = ['### Matchups (score = wins + half draws, from the first-named profile\'s side, both colours pooled)', '']
    sc = C.defaultdict(lambda: [0, 0.0])
    for g in games:
        a, b = g['white'], g['black']
        w = 1 if g['winner'] == 'w' else 0 if g['winner'] == 'b' else 0.5
        if a == b:
            continue
        key = tuple(sorted((a, b)))
        sc[key][0] += 1
        sc[key][1] += w if a == key[0] else 1 - w
    rows = [[f'{k[0]} vs {k[1]}', n, f'{v:.1f}', pct(v, n)] for k, (n, v) in sorted(sc.items())]
    out += [table(['Pairing', 'Games', f'Score of first', 'Share'], rows), '']
    mirror = [g for g in games if g['white'] == g['black']]
    ws = sum(1 if g['winner'] == 'w' else 0.5 if g['winner'] is None else 0 for g in mirror)
    out.append(f"White's score in mirror games: {ws:.1f}/{len(mirror)} = {pct(ws, len(mirror))}.")
    # upgrade-then-capture with the same piece: distance and immediate recapture
    dist = C.Counter(); recap = 0; tot = 0; ex = None
    for g in games:
        L = g['log']
        for i, t in enumerate(L):
            m = UPCAP.match(t)
            if not m or m.group(1) != m.group(4):
                continue
            a, b = SQ(m.group(4)), SQ(m.group(5))
            d = max(abs(a[0]-b[0]), abs(a[1]-b[1]))
            dist[min(d, 5)] += 1; tot += 1
            nxt = L[i+1] if i+1 < len(L) else ''
            if 'x' + m.group(5) in nxt:
                recap += 1
            if d >= 6 and ex is None:
                ex = (g['id'], g['seed'], i+1, t)
    out.append(f"Upgrade-then-capture by the upgraded piece: {tot} ({tot/len(games):.1f} per game). Capture distance: "
               + ', '.join(f"{'5+' if k == 5 else k}: {v}" for k, v in sorted(dist.items()))
               + f". Upgraded piece taken back on the very next ply: {pct(recap, tot)}.")
    if ex:
        out.append(f"Example long snipe: game {ex[0]} (seed {ex[1]}), ply {ex[2]}: `{ex[3]}`.")
    mates = [g for g in games if g['result'] == 'mate']
    upm = sum(1 for g in mates if g['log'][-1].startswith('↑') and '·' not in g['log'][-1])
    out.append(f"Mates delivered by a checking upgrade alone: {upm}/{len(mates)}.")
    spent = sum(u['cost'] for g in games for u in g['ups'])
    unspent = sum(sum(g['final']['points'].values()) for g in games)
    out.append(f"Points: {spent} spent on upgrades vs {unspent} left unspent at game end ({pct(unspent, spent+unspent)} never used).")
    allpawn = sum(1 for g in games if g.get('block100') and g['block100']['wTot'] + g['block100']['bTot'] == 0)
    out.append(f"Games with no pawns at all left by ply 100: {allpawn}/{sum(1 for g in games if g.get('block100'))}.")
    out.append('')
    return '\n'.join(out)


if __name__ == '__main__':
    games = load(sys.argv[1:])
    print(summary(games, 'All'))
    by = C.defaultdict(list)
    for g in games:
        by[(g['white'], g['black'])].append(g)
    rows = []
    for (w, b), gs in sorted(by.items()):
        r = C.Counter((g['result'], g['winner']) for g in gs)
        rows.append([w, b, len(gs), r[('mate', 'w')], r[('mate', 'b')], len(gs) - r[('mate', 'w')] - r[('mate', 'b')],
                     f"{st.mean([len(g['ups']) for g in gs]):.1f}", f"{st.median([g['plies'] for g in gs])}"])
    print(table(['White', 'Black', 'Games', 'W mates', 'B mates', 'Other', 'Upgrades/game', 'Median plies'], rows))
    print()
    print(extras(games))
    for prof in sorted({g['white'] for g in games}):
        mg = [g for g in games if g['white'] == prof and g['black'] == prof]
        if mg:
            print(summary(mg, f'Mirror: {prof} vs {prof}'))
