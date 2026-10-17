# Pawnbroker self-play report

I ran 2,695 computer-vs-computer games under the current rules: the 2-point fee, 2 points for a capture and 1 for any other turn. A further 400 games tested two rule changes, run only inside the simulation. `pawnbroker.html` and `README.md` were not touched.

## How it was run

- **Engine.** `sim/run.html` reads the `<script id="engine">` block from `pawnbroker.html` at load time and runs it unchanged inside Web Workers, together with `sim/harness.js`. Every game is advanced with the engine's own `doUpgrade` and `doMove`, and only the search uses light board copies. The page ran in the built-in browser with 19 parallel workers, served by `sim/server.py` on 127.0.0.1:8733, which also saves each game to `sim/results/*.jsonl`.
- **AI.** A one-move search over every option: every plain move, every checking upgrade, and each non-checking upgrade followed by either a move of the upgraded piece or one of the four best plain moves. Each candidate is scored against the opponent's best tactical reply: a capture (with a rough check for recapture), a promotion, a check, a checking upgrade, or an upgrade followed by a capture. Quiet replies count as the opponent simply banking a point. Mates and stalemates are detected at both levels. The evaluation counts material, banked points times a weight `wp`, piece mobility, pawn advancement, and a mop-up term for the endgame. A random noise of up to 0.25 per candidate varies the games. The move cap is 300 plies.
- **Profiles.** They differ only in how much a banked point is worth:

| Profile | Point weight | Notes |
|---|---|---|
| spend | 0.5 | buys anything that's break-even |
| mid | 0.65 | baseline |
| save | 0.8 | |
| hoard | 1.0 | |
| miser | 1.25 | |
| rush | 0.65 | pawn-advancement bonus ×3, tests rushing for free promotion |
| nochk | 0.65 | never uses checking upgrades |
| noup | 0.65 | never upgrades |

- **Analysis.** `python sim/analyze.py sim/results/games.jsonl sim/results/games2.jsonl` regenerates every table below. The saved summaries are in `sim/results/summary*.md`.

## Headline stats (2,695 games, all profiles)

| Result | Games | Share |
|---|---|---|
| Checkmate | 2,145 | 79.6% |
| 50-move draw | 420 | 15.6% |
| Stalemate | 78 | 2.9% |
| Move cap (300 plies) | 41 | 1.5% |
| Insufficient material (K vs K) | 11 | 0.4% |
| Threefold repetition | **0** | 0% |

- **Length.** The median game is 118 plies and the median mate 107 (shortest 19, longest 300).
- **Colour split.** Across all games, White delivered 1,017 mates and Black 1,128. In mirror games, where both sides use the same profile, White scored **47.4%** (566.5 of 1,195).
- **Engine integrity.** I checked these after every turn of every game. No engine exceptions occurred. No King was left capturable and none went missing. No game was stuck with no legal turn while unscored. No mate was declared without check, and no stalemate while in check. Every checking upgrade really gave check, and the points ledger always matched `s.points`. **No rule-engine anomalies at all.**

### Upgrades

There were 21.8 upgrades per game: 81% direct from a pawn and 19% stepwise from a minor piece or Rook.

| Upgrade | Count | Share | Median ply |
|---|---|---|---|
| P→B | 24,643 | 42.0% | 31 |
| P→R | 10,796 | 18.4% | 48 |
| P→N | 10,511 | 17.9% | 36 |
| R→Q | 4,351 | 7.4% | 86 |
| B→R | 3,615 | 6.2% | 61 |
| P→Q | 1,738 | 3.0% | 78 |
| N→R | 1,682 | 2.9% | 62 |
| B→Q | 892 | 1.5% | 89 |
| N→Q | 450 | 0.8% | 93 |

| Ply | Upgrades | of which to Queen |
|---|---|---|
| 0–19 | 10,032 | 25 |
| 20–39 | 17,167 | 238 |
| 40–59 | 14,137 | 660 |
| 60–79 | 9,431 | 2,044 |
| 80–99 | 4,982 | 2,492 |
| 100–119 | 2,013 | 1,358 |
| 120+ | 916 | 614 |

