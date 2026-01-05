const axios = require('axios');

async function createSessionsForAllMovies() {
  try {
    const baseURL = 'http://localhost:5000/api';
    
    // Get all movies
    console.log('Getting all movies...');
    const moviesResponse = await axios.get(`${baseURL}/movies`);
    const movies = moviesResponse.data;
    console.log(`Found ${movies.length} movies`);
    
    // The Batman's session times
    const sessionTimes = [
      '2025-12-24T10:06:21.802Z',
      '2025-12-24T11:06:21.802Z'
    ];
    
    // Create sessions for each movie (skip The Batman since it already has sessions)
    for (const movie of movies) {
      if (movie.id === 1) {
        console.log(`Skipping ${movie.title} (already has sessions)`);
        continue;
      }
      
      console.log(`Creating sessions for movie: ${movie.title} (ID: ${movie.id})`);
      
      // Check if sessions already exist for this movie
      try {
        const existingSessions = await axios.get(`${baseURL}/sessions/movie/${movie.id}`);
        if (existingSessions.data.length > 0) {
          console.log(`  Movie ${movie.title} already has ${existingSessions.data.length} sessions, skipping...`);
          continue;
        }
      } catch (error) {
        console.log(`  No existing sessions found for ${movie.title}`);
      }
      
      // Create sessions for this movie
      for (const startTime of sessionTimes) {
        try {
          const sessionData = {
            startTime,
            MovieId: movie.id,
            RoomId: 1
          };
          
          const response = await axios.post(`${baseURL}/sessions`, sessionData);
          console.log(`  Created session at ${startTime} - ID: ${response.data.id}`);
        } catch (error) {
          console.error(`  Failed to create session: ${error.response?.data?.message || error.message}`);
        }
      }
    }
    
    console.log('\n=== VERIFYING SESSIONS ===');
    
    // Verify all movies have sessions
    for (const movie of movies) {
      try {
        const sessionsResponse = await axios.get(`${baseURL}/sessions/movie/${movie.id}`);
        console.log(`${movie.title}: ${sessionsResponse.data.length} sessions`);
      } catch (error) {
        console.log(`${movie.title}: Error getting sessions - ${error.message}`);
      }
    }
    
  } catch (error) {
    console.error('Error:', error.message);
  }
}

createSessionsForAllMovies();
