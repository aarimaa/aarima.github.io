const BASE_URL = "https://api.themoviedb.org/3";
const KEY = "4600ad27c37fafc71c6d206d4adb3c4a";
const ACCESS_TOKEN =
  "eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI0NjAwYWQyN2MzN2ZhZmM3MWM2ZDIwNmQ0YWRiM2M0YSIsInN1YiI6IjY2MmQ3MmM2N2Q1ZGI1MDEyMzNkOWE2NyIsInNjb3BlcyI6WyJhcGlfcmVhZCJdLCJ2ZXJzaW9uIjoxfQ.aMD3rZMEp1E89EhJd7XNyYPUwgDWdFOsEhUCVeyZqDU";

const getAnimeRating = async (id) => {
  try {
    const response = await fetch(`${BASE_URL}/tv/${id}?api_key=${KEY}`, {
      headers: {
        Authorization: `Bearer ${ACCESS_TOKEN}`,
      },
    });

    if (!response.ok) {
      throw new Error(`Failed to fetch anime rating for id ${id}`);
    }

    const data = await response.json();
    return data.vote_average;
  } catch (error) {
    console.error(error);
    return null;
  }
};

document.addEventListener("DOMContentLoaded", () => {
  fetchAnimes();

  const addAnimeForm = document.getElementById("add-anime-form");
  const addButton = document.getElementById("add-anime-button");
  addButton.addEventListener("click", () => {
    addAnime(addAnimeForm);
  });

  const updateAnimeForm = document.getElementById("edit-anime-form");
  const updateButton = document.getElementById("update-anime-button");
  updateButton.addEventListener("click", () => {
    updateAnime(updateAnimeForm);
  });
});

async function fetchAnimes() {
  try {
    const response = await fetch("http://localhost:3000/");
    if (!response.ok) {
      throw new Error("Failed to fetch animes");
    }
    const animes = await response.json();
    displayAnimes(animes);
  } catch (error) {
    console.error("Error:", error);
  }
}

function displayAnimes(animes) {
  const animeTable = document.getElementById("anime-table");
  animeTable.innerHTML = "";
  animes.forEach((anime) => {
    const tr = document.createElement("tr");
    tr.classList.add("table-row");
    tr.id = "conan-row";

    const td1 = document.createElement("td");
    td1.classList.add("table-data");

    const anchor1 = document.createElement("a");
    anchor1.href = `${anime.link}`;
    anchor1.target = "_blank";
    anchor1.textContent = `${anime.name}`;

    const td2 = document.createElement("td");
    td2.classList.add("table-data");

    const anchor2 = document.createElement("a");
    anchor2.href = `${anime.authorLink}`;
    anchor2.target = "_blank";
    anchor2.textContent = `${anime.author}`;

    const td3 = document.createElement("td");
    td3.classList.add("table-data");
    td3.textContent = `${anime.genres}`;

    const td4 = document.createElement("td");
    td4.classList.add("table-data");
    td4.id = `${anime._id}`;
    updateAnimeRatings(td4, anime);

    const td5 = document.createElement("td");
    td5.classList.add("table-data");

    const buttonsContainer = document.createElement("div");
    buttonsContainer.classList.add("anime-buttons");

    const editButton = document.createElement("button");
    editButton.textContent = "Редагувати";
    editButton.classList.add("anime-button", "anime-button-edit");
    editButton.addEventListener("click", () => showEditAnimeForm(anime));

    const deleteButton = document.createElement("button");
    deleteButton.textContent = "Видалити";
    deleteButton.classList.add("anime-button", "anime-button-delete");
    deleteButton.addEventListener("click", () => deleteAnime(anime._id));

    buttonsContainer.appendChild(editButton);
    buttonsContainer.appendChild(deleteButton);
    td5.appendChild(buttonsContainer);

    td1.appendChild(anchor1);
    td2.appendChild(anchor2);

    tr.appendChild(td1);
    tr.appendChild(td2);
    tr.appendChild(td3);
    tr.appendChild(td4);
    tr.appendChild(td5);

    animeTable.appendChild(tr);
  });
}
const updateAnimeRatings = async (td4, anime) => {
  const rating = await getAnimeRating(anime.idApi);
  td4.textContent = rating !== null ? rating : "Рейтинг недоступний";
};

async function addAnime(form) {
  const name = form.querySelector("#name").value;
  const link = form.querySelector("#link").value;
  const author = form.querySelector("#author").value;
  const authorLink = form.querySelector("#authorLink").value;
  const genres = form.querySelector("#genres").value;
  const idApi = form.querySelector("#idApi").value;

  try {
    const response = await fetch("http://localhost:3000/animes", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, link, author, authorLink, genres, idApi }),
    });
    if (!response.ok) {
      throw new Error("Failed to add anime");
    }
    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}
function showEditAnimeForm(anime) {
  const form = document.getElementById("edit-anime-form");
  form.style.display = "block";
  form.querySelector("#edit-anime-id").value = anime._id;
  form.querySelector("#edit-name").value = anime.name;
  form.querySelector("#edit-link").value = anime.link;
  form.querySelector("#edit-author").value = anime.author;
  form.querySelector("#edit-authorLink").value = anime.authorLink;
  form.querySelector("#edit-genres").value = anime.genres;
  form.querySelector("#edit-idApi").value = anime.idApi;
}

async function updateAnime(form) {
  const animeId = form.querySelector("#edit-anime-id").value;
  const name = form.querySelector("#edit-name").value;
  const link = form.querySelector("#edit-link").value;
  const author = form.querySelector("#edit-author").value;
  const authorLink = form.querySelector("#edit-authorLink").value;
  const genres = form.querySelector("#edit-genres").value;
  const idApi = form.querySelector("#edit-idApi").value;

  try {
    const response = await fetch(`http://localhost:3000/update/${animeId}`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ name, link, author, authorLink, genres, idApi }),
    });
    if (!response.ok) {
      throw new Error("Failed to update anime");
    }
    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}

function cancelUpdateAnime(form) {
  form.style.display = "none";
}

async function deleteAnime(animeId) {
  try {
    const response = await fetch(`http://localhost:3000/delete/${animeId}`, {
      method: "GET",
    });
    if (!response.ok) {
      throw new Error("Failed to delete anime");
    }
    location.reload();
  } catch (error) {
    console.error("Error:", error);
  }
}
