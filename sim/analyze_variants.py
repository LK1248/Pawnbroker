"""Compare rule variants A-E:  python sim/analyze_variants.py sim/results/variants.jsonl [...]"""
import json, sys, collections as C, statistics as st
from analyze import load, pct, table

NAMES = {'A': 'A baseline', 'B': 'B two upgrades', 'C': 'C no upgrade in check', 'D': 'D = C + refund', 'E': 'E = C + no upgrade-capture'}


def f1(x):
    return f'{x:.1f}'


def report(games):
    by = C.defaultdict(list)
    for g in games:
        by[g.get('variant', 'A')].append(g)
    vs = sorted(by)
    out = []
    head = ['Metric'] + [f'{NAMES.get(v, v)} ({len(by[v])})' for v in vs]
    rows = []

    def row(name, fn):
        rows.append([name] + [fn(by[v]) for v in vs])

    # non-pawn pieces (Kings excluded)
    row('Non-pawn pieces, game average (both sides)', lambda G: f1(st.mean([(g['npSum']['w'] + g['npSum']['b']) / g['plies'] for g in G if g['plies']])))
    row('  per side (White / Black)', lambda G: f"{st.mean([g['npSum']['w']/g['plies'] for g in G if g['plies']]):.1f} / {st.mean([g['npSum']['b']/g['plies'] for g in G if g['plies']]):.1f}")
    for ply in ('20', '40', '60', '80', '100'):
        row(f'  at ply {ply} (both; games still running)', lambda G, p=ply: (lambda L: f"{st.mean(L):.1f} (n={len(L)})" if L else '-')(
            [g['np'][p]['w'] + g['np'][p]['b'] for g in G if p in g['np']]))
    # lifespan
    def life(G):
        U = [u for g in G for u in g['ups']]
        cap = [u['life'] for u in U if u['life'] is not None]
        return U, cap
    row('Upgrades per game', lambda G: f1(len(life(G)[0]) / len(G)))
    row('Upgraded piece captured before game end', lambda G: pct(len(life(G)[1]), len(life(G)[0])))
    row('  captured within 2 plies (share of all upgrades)', lambda G: pct(sum(1 for x in life(G)[1] if x <= 2), len(life(G)[0])))
    row('  median plies to capture (captured ones)', lambda G: (lambda c: f'{st.median(c):.0f}' if c else '-')(life(G)[1]))
    row('Turns starting in check', lambda G: f1(sum(g['checkTurns'] for g in G) / len(G)) + ' / game')
    row('  answered with an upgrade', lambda G: pct(sum(g['checkUpTurns'] for g in G), sum(g['checkTurns'] for g in G)))
    row('  ...where the upgraded piece took the checker', lambda G: pct(sum(g['checkUpTakesChecker'] for g in G), sum(g['checkTurns'] for g in G)))
    # results
    row('Median plies (mean)', lambda G: f"{st.median([g['plies'] for g in G]):.0f} ({st.mean([g['plies'] for g in G]):.0f})")
    row('Decisive (mate)', lambda G: pct(sum(1 for g in G if g['result'] == 'mate'), len(G)))
    row('  White / Black mates', lambda G: f"{sum(1 for g in G if g['winner'] == 'w')} / {sum(1 for g in G if g['winner'] == 'b')}")
    row('  White score', lambda G: pct(sum(1 if g['winner'] == 'w' else 0.5 if not g['winner'] else 0 for g in G), len(G)))
    row('50-move / stalemate / cap', lambda G: ' / '.join(str(sum(1 for g in G if g['result'] == r)) for r in ('fifty', 'stalemate', 'cap')))
    # mix
    def mix(G):
        U = [u for g in G for u in g['ups']]
        c = C.Counter(u['to'] for u in U); n = len(U) or 1
        return ' / '.join(f"{100*c[t]/n:.0f}" for t in 'NBRQ')
    row('Upgrade mix N / B / R / Q (%)', mix)
    row('Direct from pawn vs stepwise', lambda G: (lambda U: f"{pct(sum(1 for u in U if u['from']=='P'), len(U))} / {pct(sum(1 for u in U if u['from']!='P'), len(U))}")([u for g in G for u in g['ups']]))
    row('Checking upgrades per game', lambda G: f1(sum(1 for g in G for u in g['ups'] if u['check']) / len(G)))
    row('Banked points at ply 60 / 100 (median per side)', lambda G: ' / '.join(
        (lambda L: f'{st.median(L):.0f}' if L else '-')([x for g in G for (p, w, b) in g['pts'] if p == ply for x in (w, b)]) for ply in (60, 100)))
    row('Double-upgrade turns per game (B)', lambda G: f1(sum(g.get('doubleTurns', 0) for g in G) / len(G)))
    row('  share of upgrade turns that were double', lambda G: pct(sum(g.get('doubleTurns', 0) for g in G),
        sum(1 for g in G for u in g['ups'] if not u.get('second'))))
    row('  mates on a double turn / within 2 plies of one', lambda G: f"{sum(g.get('doubleMates',0) for g in G)} / {sum(g.get('mateAfterDouble',0) for g in G)}")
    row('  material swing on double turns: mean / max / share >= 8', lambda G: (lambda S: f"{st.mean(S):.1f} / {max(S)} / {pct(sum(1 for x in S if x >= 8), len(S))}" if S else '-')(
        [x for g in G for x in g.get('swings', [])]))
    row('Refunds per game (D): count / points', lambda G: f"{sum(g.get('refunds',0) for g in G)/len(G):.1f} / {sum(g.get('refundPts',0) for g in G)/len(G):.1f}")
    row('Stalemates undone by a refund (D)', lambda G: str(sum(g.get('refundUndidStalemate', 0) for g in G)))
    row('E only: games ended by the capture ban (mate / stalemate)', lambda G: (lambda L: f"{sum(1 for x in L if x['check'])} / {sum(1 for x in L if not x['check'])}")(
        [g['eNoTurn'] for g in G if g.get('eNoTurn')]))
    row('Anomalies', lambda G: (lambda a: ', '.join(f'{k} {v}' for k, v in a.items()) or 'none')(C.Counter(a['kind'] for g in G for a in g['anomalies'])))
    out.append(table(head, rows))
    return '\n'.join(out)


if __name__ == '__main__':
    games = load(sys.argv[1:])
    for prof in sorted({g['white'] for g in games}):
        G = [g for g in games if g['white'] == prof]
        print(f'#### Profile {prof}\n')
        print(report(G))
        print()
