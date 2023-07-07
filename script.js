// Import language data modules
import { en } from './assets/data/en.js';
import { pt } from './assets/data/pt.js';
import { es } from './assets/data/es.js';

// Define the language data object
const languageData = {
    currentLang: en, // Set the default language to English
    en: en, // English language data
    pt: pt, // Portuguese language data
    es: es, // Spanish language data
};





// Function to change the language
function changeLanguage(e) {
    const lang = e.target.value;
    localStorage.setItem("lang", lang); // Save the selected language in localStorage
    render_screen_II(languageData[lang]); // Render the appropriate screen based on the selected language
    languageData.currentLang = languageData[lang]; // Update the currentLang property to the selected language
}

// Function to add a span tag to the "number" word in the game title
function add_span_title(lang) {
    let gameTitle = lang.gameTitle.split(" ");

    // Check if the last word in the game title is "Número" (Portuguese for "Number")
    if (gameTitle[gameTitle.length - 1] === "Número") {
        gameTitle = `${gameTitle[0]} ${gameTitle[1]} ${gameTitle[2]} ${gameTitle[3]} <span>${gameTitle[4]}</span>`;
    } else {
        gameTitle = `${gameTitle[0]} ${gameTitle[1]} <span>${gameTitle[2]}</span> ${gameTitle[3]}`;
    }

    return gameTitle;
}

function get_ramdom_number(x, y) {
    // Calculate the range
    const range = y - x + 1

    // Generate a random number within the range
    const randomNumber = Math.floor(Math.random() * range) + x
    return randomNumber
}

