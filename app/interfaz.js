export class UI {
  constructor() {
    this.prevButton = document.getElementById("prev");
    this.nextButton = document.getElementById("next");
    this.prevCharButton = document.getElementById("prevChar");
    this.nextCharButton = document.getElementById("nextChar");
    this.formularioSearch = document.getElementById("form-search");
    this.search = document.getElementById("search");
    this.close_search = document.getElementById("close-form");
    this.searcher = document.getElementById("searcher");
    this.noResults = document.getElementById("noResults");
    this.paginationAll = document.getElementById("pagination-all");
    this.paginationCharacter = document.getElementById("pagination-character");
    this.infoPage = document.getElementById("info-page");
    this.cardCharacter = document.querySelectorAll(".card");
    this.modal = document.getElementById("modal");
    this.closeModal = document.getElementsByClassName("close")[0];
    this.titleModal = document.getElementById("title-modal");
    this.contentModal = document.getElementById("modal-content");
  }

  spinner(display) {
    const spinner = document.getElementById("spinner");
    spinner.style.display = display;
  }

  getCard(
    id,
    image,
    name,
    species,
    status,
    firstEpisode,
    lastEpisode,
    urlCharacter
  ) {
    let html = `
    <article urlCharacter=${urlCharacter} class="card pb-1" idCharacter=${id}>
        <header>
            <img
                class="img-card"
                src="${image}"
                alt="${name}_image"
            />
        </header>
        <div class="information">
            <h1>${name}</h1>
            <div class="d-flex">`;
    if (status == "Alive") {
      html += `<span class="stast-life alive"></span>`;
    } else {
      html += `<span class="stast-life dead"></span>`;
    }
    html += `<h4>${status} - ${species}</h4></div>`;
    html += `<p class="episode">First Seen In</p>
             <h5 class="name-episode">${firstEpisode}</h5>
             <p class="episode">Last known location </p>
             <h5 class="name-episode">${lastEpisode}</h5>
    </article>`;
    return html;
  }
  renderCard(card) {
    let container = document.getElementById("content");
    container.innerHTML += card;
  }
  clearCardContainer() {
    let container = document.getElementById("content");
    container.innerHTML = "";
  }
  getInfoPage(pagina, results, totalPages) {
    let html = `<p class="info-page-text">Encontramos ${results} resultados</p>
                <p class="info-page-text">Página ${pagina} de ${totalPages}</p>`;
    return html;
  }
  renderInfoPage(info) {
    let container = document.getElementById("info-page");
    container.innerHTML += info;
  }
  clearInfoPageContainer() {
    let container = document.getElementById("info-page");
    container.innerHTML = "";
  }
  renderErrors(message, container) {
    container.style.display = "block";
    const p = document.createElement("p");
    p.innerText = message;
    container.appendChild(p);
  }
  clearErrors() {
    let container = document.getElementById("errors");
    container.style.display = "none";
    container.innerHTML = "";
  }

  formulario(display) {
    this.formularioSearch.style.display = display;
  }
  renderSinResultado(error) {
    this.noResults.innerText = "";
    const p = document.createElement("p");
    p.innerText = error;
    this.noResults.style.display = "flex";
    this.noResults.appendChild(p);
  }
}
