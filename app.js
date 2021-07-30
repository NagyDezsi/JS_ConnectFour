//Referenciák
const nyitoLap = document.querySelector("#nyitolap");
const jatekOldal = document.querySelector("#jatekoldal");
const startGomb = document.querySelector("#startGomb");
const visszaGomb = document.querySelector("#visszaGomb");
const ujJatekGomb = document.querySelector("#ujJatekGomb");
const input1 = document.querySelector("#elso");
const input2 = document.querySelector("#masodik");
const kovetkezoDiv = document.querySelector("#kovetkezo");
const ul = document.querySelector("ul");
let jatekAllapot = 0;
let nevek = {
    1: '1. játékos (piros)',
    2: '2. játékos (sárga)',
    elsoGyozelmek: 0,
    dontetlenek: 0,
    masodikGyozelmek: 0,
}

//Váltás a játékoldalra, nevek elmentése
startGomb.addEventListener('click', onStartClick);
function onStartClick() {
    jatekOldal.style.display = "block";
    nyitoLap.style.display = "none";
    ujJatekGomb.disabled = true;
    visszaGomb.disabled = true;
    jatekAllapot = 1;
    if (input1.value && input2.value) {
        nevek[1] = input1.value;
        nevek[2] = input2.value;
    }
    nevek['elsoGyozelmek'] = 0;
    nevek['dontetlenek'] = 0;
    nevek['masodikGyozelmek'] = 0;
    kovetkezoDiv.innerHTML = `${nevek[1]} következik!`;
    for (let i = 0; i < cellak.length; i++) {
        cellak[i].style.backgroundColor = 'white';
        cellak[i].addEventListener('click', korongdobas);
    }
}

//Új játék indítása
ujJatekGomb.addEventListener('click', onUjJatekClick);
function onUjJatekClick() {
    ujJatekGomb.disabled = true;
    visszaGomb.disabled = true;
    jatekAllapot = 1;
    kovetkezoDiv.innerHTML = `${nevek[1]} következik!`;
    for (let i = 0; i < cellak.length; i++) {
        cellak[i].style.backgroundColor = 'white';
        cellak[i].addEventListener('click', korongdobas);
    }
}

//Váltás a nyitólapra
visszaGomb.addEventListener('click', onVisszaClick);
function onVisszaClick() {
    jatekOldal.style.display = "none";
    nyitoLap.style.display = "block";
    jatekAllapot = 0;
    input1.value = "";
    input2.value = "";
    ul.innerHTML += `<li><span>${nevek[1]} - ${nevek[2]}</span><br>
                            (${nevek[1]} győzelmeinek száma: ${nevek['elsoGyozelmek']};
                            Döntetlenek száma: ${nevek['dontetlenek']};
                            ${nevek[2]} győzelmeinek száma: ${nevek['masodikGyozelmek']})</li>`;
}

//Nevek bemásolása az input mezőkbe
ul.addEventListener('click', function(e) {
    if (e.target.matches('li span')) {
        let paros = [];
        paros = e.target.innerHTML.split(' - ');
        input1.value = paros[0];
        input2.value = paros[1];
    }
})

//----------Játéklogika----------
const sorok = document.getElementsByTagName("tr");
const cellak = document.getElementsByTagName("td");
let jelenlegiJatekos = 1;

