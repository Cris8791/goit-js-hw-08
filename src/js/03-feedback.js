// 1. Urmăriți în formular evenimentul de input și la fiecare modificare să se salveze local un obiect cu câmpurile email și message, unde vor fi stocate valorile curente ale câmpurilor din formular. Cheia obiectului va fi "feedback-form-state"
// 2. La încărcarea paginii, verificați starea storage-ului, iar dacă există date salvate, completați câmpurile formularului cu aceste date. În caz contrar, câmpurile vor fi goale.
// 3. Când se trimite formularul, la evenimentul submit, ștergeți câmpurile din local storage și afișați în consolă obiectul cu câmpurile email, message și valorile lor curente.
// 4. Asigurați-vă că datele vor fi stocate și actualizate doar o dată la 500 de milisecunde. Pentru a face acest lucru, adăugați la proiect și utilizați librăria lodash.throttle.import throttle from 'lodash.throttle';

//import fct throttle - pt a limita frecventa cu care o fct poate fi apelata
import throttle from 'lodash.throttle';

// selectez elementul cu clasa .feedback-form din HTML si il stochez in variabila feedbackForm
const feedbackForm = document.querySelector('.feedback-form');

// selectez elementul de intrare (input) cu atributul name=email din html si il stochez în variabila emailInput.
const emailInput = feedbackForm.querySelector('input[name="email"]');

// selectez elementul cu name=message din html si il stochea in variabila messageTextarea.
const messageTextarea = feedbackForm.querySelector('textarea[name="message"]');

// creare functie throttle pt a limita frecventa cu care fct updateFeedbackState poate fi apelata, respectiv la fiecare 500 de milisecunde
const updateFeedbackStateThrottled = throttle(updateFeedbackState, 500);

// adaugare handler de eveniment cand se introduce text. Totuși, în acest caz, comentariul indică că throttle se va ocupa de apelurile repetitive, ceea ce înseamnă că nu trebuie să apelați manual funcția updateFeedbackState.
feedbackForm.addEventListener('input', () => {
  // Throttle va gestiona apelurile repetitive.
});

// apelare fct care verifica daca exista date salvate in local storage si pt a completa campurile formularului cu aceste date, daca sunt disponibile.
loadFeedbackState();

// handler de eveniment cand form-ul este trimis (submit) -> mom in care fct submitForm va fi apelata
feedbackForm.addEventListener('submit', submitForm);

// DEFINIRE FUNCTII:

// fct care actualizeaza si stocheaza starea formularului de feedback in localStorage
function updateFeedbackState() {
  //creare obiect care va stoca starea formularului
  const feedbackState = {
    email: emailInput.value, //valoarea sa este preluata din campul de intrare pentru email, emailInput.
    message: messageTextarea.value, //la fel
  };
  // stocare obiect feedbackState in localStorage; inainte de stocare, obiectul este transformat intr-un sir JSON cu JSON.stringify, pt ca localStorage poate stoca doar siruri de caractere.
  localStorage.setItem('feedback-form-state', JSON.stringify(feedbackState));
}

// fct care verifica daca exista o stare salvata în localStorage, ai dacă da, o restaurează in formular
function loadFeedbackState() {
  // obtinem starea anterioara salvata in localStorage cu cheia "feedback-form-state" si o stocam in variabila savedState
  const savedState = localStorage.getItem('feedback-form-state');
  if (savedState) {
    //parsam sirul JSON inapoi intr-un obiect
    const feedbackState = JSON.parse(savedState);

    // setam valorile campurilor de email si mesaj din formular
    emailInput.value = feedbackState.email;
    messageTextarea.value = feedbackState.message;
  }
}

function submitForm(event) {
  //previne comportamentul implicit al formularului atunci când este trimis; altfel, formularul ar încerca sa se trimita, ceea ce ar duce la o reîncărcare a paginii, dar nu dorim acest lucru aici
  event.preventDefault();

  //creare obiect numit feedbackState ce conține valorile curente ale câmpurilor din formular;
  //este utilizat pt a stoca momentan aceste valori și a le afișa în consola
  const feedbackState = {
    email: emailInput.value,
    message: messageTextarea.value,
  };

  console.log(feedbackState);

  //după afișarea datelor, ștergem starea salvată din localStorage cu cheia "feedback-form-state." , pt ca
  //formularul a fost trimis și nu mai avem nevoie de datele salvate pentru momentul actual.
  localStorage.removeItem('feedback-form-state');
}
