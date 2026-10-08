document.addEventListener('DOMContentLoaded', () => {
	const internalLinks = document.querySelectorAll('a[href^="#"]');
	const navLinks = document.querySelectorAll('.nav-links a');
	const sections = document.querySelectorAll('section[id]');
	const footerYear = document.querySelector('footer p');
	const tiltTargets = document.querySelectorAll(
		'.portrait-frame, .education-card, .project-card, .skill-card'
	);
	const canTilt = window.matchMedia('(hover: hover) and (pointer: fine)');

	if (canTilt.matches) {
		tiltTargets.forEach((target) => {
			target.classList.add('tilt-enabled');

			target.addEventListener('pointermove', (event) => {
				const bounds = target.getBoundingClientRect();
				const x = (event.clientX - bounds.left) / bounds.width;
				const y = (event.clientY - bounds.top) / bounds.height;
				const tiltX = (x - 0.5) * 12;
				const tiltY = (0.5 - y) * 12;

				target.classList.add('is-pointed');
				target.style.setProperty('--tilt-x', `${tiltX.toFixed(2)}deg`);
				target.style.setProperty('--tilt-y', `${tiltY.toFixed(2)}deg`);
				target.style.setProperty('--spotlight-x', `${(x * 100).toFixed(1)}%`);
				target.style.setProperty('--spotlight-y', `${(y * 100).toFixed(1)}%`);
			});

			target.addEventListener('pointerleave', () => {
				target.classList.remove('is-pointed');
				target.style.removeProperty('--tilt-x');
				target.style.removeProperty('--tilt-y');
				target.style.removeProperty('--spotlight-x');
				target.style.removeProperty('--spotlight-y');
			});
		});
	}

	const setActiveLink = (sectionId) => {
		navLinks.forEach((link) => {
			const isActive = link.getAttribute('href') === `#${sectionId}`;
			link.classList.toggle('active', isActive);

			if (isActive) {
				link.setAttribute('aria-current', 'page');
			} else {
				link.removeAttribute('aria-current');
			}
		});
	};

	internalLinks.forEach((link) => {
		link.addEventListener('click', (event) => {
			const targetId = link.getAttribute('href');
			const target = document.querySelector(targetId);

			if (!target) {
				return;
			}

			event.preventDefault();
			target.scrollIntoView({ behavior: 'smooth', block: 'start' });
			history.pushState(null, '', targetId);

			if (targetId !== '#top') {
				setActiveLink(targetId.slice(1));
			}
		});
	});

	const sectionObserver = new IntersectionObserver(
		(entries) => {
			entries.forEach((entry) => {
				if (entry.isIntersecting) {
					setActiveLink(entry.target.id);
				}
			});
		},
		{ rootMargin: '-25% 0px -60% 0px' }
	);

	sections.forEach((section) => sectionObserver.observe(section));

	if (footerYear) {
		footerYear.textContent = `© ${new Date().getFullYear()} Harman Singh`;
	}
});
