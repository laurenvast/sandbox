let sampler = new Tone.Sampler({
  urls: {
    // F3: "cow_F3.mp3",
    // F5: "cat_F5.mp3"
    F4: "mariopaintmeow.mp3"
  },
  baseUrl:
    "samples/"
}).toDestination();

// let synth = new Tone.PolySynth().toDestination();

// currentMode - 'autocomplete' or 'freeplay';
let currentMode = 'autocomplete';
let isOnboarding;
let isAutomode;
let userInput = [];
let musicData = {};
let metaInfo = {};
let currentMetaInfo = ["No track name", "No artist name"];
let matchingNotes;
const fileNames = [
	'Bach-1007.json',
	'Beethoven-13.json',
	'Beethoven-57.json',
	'Beethoven-fur elise.json',
	'Chopin-57.json',
  'Debussy-Clair de lune.json',
  'Erik Satie-Gymnopédie.json',
  'GNR-Sweet Child O Mine.json',
  'IMSLP219274-WIMA.a09d-opus57.json',
  'Jingle bell.json',
  'Johann-canon.json',
  'John Lennon-imagine.json',
  'Liszt-la campanella.json',
  'Mozart - 12 Variations on _Ah, vous dirai-je maman_, K.265.json',
  'Mozart-265.json',
  'Mozart-311.json',
  'Nintendo-super mario.json',
  'Paganini-caprice.json',
  'Strauss-blue.json',
];

const loadFiles = () => {
  const fileNamePromises = fileNames.map((name) => {
  	return fetch('./JSON_music/' + name)
  	  .then(response => response.json())
  	  .then(json => {
  			musicData[name] = json.tracks[0].notes;
  			metaInfo[name] = [json.header.name, json.header.artist];
  		})
      .catch(err => {
        console.warn(err);
      })
  });
  Promise.all(fileNamePromises).then(() => {
    console.warn(musicData);
  	console.warn('FILES LOADED');
  });
}

const findMatchingNotes = (input, notes) => {
	let result;
	for (let i = 0; i < notes.length; i++) {
		if (
      notes[i].name === input[0] &&
			notes[i + 1] &&
			notes[i + 1].name === input[1] &&
			notes[i + 2] &&
			notes[i + 2].name === input[2] &&
			notes[i].ticks != notes[i + 1].ticks &&
			notes[i + 1].ticks != notes[i + 2].ticks &&
			(i === 0 || notes[i - 1]) &&
			(i === 0 || notes[i].ticks != notes[i - 1].ticks)
			// also, what if the last note is part of a chord...?
		) {
			result = notes.slice(i, i + 50);
			break;
		}
	}
	return result;
}

const searchFilesForMatch = (input) => {
  currentMetaInfo = ["No track name", "No artist name"];
  let matchingNotesLocal;
  for (let i = 0; i < fileNames.length; i++) {
  	matchingNotesLocal = findMatchingNotes(input, musicData[fileNames[i]]);
  	if (matchingNotesLocal) {
      currentMetaInfo = metaInfo[fileNames[i]]
      break;
    }
  }
  console.warn(currentMetaInfo);
  return matchingNotesLocal;
}

const playNotes = (notes) => {
	Tone.Transport.stop();
	Tone.Transport.position = 0;
	Tone.Transport.cancel();
  
  // notes = notes.slice(3);
	const firstTime = notes[0].time;
	const lastTime = notes[notes.length - 1].time - firstTime;

	Tone.Transport.schedule((time) => {
    keyboard.classList.add("inactive");
		for (const note of notes) {
	    // synth.triggerAttackRelease(note.name, note.duration, time + (note.time - firstTime));
	    sampler.triggerAttackRelease(note.name, note.duration, time + (note.time - firstTime));
	    //try to add a key press motion when auto playing
	     // var keyOnKeyboard = document.querySelector("[data-key='"+ note.name +"']");
      // 	  if (keyOnKeyboard){
  	   //    	  keyOnKeyboard.classList.add("play");
  	   //    	  setTimeout(function(){
  	   //    	  	keyOnKeyboard.classList.remove("play"); 
  	   // remove not working
      // 	 	 }, 1000);
      	  // }
      setTimeout(() => {
        if (userInput.includes(note.name)) {
          makeNotes(note.name, "user");
        } else {
          makeNotes(note.name, "system");
        }
      }, (note.time - firstTime) * 1000)
		}
	}, '0');
	setTimeout((time) => {
    userInput = [];
	keyboard.classList.remove("inactive");
	isAutomode = true;

    hideMetaInfo();
    removeGivenNotes();
    Tone.Transport.stop();
	}, (lastTime + .5) * 1000);
  
	Tone.Transport.start();
}

var paw = document.getElementById("paw");
var keyboard = document.querySelector(".keyboard");

if (document.querySelector(".onboarding").tagName == "DIV"){
  isOnboarding = true;
} else {
  isOnboarding = false;
}

