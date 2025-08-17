// ===================================================================================
// YOUR CONTENT DATABASE
// To add a new part, just copy one of the blocks and paste it at the end of the list.
// ===================================================================================
const conceptsDatabase = [
    {
        title: "Part 1: Formatting",
        id: "formatting",
        content: `
# Formatting

**Format string:** A string that dictates the structure of the output using format specifiers.

**Format specifiers:** Starts with \`%\` and acts as a placeholder for the things we provide in the arguments.

- **Width:** The number right after the \`%\`.
- **Precision:** The number that comes after the decimal point.
`
    },
    {
        title: "Part 2: While Loop",
        id: "whileLoop",
        content: `
# While Loop

### Syntax
\`\`\`c
while (/* some condition */)
{
    /* code to be executed */
}
\`\`\`

**"while"** the condition in the parentheses is true, the body (code) of the loop will be executed. The condition is tested before each iteration.
`
    },
    {
        title: "Part 3: For Loop",
        id: "forLoop",
        content: `
# For Loop

### Syntax
\`\`\`c
for(initialization; condition; increment)
{
    /* body */
}
\`\`\`

After initialization, the condition will be evaluated and if it's true, the body will be executed. Then occurs the increment and the condition will be re-evaluated.
`
    }
    // PASTE NEW PARTS HERE
];
// ===================================================================================
// END OF CONTENT DATABASE
// ===================================================================================


// --- Main Script Logic ---
document.addEventListener('DOMContentLoaded', () => {
    
    // Initialize Particle Background
    tsParticles.load("tsparticles", {
        background: { color: { value: "#0a0a0a" } },
        fpsLimit: 60,
        interactivity: { events: { onHover: { enable: true, mode: "repulse" } } },
        particles: {
            color: { value: "#ffffff" },
            links: { color: "#ffffff", distance: 150, enable: true, opacity: 0.1, width: 1 },
            move: { direction: "none", enable: true, outModes: { default: "bounce" }, speed: 1 },
            number: { density: { enable: true, area: 800 }, value: 80 },
        },
    });

    // --- Auto-generate Menu and Content from the Database ---
    const menuContainer = document.getElementById('concepts-menu');
    const contentContainer = document.getElementById('concepts-content-area');

    conceptsDatabase.forEach((part, index) => {
        // Create a menu button for this part
        const button = document.createElement('button');
        button.className = 'menu-button';
        button.textContent = part.title;
        button.onclick = () => openContentPart(part.id);
        menuContainer.appendChild(button);

        // Create the content div for this part
        const contentDiv = document.createElement('div');
        contentDiv.id = part.id;
        contentDiv.className = 'content-part markdown-body';
        contentDiv.innerHTML = marked.parse(part.content);
        contentContainer.appendChild(contentDiv);

        // If it's the first item, make it active by default
        if (index === 0) {
            button.classList.add('active');
            contentDiv.style.display = 'block';
        }
    });

    // Highlight all code blocks on the page
    Prism.highlightAll();
});


// --- Tab Switching Functions ---

// This function now controls the dynamic parts
function openContentPart(partId) {
    // Hide all content parts
    const allContent = document.querySelectorAll('.content-part');
    allContent.forEach(part => part.style.display = 'none');

    // Deactivate all menu buttons
    const allButtons = document.querySelectorAll('.menu-button');
    allButtons.forEach(btn => btn.classList.remove('active'));

    // Show the selected content part
    document.getElementById(partId).style.display = 'block';

    // Activate the clicked menu button
    // We find the button by looping through them and checking their text content
    allButtons.forEach(btn => {
        const correspondingPart = conceptsDatabase.find(p => p.title === btn.textContent);
        if (correspondingPart && correspondingPart.id === partId) {
            btn.classList.add('active');
        }
    });
}


// These functions are for the static tabs (Concepts/Code)
function openContentTab(evt, tabName) {
    const activeSubTab = evt.currentTarget.closest('.sub-tab-content');
    const tabcontent = activeSubTab.getElementsByClassName("tab-content");
    for (let i = 0; i < tabcontent.length; i++) { tabcontent[i].style.display = "none"; }
    const tablinks = activeSubTab.getElementsByClassName("tab-link");
    for (let i = 0; i < tablinks.length; i++) { tablinks[i].className = tablinks[i].className.replace(" active", ""); }
    activeSubTab.querySelector(`#${tabName}`).style.display = "block";
    evt.currentTarget.className += " active";
}
