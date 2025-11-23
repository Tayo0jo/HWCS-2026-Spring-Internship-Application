# HTML Widget Page

## What To Do

In `assets/src/html/widget.html`, create a simple, interactive webpage—a "widget page"—that abstractly teaches 6th graders how to store and change a value in a variable.

Starter code is provided for you in the `widget.html` file. Read the documentation in the `docs/` folder to familiarize yourself with the provided code.

## Getting Started

Create a copy of this template repository, which you'll use to save and submit your work.

## Requirements

As part of your widget page:

- Create and embed a new widget that includes at least one interactive element (button, slider, input field, etc.)
- Provide visual feedback when the user interacts (something changes on screen)
- Write simple explanation text appropriate for 6th graders
- Ensure your code works in a modern browser (Chrome/Firefox/Safari)
- Follow the framework and style guidelines in the `docs/` folder
- Keep your code simple—no more than 150 lines total

## Example

See a (longer) example widget page in `assets/src/html/introduction-to-programming.html`. Your widget page should be much shorter: the intent is simply to show you what a full widget page looks like.

## Submission

Ensure your repository is publicly viewable. Then, share the link to your public GitHub repository in your application.

**We will only use your submission for review purposes. Your submission will not be utilized in any curriculum product.**

## Timing

Creating your widget should take 2 hours or less. Do not spend more than 3 hours.

## Run locally

There is no build step. Serve the repository root over a simple HTTP server and open the example HTML in a browser.

Example (macOS / zsh):

```bash
cd /path/to/widget-template-1
python3 -m http.server 8000
# then open http://localhost:8000/assets/src/html/widget.html
```

Notes:

- `WidgetPage.getAssetPath()` decides between a development root (`../..`) and a production path based on `window.location.hostname`. Serve files from `localhost` or `127.0.0.1` to use development paths.
- Use modern browsers (Chrome/Firefox/Safari) and open files via `http://` so ES module imports work.

## Minimal example (instantiate + register)

Copy this into `assets/src/html/widget.html` (or follow the existing example in that file):

```html
<!-- minimal widget container -->
<section class="my-widget" data-widget="multiple-choice">
  <!-- widget markup: choices, feedback elements, etc. -->
</section>

<script type="module">
  import { WidgetPage } from "../js/WidgetPage.js";
  import { MultipleChoiceWidget } from "../js/MultipleChoiceWidget.js";

  const page = new WidgetPage("My Widget Page", document.body);
  // Initialize all matching widget containers
  page.registerWidget(".my-widget", MultipleChoiceWidget);
</script>
```

If you need help with asset filenames (sounds/images) or want me to add a complete sample widget markup, tell me which widget type to demonstrate.

# HTML Widget Page

## What To Do

In `assets/src/html/widget.html`, create a simple, interactive webpage—a "widget page"—that abstractly teaches 6th graders how to store and change a value in a variable.

Starter code is provided for you in the `widget.html` file. Read the documentation in the `docs/` folder to familiarize yourself with the provided code.

## Getting Started

Create a copy of this template repository, which you'll use to save and [submit](#submission) your work.

## Requirements

As part of your widget page...

- Create and embed a new widget that includes at least one interactive element (button, slider, input field, etc.)
- Provide visual feedback when the user interacts (something changes on screen)
- Write simple explanation text appropriate for 6th graders
- Ensure your code works in a modern browser (Chrome/Firefox/Safari)
- Follow the framework and style guidelines in the `docs/` folder
- Keep your code simple—no more than 150 lines total

## Example

See a (longer) example widget page in `assets/src/html/introduction-to-programming.html`. Your widget page should be much shorter: the intent is simply to show you what a full widget page looks like.

## Submission

Ensure your repository is publicly viewable. Then, share the link to your public GitHub repository in your application.

**We will only use your submission for review purposes. Your submission will not be utilized in any curriculum product.**

## Timing

Creating your widget should take 2 hours or less. Do not spend more than 3 hours.
