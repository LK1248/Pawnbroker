// Pawnbroker rules engine. No DOM access: shared by pawnbroker.html, the self-play tools in sim/,
// and later the computer opponent and online play.
const FILES='abcdefgh';
const VAL={P:1,N:3,B:3,R:5,Q:9,K:0};
const UPG={P:['N','B','R','Q'],N:['R','Q'],B:['R','Q'],R:['Q'],Q:[],K:[]};
const FEE=2; // flat charge on every upgrade, so saving up for a big jump beats buying in small steps
const NAME={P:'Pawn',N:'Knight',B:'Bishop',R:'Rook',Q:'Queen',K:'King'};
const COLOR={w:'White',b:'Black'};
const other=c=>c==='w'?'b':'w';
const inB=(r,c)=>r>=0&&r<8&&c>=0&&c<8;
const sqName=(r,c)=>FILES[c]+(8-r);
const copyBoard=b=>b.map(row=>row.map(x=>x&&{...x}));
const clone=s=>JSON.parse(JSON.stringify(s));
const KN=[[1,2],[2,1],[-1,2],[-2,1],[1,-2],[2,-1],[-1,-2],[-2,-1]];
const KG=[[1,0],[-1,0],[0,1],[0,-1],[1,1],[1,-1],[-1,1],[-1,-1]];
const ORTH=[[1,0],[-1,0],[0,1],[0,-1]], DIAG=[[1,1],[1,-1],[-1,1],[-1,-1]];

function newGame(){
  const b=Array.from({length:8},()=>Array(8).fill(null));
  for(let c=0;c<8;c++){
    b[0][c]={t:c===4?'K':'P',c:'b',m:false};
    b[1][c]={t:'P',c:'b',m:false};
    b[6][c]={t:'P',c:'w',m:false};
    b[7][c]={t:c===4?'K':'P',c:'w',m:false};
  }
  const s={board:b,turn:'w',points:{w:0,b:0},earned:{w:0,b:0},ep:null,upgraded:false,pending:null,
    half:0,full:1,log:[],result:null,last:null,lastUp:null,note:null,rep:{}};
  s.rep[posKey(s)]=1;
  return s;
}
function posKey(s){
  return s.board.map(r=>r.map(p=>p?p.c+p.t+(p.m?1:0):'..').join('')).join('/')+'|'+s.turn+'|'+s.points.w+','+s.points.b+'|'+(s.ep?s.ep.join(','):'-');
}
function findKing(b,col){for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=b[r][c];if(p&&p.t==='K'&&p.c===col)return[r,c];}return null;}
function attacked(b,r,c,by){
  const d=by==='w'?-1:1;
  for(const dc of[-1,1]){const pr=r-d,pc=c+dc;if(inB(pr,pc)){const p=b[pr][pc];if(p&&p.c===by&&p.t==='P')return true;}}
  for(const[dr,dc]of KN){const rr=r+dr,cc=c+dc;if(inB(rr,cc)){const p=b[rr][cc];if(p&&p.c===by&&p.t==='N')return true;}}
  for(const[dr,dc]of KG){const rr=r+dr,cc=c+dc;if(inB(rr,cc)){const p=b[rr][cc];if(p&&p.c===by&&p.t==='K')return true;}}
  for(const[dirs,ts]of[[ORTH,'RQ'],[DIAG,'BQ']])for(const[dr,dc]of dirs){
    let rr=r+dr,cc=c+dc;
    while(inB(rr,cc)){const p=b[rr][cc];if(p){if(p.c===by&&ts.includes(p.t))return true;break;}rr+=dr;cc+=dc;}
  }
  return false;
}
function inCheck(b,col){const k=findKing(b,col);return !!k&&attacked(b,k[0],k[1],other(col));}

