const iframe = document.querySelector('iframe[name="survey-iframe-SI_8Jna9K5PTcSmf3w"]');

const originalStates = new Map();

const applyRestrictions = () => {
  const elementsToHide = Array.from(document.querySelectorAll('body > *'))
    .filter(element => element !== iframe && !iframe.contains(element));

  elementsToHide.forEach(element => {
    originalStates.set(element, {
      ariaHidden: element.getAttribute('aria-hidden'),
      tabindex: element.getAttribute('tabindex')
    });
    element.setAttribute('aria-hidden', 'true');
    element.setAttribute('tabindex', '-1');
  });
  window.__originalAccessibilityStates = originalStates;
};

const removeRestrictions = () => {
  const storedStates = window.__originalAccessibilityStates;
  if (storedStates) {
    storedStates.forEach((state, element) => {
      if (state.ariaHidden === null) {
        element.removeAttribute('aria-hidden');
      } else {
        element.setAttribute('aria-hidden', state.ariaHidden);
      }

      if (state.tabindex === null) {
        element.removeAttribute('tabindex');
      } else {
        element.setAttribute('tabindex', state.tabindex);
      }
    });
    delete window.__originalAccessibilityStates; // Clean up the stored states
  }
};

const observer = new MutationObserver((mutationsList, observer) => {
  for (const mutation of mutationsList) {
    // Check for style changes on the iframe to detect visibility
    if (mutation.target === iframe && mutation.type === 'attributes' && mutation.attributeName === 'style') {
      const display = window.getComputedStyle(iframe).display;
      const visibility = window.getComputedStyle(iframe).visibility;

      if (display !== 'none' && visibility !== 'hidden') {
        // Iframe is now visible, apply restrictions
        applyRestrictions();
      } else {
        // Iframe is hidden, remove restrictions (if they were applied)
        // This handles cases where the iframe might be hidden without being removed
        removeRestrictions();
      }
    }

    // Check for removal of the iframe from its parent to detect closure
    if (mutation.type === 'childList') {
      mutation.removedNodes.forEach(removedNode => {
        if (removedNode === iframe) {
          // The iframe was removed, execute cleanup
          removeRestrictions();
          observer.disconnect(); // Stop observing once the iframe is removed
        }
      });
    }
  }
});

// Start observing the iframe's style attribute and its parent's child list
if (iframe.parentElement) {
  observer.observe(iframe, { attributes: true, attributeFilter: ['style'] });
  observer.observe(iframe.parentElement, { childList: true });
}


// Initial check in case the iframe is already visible on load
const initialDisplay = window.getComputedStyle(iframe).display;
const initialVisibility = window.getComputedStyle(iframe).visibility;
if (initialDisplay !== 'none' && initialVisibility !== 'hidden') {
  applyRestrictions();
}


const data = {
  message: "MutationObserver attached to iframe and its parent to handle visibility and removal."
};
