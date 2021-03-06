/*
 * Code for loading the left-side theorems pane -- specifically
 * the tabs and appending new theorems in the list of given
 * theorems..
 */

var selectedThm = null; // the currently selected theorem (DOM element)
var selectedSave = null;
var box = null; // the selection box
var proof;

/*
 * Load a saved proof.
 */
function loadProof(save) {
    givens = save.givens;
    goals = save.goals;
    steps = save.steps;
    points = save.points;
    lineSegments = save.lineSegments;
    angles = save.angles;
    triangles = save.triangles;
    congruences = save.congruences;
    triangleCongruences = save.triangleCongruences;
    proof = save;
    addAllSteps(steps);
    refreshGivens();
    addGoal();
    setImage(save.image);
}

function setImage(img) {
    var frame = sel('#results-content');
    if (frame && img) {
        img.style.marginTop = '10px';
        frame.appendChild(img);
    }
}

/*
 * Loads the theorems into the theorem sidebar
 */
function loadTheorems() {
    for (var i = 0; i < theoremList.length; i++) {
        addTheorem(theoremList[i]);
    };
    // loadProof(makeExercise2());
};

// for adding a theorem to the 'current theorems' tab
function addTheorem(thm) {
    var currThms = sel("#curr-theorems-content");
    var newThm = document.createElement("div");

    // pass in theorem info
    newThm.innerHTML = thm.shortName;

    // change the selected theorem to the one clicked
    newThm.onclick = function() {
        // reset selected divs
        if (selectedThm) sel("#sel-thm").id = "";

        // apply selected div id to the one clicked on
        selectedThm = this.innerHTML;
        this.id = "sel-thm";
    }

    // set class to apply CSS, add to the div
    newThm.setAttribute("class","theorem-li");
    currThms.appendChild(newThm);
}

function checkInputs(inputs, numInputs, objList, theorem) {

    console.log(inputs);
    filteredInputs = [];
    for (var i = 0; i < inputs.length; i += 1) {
        if (inputs[i])
            filteredInputs.push(i);
    };
    console.log(filteredInputs);
    if (!(filteredInputs.length === numInputs)) {
        alert("Not the right number of inputs for this theorem!");
    } else {
        var objs = [];
        for (var i = 0; i < numInputs; i += 1) {
            objs.push(objList[filteredInputs[i]]);
        }
        if (!(theorem.checkConditions(objs))) {
            alert("The theorem doesn't apply here!");
        } else {
            theorem.applyResults(objs);
            addStep(theorem.contents());
            refreshGivens();
        }
    };

    box.remove();

}

/*
 * Applies the theorem
 */
function applyTheorem(theorem) {

    // Find theorem
    var thm;
    for (var i = 0; i < theoremList.length; i += 1) {
        var th = theoremList[i];
        if (th.shortName === theorem) {
            thm = th;
        }
    }

    var options = thm.getInput()[0];
    var numOptions = thm.getInput()[1];
    box = new CheckDialog('selectionBox', options,
        function(inputs) { checkInputs(inputs, numOptions, options, thm) });
    box.open();

}

/*
 * Adds a step to the proof bench
 */
function addStep(step) {
    var currSteps = sel("#curr-steps");
    var newStep = document.createElement('div');

    newStep.innerHTML = step;
    newStep.setAttribute('class', 'step-li');

    currSteps.appendChild(newStep);
}

function addAllSteps(steps) {
    sel("#curr-steps").innerHTML = '';
    for (var i = 0; i < steps.length; i++) {
        addStep(steps[i]);
    }
}

/*
 * Adds the goal
 */
function addGoal() {
    var goalPane = sel('#results-content');
    goalPane.innerHTML = '';
    for (var i = 0; i < goals.length; i += 1) {
        goalPane.innerHTML += goals[i].toString() + '<br>';
    };
};

/*
 * Refreshes the Given pane if there are new things proven
 */
function refreshGivens() {
    var givenPane = sel('#given-content');
    givenPane.innerHTML = '';
    for (var i = 0; i < givens.length; i += 1) {
        givenPane.innerHTML += givens[i].toString() + '<br>';
    };
    if (!proof.complete && proof.proofComplete()) {
        alert("Congratulations, you have proved the theorem!");
        proof.complete = true;
    };
};

/*
 * sets handlers to the theorems so that people can see what they
 * selected, and so that the program knows what is selected
 */
function setHandlers() {
    // ASSIGN HANDLERS:

    var currThmsButton = sel("button#curr-theorems");
    var currThms = sel("#curr-theorems-content");
    // if clicking current thms button, toggle
    currThmsButton.onclick = function() {
        currThms.style.display = "block";
        builtThms.style.display = "none";
    }

    var builtThmsButton = sel("button#built-theorems");
    var builtThms = sel("#built-theorems-content");
    // if clicking built thms button, toggle
    builtThmsButton.onclick = function() {
        currThms.style.display = "none";
        builtThms.style.display = "block";
    }

    var proofArea = sel("#proof-bench");

    // clicking on the build area will trigger the
    // applyTheorem() method of the selected theorem
    proofArea.onclick = function() {
        applyTheorem(selectedThm);
    }

    setProveTheoremHandlers();
}

setHandlers();

// PROVE THEOREMS TAB -- SAVES //
var saves = new Array(); // idk?

// load the initial exercises into the prove theorems tab
function initSaves() {
    console.log(makeExercise1);
    console.log(makeExercise2);

    var ex1 = makeExercise1();
    var ex2 = makeExercise2();

    saves.push(ex1);
    saves.push(ex2);

    refreshSaves();
}

function saveCurrentProof() {
    if (!proof) // if no proof to save, do nothing
        return; // TODO maybe prompt the user to "load a proof before saving"
                // or disable the save button visually

    var currSteps = sel('#curr-steps').childNodes;
    var steps = new Array(); // to hold the steps

    // load all steps into steps Array
    for (var i = 0; i < currSteps.length; i++) {
        steps.push(currSteps[i].innerHTML);
    }

    var newSave = new Save(givens, goals, steps, points, lineSegments,
                    angles, triangles, congruences, triangleCongruences);

    newSave.name = proof.name;
    newSave.image = sel('#results-content').childNodes[2] || undefined;
    newSave.proofComplete = proof.proofComplete;
    if (proof.hasOwnProperty('complete')) {
        newSave.complete = true;
    }

    var flag = false;
    for (var k = 0; k < saves.length; k += 1) {
        if (saves[k].name === proof.name) {
            saves[k] = newSave;
            flag = true;
        };
    };

    if (!flag) {
        saves.push(newSave);
    }

    refreshSaves();
}

function refreshSaves() {
    var list = sel('#built-theorems-content');

    list.innerHTML = '';
    selectedSave = null;

    for (var i = 0; i < saves.length; i++) {
        var save = saves[i];
        var pfSave = document.createElement('div');
        pfSave.innerHTML = save.name;
        pfSave.save = save; // save inside the document object
        if (save.hasOwnProperty('complete')) {
            pfSave.innerHTML = '\u2713 ' + pfSave.innerHTML;
        }

        pfSave.setAttribute("class","save-li");

        // when we click on the save, load the save data
        pfSave.onclick = function() {
            // reset selected divs
            if (selectedSave) sel("#sel-save").id = "";

            // apply selected div id to the one clicked on
            selectedSave = this.innerHTML;
            this.id = "sel-save";

            loadProof(this.save);
        }

        list.appendChild(pfSave);
    }
}

function setProveTheoremHandlers() {
    var saveButton = sel('button#save')
    saveButton.onclick = saveCurrentProof;
}
