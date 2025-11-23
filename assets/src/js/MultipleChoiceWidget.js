import { Widget } from "./Widget.js";

export class MultipleChoiceWidget extends Widget {
  constructor(container, page) {
    super(container, page);

    this.SELECTORS = Object.freeze({
      CHOICES: ".choices",
      CHOICE_BUTTON: ".button-choice",
      FEEDBACK_CORRECT: '.feedback[data-type="correct"]',
      FEEDBACK_INCORRECT: '.feedback[data-type="incorrect"]',
    });

    this.elements = {
      choices: null,
      choiceButtons: [],
      feedbackCorrect: null,
      feedbackIncorrect: null,
    };
    this.state = {
      answered: false,
      currentIndex: 0,
    };

    // Support multiple problems/questions
    this.problems = [];
    this.currentProblemIndex = 0;

    this.init();
  }

  init() {
    this.cacheElements();
    this.loadProblems();
    this.renderProblem(this.currentProblemIndex);
  }

  cacheElements() {
    this.elements.choices = this.container.querySelector(
      this.SELECTORS.CHOICES
    );
    // choiceButtons will be populated when rendering a problem
    this.elements.choiceButtons = [];
    this.elements.feedbackCorrect = this.container.querySelector(
      this.SELECTORS.FEEDBACK_CORRECT
    );
    this.elements.feedbackIncorrect = this.container.querySelector(
      this.SELECTORS.FEEDBACK_INCORRECT
    );

    // Hide feedback initially
    if (this.elements.feedbackCorrect) {
      this.elements.feedbackCorrect.style.display = "none";
    }
    if (this.elements.feedbackIncorrect) {
      this.elements.feedbackIncorrect.style.display = "none";
    }
  }

  bindEvents() {
    // Bind events to currently rendered choice buttons
    if (!this.elements.choiceButtons || !this.elements.choiceButtons.length)
      return;

    this.elements.choiceButtons.forEach((button, index) => {
      // Remove previous listeners to avoid duplicates
      button.replaceWith(button.cloneNode(true));
      const fresh = this.elements.choices.querySelectorAll(
        this.SELECTORS.CHOICE_BUTTON
      )[index];
      this.elements.choiceButtons[index] = fresh;
      fresh.addEventListener("click", () => this.handleChoice(fresh, index));
      fresh.addEventListener("keydown", (e) => this.handleKeydown(e, index));
    });
  }

  initializeAccessibility() {
    if (!this.elements.choiceButtons || !this.elements.choiceButtons.length)
      return;

    // Set tabindex: first button is focusable, rest are not (roving tabindex pattern)
    this.elements.choiceButtons.forEach((button, index) => {
      button.setAttribute("tabindex", index === 0 ? "0" : "-1");
      // initialize aria-checked if absent
      if (!button.hasAttribute("aria-checked")) {
        button.setAttribute("aria-checked", "false");
      }
    });
  }

  handleChoice(button, index) {
    if (this.state.answered) return;

    const isCorrect = button.getAttribute("data-correct") === "true";

    // Update aria-checked for the selected button
    this.updateSelection(index);

    if (isCorrect) {
      this.handleCorrectAnswer();
    } else {
      this.handleIncorrectAnswer(button);
    }
  }

  updateSelection(newIndex) {
    // Update aria-checked state for radio group behavior
    this.elements.choiceButtons.forEach((button, index) => {
      button.setAttribute(
        "aria-checked",
        index === newIndex ? "true" : "false"
      );
    });
    this.state.currentIndex = newIndex;
  }

