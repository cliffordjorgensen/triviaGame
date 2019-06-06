window.onload = function () {

    $("#start, #firststart").on("click", quizStarter);
    $("#quizface").on("click", ".choicebtn", gameJudger);
};

var clockRunning = false;

var quizObject = [
    { question1: "\"What does marcellus wallace look like?\"", answer1: " Kill Bill", answer2: "Joe Dirt", answer3: "Pulp Fiction", answer4: "A Bitch ", correctA: "Pulp Fiction" },
    { question1: "\"Life is like a box of chocolates\"", answer1: "Terminator 2", answer2: "The Big Lebowski", answer3: "Waynes World ", answer4: "Forrest Gump", correctA: "Forrest Gump" },
    { question1: "\"PC Load Letter? What the fuck does that mean?\"", answer1: "Office Space", answer2: "Gran Torino", answer3: "Lord of The Rings", answer4: "Braveheart", correctA: "Office Space" },
    { question1: "\"I Have Had It With These Motherf*cking Snakes On This Motherf*cking Plane!\"", answer1: "Shawshank Redempdition", answer2: "Snakes on a Plane", answer3: "The Matrix", answer4: "Scarface", correctA: "Snakes on a Plane" },
    { question1: "\"I’m about to do to you what Limp Bizkit did to music in the late ’90s.\"", answer1: "Shutter Island", answer2: "The Hangover", answer3: "Deadpool", answer4: "Harry Potter", correctA: "Deadpool" },

];

var stopwatch = {
    time: 30,
    reset: function () {
        stopwatch.time = 30;
        $("#clockdisplay").text(" 30 ");
        stopwatch.start();
    },
    start: function () {
        if (!clockRunning) {
            intervalId = setInterval(stopwatch.count, 1000);
            clockRunning = true;
        }
    },
    stop: function () {
        clearInterval(intervalId);
        clockRunning = false;
    },
    count: function () {
        stopwatch.time--;
        var converted = stopwatch.timeConverter(stopwatch.time);
        $("#clockdisplay").text(" " + converted + " ");
    },
    timeConverter: function (t) {
        var seconds = Math.floor(t);
        if (seconds === 0) {
            seconds = "00";
            stopwatch.stop();
            timesUp();
        }
        else if (seconds < 0) {
            seconds = "0" + seconds;
        }
        return seconds;
    }
};

function quizStarter() {
    wins = 0;
    loss = 0;
    gameCounter = 0;
    stopwatch.start();
    showQuizPage();
    cycleGame();

    function showQuizPage() {
        $("#mainarea").show();
        $("#quizface").show();
        $("#firststart").hide();
    }
};

function cycleGame() {
    nextQuestion = quizObject.pop();
    gameDisplay(nextQuestion, 1)

    function gameDisplay(obj, item) {
        for (key in obj) {
            if (key == "question1") {
                questonDisplay = obj[key];
                $("#b0").text(questonDisplay);
            }
            if (key == "answer1") {
                userOption1 = obj[key];
                $("#b1").text(userOption1);
            }
            if (key == "answer2") {
                userOption2 = obj[key];
                $("#b2").text(userOption2);
            }
            if (key == "answer3") {
                userOption3 = obj[key];
                $("#b3").text(userOption3);
            }
            if (key == "answer4") {
                userOption4 = obj[key];
                $("#b4").text(userOption4);
            }
            if (key == "correctA") {
                finalAnswer = obj[key];
            }
        }
    }
    quizObject.unshift(nextQuestion);
}

function gameJudger() {
    var userChoice = $(this).text();
    stopwatch.stop();

    if (userChoice == finalAnswer) {
        winMaker();
    }
    else {
        lossMaker();
    }

    function winMaker() {
        wins++
        var successList = ["yes", "winner", "you go", "you win", "thumbs up", "goldstar"];
        successWord = successList[Math.floor(Math.random() * successList.length)];
        gifPlayer(successWord)
        updateEngine("Correct");
    }
    function lossMaker() {
        loss++
        var failList = ["fail", "loser", "thumbsdown", "thumbs down", "wrong", "smh", "shakingmyhead"];
        failWord = failList[Math.floor(Math.random() * failList.length)];
        gifPlayer(failWord)
        updateEngine("Wrong");
    }
}

function timesUp() {
    loss++
    var lateList = ["timesup", "alarm", "time's up"];
    lateWord = lateList[Math.floor(Math.random() * lateList.length)];
    gifPlayer(lateWord)
    updateEngine("Time's Up");
}


function updateEngine(userAudit) {
    yourAnswer = userAudit;
    stopwatch.stop();
    gameCounter++;

    var timeFail = setInterval(showEngine, 500);

    function showEngine() {
        $("#showRightWrong").show();
        $("#showRightWrong").text(yourAnswer);
        $("#b0").text("The correct answer is " + finalAnswer);
        $("#quizface").hide();
        clearInterval(timeFail);
        $("#reviewboard").show();
        var moveOnTimer = setInterval(nextGame, 3000);

        function nextGame() {
            clearInterval(moveOnTimer);
            $("#quizface").show();
            $("#reviewboard").hide()
            $("#showRightWrong").hide();
            $("img").remove();
            stopwatch.reset();
            gameMaster();
        }
    }
}

function gifPlayer(searchTerm) {
    var queryURL = "https://api.giphy.com/v1/gifs/search?api_key=719NG9CJsiQE8fsOqJ1ghZ0YR5gDL5QC&limit=1&q=";
    queryURL += searchTerm

    $.ajax({
        url: queryURL,
        method: "GET"
    }).then(function (response) {
        response.data.forEach(function (gifObject) {
            var img = $('<img>')
            img.attr('src', gifObject.images.fixed_height.url)
            $('#reviewboard').prepend(img)
        })
    });
}
function gameMaster() {

    if (gameCounter == 5) {
        $("#quizface").hide();
        $("#b0").hide();
        $("#scoreboard").show();
        $("#winscore").text(wins);
        $("#lossscore").text(loss);
        stopwatch.stop();
        var gameRestarter = setInterval(restartGame, 4000);
    }
    if (gameCounter < 5) {
        cycleGame();
    }
    function restartGame() {
        clearInterval(gameRestarter);
        quizStarter();
        $("#b0").show();
        $("#scoreboard").hide();
        $("#quizface").show();
    }

}