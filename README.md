
# Variable Widget – Hello World CS Application

This repository contains my submission for the **Spring 2026 Curriculum Development Intern** position at **Hello World CS**.

The widget in `assets/src/html/widget.html` is a short, interactive activity that teaches 6th graders how to store and change a value in a variable.

---

## About This Widget

The goal of the widget is to make the idea of a “variable” feel simple and concrete:

- Students see a value stored in a “box”
- They can change the value using interactive controls
- The screen updates right away so they can connect the action they took with the new value
- Explanations are written in plain language for 6th graders

I followed the structure and style of the existing template and kept the code under the suggested length so it stays readable and easy to extend.

---

## About Me

I am a Computer Science student with experience in:

- HTML, CSS, and JavaScript  
- Building small interactive learning tools  
- Explaining technical ideas to beginners

I am **currently taking an Educational Technology course**, which has helped me think more carefully about:

- Writing clear learning objectives  
- Scaffolding concepts for younger learners  
- Designing simple interactions that support understanding instead of distracting from it  

This assignment was a fun way to connect that course with my CS background. I enjoy working at the intersection of **education and technology**, and I am excited about the chance to support K–12 students who are just starting their CS journey.

---

## Why I’m Interested in Hello World CS

The Curriculum Development Intern role is a strong match for what I like to do:

- Build interactive widgets with HTML, CSS, and JavaScript  
- Collaborate on curriculum that is accessible and equitable  
- Turn abstract CS concepts into friendly, hands-on activities  

I especially like that Hello World CS focuses on **equity-focused curriculum** and on making CS feel welcoming to more students. That aligns with the kind of impact I would like to have as I grow as an educator and engineer.

I hope this widget gives a small but clear example of how I think about teaching and interaction design.

---

## How to Run the Project Locally

There is no build step. You can serve the repository with a simple HTTP server.

From the repository root:

```bash
cd /path/to/repo
python3 -m http.server 8000
```

Then open: `http://localhost:8000/assets/src/html/widget.html`

Notes:

- `WidgetPage.getAssetPath()` decides between a development root (`../..`) and a production path based on `window.location.hostname`. Serve files from `localhost` or `127.0.0.1` to use development paths.
- Use modern browsers (Chrome/Firefox/Safari) and open files via `http://` so ES module imports work.

---

## Final Note

Thank you for reviewing my submission — I’m excited to hear back and appreciate your time and consideration.