- **Queens.** 7,431 were bought and 821 came from free promotion. 94.3% of games had a Queen, and the first appeared at a median ply of 67. Most bought Queens were stepwise (5,693, mostly R→Q) rather than direct P→Q (1,738).
- **Upgrade, then capture.** 75.4% of non-checking upgrades were followed by a capture in the same turn. 70.4% of the time the move was made by the upgraded piece itself.
- **Checking upgrades.** These end the turn with no move. They made up 6.7% of upgrades, about 1.5 per game, and 160 of them delivered mate. The longest run of consecutive checking upgrades by one side was 3, which happened in 3 games.
- **Upgrades as an escape.** 170 times a side was in check with no legal move and survived only by upgrading, a position that would be mate in chess. 16 times a side with no legal move, but not in check, avoided stalemate by upgrading.
- **Castling** happened **2 times in 2,695 games**.
- **Promotion.** There were 0.31 free promotions per game, at a median ply of 85.
- **Captures.** Each side made 12.7 captures per game on average. By ply 100, **48% of games still running had no pawns left at all**. Only 0.2 blocked pawns per side remained, so there were no lock-ups.

### Banked points

| Ply | Games still running | Median per side | Mean | Max |
|---|---|---|---|---|
| 10 | 2,695 | 5 | 3.8 | 6 |
| 20 | 2,694 | 4 | 4.3 | 14 |
| 40 | 2,669 | 4 | 4.9 | 28 |
| 60 | 2,614 | 4 | 5.8 | 40 |
| 100 | 1,836 | 8 | 11.7 | 62 |
| 150 | 861 | 32 | 33.0 | 87 |
| 200 | 481 | 55 | 56.8 | 112 |
| 300 | 41 | 109 | 109.0 | 161 |

281k points were spent on upgrades, and 153k (**35%**) were still unspent when games ended.

### Matchups

Colours were alternated, so each pairing pools both colours.

| Pairing | Games | Score of the first |
|---|---|---|
| save vs spend | 200 | **88.8%** |
| mid vs spend | 200 | **84.0%** |
| mid vs save | 200 | **27.5%** (save wins) |
| hoard vs save | 200 | **67.5%** |
| miser vs save | 200 | 54.8% (47% of games undecided) |
| mid vs rush | 200 | 64.5% (rushing loses) |
| mid vs nochk | 200 | 47.5% (checking upgrades add nothing) |
| mid vs noup | 100 | 90.5% (upgrades are essential) |

Mirror results:

| Mirror | Games | White mates | Black mates | Other | Upgrades per game | Median plies |
|---|---|---|---|---|---|---|
| spend | 200 | 81 | 80 | 39 | 28.6 | 128 |
| mid | 595 | 221 | 262 | 112 | 23.4 | 114 |
| save | 200 | 65 | 86 | 49 | 21.1 | 126 |
| hoard | 200 | 68 | 69 | 63 | 17.6 | 158 |

## Issues found, ranked by impact

### Engine and API bugs

These don't affect the current UI, but they block remote play.

**1. `doMove` trusts the caller's move flags and skips basic checks (high, for remote play and a computer opponent).**
`doMove` only checks that the destination square appears in `legalMoves`. It then plays the caller's own `mv` object, including the `promo`, `ep`, `castle` and `double` flags. I checked each of these in the engine:

- `{fr:e4, tr:f5, ep:true}`, a normal pawn capture of a Knight on f5 with a fake en passant flag, removed **both** the Knight and a Queen on f4, and was logged as `e4xf5 e.p.`.
- A King move f1→g1 with a fake `castle:'K'` teleported the h1 pawn to f1.
- `promo:true` with `promo='K'` gave White **a second King** (logged `h7-h8=K`). Leaving `promo` out leaves a pawn stranded on the last rank, unable to move.
- `double:true` on a single step set a bogus en passant square of `[3.5, 0]`.
- `doMove` doesn't check `s.turn`. On White's turn it played Black's `a7-a6`, logged it as White's move and passed the turn.
- `doMove` doesn't check `s.result`, so moves are still accepted after the game is over.

The local UI is safe because it always passes objects from `legalMoves` and offers only Q, R, B and N. A remote peer or a bot could send any of these.
*Fix:* find the matching move in `legalMoves(s, fr, fc)` and use that object, reject a move unless the piece's colour equals `s.turn` and `!s.result`, and require `promo ∈ {Q, R, B, N}` exactly when the move promotes.

### Balance and degenerate patterns

