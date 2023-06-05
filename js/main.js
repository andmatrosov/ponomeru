'use strict'
import numbersList from './numbers.js';

let order = ['premium', 'gold', 'silver', 'combo x2', 'combo x3', 'combo x4', '000', '666', '777'] // порядок вывода категорий номеров
let sortedNumbers = sortNumbersList(numbersList);



function startApp() {
	pushCategoriesToPage(sortedNumbers) // функция генерации списка категорий
	pushNumbersListToPage(sortedNumbers) // функция генерации списка номеров на страницу
}


function pushNumbersListToPage(arr) {
	const numbersList = document.querySelector('.numbers-list');
	arr.forEach(item => {
		const row = document.createElement('li')
		row.classList.add(isTripleCategory(item.category) ? 'other' : item.category.split(' ')[0])
		row.innerHTML = generateComponentInner(item)

		numbersList.insertAdjacentElement('beforeend', row)
	})
}

function pushCategoriesToPage(arr) {
	const categoriesListWrapper = document.querySelector('.categories-list');
	const categoriesList = getCategories(arr);

	categoriesList.forEach(item => {
		let categoryBtn = document.createElement('button');
		let otherCategory = isTripleCategory(item) ? 'other' : item.trim().replace(' ', '_');

		categoryBtn.classList.add(`categories-list__item`, `${otherCategory.split('_')[0]}`);
		categoryBtn.dataset.category = item.trim().replace(' ', '_')

		categoryBtn.innerHTML = `
					<span class="item-inner">${item}</span>
					<span class="line-1"></span>
					<span class="line-2"></span>
					<span class="line-3"></span>
					<span class="line-4"></span>
		`;
		categoryBtn.addEventListener('click', (e) => {
			const target = e.target;
			const category = target.parentElement.dataset.category.replace('_', ' ');

			showNumbersOfCategory(category);
			showActiveBtn(target.parentElement);

		})
		categoriesListWrapper.insertAdjacentElement('beforeend', categoryBtn);
	})
}

function generateComponentInner(item) {
	return (`
		<div>
			<span>${item.category}</span>
			<span class="line-1"></span>
			<span class="line-2"></span>
			<span class="line-3"></span>
			<span class="line-4"></span>
		</div>
		<div>
			<span class="number-list__number">${item.number}</span>
			<span class="line-1"></span>
			<span class="line-2"></span>
			<span class="line-3"></span>
			<span class="line-4"></span>
		</div>
		<div>
			<span>${item.price}</span>
			<span class="line-1"></span>
			<span class="line-2"></span>
			<span class="line-3"></span>
			<span class="line-4"></span>
		</div>
		<button data-num="${item.number}">
			<span>Take 👋</span>
			<span class="line-1"></span>
			<span class="line-2"></span>
			<span class="line-3"></span>
			<span class="line-4"></span>
		</button>
	`);
}



// Сортируем массив из JSON в заданном порядке
function sortNumbersList(arr) {
	return arr.sort((a, b) => {
		return order.indexOf(a.category) - order.indexOf(b.category);
	});
}

// Формируем список категорий без повторений
function getCategories(arr) {
	let categories = []
	arr.forEach(item => {
		if (!categories.includes(item.category)) {
			categories.push(item.category);
		}
	})
	return categories;
}

function isTripleCategory(str) {
	if (str.length === 0) {
		return false;
	}

	const firstCharacter = str[0];
	for (let i = 1; i < str.length; i++) {
		if (str[i] !== firstCharacter) {
			return false;
		}
	}
	return true;
}

function clearNumbersList() {
	const numbersElements = document.querySelectorAll('.numbers-list li');
	numbersElements.forEach(item => {
		item.remove();
	})
}

function showNumbersOfCategory(category) {
	let categoryNumbersList = sortedNumbers.map(item => {
		if (item.category == category) {
			return item
		}
	}).filter(item => item ? item : null)

	clearNumbersList()
	pushNumbersListToPage(categoryNumbersList)
}

function showActiveBtn(btn) {
	const categoryBtns = [...document.querySelectorAll('.categories-list__item')];


	categoryBtns.forEach(item => {
		item.classList.add('hide') // затемняем все кнопки
		delete item.dataset.flag;

		if (item == btn && !item.dataset.flag) {
			item.dataset.flag = 'show';
			item.classList.remove('hide');

		} else if (item === btn && item.dataset.flag) {
			clearNumbersList();
			delete item.dataset.flag;

			pushNumbersListToPage(sortedNumbers);
			removeHideClass(categoryBtns)
		}
	})
}

function removeHideClass(arr) {
	arr.forEach(item => {
		item.classList.remove('hide')
	})
}


startApp()