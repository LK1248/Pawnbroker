### All (2695 games)

| Result | Games | Share |
|---|---|---|
| mate | 2145 | 79.6% |
| fifty | 420 | 15.6% |
| stalemate | 78 | 2.9% |
| cap | 41 | 1.5% |
| material | 11 | 0.4% |

Mates won by White 1017, by Black 1128. 
Unfinished (cap/fifty) by material at the end: {'W ahead': 168, 'B ahead': 140, 'level': 153}. 
Length in plies: median 118, mean 135, min 19, max 300; mates median 107.

Upgrades bought: 58678 (21.8 per game).

| Upgrade | Count | Share | Median ply |
|---|---|---|---|
| P→B | 24643 | 42.0% | 31 |
| P→R | 10796 | 18.4% | 48 |
| P→N | 10511 | 17.9% | 36 |
| R→Q | 4351 | 7.4% | 86 |
| B→R | 3615 | 6.2% | 61 |
| P→Q | 1738 | 3.0% | 78 |
| N→R | 1682 | 2.9% | 62 |
| B→Q | 892 | 1.5% | 89 |
| N→Q | 450 | 0.8% | 93 |

Direct (from a pawn) 47688 vs stepwise (from a minor/Rook) 10990. 
Checking upgrades (turn ends, no move): 3952 = 6.7% of upgrades, 1.5 per game; 160 of them delivered mate. 
Capture on the move right after a non-checking upgrade: 41271/54726 = 75.4%; the upgraded piece itself moved in 70.4%.
Longest run of consecutive checking upgrades by one side: median 1, max 3; games with a run of 3+: 3.

| Ply | Upgrades | of which to Queen |
|---|---|---|
| 0-19 | 10032 | 25 |
| 20-39 | 17167 | 238 |
| 40-59 | 14137 | 660 |
| 60-79 | 9431 | 2044 |
| 80-99 | 4982 | 2492 |
| 100-119 | 2013 | 1358 |
| 120+ | 916 | 614 |

Queens: 7431 bought, 821 by free promotion (833 promotions total, 0.31 per game). Games with any Queen: 2541 (94.3%); first Queen at median ply 67.
Promotions by pawns that started on the back row are not tracked separately; promotion median ply 85.

| Ply | Games still running | Median banked pts (per side) | Mean | Max |
|---|---|---|---|---|
| 10 | 2695 | 5 | 3.8 | 6 |
| 20 | 2694 | 4 | 4.3 | 14 |
| 40 | 2669 | 4 | 4.9 | 28 |
| 60 | 2614 | 4 | 5.8 | 40 |
| 100 | 1836 | 8 | 11.7 | 62 |
| 150 | 861 | 32 | 33.0 | 87 |
| 200 | 481 | 55 | 56.8 | 112 |
| 300 | 41 | 109 | 109.0 | 161 |

Points banked at game end: median 18.0, max 161.
Castling: 2 times in 2 games (Counter({'Q': 1, 'K': 1})). 
Turns where the side to move was in check with no legal move and survived only by upgrading: 170. Turns with no legal move, not in check, saved by an upgrade: 16.
Captures per side per game: mean 12.7.
At ply 100: pawns left per side mean 0.7, of which blocked (no pawn move) 0.2.
Anomalies: none.

| White | Black | Games | W mates | B mates | Other | Upgrades/game | Median plies |
|---|---|---|---|---|---|---|---|
| hoard | hoard | 200 | 68 | 69 | 63 | 17.6 | 158.0 |
| hoard | save | 100 | 46 | 20 | 34 | 19.6 | 151.5 |
| mid | mid | 595 | 221 | 262 | 112 | 23.4 | 114 |
| mid | nochk | 100 | 42 | 44 | 14 | 23.3 | 116.5 |
| mid | noup | 50 | 41 | 0 | 9 | 13.7 | 99.0 |
| mid | rush | 100 | 53 | 33 | 14 | 22.8 | 110.0 |
| mid | save | 100 | 20 | 70 | 10 | 20.9 | 110.5 |
| mid | spend | 100 | 78 | 10 | 12 | 23.4 | 104.5 |
| miser | save | 100 | 29 | 24 | 47 | 19.6 | 160.0 |
| nochk | mid | 100 | 43 | 35 | 22 | 23.2 | 116.0 |
| noup | mid | 50 | 1 | 41 | 8 | 13.3 | 93.0 |
| rush | mid | 100 | 26 | 64 | 10 | 22.3 | 102.0 |
| save | hoard | 100 | 19 | 63 | 18 | 19.4 | 129.5 |
| save | mid | 100 | 60 | 20 | 20 | 21.6 | 117.5 |
| save | miser | 100 | 23 | 37 | 40 | 19.5 | 169.0 |
| save | save | 200 | 65 | 86 | 49 | 21.1 | 126.0 |
| save | spend | 100 | 83 | 6 | 11 | 20.3 | 95.5 |
| spend | mid | 100 | 10 | 78 | 12 | 23.9 | 104.0 |
| spend | save | 100 | 8 | 86 | 6 | 20.1 | 90.0 |
| spend | spend | 200 | 81 | 80 | 39 | 28.6 | 127.5 |

