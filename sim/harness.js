// Self-play harness for Pawnbroker. Runs in a Web Worker with ../engine.js
// prepended (see run.html), so it uses the real rules functions: legalMoves, upgradeOptions,
// doUpgrade, doMove, hasLegalTurn, inCheck. Search uses light copies of the state built from the
// same engine helpers (copyBoard, playOnBoard, pseudoMoves); the game itself is always advanced
// with doUpgrade/doMove so the engine stays authoritative.

let rng = Math.random;

// Rule variants for the "tall poppy" comparison, applied at runtime (pawnbroker.html is untouched):
//  A  current rules
//  B  up to two upgrades per turn on two different pieces (a checking upgrade still ends the turn)
//  C  no upgrades at all while your King is in check
//  D  C plus a refund: when a piece with points spent on it is captured, its owner gets half back (rounded down)
//  E  C plus: a piece upgraded this turn may not capture this turn (both sides)
let VARIANT = 'A';
const noUpInCheck = () => VARIANT==='C' || VARIANT==='D' || VARIANT==='E';
// The E capture ban is enforced by the harness (genTurns/deepScore), not by the engine: hasLegalTurn still
// counts a banned upgrade-capture as a legal turn. playGame scores that case itself (see eNoTurn).
const noUpCap = P => !!P.noUpCap || VARIANT==='E';
const _upgradeOptions = upgradeOptions;
// Engine functions are global bindings, so hasLegalTurn/doUpgrade/endTurn pick this up too (mate detection included).
upgradeOptions = function(s, r, c){
  const o=_upgradeOptions(s, r, c);
  if(noUpInCheck() && o.length && inCheck(s.board, s.turn)) return o.map(x=>x.ok?{...x, ok:false, reason:'No upgrades while in check'}:x);
  return o;
};
function mulberry(a){return function(){a|=0;a=a+0x6D2B79F5|0;let t=Math.imul(a^a>>>15,1|a);t=t+Math.imul(t^t>>>7,61|t)^t;return((t^t>>>14)>>>0)/4294967296;};}

const PADV = [0, 0.9, 0.45, 0.2, 0.08, 0, 0, 0]; // pawn bonus by distance to its promotion row
const MINC = {P:4, N:4, B:4, R:6};               // cheapest upgrade per piece type (with the fee)
const LVA = {P:1, N:3, B:3, R:5, Q:9, K:50};

