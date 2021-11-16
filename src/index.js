import axios from 'axios';

const div = document.querySelector('.movies');
const comments = document.querySelector('.comments');
const body = document.querySelector('body');
const movies = [];

const render = (movie) => {
  div.innerHTML += `
  <div id="${movie.id}">
  <img src="${movie.image.medium}" alt="${movie.name}">
  <p>${movie.name}</p>
  <button><i class="far fa-heart"></i></button>
  <button class="comment-button">Comment</button>
  </div>`;
};

const getData = async () => {
  const movies = await axios.get('https://api.tvmaze.com/shows?limit=5');
  movies.data.forEach((movie, index) => {
    if (index < 6) {
      render(movie);
    }
  });
};

const renderComments = () => {
  axios.get('https://api.tvmaze.com/shows?limit=5')
    .then((res) => res.data)
    .then((dev) => movies.push(...dev.slice(0, 6)));
};

body.addEventListener('click', (e) => {
  if (e.target.className === 'comment-button') {
    comments.innerHTML = `
    <div id='pop'>
      <img src="${movies[parseInt(e.target.parentNode.id) - 1].image.medium}" alt="${movies[parseInt(e.target.parentNode.id) - 1].name}">
      <h1>${movies[parseInt(e.target.parentNode.id) - 1].name}</h1>
      <div id='comment-feature'>
        <p> Rating: ${movies[parseInt(e.target.parentNode.id) - 1].rating.average}</p>
        <p> Released Date: ${movies[parseInt(e.target.parentNode.id) - 1].premiered}</p>
        <p> Genres: ${movies[parseInt(e.target.parentNode.id) - 1].genres}</p>
        <p> Language: ${movies[parseInt(e.target.parentNode.id) - 1].language}</p>
      </div>
    </div>`;
  }
});

renderComments();
getData();