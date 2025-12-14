let contadorPag = 1;
let contenedor;
let peticionCurso = false;
let pelisFavoritas = [];
let listaPelis = JSON.parse(localStorage.getItem("listaPelis"));
pelisFavoritas = listaPelis;

let alturaBodyInicial = 0;
// descripcion de la pelicula con .Plot

window.onload = () => {

  // landing page
  let principal = document.getElementById("principal");
  let landing = document.getElementById("landing-Page")
  document.getElementById("goToPrncipal").addEventListener("click", () => {
    landing.style.visibility = "hidden";
    principal.style.visibility = "visible";
  })

  document.getElementById("favPelis").addEventListener("click", () => {
    // favpelis();
    if (!listaPelis)
      listaPelis = [];
    favpelis(); // sin parametros inutilll
  }
  );
  let busquedaP = document.getElementById("busqueda");

  contenedor = document.getElementById("contenedor");
  contadorPag = 2;
  peticionCurso = false;
  // primera carga
  lanzaPeti("https://www.omdbapi.com/?s=star&apikey=a63cd6f3&page=1");

  // botón de busqueda
  let boton = document.getElementById("filtrar");
  boton.addEventListener("click", () => {
    contenedor.innerHTML = "";
    busqueda();
  });


  // para que al darle enter en el input de busqueda se ejecute la busqueda
  busquedaP.addEventListener("keydown", (e) => {
    if (e.key == "Enter") {
      contenedor.innerHTML = "";
      busqueda();
    }
  });
};

function lanzaPeti(url) {
  if (!peticionCurso) {
    peticionCurso = true;
    fetch(url)
      .then(response => response.json())
      .then(data => {
        maquetarPelis(data.Search);
        peticionCurso = false;
      })

  }
}

// Función para maquetar películas
function maquetarPelis(peliArray) {
  for (let peliculas of peliArray) {

    let divCuadro = document.createElement("div");
    divCuadro.style.textAlign = "center";
    divCuadro.style.margin = "10px";

    let img = document.createElement("img");
    img.src = peliculas.Poster;
    img.style.width = "160px";
    img.style.cursor = "pointer";
    img.onerror = () => img.src = "./img/homelo.webp";

    let titulo = document.createElement("p");
    titulo.textContent = peliculas.Title;

    // listener con el imdbId
    img.addEventListener("click", () => {
      detalle(peliculas.imdbID);
      //detalleDiv(peliculas.imdbID, peliculas.Poster, peliculas.Title, peliculas.Type,peliculas.imdbRating,peliculas.Awards); // poner descripcion +
    });

    divCuadro.appendChild(img);
    divCuadro.appendChild(titulo);
    contenedor.appendChild(divCuadro);
  }
}

// Función de búsqueda
function busqueda() {
  let tipoBusqueda = document.getElementById("tipoBusqueda");
  let busqueda = document.getElementById("busqueda");
  let valorInput = busqueda.value;
  let busquedaPorTipo = "";
  if (tipoBusqueda.value == "todos") {
    busquedaPorTipo = "";
  } else if (tipoBusqueda.value == "peliculas") {
    busquedaPorTipo = "&type=movie";
  } else if (tipoBusqueda.value == "series") {
    busquedaPorTipo = "&type=series";
  }

  // por si la busqueda esta vacia
  if (valorInput == "") {
    valorInput = "star";
  }
  lanzaPeti("https://www.omdbapi.com/?s=" + valorInput + busquedaPorTipo + "&apikey=a63cd6f3&page=1");

}

