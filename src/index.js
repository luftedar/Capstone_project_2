import axios from 'axios';

const div = document.querySelector('.movies');
const comments = document.querySelector('.comments');
const body = document.querySelector('body');
const movies = [];
let commentHTML = '';

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

const postNewComments = (movieID='movie1', userName='Orcun', userComment='Trying') => {
  axios.post(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/comments`, {
    item_id: movieID,
    username: userName,
    comment: userComment
  })
}

const renderItemsComments = async () => {
  const getCommentsFromAPI = await getComments('movie1');
  getCommentsFromAPI.forEach((i) => {commentHTML += `<p>${i.creation_date} ${i.username}: ${i.comment}</p>`})
  console.log(commentHTML);
}

const getComments = async (movieId) => {
  const comments = await axios.get(`https://us-central1-involvement-api.cloudfunctions.net/capstoneApi/apps/XMHWey4za3iNnBFD5KUq/comments?item_id=${movieId}`)
  return comments.data;
}

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
  }
});

renderItemsComments();
postNewComments()
renderComments();
getData();