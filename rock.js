var rock = {
  phrases: [
    {
      text: 'How many roads must a man walk down, before you call him a man?',
      order: [2, 6, 8, 11, 7, 0, 10, 13, 12, 4, 1, 9, 3],
    },
    {
      text: 'You better run, you better do what you can, '
            + 'don\'t want to see no blood, don\'t be a macho man.',
      order: [3, 14, 6, 8, 15, 12, 17, 5, 2, 0, 11, 19, 18, 9, 10, 4, 7, 1, 16, 13],
    },
    {
      text: 'Takes it back to Molly waiting at the door, '
            + 'and as he gives it to her she begins to sing.',
      order: [3, 14, 6, 8, 15, 12, 17, 5, 2, 0, 11, 19, 18, 9, 10, 4, 7, 1, 16,
             13],
    },
    {
      text: 'That\'s the power makes the world around.',
      order: [2, 4, 0, 6, 1, 3, 5],
    },
    {
      text: 'We will rock you!',
      order: [1, 3, 0, 2],
    },
  ],
  state: {
    phraseIndex: 0,
    wordIndex: 0,
  },
  timer: null,
  roll: function () {
    document.addEventListener(
        'keydown',
        function(event) { handleKey(rock, event); });
    rock.display();
    rock.schedule();
  },
  toggle: function() {
    if (rock.timer == null) {
      update(rock);
    } else {
      rock.pause();
    }
  },
  schedule: function() {
    rock.pause();
    if (!isPhraseDone(rock)) {
      var durationSeconds = 5;
      rock.timer = window.setTimeout(
          function () { rock.timer = null; update(rock); },
          durationSeconds * 1000);
    }
  },
  pause: function() {
    if (rock.timer == null) { return; }
    window.clearTimeout(rock.timer);
    rock.timer = null;
  },
  nextPhrase: function() {
    var state = rock.state;
    if (state.phraseIndex >= rock.phrases.length - 1) {
      return;
    }
    state.phraseIndex++;
    state.wordIndex = 0;
  },
  prevPhrase: function() {
    var state = rock.state;
    if (state.phraseIndex == 0) {
      return;
    }
    state.phraseIndex--;
    state.wordIndex = 0;
  },
  revealPhrase: function() {
    var state = rock.state;
    state.wordIndex = rock.phrases[state.phraseIndex].order.length;
  },
  display: function() {
    var box = document.getElementById('phrase');
    if (box == null) { alert('Unable to find container.'); }

    var state = rock.state;
    box.innerHTML = generate(rock.phrases[state.phraseIndex], state.wordIndex);
  }
};

function blanks(word) {
  return word.replace(/[a-z]/gi, '*');
}

function generate(phrase, index) {
  var output = [];
  var words = phrase.text.split(/\s/);
  var wordsShown = phrase.order.slice(0, index);
  for (var i = 0; i < words.length; i++) {
    output.push(
        wordsShown.indexOf(i) >= 0 ? words[i] : blanks(words[i]));
  }
  return output.join(' ');
}

function isPhraseDone(rock) {
  var state = rock.state;
  var phrase = rock.phrases[state.phraseIndex];
  return state.wordIndex >= phrase.order.length;
}

function update(rock) {
  if (!isPhraseDone(rock)) {
    rock.state.wordIndex++;
  }
  rock.display();
  rock.schedule();
}

var actions = {
  toggle: function () {
    if (isPhraseDone(rock)) {
      rock.nextPhrase();
      rock.display();
      rock.schedule();
    } else {
      rock.toggle();
    }
  },
  skip: function() {
    rock.pause();
    if (isPhraseDone(rock)) {
      rock.nextPhrase();
      rock.display();
      rock.schedule();
    } else {
      rock.revealPhrase();
      rock.display();
    }
  },
  backwards: function() {
    var state = rock.state;
    if (state.wordIndex > 0) {
      state.wordIndex--;
    } else if (state.phraseIndex > 0) {
      rock.prevPhrase();
      rock.revealPhrase();
    }
    rock.pause();
    rock.display();
  },
  forwards: function() {
    var state = rock.state;
    if (!isPhraseDone(rock)) {
      state.wordIndex++;
    } else {
      rock.nextPhrase();
    }
    rock.pause();
    rock.display();
  },
};

function handleKey(rock, event) {
  if (event.keyCode == 32) {  // Space
    actions.toggle();
  } else if (event.keyCode == 13) {  // Return
    actions.skip();
  } else if (event.keyCode == 37) {  // Left
    actions.backwards();
  } else if (event.keyCode == 39) {  // Right
    actions.forwards();
  }
}