// Función detalle
function detalle(id) {
  fetch("https://www.omdbapi.com/?i=" + id + "&apikey=a63cd6f3")
    .then(response => response.json())
    .then(data => {
      console.log("click en " + id);
      console.log(data); // info de la peli que hemos clickado
      // le pasamos lo valores
      detalleDiv(
        data.imdbID,
        data.Poster,
        data.Title,
        data.Type,
        data.imdbRating,
        data.Awards,
        data.Director,
        data.Actors,
        data.Plot,
        data.Year
      );
    });

}
function detalleDiv(id, imagen, tituloPeli, tipo, rating, premios, director, actores, sinop, year) {
  let overlay = document.createElement("div");
  overlay.id = "modal-detalle";

  if (!pelisFavoritas) {
    pelisFavoritas = [];
  }

  let esFav = false;
  for (let i = 0; i < pelisFavoritas.length; i++) {
    if (pelisFavoritas[i].id == id) {
      esFav = true;
    }
  }

  let imgFav = esFav ? "./img/favoritosPokeAbierta.webp" : "./img/PokeballCerrada.jpg";
  let contenido = document.createElement("div");
  contenido.className = "detalle-contenido";

  contenido.innerHTML =
    "<div class=\"poster\">" +
    "<img src=\"" + imagen + "\" onerror=\"this.src='./img/homelo.webp'\">" +
    "</div>" +
    "<div class=\"info\">" +
    "<img src=\"" + imgFav + "\" class=\"btn-favorito\">" +
    "<h2>" + tituloPeli + "</h2>" +
    "<p>Año: " + year + "</p>" +
    "<p><strong>Director:</strong> " + director + "</p>" +
    "<p><strong>Actores:</strong> " + actores + "</p>" +
    "<p><strong>Sinopsis:</strong><br>" + sinop + "</p>" +
    "<p>Tipo: " + tipo + "</p>" +
    "<p>Rating: " + rating + "</p>" +
    "<p>" + premios + "</p>" +
    "<button>Cerrar</button>";

  overlay.appendChild(contenido);
  document.body.appendChild(overlay);

  let pokeball = contenido.querySelector(".btn-favorito");
  pokeball.addEventListener("click", () => {
    let peli = {
      id: id,
      titulo: tituloPeli,
      imagen: imagen,
      tipo: tipo,
      rating: rating,
      premios: premios,
      director: director,
      actores: actores,
      sinop: sinop,
      year: year
    };

    if (esFav) {
      // quitamos de fav
      pelisFavoritas = pelisFavoritas.filter(p => p.id != id); // si no va probar cn splice
      pokeball.src = "./img/PokeballCerrada.jpg";
      esFav = false;
    } else {
      // Añadir a favoritos
      pelisFavoritas.push(peli);
      pokeball.src = "./img/favoritosPokeAbierta.webp";
      esFav = true;
    }

    localStorage.setItem("listaPelis", JSON.stringify(pelisFavoritas));
  });

  overlay.addEventListener("click", (e) => {
    if (e.target == overlay || e.target.tagName == "BUTTON") {
      overlay.remove();
    }
  });
}


// scroll infinito
window.onscroll = () => {
  let busqueda = document.getElementById("busqueda");
  let valorInput = busqueda.value;

  if (valorInput == "") {
    valorInput = "star";
  }
  // areglar para q no mande petis todo el rato
  let alturaTotalDocumento = document.documentElement.scrollHeight;
  let  scrollActual = window.innerHeight + window.scrollY;

  let acercaFinal = 1000; 
  let finalCerca = (scrollActual >= alturaTotalDocumento - acercaFinal);

  if (finalCerca && !peticionCurso) {
    let tipoBusqueda = document.getElementById("tipoBusqueda");
    let busquedaPorTipo = "";
    if (tipoBusqueda.value == "peliculas") {
      busquedaPorTipo = "&type=movie";
    } else if (tipoBusqueda.value == "series") {
      busquedaPorTipo = "&type=series";
    }

    let url = "https://www.omdbapi.com/?s=" + valorInput + busquedaPorTipo + "&apikey=a63cd6f3&page=" + contadorPag;

    lanzaPeti(url);
    console.log("Llega al final, cargando página " + contadorPag);
    contadorPag++;
  }
}

// Funcion pelis solo muestra las imagenes
function favpelis() {

  // Si ya existe el modal NO CREARR DE NUEVO
  let overlayExistente = document.getElementById("peli-detalle");
  if (overlayExistente) {
    overlayExistente.remove();
  }

  let overlay = document.createElement("div");
  overlay.id = "peli-detalle";

  let contenido = document.createElement("div");
  contenido.className = "detalle-peli-contenido";

  let idFav = "";
  contenido.innerHTML = "<h2> Peliculas Favoritas </h2>";
  if (!pelisFavoritas || pelisFavoritas.length == 0) {
    contenido.innerHTML = "<p>No tienes peliculas fav añadidas aun</p>"
  } else {
    pelisFavoritas.forEach(peli => {
      let imagen = document.createElement("img");
      imagen.src = peli.imagen;
      imagen.style.width = "100px";
      imagen.style.height = "100px";
      imagen.onerror = () => imagen.src = "./img/homelo.webp";
      contenido.appendChild(imagen);
      idFav = peli.id;
    });
  }

  // boton para cerrar
  let botonCerrar = document.createElement("button");
  botonCerrar.textContent = "Cerrar";
  contenido.appendChild(botonCerrar);

  overlay.addEventListener("click", (e) => {
    if (e.target == overlay || e.target.tagName == "BUTTON") {
      // overlay.style.display = "none";
      overlay.remove();
    } else if (e.target.tagName == "IMG") {
      detalle(idFav);
    }
  })

  // img.addEventListener("click",()=>{
  //   alert("click")
  // })

  overlay.appendChild(contenido);
  document.body.appendChild(overlay);
}