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

    // Extract melody from a song name
    async extractMelody(songName) {
        if (this.isExtracting) return null;
        this.isExtracting = true;
        this.currentSong = songName;

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