### Matchups (score = wins + half draws, from the first-named profile's side, both colours pooled)

| Pairing | Games | Score of first | Share |
|---|---|---|---|
| hoard vs save | 200 | 135.0 | 67.5% |
| mid vs nochk | 200 | 95.0 | 47.5% |
| mid vs noup | 100 | 90.5 | 90.5% |
| mid vs rush | 200 | 129.0 | 64.5% |
| mid vs save | 200 | 55.0 | 27.5% |
| mid vs spend | 200 | 168.0 | 84.0% |
| miser vs save | 200 | 109.5 | 54.8% |
| save vs spend | 200 | 177.5 | 88.8% |

White's score in mirror games: 566.5/1195 = 47.4%.
Upgrade-then-capture by the upgraded piece: 32775 (12.2 per game). Capture distance: 1: 3075, 2: 13633, 3: 6681, 4: 4581, 5+: 4805. Upgraded piece taken back on the very next ply: 40.0%.
Example long snipe: game 0 (seed 50000), ply 53: `↑a2 P→R · Ra2xa8`.
Mates delivered by a checking upgrade alone: 160/2145.
Points: 280802 spent on upgrades vs 152949 left unspent at game end (35.3% never used).
Games with no pawns at all left by ply 100: 888/1836.

### Mirror: hoard vs hoard (200 games)

| Result | Games | Share |
|---|---|---|
| mate | 137 | 68.5% |
| fifty | 50 | 25.0% |
| cap | 9 | 4.5% |
| stalemate | 4 | 2.0% |

Mates won by White 68, by Black 69. 
Unfinished (cap/fifty) by material at the end: {'level': 16, 'W ahead': 21, 'B ahead': 22}. 
Length in plies: median 158.0, mean 172, min 52, max 300; mates median 133.

Upgrades bought: 3523 (17.6 per game).

| Upgrade | Count | Share | Median ply |
|---|---|---|---|
| P→B | 1415 | 40.2% | 37 |
| P→N | 941 | 26.7% | 42 |
| P→R | 493 | 14.0% | 56 |
| P→Q | 395 | 11.2% | 71 |
| B→R | 74 | 2.1% | 62 |
| N→R | 66 | 1.9% | 64 |
| N→Q | 52 | 1.5% | 98 |
| R→Q | 45 | 1.3% | 99 |
| B→Q | 42 | 1.2% | 92 |

Direct (from a pawn) 3244 vs stepwise (from a minor/Rook) 279. 
Checking upgrades (turn ends, no move): 217 = 6.2% of upgrades, 1.1 per game; 22 of them delivered mate. 
Capture on the move right after a non-checking upgrade: 3143/3306 = 95.1%; the upgraded piece itself moved in 90.8%.
Longest run of consecutive checking upgrades by one side: median 1.0, max 3; games with a run of 3+: 3.

| Ply | Upgrades | of which to Queen |
|---|---|---|
| 0-19 | 187 | 0 |
| 20-39 | 1197 | 66 |
| 40-59 | 972 | 89 |
| 60-79 | 583 | 118 |
| 80-99 | 263 | 106 |
| 100-119 | 143 | 70 |
| 120+ | 178 | 85 |

Queens: 534 bought, 63 by free promotion (63 promotions total, 0.32 per game). Games with any Queen: 181 (90.5%); first Queen at median ply 53.
Promotions by pawns that started on the back row are not tracked separately; promotion median ply 118.

