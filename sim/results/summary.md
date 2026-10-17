### All (1700 games)

| Result | Games | Share |
|---|---|---|
| mate | 1424 | 83.8% |
| fifty | 224 | 13.2% |
| stalemate | 34 | 2.0% |
| cap | 14 | 0.8% |
| material | 4 | 0.2% |

Mates won by White 676, by Black 748. 
Unfinished (cap/fifty) by material at the end: {'W ahead': 85, 'B ahead': 66, 'level': 87}. 
Length in plies: median 109.0, mean 126, min 19, max 300; mates median 103.5.

Upgrades bought: 38113 (22.4 per game).

| Upgrade | Count | Share | Median ply |
|---|---|---|---|
| P→B | 16111 | 42.3% | 31 |
| P→R | 6819 | 17.9% | 47 |
| P→N | 6411 | 16.8% | 35 |
| R→Q | 3106 | 8.1% | 86 |
| B→R | 2754 | 7.2% | 61 |
| N→R | 1259 | 3.3% | 62 |
| P→Q | 878 | 2.3% | 79 |
| B→Q | 540 | 1.4% | 88 |
| N→Q | 235 | 0.6% | 91 |

Direct (from a pawn) 30219 vs stepwise (from a minor/Rook) 7894. 
Checking upgrades (turn ends, no move): 2389 = 6.3% of upgrades, 1.4 per game; 83 of them delivered mate. 
Capture on the move right after a non-checking upgrade: 25734/35724 = 72.0%; the upgraded piece itself moved in 65.8%.
Longest run of consecutive checking upgrades by one side: median 1.0, max 2; games with a run of 3+: 0.

| Ply | Upgrades | of which to Queen |
|---|---|---|
| 0-19 | 6790 | 25 |
| 20-39 | 11181 | 103 |
| 40-59 | 9146 | 375 |
| 60-79 | 6175 | 1372 |
| 80-99 | 3241 | 1704 |
| 100-119 | 1215 | 872 |
| 120+ | 365 | 308 |

Queens: 4759 bought, 448 by free promotion (457 promotions total, 0.27 per game). Games with any Queen: 1595 (93.8%); first Queen at median ply 68.
Promotions by pawns that started on the back row are not tracked separately; promotion median ply 78.

| Ply | Games still running | Median banked pts (per side) | Mean | Max |
|---|---|---|---|---|
| 10 | 1700 | 5 | 3.5 | 6 |
| 20 | 1699 | 4 | 3.8 | 14 |
| 40 | 1681 | 3 | 4.1 | 28 |
| 60 | 1640 | 4 | 4.8 | 40 |
| 100 | 1069 | 6 | 8.8 | 62 |
| 150 | 430 | 29 | 28.0 | 87 |
| 200 | 229 | 52 | 51.7 | 112 |
| 300 | 14 | 104 | 104.1 | 161 |

Points banked at game end: median 13.0, max 161.
Castling: 2 times in 2 games (Counter({'Q': 1, 'K': 1})). 
Turns where the side to move was in check with no legal move and survived only by upgrading: 111. Turns with no legal move, not in check, saved by an upgrade: 11.
Captures per side per game: mean 12.7.
At ply 100: pawns left per side mean 0.3, of which blocked (no pawn move) 0.1.
Anomalies: none.

| White | Black | Games | W mates | B mates | Other | Upgrades/game | Median plies |
|---|---|---|---|---|---|---|---|
| mid | mid | 200 | 65 | 95 | 40 | 23.3 | 113.0 |
| mid | nochk | 100 | 42 | 44 | 14 | 23.3 | 116.5 |
| mid | noup | 50 | 41 | 0 | 9 | 13.7 | 99.0 |
| mid | rush | 100 | 53 | 33 | 14 | 22.8 | 110.0 |
| mid | save | 100 | 20 | 70 | 10 | 20.9 | 110.5 |
| mid | spend | 100 | 78 | 10 | 12 | 23.4 | 104.5 |
| nochk | mid | 100 | 43 | 35 | 22 | 23.2 | 116.0 |
| noup | mid | 50 | 1 | 41 | 8 | 13.3 | 93.0 |
| rush | mid | 100 | 26 | 64 | 10 | 22.3 | 102.0 |
| save | mid | 100 | 60 | 20 | 20 | 21.6 | 117.5 |
| save | save | 200 | 65 | 86 | 49 | 21.1 | 126.0 |
| save | spend | 100 | 83 | 6 | 11 | 20.3 | 95.5 |
| spend | mid | 100 | 10 | 78 | 12 | 23.9 | 104.0 |
| spend | save | 100 | 8 | 86 | 6 | 20.1 | 90.0 |
| spend | spend | 200 | 81 | 80 | 39 | 28.6 | 127.5 |

### Matchups (score = wins + half draws, from the first-named profile's side, both colours pooled)

| Pairing | Games | Score of first | Share |
|---|---|---|---|
| mid vs nochk | 200 | 95.0 | 47.5% |
| mid vs noup | 100 | 90.5 | 90.5% |
| mid vs rush | 200 | 129.0 | 64.5% |
| mid vs save | 200 | 55.0 | 27.5% |
| mid vs spend | 200 | 168.0 | 84.0% |
| save vs spend | 200 | 177.5 | 88.8% |

