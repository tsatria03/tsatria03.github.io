function AnnounceToScreenReader(message)
{
    const notificationArea = document.getElementById('notification-area');
    if (!notificationArea) return;
    const existingAnnouncements = notificationArea.querySelectorAll('.sr-only-announcement');
    existingAnnouncements.forEach(el => el.remove());
    const announcement = document.createElement('span');
    announcement.className = 'sr-only sr-only-announcement';
    announcement.textContent = message;
    notificationArea.appendChild(announcement);
    setTimeout(() => announcement.remove(), 1000);
}

function speak(text)
{
AnnounceToScreenReader(text);
}