function evalPos(b, pts, me, P, withMob){
  let sc = 0;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(!p)continue;
    let v = VAL[p.t];
    if(p.t==='P') v += (P.padv||PADV)[p.c==='w'?r:7-r] || 0;
    sc += p.c===me ? v : -v;
  }
  sc += P.wp * (pts[me] - pts[other(me)]);
  sc += mopUp(b, me) - mopUp(b, other(me));
  if(withMob) sc += P.mob * (mob(b, me) - mob(b, other(me)));
  return sc;
}
// Endgame help when clearly ahead: drive the enemy King to the edge and bring ours close.
function mopUp(b, col){
  let mine=0, theirs=0, k=null, ok=null;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(!p)continue;
    if(p.t==='K'){if(p.c===col)k=[r,c];else ok=[r,c];}
    else if(p.c===col)mine+=VAL[p.t]; else theirs+=VAL[p.t];}
  if(!k||!ok||mine-theirs<4||theirs>9) return 0;
  const cd=Math.max(3-ok[0],ok[0]-4)+Math.max(3-ok[1],ok[1]-4);
  const dist=Math.abs(k[0]-ok[0])+Math.abs(k[1]-ok[1]);
  return 0.1*cd + 0.05*(14-dist);
}
function mob(b, col){
  const s={board:b, ep:null}; let n=0;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];
    if(p&&p.c===col&&p.t!=='P'&&p.t!=='K') n+=pseudoMoves(s,r,c).length;}
  return n;
}
function light(s, sp){return {board:s.board, turn:s.turn, points:s.points, ep:s.ep, upgraded:s.upgraded, result:null, sp:sp||null};}
const capSq = mv => mv.ep ? [mv.fr, mv.tc] : [mv.tr, mv.tc];
// Mirror a move on a per-square side table (spent points, tracking info), castling Rook included.
function shiftSq(T, mv){
  const [cr,cc]=capSq(mv); T[cr][cc]=null;
  T[mv.tr][mv.tc]=T[mv.fr][mv.fc]; T[mv.fr][mv.fc]=null;
  if(mv.castle==='K'){T[mv.tr][5]=T[mv.tr][7]; T[mv.tr][7]=null;}
  if(mv.castle==='Q'){T[mv.tr][3]=T[mv.tr][0]; T[mv.tr][0]=null;}
}
function applyLight(s, t){
  const b=copyBoard(s.board), me=s.turn, pts={...s.points}; let cap=null, ep=null;
  const sp=s.sp?s.sp.map(r=>r.slice()):null;
  for(const u of [t.up, t.up2]) if(u){ b[u.r][u.c].t=u.to; pts[me]-=u.cost; if(sp) sp[u.r][u.c]=(sp[u.r][u.c]||0)+u.cost; }
  if(t.mv){
    if(sp){const [cr,cc]=capSq(t.mv); if(sp[cr][cc]&&b[cr][cc]) pts[other(me)]+=Math.floor(sp[cr][cc]/2); shiftSq(sp,t.mv);}
    cap=playOnBoard(b, t.mv, t.promo); ep=t.mv.double?[(t.mv.fr+t.mv.tr)/2, t.mv.fc]:null;
  }
  pts[me] += cap?2:1;
  return {board:b, turn:other(me), points:pts, ep, upgraded:false, result:null, cap:!!cap, sp};
}
function plainTurns(s){
  const out=[], me=s.turn;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=s.board[r][c];if(!p||p.c!==me)continue;
    for(const mv of legalMoves(s,r,c)){
      if(mv.promo){out.push({mv,promo:'Q'});out.push({mv,promo:'N'});}
      else out.push({mv});
    }}
  return out;
}
function upgradeList(s){
  const out=[], me=s.turn;
  if(s.upgraded) return out;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=s.board[r][c];
    if(!p||p.c!==me||!(p.t in MINC)||s.points[me]<MINC[p.t])continue;
    for(const o of upgradeOptions(s,r,c)) if(o.ok) out.push({r,c,to:o.to,cost:o.cost,check:o.check,from:p.t});
  }
  return out;
}
function genTurns(s, P){
  const me=s.turn, plain=plainTurns(s);
  for(const t of plain){const s1=applyLight(s,t); t.s1=s1; t.sc1=evalPos(s1.board,s1.points,me,P,false);}
  const top=[...plain].sort((a,b)=>b.sc1-a.sc1).slice(0,4);
  const turns=plain.slice();
  for(const up of upgradeList(s)){
    if(P.noUp) continue;
    if(up.check){if(!P.noCheckUp)turns.push({up});continue;}
    const b=copyBoard(s.board); b[up.r][up.c].t=up.to;
    const pts={...s.points}; pts[me]-=up.cost;
    const s2={board:b, turn:me, points:pts, ep:s.ep, upgraded:true, result:null};
    for(const mv of legalMoves(s2,up.r,up.c)) if(!(noUpCap(P)&&(b[mv.tr][mv.tc]||mv.ep))) turns.push({up,mv}); // noUpCap / E: upgraded piece may not capture this turn
    for(const t of top){
      if(t.mv.fr===up.r&&t.mv.fc===up.c) continue;
      const m2=legalMoves(s2,t.mv.fr,t.mv.fc).find(m=>m.tr===t.mv.tr&&m.tc===t.mv.tc);
      if(m2) turns.push({up,mv:m2,promo:m2.promo?t.promo:undefined});
    }
  }
  for(const t of turns) if(!t.s1){t.s1=applyLight(s,t); t.sc1=evalPos(t.s1.board,t.s1.points,me,P,false);}
  if(VARIANT==='B'&&!P.noUp) turns.push(...doubleTurns(s,P,turns,top));
  return turns;
}
// Variant B: second upgrade on a different piece after the six most promising non-checking first upgrades.
function doubleTurns(s,P,turns,top){
  const me=s.turn, best=new Map();
  for(const t of turns) if(t.up&&!t.up.check){const k=t.up.r*8+t.up.c+':'+t.up.to; if(!best.has(k)||best.get(k).sc1<t.sc1) best.set(k,t);}
  const firsts=[...best.values()].sort((a,b)=>b.sc1-a.sc1).slice(0,6).map(t=>t.up);
  const out=[];
  for(const u1 of firsts){
    const b1=copyBoard(s.board); b1[u1.r][u1.c].t=u1.to;
    const p1={...s.points}; p1[me]-=u1.cost;
    const s2={board:b1, turn:me, points:p1, ep:s.ep, upgraded:false, result:null};
    for(const u2 of upgradeList(s2)){
      if(u2.r===u1.r&&u2.c===u1.c) continue;
      if(u2.check){if(!P.noCheckUp) out.push({up:u1,up2:u2}); continue;}
      const b2=copyBoard(b1); b2[u2.r][u2.c].t=u2.to;
      const p2={...p1}; p2[me]-=u2.cost;
      const s3={board:b2, turn:me, points:p2, ep:s.ep, upgraded:true, result:null};
      for(const mv of legalMoves(s3,u2.r,u2.c)) out.push({up:u1,up2:u2,mv});
      for(const mv of legalMoves(s3,u1.r,u1.c)) out.push({up:u1,up2:u2,mv});
      for(const t of top){
        if((t.mv.fr===u1.r&&t.mv.fc===u1.c)||(t.mv.fr===u2.r&&t.mv.fc===u2.c)) continue;
        const m2=legalMoves(s3,t.mv.fr,t.mv.fc).find(m=>m.tr===t.mv.tr&&m.tc===t.mv.tc);
        if(m2) out.push({up:u1,up2:u2,mv:m2,promo:m2.promo?t.promo:undefined});
      }
    }
  }
  for(const t of out){t.s1=applyLight(s,t); t.sc1=evalPos(t.s1.board,t.s1.points,me,P,false);}
  return out;
}

