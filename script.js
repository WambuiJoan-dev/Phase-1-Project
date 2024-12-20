// Get DOM elements
const resultElement = document.getElementById("result");
const pokemonImageElement = document.getElementById("pokemonImage");
const optionsContainer = document.getElementById("options");
const pointsElement = document.getElementById("pointsValue");
const totalCount = document.getElementById("totalCount");
const mainContainer = document.getElementsByClassName("container");
const loadingContainer = document.getElementById("loadingContainer");

// Initialize variables
let usedPokemonIds = []; // Array used to store the list of already used/displayed pokemon
let showLoading = false; // Boolean used to determined HTML elements shown.
let count = 0; // 15.3) Count of total answers clicked / answers given.
let points = 0; // 15.8)

// Fetch one pokemon with and ID
async function fetchPokemonById(id) {
  // Show loading while fetching data.
  showLoading = true;

  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
}


// Function to load question with options
async function loadQuestionWithOptions() {
  // Show loading / show puzzle based on showLoading boolean.
  if (showLoading) {
    showLoadingWindow();
    hidePuzzleWindow();
  }

  // Fetch correct answer first
  let pokemonId = getRandomPokemonId();

  // Check if the current question has allready been used/displayed earlier
  while (usedPokemonIds.includes(pokemonId)) {
    pokemonId = getRandomPokemonId();
  }

  //If a pokemon has not been displayed yet, it is added to usedPokemonIds, and it is set as the new const pokemon
  usedPokemonIds.push(pokemonId);
  const pokemon = await fetchPokemonById(pokemonId);

  //Create/reset the options array with the correct answer (pokemon.name)
  const options = [pokemon.name];
  const optionsIds = [pokemon.id];

  //Fetch additional random Pokemon names to use as options
  while (options.length < 4) {
    let randomPokemonId = getRandomPokemonId();
    //Ensure fetched option does not exist in the options list. Creates a new random id until it does not exist in optionsId.
    while (optionsIds.includes(randomPokemonId)) {
      randomPokemonId = getRandomPokemonId();
    }
    optionsIds.push(randomPokemonId);

    // Fetching a random pokemon with the newly made ID, and adding it to the options array.
    const randomPokemon = await fetchPokemonById(randomPokemonId);
    const randomOption = randomPokemon.name;
    options.push(randomOption);


    // Turn of loading if all options have been fetched.
    if (options.length === 4) {
      showLoading = false;
    }
  }

  // Shuffle the 4 options array to always change the place of the right answer.
  shuffleArray(options);

  // Clear any previous result and update pokemon image to fetched image URL from the "sprites"
  resultElement.textContent = "Who's that Pokemon?";
  pokemonImageElement.src = pokemon.sprites.other.dream_world.front_default;

  //Create options HTML elements from options array in the DOM
  optionsContainer.innerHTML = ""; // Reset
  options.forEach((option, index) => {
    const button = document.createElement("button");
    button.textContent = option;
    button.onclick = (event) => checkAnswer(option === pokemon.name, event); // CheckAnswer: if option === pokemon.name => true, else false. plus event which is button click.
    optionsContainer.appendChild(button);
  });
  // Hide / Unhide HTML elements based on async status
  if (!showLoading) {
    hideLoadingWindow();
    showPuzzleWindow();
  }
}

// Initial load
loadQuestionWithOptions();

//Create check answer function
function checkAnswer(isCorrect, event) {
  //Check if any button is already selected, if falsy => no element => "null".
  const selectedButton = document.querySelector(".selected");

  // If already a button is selected, do nothing, exit function Else, mark the clicked button as selected and increase the count of quetion by 1
  if (selectedButton) {
    return;
  }
  event.target.classList.add("selected");
  count++;
  totalCount.textContent = count;

  // Choose text for right / wrong answer.
  if (isCorrect) {
    // Call displayResult function.
    displayResult("Correct answer!", "correct");
    // If correct increase the points by 1
    points++;
    pointsElement.textContent = points;
    event.target.classList.add("correct");
  } else {
    displayResult("Wrong answer...", "wrong");
    event.target.classList.add("wrong");
  }

  // Load next question with 1 sec delay for user to read the result
  setTimeout(() => {
    showLoading = true;
    loadQuestionWithOptions();
  }, 1000);
}

// Function to randomize the pokemon ID
function getRandomPokemonId() {
  return Math.floor(Math.random() * 151) + 1;
}

// Create the shuffleArray function
function shuffleArray(array) {
  return array.sort(() => Math.random() - 0.5);
}

// Function to update result text and class name
function displayResult(result) {
  resultElement.textContent = result;
}

// Hide loading window
function hideLoadingWindow() {
  loadingContainer.classList.add("hide");
}

// Show loading window
function showLoadingWindow() {
  mainContainer[0].classList.remove("show");
  loadingContainer.classList.remove("hide");
  loadingContainer.classList.add("show");
}

// Show puzzle window
function showPuzzleWindow() {
  loadingContainer.classList.remove("show");
  mainContainer[0].classList.remove("hide");
  mainContainer[0].classList.add("show");
}

// Hide puzzle window
function hidePuzzleWindow() {
  mainContainer[0].classList.add("hide");
}