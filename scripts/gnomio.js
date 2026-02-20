const observer = new MutationObserver(() => {
    const popup = document.querySelector(".swal2-container,.swal2-center,.swal2-backdrop-show");

    if (popup) {
        console.log("Atbrīvojos no mēsla :) - VIKAZE");
        popup.remove();
        document.body.style.overflow = 'auto';
        observer.disconnect();
    }
});

observer.observe(document.body, {
    childList: true,
    subtree: true
});