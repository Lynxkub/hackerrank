"use strict";

/******************************************************************************
 * Handling navbar clicks and updating navbar
 */

/** Show main list of all stories when click site name */

function navAllStories(evt) {
  console.debug("navAllStories", evt);
  hidePageComponents();
  putStoriesOnPage();
}

$body.on("click", "#nav-all", navAllStories);

/** Show login/signup on click on "login" */

function navLoginClick(evt) {
  console.debug("navLoginClick", evt);
  hidePageComponents();
  $loginForm.show();
  $signupForm.show();
}

$navLogin.on("click", navLoginClick);

/** When a user first logins in, update the navbar to reflect that. */

function updateNavOnLogin() {
  console.debug("updateNavOnLogin");
  $(".main-nav-links").show();
  $navLogin.hide();
  $navLogOut.show();
  $navUserProfile.text(`${currentUser.username}`).show();
}

function submitNewStory(){
  hidePageComponents();
  $createStory.show();
}

$submit.on("click", submitNewStory);

function favStoriesClick(){
  hidePageComponents()
  putFavoritesListOnPage();
}

// function showFavorites(){
//   const checked=Array.from($(".checked"))
//   for (let i of checked){
//     i.checked=true;
//   }
//   hidePageComponents();
//   $favoritesList.show();
// }

$favoriteLink.on("click", favStoriesClick);