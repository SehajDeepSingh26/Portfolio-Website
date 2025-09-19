
window.onload = () => {
    document.body.style.zoom = "90%";
};
$(document).ready(function () {

    $('#menu').click(function () {
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('scroll load', function () {
        $('#menu').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if (window.scrollY > 60) {
            document.querySelector('#scroll-top').classList.add('active');
        } else {
            document.querySelector('#scroll-top').classList.remove('active');
        }

        // scroll spy
        $('section').each(function () {
            let height = $(this).height();
            let offset = $(this).offset().top - 200;
            let top = $(window).scrollTop();
            let id = $(this).attr('id');

            if (top > offset && top < offset + height) {
                $('.navbar ul li a').removeClass('active');
                $('.navbar').find(`[href="#${id}"]`).addClass('active');
            }
        });
    });

    // smooth scrolling
    $('a[href*="#"]').on('click', function (e) {
        e.preventDefault();
        $('html, body').animate({
            scrollTop: $($(this).attr('href')).offset().top,
        }, 500, 'linear')
    });

    navigator.geolocation.getCurrentPosition(
        async function (position) {
            // ✅ User granted location access
            const latitude = position.coords.latitude;
            const longitude = position.coords.longitude;
            // console.log("📍 Using browser GPS:", latitude, longitude);

            try {
                // ⬅️ Reverse Geocode using Nominatim (OpenStreetMap)
                const response = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${latitude}&lon=${longitude}&format=json`);
                const data = await response.json();

                const city = data.address.city || data.address.town || data.address.village || 'Unknown';
                const state = data.address.state || 'Unknown';
                const country = data.address.country || 'Unknown';

                // console.log("📌 Reverse geocoded:", { city, state, country });

                // 📤 Send to backend
                fetch('/api/data', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({
                        city,
                        state,
                        country,
                        latitude,
                        longitude,
                        source: "navigator.geolocation"
                    })
                })
                .then(res => res.json())
                // .then(result => console.log('✅ Location saved:', result))
                // .catch(err => console.error('❌ Error saving location:', err));

            } catch (error) {
                // console.error('❌ Error in reverse geocoding:', error);
            }
        },

        function (error) {
            // ❌ Fallback: IP-based geolocation
            // console.warn("⚠️ Falling back to IP-based location:", error.message);

            $.getJSON('https://geolocation-db.com/json/')
                .done(function (location) {
                    // console.log("📍 Using IP-based location:", location);

                    fetch('/api/data', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify({
                            city: location.city,
                            state: location.state,
                            country: location.country_name,
                            latitude: location.latitude,
                            longitude: location.longitude,
                            source: "geolocation-db.com"
                        })
                    })
                    .then(res => res.json())
                    // .then(data => console.log('✅ Fallback location saved:', data))
                    // .catch(err => console.error('❌ Error saving fallback location:', err));
                });
        }
    );




});

document.addEventListener('visibilitychange',
    function () {
        if (document.visibilityState === "visible") {
            document.title = "Portfolio | Sehajdeep Singh";
            $("#favicon").attr("href", "assets/images/hero.jpeg");
        }
        else {
            document.title = "Come Back To Portfolio";
            $("#favicon").attr("href", "assets/images/hero.jpeg");
        }
    });


// <!-- typed js effect starts -->
var typed = new Typed(".typing-text", {
    strings: ["Frontend development", "Backend development", "Web development", "REST API"],
    loop: true,
    typeSpeed: 50,
    backSpeed: 25,
    backDelay: 500,
});
// <!-- typed js effect ends -->

async function fetchData(type = "skills") {
    let response
    type === "skills" ?
        response = await fetch("skills.json")
        :
        response = await fetch("./projects/projects.json")
    const data = await response.json();
    return data;
}

function showSkills(skills) {
    let skillsContainer = document.getElementById("skillsContainer");
    let skillHTML = "";
    skills.forEach(skill => {
        skillHTML += `
        <div class="bar">
            <div class="info">
                <img src=${skill.icon} alt="skill" />
                <span>${skill.name}</span>
            </div>
        </div>`
    });
    skillsContainer.innerHTML = skillHTML;
}

function showProjects(projects) {
    let projectsContainer = document.querySelector("#work .box-container");
    let projectHTML = "";
    let projectCnt = 0;
    projects.forEach(project => {
        projectCnt++;
        if (projectCnt >= 7)
            return;
        projectHTML += `
        <div class="box tilt" style="padding-left: 20px;">
            <img draggable="false" src="/assets/images/projects/${project.image}.png" alt="project" />
            <div class="content">
                <div class="tag">
                    <h3>${project.name}</h3>
                </div>
                <div class="desc">
                    <p>${project.desc}</p>
                    <div class="btns">
                        <a href="${project.links.view}" class="btn" target="_blank"><i class="fas fa-eye"></i> View</a>
                        <a href="${project.links.code}" class="btn" target="_blank">Code <i class="fas fa-code"></i></a>
                    </div>
                </div>
            </div>
        </div>`
    });
    projectsContainer.innerHTML = projectHTML;

    // <!-- tilt js effect starts -->
    VanillaTilt.init(document.querySelectorAll(".tilt"), {
        max: 15,
    });
    // <!-- tilt js effect ends -->

    /* ===== SCROLL REVEAL ANIMATION ===== */
    const srtop = ScrollReveal({
        origin: 'top',
        distance: '80px',
        duration: 1000,
        reset: true
    });

    /* SCROLL PROJECTS */
    srtop.reveal('.work .box', { interval: 200 });

}

fetchData().then(data => {
    showSkills(data);
});

fetchData("projects").then(data => {
    showProjects(data);
});

// <!-- tilt js effect starts -->
VanillaTilt.init(document.querySelectorAll(".tilt"), {
    max: 15,
});
// <!-- tilt js effect ends -->


// pre loader start
// function loader() {
//     document.querySelector('.loader-container').classList.add('fade-out');
// }
// function fadeOut() {
//     setInterval(loader, 500);
// }
// window.onload = fadeOut;
// pre loader end

// disable developer mode
document.onkeydown = function (e) {
    if (e.keyCode == 123) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'I'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'C'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.shiftKey && e.keyCode == 'J'.charCodeAt(0)) {
        return false;
    }
    if (e.ctrlKey && e.keyCode == 'U'.charCodeAt(0)) {
        return false;
    }
}

// Start of Tawk.to Live Chat
var Tawk_API = Tawk_API || {}, Tawk_LoadStart = new Date();
(function () {
    var s1 = document.createElement("script"), s0 = document.getElementsByTagName("script")[0];
    s1.async = true;
    s1.src = 'https://embed.tawk.to/6643c3d507f59932ab3f929d/1htsb9uo9';
    s1.charset = 'UTF-8';
    s1.setAttribute('crossorigin', '*');
    s0.parentNode.insertBefore(s1, s0);
})();
// End of Tawk.to Live Chat


/* ===== SCROLL REVEAL ANIMATION ===== */
const srtop = ScrollReveal({
    origin: 'top',
    distance: '80px',
    duration: 800,
    reset: false,
    viewOffset: { top: 100, bottom: 0 } // reveal as section nears
});

/* SCROLL HOME */
srtop.reveal('.home .content h3');
srtop.reveal('.home .content p');
srtop.reveal('.home .content .btn');
srtop.reveal('.home .image');
srtop.reveal('.home .linkedin');
srtop.reveal('.home .github');
srtop.reveal('.home .twitter');
srtop.reveal('.home .telegram');
srtop.reveal('.home .instagram');
srtop.reveal('.home .leetcode');
srtop.reveal('.home .dev');

/* SCROLL ABOUT */
srtop.reveal('.about .content h3');
srtop.reveal('.about .content .tag');
srtop.reveal('.about .content p');
srtop.reveal('.about .content .box-container');
srtop.reveal('.about .content .resumebtn');

/* SCROLL SKILLS */
srtop.reveal('.skills .container');
srtop.reveal('.skills .container .bar');

/* SCROLL EDUCATION */
srtop.reveal('.education .box');

/* SCROLL PROJECTS */
srtop.reveal('.work .box');

/* SCROLL EXPERIENCE */
srtop.reveal('.experience .timeline');
srtop.reveal('.experience .timeline .container');

/* SCROLL CONTACT */
srtop.reveal('.contact .container');
srtop.reveal('.contact .container .form-group');
