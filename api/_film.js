/* Conținutul secret — livrat doar după cod corect (nu e servit public).
   Fișierele cu "_" din /api nu devin rute pe Vercel.

   Tipuri de scene:
   - data-hold="N"   → scenă care trece singură după N secunde (atingere = grăbește)
   - .pick           → întrebare-capcană: orice răspuns duce mai departe
   - .seal           → sigiliu: se ține apăsat ca să se deschidă
   - data-branch     → scene finale (DA / timp) */
const WA = { alex: '4917655700551', bianca: '4915563441309' };
const enc = (s) => encodeURIComponent(s);
const MSG_YES = enc('Dragi Alex & Bianca,\n\nDA, CU TOATĂ INIMA! ✨\nVom fi nașii voștri — e o onoare.');
const MSG_TIME = enc('Dragi Alex & Bianca,\n\nne-a emoționat mult întrebarea voastră. Hai să vorbim, cu drag.');

const pick = (seg, q, a, b) => `
<section class="sc sc--pick" data-seg="${seg}" data-hold="0" data-warm=".2">
  <div class="sc__in">
    <p class="kick ln" data-d=".3">Întrebarea ${seg}</p>
    <p class="t-lg ln split" data-d=".9">${q}</p>
    <div class="pick ln" data-d="3">
      <button type="button" class="pick__opt" data-reply="${a[1]}">${a[0]}</button>
      <button type="button" class="pick__opt" data-reply="${b[1]}">${b[0]}</button>
    </div>
    <p class="reply"></p>
  </div>
</section>`;

module.exports = `
<section class="sc" data-seg="0" data-hold="8" data-warm=".15">
  <div class="sc__in">
    <p class="t-lg ln split" data-d=".4">Am pregătit ceva doar pentru voi.</p>
    <p class="t-md t-it ln split" data-d="3.2">Dar mai întâi… câteva întrebări.</p>
  </div>
</section>
${pick(1, 'Sunteți buni la păstrat secrete?', ['Foarte buni', 'Perfect. Contăm pe asta.'], ['Depinde de secret', 'Acesta merită păstrat.'])}
${pick(2, 'Vă place să dansați până dimineața?', ['Absolut', 'Exact ce speram să auzim.'], ['Doar cu motiv', 'O să aveți motiv.'])}
${pick(3, 'Ați spune că ne cunoașteți bine?', ['Foarte bine', 'Atunci sunteți pe aproape…'], ['Destul de bine', 'O să ne cunoașteți și mai bine.'])}

<section class="sc" data-seg="4" data-hold="10" data-warm=".3">
  <div class="sc__in">
    <p class="t-xl ln split" data-d=".6">Sunt oameni pe care îi întâlnești…</p>
    <p class="t-xl t-it ln split" data-d="3.8">Și sunt oameni pe care îi alegi să rămână.</p>
  </div>
</section>

<section class="sc sc--void" data-seg="5" data-hold="9" data-warm="0" data-void="1">
  <div class="sc__in sc__in--stack">
    <p class="t-so ln" data-d="1" data-out="4.2">Ultima întrebare.</p>
    <p class="t-lg t-it ln split" data-d="5.2">Pe aceasta nu o putem pune oricum.</p>
  </div>
</section>

<section class="sc sc--seal" data-seg="6" data-hold="0" data-warm=".5">
  <div class="sc__in">
    <p class="kick ln" data-d=".3">Sigilat pentru voi</p>
    <button type="button" class="seal ln" data-d="1" aria-label="Țineți apăsat pe sigiliu">
      <svg class="seal__ring" viewBox="0 0 200 200" aria-hidden="true"><circle cx="100" cy="100" r="94"/><circle class="seal__prog" cx="100" cy="100" r="94"/></svg>
      <span class="seal__wax"><span class="seal__mono">AB</span></span>
    </button>
    <p class="seal__hint ln" data-d="2.2">Țineți apăsat pe sigiliu</p>
  </div>
</section>

<section class="sc sc--reveal" id="sc-reveal" data-seg="7" data-hold="0" data-warm="1" data-flash="1">
  <div class="sc__in">
    <h1 class="q">
      <span class="q__l ln chars" data-d="1.2">Vreți să fiți</span>
      <span class="q__l q__l--gold ln chars" data-d="3.4">nașii noștri?</span>
    </h1>
    <span class="hair ln" data-d="6.4"></span>
    <p class="sig ln" data-d="7">Alex <em>&amp;</em> Bianca</p>
    <div class="choices ln" data-d="8.6">
      <button class="btn btn--gold" type="button" data-go="yes"><span>Da, cu toată inima</span></button>
      <button class="btn btn--ghost" type="button" data-go="time"><span>Avem nevoie de puțin timp</span></button>
    </div>
  </div>
</section>

<section class="sc sc--yes" id="sc-yes" data-hold="0" data-warm="1" data-branch="1" data-fx="confetti">
  <div class="sc__in">
    <p class="t-off ln" data-d=".6">Oficial.<span class="heart" aria-hidden="true">&#10084;&#65038;</span></p>
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
