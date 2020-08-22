import { UI } from "./interfaz.js";
import { API } from "./api.js";

const interfaz = new UI();
const api = new API();
let name = "";
let pages = api.pages;
let url = api.url;
showCharacters(url);
showInfoPage(url);

interfaz.prevButton.addEventListener("click", prev);

interfaz.nextButton.addEventListener("click", next);

interfaz.search.addEventListener("click", () => {
  interfaz.formulario("flex");
});
interfaz.close_search.addEventListener("click", () => {
  interfaz.formulario("none");
});
$("#form-searcher").submit(function (e) {
  e.preventDefault();
});
interfaz.searcher.addEventListener("keyup", (key) => {
  name = key.srcElement.value;
  if (name.length > 0 || name != null) {
    interfaz.clearCardContainer();
    api.getFilterCharacter(name).then((response) => {
      if (response.error) {
        interfaz.renderSinResultado(response.error);
        interfaz.paginationAll.style.display = "none";
        interfaz.infoPage.style.display = "none";
      } else {
        interfaz.paginationAll.style.display = "flex";
        interfaz.infoPage.style.display = "block";
        if (url != null) {
          let nURL = new URL(url);
          let info = "";
          if (
            nURL.searchParams.get("name") &&
            nURL.searchParams.get("page") == 2
          ) {
            info = interfaz.getInfoPage(
              nURL.searchParams.get("page") - 1,
              response.count,
              response.pages
            );
            interfaz.clearInfoPageContainer();
            interfaz.renderInfoPage(info);
            url = `https://rickandmortyapi.com/api/character?page=1&name=${name}`;
          } else {
            url = response.info.next;
          }
        }
        pages = response.info.pages;
        interfaz.noResults.style.display = "none";
        response.results.forEach((personaje) => {
          if (personaje.episode.length >= 1) {
            let firstEpisode = personaje.episode[0];
            let lastEpisode = personaje.episode[personaje.episode.length - 1];
            api.getInfoEpisode(firstEpisode).then((firstEpisode) => {
              api.getInfoEpisode(lastEpisode).then((lastEpisode) => {
                const card = interfaz.getCard(
                  personaje.id,
                  personaje.image,
                  personaje.name,
                  personaje.species,
                  personaje.status,
                  firstEpisode.name,
                  lastEpisode.name,
                  personaje.url
                );
                interfaz.renderCard(card);
              });
            });
          }
        });
        let info2 = interfaz.getInfoPage(
          1,
          response.info.count,
          response.info.pages
        );
        interfaz.clearInfoPageContainer();
        interfaz.renderInfoPage(info2);
      }
    });
  } else {
    // interfaz.paginationAll.style.display = "flex";
    // interfaz.paginationCharacter.style.display = "none";
    interfaz.clearCardContainer();
    showCharacters(url);
  }
});