**2. Upgrades work as instant ranged strikes, not development (high).**
75% of non-checking upgrades were followed by a capture in the same turn, 70% by the newly upgraded piece. That is 12.2 "upgrade then snipe" turns per game, and 5+ squares away in 4,805 cases. Among hoarders it's 95%: the best players upgrade almost only to capture at once. The upgraded piece was taken back on the very next ply only 40% of the time. Because every piece is a pawn, any opened line turns a back-row pawn into a gun.
*Example:* game 10002 (seed 100002, mid vs mid): `1.b4 f5 2.b5 g5 3.a4 d5 4.a5 c5 5.↑a1 P→B · Ba1xh8 ↑d8 P→B · Bd8xa5`. The long diagonal opened after b2 and g7 moved, so on ply 9 the a1 corner pawn became a Bishop and took h8. Black answered the same way.
*What-if (sim only), "an upgraded piece may not capture on the turn it's upgraded":* in 200 mid mirror games, P→B fell from 42% to 22% of upgrades, P→R rose to 47%, and checking upgrades doubled to 12% (2.3 per game). White scored 50.8%, and only 22.7% of points went unspent. Captures still followed 47% of upgrades, made by other pieces. One side effect: in 16 games the side in check could only escape by upgrading and capturing with the new piece, which this rule would turn into checkmate. Those positions show up as "aborted" in that batch.

**3. Hoarding beats spending, and points pile up with nothing to buy (high).**
Win rates climb with the value placed on a banked point: spend < mid < save < hoard. save beats spend 88.8%, hoard beats save 67.5%, and miser (1.25) still edges save at 54.8% but draws almost half its games. The fee does reward saving. But the saving isn't spent on big direct Queens (P→Q is only 3% of upgrades). Instead, a big bank works as a standing threat: it lets you snipe whenever a line opens (issue 2) and buy out of "mate" (issue 5). Overall 35% of all points earned were never spent. Hoarders ended games with a median of 50 points.
Late in the game the economy dies. In 48% of games still running at ply 100 every pawn is gone. Once the remaining pieces are Queens nothing is left to buy, yet points keep rising: the median bank is 55 by ply 200 and the record was 161.
*Example:* game 1654 (seed 51654) reached the move cap with Black on two Queens and **161 unspent points** against White's bare King, which held 111 points it couldn't use.
*What-if, `FEE=0`:* the fee is doing something. Without it, P→R jumps to 62% of upgrades, games are shorter (median 81 plies against 114), and only 71% of games see a Queen instead of 94%. Keep the fee. The problem is the unlimited, idle bank.

**4. Slight Black advantage (medium; needs a stronger AI to confirm).**
White scored 47.4% over 1,195 mirror games, about 1.8 standard errors below 50%. The mid mirror alone went 221–262 in mates. The likely cause is tempo in the sniping race: White can afford its first upgrade a ply earlier, and in mirror games White upgraded first 460 times out of 600. Those first upgrades mostly open lines that Black's reply upgrade-capture exploits: when White upgraded first, Black won 192 games to White's 170. With the no-capture-after-upgrade what-if, White went back up to 50.8%.

**5. "Checkmate" can be bought off (low to medium; rules clarity).**
170 times a side was in check with no legal move and escaped by upgrading a pawn so it could take the checker. 16 more times an upgrade avoided stalemate. This matches the README ("no legal move and no legal upgrade"), but it means mate depends on the defender's bank, which players will find surprising.
*Example:* game 80 (seed 50080), ply 18. White's `Re2xe5+` leaves Black's King on e8 boxed in by its own pawns, which would be mate in chess. Black played `↑g7 P→B · Bg7xe5`, and White replied with the same trick, `↑b2 P→B · Bb2xe5`.
There's a related edge: while in check, an escaping upgrade is banned entirely if the new piece would also give check. "Can't give check while in check" applies before the move that would escape. So the bank sometimes saves the King and sometimes, on a technicality, doesn't.
*Example of a mate by checking upgrade alone:* game 1165 ends `↑h1 P→R#`, a corner pawn becoming a Rook on an open h-file.

**6. Castling is effectively dead (low).**
There were 2 castles in 2,695 games. Partly that's the AI, which has no king-safety term. But the rule is costly: the f1 and g1 pawns must both leave, then the h1 pawn must be upgraded in place for 6 points, and by then the lines are open anyway.