| Ply | Games still running | Median banked pts (per side) | Mean | Max |
|---|---|---|---|---|
| 10 | 200 | 5 | 4.6 | 5 |
| 20 | 200 | 10 | 9.0 | 12 |
| 40 | 200 | 8 | 10.0 | 25 |
| 60 | 198 | 9 | 11.5 | 36 |
| 100 | 162 | 21 | 22.8 | 54 |
| 150 | 112 | 43 | 45.3 | 79 |
| 200 | 69 | 67 | 67.4 | 104 |
| 300 | 9 | 114 | 114.5 | 130 |

Points banked at game end: median 50.5, max 136.
Castling: 0 times in 0 games (Counter()). 
Turns where the side to move was in check with no legal move and survived only by upgrading: 15. Turns with no legal move, not in check, saved by an upgrade: 0.
Captures per side per game: mean 12.6.
At ply 100: pawns left per side mean 2.3, of which blocked (no pawn move) 0.8.
Anomalies: none.

### Mirror: mid vs mid (595 games)

| Result | Games | Share |
|---|---|---|
| mate | 483 | 81.2% |
| fifty | 97 | 16.3% |
| stalemate | 7 | 1.2% |
| cap | 5 | 0.8% |
| material | 3 | 0.5% |

Mates won by White 221, by Black 262. 
Unfinished (cap/fifty) by material at the end: {'W ahead': 37, 'B ahead': 20, 'level': 45}. 
Length in plies: median 114, mean 130, min 19, max 300; mates median 106.

Upgrades bought: 13907 (23.4 per game).

| Upgrade | Count | Share | Median ply |
|---|---|---|---|
| P→B | 5510 | 39.6% | 31 |
| P→R | 3316 | 23.8% | 48 |
| P→N | 2082 | 15.0% | 35 |
| R→Q | 1527 | 11.0% | 84 |
| B→R | 808 | 5.8% | 57 |
| N→R | 339 | 2.4% | 60 |
| B→Q | 225 | 1.6% | 97 |
| N→Q | 96 | 0.7% | 96 |
| P→Q | 4 | 0.0% | 98 |

Direct (from a pawn) 10912 vs stepwise (from a minor/Rook) 2995. 
Checking upgrades (turn ends, no move): 770 = 5.5% of upgrades, 1.3 per game; 13 of them delivered mate. 
Capture on the move right after a non-checking upgrade: 9269/13137 = 70.6%; the upgraded piece itself moved in 68.6%.
Longest run of consecutive checking upgrades by one side: median 1, max 1; games with a run of 3+: 0.

| Ply | Upgrades | of which to Queen |
|---|---|---|
| 0-19 | 2449 | 0 |
| 20-39 | 3956 | 23 |
| 40-59 | 3326 | 109 |
| 60-79 | 2336 | 551 |
| 80-99 | 1226 | 667 |
| 100-119 | 495 | 398 |
| 120+ | 119 | 104 |

Queens: 1852 bought, 125 by free promotion (128 promotions total, 0.22 per game). Games with any Queen: 567 (95.3%); first Queen at median ply 68.
Promotions by pawns that started on the back row are not tracked separately; promotion median ply 81.0.

| Ply | Games still running | Median banked pts (per side) | Mean | Max |
|---|---|---|---|---|
| 10 | 595 | 5 | 3.9 | 6 |
| 20 | 594 | 4 | 3.5 | 7 |
| 40 | 588 | 3 | 3.4 | 7 |
| 60 | 578 | 3 | 3.5 | 17 |
| 100 | 399 | 6 | 7.2 | 29 |
| 150 | 166 | 27 | 26.5 | 47 |
| 200 | 101 | 51 | 50.3 | 70 |
| 300 | 5 | 96 | 96.4 | 113 |

Points banked at game end: median 13.0, max 113.
Castling: 0 times in 0 games (Counter()). 
Turns where the side to move was in check with no legal move and survived only by upgrading: 19. Turns with no legal move, not in check, saved by an upgrade: 0.
Captures per side per game: mean 12.9.
At ply 100: pawns left per side mean 0.2, of which blocked (no pawn move) 0.0.
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

