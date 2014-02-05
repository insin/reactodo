0.2.0 (in development)
----------------------

* Added session management to the settings screen.

* Sessions can now be switched on the fly without reloading the page.

* Leading and trailing whitespace trimming is now more&hellip; aggressive.

* Session switcher `<input>` now uses a `<datalist>` to suggest completions for
  existing session names from `localStorage`.

* The active session name is now displayed in `<title>`.

* Style carried over from copy &amp; paste operations is now stripped out on
  save.

* **Backwards-incompatible change** &ndash; linebreaks are now stored as `<br>`
  rather than `\n` &ndash; long lines will now wrap.

0.1.0 &ndash; 2014-01-28
------------------------

* Initial release.