White's score in mirror games: 275.0/600 = 45.8%.
Upgrade-then-capture by the upgraded piece: 19416 (11.4 per game). Capture distance: 1: 1902, 2: 7739, 3: 3945, 4: 2807, 5+: 3023. Upgraded piece taken back on the very next ply: 36.9%.
Example long snipe: game 0 (seed 50000), ply 53: `↑a2 P→R · Ra2xa8`.
Mates delivered by a checking upgrade alone: 83/1424.
Points: 180670 spent on upgrades vs 76221 left unspent at game end (29.7% never used).
Games with no pawns at all left by ply 100: 650/1069.

### Mirror: mid vs mid (200 games)

| Result | Games | Share |
|---|---|---|
| mate | 160 | 80.0% |
| fifty | 34 | 17.0% |
| stalemate | 3 | 1.5% |
| cap | 2 | 1.0% |
| material | 1 | 0.5% |

Mates won by White 65, by Black 95. 
Unfinished (cap/fifty) by material at the end: {'W ahead': 16, 'B ahead': 7, 'level': 13}. 
Length in plies: median 113.0, mean 132, min 19, max 300; mates median 104.5.

Upgrades bought: 4666 (23.3 per game).

| Upgrade | Count | Share | Median ply |
|---|---|---|---|
| P→B | 1841 | 39.5% | 32 |
| P→R | 1101 | 23.6% | 48 |
| P→N | 712 | 15.3% | 35 |
| R→Q | 521 | 11.2% | 83 |
| B→R | 277 | 5.9% | 56 |
| N→R | 115 | 2.5% | 64 |
| B→Q | 63 | 1.4% | 103 |
| N→Q | 34 | 0.7% | 94 |
| P→Q | 2 | 0.0% | 89 |

Direct (from a pawn) 3656 vs stepwise (from a minor/Rook) 1010. 
Checking upgrades (turn ends, no move): 260 = 5.6% of upgrades, 1.3 per game; 8 of them delivered mate. 
Capture on the move right after a non-checking upgrade: 3103/4406 = 70.4%; the upgraded piece itself moved in 68.4%.
Longest run of consecutive checking upgrades by one side: median 1.0, max 1; games with a run of 3+: 0.

| Ply | Upgrades | of which to Queen |
|---|---|---|
| 0-19 | 825 | 0 |
| 20-39 | 1331 | 10 |
| 40-59 | 1110 | 37 |
| 60-79 | 793 | 194 |
| 80-99 | 423 | 225 |
| 100-119 | 157 | 130 |
| 120+ | 27 | 24 |

Queens: 620 bought, 31 by free promotion (32 promotions total, 0.16 per game). Games with any Queen: 189 (94.5%); first Queen at median ply 69.
Promotions by pawns that started on the back row are not tracked separately; promotion median ply 82.5.

| Ply | Games still running | Median banked pts (per side) | Mean | Max |
|---|---|---|---|---|
| 10 | 200 | 5 | 3.8 | 6 |
| 20 | 199 | 4 | 3.5 | 6 |
| 40 | 198 | 3 | 3.4 | 7 |
| 60 | 192 | 4 | 3.5 | 8 |
| 100 | 131 | 5 | 7.0 | 29 |
| 150 | 57 | 26 | 26.1 | 44 |
| 200 | 40 | 50 | 50.2 | 70 |
| 300 | 2 | 98 | 98.2 | 104 |

Points banked at game end: median 12.0, max 104.
Castling: 0 times in 0 games (Counter()). 
Turns where the side to move was in check with no legal move and survived only by upgrading: 6. Turns with no legal move, not in check, saved by an upgrade: 0.
Captures per side per game: mean 13.0.
At ply 100: pawns left per side mean 0.1, of which blocked (no pawn move) 0.0.
Anomalies: none.

### Mirror: save vs save (200 games)

| Result | Games | Share |
|---|---|---|
| mate | 151 | 75.5% |
| fifty | 41 | 20.5% |
| cap | 6 | 3.0% |
| stalemate | 2 | 1.0% |

Mates won by White 65, by Black 86. 
Unfinished (cap/fifty) by material at the end: {'B ahead': 14, 'W ahead': 20, 'level': 13}. 
Length in plies: median 126.0, mean 147, min 53, max 300; mates median 110.

Upgrades bought: 4228 (21.1 per game).

| Upgrade | Count | Share | Median ply |
|---|---|---|---|
| P→B | 1712 | 40.5% | 29 |
| P→R | 928 | 21.9% | 45 |
| P→N | 695 | 16.4% | 32 |
| P→Q | 361 | 8.5% | 81 |
| B→R | 145 | 3.4% | 58 |
| B→Q | 141 | 3.3% | 77 |
| R→Q | 139 | 3.3% | 82 |
| N→R | 64 | 1.5% | 54 |
| N→Q | 43 | 1.0% | 84 |

