import axios from 'axios';
import itemsCounter from './counter';
import { getMovies, GetLikes } from './requests';

const div = document.querySelector('.movies');
const comments = document.querySelector('.comments');
const header = document.querySelector('.shows');
const body = document.querySelector('body');
let movies = [];
let commentHTML = '';

const displayMovie = async () => {
  movies = await getMovies();
  const likes = await GetLikes();
  const counter = itemsCounter(movies);
  header.innerHTML += ` (${counter})`;
  div.innerHTML = '';
  movies.forEach((movie, index) => {
    const likeVal = likes[index] !== undefined ? likes[index].likes : 0;
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
  });
};

const updateLikes = async (ele) => {
  await axios.post('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/likes', { item_id: ele.id });
  displayMovie();
};

const postNewComments = (movieID = 'movie1', userName = 'Orcun', userComment = 'Trying') => {
  axios.post('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/comments', {
    item_id: movieID,
    username: userName,
    comment: userComment,
  });
};

const getComments = async (movieId) => {
  const comments = await axios.get(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/comments?item_id=${movieId}`);
  return comments.data;
};

const renderItemsComments = async () => {
  const getCommentsFromAPI = await getComments('movie1');
  getCommentsFromAPI.forEach((i) => { commentHTML += `<p>${i.creation_date} ${i.username}: ${i.comment}</p>`; });
  // console.log(commentHTML);
};

body.addEventListener('click', (e) => {
  if (e.target.className === 'comment-button') {
    comments.innerHTML = `
    <div id='pop'>
      <img src="${movies[parseInt(e.target.parentNode.id, 10) - 1].image.medium}" alt="${movies[parseInt(e.target.parentNode.id, 10) - 1].name}">
      <h1>${movies[parseInt(e.target.parentNode.id, 10) - 1].name}</h1>
      <div id='comment-feature'>
        <p> Rating: ${movies[parseInt(e.target.parentNode.id, 10) - 1].rating.average}</p>
        <p> Released Date: ${movies[parseInt(e.target.parentNode.id, 10) - 1].premiered}</p>
        <p> Genres: ${movies[parseInt(e.target.parentNode.id, 10) - 1].genres}</p>
        <p> Language: ${movies[parseInt(e.target.parentNode.id, 10) - 1].language}</p>
      </div>
      <div id='comment-area'>
        <h2>Comments</h2>
        ${commentHTML}
      </div>
      <div id='comment-form'>
        <h2>Add a Comment</h2>
        <form action="submit" id="form-area">
          <input type="text" id="name" placeholder="Your Name">
          <textarea type="textarea" rows="4" cols="50" name="comment">Your Insights</textarea>
          <button id="form-submit" type="button">Submit Comment</button>
        </form>
      </div>
    </div>`;
  } else if (e.target.classList.contains('fa-heart')) {
    updateLikes(e.target);
    displayMovie();
  }
});

displayMovie();
renderItemsComments();
postNewComments();
