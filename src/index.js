import axios from 'axios';

const div = document.querySelector('.movies');
const comments = document.querySelector('.comments');
const body = document.querySelector('body');
let movies = [];

const getMovies = async () => {
 const result = await axios.get('https://api.tvmaze.com/shows');
 movies = result.data;
 movies = movies.slice(0,6);
 return movies;
};

const updateLikes = async (ele) => {
  console.log(ele);
  await axios.post(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/likes`,{ item_id: ele.id});
  displayMovie();
}

const GetLikes = async () => { 
  const res = await axios.get(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/likes/`);
  return res.data;
}

const displayMovie = async() => {
 const movies = await getMovies();
  const likes =await GetLikes();
  div.innerHTML = '';
  movies.forEach((movie, index) => {
    let likeVal = likes[index] !== undefined ? likes[index].likes : 0;
    div.innerHTML += `
    <div id="${movie.id}">
    <img src="${movie.image.medium}" alt="${movie.name}">
    <p>${movie.name}</p>
    <div>
    <button><i class="far fa-heart" id='heart-${movie.id}'></i></button>
    <p>${likeVal} likes</p>
    </div>
    <button class="comment-button">Comment</button>
    </div>`;

  })
}

displayMovie();

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
  else if (e.target.classList.contains('fa-heart')) {
    updateLikes(e.target)
  }
});