function render_screen_V(lang, gameElement){
    const contentElement = document.querySelector(".content");
    let gameTitle = add_span_title(lang);

    const game = gameElement || JSON.parse(localStorage.getItem("game"))
    // HTML template for the second screen
    const template = `
    <div class="screen" id="screen5">
        <div class="top">
           
            <h1 id="gameTitle">${gameTitle}</h1>
            <p id="sucessMessage" class="t-small">${lang.winnerPhrase_I}, ${game.user.username}! ${lang.winnerPhrase_II}</p>
            <p id="attemptsNumber">Attempts: ${game.attemptedNumbers.length}</p>

        </div>

        <div class="bottom">
            <p class="t-small">${lang.winnerLabel}</p>
            <div id="selectionButtons" class="buttons">
                <button value="playAgain">${lang.winnerPlayAgain}</button>
                <button value="changeDifficulty">${lang.winnerChangeDifficulty}</button>
            </div>
        </div>
       
     </div>
    `;

    contentElement.innerHTML = template;

     // Add event listener to the language selection buttons
     const selectionButtons = document.querySelector("#selectionButtons");
     selectionButtons.addEventListener("click", function (event) {
        localStorage.removeItem("attemptedNumbers")
        localStorage.removeItem("randomNumber")
        localStorage.removeItem("renderNumbers")

        if(event.target.value === "playAgain"){
           
            render_screen_IV(lang)
        }else if(event.target.value === "changeDifficulty"){

            render_screen_III(lang)
        }
       
     });
}
function render_screen_IV(lang) {
    const contentElement = document.querySelector(".content");
    let gameTitle = add_span_title(lang);

    const user = JSON.parse(localStorage.getItem('user'))
    const difficulty = localStorage.getItem('difficulty')
    const attemptedNumbers = JSON.parse(localStorage.getItem('attemptedNumbers')) || []
    const renderNumbers = localStorage.getItem('renderNumbers') || ""

 

    const game = {
        user,
        difficulty,
        numbersRange: null,
        maxNumber: null,
        minNumber: 1,
        attemptedNumbers,
        renderNumbers,
        randomNumber: null
    }

   


    switch (difficulty) {
        case lang.selectDifficultOptions[0]:
            game.numbersRange = "1 - 10"
            game.maxNumber = 10
            break;
        case lang.selectDifficultOptions[1]:
            game.numbersRange = "1 - 50"
            game.maxNumber = 50

            break;
        case lang.selectDifficultOptions[2]:
            game.numbersRange = "1 - 100"
            game.maxNumber = 100

            break;
        default:
            game.numbersRange = "1 - 10"
            game.maxNumber = 10

    }

    if (!localStorage.getItem('randomNumber')) {
        game.randomNumber = get_ramdom_number(game.minNumber, game.maxNumber);
        localStorage.setItem('randomNumber', game.randomNumber);
    } else {
        game.randomNumber = parseInt(localStorage.getItem('randomNumber'));
    }
    

    // game.randomNumber = randomNumber
    // const game = {
    //     user,
    //     difficulty: localStorage.getItem('difficulty'),
    //     lang: localStorage.getItem('lang')
    // }
    // HTML template for the second screen
    const template = `
    <div class="screen" id="screen3">
        <div class="top">
            <nav>
                <button id="previousPage">
                    <span class="icon-left-arrow"></span> 
                    <p>${lang.previousPageAttempt}</p>
                </button>
            </nav>
            <h1 id="gameTitle">${gameTitle}</h1>
            <div id="user-info">
                <p>Difficulty: <span>${game.difficulty}</span> </p>
                <p>Username: <span>${game.user.username}</span> </p>
                <p>Numbers: <span>${game.numbersRange}</span> </p>
            </div>
            <div id="attempts">
                <h3>Attempts</h3>
                <p id="insertAttempts">${game.renderNumbers}</p>
            </div>
        </div>
        <div class="bottom">
        <div id="errorMessage"></div>
        <form id="getAttemptForm">
            <div class="form-control">
                <label class="t-small">${lang.attemptLabel}</label>
                <input type="text" id="attempt" name="username" placeholder="${lang.attemptPlaceholder}"/>
            </div>
            <div class="form-control">
                <button id="submitUsername">
                    <p>${lang.attemptSubmitButton}</p>
                    <span class="icon-left-arrow"></span> 
                </button>
            </div>
        </form>
    </div>
     </div>
    `;

    contentElement.innerHTML = template;

    const previousPageButton = document.querySelector('#previousPage');
    previousPageButton.addEventListener('click', () => {
        render_screen_III(lang); // Render the first screen when the button is clicked
    });



    const getAttemptForm = document.querySelector('#getAttemptForm');
    const attemptInput = document.querySelector('#attempt')
    const errorMessage = document.querySelector('#errorMessage')
    const insertAttempts = document.querySelector('#insertAttempts')



    getAttemptForm.addEventListener('submit', (event) => {
        event.preventDefault()
        let message = false


        if (attemptInput.value.trim().length === 0 || isNaN(parseInt(attemptInput.value)) || attemptInput.value < game.minNumber || attemptInput.value > game.maxNumber) {
            message = "Por favor, digite um número válido"
        } else if (game.attemptedNumbers.includes(attemptInput.value)) {
            message = "Você já digitou esse número"
        } else {
            game.attemptedNumbers.push(attemptInput.value)

            game.renderNumbers = game.attemptedNumbers.join(" - ");

            localStorage.setItem('attemptedNumbers', JSON.stringify(game.attemptedNumbers))
            localStorage.setItem('renderNumbers', game.renderNumbers)

            insertAttempts.innerHTML = game.renderNumbers
            if(game.randomNumber === parseInt(attemptInput.value)){
                render_screen_V(lang, game)
            }
        }


        if (message) {
            errorMessage.innerHTML = `<p>${message}</p>`
            errorMessage.classList.toggle('active')
            setTimeout(() => {
                errorMessage.classList.toggle('active')
            }, 3000)
        }


        // if (attemptInput.value.trim().length === 0) {
        //     errorMessage.innerHTML = `<p><span>422</span> Digite um username válido</p>`
        //     errorMessage.classList.toggle('active')
        //     setTimeout(() => {
        //         errorMessage.classList.toggle('active')
        //     }, 3000)
        // } else {
        //     user.username = usernameInput.value
        //     localStorage.setItem('user', JSON.stringify(user))

        //     render_screen_III(lang)
        // }


    })

    localStorage.setItem("game", JSON.stringify(game))
}

