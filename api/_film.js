/* Conținutul secret — livrat doar după cod corect (nu e servit public).
   Fișierele cu "_" din /api nu devin rute pe Vercel. */
const WA = { alex: '4917655700551', bianca: '4915563441309' };
const enc = (s) => encodeURIComponent(s);
const MSG_YES = enc('Dragi Alex & Bianca,\n\nDA, CU TOATĂ INIMA! ✨\nVom fi nașii voștri — e o onoare.');
const MSG_TIME = enc('Dragi Alex & Bianca,\n\nne-a emoționat mult întrebarea voastră. Hai să vorbim, cu drag.');

module.exports = `
<section class="sc" data-seg="0" data-hold="9" data-warm=".15">
  <div class="sc__in">
    <p class="t-lg ln split" data-d=".4">Pentru voi avem ceva ce nu am vrut să spunem printr-un simplu mesaj.</p>
  </div>
</section>

<section class="sc" data-seg="1" data-hold="10.5" data-warm=".25" data-drift="1">
  <div class="sc__in">
    <p class="t-xl ln split" data-d=".6">Sunt oameni pe care îi întâlnești…</p>
    <p class="t-xl t-it ln split" data-d="3.8">Și sunt oameni pe care îi alegi să rămână.</p>
  </div>
</section>

<section class="sc" data-seg="2" data-hold="12" data-warm=".85">
  <div class="sc__in">
    <p class="t-lg ln split" data-d=".6">Pentru una dintre cele mai importante zile din viața noastră…</p>
    <p class="t-lg t-it t-glow ln split" data-d="4.8">…ne dorim lângă noi oameni care înseamnă cu adevărat ceva.</p>
  </div>
</section>

<section class="sc sc--void" data-seg="3" data-hold="10" data-warm="0" data-void="1">
  <div class="sc__in sc__in--stack">
    <p class="t-so ln" data-d="1.2" data-out="4.6">Așa că…</p>
    <p class="t-lg t-it ln split" data-d="5.6">Avem o întrebare pentru voi.</p>
  </div>
</section>

<section class="sc sc--reveal" id="sc-reveal" data-seg="4" data-hold="0" data-warm="1" data-flash="1">
  <div class="sc__in">
    <h1 class="q">
      <span class="q__l ln chars" data-d="1.4">Vreți să fiți</span>
      <span class="q__l q__l--gold ln chars" data-d="3.6">nașii noștri?</span>
    </h1>
    <span class="hair ln" data-d="6.6"></span>
    <p class="sig ln" data-d="7.2">Alex <em>&amp;</em> Bianca</p>
    <div class="choices ln" data-d="9">
      <button class="btn btn--gold" type="button" data-go="yes"><span>Da, cu toată inima</span></button>
      <button class="btn btn--ghost" type="button" data-go="time"><span>Avem nevoie de puțin timp</span></button>
    </div>
  </div>
</section>

<section class="sc sc--yes" id="sc-yes" data-hold="0" data-warm="1" data-branch="1" data-fx="confetti">
  <div class="sc__in">
    <p class="t-off ln" data-d=".6">Oficial. <span class="heart" aria-hidden="true">&#10084;&#65038;</span></p>
    <p class="t-lg ln split" data-d="3">De azi, povestea asta este și a voastră.</p>
    <p class="t-md t-it ln split" data-d="5.4">Ne bucurăm enorm că veți fi alături de noi.</p>
    <div class="end ln" data-d="8">
      <span class="end__mono">AB</span>
      <span class="end__names">Alex <em>&amp;</em> Bianca</span>
    </div>
    <div class="send ln" data-d="10">
      <span class="send__lbl">Trimiteți-ne răspunsul</span>
      <div class="send__row">
        <button type="button" class="send__btn" data-wa="${WA.alex}" data-msg="${MSG_YES}">Lui Alex</button>
        <button type="button" class="send__btn" data-wa="${WA.bianca}" data-msg="${MSG_YES}">Biancăi</button>
      </div>
    </div>
  </div>
</section>

<section class="sc sc--time" id="sc-time" data-hold="0" data-warm=".4" data-branch="1">
  <div class="sc__in">
    <p class="t-xl ln split" data-d=".5">Înțelegem perfect.</p>
    <p class="t-md ln split" data-d="2.4">Este o întrebare mare.</p>
    <p class="t-md t-it ln split" data-d="4">Luați-vă tot timpul de care aveți nevoie.</p>
    <div class="send send--big ln" data-d="6">
      <span class="send__lbl">Vorbim cu drag</span>
      <div class="send__row">
        <button type="button" class="btn btn--ghost" data-wa="${WA.alex}" data-msg="${MSG_TIME}"><span><b class="capA">A</b>lex</span></button>
        <button type="button" class="btn btn--ghost" data-wa="${WA.bianca}" data-msg="${MSG_TIME}"><span>Bianca</span></button>
      </div>
    </div>
    <button type="button" class="back ln" data-d="7" data-go="reveal">Înapoi la întrebare</button>
  </div>
</section>
`;
