// --- Placeholder Content ---
const markdownContent = {
    concepts: `
# C Language Concepts

## 1. Pointers
In C, a pointer is a variable that stores the memory address of another variable. They are one of the most powerful and distinctive features of the language.

### Key Ideas
- **Declaration**: \`int *ptr;\`
- **Initialization**: \`ptr = &variable;\`
- **Dereferencing**: \`value = *ptr;\` (gets the value at the address)

## 2. Memory Management
C gives you direct control over memory with functions like:
- \`malloc()\`: Allocate a block of memory.
- \`calloc()\`: Allocate and zero-out a block of memory.
- \`free()\`: Release allocated memory.
- \`realloc()\`: Resize a previously allocated block of memory.

*Forgetting to \`free\` memory leads to memory leaks!*
    `,
    code: `
# C Code Examples

## 1. Hello World
The classic starting point for any C programmer.

\`\`\`c
#include <stdio.h>

int main() {
   printf("Hello, World!\\n");
   return 0;
}
\`\`\`

## 2. Simple Pointer Example
This demonstrates how to declare, initialize, and use a pointer to access a variable's value.

\`\`\`c
#include <stdio.h>

int main() {
   int var = 20;   /* actual variable declaration */
   int *ip;        /* pointer variable declaration */

   ip = &var;  /* store address of var in pointer variable*/

   printf("Address of var variable: %p\\n", (void*)&var);
   printf("Address stored in ip variable: %p\\n", (void*)ip);
   printf("Value of *ip variable: %d\\n", *ip);

   return 0;
}
\`\`\`
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
        tabcontent[i].style.display = "none";
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
