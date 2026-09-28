const scenes=[...document.querySelectorAll('.scene')];
let current=0;
const progress=document.getElementById('progressBar');
const stars=document.getElementById('stars');
for(let i=0;i<70;i++){const s=document.createElement('i');s.className='star';s.style.left=Math.random()*100+'%';s.style.top=Math.random()*100+'%';s.style.animationDelay=(Math.random()*3)+'s';s.style.opacity=(.15+Math.random()*.55);stars.appendChild(s)}
function showScene(id){const idx=scenes.findIndex(s=>s.id===id);if(idx<0)return;scenes[current].classList.remove('active');current=idx;scenes[current].classList.add('active');progress.style.width=((current+1)/scenes.length*100)+'%';}
document.querySelectorAll('[data-next]').forEach(b=>b.addEventListener('click',()=>showScene(b.dataset.next)));

document.querySelectorAll('.thought').forEach(t=>t.addEventListener('click',()=>{if(t.classList.contains('bye'))return;t.classList.add('bye');const n=document.querySelectorAll('.thought:not(.bye)').length;document.getElementById('score').textContent=n;if(n===0)setTimeout(()=>document.querySelector('#scene-overthink .ghost').textContent='Okay. That was enough. ✨',450)}));

const art=document.querySelector('.music-art');
const png=document.querySelector('.png-character');
const worlds={
 iktara:{bg:'linear-gradient(180deg,#17143a,#252044 65%,#34283f)',filter:'drop-shadow(0 22px 18px rgba(0,0,0,.32))'},
 parinday:{bg:'linear-gradient(180deg,#87a9d9,#c8d7ef 55%,#7b91a5)',filter:'drop-shadow(0 25px 18px rgba(0,0,0,.18))'},
 love:{bg:'linear-gradient(180deg,#eaa66f,#ffd5a6 52%,#d67c69)',filter:'drop-shadow(0 20px 18px rgba(70,20,20,.25))'},
 ilahi:{bg:'linear-gradient(180deg,#1e3b47,#71978e 55%,#26373d)',filter:'drop-shadow(0 25px 20px rgba(0,0,0,.35))'}
};
document.querySelectorAll('.song').forEach(song=>song.addEventListener('click',()=>{document.querySelectorAll('.song').forEach(x=>x.classList.remove('active-song'));song.classList.add('active-song');const w=worlds[song.dataset.world];art.style.background=w.bg;png.style.filter=w.filter;art.animate([{transform:'scale(.96)',opacity:.2},{transform:'scale(1)',opacity:1}],{duration:650,easing:'cubic-bezier(.22,1,.36,1)'});}));

const card=document.getElementById('messageCard');const msg=document.getElementById('messageText');
document.querySelectorAll('.envelope').forEach(e=>e.addEventListener('click',()=>{msg.textContent=e.dataset.message;card.classList.add('show')}));
document.querySelector('.message-close').addEventListener('click',()=>card.classList.remove('show'));

let gameRunning=false,gameScore=0,brain=0;
const bubbles=[...document.querySelectorAll('.bubble')];
function spawnThought(){if(!gameRunning)return;const b=bubbles[Math.floor(Math.random()*bubbles.length)];b.classList.remove('hit');b.style.left=(4+Math.random()*66)+'%';b.style.top=(15+Math.random()*55)+'%';b.offsetHeight;setTimeout(()=>{if(gameRunning){b.classList.add('hit');brain++;document.getElementById('brainScore').textContent=brain;setTimeout(()=>{b.classList.remove('hit');spawnThought()},420)}},500)}
document.getElementById('startGame').addEventListener('click',()=>{if(gameRunning)return;gameRunning=true;gameScore=0;brain=0;document.getElementById('gameScore').textContent=0;document.getElementById('brainScore').textContent=0;spawnThought();setTimeout(()=>{gameRunning=false;document.getElementById('startGame').textContent='You survived. 😂';},60000)});
bubbles.forEach(b=>b.addEventListener('click',()=>{if(!gameRunning)return;b.classList.add('hit');gameScore++;document.getElementById('gameScore').textContent=gameScore;setTimeout(()=>{b.classList.remove('hit');spawnThought()},250)}));

document.getElementById('breathe').addEventListener('click',()=>{document.getElementById('goodnight').classList.add('show');document.querySelector('.final-copy').animate([{opacity:1},{opacity:.12}],{duration:900,fill:'forwards'});document.body.animate([{backgroundColor:'#080817'},{backgroundColor:'#02020a'}],{duration:1400,fill:'forwards'});});

let audioCtx=null;document.getElementById('soundBtn').addEventListener('click',()=>{if(!audioCtx)audioCtx=new (window.AudioContext||window.webkitAudioContext)();const o=audioCtx.createOscillator(),g=audioCtx.createGain();o.frequency.value=392;g.gain.setValueAtTime(.0001,audioCtx.currentTime);g.gain.exponentialRampToValueAtTime(.045,audioCtx.currentTime+.03);g.gain.exponentialRampToValueAtTime(.0001,audioCtx.currentTime+.7);o.connect(g).connect(audioCtx.destination);o.start();o.stop(audioCtx.currentTime+.7)});
let touchStartY=0;document.addEventListener('touchstart',e=>touchStartY=e.changedTouches[0].clientY,{passive:true});document.addEventListener('touchend',e=>{const dy=touchStartY-e.changedTouches[0].clientY;if(Math.abs(dy)>70){if(dy>0&&current<scenes.length-1)showScene(scenes[current+1].id);if(dy<0&&current>0)showScene(scenes[current-1].id)}} ,{passive:true});
progress.style.width=(100/scenes.length)+'%';