// Opponent's best tactical reply: captures, promotions, checks, checking upgrades and
// upgrade-then-capture. Quiet replies are folded into "stand pat" (opponent just banks a point).
function deepScore(s1, me, P){
  const opp=s1.turn, oppChecked=inCheck(s1.board,opp);
  if(!hasAnyMove(s1,opp) && !hasLegalTurn(s1)) return oppChecked?1000:0;
  const sp={...s1.points}; sp[opp]+=1;
  const stand=evalPos(s1.board,sp,me,P,true);
  const mobAdj=stand-evalPos(s1.board,sp,me,P,false);
  let worst=stand;
  const leaf=(b,pts,checksMe,ep)=>{
    if(checksMe){const sm={board:b,turn:me,points:pts,ep:ep||null,upgraded:false,result:null};
      if(!hasLegalTurn(sm)) return -1000;}
    return evalPos(b,pts,me,P,false)+mobAdj;
  };
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=s1.board[r][c];if(!p||p.c!==opp)continue;
    for(const mv of legalMoves(s1,r,c)){
      const tgt=s1.board[mv.tr][mv.tc], isCap=!!tgt||!!mv.ep;
      const b=copyBoard(s1.board); const cap=playOnBoard(b,mv,'Q');
      const chk=inCheck(b,me);
      if(!isCap&&!mv.promo&&!chk) continue;
      const pts={...s1.points}; pts[opp]+=cap?2:1;
      if(s1.sp&&isCap){const [cr,cc]=capSq(mv); pts[me]+=Math.floor((s1.sp[cr][cc]||0)/2);}
      let v=leaf(b,pts,chk,mv.double?[(mv.fr+mv.tr)/2,mv.fc]:null);
      if(v>-1000&&isCap&&attacked(b,mv.tr,mv.tc,me)){ // crude SEE: we can take the capturer back
        const capT=b[mv.tr][mv.tc].t, back=attacked(b,mv.tr,mv.tc,opp)?lva(b,mv.tr,mv.tc,me):0;
        v+=Math.max(0, VAL[capT]-back);
      }
      if(v<worst){worst=v; if(worst<=-1000) return worst;}
    }
    if(!(p.t in MINC)||s1.points[opp]<MINC[p.t]||(noUpInCheck()&&oppChecked)) continue;
    for(const to of UPG[p.t]){
      const cost=VAL[to]-VAL[p.t]+FEE; if(cost>s1.points[opp]) continue;
      const b=copyBoard(s1.board); b[r][c].t=to;
      const pts={...s1.points}; pts[opp]-=cost;
      if(inCheck(b,me)){
        if(oppChecked) continue;
        const p2={...pts}; p2[opp]+=1;
        const v=leaf(b,p2,true,null); if(v<worst){worst=v; if(worst<=-1000) return worst;}
        continue;
      }
      if(noUpCap(P)) continue;
      const sx={board:b,ep:s1.ep};
      for(const mv of legalMoves(sx,r,c)){
        if(!b[mv.tr][mv.tc]) continue;
        const b2=copyBoard(b); playOnBoard(b2,mv); const p2={...pts}; p2[opp]+=2;
        if(s1.sp) p2[me]+=Math.floor((s1.sp[mv.tr][mv.tc]||0)/2);
        let v=leaf(b2,p2,inCheck(b2,me),null);
        if(v>-1000&&attacked(b2,mv.tr,mv.tc,me)){const back=attacked(b2,mv.tr,mv.tc,opp)?lva(b2,mv.tr,mv.tc,me):0; v+=Math.max(0,VAL[to]-back);}
        if(v<worst){worst=v; if(worst<=-1000) return worst;}
      }
    }
  }
  return worst;
}
function lva(b,tr,tc,by){
  let best=99; const s={board:b,ep:null};
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];
    if(p&&p.c===by&&LVA[p.t]<best&&pseudoMoves(s,r,c).some(m=>m.tr===tr&&m.tc===tc)) best=LVA[p.t];}
  return best===99?0:best;
}
function chooseTurn(s, P, sp){
  const me=s.turn; let turns=genTurns(light(s,sp),P);
  if(!turns.length&&(P.noUp||P.noCheckUp)) turns=genTurns(light(s,sp),{...P,noUp:false,noCheckUp:false});
  if(!turns.length) return null;
  turns.sort((a,b)=>b.sc1-a.sc1);
  const cand=new Set(turns.slice(0,P.width));
  for(const t of turns) if((t.up&&t.up.check)||(t.up2&&t.up2.check)||t.s1.cap||(t.mv&&t.mv.promo)) cand.add(t);
  let best=null, bv=-Infinity;
  for(const t of cand){
    const v=deepScore(t.s1,me,P)+rng()*P.noise;
    if(v>bv){bv=v;best=t;}
  }
  return best;
}

