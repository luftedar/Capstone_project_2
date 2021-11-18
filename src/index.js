import axios from 'axios';
import itemsCounter from './counter';
import { getMovies, GetLikes } from './requests';
import './style.css';

const div = document.querySelector('.movies');
const comments = document.querySelector('.comments');
const header = document.querySelector('.shows');
const body = document.querySelector('body');
const commentsDiv = document.querySelector('#comments-wrapper');
let movies = [];
let commentHTML = '';
let getCommentsFromAPI = [];

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

const popUpHtml = (target) => {
  comments.innerHTML = `
    <div id='pop'>
      <div id='img-div'>
        <i class='fas fa-times'></i>
        <img src="${movies[parseInt(target, 10) - 1].image.medium}" alt="${movies[parseInt(target, 10) - 1].name}">
      </div>
      <h2>${movies[parseInt(target, 10) - 1].name}</h2>
      <div id='comment-feature'>
        <p> Rating: ${movies[parseInt(target, 10) - 1].rating.average}</p>
        <p> Genres: ${movies[parseInt(target, 10) - 1].genres}</p>
        <p> Released Date: ${movies[parseInt(target, 10) - 1].premiered}</p>
        <p> Language: ${movies[parseInt(target, 10) - 1].language}</p>
      </div>
    </div>`;
};

const showComments = async (id) => {
  try { getCommentsFromAPI = await getComments(id); } catch {
    popUpHtml(id);
    commentHTML = '<p>No Comments Yet</p>';
    getCommentsFromAPI = [];
  }
  if (getCommentsFromAPI.length === 0) {
    commentHTML = '<p>No Comments Yet</p>';
  } else {
    getCommentsFromAPI.forEach((i) => { commentHTML += `<p>${i.creation_date} ${i.username}: ${i.comment}</p>`; });
  }
  let commentsCount = itemsCounter(getCommentsFromAPI);
  comments.innerHTML
  += `<div id='comment-area'>
        <h2>Comments (${commentsCount})</h2>
        ${commentHTML}
      </div>
      <div id='comment-form'>
        <h2>Add a Comment</h2>
        <form action="submit" id="form-area">
          <input type="text" id="name" placeholder="Your Name">
          <textarea type="textarea" rows="4" cols="50" name="comment" placeholder="Your Insights"></textarea>
          <button name="${id}" type="button">Submit Comment</button>
        </form>
      </div>`;
};

const postNewComments = (movieID, userName, userComment) => {
  axios.post('https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/comments', {
    item_id: movieID,
    username: userName,
    comment: userComment,
  });
  showComments(movieID);
};

const getComments = async (movieId) => {
  try {
    const comments = await axios.get(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/comments?item_id=${movieId}`);
    return comments.data;
  } catch {
    return [];
  }
};

body.addEventListener('click', (e) => {
  const indexID = e.target.parentNode.id;
  if (e.target.className === 'comment-button') {
    popUpHtml(indexID);
    commentHTML = '';
    showComments(indexID);
    commentsDiv.classList.remove('d-none')
  } else if (e.target.classList.contains('fa-heart')) {
    updateLikes(e.target);
    displayMovie();
  } else if (e.target.innerHTML === 'Submit Comment') {
    const sentID = (e.target.name).toString();
    const sentUserName = (e.target.parentNode.childNodes[1].value);
    const sentUserComment = (e.target.parentNode.childNodes[3].value);
    commentHTML = '';
    comments.innerHTML = '';
    popUpHtml(e.target.name);
    postNewComments(sentID, sentUserName, sentUserComment);
  } else if (e.target.classList.contains('fa-times')) {
    comments.innerHTML = '';
    commentsDiv.classList.add('d-none')
  }
});

displayMovie();
