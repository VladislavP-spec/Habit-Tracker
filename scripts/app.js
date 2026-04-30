"use strict";

let habbits = [];
const HABBIT_KEY = 'HABBIT_KEY';
let globalactiveHabbitId;

/* page */ 

const page = {
	menu: document.querySelector('.menu__list'),
	header: {
		h1: document.querySelector('.h1'),
		progressPercent: document.querySelector('.progress__percent'),
		progressCoverBar: document.querySelector('.progress__cover-bar'),
	},
	main: {
		daysContainer: document.getElementById('days'),
		nextDay: document.querySelector('.habbit__day'),
		// habbitDelete: document.querySelector('.habbit-delete'),
		// habbitForm: document.querySelector('.habbit-form'),
		// habbitImg: document.querySelector('.habbit-img'),
		habbitInput: document.querySelector('.habbit__input'),
		// habbitCreate: document.querySelector('.habbit-create'),
	}
}

/* utils */

function loadData() {
	const habbitsString = localStorage.getItem(HABBIT_KEY);
	const habbitArray = JSON.parse(habbitsString);
	if (Array.isArray(habbitArray)) {
		habbits = habbitArray;
	}
}

function saveData() {
	localStorage.setItem(HABBIT_KEY, JSON.stringify(habbits));
}

/* render */ 

function rerenderMenu (activeHabbit) {
	for (const habbit of habbits) {
		const existed = document.querySelector(`[menu-habbit-id = "${habbit.id}"]`);		
		if (!existed) {
			// создание
			const element = document.createElement('button');
			element.setAttribute('menu-habbit-id', habbit.id);
			element.classList.add('menu__item');
			element.addEventListener('click', () => rerender(habbit.id));
			element.innerHTML = `<img src="./images/${habbit.icon}.svg" alt="${habbit.name}" />`;
			if (activeHabbit.id === habbit.id) {
				element.classList.add('menu__item_active');
			}
			page.menu.appendChild(element);
			continue;
		}
		if (activeHabbit.id === habbit.id) {
			existed.classList.add('menu__item_active');
		} else {
			existed.classList.remove('menu__item_active');
		}
	}
}

function rerenderHead (activeHabbit) {
	page.header.h1.innerText = activeHabbit.name;
	const progress = activeHabbit.days.length / activeHabbit.target > 1
		? 100
		: activeHabbit.days.length / activeHabbit.target * 100;
	page.header.progressPercent.innerText = Math.round(progress) + ' %';
	page.header.progressCoverBar.style.width = progress + '%';

}	

function rerenderContent (activeHabbit) {
	page.main.daysContainer.innerText = '';
	for	 (const index in activeHabbit.days) {
		const element = document.createElement('div');
		element.classList.add('habbit');
		element.innerHTML = 
						`<div class="habbit__day">День ${Number(index) + 1}</div>
              <div class="habbit__comment">${activeHabbit.days[index].comment}</div>
              <button class="habbit__delete">
                <img src="./images/delete.svg" alt="Удалить день ${Number(index)+1}">
              </button>`;
							
		page.main.daysContainer.appendChild(element);
	}
	page.main.nextDay.innerText = `День ${activeHabbit.days.length + 1}`;	
} 

function rerender (activeHabbitId) {
	globalactiveHabbitId = activeHabbitId;
	const activeHabbit = habbits.find(habbit => habbit.id === activeHabbitId);
	if (!activeHabbit) {
	return;
	}
	rerenderMenu(activeHabbit);
	rerenderHead(activeHabbit);
	rerenderContent(activeHabbit);
}

/* work with days */

function addDays (event) {	
	const form = event.target;
	event.preventDefault();
	const data = new FormData(event.target);
	// console.log(data.get('comment'));
	const comment = data.get('comment');
	// page.main.habbitInput.classList.remove('habbit__input_error');
	form['comment'].classList.remove('habbit__input_error');
	if (!comment) {
		// page.main.habbitInput.classList.add('habbit__input_error');
		form['comment'].classList.add('habbit__input_error');	
		return;
	}
	habbits = habbits.map(habbit => {
		if (habbit.id === globalactiveHabbitId) {
			return { ...habbit,
				days: habbit.days.concat([{comment}]),
			}
		}
		return habbit;
	})	
	// console.log(page.main.habbitInput.value);
	// console.log(form['comment'].value);	
	// page.main.habbitInput.value = '';		
		form['comment'].value = '';	
	rerender(globalactiveHabbitId);
	saveData();
}

/* init */ 

(() => {
loadData();
rerender(habbits[0].id)
})()


