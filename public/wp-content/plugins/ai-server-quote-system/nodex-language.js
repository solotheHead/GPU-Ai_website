/* NodeX language preference: local browser state only, never a redirect. */
(function () {
  'use strict';

  var preferenceKey = 'nodex_language_preference';
  var sessionKey = 'nodex_language_prompt_dismissed';

  function readStorage(type, key) {
    try { return window[type].getItem(key); } catch (error) { return null; }
  }

  function writeStorage(type, key, value) {
    try { window[type].setItem(key, value); } catch (error) { /* Private browsing/storage policy: the links still work. */ }
  }

  function languageCode(value) {
    return String(value || '').toLowerCase().split(/[-_]/)[0];
  }

  function ready() {
    if (document.documentElement.hasAttribute('data-nx-language-ready')) return;
    document.documentElement.setAttribute('data-nx-language-ready', 'true');

    var supported = ['en', 'bg', 'de'];
    var prompts = document.querySelectorAll('[data-nx-language-prompt]');
    var currentLanguage = languageCode(document.documentElement.lang);
    var dismissed = readStorage('sessionStorage', sessionKey) === '1';
    var preference = readStorage('localStorage', preferenceKey);
    var browserLanguages = navigator.languages && navigator.languages.length ? navigator.languages : [navigator.language];
    var scheduled = false;

    function promptTarget(element) {
      return languageCode(element.getAttribute('data-nx-language-target') || element.getAttribute('lang') || 'bg');
    }

    // At most one suggestion: a saved non-English choice first, otherwise the first browser language
    // (in the visitor's order of preference) that has a translated version of this page.
    function choosePrompt() {
      var byLanguage = {};
      for (var i = 0; i < prompts.length; i += 1) {
        prompts[i].hidden = true;
        byLanguage[promptTarget(prompts[i])] = prompts[i];
      }
      if (preference && preference !== 'en') return byLanguage[preference] || null;
      for (var j = 0; j < browserLanguages.length; j += 1) {
        var code = languageCode(browserLanguages[j]);
        if (byLanguage[code]) return byLanguage[code];
      }
      return null;
    }
    var prompt = choosePrompt();

    function remember(language) {
      if (supported.indexOf(language) === -1) return;
      writeStorage('localStorage', preferenceKey, language);
    }

    function focusLanguageLink(language) {
      var links = document.querySelectorAll('.nx-language-switch a[href]');
      for (var i = 0; i < links.length; i += 1) {
        if (languageCode(links[i].getAttribute('hreflang') || links[i].getAttribute('lang')) === language) {
          try { links[i].focus({ preventScroll: true }); } catch (error) { links[i].focus(); }
          return;
        }
      }
    }

    function hidePrompt(restoreFocus) {
      dismissed = true;
      writeStorage('sessionStorage', sessionKey, '1');
      if (!prompt) return;
      var hadFocus = prompt.contains(document.activeElement);
      prompt.hidden = true;
      document.documentElement.classList.remove('nx-language-prompt-open');
      if (restoreFocus && hadFocus) focusLanguageLink(currentLanguage || 'en');
    }

    document.addEventListener('click', function (event) {
      if (!event.target || !event.target.closest) return;
      var switchLink = event.target.closest('.nx-language-switch a[href]');
      if (switchLink) {
        remember(languageCode(switchLink.getAttribute('hreflang') || switchLink.getAttribute('lang')));
        hidePrompt(false);
        return; // The anchor performs its normal navigation, including modified clicks.
      }
      if (!prompt || !prompt.contains(event.target)) return;
      if (event.target.closest('[data-nx-language-accept]')) {
        remember(promptTarget(prompt));
        hidePrompt(false);
      } else if (event.target.closest('[data-nx-language-dismiss]')) {
        remember('en');
        hidePrompt(true);
      }
    });

    // Escape dismisses only this session; it does not overwrite a saved language.
    document.addEventListener('keydown', function (event) {
      if (event.key === 'Escape' && prompt && !prompt.hidden) hidePrompt(true);
    });

    if (!prompt) return;
    prompt.hidden = true;
    prompt.setAttribute('lang', promptTarget(prompt));
    prompt.setAttribute('role', 'region');
    if (!prompt.hasAttribute('aria-label')) prompt.setAttribute('aria-label', 'Language');

    // The server renders the suggestion on English pages only; keep that guard here too.
    if (currentLanguage !== 'en' || dismissed || preference === 'en') return;

    // Never cover the main purchase/enquiry control. On small screens the prompt
    // yields as the visitor reaches the action or starts working in a form.
    function protectControls() {
      scheduled = false;
      if (prompt.hidden) return;
      var box = prompt.getBoundingClientRect();
      var controls = document.querySelectorAll('.single_add_to_cart_button, .composite_add_to_cart_button, .aiq-submit, #place_order, .wc-block-components-checkout-place-order-button');
      for (var i = 0; i < controls.length; i += 1) {
        var target = controls[i].getBoundingClientRect();
        if (target.width && target.height && target.left < box.right && target.right > box.left && target.top < box.bottom && target.bottom > box.top) {
          hidePrompt(false);
          break;
        }
      }
    }

    function scheduleCheck() {
      if (scheduled || prompt.hidden) return;
      scheduled = true;
      window.requestAnimationFrame(protectControls);
    }

    // Wider screens: the default bottom-left corner can cover the page's first call to action (the home hero
    // buttons at 1366x768). Then use the bottom-right corner, unless that covers one too. Decided when the
    // suggestion opens and on resize, never while scrolling, so it does not jump between corners.
    function covers(box, element) {
      var r = element.getBoundingClientRect();
      return r.width && r.height && r.left < box.right && r.right > box.left && r.top < box.bottom && r.bottom > box.top;
    }
    function coversAction() {
      var box = prompt.getBoundingClientRect();
      var actions = document.querySelectorAll('.nx-button, .nodex-button, .nx-text-link, .nx-hero a, .nodex-hero a');
      for (var i = 0; i < actions.length; i += 1) {
        if (!prompt.contains(actions[i]) && covers(box, actions[i])) return true;
      }
      return false;
    }
    function place() {
      if (prompt.hidden) return;
      prompt.classList.remove('nx-language-prompt-right');
      if (window.innerWidth <= 700 || !coversAction()) return;
      prompt.classList.add('nx-language-prompt-right');
      if (coversAction()) prompt.classList.remove('nx-language-prompt-right');
    }

    prompt.hidden = false;
    document.documentElement.classList.add('nx-language-prompt-open');
    place();
    protectControls();
    window.addEventListener('scroll', scheduleCheck, { passive: true });
    window.addEventListener('resize', function () { place(); scheduleCheck(); }, { passive: true });
    document.addEventListener('focusin', function (event) {
      if (!prompt.hidden && !prompt.contains(event.target) && event.target.closest && event.target.closest('form')) hidePrompt(false);
    });
    window.addEventListener('storage', function (event) {
      if (event.key === preferenceKey && event.newValue === 'en') hidePrompt(true);
    });
    // No autofocus, modal role, scroll lock or change to the current URL.
  }

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', ready);
  else ready();
}());
