function ScreenReaderSpeak(msg)
{
    let region = document.getElementById("notification-area");
    if (!region)
    {
        region = document.createElement("div");
        region.id = "notification-area";
        region.setAttribute("aria-live","assertive");
        region.style.position = "absolute";
        region.style.left = "-10000px";
        region.style.width = "1px";
        region.style.height = "1px";
        region.style.overflow = "hidden";
        document.body.appendChild(region);
    }
    region.textContent = "";
    setTimeout(()=>{
        region.textContent = msg;
    },10);
}


function setStatus(text)
{
    ScreenReaderSpeak(text);
}