function showCharacters(url) {
  setTimeout(() => {
    interfaz.spinner("none");
  }, 1000);
  api.getCharacters(url).then((response) => {
    response.forEach((personaje) => {
      if (personaje.episode.length >= 1) {
        let firstEpisode = personaje.episode[0];
        let lastEpisode = personaje.episode[personaje.episode.length - 1];
        api.getInfoEpisode(firstEpisode).then((firstEpisode) => {
          api.getInfoEpisode(lastEpisode).then((lastEpisode) => {
            const card = interfaz.getCard(
              personaje.id,
              personaje.image,
              personaje.name,
              personaje.species,
              personaje.status,
              firstEpisode.name,
              lastEpisode.name,
              personaje.url
            );
            interfaz.renderCard(card);
            document.querySelectorAll(".card").forEach((item) => {
              item.addEventListener("click", function (e) {
                e.stopPropagation();
                e.stopImmediatePropagation();
                let urlCharacter = item.getAttribute("urlCharacter");
                api.getCharacter(urlCharacter).then((response) => {
                  interfaz.modal.style.display = "block";
                  interfaz.closeModal.onclick = function () {
                    interfaz.modal.style.display = "none";
                  };
                  // Modal
                  interfaz.contentModal.innerHTML = "";
                  interfaz.titleModal.innerText = response.name;
                  let img = document.createElement("img");
                  img.src = response.image;
                  interfaz.contentModal.appendChild(img);
                  let content = document.createElement("div");
                  let contentEpisodes = document.createElement("div");
                  contentEpisodes.classList.add("episodes_rick");
                  content.classList.add("space");
                  content.innerHTML = `
                  <strong class="badge">Information: </strong>
                  <br><br>
                  <p>&lesdot; Created: ${response.created}</p>
                  <p>&lesdot; Location: ${response.location.name}</p>
                  <p>&lesdot; Gender: ${response.gender}</p>
                  <p>&lesdot; Origin: ${response.origin.name}</p>
                  <p>&lesdot; Specie: ${response.species}</p>`;
                  if (response.status == "Alive") {
                    content.innerHTML += `
                    <p>&lesdot; Status: ${response.status} <span class="stast-life alive"></span></p>`;
                  } else {
                    content.innerHTML += `
                    <p>&lesdot; Status: ${response.status} <span class="stast-life dead"></span></p>`;
                  }
                  let btnEpisodes = `<p id="episode"> &lesdot; Episodes: <span class="badge">${response.episode.length}</span></p>`;
                  content.innerHTML += btnEpisodes;
                  interfaz.contentModal.appendChild(content);
                  const boton = $("#episode");
                  response.episode.forEach((element) => {
                    api.getInfoEpisode(element).then((response) => {
                      contentEpisodes.innerHTML += `<p>&lrtri; ${response.name}</p>`;
                    });
                  });
                  $(boton).click(function () {
                    $(content.appendChild(contentEpisodes)).slideToggle();
                  });
                });
              });
            });
          });
        });
      }
    });
  });
}

function prev() {
  interfaz.spinner("block");
  api.page(url).then((response) => {
    let nURL = new URL(url);
    url = response.prev;
    if (url == null) {
      url = `https://rickandmortyapi.com/api/character?page=${api.initPage}`;
      if (nURL.searchParams.get("name")) {
        url = `https://rickandmortyapi.com/api/character?page=${api.initPage}&name=${name}`;
      }
      let container = document.getElementById("errors");
      interfaz.clearErrors();
      interfaz.renderErrors("Estas en la primer página", container);
      interfaz.spinner("none");
      setTimeout(() => {
        interfaz.clearErrors();
      }, 2500);
    } else {
      interfaz.clearCardContainer();
      showCharacters(url);
      interfaz.clearInfoPageContainer();
      showInfoPage(url);
    }
  });
}

function next() {
  interfaz.spinner("block");
  api.page(url).then((response) => {
    let nURL = new URL(url);
    url = response.next;
    if (url == null) {
      url = `https://rickandmortyapi.com/api/character?page=${pages}`;
      if (nURL.searchParams.get("name")) {
        url = `https://rickandmortyapi.com/api/character?page=${pages}&name=${name}`;
      }
      let container = document.getElementById("errors");
      interfaz.clearErrors();
      interfaz.renderErrors("Estas en la última página", container);
      interfaz.spinner("none");
      setTimeout(() => {
        interfaz.clearErrors();
      }, 2500);
    } else {
      interfaz.clearCardContainer();
      showCharacters(url);
      interfaz.clearInfoPageContainer();
      showInfoPage(url);
    }
  });
}

function showInfoPage(url) {
  api.page(url).then((response) => {
    let page = new URL(url);
    let pagina = page.searchParams.get("page");
    let info = interfaz.getInfoPage(pagina, response.count, response.pages);
    interfaz.clearInfoPageContainer();
    interfaz.renderInfoPage(info);
  });
}
