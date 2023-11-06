// 1.	Citiți documentația pentru librăria player-ului Vimeo.
// 2.	Adăugați biblioteca ca dependență de proiect prin npm.
// 3.	Inițializați player-ul în fișierul script așa cum este descris în secțiunea pre-existing player, dar nu uitaiți faptul că player-ul din proiect este adăugat ca pachet npm și nu printr-un CDN.
// 4.	Citiți documentația metodei on() și urmărește evenimentul de timeupdate, folosind pentru a actualizați timpul de redare.
// 5.	Salvați timpul de redare în local storage. "videoplayer-current-time" va fi cheia de stocare.
// 6.	La reîncărcarea paginii, utilizați metoda setCurrentTime() pentru a relua redarea de la poziţia salvată.
// 7.	Adaugați la proiect librăria lodash.throttle și faceți astfel încât timpul de redare să fie actualizat în spațiul de stocare nu mai mult de o dată pe secundă.

// import biblioteca player-ului Vimeo, adica acela de cand am instalat "npm install @vimeo/player"
// nu tb specificata calea directorului explicit pt ca sistemul de module în Node.js si în medii web moderne este configurat pentru
// a cauta module in mod implicit in directorul node_modules al proiectului curent
import Vimeo from '@vimeo/player';

// initializez player-ul Vimeo cu ID-ul "vimeo-player"-tb sa corespunda cu ID-ul iframe-ului din HTML in care este incorporat
const player = new Vimeo('vimeo-player', {});

// Urmaresc  evenimentul "timeupdate" al player-ului:
// •	Evenimentul "timeupdate" este declansat regulat pe masură ce videoclipul rulează si
// furnizează date despre timpul de redare curent.
// •	Practic se obține timpul de redare curent (in secunde) din datele furnizate si-l salveaza
//  în spațiul de stocare local sub cheia "videoplayer-current-time"
player.on('timeupdate', data => {
  const currentTime = data.seconds;
  localStorage.setItem('videoplayer-current-time', currentTime);
  // Cheia "videoplayer-current-time" este o eticheta / identificator unic care separa valoarea timpului
  // de redare curent de alte date stocate in local storage; asigura ca datele sunt organizate si accesate
  // corect in local storage, evitand amestecul sau suprascrierea accidentala a acestora.
});

// Restaurarea timpului de redare la reincărcarea paginii:
// •	se verifica dacă exista o valoare salvata în spațiul de stocare local sub cheia "videoplayer-current-time";
// daca da -> codul utilizează metoda setCurrentTime() pentru a seta timpul de redare al player - ului Vimeo la acea valoare.
// •	videoclipul va incepe redarea de la momentul salvat, în loc sa inceapa de la început, cand pagina este reincărcata
const savedTime = localStorage.getItem('videoplayer-current-time');
if (savedTime) {
  player.setCurrentTime(parseFloat(savedTime));
}

// functia "throttle" din biblioteca Lodash va permite sa se limiteze cat de des se salveaza timpul de redare in spațiul de stocare local.
import throttle from 'lodash.throttle';

// cream functia "saveTimeThrottled" - primește timpul de redare curent ca argument si, in mod normal, ar salva
// acest timp in spatiul de stocare local, dar, datorita funcției "throttle", acest lucru va fi făcut cel mult o data
// la fiecare 1000 milisecunde. (timpul de redare va fi salvat în spatiul de stocare local o data pe sec, indiferent de
// cat de des se declanșeaza evenimentul "timeupdate"
const saveTimeThrottled = throttle(currentTime => {
  localStorage.setItem('videoplayer-current-time', currentTime);
}, 1000); // 1000 milisecunde (1 secundă)

// Se asculta din nou evenimentul "timeupdate" al player-ului si când acest eveniment are loc, obtine timpul de redare
// curent si apoi apeleaza fct "saveTimeThrottled" pt a salva timpul in spatiul de stocare local > o dată pe secundă,
// conform configuratiei "throttle"
player.on('timeupdate', data => {
  const currentTime = data.seconds;
  saveTimeThrottled(currentTime);
});