function pseudoMoves(s,r,c){
  const b=s.board,p=b[r][c],out=[];
  const add=(tr,tc,x)=>out.push(Object.assign({fr:r,fc:c,tr,tc},x||{}));
  const can=(tr,tc)=>inB(tr,tc)&&(!b[tr][tc]||b[tr][tc].c!==p.c);
  if(p.t==='P'){
    const d=p.c==='w'?-1:1,start=p.c==='w'?6:1,last=p.c==='w'?0:7,r1=r+d;
    if(inB(r1,c)&&!b[r1][c]){
      add(r1,c,{promo:r1===last});
      const r2=r+2*d;
      if(r===start&&!p.m&&inB(r2,c)&&!b[r2][c])add(r2,c,{double:true});
    }
    for(const dc of[-1,1]){
      const tc=c+dc;if(!inB(r1,tc))continue;
      const t=b[r1][tc];
      if(t&&t.c!==p.c)add(r1,tc,{promo:r1===last});
      else if(!t&&s.ep&&s.ep[0]===r1&&s.ep[1]===tc)add(r1,tc,{ep:true});
    }
  }else if(p.t==='N'||p.t==='K'){
    for(const[dr,dc]of p.t==='N'?KN:KG)if(can(r+dr,c+dc))add(r+dr,c+dc);
    if(p.t==='K'&&!p.m&&c===4&&r===(p.c==='w'?7:0)&&!inCheck(b,p.c)){
      const o=other(p.c),rk=b[r][7],rq=b[r][0];
      if(rk&&rk.t==='R'&&rk.c===p.c&&!rk.m&&!b[r][5]&&!b[r][6]&&!attacked(b,r,5,o)&&!attacked(b,r,6,o))add(r,6,{castle:'K'});
      if(rq&&rq.t==='R'&&rq.c===p.c&&!rq.m&&!b[r][1]&&!b[r][2]&&!b[r][3]&&!attacked(b,r,3,o)&&!attacked(b,r,2,o))add(r,2,{castle:'Q'});
    }
  }else{
    const dirs=p.t==='R'?ORTH:p.t==='B'?DIAG:ORTH.concat(DIAG);
    for(const[dr,dc]of dirs){let rr=r+dr,cc=c+dc;
      while(inB(rr,cc)){const t=b[rr][cc];if(!t)add(rr,cc);else{if(t.c!==p.c)add(rr,cc);break;}rr+=dr;cc+=dc;}}
  }
  return out;
}
function playOnBoard(b,mv,promo){
  const p=b[mv.fr][mv.fc];let cap=b[mv.tr][mv.tc];
  if(mv.ep){cap=b[mv.fr][mv.tc];b[mv.fr][mv.tc]=null;}
  b[mv.tr][mv.tc]={t:mv.promo?(promo||'Q'):p.t,c:p.c,m:true};
  b[mv.fr][mv.fc]=null;
  if(mv.castle==='K'){b[mv.tr][5]={...b[mv.tr][7],m:true};b[mv.tr][7]=null;}
  if(mv.castle==='Q'){b[mv.tr][3]={...b[mv.tr][0],m:true};b[mv.tr][0]=null;}
  return cap;
}
function legalMoves(s,r,c){
  const p=s.board[r][c];if(!p)return[];
  return pseudoMoves(s,r,c).filter(mv=>{const b=copyBoard(s.board);playOnBoard(b,mv);return !inCheck(b,p.c);});
}
function hasAnyMove(s,col){
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=s.board[r][c];if(p&&p.c===col&&legalMoves(s,r,c).length)return true;}
  return false;
}
function upgradeOptions(s,r,c){
  const p=s.board[r][c];if(!p||p.c!==s.turn)return[];
  const checked=inCheck(s.board,p.c);
  return UPG[p.t].map(to=>{
    const cost=VAL[to]-VAL[p.t]+FEE;let ok=true,reason='',check=false;
    if(s.result){ok=false;reason='Game over';}
    else if(s.upgraded){ok=false;reason='One upgrade per turn';}
    else if(checked){ok=false;reason='Can’t upgrade while in check';}
    else if(s.points[p.c]<cost){ok=false;reason=`Need ${cost-s.points[p.c]} more`;}
    else{
      const b=copyBoard(s.board);b[r][c].t=to;
      check=inCheck(b,other(p.c));
      if(!check&&!hasAnyMove({...s,board:b},p.c)){ok=false;reason='Leaves you no legal move';}
    }
    return{to,cost,ok,reason,check};
  });
}
function hasLegalTurn(s){
  const col=s.turn;
  if(hasAnyMove(s,col))return true;
  if(s.upgraded)return false;
  for(let r=0;r<8;r++)for(let c=0;c<8;c++){const p=s.board[r][c];
    if(p&&p.c===col&&upgradeOptions(s,r,c).some(o=>o.ok))return true;}
  return false;
}
function insufficient(s){
  const pcs=[];
  for(const row of s.board)for(const p of row)if(p&&p.t!=='K')pcs.push(p);
  // Points keep coming every turn, so any piece besides the Kings can eventually be upgraded to mate.
  return !pcs.length;
}
function endTurn(ns,text,gain=1){
  const mover=ns.turn;
  ns.points[mover]+=gain; // 2 for a turn with a capture, 1 for any other turn
  ns.turn=other(mover);ns.upgraded=false;ns.pending=null;
  if(mover==='b')ns.full++;
  const k=posKey(ns);ns.rep[k]=(ns.rep[k]||0)+1;
  if(!hasLegalTurn(ns)){
    if(inCheck(ns.board,ns.turn)){ns.result={type:'mate',winner:mover};text=text.replace(/\+$/,'')+'#';}
    else ns.result={type:'stalemate'};
  }else if(ns.half>=100)ns.result={type:'fifty'};
  else if(ns.rep[k]>=3)ns.result={type:'repetition'};
  else if(insufficient(ns))ns.result={type:'material'};
  ns.log.push({c:mover,n:mover==='w'?ns.full:ns.full-1,text});
  return ns;
}
function doUpgrade(s,r,c,to){
  const opt=upgradeOptions(s,r,c).find(o=>o.to===to);
  if(!opt||!opt.ok)throw new Error('Illegal upgrade');
  const ns=clone(s),p=ns.board[r][c],from=p.t;
  p.t=to;ns.points[p.c]-=opt.cost;ns.upgraded=true;ns.half=0;ns.lastUp=[r,c];
  const text=`↑${sqName(r,c)} ${from}→${to}`;
  if(opt.check){
    ns.ep=null;ns.last=null;
    ns.note=`${COLOR[p.c]}’s upgrade gives check, so the turn ends without a move.`;
    return endTurn(ns,text+'+');
  }
  ns.pending=text;ns.note=null;
  return ns;
}
// Only the from/to squares and the promotion choice are taken from the caller. The move's flags
// (castle, en passant, double step, promotion) always come from the engine's own legal move.
function doMove(s,req,promo){
  if(s.result)throw new Error('Game is over');
  const own=inB(req.fr,req.fc)&&s.board[req.fr][req.fc];
  if(!own||own.c!==s.turn)throw new Error('Not your piece');
  const mv=legalMoves(s,req.fr,req.fc).find(m=>m.tr===req.tr&&m.tc===req.tc);
  if(!mv)throw new Error('Illegal move');
  if(!mv.promo)promo=undefined;
  else if(!['Q','R','B','N'].includes(promo))throw new Error('Promotion needs Q, R, B or N');
  const ns=clone(s),p=ns.board[mv.fr][mv.fc];
  const cap=playOnBoard(ns.board,mv,promo);
  if(cap)ns.earned[p.c]++;
  ns.half=(p.t==='P'||cap||s.upgraded)?0:ns.half+1;
  ns.ep=mv.double?[(mv.fr+mv.tr)/2,mv.fc]:null;
  ns.last={fr:mv.fr,fc:mv.fc,tr:mv.tr,tc:mv.tc};
  if(!s.upgraded)ns.lastUp=null;
  ns.note=null;
  let text=mv.castle==='K'?'O-O':mv.castle==='Q'?'O-O-O':
    (p.t==='P'?'':p.t)+sqName(mv.fr,mv.fc)+(cap?'x':'-')+sqName(mv.tr,mv.tc)+(mv.promo?'='+promo:'')+(mv.ep?' e.p.':'');
  if(inCheck(ns.board,other(p.c)))text+='+';
  if(ns.pending)text=ns.pending+' · '+text;
  return endTurn(ns,text,cap?2:1);
}

