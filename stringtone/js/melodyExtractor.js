// Melody Extractor - Uses OpenAI API to extract melody notes from songs
const melodyExtractor = {
    serverUrl: 'https://openai-server-lauren.vercel.app/api/chat', // Your OpenAI API server endpoint
    projectName: 'StringTones',
    isExtracting: false,
    currentSong: null,
    extractedMelody: [],
    suggestedSongs: [
        "Twinkle Twinkle Little Star",
        "Fur Elise",
        "Happy Birthday",
        "Canon in D",
        "Moonlight Sonata",
        "Yesterday - The Beatles",
        "Hallelujah - Leonard Cohen"
    ],

    // Pre-defined melodies for suggested songs
    predefinedMelodies: {
        "Twinkle Twinkle Little Star": ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4", "G4", "G4", "F4", "F4", "E4", "E4", "D4", "G4", "G4", "F4", "F4", "E4", "E4", "D4", "C4", "C4", "G4", "G4", "A4", "A4", "G4"],
        "Fur Elise": ["E5", "D#5", "E5", "D#5", "E5", "B4", "D5", "C5", "A4", "C4", "E4", "A4", "B4", "E4", "G#4", "B4", "C5", "E4", "E5", "D#5", "E5", "D#5", "E5", "B4", "D5", "C5", "A4"],
        "Happy Birthday": ["C4", "C4", "D4", "C4", "F4", "E4", "C4", "C4", "D4", "C4", "G4", "F4", "C4", "C4", "C5", "A4", "F4", "E4", "D4", "A#4", "A#4", "A4", "F4", "G4", "F4"],
        "Canon in D": ["F#4", "E4", "D4", "C#4", "B3", "A3", "B3", "C#4", "D4", "C#4", "B3", "A3", "G3", "F#3", "G3", "A3", "D4", "F#4", "A4", "G4", "F#4", "D4", "F#4", "E4", "D4", "B3", "D4", "A3"],
        "Moonlight Sonata": ["C#4", "E4", "G#4", "C#5", "B3", "E4", "G#4", "B4", "A3", "E4", "G#4", "A4", "G#3", "E4", "G#4", "G#4", "F#3", "D#4", "F#4", "A4", "G#3", "E4", "G#4", "B4", "A3", "C#4", "E4", "A4", "B3", "D#4", "F#4", "B4"],
        "Yesterday - The Beatles": ["F4", "E4", "D4", "C#4", "D4", "E4", "F4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "D4", "C#4", "C#4", "E4", "A3", "A3", "C4", "C4", "D4", "C4", "Bb3", "A3", "G3", "F3", "G3"],
        "Hallelujah - Leonard Cohen": ["G4", "E4", "G4", "G4", "A4", "A4", "G4", "G4", "E4", "E4", "F#4", "F#4", "G4", "A4", "A4", "G4", "G4", "E4", "E4", "G4", "G4", "A4", "A4", "G4", "G4"]
    },

    // Extract melody from a song name
    async extractMelody(songName) {
        if (this.isExtracting) return null;
        this.isExtracting = true;
        this.currentSong = songName;

        try {
            // Check if we have a predefined melody for this song
            if (this.predefinedMelodies[songName]) {
                console.log(`Using predefined melody for "${songName}"`);
                this.extractedMelody = [...this.predefinedMelodies[songName]];
                return this.extractedMelody;
            }

            // If not a predefined song, use the API
            console.log(`Fetching melody for "${songName}" from API`);
            const response = await fetch(this.serverUrl, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'x-project-name': this.projectName
                },
                body: JSON.stringify({
                    model: 'gpt-4',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a music expert. Extract the main melody notes from the song provided in a simple format.
                                     Focus only on the most recognizable melody line.
                                     Return ONLY a JSON array of note strings in scientific pitch notation (e.g., "C4", "D#4", "F5").
                                     Include approx 16-32 notes that can be looped to create a recognizable melody.
                                     For example: ["C4", "E4", "G4", "C5", "G4", "E4", "C4"]
                                     Do not include any text, just the JSON array of notes.`
                        },
                        {
                            role: 'user',
                            content: `Extract the main melody notes from: "${songName}"`
                        }
                    ],
                    max_tokens: 200,
                    temperature: 0.3
                })
            });

            const data = await response.json();
            const content = data.choices[0].message.content;

            // Parse the notes from the response
            let notes;
            try {
                // First try to parse the entire response as JSON
                notes = JSON.parse(content);
            } catch (e) {
                // If that fails, try to extract JSON array from text
                const match = content.match(/\[.*?\]/s);
                if (match) {
                    notes = JSON.parse(match[0]);
                } else {
                    throw new Error("Could not parse melody notes from response");
                }
            }

            // Filter and validate notes
            this.extractedMelody = notes.filter(note => {
                // Basic validation of note format (e.g., C4, D#5)
                return typeof note === 'string' && /^[A-G][#b]?[0-9]$/.test(note);
            });

            // If we have too few notes, report an error
            if (this.extractedMelody.length < 5) {
                throw new Error("Not enough valid notes extracted");
            }

            return this.extractedMelody;
        } catch (error) {
            console.error('Error extracting melody:', error);
            return null;
        } finally {
            this.isExtracting = false;
        }
    },

    // Get the current song name
    getCurrentSong() {
        return this.currentSong;
    },

    // Get the extracted melody
    getExtractedMelody() {
        return this.extractedMelody;
    },

    // Check if melody was successfully extracted
    hasMelody() {
        return this.extractedMelody.length > 0;
    }
}; 