  handleCorrectAnswer() {
    this.state.answered = true;

    // Show correct feedback
    if (this.elements.feedbackCorrect) {
      this.elements.feedbackCorrect.style.display = "block";
    }

    // Hide incorrect feedback if visible
    if (this.elements.feedbackIncorrect) {
      this.elements.feedbackIncorrect.style.display = "none";
    }

    // Disable all buttons
    this.elements.choiceButtons.forEach((button) => {
      button.disabled = true;
      button.setAttribute("aria-disabled", "true");
    });

    // Play effects
    if (this.page.playCorrectSound) {
      this.page.playCorrectSound();
    }
    if (this.page.celebrate) {
      this.page.celebrate();
    }

    // If multiple problems, show a next button inside the correct feedback
    this.maybeShowNextButton();
  }

  handleIncorrectAnswer(button) {
    // Disable the incorrect button
    button.disabled = true;
    button.setAttribute("aria-disabled", "true");

    // Show incorrect feedback with optional explanation
    if (this.elements.feedbackIncorrect) {
      // If the chosen button has a per-choice explanation, show it
      const explanation = button.getAttribute("data-explanation");
      if (explanation) {
        this.elements.feedbackIncorrect.textContent = explanation;
      }
      this.elements.feedbackIncorrect.style.display = "block";
    }

    // Move focus to next available button
    this.focusNextAvailableButton();
  }

  maybeShowNextButton() {
    if (!this.elements.feedbackCorrect) return;
    // remove existing next button if any
    const existing =
      this.elements.feedbackCorrect.querySelector(".mc-next-button");
    if (existing) existing.remove();

    if (this.problems && this.problems.length > 1) {
      const btn = document.createElement("button");
      btn.className = "mc-next-button button-semantic button-primary";
      btn.textContent = "Next";
      btn.addEventListener("click", () => {
        this.currentProblemIndex += 1;
        if (this.currentProblemIndex >= this.problems.length) {
          // No more problems — optionally hide or show a completion state
          this.elements.feedbackCorrect.textContent = "All done! Great work.";
          btn.remove();
          return;
        }
        // Render next problem and reset state
        this.state.answered = false;
        if (this.elements.feedbackCorrect)
          this.elements.feedbackCorrect.style.display = "none";
        if (this.elements.feedbackIncorrect)
          this.elements.feedbackIncorrect.style.display = "none";
        this.renderProblem(this.currentProblemIndex);
      });
      this.elements.feedbackCorrect.appendChild(btn);
    }
  }

  /* Problem loading & rendering */
  loadProblems() {
    // Try to read JSON from data-problems attribute first
    const raw = this.container.getAttribute("data-problems");
    if (raw) {
      try {
        const parsed = JSON.parse(raw);
        if (Array.isArray(parsed) && parsed.length) {
          this.problems = parsed.map((p) => ({
            question: p.question || "",
            choices: Array.isArray(p.choices) ? p.choices.slice() : [],
          }));
        }
      } catch (e) {
        console.error("Failed to parse data-problems JSON", e);
      }
    }

    // If no JSON problems found, fall back to reading the DOM as a single problem
    if (!this.problems.length) {
      const qTextEl = this.container.querySelector(".question");
      const questionText = qTextEl ? qTextEl.textContent.trim() : "";
      const domChoices = Array.from(
        this.container.querySelectorAll(this.SELECTORS.CHOICE_BUTTON)
      );
      if (domChoices.length) {
        const choices = domChoices.map((btn) => ({
          text: btn.textContent.trim(),
          correct: btn.getAttribute("data-correct") === "true",
          explanation: btn.getAttribute("data-explanation") || "",
        }));
        this.problems = [{ question: questionText, choices }];
      }
    }

    // Shuffle problems and choices to mix things up
    this.shuffleArray(this.problems);
    this.problems.forEach((p) => this.shuffleArray(p.choices));
  }