Direct (from a pawn) 3696 vs stepwise (from a minor/Rook) 532. 
Checking upgrades (turn ends, no move): 410 = 9.7% of upgrades, 2.0 per game; 10 of them delivered mate. 
Capture on the move right after a non-checking upgrade: 3184/3818 = 83.4%; the upgraded piece itself moved in 77.9%.
Longest run of consecutive checking upgrades by one side: median 1.0, max 2; games with a run of 3+: 0.

| Ply | Upgrades | of which to Queen |
|---|---|---|
| 0-19 | 818 | 2 |
| 20-39 | 1278 | 29 |
| 40-59 | 994 | 88 |
| 60-79 | 630 | 205 |
| 80-99 | 342 | 226 |
| 100-119 | 109 | 83 |
| 120+ | 57 | 51 |

Queens: 684 bought, 53 by free promotion (53 promotions total, 0.27 per game). Games with any Queen: 199 (99.5%); first Queen at median ply 61.
Promotions by pawns that started on the back row are not tracked separately; promotion median ply 86.

| Ply | Games still running | Median banked pts (per side) | Mean | Max |
|---|---|---|---|---|
| 10 | 200 | 5 | 4.3 | 6 |
| 20 | 200 | 4 | 3.8 | 9 |
| 40 | 200 | 4 | 4.0 | 10 |
| 60 | 199 | 4 | 4.7 | 12 |
| 100 | 148 | 9 | 9.6 | 31 |
| 150 | 77 | 30 | 30.2 | 50 |
| 200 | 50 | 53 | 53.1 | 70 |
| 300 | 6 | 105 | 102.8 | 112 |

Points banked at game end: median 21.5, max 112.
Castling: 0 times in 0 games (Counter()). 
Turns where the side to move was in check with no legal move and survived only by upgrading: 3. Turns with no legal move, not in check, saved by an upgrade: 1.
Captures per side per game: mean 13.1.
At ply 100: pawns left per side mean 0.5, of which blocked (no pawn move) 0.1.
Anomalies: none.

### Mirror: spend vs spend (200 games)

| Result | Games | Share |
|---|---|---|
| mate | 161 | 80.5% |
| fifty | 36 | 18.0% |
| stalemate | 2 | 1.0% |
| cap | 1 | 0.5% |

Mates won by White 81, by Black 80. 
Unfinished (cap/fifty) by material at the end: {'level': 14, 'B ahead': 12, 'W ahead': 11}. 
Length in plies: median 127.5, mean 143, min 32, max 300; mates median 117.

Upgrades bought: 5710 (28.6 per game).

| Upgrade | Count | Share | Median ply |
|---|---|---|---|
| P→B | 2876 | 50.4% | 33 |
| P→N | 1123 | 19.7% | 41 |
| B→R | 752 | 13.2% | 72 |
| R→Q | 486 | 8.5% | 98 |
| N→R | 378 | 6.6% | 72 |
| P→R | 78 | 1.4% | 70 |
| B→Q | 16 | 0.3% | 90 |
| N→Q | 1 | 0.0% | 98 |

Direct (from a pawn) 4077 vs stepwise (from a minor/Rook) 1633. 
Checking upgrades (turn ends, no move): 270 = 4.7% of upgrades, 1.4 per game; 6 of them delivered mate. 
Capture on the move right after a non-checking upgrade: 3590/5440 = 66.0%; the upgraded piece itself moved in 52.2%.
Longest run of consecutive checking upgrades by one side: median 1.0, max 1; games with a run of 3+: 0.

| Ply | Upgrades | of which to Queen |
|---|---|---|
| 0-19 | 856 | 0 |
| 20-39 | 1496 | 0 |
| 40-59 | 1325 | 3 |
| 60-79 | 1045 | 60 |
| 80-99 | 629 | 213 |
| 100-119 | 263 | 154 |
| 120+ | 96 | 73 |

Queens: 503 bought, 54 by free promotion (54 promotions total, 0.27 per game). Games with any Queen: 190 (95.0%); first Queen at median ply 81.0.
Promotions by pawns that started on the back row are not tracked separately; promotion median ply 77.0.

| Ply | Games still running | Median banked pts (per side) | Mean | Max |
|---|---|---|---|---|
| 10 | 200 | 2 | 1.7 | 5 |
| 20 | 200 | 4 | 3.5 | 5 |
| 40 | 199 | 3 | 2.9 | 5 |
| 60 | 197 | 3 | 3.0 | 7 |
| 100 | 161 | 4 | 5.8 | 24 |
| 150 | 74 | 26 | 24.1 | 49 |
| 200 | 38 | 50 | 48.9 | 72 |
| 300 | 1 | 110 | 109.5 | 114 |

Points banked at game end: median 15.0, max 114.
Castling: 0 times in 0 games (Counter()). 
Turns where the side to move was in check with no legal move and survived only by upgrading: 2. Turns with no legal move, not in check, saved by an upgrade: 0.
Captures per side per game: mean 13.1.
At ply 100: pawns left per side mean 0.1, of which blocked (no pawn move) 0.0.
Anomalies: none.