**7. Threefold repetition can never trigger (low).**
`posKey` includes both point totals. Between two identical boards there can be no capture and no upgrade, since piece types only go up. So at least one side banks a point every turn and no position ever repeats. It happened 0 times. A perpetual check is therefore not a draw, and only the 50-move rule ends shuffling. That may be fine, but the rule as written is dead code.

**8. Checked and not a problem.**
- **Endless checking upgrades:** the longest run was 3 consecutive. nochk vs mid was about even, so checking upgrades don't dominate.
- **Rushing pawns to free promotion:** the rush profile loses 64.5–35.5, and there are only 0.31 promotions per game. Pawns get sniped long before they promote, so free promotion doesn't bypass the points economy.
- **Board lock-ups:** at ply 100 there were 0.2 blocked pawns per side. Pawn walls get dissolved.
- **Insufficient material:** the K-vs-K-only rule fired 11 times, all genuine K vs K.

## Suggested rule tweaks

In priority order:

1. **Engine:** harden `doMove` as described in issue 1, before any remote play or bot work.
2. **Curb the instant snipe (issue 2).** Some options:
   - (a) An upgraded piece can't capture on the turn it's upgraded. This is tested in the sim, gives a better mix and balanced colours, and creates more checking upgrades and more mates.
   - (b) Upgrading takes the whole turn: no move afterwards.
   - (c) Only allow upgrades on pieces that are not attacking an enemy piece.

   Option (a) is the smallest change.
3. **Cap or use up the bank (issue 3).** Options include a maximum bank of about 12 points, so a Queen is still reachable but a war chest isn't. Another is a late-game sink, such as spending points to place a pawn on your own second row. Or the 50-move rule could score the game by banked points instead of calling a draw. Any of these keeps points meaningful once the pawns are gone.
4. **Clarify buy-off mates (issue 5).** Either keep them and say so in the UI ("you are in check, an upgrade can save you"), or allow an escaping upgrade even when the new piece gives check, as long as a move follows. Ending the turn early would be dropped in that one case.
5. **Repetition (issue 7).** Either drop the point totals from `posKey` so perpetual check draws, or remove the rule from the README.
6. **Colour balance (issue 4).** Re-measure after tweak 2 and with a stronger AI before compensating, for example by giving White one starting point.
7. **Castling (issue 6).** Either allow castling with the unmoved corner pawn itself (it becomes a Rook on f1 or d1), or drop the rule.

## Rule variants: do upgraded pieces survive longer?

This tests the "tall poppy" suspicion: upgraded pieces are captured almost at once, often because a player in check upgrades a piece to take the checker, so games settle at 2–3 non-pawn pieces. Four variants were run with the same AI, the same settings and the **same seeds**:

- **A, baseline:** the current rules.
- **B, two upgrades per turn:** on two different pieces. Each upgrade keeps the current legality rules, and a checking upgrade still ends the turn.
- **C, no upgrades while in check:** a King in check at the start of the turn must be answered with a move.
- **D, C plus a refund:** points spent on a piece (fee included, added up over stepwise upgrades; free promotion counts as 0) are tracked. When that piece is captured, its owner immediately gets half back, rounded down.
- **E, C plus no upgrade-capture:** no upgrades while in check, and a piece upgraded this turn may not capture this turn (tweak 2a above), for both sides. Other pieces may still capture after an upgrade.

The variants are applied at runtime in `sim/harness.js`. C and D wrap the engine's `upgradeOptions`, so the engine's own mate and stalemate detection follows the rule. B lifts the one-upgrade flag for a second `doUpgrade`. D credits refunds after `doMove` and re-checks a stalemate the refund might undo, which never happened. E's capture ban is enforced by the harness (the AI's turn generation and reply search), not the engine. The engine's `hasLegalTurn` still counts a banned upgrade-capture as legal, so when that is a side's only turn, the harness scores it as E would: mate if in check, stalemate otherwise. **No position became mate (or stalemate) only because of the capture ban: 0 of 500 games.** That's expected, since under C a side in check can't upgrade at all, so it can never need an upgrade-capture to escape. `pawnbroker.html` is untouched. The AI searches double upgrades in B, knows about refunds in D, and models neither side upgrading while in check in C and D.