// A game is a list of actions; the state is whatever replaying them gives. Actions use
// algebraic squares so they read well in a save file or an online game record:
//   {type:'upgrade', at:'c2', piece:'N'}
//   {type:'move', from:'c2', to:'b4'}          (plus promo:'Q'|'R'|'B'|'N' when a pawn promotes)
function parseSq(sq){
  if(typeof sq!=='string'||!/^[a-h][1-8]$/.test(sq))throw new Error('Bad square: '+sq);
  return[8-+sq[1],FILES.indexOf(sq[0])];
}
function upgradeAction(r,c,piece){return{type:'upgrade',at:sqName(r,c),piece};}
function moveAction(mv,promo){
  const a={type:'move',from:sqName(mv.fr,mv.fc),to:sqName(mv.tr,mv.tc)};
  if(promo)a.promo=promo;
  return a;
}
function applyAction(s,a){
  if(a&&a.type==='upgrade'){const[r,c]=parseSq(a.at);return doUpgrade(s,r,c,a.piece);}
  if(a&&a.type==='move'){const[fr,fc]=parseSq(a.from),[tr,tc]=parseSq(a.to);return doMove(s,{fr,fc,tr,tc},a.promo);}
  throw new Error('Unknown action');
}
function replay(actions){return actions.reduce(applyAction,newGame());}

if(typeof module!=='undefined')module.exports={newGame,legalMoves,upgradeOptions,doMove,doUpgrade,inCheck,hasLegalTurn,
  parseSq,upgradeAction,moveAction,applyAction,replay,sqName,VAL,UPG,FEE,NAME,COLOR};
