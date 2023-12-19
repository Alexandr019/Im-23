document.addEventListener("DOMContentLoaded", () => {
    startRotation();
});

function startRotation() {
    for (let index = 1; index <= 3; index++) {
        const electron = document.querySelector('#electron' + index);
        if (electron == null) {
            continue;
        }
        let radius = parseInt(electron.getAttribute("animationRadius"));
        let speed = parseFloat(electron.getAttribute("animationSpeed"));

        let x, y, z;
        
        if (index === 1) {
            // Для electron1 і electron3 рухаємося вздовж кола
            x = radius * Math.cos(speed * Date.now() / 100);
            y = radius * Math.cos(speed * Date.now() / 100);
            z = radius * Math.sin(speed * Date.now() / 100);
            
        } else if (index === 2) {
            // Для electron2 рухаємося вздовж вертикальної лінії
            x = 0;
            y = radius * Math.cos(speed * Date.now() / 1000);
            z = radius * Math.sin(speed * Date.now() / 1000);
        }
		else{
			x = radius * Math.cos(speed * Date.now() / 100);
            y = 0;
            z = radius * Math.sin(speed * Date.now() / 100);
			if (index === 3) {
                y = -y;
            }
		}

        electron.setAttribute('position', { x, y, z });
    }

    requestAnimationFrame(startRotation);
}
