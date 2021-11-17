import axios from 'axios';

const div = document.querySelector('.movies');
let comments = document.querySelector('.comments');
const body = document.querySelector('body');
let movies = [];
let commentHTML = '';
let getCommentsFromAPI = [];

const getMovies = async () => {
 const result = await axios.get('https://api.tvmaze.com/shows');
 movies = result.data;
 movies = movies.slice(0,6);
 return movies;
};

const updateLikes = async (ele) => {
  await axios.post(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/likes`,{ item_id: ele.id});
  displayMovie();
}

const GetLikes = async () => { 
  const res = await axios.get(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/likes/`);
  return res.data;
}

const displayMovie = async() => {
 const movies = await getMovies();
  const likes = await GetLikes();
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

const postNewComments = async (movieID, userName, userComment) => {
  await axios.post(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/comments`, {
    "item_id": movieID,
    "username": userName,
    "comment": userComment
  });
}

const getComments = async (movieId) => {
  const comments = await axios.get(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/comments?item_id=${movieId}`)
  return comments.data;
}

const showComments = async (id) => {
  try{ getCommentsFromAPI = await getComments(id)}catch{
    popUpHtml(id);
    commentHTML = '<p>No Comments Yet</p>'
    getCommentsFromAPI = [];
  };
  if(getCommentsFromAPI.length === 0){
    commentHTML = '<p>No Comments Yet</p>';
  }else {
    getCommentsFromAPI.forEach((i) => { commentHTML += `<p>${i.creation_date} ${i.username}: ${i.comment}</p>` });
  }
  comments.innerHTML +=
  `<div id='comment-area'>
        <h2>Comments</h2>
        ${commentHTML}
      </div>
      <div id='comment-form'>
        <h2>Add a Comment</h2>
        <form action="submit" id="form-area">
          <input type="text" id="name" placeholder="Your Name">
          <textarea type="textarea" rows="4" cols="50" name="comment">Your Insights</textarea>
          <button name="${id}" type="button">Submit Comment</button>
        </form>
      </div>`;
}

const popUpHtml = (target) => {
  comments.innerHTML = `
    <div id='pop'>
      <img src="${movies[parseInt(target) - 1].image.medium}" alt="${movies[parseInt(target) - 1].name}">
      <h1>${movies[parseInt(target) - 1].name}</h1>
      <div id='comment-feature'>
        <p> Rating: ${movies[parseInt(target) - 1].rating.average}</p>
        <p> Released Date: ${movies[parseInt(target) - 1].premiered}</p>
        <p> Genres: ${movies[parseInt(target) - 1].genres}</p>
        <p> Language: ${movies[parseInt(target) - 1].language}</p>
      </div>
    </div>`;
}

body.addEventListener('click', (e) => {
  let indexID = e.target.parentNode.id 
  if (e.target.className === 'comment-button') {
    popUpHtml(indexID);
    comments.innerHTML = '';
    commentHTML = '';
    showComments(indexID);
  }
  else if (e.target.classList.contains('fa-heart')) {
    updateLikes(e.target)
  }else if (e.target.innerHTML === 'Submit Comment'){
    let sentID = (e.target.name).toString();
    let sentUserName = (e.target.parentNode.childNodes[1].value);
    let sentUserComment = (e.target.parentNode.childNodes[3].value);
    commentHTML = '';
    comments.innerHTML = '';
    popUpHtml(e.target.name);
    showComments(e.target.name);
    postNewComments(sentID,sentUserName,sentUserComment);
  }
});
