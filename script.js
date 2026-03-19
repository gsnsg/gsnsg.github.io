// ====== Custom Cursor Glow ======
const cursorGlow = document.getElementById('cursorGlow');
document.addEventListener('mousemove', (e) => {
    // Only show on desktop
    if(window.innerWidth > 768) {
        cursorGlow.style.opacity = '1';
        cursorGlow.style.left = `${e.clientX}px`;
        cursorGlow.style.top = `${e.clientY}px`;
    }
});

document.addEventListener('mouseleave', () => {
    cursorGlow.style.opacity = '0';
});

// ====== Scroll Progress & Navbar ======
const scrollProgress = document.querySelector('.scroll-progress');
const navbar = document.querySelector('.navbar');

window.addEventListener('scroll', () => {
    // Progress bar
    const scrollTop = window.scrollY;
    const docHeight = document.body.offsetHeight;
    const winHeight = window.innerHeight;
    const scrollPercent = scrollTop / (docHeight - winHeight);
    const scrollPercentRounded = Math.round(scrollPercent * 100);
    scrollProgress.style.width = `${scrollPercentRounded}%`;

    // Navbar shadow
    if (scrollTop > 50) {
        navbar.classList.add('scrolled');
    } else {
        navbar.classList.remove('scrolled');
    }
});

// ====== Reveal Animations on Scroll ======
const revealElements = document.querySelectorAll('.reveal, .reveal-hero, .reveal-delay');

const revealOptions = {
    threshold: 0.15,
    rootMargin: "0px 0px -50px 0px"
};

const revealOnScroll = new IntersectionObserver((entries, observer) => {
    entries.forEach(entry => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add('active');
        observer.unobserve(entry.target);
    });
}, revealOptions);

// Trigger initial hero animations quickly
setTimeout(() => {
    document.querySelector('.reveal-hero')?.classList.add('active');
    document.querySelectorAll('.reveal-delay').forEach(el => el.classList.add('active'));
}, 100);

revealElements.forEach(el => {
    if(!el.classList.contains('reveal-hero') && !el.classList.contains('reveal-delay')) {
        revealOnScroll.observe(el);
    }
});

// ====== Job Tabs ======
const jobBtns = document.querySelectorAll('.job-btn');
const jobPanels = document.querySelectorAll('.job-panel');

jobBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        // Remove active class from all
        jobBtns.forEach(b => b.classList.remove('active'));
        jobPanels.forEach(p => p.classList.remove('active'));

        // Add active class to clicked
        btn.classList.add('active');
        const targetId = btn.getAttribute('data-job');
        document.getElementById(targetId).classList.add('active');
    });
});

// ====== Command (Cmd+K) Menu ======
const cmdModal = document.getElementById('cmdModal');
const cmdBtn = document.getElementById('cmdKBtn');
const cmdInput = document.getElementById('cmdInput');
const cmdItems = document.querySelectorAll('.cmd-item');
let selectedIndex = 0;

function toggleCmdModal() {
    cmdModal.classList.toggle('active');
    if (cmdModal.classList.contains('active')) {
        cmdInput.value = '';
        cmdInput.focus();
        filterCmdItems('');
        updateSelection(0);
        document.body.style.overflow = 'hidden';
    } else {
        document.body.style.overflow = '';
    }
}

// Open modal on Cmd+K or Ctrl+K or Button Click
document.addEventListener('keydown', (e) => {
    if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        toggleCmdModal();
    }
    
    // Escape to close
    if (e.key === 'Escape' && cmdModal.classList.contains('active')) {
        toggleCmdModal();
    }
});

cmdBtn.addEventListener('click', toggleCmdModal);
document.querySelector('.cmd-backdrop').addEventListener('click', toggleCmdModal);

// Modal Navigation logic
cmdInput.addEventListener('keydown', (e) => {
    const visibleItems = Array.from(cmdItems).filter(item => item.style.display !== 'none');
    
    if (e.key === 'ArrowDown') {
        e.preventDefault();
        updateSelection(Math.min(selectedIndex + 1, visibleItems.length - 1), visibleItems);
    } else if (e.key === 'ArrowUp') {
        e.preventDefault();
        updateSelection(Math.max(selectedIndex - 0, 0), visibleItems);
        // Fix for up arrow
        updateSelection(Math.max(selectedIndex - 1, 0), visibleItems);
    } else if (e.key === 'Enter') {
        e.preventDefault();
        if(visibleItems[selectedIndex]) {
            executeCmd(visibleItems[selectedIndex]);
        }
    }
});

cmdInput.addEventListener('input', (e) => {
    filterCmdItems(e.target.value.toLowerCase());
    updateSelection(0);
});

cmdItems.forEach((item, index) => {
    item.addEventListener('mouseenter', () => {
        const visibleItems = Array.from(cmdItems).filter(el => el.style.display !== 'none');
        updateSelection(visibleItems.indexOf(item), visibleItems);
    });
    item.addEventListener('click', () => executeCmd(item));
});

function updateSelection(index, visibleList) {
    const vList = visibleList || Array.from(cmdItems).filter(item => item.style.display !== 'none');
    vList.forEach(item => item.classList.remove('selected'));
    selectedIndex = index;
    if(vList[index]) {
        vList[index].classList.add('selected');
        vList[index].scrollIntoView({ block: 'nearest' });
    }
}

function filterCmdItems(query) {
    cmdItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(query)) {
            item.style.display = 'flex';
        } else {
            item.style.display = 'none';
        }
    });
}

function executeCmd(item) {
    const action = item.getAttribute('data-action');
    
    if (action === 'scroll') {
        const target = item.getAttribute('data-target');
        const element = document.querySelector(target);
        toggleCmdModal(); // close modal
        setTimeout(() => {
            element.scrollIntoView({ behavior: 'smooth' });
        }, 100);
    } else if (action === 'link') {
        const url = item.getAttribute('data-url');
        toggleCmdModal();
        if(url.startsWith('mailto')) {
            window.location.href = url;
        } else {
            window.open(url, '_blank');
        }
    }
}
