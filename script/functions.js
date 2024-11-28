let currentStep = 1;
let selectedKey = null;        
let data = {};
let reload = document.getElementById("reload");

fetch('db/movies.json')
    .then(response => {
        if (!response.ok) throw new Error('Error al cargar el JSON');
        return response.json();
    })
    .then(json => {
        data = json;
        updateMovies(1);
    })
    .catch(error => console.error('Error:', error));
    
function updateMovies(step, key = null) {
    const box = document.querySelector(".box-movies");
    const title = document.querySelector(".content h2");
    const stepIndicator = document.querySelector("h4.title span");
    box.innerHTML = "";

    const stepTexts = {
        1: "Choose one of the three movies",
        2: "Which one do you like the most?",
        3: "Which one do you want to watch now?"
    };

    title.textContent = stepTexts[step];
    stepIndicator.textContent = step;
    
    let movies;
    if (step === 1) {
        movies = data.movies.step1;
    } else {
        movies = data.movies[`step${step}`][key];
    }
    
    movies.forEach((movie, index) => {
        const item = document.createElement("div");
        item.classList.add("item");
        item.innerHTML = `<img src="${movie.photo}" alt="Movie">`;
        item.addEventListener("click", () => handleSelection(step, movie.category || movie));
        setTimeout(() => {
            item.classList.add("appear");
        }, index * 100);
        box.appendChild(item);
    });
}

function handleSelection(step, value) {
    if (step < 3) {                
        selectedKey = value.category || value;
        updateMovies(step + 1, selectedKey);
        updateProgress(step + 1);
    } else {
        showModal(value.link);
    }
}

function updateProgress(step) {
    const circles = document.querySelectorAll(".progress-bar .circles div");
    
    circles.forEach(circle => circle.classList.remove("active"));
    if (circles[step - 1]) {
        circles[step - 1].classList.add("active");
    }
}

function showModal(link) {
    const modal = document.querySelector(".modal");
    const button = modal.querySelector("button");
    button.onclick = () => window.open(link, "_blank");
    modal.style.opacity = "1";
    modal.style.pointerEvents = "all";
}

reload.addEventListener("click", (_) => {
    location.reload();
});