document.addEventListener('DOMContentLoaded', function() {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const galleryItems = document.querySelectorAll('.gallery-item');

    filterButtons.forEach(button => {
        button.addEventListener('click', function() {
            // Get the filter category from the button's data attribute
            const filterValue = this.getAttribute('data-filter');

            // Update active state on buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            this.classList.add('active');

            // Loop through all gallery items and toggle the 'hidden' class
            galleryItems.forEach(item => {
                const itemCategory = item.getAttribute('data-category');

                if (filterValue === 'all' || itemCategory === filterValue) {
                    // Show the item
                    item.classList.remove('hidden');
                } else {
                    // Hide the item
                    item.classList.add('hidden');
                }
            });
        });
    });
});