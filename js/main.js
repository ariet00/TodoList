let message = document.querySelector('.todo-list__message')
    ,addButton = document.querySelector('.todo-list__btn')
    ,todo = document.querySelector('.todo')
    ,timerBtn = document.querySelector('.timer__btn')
    ,stopTimerBtn = document.querySelector('.timer__btn-stop')
    ,resetTimerBtn = document.querySelector('.timer__btn-reset')
    ,todoList = []
    
  
// проверяем в localStorage и если есть то рисуем их       
if (!!localStorage.getItem('todo')) {
    todoList = JSON.parse(localStorage.getItem('todo'))
    displayMessges()
}


message.addEventListener('keyup', event => { if (event.keyCode == 13 ) clickListener() }) // при нажатии кнопки Enter
addButton.addEventListener('click', clickListener)

// создаем новый Todo и пушим в todoList
function clickListener() {
    // проверяем на уникальность 
    if (0 < todoList.length) {
        todoList = JSON.parse(localStorage.getItem('todo'))
        let errTodo = todoList.filter(item => { if (item.todo === message.value) return item }) 
        if (errTodo.length !== 0) {
            if (errTodo[0].todo === message.value) {
                message.value = ''
                return
            }
        }
    }
    if (message.value === '') {
        return
    }
    const newTodo = {
        todo: message.value,
        checked: false,
        impotent: false
    }
    todoList.push(newTodo)
    localStorage.setItem('todo', JSON.stringify(todoList))
    displayMessges()
    message.value = ''
}

// добавляем новые todo
function displayMessges() {
    let displayMessage = ''
    todoList.forEach((item, i) => {
        displayMessage += `
        <li>
        <input class="check" type="checkbox" id="item__${i}"  ${item.checked ? 'checked' : ''}>
        <label for="item__${i}" class="${item.impotent ? 'impotent' : ''}">${item.todo}</label>
        <span class="close">&times</span>
        </li>`
        todo.innerHTML = displayMessage
    })
}

// добавляем  checked  
todo.addEventListener('change', event  => {
    let valueLabel = todo.querySelector('[ for='+ event.target.id +']').textContent
    todoList.forEach(item => {
        if (item.todo === valueLabel) {
            item.checked = !item.checked
            localStorage.setItem('todo', JSON.stringify(todoList))
        }
    })
})

// добавляем класс impotent при нажатии на правую кнопку мыши
todo.addEventListener('contextmenu', event => {
    event.preventDefault() //
    todoList.forEach(item => {
        if (item.todo === event.target.textContent) {
            item.impotent = !item.impotent
            displayMessges()
            localStorage.setItem('todo', JSON.stringify(todoList))
        }
    })
})

// удаляем todo при на нажатии на крестик
todo.addEventListener('click', event => {
    todoList.forEach( (item,i) => {
        if (event.target.className === 'close') {
            let current = event.path[1].children[1]
            if (item.todo === current.textContent) todoList.splice(i,1)
            localStorage.setItem('todo', JSON.stringify(todoList))
            displayMessges()
        }
    })
    if (todoList.length == 0) {
        todo.innerHTML = ''
    }
})

// Taimer Pomodoro
let timeMinute = document.querySelector('#minute')
    , timeSecond = document.querySelector('#second')
    , timeTitle = document.querySelector('.timer__title')
    , idInterval


timerBtn.addEventListener('click', timerStart)

resetTimerBtn.addEventListener('click', resetTimer)

// запускаем таймер
function timerStart() {
    timerBtn.textContent = 'Стоп'
    if (timerBtn.textContent == 'Стоп'){
        timerBtn.addEventListener('click', stopTimer)
        timerBtn.removeEventListener('click', timerStart)
    }

    idInterval = setInterval(() => {
        // сохраняем в localStorage минуты и секунды 
        localStorage.setItem('second', timeSecond.textContent)
        localStorage.setItem('minute', timeMinute.textContent)

        timeSecond.textContent = --timeSecond.textContent
        if (timeMinute.textContent == 0 && timeSecond.textContent == 0) {
            toggle()
        }
        if (timeSecond.textContent < 10) {
            timeSecond.textContent = '0' + timeSecond.textContent
            localStorage.setItem('second', timeSecond.textContent)
            if (timeSecond.textContent == 0) {
                timeSecond.textContent = 59
                timeMinute.textContent = --timeMinute.textContent
                localStorage.setItem('minute', timeMinute.textContent)
            }
        }
        
    },1000) 
}
// остановка таймера
function stopTimer() {
    clearInterval(idInterval)
    timerBtn.addEventListener('click', timerStart)
    timerBtn.textContent = 'Начать'
}
// делаем сброс таймера
function resetTimer() {
    stopTimer()
    timeTitle.textContent = 'Работа'
    timeMinute.textContent = 24
    timeSecond.textContent = 59 
    localStorage.setItem('minute', 24)
    localStorage.setItem('second', 59)
}
// переключаем режимы отдых и работа
function toggle() {
    if (timeTitle.textContent == 'Работа') {
        timeTitle.textContent = 'Отдых'
        timeMinute.textContent = 4
        timeSecond.textContent = 59
    }else {
        timeTitle.textContent = 'Работа'
        timeMinute.textContent = 24
        timeSecond.textContent = 59  
    }
}
// получаем инфу в localStorage 
let saveSecond = localStorage.getItem('second')
let saveMinute = localStorage.getItem('minute')
// и если они есть то их вставляем
if (!!saveMinute && !!saveSecond) {
    timeSecond.textContent = saveSecond
    timeMinute.textContent = saveMinute
}