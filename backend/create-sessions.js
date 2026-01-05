const { sequelize } = require('./models');
const Session = require('./models/Session');
const Movie = require('./models/Movie');
const Room = require('./models/Room');

async function createSessionsForAllMovies() {
  try {
    console.log('Connecting to database...');
    
    // Force sync to ensure database is populated
    await sequelize.sync({ force: false });
    
    // Wait a moment for sync to complete
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    // Get all movies
    const movies = await Movie.findAll();
    console.log(`Found ${movies.length} movies`);
    
    if (movies.length === 0) {
      console.log('No movies found. Creating sample movies first...');
      // Create sample movies
      const sampleMovies = [
        { title: 'The Batman', synopsis: 'Batman investigates a series of crimes in Gotham City.', posterUrl: 'https://example.com/batman.jpg', duration: 175 },
        { title: 'Spider-Man: No Way Home', synopsis: 'Spider-Man faces threats from multiple universes.', posterUrl: 'https://example.com/spiderman.jpg', duration: 148 },
        { title: 'Iron Man', synopsis: 'A genius builds a powerful armored suit.', posterUrl: 'https://example.com/ironman.jpg', duration: 126 },
        { title: 'Captain America: The First Avenger', synopsis: 'A soldier becomes a super-powered hero.', posterUrl: 'https://example.com/captain.jpg', duration: 124 },
        { title: 'Thor', synopsis: 'A god learns humility on Earth.', posterUrl: 'https://example.com/thor.jpg', duration: 115 }
      ];
      
      for (const movieData of sampleMovies) {
        await Movie.create(movieData);
      }
      
      // Get movies again
      const movies = await Movie.findAll();
      console.log(`Created ${movies.length} sample movies`);
    }
    
    // Get room (assuming room 1 exists, create if not)
    let room = await Room.findByPk(1);
    if (!room) {
      console.log('Room 1 not found, creating it...');
      room = await Room.create({
        name: 'Salle 1',
        capacity: 50
      });
      console.log('Created Room 1');
    }
    
    // The Batman's session times
    const sessionTimes = [
      '2025-12-24T10:06:21.802Z',
      '2025-12-24T11:06:21.802Z'
    ];
    
    // Create sessions for each movie
    for (const movie of movies) {
      console.log(`Creating sessions for movie: ${movie.title} (ID: ${movie.id})`);
      
      // Check if sessions already exist for this movie
      const existingSessions = await Session.findAll({
        where: { MovieId: movie.id }
      });
      
      if (existingSessions.length > 0) {
        console.log(`  Movie ${movie.title} already has ${existingSessions.length} sessions, skipping...`);
        continue;
      }
      
      // Create sessions for this movie
      for (const startTime of sessionTimes) {
        await Session.create({
          startTime,
          MovieId: movie.id,
          RoomId: room.id
        });
        console.log(`  Created session at ${startTime}`);
      }
    }
    
    console.log('Sessions created successfully!');
    
    // Show summary
    const allSessions = await Session.findAll({
      include: [Movie, Room],
      order: [['MovieId', 'ASC'], ['startTime', 'ASC']]
    });
    
    console.log('\n=== SESSION SUMMARY ===');
    const sessionsByMovie = {};
    allSessions.forEach(session => {
      const movieTitle = session.Movie.title;
      if (!sessionsByMovie[movieTitle]) {
        sessionsByMovie[movieTitle] = [];
      }
      sessionsByMovie[movieTitle].push(new Date(session.startTime).toLocaleString());
    });
    
    Object.entries(sessionsByMovie).forEach(([movieTitle, times]) => {
      console.log(`${movieTitle}: ${times.length} sessions`);
      times.forEach(time => console.log(`  - ${time}`));
    });
    
  } catch (error) {
    console.error('Error creating sessions:', error);
  } finally {
    await sequelize.close();
  }
}

createSessionsForAllMovies();