// ---------- game runner with stats and invariant checks ----------
function countPieces(b){let n=0;for(const row of b)for(const p of row)if(p)n++;return n;}
function boardStr(b){return b.map(row=>row.map(p=>p?(p.c==='w'?p.t:p.t.toLowerCase()):'.').join('')).join('/');}
function material(b,col){let v=0;for(const row of b)for(const p of row)if(p&&p.c===col)v+=VAL[p.t];return v;}
function army(b){const o={w:{},b:{}};for(const row of b)for(const p of row)if(p&&p.t!=='K')o[p.c][p.t]=(o[p.c][p.t]||0)+1;return o;}
function blockedPawns(b){
  const s={board:b,ep:null}, o={w:0,b:0,wTot:0,bTot:0};
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(!p||p.t!=='P')continue;
    o[p.c+'Tot']++; if(!pseudoMoves(s,r,c).length) o[p.c]++;}
  return o;
}

function nonPawns(b){const o={w:0,b:0};for(const row of b)for(const p of row)if(p&&p.t!=='P'&&p.t!=='K')o[p.c]++;return o;}

function playGame(job){
  rng=mulberry(job.seed);
  VARIANT=job.variant||'A';
  const PW=job.white, PB=job.black, cap=job.cap||300;
  let s=newGame();
  const rec={id:job.id, seed:job.seed, variant:VARIANT, white:PW.name, black:PB.name, result:null, winner:null, plies:0,
    ups:[], promos:[], castles:[], anomalies:[], pts:[], captures:{w:0,b:0},
    upgradeEscapes:[], stalemateDodges:[], maxCheckStreak:{w:0,b:0}, firstQ:null, block100:null,
    np:{}, npSum:{w:0,b:0}, checkTurns:0, checkUpTurns:0, checkUpTakesChecker:0,
    doubleTurns:0, doubleMates:0, mateAfterDouble:0, swings:[], refunds:0, refundPts:0, refundUndidStalemate:0};
  // Per-square side table that follows each piece: points spent on it and the indexes of its upgrade events.
  const T=Array.from({length:8},()=>Array(8).fill(null));
  const ledger={w:0,b:0}, streak={w:0,b:0}, lastDouble={w:-99,b:-99};
  let ply=0;
  const anom=(kind,extra)=>rec.anomalies.push(Object.assign({kind,ply,board:boardStr(s.board),turn:s.turn,points:{...s.points}},extra||{}));
  while(!s.result && ply<cap){
    const me=s.turn, opp=other(me), P=me==='w'?PW:PB;
    const chkBefore=inCheck(s.board,me), anyMove=hasAnyMove(s,me);
    const sp=VARIANT==='D'?T.map(row=>row.map(x=>x?x.spent:0)):null;
    let t;
    try{ t=chooseTurn(s,P,sp); }catch(e){ anom('ai-exception',{msg:String(e&&e.stack||e)}); break; }
    if(!t&&VARIANT==='E'&&hasLegalTurn(s)){
      // Only legal turns are banned upgrade-captures: the engine thinks the side can move, E says it can't.
      // Score it as E would: mate if in check, stalemate otherwise.
      rec.eNoTurn={ply,c:me,check:chkBefore,board:boardStr(s.board),points:{...s.points}};
      s.result=chkBefore?{type:'mate',winner:opp}:{type:'stalemate'};
      break;
    }
    if(!t){ anom('no-turn-but-unscored',{hasLegalTurn:hasLegalTurn(s)}); break; }
    if(!anyMove){
      if(chkBefore) rec.upgradeEscapes.push({ply,c:me,up:t.up&&`${t.up.from}->${t.up.to}`,board:boardStr(s.board)});
      else rec.stalemateDodges.push({ply,c:me,up:t.up&&`${t.up.from}->${t.up.to}`,check:!!(t.up&&t.up.check),board:boardStr(s.board)});
    }
    if(chkBefore){
      rec.checkTurns++;
      if(t.up){rec.checkUpTurns++;
        const ups=[t.up,t.up2].filter(Boolean);
        if(t.mv&&ups.some(u=>u.r===t.mv.fr&&u.c===t.mv.fc)&&(s.board[t.mv.tr][t.mv.tc]||t.mv.ep)) rec.checkUpTakesChecker++;}
    }
    const before=countPieces(s.board), boardBefore=boardStr(s.board), ptsBefore=s.points[me];
    const swing0=material(s.board,me)-material(s.board,opp);
    const evIdx=[];
    let refund=0;
    try{
      for(const [k,u] of [[0,t.up],[1,t.up2]]){
        if(!u) continue;
        if(s.turn!==me){anom('upgrade-after-turn-ended'); break;}
        let firstText=null;
        if(k===1){ firstText=s.pending; s.upgraded=false; } // variant B: allow the second upgrade
        s=doUpgrade(s,u.r,u.c,u.to); ledger[me]-=u.cost;
        if(u.check!==(s.turn!==me)) anom('upgrade-check-flag-mismatch');
        if(firstText){ if(s.turn!==me) s.log[s.log.length-1].text=firstText+' · '+s.log[s.log.length-1].text; else s.pending=firstText+' · '+s.pending; }
        const e=T[u.r][u.c]||(T[u.r][u.c]={spent:0,evs:[]});
        e.spent+=u.cost; e.evs.push(rec.ups.length+evIdx.length); evIdx.push(u);
      }
      if(t.mv){
        if(s.turn!==me) anom('move-after-turn-ended');
        else{
          const [cr,cc]=capSq(t.mv), victim=s.board[cr][cc], ent=victim?T[cr][cc]:null;
          s=doMove(s,t.mv,t.promo);
          if(ent){
            rec._life=rec._life||[]; for(const i of ent.evs) rec._life.push([i,ply]); // lifespan of each upgrade on the captured piece
            if(VARIANT==='D'&&ent.spent>0){
              refund=Math.floor(ent.spent/2);
              s.points[opp]+=refund; ledger[opp]+=refund; rec.refunds++; rec.refundPts+=refund;
              // The engine scored the position before the refund arrived; a stalemate may no longer be one.
              if(refund&&s.result&&s.result.type==='stalemate'&&hasLegalTurn(s)){s.result=null; rec.refundUndidStalemate++;}
            }
          }
          shiftSq(T,t.mv);
          if(t.mv.promo) T[t.mv.tr][t.mv.tc]=null;
        }
      }
    }catch(e){ anom('engine-exception',{msg:String(e&&e.message||e),turnTried:JSON.stringify({up:t.up,up2:t.up2,mv:t.mv})}); break; }
    const captured=countPieces(s.board)<before;
    if(captured) rec.captures[me]++;
    ledger[me]+=captured?2:1;
    for(const u0 of evIdx){
      const chk=!!u0.check;
      const u={ply,c:me,from:u0.from,to:u0.to,cost:u0.cost,check:chk,ptsBefore,second:u0===t.up2,
        capNext:!chk&&!!t.mv&&captured, ownPiece:!!(t.mv&&t.mv.fr===u0.r&&t.mv.fc===u0.c),
        sq:sqName(u0.r,u0.c), mate:!!(s.result&&s.result.type==='mate'), life:null};
      rec.ups.push(u);
      if(u0.to==='Q'&&rec.firstQ===null) rec.firstQ=ply;
    }
    if(t.up2){rec.doubleTurns++; lastDouble[me]=ply; rec.swings.push((material(s.board,me)-material(s.board,opp))-swing0);
      if(s.result&&s.result.type==='mate') rec.doubleMates++;}
    if(s.result&&s.result.type==='mate'&&ply-lastDouble[me]<=2) rec.mateAfterDouble++;
    const anyCheckUp=(t.up&&t.up.check)||(t.up2&&t.up2.check);
    if(anyCheckUp){streak[me]++; rec.maxCheckStreak[me]=Math.max(rec.maxCheckStreak[me],streak[me]);} else streak[me]=0;
    if(t.mv&&t.mv.castle) rec.castles.push({ply,c:me,side:t.mv.castle});
    if(t.mv&&t.mv.promo){rec.promos.push({ply,c:me,to:t.promo||'Q',fromRow:t.mv.fr}); if((t.promo||'Q')==='Q'&&rec.firstQ===null) rec.firstQ=ply;}
    // invariants
    if(ledger.w!==s.points.w||ledger.b!==s.points.b) anom('points-ledger-mismatch',{ledger:{...ledger}});
    if(s.points.w<0||s.points.b<0) anom('negative-points');
    if(!findKing(s.board,'w')||!findKing(s.board,'b')) anom('king-missing');
    if(inCheck(s.board,me)) anom('mover-king-capturable',{before:boardBefore});
    if(!s.result&&!hasLegalTurn(s)) anom('unscored-no-legal-turn');
    if(s.result&&s.result.type==='mate'&&!inCheck(s.board,s.turn)) anom('mate-without-check');
    if(s.result&&s.result.type==='stalemate'&&inCheck(s.board,s.turn)) anom('stalemate-in-check');
    if(anyCheckUp&&!inCheck(s.board,other(me))) anom('check-upgrade-no-check');
    if(t.up2&&VARIANT!=='B') anom('double-upgrade-outside-B');
    if(chkBefore&&t.up&&noUpInCheck()) anom('upgrade-in-check-under-C');
    if(VARIANT==='E'&&t.up&&t.mv&&captured&&t.mv.fr===t.up.r&&t.mv.fc===t.up.c) anom('upgrade-capture-under-E');
    for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=s.board[r][c];
      if(T[r][c]&&(!p||p.t==='P'||p.t==='K')) anom('tracker-drift',{sq:sqName(r,c)});}
    ply++;
    const np=nonPawns(s.board); rec.npSum.w+=np.w; rec.npSum.b+=np.b;
    if(ply%20===0&&ply<=100) rec.np[ply]=np;
    if(ply%10===0) rec.pts.push([ply,s.points.w,s.points.b]);
    if(ply===100) rec.block100=blockedPawns(s.board);
  }
  for(const [i,cp] of (rec._life||[])) if(rec.ups[i]) rec.ups[i].life=cp-rec.ups[i].ply;
  delete rec._life;
  rec.plies=ply;
  if(s.result){rec.result=s.result.type; rec.winner=s.result.winner||null;}
  else if(!rec.anomalies.length) rec.result='cap';
  else rec.result='aborted';
  rec.final={board:boardStr(s.board), turn:s.turn, points:{...s.points}, matW:material(s.board,'w'), matB:material(s.board,'b'),
    army:army(s.board), blocked:blockedPawns(s.board), half:s.half};
  rec.log=s.log.map(e=>e.text);
  return rec;
}

self.onmessage = e => {
  const job=e.data;
  const t0=Date.now();
  let rec;
  try{ rec=playGame(job); }catch(err){ rec={id:job.id, result:'crash', msg:String(err&&err.stack||err)}; }
  rec.ms=Date.now()-t0;
  self.postMessage(rec);
};