Two player profiles were used:
- **mid** (point weight 0.65, 300 games per variant): spends as soon as it can and rarely banks more than about 6 points.
- **hoard** (point weight 1.0, 200 games per variant): the strongest profile in the baseline, banking 8–20 points mid-game.

In total there were 2,500 games, with no engine or harness anomalies in any variant.

**Engine versions.** A–D and the first E batch (`variants_e.jsonl`) ran on the engine at commit 60fe2af, with C applied by the harness wrapper. E was then re-run on commit 946a678, which builds rule C into `upgradeOptions` and makes `doMove` strict (explicit promotion piece, engine-owned move flags). That run is `variants_e_946a678.jsonl`. All 500 E games came out move for move identical to the first run, and 40 C games (mid seeds 300000–300019, hoard 400000–400019) re-run on 946a678 also matched the saved C games exactly. So the A/C/E comparison isn't affected by the engine change. A can no longer be run on 946a678 without patching rule C back out.

| Metric | A mid | B mid | C mid | D mid | E mid | A hoard | B hoard | C hoard | D hoard | E hoard |
|---|---|---|---|---|---|---|---|---|---|---|
| Non-pawn pieces on board, game average (both sides) | 3.2 | 3.2 | 2.8 | 2.5 | **3.3** | 2.1 | 2.1 | 2.1 | 2.0 | 0.0 |
|   per side (White / Black) | 1.6 / 1.6 | 1.6 / 1.6 | 1.5 / 1.4 | 1.4 / 1.2 | 1.6 / 1.7 | 1.1 / 1.0 | 1.1 / 1.0 | 1.1 / 1.0 | 1.1 / 0.9 | 0.0 / 0.0 |
|   at ply 20 | 2.3 | 2.3 | 2.2 | 2.3 | 2.2 | 0.6 | 0.6 | **1.9** | 2.1 | 0.0 |
|   at ply 40 | 3.5 | 3.5 | 3.2 | 3.8 | 3.9 | 2.1 | 2.3 | **2.9** | 2.9 | 0.0 |
|   at ply 60 | 4.3 | 4.3 | 3.8 | 3.9 | **4.8** | 2.8 | 3.0 | 3.3 | 2.3 | 0.1 |
|   at ply 80 | 4.4 | 4.4 | 4.0 | 2.9 | **4.9** | 2.8 | 3.0 | 3.0 | 1.9 | 0.0 |
|   at ply 100 | 4.0 | 4.0 | 3.8 | 1.9 | **4.6** | 2.7 | 2.6 | 2.8 | 1.8 | 0.0 |
| Upgrades per game | 23.4 | 23.4 | 20.3 | 19.4 | 17.7 | 17.4 | 18.1 | 14.1 | 18.5 | **0.3** |
| Upgraded piece captured within 2 plies (share of all upgrades) | 19.4% | 19.5% | 15.5% | 21.1% | **2.2%** | 41.7% | 33.4% | **20.5%** | 38.7% | 0.0% |
| Median plies from upgrade to capture (captured ones) | 7 | 7 | 7 | 5 | **11** | **1** | 3 | **5** | 3 | 5 |
| Upgraded piece captured before the game ends | 75% | 75% | 74% | 80% | 66% | 83% | 81% | 75% | 88% | 45% |
| Checks answered by an upgrade | 18.2% | 18.5% | 0% | 0% | 0% | 9.8% | 11.3% | 0% | 0% | 0% |
|   ...with the new piece taking the checker | 3.8% | 3.9% | 0% | 0% | 0% | 6.3% | 7.7% | 0% | 0% | 0% |
| Median game length in plies (mean) | 113 (131) | 114 (131) | 105 (115) | **75 (84)** | 92 (99) | 173 (174) | 136 (148) | **98 (119)** | 103 (117) | 166 (163) |
| Decisive (mate) | 80.7% | 80.3% | 86.0% | 87.0% | 92.3% | 57.0% | 66.0% | **83.5%** | 79.0% | **5.5%** |
| White / Black mates | 121 / 121 | 120 / 121 | 140 / 118 | 145 / 116 | 125 / 152 | 64 / 50 | 72 / 60 | 90 / 77 | 94 / 64 | 7 / 4 |
| White score | 50.0% | 49.8% | 53.7% | 54.8% | **45.5%** | 53.5% | 53.0% | 53.2% | **57.5%** | 50.8% |
| 50-move / stalemate / cap | 48 / 7 / 3 | 50 / 6 / 3 | 38 / 3 / 0 | 16 / 6 / 0 | 22 / 0 / 0 | 72 / 8 / 4 | 57 / 6 / 4 | 23 / 4 / 6 | 26 / 11 / 1 | 189 / 0 / 0 |
| Upgrade mix N / B / R / Q (%) | 15/38/34/14 | 15/38/34/14 | 12/39/34/15 | 9/33/36/22 | 9/21/54/16 | 26/40/19/15 | 22/39/25/14 | 18/42/26/14 | 16/51/19/14 | 9/9/7/75 |
| Direct from pawn / stepwise (%) | 78 / 22 | 78 / 22 | 81 / 19 | 85 / 15 | 81 / 19 | 92 / 8 | 90 / 10 | 90 / 10 | 93 / 7 | 100 / 0 |
| Median banked points per side at ply 60 / 100 | 4 / 6 | 4 / 6 | 4 / 7 | 6 / 27 | 4 / 6 | 8 / 20 | 6 / 17 | 6 / 20 | 16 / 37 | 30 / 50 |
| Refunds per game: count / points (D) |  |  |  | 13.7 / 42 |  |  |  |  | 15.3 / 39 |  |
| B only: double-upgrade turns per game |  | 0.0 |  |  |  |  | 2.0 (12.6% of upgrade turns) |  |  |  |
| B only: mates on a double turn / within 2 plies of one |  | 1 / 1 |  |  |  |  | **42 / 47** of 132 mates |  |  |  |
| B only: material swing on a double turn, mean / max / share ≥ 8 |  | 13 (one turn) |  |  |  |  | 9.5 / 19 / 63% |  |  |  |
| E only: games ended by the capture ban (mate / stalemate) | | | | | 0 / 0 | | | | | 0 / 0 |

