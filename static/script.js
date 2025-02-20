document.addEventListener("DOMContentLoaded", function () {
    const ticketCardsContainer = document.getElementById("ticket-cards-container");

    // Fonction pour lister les tickets sous forme de cartes
    function listTickets() {
        fetch('/tickets')
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    const tickets = data.tickets;
                    ticketCardsContainer.innerHTML = '';

                    tickets.forEach(ticket => {
                        const card = document.createElement('div');
                        card.classList.add('bg-white', 'shadow-lg', 'rounded-lg', 'p-6', 'hover:scale-105', 'transition-transform', 'duration-300');
                        const badgeClass = ticket.statut === "résolu" ? "bg-green-500" : "bg-red-500";

                        // Vérification de la présence de "ticket.directory" et extraction de la partie après la virgule
                        let directory = 'N/A';
                        if (ticket.directory && Array.isArray(ticket.directory)) {
                            directory = ticket.directory[1] || 'N/A';
                        }

                        // Ajouter la carte au conteneur
                        card.innerHTML = `
                            <h3 class="text-xl font-semibold mb-4 flex items-center">
                                <i class="fas fa-exclamation-circle mr-2"></i> Problème de type ${ticket.problem_type}
                            </h3>
                            <p class="text-gray-700 mb-2"><i class="fas fa-info-circle mr-2"></i>${ticket.description}</p>
                            <p class="text-gray-700 mb-2"><span class="inline-flex items-center px-3 py-1 text-sm font-medium ${badgeClass} text-white rounded-full">
                                ${ticket.statut}
                            </span></p>
                            <p class="text-gray-700 mb-2"><i class="fas fa-user-circle mr-2"></i>${directory}</p>
                            <p class="text-gray-700"><i class="fas fa-calendar-alt mr-2"></i>${ticket.period}</p>
                        `;

                        // Ajouter la carte au conteneur
                        ticketCardsContainer.appendChild(card);
                    });

                    // Masquer le loader et afficher le contenu
                    document.getElementById('loader').style.display = 'none';
                    document.getElementById('content').style.display = 'block';
                } else {
                    alert('Erreur lors de la récupération des tickets');
                }
            })
            .catch(error => console.error('Error:', error));
    }

    listTickets();

});

