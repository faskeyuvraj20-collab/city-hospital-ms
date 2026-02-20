import { db } from "./firebase.js";
import { collection, getDocs, updateDoc, doc } 
from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

const table = document.getElementById("appointmentTable");

const today = new Date().toISOString().split("T")[0];

async function loadTodayAppointments(){
  const snapshot = await getDocs(collection(db, "appointments"));

  table.innerHTML = "";

  snapshot.forEach(docSnap => {
    const data = docSnap.data();

    if(data.date === today){

      const row = document.createElement("tr");

      row.innerHTML = `
        <td>${data.patientName}</td>
        <td>${data.doctorName}</td>

        <td>
          <span class="status ${data.status === "Completed" ? "completed" : "pending"}">
            ${data.status || "Pending"}
          </span>
        </td>
        <td>
          <button onclick="markCompleted('${docSnap.id}')">
            Mark Complete
          </button>
        </td>
      `;
      

      table.appendChild(row);
    }
  });
}

window.markCompleted = async function(id){
  const appointmentRef = doc(db, "appointments", id);

  await updateDoc(appointmentRef, {
    status: "Completed"
  });

  loadTodayAppointments();
}

loadTodayAppointments();
