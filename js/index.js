'use strict'
import numbersList from './numbers.js';

let order = ['premium', 'gold', 'silver', 'combo x2', 'combo x3', 'combo x4', '000', '666', '777'] // порядок вывода категорий номеров

let sortedNumbers = sortNumbersList(numbersList);

// Сортируем массив из JSON в заданном порядке
function sortNumbersList(arr) {
	return arr.sort((a, b) => {
		return order.indexOf(a.category) - order.indexOf(b.category);
	});
}

// Функция публикации списка телефонных номеров, принимающая массив
function pushNumbersListToPage(arr) {
	const numbersList = document.querySelector('.numbers-list');


	arr.forEach(item => {
		const row = document.createElement('li')
		row.classList.add(isTripleCategory(item.category) ? 'other' : item.category.split(' ')[0])
		row.innerHTML = generateComponentInner(item)

		row.querySelector('BUTTON').addEventListener('click', function (e) {
			openPopup(e.currentTarget.dataset.num)
		})

		numbersList.insertAdjacentElement('beforeend', row)
	});

}


// Генерируем строку с номером, принимает объект
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

function showActiveBtn(el) {
	if (el.dataset.show) {
		clearCategoriesList()
		clearNumbersList()
		pushCategoriesToPage(sortedNumbers)
		pushNumbersListToPage(sortedNumbers)
	}
	if (!el.dataset.show) {
		document.querySelectorAll('.categories-list__item').forEach(item => {
			item.classList.add('hide');
			delete item.dataset.show
		})
		el.classList.remove('hide')
		!el.dataset.show ? el.dataset.show = 'true' : delete el.dataset.show
	}
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

function clearNumbersList() {
	const numbersElements = document.querySelectorAll('.numbers-list li');
	numbersElements.forEach(item => {
		item.remove();
	})
}

function clearCategoriesList() {
	const categoriesElements = document.querySelectorAll('.categories-list__item');
	categoriesElements.forEach(item => {
		item.remove();
	})
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

const popup = document.querySelector('.popup-wrapper');
const popupClose = document.querySelector('.popup-close');

function openPopup(number) {
	const popupNumber = popup.querySelector('.popup-number p');
	popup.style.display = 'flex';

	popupNumber.innerHTML = number;
}

function clearPopup() {
	const popupNumber = document.querySelector('.popup-number p');
	popupNumber.innerHTML = '';
}

function closePopup() {
	popup.style.display = 'none';
	clearPopup();
}

popup.addEventListener('click', (e) => {
	let target = e.target;
	if (target !== popup) return;
	e.stopPropagation();
	closePopup();
}, true)

popupClose.addEventListener('click', closePopup);

function start() {
	pushCategoriesToPage(sortedNumbers);
	pushNumbersListToPage(sortedNumbers);
}

start();


const popupCopyButton = document.getElementById('popup-copy'),
	popupPhone = document.querySelector('.popup-number p');


function copy(str) {
	let tmp = document.createElement('INPUT'), // Создаём новый текстовой input
		focus = document.activeElement; // Получаем ссылку на элемент в фокусе (чтобы не терять фокус)

	tmp.value = str; // Временному input вставляем текст для копирования

	document.body.appendChild(tmp); // Вставляем input в DOM
	tmp.select(); // Выделяем весь текст в input
	document.execCommand('copy'); // Магия! Копирует в буфер выделенный текст (см. команду выше)
	document.body.removeChild(tmp); // Удаляем временный input
	focus.focus(); // Возвращаем фокус туда, где был
}

popupCopyButton.onclick = function () {
	copy(popupPhone.innerHTML);
}

