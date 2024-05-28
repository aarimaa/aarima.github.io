const express = require("express");
const bodyParser = require("body-parser");
const mongoose = require("mongoose");
const cors = require("cors");
const Anime = require("./Anime");

const app = express();
app.use(cors());
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Підключаємо MongoDB
mongoose
  .connect(
    "mongodb+srv://arima:w6qCrlq7cqNhK4bg@cluster0.o2ykbg9.mongodb.net/anime_db?retryWrites=true&w=majority&appName=Cluster0"
  )
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// Отримання всіх аніме з баз
app.get("/", async (req, res) => {
  try {
    const animes = await Anime.find();
    res.json(animes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Додавання нового аніме
app.post("/animes", async (req, res) => {
  try {
    const { name, link, author, authorLink, genres, idApi } = req.body;
    const anime = new Anime({ name, link, author, authorLink, genres, idApi });
    await anime.save();
    res.status(201).json(anime);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Оновлення існуючого аніме
app.post("/update/:id", async (req, res) => {
  try {
    const { name, link, author, authorLink, genres, idApi } = req.body;
    await Anime.findByIdAndUpdate(req.params.id, {
      name,
      link,
      author,
      authorLink,
      genres,
      idApi,
    });
    res.json({ message: "Anime updated successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Видалення аніме
app.get("/delete/:id", async (req, res) => {
  try {
    await Anime.findByIdAndDelete(req.params.id);
    res.json({ message: "Anime deleted successfully" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

// Обробка помилок
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: "Internal Server Error" });
});

// порт і запуск серверуу
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
