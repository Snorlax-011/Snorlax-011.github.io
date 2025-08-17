// --- User-Provided Content ---
const markdownContent = {
    concepts: `
# Formatting

**Format string:** A string that dictates the structure of the output using format specifiers.

**Format specifiers:** Starts with \`%\` and acts as a placeholder for the things we provide in the arguments.

- **Width:** The number right after the \`%\`.
    - Specifies the minimum number of characters for the output.
    - Useful for inserting space to look nice.

- **Precision:** The number that comes after the decimal point.
    - Controls the number of digits to show after the decimal point.

---
### Examples

\`%d\`: for printing an integer
\`%f\`: for printing a float (with any no. of decimal spaces)

\`%4d\` or \`%4f\`: for printing a number that is at least 4 characters wide.
\`\`\`c
// adds 2 spaces before 69 since the minimum width is 4 and 69 is just 2 characters
printf("%4d", 69); // --> outputs '  69'
\`\`\`

\`%.8f\`: for printing floats with 8 digits after the decimal point.
\`\`\`c
// outputs 3.141592654 (9 digits after the decimal point). 
// Here minimum width of 6 is met since 3.141592654 contains 11 characters.
printf("%6.9f", 3.14159265358979323846);
\`\`\`

> \`printf\` uses \`%f\` for both \`float\` and \`double\`.

---
### Escape sequences:

- \`\\t\`: prints a tab (indents text to the next tab stop).
- \`\\n\`: moves cursor to the next line.

---

# While Loop

### Syntax
\`\`\`c
while (/* some condition */)
{
    /*
     * code to be executed
     */
}
\`\`\`

**"while"** the condition in the parentheses is true, the body (code) of the loop will be executed. The condition is tested before each iteration. The loop continues until the condition becomes false, at which point the loop ends.

---

# For Loop

### Syntax
\`\`\`c
for(initialization; condition; increment)
{
    /*
     * body
     */
}
\`\`\`

After initialization, the condition will be evaluated and if it's true, the body will be executed.
Then occurs the increment and the condition will be re-evaluated....

The program will exit the loop when the condition isn't met.
    `,
    code: `
<!-- The Code tab is currently empty. -->
    `
};

// --- Main Script Logic ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Particle Background
    tsParticles.load("tsparticles", {
        background: { color: { value: "#0a0a0a" } },
        fpsLimit: 60,
        interactivity: {
            events: { onHover: { enable: true, mode: "repulse" } },
            modes: { repulse: { distance: 100, duration: 0.4 } },
        },
        particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.1, width: 1 },
            collisions: { enable: true },
            move: {
                direction: "none",
                enable: true,
                outModes: { default: "bounce" },
                random: false,
                speed: 1,
                straight: false,
            },
            number: { density: { enable: true, area: 800 }, value: 80 },
            opacity: { value: 0.1 },
            shape: { type: "circle" },
            size: { value: { min: 1, max: 5 } },
        },
        detectRetina: true,
    });

    // Load and Render Markdown Content
    const conceptsDiv = document.getElementById('concepts-content');
    const codeDiv = document.getElementById('code-content');

    if (conceptsDiv) {
        conceptsDiv.innerHTML = marked.parse(markdownContent.concepts);
        Prism.highlightAllUnder(conceptsDiv);
    }

    if (codeDiv) {
        codeDiv.innerHTML = marked.parse(markdownContent.code);
        Prism.highlightAllUnder(codeDiv);
    }
});

// --- Tab Switching Functions ---

// Level 1: Main Tabs (My Journey)
function openMainTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("main-tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    const tablinks = document.getElementsByClassName("main-tab-link");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Level 2: Sub Tabs (C, Python, etc.)
function openSubTab(evt, tabName) {
    const tabcontent = document.getElementsByClassName("sub-tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].className = tabcontent[i].className.replace(" active", "");
    }
    const tablinks = document.getElementsByClassName("sub-tab-link");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    document.getElementById(tabName).style.display = "block";
    evt.currentTarget.className += " active";
}

// Level 3: Content Tabs (Concepts, Code)
function openContentTab(evt, tabName) {
    // This function is scoped within the active sub-tab content
    const activeSubTab = evt.currentTarget.closest('.sub-tab-content');
    const tabcontent = activeSubTab.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) {
        tabcontent[i].style.display = "none";
    }
    const tablinks = activeSubTab.getElementsByClassName("tab-link");
    for (let i = 0; i < tablinks.length; i++) {
        tablinks[i].className = tablinks[i].className.replace(" active", "");
    }
    activeSubTab.querySelector(`#${tabName}`).style.display = "block";
    evt.currentTarget.className += " active";
}