These A columns use different seeds and AI settings from the baseline section above, though A mid matches the earlier mid-vs-mid games closely. Piece counts at a given ply cover only games still running at that ply. The full per-profile tables are in `sim/results/summary_variants.md` (A–D) and `sim/results/summary_variants_e.md` (A, C, E).

### What the numbers say

- **The suspected mechanism is real but small.** In A, 18% of checks are answered with an upgrade (mid), but only 4–6% of checks end with the upgraded piece taking the checker. Those pieces don't die faster than others: under A mid, 15% of upgrades made while in check were captured within 2 plies, against 20% of other upgrades. The general pattern of upgrade, capture, recapture (issue 2 above) is what keeps the piece count at 2–4, and no variant changes that average much. Example of the pattern under A: seed 300004, plies 61–63, `↑g1 P→B · Be3xc5+`, `↑a7 P→B · Ba7xc5`, `Bg1xc5+`. Black upgrades out of check and takes the checker, and the new Bishop is taken at once.
- **B (two upgrades) barely changes anything for players who spend as they go.** mid made one double turn in 300 games, and 263 of the first 292 B games were move-for-move identical to A. For savers B is a burst weapon: 32% of hoard mates (42 of 132) were delivered on a double-upgrade turn, and double turns swung material by 9.5 on average. Example: hoard seed 400182, B, White mates on ply 29 with `↑d3 P→Q · ↑e2 P→R · Qd3xf5#`, spending 16 points in one turn. The same seed under A lasts 129 plies. B also doesn't keep pieces alive: average count 2.1, the same as A.
- **C (no upgrades in check) is the only variant that lengthens piece life** for players who bank points. With hoard, captures within 2 plies halve (41.7% → 20.5%), median life rises from 1 to 5 plies, and there are more pieces early (1.9 vs 0.6 at ply 20, 2.9 vs 2.1 at ply 40). Games are much shorter (median 98 plies vs 173) and far more decisive (83.5% vs 57%). With mid players the effect is neutral or slightly negative: the average falls from 3.2 to 2.8 because games are shorter and there are fewer upgrades. C removes "buy your way out of mate" (issue 5) and turns checks into real threats. The cost is a mild White edge (53–54%).
- **E (C plus no upgrade-capture) is the first variant to raise the piece count, but only for players who spend.** With mid, instant deaths almost vanish (19.4% → 2.2% within 2 plies), median life rises from 7 to 11 plies, and the piece count rises to 4.6–4.9 from ply 60 to ply 100, against 4.0–4.4 in A and 3.8–4.0 in C. Games are shorter (median 92) and the most decisive of any variant (92%). Rooks become the main buy (54% of upgrades), since a piece now has to earn its cost over later turns. Two warnings. First, Black scores 54.5% with mid, the largest colour swing measured here, in the opposite direction from C. Second, **hoard stops buying entirely**: 0.3 upgrades per game, 0 pieces on board, 5.5% decisive, and 189 of 200 games end by the 50-move rule with locked pawn walls and banks of 50+ points. The hoard result is partly an AI artifact. With point weight 1.0 and a one-move search, an upgrade scores −2 (the fee) unless the new piece captures at once, and E forbids that, so the AI never sees a reason to buy. Still, it points at a real risk: under E the only payback for an upgrade is in later turns, so anyone who values points close to face value has little reason to spend.
- **D (C plus refund) backfires.** Refunds make losing an upgraded piece cheaper, so pieces are traded faster: 39% die within 2 plies with hoard, and late counts collapse to about 1.9 by ply 100. Banks swell (27–37 points by ply 100), and White's edge is the largest of any variant (55–57.5%). D does give the shortest games (median 75 with mid), but by speeding up the trading, not by keeping pieces on the board.

