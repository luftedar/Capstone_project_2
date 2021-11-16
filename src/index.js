import axios from 'axios';

const div = document.querySelector('.movies');

const render = (movie) => {
      div.innerHTML += `
      <div>
      <img src="${movie.image.medium}" alt="${movie.name}">
      <p>${movie.name}</p>
      <button id="${movie.id}"><i class="far fa-heart"></i></button>
      <button>Comment</button>
    </div>`;
}

const getData = async () => {
  
  const movies = await axios.get('https://api.tvmaze.com/shows?limit=5');


  movies.data.forEach((movie, index) => {
    if (index < 6) {
      render(movie);
      console.log(movie);

    }
  });
}

getData();