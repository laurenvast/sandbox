// Melody Extractor - Uses OpenAI API to extract melody notes from songs
const vercel = 'https://openai-server-lauren.vercel.app';
const local = 'http://localhost:8888';
const melodyExtractor = {
    serverUrl: vercel + '/api/chat', // Your OpenAI API server endpoint
    projectName: 'StringTones',
    isExtracting: false,
    currentSong: null,
    extractedMelody: [],

    // Predefined song suggestions
    suggestedSongs: [
        "Random Tones",
        "Twinkle Twinkle Little Star",
        "Fur Elise",
        "Happy Birthday",
        "Canon in D",
        "Moonlight Sonata",
        "Hallelujah - Leonard Cohen"
    ],

    // Pre-defined melodies for suggested songs (with simplified property names)
    predefinedMelodies: {
        "Twinkle Twinkle Little Star": [
            { n: "C4", d: 1 }, { n: "C4", d: 1 },
            { n: "G4", d: 1 }, { n: "G4", d: 1 },
            { n: "A4", d: 1 }, { n: "A4", d: 1 },
            { n: "G4", d: 2 },
            { n: "F4", d: 1 }, { n: "F4", d: 1 },
            { n: "E4", d: 1 }, { n: "E4", d: 1 },
            { n: "D4", d: 1 }, { n: "D4", d: 1 },
            { n: "C4", d: 2 },
            // Second verse
            { n: "G4", d: 1 }, { n: "G4", d: 1 },
            { n: "F4", d: 1 }, { n: "F4", d: 1 },
            { n: "E4", d: 1 }, { n: "E4", d: 1 },
            { n: "D4", d: 2 },
            { n: "G4", d: 1 }, { n: "G4", d: 1 },
            { n: "F4", d: 1 }, { n: "F4", d: 1 },
            { n: "E4", d: 1 }, { n: "E4", d: 1 },
            { n: "D4", d: 2 },
            // Repeat first verse
            { n: "C4", d: 1 }, { n: "C4", d: 1 },
            { n: "G4", d: 1 }, { n: "G4", d: 1 },
            { n: "A4", d: 1 }, { n: "A4", d: 1 },
            { n: "G4", d: 2 },
            { n: "F4", d: 1 }, { n: "F4", d: 1 },
            { n: "E4", d: 1 }, { n: "E4", d: 1 },
            { n: "D4", d: 1 }, { n: "D4", d: 1 },
            { n: "C4", d: 2 }
        ],
        "Fur Elise": [
            { n: "E5", d: 0.5 }, { n: "D#5", d: 0.5 },
            { n: "E5", d: 0.5 }, { n: "D#5", d: 0.5 },
            { n: "E5", d: 0.5 }, { n: "B4", d: 0.5 },
            { n: "D5", d: 0.5 }, { n: "C5", d: 0.5 },
            { n: "A4", d: 1 }, { n: "C4", d: 0.5 },
            { n: "E4", d: 0.5 }, { n: "A4", d: 0.5 },
            { n: "B4", d: 1 }, { n: "E4", d: 0.5 },
            { n: "G#4", d: 0.5 }, { n: "B4", d: 0.5 },
            { n: "C5", d: 1 },
            // Second part
            { n: "E4", d: 0.5 }, { n: "E5", d: 0.5 },
            { n: "D#5", d: 0.5 }, { n: "E5", d: 0.5 },
            { n: "D#5", d: 0.5 }, { n: "E5", d: 0.5 },
            { n: "B4", d: 0.5 }, { n: "D5", d: 0.5 },
            { n: "C5", d: 0.5 }, { n: "A4", d: 1 },
            { n: "C4", d: 0.5 }, { n: "E4", d: 0.5 },
            { n: "A4", d: 0.5 }, { n: "B4", d: 1 },
            { n: "E4", d: 0.5 }, { n: "C5", d: 0.5 },
            { n: "B4", d: 0.5 }, { n: "A4", d: 1 },
            // Third part
            { n: "B4", d: 0.5 }, { n: "C5", d: 0.5 },
            { n: "D5", d: 0.5 }, { n: "E5", d: 1 },
            { n: "G4", d: 0.5 }, { n: "F5", d: 0.5 },
            { n: "E5", d: 0.5 }, { n: "D5", d: 1 },
            { n: "F4", d: 0.5 }, { n: "E5", d: 0.5 },
            { n: "D5", d: 0.5 }, { n: "C5", d: 1 },
            { n: "E4", d: 0.5 }, { n: "D5", d: 0.5 },
            { n: "C5", d: 0.5 }, { n: "B4", d: 1 }
        ],
        "Happy Birthday": [
            { n: "A3", d: 0.5 }, { n: "A3", d: 0.5 },
            { n: "B3", d: 1 }, { n: "A3", d: 1 },
            { n: "D4", d: 1 }, { n: "C#4", d: 2 },
            { n: "A3", d: 0.5 }, { n: "A3", d: 0.5 },
            { n: "B3", d: 1 }, { n: "A3", d: 1 },
            { n: "E4", d: 1 }, { n: "D4", d: 2 },
            { n: "A3", d: 0.5 }, { n: "A3", d: 0.5 },
            { n: "A4", d: 1 }, { n: "F#4", d: 1 },
            { n: "D4", d: 1 }, { n: "C#4", d: 1 },
            { n: "B3", d: 1 }, { n: "G4", d: 0.5 },
            { n: "G4", d: 0.5 }, { n: "F#4", d: 1 },
            { n: "D4", d: 1 }, { n: "E4", d: 1 },
            { n: "D4", d: 2 }
        ],
        "Canon in D": [
            { n: "F#4", d: 1 }, { n: "E4", d: 1 },
            { n: "D4", d: 1 }, { n: "C#4", d: 1 },
            { n: "B3", d: 1 }, { n: "A3", d: 1 },
            { n: "B3", d: 1 }, { n: "C#4", d: 1 },
            { n: "D4", d: 1 }, { n: "F#4", d: 1 },
            { n: "A4", d: 1 }, { n: "D5", d: 1 },
            { n: "C#5", d: 1 }, { n: "B4", d: 1 },
            { n: "A4", d: 1 }, { n: "B4", d: 1 },

            { n: "F#4", d: 1 }, { n: "G4", d: 1 },
            { n: "A4", d: 1 }, { n: "F#4", d: 1 },
            { n: "D4", d: 1 }, { n: "F#4", d: 1 },
            { n: "A4", d: 1 }, { n: "A3", d: 1 },

            { n: "D4", d: 1 }, { n: "F#4", d: 1 },
            { n: "A4", d: 1 }, { n: "G4", d: 1 },
            { n: "F#4", d: 1 }, { n: "D4", d: 1 },
            { n: "E4", d: 1 }, { n: "F#4", d: 1 },

            { n: "G4", d: 1 }, { n: "B4", d: 1 },
            { n: "A4", d: 1 }, { n: "G4", d: 1 },
            { n: "F#4", d: 1 }, { n: "D4", d: 1 },
            { n: "E4", d: 1 }, { n: "F#4", d: 1 }
        ],
        "Moonlight Sonata": [
            { n: "C#4", d: 0.5 }, { n: "E4", d: 0.5 }, { n: "G#4", d: 0.5 },
            { n: "C#5", d: 2 }, { n: "B4", d: 0.5 },
            { n: "G#4", d: 0.5 }, { n: "E4", d: 0.5 }, { n: "B4", d: 2 },
            { n: "A4", d: 0.5 }, { n: "F#4", d: 0.5 }, { n: "D4", d: 0.5 },
            { n: "A4", d: 2 }, { n: "G#4", d: 0.5 },
            { n: "E4", d: 0.5 }, { n: "C#4", d: 0.5 }, { n: "G#4", d: 2 },
            { n: "F#4", d: 0.5 }, { n: "D4", d: 0.5 }, { n: "C#4", d: 0.5 },
            { n: "F#4", d: 2 }, { n: "E4", d: 0.5 },
            { n: "C#4", d: 0.5 }, { n: "B3", d: 0.5 }, { n: "E4", d: 2 }
        ],
        "Yesterday - The Beatles": [
            // Intro/Verse - "Yesterday, all my troubles seemed so far away"
            { n: "F4", d: 0.5 }, { n: "E4", d: 0.5 },
            { n: "D4", d: 0.5 }, { n: "C#4", d: 0.5 },
            { n: "D4", d: 1 }, { n: "G3", d: 1 },
            { n: "Bb3", d: 1 }, { n: "A3", d: 1 },
            { n: "A3", d: 0.5 }, { n: "G3", d: 0.5 },
            { n: "F4", d: 1 }, { n: "F4", d: 1 },
            // "Now it looks as though they're here to stay"
            { n: "E4", d: 0.5 }, { n: "D4", d: 0.5 },
            { n: "C4", d: 0.5 }, { n: "Bb3", d: 0.5 },
            { n: "C4", d: 1 }, { n: "F3", d: 1 },
            { n: "D4", d: 1 }, { n: "C4", d: 1 },
            // "Oh, I believe in yesterday"
            { n: "Bb3", d: 0.5 }, { n: "A3", d: 0.5 },
            { n: "G3", d: 0.5 }, { n: "F3", d: 0.5 },
            { n: "G3", d: 1 }, { n: "Bb3", d: 1 },
            { n: "D4", d: 1 }, { n: "F4", d: 1 },
            { n: "A4", d: 1 }, { n: "G4", d: 2 }
        ],
        "Hallelujah - Leonard Cohen": [
            { n: "E4", d: 1 }, { n: "G4", d: 1 },
            { n: "G4", d: 1.5 }, { n: "E4", d: 1 },
            { n: "G4", d: 1 }, { n: "A4", d: 1.5 },
            { n: "A4", d: 1 }, { n: "A4", d: 1 },
            { n: "G4", d: 2 }, { n: "E4", d: 1 },
            { n: "E4", d: 1 }, { n: "F4", d: 1 },
            { n: "F4", d: 1 }, { n: "C4", d: 1 },
            { n: "C4", d: 1 }, { n: "D4", d: 1 },
            { n: "D4", d: 1 }, { n: "D4", d: 1 },
            { n: "D4", d: 1 }, { n: "G4", d: 1.5 },
            { n: "G4", d: 1 }, { n: "A4", d: 1 },
            { n: "A4", d: 1 }, { n: "A4", d: 1 },
            { n: "G4", d: 2 }
        ]
    },

    // Check if the song has a predefined melody
    hasPredefinedMelody(songName) {
        if (songName === "Random Tones") {
            return true; // Special case - handled differently
        }
        return !!this.predefinedMelodies[songName];
    },

    // Get a predefined melody
    getPredefinedMelody(songName) {
        if (songName === "Random Tones") {
            // Special case - trigger procedural melody
            // Return empty array to signal we should use the procedural system
            return [];
        }
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
                    model: 'gpt-3.5-turbo',
                    messages: [
                        {
                            role: 'system',
                            content: `You are a music expert. Extract the main melody notes from the song provided in a simple format.
                                     Focus on the most famous and recognizable melody part of the song in a complete and recognizable form.
                                     Return ONLY a JSON array of note objects with 'n' for note and 'd' for duration properties.
                                     For the note (n), use scientific pitch notation (e.g., "C4", "D#4", "F5").
                                     For duration (d), use relative values where 1.0 = quarter note, 0.5 = eighth note, 2.0 = half note, etc.
                                     Include approx 32-64 notes to create a recognizable and complete melody.
                                     The notes should be suitable for a music box style playback - simple, clear, and recognizable.
                                     The lowest note should be A3. If the melody contains notes lower than A3, transpose those notes up to the appropriate octave.
                                     For example: [{"n": "C4", "d": 1}, {"n": "E4", "d": 0.5}, {"n": "G4", "d": 2}]
                                     Do not include any text, just the JSON array of note objects.`
                        },
                        {
                            role: 'user',
                            content: `Extract the main melody notes from: "${songName}" that would sound good on a music box. Include the proper rhythm by specifying duration for each note. Use simplified JSON format with 'n' for note and 'd' for duration.`
                        }
                    ],
                    max_tokens: 1024,
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
                // Last resort: try to manually extract individual notes and durations
                console.log("Could not parse JSON array, trying manual extraction...");

                // For simple note-only format
                const noteRegex = /"([A-G][#b]?[0-9])"/g;
                const noteMatches = [...content.matchAll(noteRegex)];

                if (noteMatches.length > 0) {
                    // If we have notes but no durations, create default objects
                    notes = noteMatches.map(match => ({
                        n: match[1],
                        d: 1  // Default to quarter note duration
                    }));
                    console.log("Manually extracted notes with default durations:", notes);
                } else {
                    throw new Error("Could not parse melody notes from response");
                }
            }
        }

        // Validate notes array
        if (!Array.isArray(notes)) {
            throw new Error("Extracted content is not an array");
        }

        // Process and validate each note
        this.extractedMelody = notes.map(note => {
            // Check for both formats - old (noteValue, duration) and new (n, d)
            if (typeof note === 'object') {
                if (note.n && note.d) {
                    // Already in correct format
                    return {
                        n: note.n,
                        d: note.d
                    };
                } else if (note.noteValue) {
                    // Convert from old format to new format
                    return {
                        n: note.noteValue,
                        d: note.duration || 1  // Default to 1 if duration is missing
                    };
                } else {
                    console.warn("Invalid note object format:", note);
                    return null;
                }
            }
            // If it's just a string (note name)
            else if (typeof note === 'string') {
                return {
                    n: note,
                    d: 1  // Default duration for string notes
                };
            }
            // Invalid data
            else {
                console.warn("Invalid note format:", note);
                return null;
            }
        }).filter(note => {
            // Filter out nulls and validate note format
            if (!note) return false;

            // Check that note value is a valid format
            if (typeof note.n !== 'string' || !/^[A-G][#b]?[0-9]$/.test(note.n)) {
                return false;
            }

            // Check that duration is a positive number
            if (typeof note.d !== 'number' || note.d <= 0) {
                note.d = 1; // Fix invalid duration with default
            }

            return true;
        });

        console.log(`Processed melody with simplified format:`, this.extractedMelody);

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