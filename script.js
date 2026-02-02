const notesContainer = document.getElementById("notes-container");
const addNoteBtn = document.getElementById("add-note");
const searchInput = document.getElementById("search-input");

// Load notes from localStorage on page load
document.addEventListener("DOMContentLoaded", loadNotes);

addNoteBtn.addEventListener("click", () => {
  const title = document.getElementById("note-title").value.trim();
  const content = document.getElementById("note-content").value.trim();
  const category = document.getElementById("note-category").value;
  const color = document.getElementById("note-color").value;

  if (title && content) {
    const note = { id: Date.now(), title, content, category, color };
    saveNote(note);
    renderNote(note);
    clearInputs();
  }
});

// Render a single note
function renderNote(noteObj) {
  const note = document.createElement("div");
  note.classList.add("note");
  note.style.backgroundColor = noteObj.color;
  note.dataset.id = noteObj.id;

  note.innerHTML = `
    <h3>${noteObj.title}</h3>
    <p>${noteObj.content}</p>
    <p class="note-category">Category: ${noteObj.category}</p>
    <div class="note-actions">
      <button class="edit-btn">Edit</button>
      <button class="delete-btn">Delete</button>
    </div>
  `;

  notesContainer.appendChild(note);
}

// Event delegation for edit/delete
notesContainer.addEventListener("click", (e) => {
  const noteElement = e.target.closest(".note");
  if (!noteElement) return;

  const noteId = parseInt(noteElement.dataset.id);

  if (e.target.classList.contains("edit-btn")) {
    editNote(noteId);
  } else if (e.target.classList.contains("delete-btn")) {
    deleteNote(noteId);
  }
});

// Edit note
function editNote(id) {
  let notes = getNotes();
  const note = notes.find(n => n.id === id);

  if (note) {
    document.getElementById("note-title").value = note.title;
    document.getElementById("note-content").value = note.content;
    document.getElementById("note-category").value = note.category;
    document.getElementById("note-color").value = note.color;

    // Remove old note before re-adding
    notes = notes.filter(n => n.id !== id);
    localStorage.setItem("notes", JSON.stringify(notes));
    loadNotes();
  }
}

// Delete note
function deleteNote(id) {
  let notes = getNotes().filter(n => n.id !== id);
  localStorage.setItem("notes", JSON.stringify(notes));
  loadNotes();
}

// Save note to localStorage
function saveNote(noteObj) {
  let notes = getNotes();
  notes.push(noteObj);
  localStorage.setItem("notes", JSON.stringify(notes));
}

// Load all notes
function loadNotes() {
  notesContainer.innerHTML = "";
  let notes = getNotes();
  notes.forEach(note => renderNote(note));
}

// Get notes from localStorage
function getNotes() {
  return JSON.parse(localStorage.getItem("notes")) || [];
}

// Clear input fields
function clearInputs() {
  document.getElementById("note-title").value = "";
  document.getElementById("note-content").value = "";
  document.getElementById("note-category").value = "General";
  document.getElementById("note-color").value = "#ffffff";
}

// 🔹 Search functionality
searchInput.addEventListener("input", () => {
  const query = searchInput.value.toLowerCase();
  const notes = getNotes();

  notesContainer.innerHTML = "";
  notes
    .filter(note => 
      note.title.toLowerCase().includes(query) ||
      note.category.toLowerCase().includes(query)
    )
    .forEach(note => renderNote(note));
});