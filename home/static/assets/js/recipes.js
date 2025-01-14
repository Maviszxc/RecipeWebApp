import { fetchData } from "./api.js";
import { $skeletonCard, cardQueries } from "./global.js";
import { getTime } from "./module.js";

const $accordions = document.querySelectorAll("[data-accordion]");

const initAccordion = function ($element) {
  const $button = $element.querySelector("[data-accordion-btn]");
  let isExpanded = false;

  $button.addEventListener("click", function () {
    isExpanded = !isExpanded;
    this.setAttribute("aria-expanded", isExpanded);
  });
};

for (const $accordion of $accordions) {
  initAccordion($accordion);
}

const $filterBar = document.querySelector("[data-filter-bar]");
const $filterTogglers = document.querySelectorAll("[data-filter-toggler]");
const $overlay = document.querySelector("[data-overlay]");

$filterTogglers.forEach((toggler) => {
  toggler.addEventListener("click", function () {
    $filterBar.classList.toggle("active");
    $overlay.classList.toggle("active");

    const bodyOverflow = document.body.style.overflow;
    document.body.style.overflow =
      bodyOverflow === "hidden" ? "visible" : "hidden";
  });
});

const $filterToggleBtn = document.querySelector("[data-filter-toggle]");

$filterToggleBtn.addEventListener("click", function () {
  $filterBar.classList.toggle("active");
  $overlay.classList.toggle("active");

  const isExpanded = $filterBar.classList.contains("active");
  this.setAttribute("aria-expanded", isExpanded);

  document.body.style.overflow = isExpanded ? "hidden" : "visible";
});

const $filterSubmit = document.querySelector("[data-filter-submit]");
const $filterClear = document.querySelector("[data-filter-clear]");
const $filterSearch = $filterBar.querySelector("input[type='search']");

$filterSubmit.addEventListener("click", function () {
  const $filterCheckboxes = $filterBar.querySelectorAll("input:checked");
  const queries = [];

  if ($filterSearch.value) {
    queries.push(["q", $filterSearch.value]);
  }

  if ($filterCheckboxes.length) {
    for (const $checkbox of $filterCheckboxes) {
      const key = $checkbox.parentElement.parentElement.dataset.filter;
      queries.push([key, $checkbox.value]);
    }
  }

  window.location = queries.length
    ? `?${queries.map((query) => query.join("=")).join("&")}`
    : "/home/recipes";
});

$filterSearch.addEventListener("keydown", (e) => {
  if (e.key === "Enter") {
    $filterSubmit.click();
  }
});

$filterClear.addEventListener("click", function () {
  const $filterCheckboxes = $filterBar.querySelectorAll("input:checked");
  $filterCheckboxes?.forEach((Elem) => (Elem.checked = false));
  $filterSearch.value &&= "";
});

const queryStr = window.location.search.slice(1);
const queries = queryStr && queryStr.split("&").map((i) => i.split("="));

const $filterCount = document.querySelector("[data-filter-count]");

if (queries.length) {
  $filterCount.style.display = "block";
  $filterCount.innerHTML = queries.length;
} else {
  $filterCount.style.display = "none";
}

queryStr &&
  queryStr.split("&").map((i) => {
    if (i.split("=")[0] === "q") {
      $filterBar.querySelector("input[type='search']").value = i
        .split("=")[1]
        .replace(/%20/g, " ");
    } else {
      $filterBar.querySelector(
        `[value="${i.split("=")[1].replace(/%20/g, " ")}"]`
      ).checked = true;
    }
  });

const $filterBtn = document.querySelector("[data-filter-btn]");

window.addEventListener("scroll", (e) => {
  $filterBtn.classList[window.scrollBy >= 120 ? "add" : "remove"]("active");
});

const $gridList = document.querySelector("[data-grid-list]");
const $loadMore = document.querySelector("[data-load-more]");
const defaultQueries = [
  ["mealType", "breakfast"],
  ["mealType", "lunch"],
  ["mealType", "dinner"],
  ["mealType", "snack"],
  ["mealType", "teatime"],
  ...cardQueries,
];

$gridList.innerHTML = $skeletonCard.repeat(20);
let nextPageUrl = "";

const renderRecipe = (data) => {
  data.hits.map((item, index) => {
    const {
      recipe: { image, label: title, totalTime: cookingTime, uri },
    } = item;

    const recipeId = uri.slice(uri.lastIndexOf("_") + 1);
    const isSaved = window.localStorage.getItem(`cookio-recipe${recipeId}`);

    const $card = document.createElement("div");
    $card.classList.add("card");
    $card.style.animationDelay = `${100 * index}ms`;

    $card.innerHTML = `
      <figure class="card-media img-holder">
        <img
          src="${image}"
          width="195"
          height="195"
          loading="lazy"
          alt="${title}"
          class="img-cover"
        />
      </figure>

      <div class="card-body">
        <h3 class="title-small">
          <a href="/home/detail/?recipe=${recipeId}" class="card-link">
            ${title ? title : "Untitled"}
          </a>
        </h3>

        <div class="meta-wrapper">
          <div class="meta-item">
            <span class="material-symbols-outlined" aria-hidden="true">schedule</span>
            <span class="label-medium">${getTime(cookingTime).time || "< 1"} ${
      getTime(cookingTime).timeUnit
    }</span>
          </div>
          <button class="icon-btn has-state ${
            isSaved ? "saved" : "removed"
          }" aria-label="Add to saved recipes" onclick="saveRecipe(this, '${recipeId}')">
            <span class="material-symbols-outlined bookmark-add" aria-hidden="true">bookmark_add</span>
            <span class="material-symbols-outlined bookmark" aria-hidden="true">bookmark</span>
          </button>
        </div>
      </div>
    `;

    $gridList.appendChild($card);
  });
};

let requestedBefore = true;

fetchData(queries || defaultQueries, (data) => {
  const {
    _links: { next },
  } = data;
  nextPageUrl = next?.href;

  $gridList.innerHTML = "";
  requestedBefore = false;

  if (data.hits.length) {
    renderRecipe(data);
  } else {
    $loadMore.innerHTML = `<p class="body-medium info-text">No recipe found</p>`;
  }

  if (!nextPageUrl) $loadMore.innerHTML = `<p class="body-medium info-text">No more recipes</p>`;

});