function render_screen_III(lang) {
    const contentElement = document.querySelector(".content");
    let gameTitle = add_span_title(lang);

    // HTML template for the second screen
    const template = `
    <div class="screen" id="screen3">
        <div class="top">
            <nav>
                <button id="previousPage">
                    <span class="icon-left-arrow"></span> 
                    <p>${lang.previousDifficult}</p>
                </button>
            </nav>
            <h1 id="gameTitle">${gameTitle}</h1>
            <p id="gameDescription" class="t-small">${lang.gameDescription}</p>
        </div>
        <div class="bottom">
            <p class="t-small">${lang.selectDifficultLabel}</p>
            <div id="difficultButtons" class="buttons">
                <button value="${lang.selectDifficultOptions[0]}">${lang.selectDifficultOptions[0]}</button>
                <button value="${lang.selectDifficultOptions[1]}">${lang.selectDifficultOptions[1]}</button>
                <button value="${lang.selectDifficultOptions[2]}">${lang.selectDifficultOptions[2]}</button>
            </div>
        </div>
     </div>
    `;

    contentElement.innerHTML = template;


    const previousPageButton = document.querySelector('#previousPage');
    previousPageButton.addEventListener('click', () => {
        render_screen_II(lang); // Render the first screen when the button is clicked
    });



    // Add event listener to the language selection buttons
    const difficultButtons = document.querySelector("#difficultButtons");
    difficultButtons.addEventListener("click", function (event) {
        if (event.target.matches("button")) {
            localStorage.setItem("difficulty", event.target.value)
            render_screen_IV(lang)
            //  changeLanguage(event); // Call the changeLanguage function when a language button is clicked
        }
    });

}
// Function to render the second screen with user input form
function render_screen_II(lang) {
    const contentElement = document.querySelector(".content");
    let gameTitle = add_span_title(lang);

    let user = {}
    let username = null
    if (localStorage.getItem('user')) {
        user = JSON.parse(localStorage.getItem('user'))
        username = user.username

    } else {
        user = {
            username: "",
            attempts: []
        }
        username = lang.usernamePlaceholder
    }


    // HTML template for the second screen
    const template = `
    <div class="screen" id="screen2">
        <div class="top">
            <nav>
                <button id="previousPage">
                    <span class="icon-left-arrow"></span> 
                    <p>${lang.previousPageUsername}</p>
                </button>
            </nav>
            <h1 id="gameTitle">${gameTitle}</h1>
            <p id="gameDescription" class="t-small">${lang.gameDescription}</p>
        </div>
        <div class="bottom">
            <div id="errorMessage"></div>
            <form id="getUsernameForm">
                <div class="form-control">
                    <label class="t-small">${lang.usernameLabel}</label>
                    <input type="text" id="username" name="username" placeholder="${username}"/>
                </div>
                <div class="form-control">
                    <button id="submitUsername">
                        <p>${lang.usernameSubmitButton}</p>
                        <span class="icon-left-arrow"></span> 
                    </button>
                </div>
            </form>
        </div>
     </div>
    `;

    contentElement.innerHTML = template;

    // Add event listener to the "Previous Page" button
    const previousPageButton = document.querySelector('#previousPage');
    previousPageButton.addEventListener('click', () => {
        render_screen_I(lang); // Render the first screen when the button is clicked
    });


    const getUsernameForm = document.querySelector('#getUsernameForm');
    const usernameInput = document.querySelector('#username')
    const errorMessage = document.querySelector('#errorMessage')

    getUsernameForm.addEventListener('submit', (event) => {
        event.preventDefault()
        if (usernameInput.value.trim().length === 0) {
            errorMessage.innerHTML = `<p>Digite um username válido</p>`
            errorMessage.classList.toggle('active')
            setTimeout(() => {
                errorMessage.classList.toggle('active')
            }, 3000)
        } else {
            user.username = usernameInput.value
            localStorage.setItem('user', JSON.stringify(user))

            render_screen_III(lang)
        }


    })
   




}

// Function to render the first screen with language selection buttons
function render_screen_I(lang) {
    const contentElement = document.querySelector(".content");
    let gameTitle = add_span_title(lang);

    // HTML template for the first screen
    const template = `
    <div class="screen" id="screen1">
        <div class="top">
            <h1 id="gameTitle">${gameTitle}</h1>
            <p id="gameDescription" class="t-small">${lang.gameDescription}</p>
        </div>
        <div class="bottom">
            <p class="t-small">${lang.selectLanguageTitle}</p>
            <div id="languageButtons" class="buttons">
                <button value="en">${lang.selectLanguageOptions[0]}</button>
                <button value="pt">${lang.selectLanguageOptions[1]}</button>
                <button value="es">${lang.selectLanguageOptions[2]}</button>
            </div>
        </div>
     </div>
    `;

    contentElement.innerHTML = template;

    // Add event listener to the language selection buttons
    const languageButtons = document.querySelector("#languageButtons");
    languageButtons.addEventListener("click", function (event) {
        if (event.target.matches("button")) {
            changeLanguage(event); // Call the changeLanguage function when a language button is clicked
        }
    });
}

// Function to initialize the application
function init() {
    const loadingScreen = document.querySelector(".loader-container");
    const contentElement = document.querySelector(".content");

    // Delay the rendering of the content for 1 second (simulating a loading screen)
    setTimeout(() => {
        loadingScreen.classList.toggle("active");
        contentElement.classList.toggle("active");

        let storedLanguage = localStorage.getItem("lang");
        let userData = JSON.parse(localStorage.getItem("user"));
        let difficulty = localStorage.getItem("difficulty");
        let game = localStorage.getItem("game");

       

        if (difficulty && userData && storedLanguage) {
            render_screen_IV(languageData[storedLanguage])
        }
        if (game && storedLanguage) {
            render_screen_V(languageData[storedLanguage])
        }
        if (!difficulty) {
            render_screen_III(languageData[storedLanguage])
        }

        if (!userData) {
            render_screen_II(languageData[storedLanguage])
        }

        console.log(storedLanguage, languageData, )
        if (!storedLanguage) {
            render_screen_I(languageData["en"])
        }


        // Render the appropriate screen based on the stored language, or render the first screen with English as the default language
    }, 1000);
}

init(); // Call the init function to start the application
