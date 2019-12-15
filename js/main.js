var availableVoices = [
  "Thai Female",
  "Thai Male",
];

var state = {
  currentWord: null,
  voiceIndex: 0,
  level: 0,
  replayUsed: false,
}

function onSpeechEnded() {
  $("#answer-input").prop('disabled', false);
  $("#answer-input").focus();
  $("#submit-btn").prop('disabled', false);
  $("#replay-btn").show();
}

function randomDigit(isFirst) {
  if (isFirst) {
    return Math.floor(Math.random() * 10);
  } else {
    return Math.floor(Math.random() * 9) + 1;
  }
}

function getNextWord() {
  var text = '';

  for (let idx = 0; idx <= state.level; idx++) {
    text = text.concat(randomDigit(idx === 0));
  }

  state.currentWord = text;

  return text
}

function init() {
  $("#start-btn").prop('disabled', false);
  $("#answer-input").prop('disabled', true);
  $("#answer-label-correct").hide();
  $("#answer-label-wrong").hide();
  $("#level-indicator").html(state.level);
  $("#replay-btn").hide();
  $("#submit-btn").prop('disabled', true);
}

function prepareControls() {
  $("#start-btn").prop('disabled', true);
  $("#answer-input").val("");
  $("#answer-input").prop('disabled', false);
  $("#answer-input").focus();
  $("#answer-label-correct").hide();
  $("#answer-label-wrong").hide();
  $("#level-indicator").html(state.level);
  $("#replay-btn").hide();
  $("#submit-btn").prop('disabled', true);

  state.replayUsed = false;
}

function speak(text) {
  if (text === "0") text = "ศูนย์";

  var voice = availableVoices[state.voiceIndex];
  responsiveVoice.speak(text, voice, { onend: onSpeechEnded });
}

function evaluateAnswer() {
  var answer = $("#answer-input").val();
  var result = answer === state.currentWord;

  if (result) {
    $("#answer-label-correct").show();
    if (!state.replayUsed) {
      state.level++;
    }
  } else {
    $("#answer-label-wrong").show();
    if (state.level > 0) state.level--;
  }

  $("#level-indicator").html(state.level);
  $("#answer-input").prop('disabled', true);
  $("#start-btn").focus();
}

$(document).ready(function () {

  init();

  $("#start-btn").on("click", function () {
    prepareControls();
    speak(getNextWord());
  });

  $("#answer-input").on("keyup", function(event) {
    if (event.keyCode === 13) $("#submit-btn").trigger("click");
  })

  $("#submit-btn").on("click", function () {
    $("#submit-btn").prop('disabled', true);
    evaluateAnswer();
    $("#start-btn").prop('disabled', false);
  })

  $("#replay-btn").on("click", function () {
    state.replayUsed = true;
    speak(state.currentWord);
    $("#replay-btn").hide();
    $("#answer-input").focus();
  })
});
