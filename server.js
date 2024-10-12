import express from 'express';
import axios from 'axios';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Set the view engine to ejs
app.set('view engine', 'ejs');
app.set('views', './views');

// Serve static files
app.use(express.static('public'));

// TMDB API key
const API_KEY = process.env.TMDB_API_KEY;

// Route to get movies
app.get('/movies', async (req, res) => {
    try {
        // Fetch most viewed movies
        const popularMovies = await axios.get(`https://api.themoviedb.org/3/movie/popular?api_key=${API_KEY}&language=en-US&page=1`);
        
        // Fetch most recent movies
        const recentMovies = await axios.get(`https://api.themoviedb.org/3/movie/latest?api_key=${API_KEY}&language=en-US`);

        // Fetch different genres (e.g., Action and Comedy)
        const actionMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=28`); // Action genre
        const comedyMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&with_genres=35`); // Comedy genre

        // Fetch movies in a different language (e.g., Spanish)
        const spanishMovies = await axios.get(`https://api.themoviedb.org/3/discover/movie?api_key=${API_KEY}&language=es-ES`);

        res.render('movies', {
            popularMovies: popularMovies.data.results,
            recentMovies: recentMovies.data,
            actionMovies: actionMovies.data.results,
            comedyMovies: comedyMovies.data.results,
            spanishMovies: spanishMovies.data.results,
        });
    } catch (error) {
        console.error('Error fetching movie data:', error.message);
        res.status(500).send('Internal Server Error');
    }
});

// Start the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