  renderProblem(index) {
    const problem = this.problems[index];
    if (!problem) return;

    // Update question text if element exists
    const qEl = this.container.querySelector(".question");
    if (qEl) qEl.textContent = problem.question;

    // Build choice buttons into the choices container
    if (!this.elements.choices) return;
    this.elements.choices.innerHTML = "";
    problem.choices.forEach((choice, i) => {
      const btn = document.createElement("button");
      btn.className = "button-choice";
      btn.setAttribute("role", "option");
      btn.setAttribute("data-correct", choice.correct ? "true" : "false");
      if (choice.explanation)
        btn.setAttribute("data-explanation", choice.explanation);
      btn.textContent = choice.text;
      btn.setAttribute("tabindex", "-1");
      this.elements.choices.appendChild(btn);
    });

    // Refresh choiceButtons reference and bind events
    this.elements.choiceButtons = Array.from(
      this.elements.choices.querySelectorAll(this.SELECTORS.CHOICE_BUTTON)
    );
    this.bindEvents();
    this.initializeAccessibility();

    // Reset state
    this.state.answered = false;
    this.state.currentIndex = 0;
  }

  shuffleArray(arr) {
    // Fisher-Yates shuffle
    for (let i = arr.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [arr[i], arr[j]] = [arr[j], arr[i]];
    }
  }

  focusNextAvailableButton() {
    const availableButtons = this.elements.choiceButtons.filter(
      (btn) => !btn.disabled
    );

    if (availableButtons.length > 0) {
      // Find the next non-disabled button from current position
      let nextButton = null;
      for (
        let i = this.state.currentIndex + 1;
        i < this.elements.choiceButtons.length;
        i++
      ) {
        if (!this.elements.choiceButtons[i].disabled) {
          nextButton = this.elements.choiceButtons[i];
          break;
        }
      }

      // If no button found after current, check from beginning
      if (!nextButton) {
        for (let i = 0; i < this.state.currentIndex; i++) {
          if (!this.elements.choiceButtons[i].disabled) {
            nextButton = this.elements.choiceButtons[i];
            break;
          }
        }
      }

      if (nextButton) {
        // Update tabindex for roving tabindex
        this.elements.choiceButtons.forEach((btn) =>
          btn.setAttribute("tabindex", "-1")
        );
        nextButton.setAttribute("tabindex", "0");
        nextButton.focus();
      }
    }
  }

  handleKeydown(event, index) {
    if (this.state.answered) return;

    const { key } = event;
    const currentButton = this.elements.choiceButtons[index];

    // Space or Enter to select
    if (key === " " || key === "Enter") {
      event.preventDefault();
      this.handleChoice(currentButton, index);
      return;
    }

    // Arrow key navigation (only among enabled buttons)
    let targetIndex = -1;

    if (key === "ArrowDown" || key === "ArrowRight") {
      event.preventDefault();
      targetIndex = this.getNextEnabledIndex(index, 1);
    } else if (key === "ArrowUp" || key === "ArrowLeft") {
      event.preventDefault();
      targetIndex = this.getNextEnabledIndex(index, -1);
    } else if (key === "Home") {
      event.preventDefault();
      targetIndex = this.getNextEnabledIndex(-1, 1);
    } else if (key === "End") {
      event.preventDefault();
      targetIndex = this.getNextEnabledIndex(
        this.elements.choiceButtons.length,
        -1
      );
    }

    if (targetIndex !== -1) {
      this.moveFocus(targetIndex);
    }
  }

  getNextEnabledIndex(currentIndex, direction) {
    const buttonCount = this.elements.choiceButtons.length;
    let newIndex = currentIndex;

    // Loop through buttons to find next enabled one
    for (let i = 0; i < buttonCount; i++) {
      newIndex = (newIndex + direction + buttonCount) % buttonCount;
      if (!this.elements.choiceButtons[newIndex].disabled) {
        return newIndex;
      }
    }

    // No enabled buttons found
    return -1;
  }

  moveFocus(newIndex) {
    // Update tabindex (roving tabindex pattern)
    this.elements.choiceButtons.forEach((button, index) => {
      button.setAttribute("tabindex", index === newIndex ? "0" : "-1");
    });

    // Focus the new button
    this.elements.choiceButtons[newIndex].focus();
    this.state.currentIndex = newIndex;
  }
}
