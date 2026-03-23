document.addEventListener('DOMContentLoaded', () => {
  const qualifyForm = document.querySelector('[data-qualify-form]');
  const qualifyOutput = document.querySelector('[data-qualification-output]');

  if (qualifyForm && qualifyOutput) {
    qualifyForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const budget = (qualifyForm.querySelector('[name="budget"]')?.value || '').toLowerCase();
      const timeline = (qualifyForm.querySelector('[name="timeline"]')?.value || '').toLowerCase();
      const need = (qualifyForm.querySelector('[name="need"]')?.value || '').toLowerCase();
      const company = qualifyForm.querySelector('[name="company"]')?.value || '';
      const email = qualifyForm.querySelector('[name="email"]')?.value || '';
      const notes = qualifyForm.querySelector('[name="notes"]')?.value || '';

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

      qualifyOutput.innerHTML = `<div class="notice"><strong>Recommended path:</strong> ${tier}. Your request sounds like a fit for a structured proposal with dataset scope, licensing, delivery format, and timeline.</div>`;

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
            need: qualifyForm.querySelector('[name="need"]')?.value || '',
            budget: qualifyForm.querySelector('[name="budget"]')?.value || '',
            timeline: qualifyForm.querySelector('[name="timeline"]')?.value || '',
            notes,
            recommended_tier: tier
          })
        });

        if (!response.ok) {
          throw new Error('Email request failed.');
        }

        qualifyOutput.insertAdjacentHTML(
          'beforeend',
          '<div class="notice" style="margin-top:12px">Thanks — your request has been sent to info@streetpulse.ai.</div>'
        );
        qualifyForm.reset();
      } catch (error) {
        qualifyOutput.insertAdjacentHTML(
          'beforeend',
          '<div class="notice" style="margin-top:12px">We could not send your request automatically. Please email info@streetpulse.ai directly.</div>'
        );
      }
    });
  }

  const pilotForm = document.querySelector('[data-pilot-form]');
  const pilotOutput = document.querySelector('[data-pilot-output]');

  if (pilotForm && pilotOutput) {
    pilotForm.addEventListener('submit', async (event) => {
      event.preventDefault();

      const formData = {
        company: pilotForm.querySelector('[name="company"]')?.value || '',
        industry: pilotForm.querySelector('[name="industry"]')?.value || '',
        dataset_needed: pilotForm.querySelector('[name="dataset_needed"]')?.value || '',
        geography_needed: pilotForm.querySelector('[name="geography_needed"]')?.value || '',
        ai_use_case: pilotForm.querySelector('[name="ai_use_case"]')?.value || '',
        annotation_requirements: pilotForm.querySelector('[name="annotation_requirements"]')?.value || '',
        budget_range: pilotForm.querySelector('[name="budget_range"]')?.value || '',
        timeline: pilotForm.querySelector('[name="timeline"]')?.value || '',
        work_email: pilotForm.querySelector('[name="work_email"]')?.value || ''
      };

      pilotOutput.innerHTML = '<div class="notice">Submitting your pilot dataset request...</div>';

      try {
        const response = await fetch('https://formsubmit.co/ajax/info@streetpulse.ai', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json'
          },
          body: JSON.stringify({
            _subject: `Pilot dataset request from ${formData.company || 'Unknown company'}`,
            ...formData
          })
        });

        if (!response.ok) {
          throw new Error('Pilot request failed.');
        }

        pilotOutput.innerHTML = '<div class="notice">Thank you.<br>StreetPulse will respond within 24 hours with dataset preview materials.</div>';
        pilotForm.reset();
      } catch (error) {
        pilotOutput.innerHTML = '<div class="notice">We could not send your request automatically. Please email info@streetpulse.ai directly.</div>';
      }
    });
  }
});