function korongdobas(e) {
    if (jatekAllapot === 2) {
        return;
    }

    let kattintottOszlop = e.target.cellIndex;
    let sorTomb = [];

    for (let i = 5; i > -1; i--) {
        if (sorok[i].children[kattintottOszlop].style.backgroundColor === 'white') {
            sorTomb.push(sorok[i].children[kattintottOszlop]);
        }
    }

    if (e.target.style.backgroundColor === 'white' && jelenlegiJatekos === 1) {
        sorTomb[0].style.backgroundColor = 'red';
        if (vizszintesVizsgalat() || fuggolegesVizsgalat() || atlosVizsgalat1() || atlosVizsgalat2()) {
            jatekAllapot = 2;
            ujJatekGomb.disabled = false;
            visszaGomb.disabled = false;
            nevek['elsoGyozelmek'] += 1;
            return kovetkezoDiv.innerHTML = `${nevek[1]} nyert!`;
        } else if (dontetlenVizsgalat()) {
            jatekAllapot = 2;
            ujJatekGomb.disabled = false;
            visszaGomb.disabled = false;
            nevek['dontetlenek'] += 1;
            return kovetkezoDiv.innerHTML = `Döntetlen!`;
        } else {
            jelenlegiJatekos = 2;
            kovetkezoDiv.innerHTML = `${nevek[2]} következik!`;
        }
    } else if (e.target.style.backgroundColor === 'white' && jelenlegiJatekos === 2) {
        sorTomb[0].style.backgroundColor = 'yellow';
        if (vizszintesVizsgalat() || fuggolegesVizsgalat() || atlosVizsgalat1() || atlosVizsgalat2()) {
            jatekAllapot = 2;
            ujJatekGomb.disabled = false;
            visszaGomb.disabled = false;
            nevek['masodikGyozelmek'] += 1;
            return kovetkezoDiv.innerHTML = `${nevek[2]} nyert!`;
        } else if (dontetlenVizsgalat()) {
            jatekAllapot = 2;
            ujJatekGomb.disabled = false;
            visszaGomb.disabled = false;
            nevek['dontetlenek'] += 1;
            return kovetkezoDiv.innerHTML = `Döntetlen!`;
        } else {
            jelenlegiJatekos = 1;
            kovetkezoDiv.innerHTML = `${nevek[1]} következik!`;
        }
    }
}

function vizszintesVizsgalat() {
    for (let i = 0; i < 6; i++) {
        for (let j = 0; j < 4; j++) {
            if (sorok[i].children[j].style.backgroundColor !== 'white' &&
                sorok[i].children[j].style.backgroundColor === sorok[i].children[j+1].style.backgroundColor &&
                sorok[i].children[j+1].style.backgroundColor === sorok[i].children[j+2].style.backgroundColor &&
                sorok[i].children[j+2].style.backgroundColor === sorok[i].children[j+3].style.backgroundColor) {
                    return true;
                }
        }
    }
}

function fuggolegesVizsgalat() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 7; j++) {
            if (sorok[i].children[j].style.backgroundColor !== 'white' &&
                sorok[i].children[j].style.backgroundColor === sorok[i+1].children[j].style.backgroundColor &&
                sorok[i+1].children[j].style.backgroundColor === sorok[i+2].children[j].style.backgroundColor &&
                sorok[i+2].children[j].style.backgroundColor === sorok[i+3].children[j].style.backgroundColor) {
                    return true;
                }
        }
    }
}

function atlosVizsgalat1() {
    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 4; j++) {
            if (sorok[i].children[j].style.backgroundColor !== 'white' &&
                sorok[i].children[j].style.backgroundColor === sorok[i+1].children[j+1].style.backgroundColor &&
                sorok[i+1].children[j+1].style.backgroundColor === sorok[i+2].children[j+2].style.backgroundColor &&
                sorok[i+2].children[j+2].style.backgroundColor === sorok[i+3].children[j+3].style.backgroundColor) {
                    return true;
                }
        }
    }
}

function atlosVizsgalat2() {
    for (let i = 0; i < 3; i++) {
        for (let j = 6; j > 2; j--) {
            if (sorok[i].children[j].style.backgroundColor !== 'white' &&
                sorok[i].children[j].style.backgroundColor === sorok[i+1].children[j-1].style.backgroundColor &&
                sorok[i+1].children[j-1].style.backgroundColor === sorok[i+2].children[j-2].style.backgroundColor &&
                sorok[i+2].children[j-2].style.backgroundColor === sorok[i+3].children[j-3].style.backgroundColor) {
                    return true;
                }
        }
    }
}

function dontetlenVizsgalat() {
    for (let i = 0; i < cellak.length; i++) {
        if (cellak[i].style.backgroundColor === 'white') {
            return false;
        }
    }
    return true;
}
