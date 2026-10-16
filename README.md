# Pawnbroker

A chess variant where every piece except the King starts as a pawn. Every turn earns a point, and points buy promotions.

## Rules

- Both back rows start as pawns, apart from the Kings on e1 and e8.
- A capture earns 1 point, whatever was taken (en passant included). A turn without a capture also earns 1 point, including a turn ended by a checking upgrade. Points arrive at the end of the turn, so they can be spent from the player's next turn.
- Before moving, a player may spend points to upgrade **one** piece per turn. The price is the difference in material value: Pawn 1, Knight 3, Bishop 3, Rook 5, Queen 9. For example, Pawn to Knight costs 2 and Pawn to Queen costs 8.
- Knights and Bishops can't be converted into each other. Kings and Queens can't be upgraded.
- If an upgrade gives check, the turn ends there with no move. This isn't allowed while your own King is in check.
- An upgrade that doesn't give check is only allowed if you still have a legal move afterwards.
- Only pawns on the second row may move two squares. Reaching the far row promotes for free, as in standard chess.
- Castling needs an unmoved King and an unmoved Rook in the corner. A corner pawn upgraded to a Rook without moving counts as an unmoved Rook.
- A player with no legal move and no legal upgrade is checkmated if in check, and stalemated otherwise.
- The other draw rules are standard: threefold repetition (point totals count as part of the position), the 50-move rule (upgrades reset the count) and insufficient material, which only applies to King against King because points keep coming in.

## Running it

`pawnbroker.html` is a single self-contained page. Open it in a browser, or serve the folder locally:

```bash
python -m http.server 8731
```

Then visit http://localhost:8731/pawnbroker.html.

Two players share one screen. The game state is saved in the browser's local storage.

## Code layout

The rules engine lives in the `<script id="engine">` block and doesn't touch the DOM. The UI script below it only calls `newGame`, `legalMoves`, `doMove`, `doUpgrade` and `upgradeOptions`. A computer opponent or remote play can reuse the engine as it is.

## Planned

- Computer opponent
- Remote two-player games
