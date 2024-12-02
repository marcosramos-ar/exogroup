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

    // Mostrar un loader mientras se cargan las imágenes
    const loader = document.createElement("div");
    loader.classList.add("loader");
    box.appendChild(loader);

    let movies;
    if (step === 1) {
        movies = data.movies.step1;
    } else {
        movies = data.movies[`step${step}`][key];
    }

    const promises = movies.map((movie, index) => new Promise(resolve => {
        const item = document.createElement("div");
        item.classList.add("item");

        const img = document.createElement("img");
        img.src = movie.photo;
        img.alt = "Movie";

        img.onload = () => {
            item.appendChild(img);
            resolve(item); // Resolver cuando el elemento esté listo
        };

        item.addEventListener("click", () => handleSelection(step, movie.category || movie));
    }));

    // Esperar a que todas las imágenes estén cargadas
    Promise.all(promises).then(items => {
        loader.remove(); // Ocultar el loader
        items.forEach((item, index) => {
            box.appendChild(item); // Agregar el elemento al DOM
            
            // Forzar un "repaint" antes de aplicar la clase `.appear`
            setTimeout(() => {
                item.classList.add("appear");
            }, index * 100); // Aplicar animación escalonada
        });
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