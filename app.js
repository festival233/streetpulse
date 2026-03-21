document.addEventListener('DOMContentLoaded', () => {
  const form = document.querySelector('[data-qualify-form]');
  const output = document.querySelector('[data-qualification-output]');

  if (!form || !output) return;

  form.addEventListener('submit', async (event) => {
    event.preventDefault();

    const budget = (form.querySelector('[name="budget"]')?.value || '').toLowerCase();
    const timeline = (form.querySelector('[name="timeline"]')?.value || '').toLowerCase();
    const need = (form.querySelector('[name="need"]')?.value || '').toLowerCase();
    const company = form.querySelector('[name="company"]')?.value || '';
    const email = form.querySelector('[name="email"]')?.value || '';
    const notes = form.querySelector('[name="notes"]')?.value || '';

    let tier = 'AI Data Starter';
    if (budget.includes('50') || budget.includes('100') || need.includes('api') || need.includes('recurring')) {
      tier = 'Enterprise Intelligence';
    }
    if (budget.includes('250') || need.includes('government') || need.includes('national')) {
      tier = 'Sovereign Command';
    }
    if ((budget.includes('15') || need.includes('training') || timeline.includes('30')) && tier === 'AI Data Starter') {
      tier = 'AI Training Dataset';
    }

    output.innerHTML = `<div class="notice"><strong>Recommended path:</strong> ${tier}. Your request sounds like a fit for a structured proposal with dataset scope, licensing, delivery format, and timeline.</div>`;

    try {
      const response = await fetch('https://formsubmit.co/ajax/info@streetpulse.ai', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json'
        },
        body: JSON.stringify({
          _subject: `Dataset request from ${company || 'Unknown company'}`,
          company,
          email,
          need: form.querySelector('[name="need"]')?.value || '',
          budget: form.querySelector('[name="budget"]')?.value || '',
          timeline: form.querySelector('[name="timeline"]')?.value || '',
          notes,
          recommended_tier: tier
        })
      });

      if (!response.ok) {
        throw new Error('Email request failed.');
      }

      output.insertAdjacentHTML(
        'beforeend',
        '<div class="notice" style="margin-top:12px">Thanks — your request has been sent to info@streetpulse.ai.</div>'
      );
      form.reset();
    } catch (error) {
      output.insertAdjacentHTML(
        'beforeend',
        '<div class="notice" style="margin-top:12px">We could not send your request automatically. Please email info@streetpulse.ai directly.</div>'
      );
    }
  });
});