document.addEventListener("DOMContentLoaded", function () {
    const openModalBtn = document.getElementById("open-modal");
    const closeModalBtn = document.getElementById("close-modal");
    const ticketModal = document.getElementById("ticket-modal");
    const ticketForm = document.getElementById("ticket-form");

    // Fonction pour réinitialiser le formulaire
    function resetForm() {
        ticketForm.reset(); // Réinitialise tous les champs du formulaire
        // Cacher les messages d'erreur et réinitialiser les styles
        document.getElementById("name-error").classList.add("hidden");
        document.getElementById("function-error").classList.add("hidden");
        document.getElementById("description-error").classList.add("hidden");
        document.getElementById("user-name").classList.remove("border-red-500");
        document.getElementById("user-function").classList.remove("border-red-500");
        document.getElementById("problem-description").classList.remove("border-red-500");
    }

    // Vérifie si le bouton d'ouverture de la modal existe avant d'ajouter l'événement
    if (openModalBtn) {
        openModalBtn.addEventListener("click", () => {
            ticketModal.classList.remove("hidden");
        });
    }

    // Vérifie si le bouton de fermeture de la modal existe avant d'ajouter l'événement
    if (closeModalBtn) {
        closeModalBtn.addEventListener("click", () => {
            ticketModal.classList.add("hidden");
            resetForm(); // Réinitialiser les champs lorsque la modal est fermée
        });
    }

    // Fonction pour afficher un toast
    function showToast(message, type) {
        const toastContainer = document.getElementById("toast-container");
        const toast = document.createElement("div");
        toast.classList.add("flex", "items-center", "w-full", "max-w-xs", "p-4", "mb-4", "rounded-lg", "shadow-lg", "bg-white");

        // Icône avec FontAwesome
        const iconDiv = document.createElement("div");
        iconDiv.classList.add("w-6", "h-6", "flex", "items-center", "justify-center", "rounded-full", "mr-3");
        if (type === "success") {
            iconDiv.classList.add("bg-green-500");
        } else {
            iconDiv.classList.add("bg-red-500");
        }

        const icon = document.createElement("i");
        icon.classList.add("fas", "text-white");
        if (type === "success") {
            icon.classList.add("fa-check");
        } else {
            icon.classList.add("fa-times");
        }
        iconDiv.appendChild(icon);

        // Message
        const messageDiv = document.createElement("div");
        messageDiv.classList.add("text-sm", "font-normal");
        messageDiv.innerText = message;

        // Bouton de fermeture
        const closeButton = document.createElement("button");
        closeButton.classList.add("ms-auto", "-mx-1.5", "-my-1.5", "bg-white", "text-gray-400", "hover:text-gray-900", "rounded-lg", "focus:ring-2", "focus:ring-gray-300", "p-1.5", "hover:bg-gray-100", "inline-flex", "items-center", "justify-center", "h-8", "w-8");
        closeButton.innerHTML = `<span class="sr-only">Close</span><svg class="w-3 h-3" fill="none" viewBox="0 0 14 14"><path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6"/></svg>`;
        closeButton.onclick = () => toast.remove();

        // Ajouter l'icône et le message au toast
        toast.appendChild(iconDiv);
        toast.appendChild(messageDiv);
        toast.appendChild(closeButton);

        // Ajouter le toast au conteneur
        toastContainer.appendChild(toast);

        // Supprimer le toast après 5 secondes
        setTimeout(() => {
            toast.remove();
        }, 5000);
    }

    // Gestion de la soumission du formulaire
    ticketForm.addEventListener("submit", (e) => {
        e.preventDefault();

        // Récupérer les valeurs
        const userName = document.getElementById("user-name").value.trim();
        const userFunction = document.getElementById("user-function").value.trim();
        const problemType = document.getElementById("problem-type").value;
        const description = document.getElementById("problem-description").value.trim();
        const location = document.getElementById("location").value.trim()

        // Réinitialiser les erreurs
        document.getElementById("name-error").classList.add("hidden");
        document.getElementById("function-error").classList.add("hidden");
        document.getElementById("description-error").classList.add("hidden");
        document.getElementById("user-name").classList.remove("border-red-500");
        document.getElementById("user-function").classList.remove("border-red-500");
        document.getElementById("problem-description").classList.remove("border-red-500");
        document.getElementById("location").classList.remove("border-red-500");

        // Vérifier que tous les champs sont remplis
        let hasError = false;

        if (!userName) {
            document.getElementById("user-name").classList.add("border-red-500");
            document.getElementById("name-error").classList.remove("hidden");
            hasError = true;
        }

        if (!userFunction) {
            document.getElementById("user-function").classList.add("border-red-500");
            document.getElementById("function-error").classList.remove("hidden");
            hasError = true;
        }

        if (!description) {
            document.getElementById("problem-description").classList.add("border-red-500");
            document.getElementById("description-error").classList.remove("hidden");
            hasError = true;
        }

        if (hasError) {
            showToast("Veuillez remplir tous les champs.", "error");
            return;
        }

        // Appel à l'API pour créer le ticket
        fetch('/ticket', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                name: userName,
                function: userFunction,
                problem_type: problemType,
                description: description,
            }),
        })
            .then(response => response.json())
            .then(data => {
                if (data.status === "success") {
                    showToast("Le ticket a été soumis avec succès !", "success");
                    ticketModal.classList.add("hidden");
                    resetForm();
                } else {
                    showToast("Erreur lors de la création du ticket !", "error");
                }
            })
            .catch(error => {
                console.error('Error:', error);
                showToast("Erreur lors de la soumission du formulaire", "error");
            });

        // Simuler un envoi (remplacer par un appel à l'API si nécessaire)
        console.log("Ticket soumis :", { name: userName, function: userFunction, type: problemType, description });

        // Fermer la modal après soumission
        ticketModal.classList.add("hidden");

        // Réinitialiser le formulaire après soumission
        resetForm();

    });
});