let titleEl = document.querySelector(".title");
let artistEl = document.querySelector(".artist");
function showMetaInfo(){
  titleEl.innerHTML = currentMetaInfo[0];
  artistEl.innerHTML = currentMetaInfo[1];
}
function hideMetaInfo(){
  titleEl.innerHTML = '';
  artistEl.innerHTML = '';
}

var pawnote = "<svg class='pawnote' viewBox='0 0 48 48' fill='none' xmlns='http://www.w3.org/2000/svg'><path d='M7.8211 38.4678C10.2818 43.7061 15.7796 44.0824 19.3878 45.1918C22.9959 46.3013 32.4408 45.9347 35.443 44.0245C38.4453 42.1143 41.8479 41.1592 42.7735 34.8407C45.6519 15.1924 43.5172 10.3044 36.6117 9.02428C35.5493 0.809966 25.8816 0.169898 23.9693 5.18382C19.7198 -0.36349 12.3894 5.18382 12.3894 9.77104C1.76553 9.77104 2.40863 26.9457 7.8211 38.4678Z' fill='#FFFCEB' stroke='#FFD166' stroke-width='3' stroke-linecap='round' stroke-linejoin='round' /><g opacity='0.4'><path d='M13 18C11.8 13.6 8.00003 16.5 7.50002 19C6.56469 23.6766 10 24.5 11 24C12 23.5 14.0909 22 13 18Z' fill='#FF6B6B' /><path d='M22 11C21.5 7.50002 18 7.50001 17 9.5C14.5917 14.3166 16.5 16.125 18 16.5C20.5 17.125 22.5331 14.7318 22 11Z' fill='#FF6B6B' /><path d='M31.5 10C30.2397 6.21914 26.8313 8.01837 26.5 11C26 15.5 28 16.5 30 16.5C31.5 16.5 33.1279 14.8836 31.5 10Z' fill='#FF6B6B' /><path d='M39.5 17C38 14.5 35.5 16.5 35 18C33.6667 22 36.5 24 38 24C40 24 41.5092 20.3486 39.5 17Z' fill='#FF6B6B' /><path d='M23.5 21.5C18.9723 21.5 17.3333 25 16.5 27C14.5 26.6667 10.7083 28.5 11 32C11.3333 36 14.5 36.5 17 36.5C19 38 20.5 39 24.5 39C27.7985 39 30.5 37.6667 31.5 36.5C33.5 36.5 37 36.02 37 32C37 28 34 27 32 27C30.5 23 28.0277 21.5 23.5 21.5Z' fill='#FF6B6B' /></g><g opacity='0.5'><path d='M29.9981 10.6811C30.0514 11.6462 29.5357 12.4593 28.8464 12.4973C28.1571 12.5354 27.5551 11.7839 27.5019 10.8188C27.4487 9.85381 27.9643 9.04067 28.6536 9.00265C29.3429 8.96462 29.9449 9.71611 29.9981 10.6811Z' fill='#FFFCEB' /><path d='M19.902 11.0648C19.7098 12.012 19.0055 12.6685 18.3289 12.5312C17.6524 12.3939 17.2597 11.5148 17.452 10.5676C17.6442 9.6204 18.3485 8.96385 19.025 9.10115C19.7016 9.23845 20.0942 10.1176 19.902 11.0648Z' fill='#FFFCEB' /><path d='M23.7186 28.2586C22.1349 29.3138 20.2025 29.1959 19.4025 27.9953C18.6025 26.7946 19.2379 24.9659 20.8216 23.9107C22.4053 22.8554 24.3376 22.9733 25.1376 24.1739C25.9376 25.3746 25.3023 27.2033 23.7186 28.2586Z' fill='#FFFCEB' /><path d='M11.3061 18.6944C11.1588 19.4199 10.6194 19.9228 10.1012 19.8176C9.58302 19.7124 9.28228 19.0391 9.4295 18.3136C9.57673 17.5881 10.1162 17.0852 10.6344 17.1904C11.1526 17.2956 11.4533 17.9689 11.3061 18.6944Z' fill='#FFFCEB' /><path d='M38.1579 18.4126C38.2286 19.1494 37.8592 19.7877 37.3329 19.8383C36.8065 19.8888 36.3225 19.3323 36.2518 18.5955C36.1811 17.8586 36.5505 17.2203 37.0768 17.1698C37.6032 17.1193 38.0872 17.6757 38.1579 18.4126Z' fill='#FFFCEB' /></g></svg>";

StartAudioContext(Tone.context);


keyboard.addEventListener("mousemove", function (e) {
  showCoords(event);
})
keyboard.addEventListener("mouseout", function (e) {
  clearCoords();
})