### Recommendation

**Stay with C (now in the engine). Don't adopt E yet, and don't adopt B or D. E is the best candidate yet for longer piece life, but its hoard problem has to be fixed first.** Under E, players who spend get more and longer-lived pieces and decisive games, which is what the variant test was looking for. But a player who saves (and any player who values points near face value) has no short-term reason to buy, and games stall. Before adopting E, re-run it with a lower fee (for example `FEE=1` or 0 via the `patch` argument of `startBatch`), so that an upgrade no longer loses value on the turn it's bought. Re-measure Black's 54.5% edge under mid at the same time. C on its own still stands: it removes the buy-off escape, keeps checks meaningful, roughly halves instant deaths for players who save, and makes games shorter and more decisive. Also watch White's edge under C (about 53–54%); if it holds up with a stronger AI, a small compensation for Black would be worth testing.

## Limitations

- The AI is shallow, a one-move search plus tactical replies. It has no king safety, and it sometimes fails to convert big advantages. Game 1654 couldn't mate with two Queens in 300 plies. So the 50-move and cap draw rates (17%) are overstated, and castling is understated.
- Win rates compare AI profiles, not human strategies. The trends are clear, but the exact percentages depend on this evaluation.
- What-if batches (`whatif_fee0.jsonl`, `whatif_noupcap.jsonl`) patch only the sim's copy of the engine. They contain harness aborts: 29 in FEE=0, where my cheap-upgrade shortcut assumed a minimum cost of 4, and 16 in noUpCap, explained under issue 2. The aborted games are still counted in those batches' stats, so read them as indicative only.
- Five games of the second batch were lost to interleaved file appends. The server now locks its writes. In the variant run, 30 records still arrived split even with the lock. They were re-run on the same seeds after the server started reading the full body and refusing bodies that are not valid JSON, and the page now retries. The damaged raw file is kept as `variants_raw_damaged.jsonl`.

## Files

- `sim/harness.js`: AI, game runner, invariant checks
- `sim/run.html`: loads the engine from `pawnbroker.html` and drives the workers
- `sim/server.py`: static server plus result saving
- `sim/analyze.py`: the tables in this report
- `sim/analyze_variants.py`: the variant comparison (`python sim/analyze_variants.py sim/results/variants_ok.jsonl sim/results/variants2.jsonl sim/results/variants_e.jsonl`)
- `sim/results/games.jsonl` (1,700 games), `games2.jsonl` (995 games), `whatif_*.jsonl`, `variants_ok.jsonl` and `variants2.jsonl` (2,000 variant games), `variants_e.jsonl` and `variants_e_946a678.jsonl` (500 E games each, identical, on the old and new engine), `pilot.jsonl`, `summary*.md`. Each record includes the full move log, so any game can be replayed.

To reproduce, run `python sim/server.py`, open `http://127.0.0.1:8733/sim/run.html`, and call `startBatch(jobs, 'name.jsonl')` from the console.
