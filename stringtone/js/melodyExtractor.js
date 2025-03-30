// Melody Extractor - Uses OpenAI API to extract melody notes from songs
const melodyExtractor = {
    serverUrl: 'https://openai-server-lauren.vercel.app/api/chat', // Your OpenAI API server endpoint
    projectName: 'StringTones',
    isExtracting: false,
    currentSong: null,
    extractedMelody: [],

    // Predefined song suggestions
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
        "Twinkle Twinkle Little Star": ["C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4", "G4", "G4", "F4", "F4", "E4", "E4", "D4", "G4", "G4", "F4", "F4", "E4", "E4", "D4", "C4", "C4", "G4", "G4", "A4", "A4", "G4", "F4", "F4", "E4", "E4", "D4", "D4", "C4"],
        "Fur Elise": ["E5", "D#5", "E5", "D#5", "E5", "B4", "D5", "C5", "A4", "C4", "E4", "A4", "B4", "E4", "G#4", "B4", "C5"],
        "Happy Birthday": ["A3", "A3", "B3", "A3", "D4", "C#4", "A3", "A3", "B3", "A3", "E4", "D4", "A3", "A3", "A4", "F#4", "D4", "C#4", "B3", "G3", "G3", "A3", "G3", "C4", "B3", "G3", "G3", "A3", "G3", "D4", "C4", "G3", "G3", "G4", "E4", "C4", "B3", "A3"],
        "Canon in D": ["D4", "A4", "B4", "F#4", "G4", "D4", "G4", "A4", "F#4", "D4", "F#4", "A4", "G4", "B4", "A4", "G4", "F#4", "G4", "A4", "D4"],
        "Moonlight Sonata": ["G#4", "E4", "C#4", "A3", "E4", "C#4", "A3", "E4", "C#4", "A3", "E4", "C#4", "F#4", "D4", "B3", "A3", "D4", "B3"],
        "Yesterday - The Beatles": ["G4", "F4", "A4", "G4", "F4", "G4", "C5", "C5", "D5", "E5", "F5", "E5", "D5", "C5", "Bb4", "A4", "G4", "F4", "G4"],
        "Hallelujah - Leonard Cohen": ["E4", "G4", "G4", "E4", "G4", "A4", "A4", "A4", "G4", "G4", "E4", "E4", "G4", "A4", "A4", "A4", "G4", "G4", "E4", "G4"]
    },

    // Check if the song has a predefined melody
    hasPredefinedMelody(songName) {
        return !!this.predefinedMelodies[songName];
    },

    // Get a predefined melody
    getPredefinedMelody(songName) {
        return this.predefinedMelodies[songName] ? [...this.predefinedMelodies[songName]] : null;
    },

    // Extract melody from a song name
    async extractMelody(songName) {
        // If currently extracting, cancel the previous extraction
        if (this.isExtracting) {
            console.log(`Cancelling previous extraction to start new one for: "${songName}"`);
        }

        this.isExtracting = true;
        this.currentSong = songName;
        this.extractedMelody = []; // Clear previous melody

        try {
            // Check if we have a predefined melody for this song
            if (this.hasPredefinedMelody(songName)) {
                console.log(`Using predefined melody for "${songName}"`);
                this.extractedMelody = this.getPredefinedMelody(songName);
                return this.extractedMelody;
            }

            // If not a predefined song, use the API
            console.log(`Fetching melody for "${songName}" from API`);
            return await this.fetchMelodyFromAPI(songName);
        } catch (error) {
            console.error('Error extracting melody:', error);
            return null;
        } finally {
            this.isExtracting = false;
        }
    },

    // Fetch melody from API
    async fetchMelodyFromAPI(songName) {
        try {
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
                                     Include approx 32-64 notes that can be looped to create a recognizable melody.
                                     The notes should be suitable for a music box style playback - simple, clear, and recognizable.
                                     The lowest note should be A3. If the melody contains notes lower than A3, transpose those notes up to the appropriate octave.
                                     For example: ["C4", "E4", "G4", "C5", "G4", "E4", "C4"]
                                     Do not include any text, just the JSON array of notes.`
                        },
                        {
                            role: 'user',
                            content: `Extract the main melody notes from: "${songName}" that would sound good on a music box.`
                        }
                    ],
                    max_tokens: 200,
                    temperature: 0.3
                })
            });

            const data = await response.json();

            // Validate API response structure
            if (!data || !data.choices || !data.choices[0] || !data.choices[0].message) {
                console.error("Invalid API response structure:", data);
                throw new Error("Invalid API response structure");
            }

            // Get and log the raw content
            const content = data.choices[0].message.content;
            if (!content) {
                console.error("Empty content in API response");
                throw new Error("Empty content in API response");
            }

            console.log(`Raw content from API:`, content);

            // Parse and validate the melody
            return this.parseMelodyFromResponse(content);
        } catch (error) {
            console.error("API fetch error:", error);
            throw error;
        }
    },

    // Parse melody from API response
    parseMelodyFromResponse(content) {
        let notes;

        // Try different parsing approaches
        try {
            // First try to parse the entire response as JSON
            notes = JSON.parse(content);
        } catch (e) {
            // If that fails, try to extract JSON array from text
            try {
                const match = content.match(/\[.*?\]/s);
                if (match) {
                    notes = JSON.parse(match[0]);
                } else {
                    throw new Error("Could not find JSON array in response");
                }
            } catch (arrayError) {
                // Last resort: try to manually extract individual notes
                const noteRegex = /"([A-G][#b]?[0-9])"/g;
                const noteMatches = [...content.matchAll(noteRegex)];

                if (noteMatches.length > 0) {
                    notes = noteMatches.map(match => match[1]);
                    console.log("Manually extracted notes:", notes);
                } else {
                    throw new Error("Could not parse melody notes from response");
                }
            }
        }

        // Validate notes array
        if (!Array.isArray(notes)) {
            throw new Error("Extracted content is not an array of notes");
        }

        // Filter and validate notes
        this.extractedMelody = notes.filter(note => {
            // Basic validation of note format (e.g., C4, D#5)
            return typeof note === 'string' && /^[A-G][#b]?[0-9]$/.test(note);
        });

        console.log(`Extracted melody:`, this.extractedMelody);

        // If we have too few notes, report an error
        if (this.extractedMelody.length < 5) {
            throw new Error(`Not enough valid notes extracted (only ${this.extractedMelody.length} found)`);
        }

        return this.extractedMelody;
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