document.addEventListener("mousedown", function (e) {
	if (Tone.context.state !== 'running') {
	    Tone.context.resume();
	}
  var target = e.target;
  if (target.hasAttribute("data-key")) {
    paw.classList.remove("up");
    paw.classList.add("down");
    makeNotes(target.getAttribute("data-key"), "user");
    // synth.triggerAttackRelease(target.getAttribute("data-key"), 1);
    sampler.triggerAttackRelease(target.getAttribute("data-key"), 1);
    if (currentMode === 'freeplay') return;
    userInput.push(target.getAttribute("data-key"));
    countNotesAndProcess();
  }
});

document.addEventListener("mouseup", function (e) {
  paw.classList.remove("down");
  paw.classList.add("up");
});

function showCoords(event) {
  var x = event.clientX;
  var y = event.clientY;
  var target = event.target;
  var coor = "X coords: " + x + ", Y coords: " + y;
  paw.style.left = x + "px";
  var botton = window.innerHeight - keyboard.parentElement.offsetTop - keyboard.offsetHeight;
  
  if (target.classList.contains("black")) {
    paw.style.bottom = botton - 20 + "px";
  } else if (target.classList.contains("white")) {
    paw.style.bottom = botton - 70 + "px";
  }
}

function clearCoords() {
  paw.style.bottom = -120 + "px";
}

function makeNotes(key, outputtype) {
  var left;
  var height;
  var width;
  var keytype;
    
  console.log(key);
  var keyOnKeyboard = document.querySelector("[data-key='"+ key+"']");

  if (!keyOnKeyboard) return;

  var x = keyOnKeyboard.offsetLeft;
  var w = keyOnKeyboard.offsetWidth;

  if (keyOnKeyboard.classList.contains("white")) {
    left = x;
    width = w - 6;
    height = width;
    keytype = "white";
  } else {
    left = x - w / 2;
    width = w;
    height = width;
    keytype = "black";
  }
  var newnote = document.createElement("span");
  
  if (outputtype == "user") {
      newnote.classList.add("user");
      newnote.innerHTML = pawnote;
  } else if (outputtype == "system"){
      newnote.classList.add("system");
  }
  newnote.classList.add(keytype);
  newnote.setAttribute(
    "style",
    "margin-left:" + left + "px; width:" + width + "px;"
  );
    document.getElementById("notes").appendChild(newnote);
  
    if (isOnboarding || isAutomode) {
      newnote.classList.add("givennote");
      document.querySelector(".keyboard").classList.remove("shake");

    } else {
      moveNotes(newnote);
    }
}

function moveNotes(elem) {
  var pos = 0;
  var max = 600;
  var id = setInterval(frame, 10);

  function frame() {
    if (pos == max) {
      clearInterval(id);
      elem.remove();
    } else {
      pos++;
      elem.style.bottom = pos + "px";
    }
  }
}

function countNotesAndProcess(){
  if (userInput.length >= 3) {
	isAutomode = false;
    console.warn(userInput);
    matchingNotes = searchFilesForMatch(userInput);
    console.warn('matchingNotes');
    console.warn(matchingNotes);
    // Show the autocomplete button:
    if (matchingNotes) {
      document.querySelector("#container").classList.add("processing");
    } else {
      userInput = [];
      //no matching feedback
		const osc = new Tone.Oscillator().toDestination();
		osc.frequency.value = "C4";
		osc.frequency.rampTo("C2", .25);
		osc.start().stop("+.25");
      document.querySelector(".keyboard").classList.add("shake");
      removeGivenNotes();
      document.querySelector(".prompt>p").innerHTML = "No matching meow-tone<br>try <b>E4</b>, <b>A4</b>, <b>B4</b>";
  	  isAutomode = true;
    }
  } else if (userInput.length < 3) {
	isAutomode = true;
  }
}

function completesMusic() {      
  document.querySelector("#container").classList.remove("processing", "onboarding");
  isOnboarding = false;
  showMetaInfo();
  playNotes(matchingNotes);
}

function removeGivenNotes() {
  var givenNotes = document.querySelectorAll(".givennote");
  Array.prototype.forEach.call( givenNotes, function( eachnote ) {
    eachnote.parentNode.removeChild( eachnote );
  });
}

function toggleMode(el) {
  if (el.classList.contains("active")) return;
  userInput = [];
  keyboard.classList.remove("inactive");
  document.querySelector("button.active").classList.remove("active");
  el.classList.add("active");

  const root = document.documentElement;

  if (el.getAttribute("data-mode") == "auto") {
    currentMode = 'autocomplete';
    root.style.setProperty("--keyboard-mode", "var(--note-system)");
    document.querySelector("#container").classList.add("onboarding");
    isOnboarding = true;
    document.querySelector(".prompt>p").innerHTML = "Press 3 keys in sequence";
  } else if (el.getAttribute("data-mode") == "free") {
	isAutomode = false;
    currentMode = 'freeplay';
    root.style.setProperty("--keyboard-mode", "var(--note-user)");
    removeGivenNotes();
  }
}

// load files when page initializes
loadFiles();
