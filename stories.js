"use strict";

// This is the global list of the stories, an instance of StoryList
let storyList;

/** Get and show stories when site first loads. */

async function getAndShowStoriesOnStart() {
  storyList = await StoryList.getStories();
  $storiesLoadingMsg.remove();

  putStoriesOnPage();
}

/**
 * A render method to render HTML for an individual Story instance
 * - story: an instance of Story
 *
 * Returns the markup for the story.
 */

function generateStoryMarkup(story, showDeleteBtn = true) {
  // console.debug("generateStoryMarkup", story);

  const hostName = story.getHostName();

  const showStar=Boolean(currentUser);
  return $(`
      <li id="${story.storyId}">
      ${showDeleteBtn ? getDeleteBtnHTML() : ""}
      ${showStar ? getStartHTML(story, currentUser): ""}
        <a href="${story.url}" target="a_blank" class="story-link">
          ${story.title}
        </a>
        <small class="story-hostname">(${hostName})</small>
        <small class="story-author">by ${story.author}</small>
        <small class="story-user">posted by ${story.username}</small>
      </li>
    `);
}
function getDeleteBtnHTML(){
  return `
  <span class="trash-can">
    <i class="fas fa-trash-alt"></i>
  </span>`;
}

function getStartHTML(story,user){
  const isFavorite = user.isFavorite(story);
  const starType= isFavorite ? "fas" : "far";
  return `<span class="star">
              <i class="${starType} fa-star"></i>
              </span>`
}
/** Gets list of stories from server, generates their HTML, and puts on page. */

function putStoriesOnPage() {
  console.debug("putStoriesOnPage");

  $allStoriesList.empty();

  // loop through all of our stories and generate HTML for them
  for (let story of storyList.stories) {
    const $story = generateStoryMarkup(story);
    $allStoriesList.append($story);
  }

  $allStoriesList.show();
}

async function addCreatedStory(e){
  console.debug("addCreatedStory");
  e.preventDefault();
let author=$("#authorName").val();
let title=$("#storyTitle").val();
let url=$("#storyUrl").val();
const username=currentUser.username;
const storyData={title, url, author, username};
const story=await storyList.addStory(currentUser, storyData)

const $story=generateStoryMarkup(story);
$allStoriesList.prepend($story);
$myStories.prepend($story);
$("#authorName").val("")
$("storyTitle").val("");
$("#storyUrl").val("");
}

$createStory.on("submit", addCreatedStory);

function showMyStories(){
  hidePageComponents();
  $myStories.show();
}

$myStoryBtn.on("click", showMyStories)



$allStoriesList.on("click", ".trash-can", deleteStory);

function putFavoritesListOnPage(){
  $favoritesList.empty();

  for(let story of currentUser.favorites){
    const $story=generateStoryMarkup(story);
    $favoritesList.append($story);
  }
  $favoritesList.show();
}
function putUserStoriesOnPage(){
  $allStoriesList.empty();
  for(let story of currentUser.ownStories){
    let $story = generateStoryMarkup(story, true);
    $allStoriesList.append($story);
  }
}


async function deleteStory(e){
  const $closestLi=$(e.target).closest("li");
  const storyId=$closestLi.attr("id");

  await storyList.removeStory(currentUser, storyId);

  await putUserStoriesOnPage();
}


async function toggleStoryFavorite(e){
  const $tgt=$(e.target);
  const $closestLi = $tgt.closest("li");
  const storyId= $closestLi.attr("id");
  const story=storyList.stories.find(s=>s.storyId === storyId);

  if($tgt.hasClass("fas")){
    await currentUser.removeFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }else {
    await currentUser.addFavorite(story);
    $tgt.closest("i").toggleClass("fas far");
  }
}

$allStoriesList.on("click", ".star", toggleStoryFavorite);

