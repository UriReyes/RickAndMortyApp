export class API {
  constructor() {
    this.url = "https://rickandmortyapi.com/api/character?page=1";
    this.pages = 30;
    this.initPage = 1;
  }

  async getCharacters(url) {
    return fetch(url)
      .then((result) => result.json())
      .then((data) => data.results)
      .catch((error) => console.log(error));
  }
  async getCharacter(urlCharacter) {
    return fetch(urlCharacter)
      .then((response) => response.json())
      .then((data) => data)
      .catch((error) => console.log(error));
  }

  async page(url) {
    return fetch(url)
      .then((data) => data.json())
      .then((response) => response.info)
      .catch((error) => console.log(error));
  }
  async getFilterCharacter(name) {
    let url = `https://rickandmortyapi.com/api/character/?name=${name}`;
    return fetch(url)
      .then((data) => data.json())
      .then((response) => response)
      .catch((error) => console.log(error));
  }

  async getInfoEpisode(url) {
    const response = await fetch(url);
    const data = await response.json();
    return data;
  }
}
